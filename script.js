// ===============================
// MARKET PULSE
// ===============================

// Major market indexes
const indexes = [
    {
        ticker: "SPX",
        name: "S&P 500",
        price: "7,764.70",
        change: "+1.50%",
        direction: "up"
    },
    {
        ticker: "IXIC",
        name: "Nasdaq Composite",
        price: "27,122.09",
        change: "+2.30%",
        direction: "up"
    },
    {
        ticker: "DJI",
        name: "Dow Jones",
        price: "52,048.83",
        change: "+0.70%",
        direction: "up"
    },
    {
        ticker: "FTSE",
        name: "FTSE 100",
        price: "—",
        change: "API coming soon",
        direction: "neutral"
    }
];


// Stocks we are tracking
const stocks = [
    {
        ticker: "NVDA",
        name: "NVIDIA",
        price: "$229.69",
        change: "+0.40%",
        direction: "up"
    },
    {
        ticker: "GOOGL",
        name: "Alphabet",
        price: "—",
        change: "API coming soon",
        direction: "neutral"
    },
    {
        ticker: "AAPL",
        name: "Apple",
        price: "$340.32",
        change: "+0.44%",
        direction: "up"
    },
    {
        ticker: "MSFT",
        name: "Microsoft",
        price: "$499.06",
        change: "-0.50%",
        direction: "down"
    },
    {
        ticker: "AMZN",
        name: "Amazon",
        price: "—",
        change: "API coming soon",
        direction: "neutral"
    },
    {
        ticker: "TSLA",
        name: "Tesla",
        price: "$379.93",
        change: "+1.10%",
        direction: "up"
    }
];


// ===============================
// CREATE MARKET CARDS
// ===============================

function renderMarkets(data, containerId) {

    const container = document.getElementById(containerId);

    container.innerHTML = "";

    data.forEach(market => {

        const card = document.createElement("div");

        card.className = "market-card";

        card.innerHTML = `
            <div class="ticker">
                ${market.ticker}
            </div>

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


// Render indexes
renderMarkets(indexes, "indexes");

// Render stocks
renderMarkets(stocks, "stocks");


// ===============================
// CURRENT DATE
// ===============================

const dateElement = document.getElementById("date");

const today = new Date();

dateElement.textContent =
    new Intl.DateTimeFormat("en-GB", {
        dateStyle: "full"
    }).format(today);
