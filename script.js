// ===============================
// MARKET PULSE
// ===============================

// Major market indexes
const indexes = [
    {
        ticker: "SPX",
        name: "S&P 500",
        price: "—",
        change: "Coming soon",
        direction: "neutral"
    },
    {
        ticker: "IXIC",
        name: "Nasdaq Composite",
        price: "—",
        change: "Coming soon",
        direction: "neutral"
    },
    {
        ticker: "DJI",
        name: "Dow Jones",
        price: "—",
        change: "Coming soon",
        direction: "neutral"
    },
    {
        ticker: "FTSE",
        name: "FTSE 100",
        price: "—",
        change: "Coming soon",
        direction: "neutral"
    }
];

// Stocks we are tracking
const stocks = [
    {
        ticker: "NVDA",
        name: "NVIDIA",
        price: "—",
        change: "Loading...",
        direction: "neutral"
    },
    {
        ticker: "GOOGL",
        name: "Alphabet",
        price: "—",
        change: "Loading...",
        direction: "neutral"
    },
    {
        ticker: "AAPL",
        name: "Apple",
        price: "—",
        change: "Loading...",
        direction: "neutral"
    },
    {
        ticker: "MSFT",
        name: "Microsoft",
        price: "—",
        change: "Loading...",
        direction: "neutral"
    },
    {
        ticker: "AMZN",
        name: "Amazon",
        price: "—",
        change: "Loading...",
        direction: "neutral"
    },
    {
        ticker: "TSLA",
        name: "Tesla",
        price: "—",
        change: "Loading...",
        direction: "neutral"
    }
];

// ===============================
// CREATE MARKET CARDS
// ===============================

function renderMarkets(data, containerId) {
    const container = document.getElementById(containerId);

    if (!container) return;

    container.innerHTML = "";

    data.forEach(market => {
        const card = document.createElement("div");

        card.className = "market-card";

        card.innerHTML = `
            <div class="ticker">${market.ticker}</div>

            <div class="market-name">
                ${market.name}
            </div>

            <div class="market-price">
                ${market.price}
            </div>

            <div class="market-change ${market.direction}">
                ${market.change}
            </div>
        `;

        container.appendChild(card);
    });
}

// ===============================
// LOAD LIVE STOCK DATA
// ===============================

async function loadLiveData() {

    try {

        const response = await fetch("data.json");

        if (!response.ok) {
            throw new Error("Could not load market data.");
        }

        const liveData = await response.json();

        stocks.forEach(stock => {

            const live = liveData[stock.ticker];

            if (!live) return;

            // Price
            if (live.price && live.price !== "—") {
                stock.price =
                    `$${Number(live.price).toFixed(2)}`;
            }

            // Percentage change
            if (
                live.change_percent &&
                live.change_percent !== "—"
            ) {

                stock.change = live.change_percent;

                if (live.change_percent.startsWith("+")) {
                    stock.direction = "up";
                }

                else if (live.change_percent.startsWith("-")) {
                    stock.direction = "down";
                }

                else {
                    stock.direction = "neutral";
                }
            }

        });

        console.log("Market data loaded successfully.");

    }

    catch (error) {

        console.error(
            "Market data could not be loaded:",
            error
        );

    }

    // Render the dashboard
    renderMarkets(indexes, "indexes");
    renderMarkets(stocks, "stocks");
}

// ===============================
// CURRENT DATE
// ===============================

const dateElement = document.getElementById("date");

const today = new Date();

dateElement.textContent =
    new Intl.DateTimeFormat("en-GB", {
        dateStyle: "full"
    }).format(today);

// ===============================
// START DASHBOARD
// ===============================

loadLiveData();
