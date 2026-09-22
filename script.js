// ===============================
// MARKET PULSE V2
// ===============================

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

const stocks = [
    { ticker: "NVDA", name: "NVIDIA", price: "—", change: "Loading...", direction: "neutral" },
    { ticker: "GOOGL", name: "Alphabet", price: "—", change: "Loading...", direction: "neutral" },
    { ticker: "AAPL", name: "Apple", price: "—", change: "Loading...", direction: "neutral" },
    { ticker: "MSFT", name: "Microsoft", price: "—", change: "Loading...", direction: "neutral" },
    { ticker: "AMZN", name: "Amazon", price: "—", change: "Loading...", direction: "neutral" },
    { ticker: "TSLA", name: "Tesla", price: "—", change: "Loading...", direction: "neutral" }
];

let liveData = {};

// ===============================
// RENDER MARKET CARDS
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

            <div class="view-chart">
                View chart →
            </div>
        `;

        // Make stock cards clickable
        if (containerId === "stocks") {
            card.addEventListener("click", () => {
                openChart(market.ticker);
            });

            card.style.cursor = "pointer";
        }

        container.appendChild(card);
    });
}

// ===============================
// LOAD MARKET DATA
// ===============================

async function loadLiveData() {

    try {

        const response = await fetch("data.json");

        if (!response.ok) {
            throw new Error("Could not load data.json");
        }

        liveData = await response.json();

        stocks.forEach(stock => {

            const live = liveData[stock.ticker];

            if (!live) return;

            if (live.price && live.price !== "—") {
                stock.price =
                    `$${Number(live.price).toFixed(2)}`;
            }

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

    }

    catch (error) {

        console.error(
            "Market data could not be loaded:",
            error
        );

    }

    renderMarkets(indexes, "indexes");
    renderMarkets(stocks, "stocks");
}

// ===============================
// CREATE CHART MODAL
// ===============================

function createChartModal() {

    const modal = document.createElement("div");

    modal.id = "chart-modal";

    modal.innerHTML = `
        <div class="chart-overlay"></div>

        <div class="chart-window">

            <button
                class="chart-close"
                id="chart-close"
                aria-label="Close chart"
            >
                ×
            </button>

            <div class="chart-header">

                <div>
                    <div class="chart-ticker" id="chart-ticker">
                        —
                    </div>

                    <h2 id="chart-name">
                        —
                    </h2>
                </div>

                <div class="chart-stats">

                    <div>
                        <span>Price</span>
                        <strong id="chart-price">—</strong>
                    </div>

                    <div>
                        <span>Daily change</span>
                        <strong id="chart-change">—</strong>
                    </div>

                </div>

            </div>

            <div class="chart-controls">
                <button class="chart-period active">
                    30D
                </button>
            </div>

            <div class="chart-container">
                <canvas id="price-chart"></canvas>
            </div>

            <div class="chart-footer">
                Historical daily closing prices · Market Pulse
            </div>

        </div>
    `;

    document.body.appendChild(modal);

    document
        .getElementById("chart-close")
        .addEventListener("click", closeChart);

    document
        .querySelector(".chart-overlay")
        .addEventListener("click", closeChart);
}

// ===============================
// OPEN CHART
// ===============================

function openChart(ticker) {

    const stock = stocks.find(
        item => item.ticker === ticker
    );

    const data = liveData[ticker];

    if (!stock || !data) {
        return;
    }

    if (!document.getElementById("chart-modal")) {
        createChartModal();
    }

    const modal =
        document.getElementById("chart-modal");

    modal.classList.add("open");

    document.getElementById("chart-ticker")
        .textContent = stock.ticker;

    document.getElementById("chart-name")
        .textContent = stock.name;

    document.getElementById("chart-price")
        .textContent = stock.price;

    const changeElement =
        document.getElementById("chart-change");

    changeElement.textContent =
        stock.change;

    changeElement.className =
        stock.direction;

    drawChart(data.history);
}

// ===============================
// DRAW 30-DAY CHART
// ===============================

function drawChart(history) {

    const canvas =
        document.getElementById("price-chart");

    const ctx =
        canvas.getContext("2d");

    const container =
        canvas.parentElement;

    const width =
        container.clientWidth;

    const height = 360;

    const ratio =
        window.devicePixelRatio || 1;

    canvas.width =
        width * ratio;

    canvas.height =
        height * ratio;

    canvas.style.width =
        `${width}px`;

    canvas.style.height =
        `${height}px`;

    ctx.scale(ratio, ratio);

    if (!history || history.length === 0) {

        ctx.font = "14px Arial";
        ctx.fillStyle = "#6b7280";
        ctx.textAlign = "center";

        ctx.fillText(
            "No historical data available",
            width / 2,
            height / 2
        );

        return;
    }

    // Alpha Vantage returns newest first.
    // Reverse so the chart runs oldest → newest.
    const points =
        [...history]
            .reverse()
            .map(item => ({
                date: item.date,
                price: Number(item.close)
            }));

    const prices =
        points.map(point => point.price);

    const minPrice =
        Math.min(...prices);

    const maxPrice =
        Math.max(...prices);

    const padding = {
        top: 25,
        right: 20,
        bottom: 40,
        left: 65
    };

    const chartWidth =
        width -
        padding.left -
        padding.right;

    const chartHeight =
        height -
        padding.top -
        padding.bottom;

    const range =
        maxPrice - minPrice || 1;

    // Background
    ctx.clearRect(
        0,
        0,
        width,
        height
    );

    // Grid lines
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = 1;

    for (let i = 0; i <= 4; i++) {

        const y =
            padding.top +
            (chartHeight / 4) * i;

        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(
            width - padding.right,
            y
        );
        ctx.stroke();

        const value =
            maxPrice -
            (range / 4) * i;

        ctx.fillStyle = "#9ca3af";
        ctx.font = "11px Arial";
        ctx.textAlign = "right";

        ctx.fillText(
            `$${value.toFixed(2)}`,
            padding.left - 10,
            y + 4
        );
    }

    // Chart line
    ctx.beginPath();

    points.forEach((point, index) => {

        const x =
            padding.left +
            (index / (points.length - 1 || 1))
            * chartWidth;

        const y =
            padding.top +
            ((maxPrice - point.price) / range)
            * chartHeight;

        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });

    ctx.strokeStyle = "#111827";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    // End point
    const last =
        points[points.length - 1];

    const lastX =
        padding.left + chartWidth;

    const lastY =
        padding.top +
        ((maxPrice - last.price) / range)
        * chartHeight;

    ctx.beginPath();

    ctx.arc(
        lastX,
        lastY,
        4,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#111827";
    ctx.fill();

    // Date labels
    ctx.fillStyle = "#9ca3af";
    ctx.font = "11px Arial";
    ctx.textAlign = "center";

    const firstDate =
        points[0].date;

    const lastDate =
        points[points.length - 1].date;

    ctx.fillText(
        firstDate,
        padding.left,
        height - 12
    );

    ctx.fillText(
        lastDate,
        width - padding.right,
        height - 12
    );
}

// ===============================
// CLOSE CHART
// ===============================

function closeChart() {

    const modal =
        document.getElementById("chart-modal");

    if (modal) {
        modal.classList.remove("open");
    }
}

// ===============================
// ESC KEY
// ===============================

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {
            closeChart();
        }

    }
);

// ===============================
// CURRENT DATE
// ===============================

const dateElement =
    document.getElementById("date");

const today =
    new Date();

dateElement.textContent =
    new Intl.DateTimeFormat(
        "en-GB",
        {
            dateStyle: "full"
        }
    ).format(today);

// ===============================
// START
// ===============================

loadLiveData();
