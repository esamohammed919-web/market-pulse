// ===============================
// MARKET PULSE
// Live market data + 30-day charts
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

            ${
                containerId === "stocks"
                    ? `<div class="view-chart">View chart →</div>`
                    : ""
            }
        `;

        // Only stocks currently have charts
        if (containerId === "stocks") {

            card.style.cursor = "pointer";

            card.addEventListener("click", () => {
                openChart(market.ticker);
            });

        }

        container.appendChild(card);
    });
}

// ===============================
// LOAD LIVE DATA
// ===============================

async function loadLiveData() {

    try {

        const response = await fetch("data.json", {
            cache: "no-store"
        });

        if (!response.ok) {
            throw new Error("Could not load data.json");
        }

        liveData = await response.json();

        console.log("Market data loaded:", liveData);

        stocks.forEach(stock => {

            const live = liveData[stock.ticker];

            if (!live) return;

            // Price
            if (
                live.price !== undefined &&
                live.price !== null &&
                live.price !== "—"
            ) {

                const price = Number(live.price);

                if (Number.isFinite(price)) {
                    stock.price = `$${price.toFixed(2)}`;
                }
            }

            // Daily change
            if (
                live.change_percent !== undefined &&
                live.change_percent !== null &&
                live.change_percent !== "—"
            ) {

                stock.change = live.change_percent;

                if (String(live.change_percent).startsWith("+")) {
                    stock.direction = "up";
                }

                else if (String(live.change_percent).startsWith("-")) {
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

    if (document.getElementById("chart-modal")) {
        return;
    }

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

                    <div
                        class="chart-ticker"
                        id="chart-ticker"
                    >
                        —
                    </div>

                    <h2 id="chart-name">
                        —
                    </h2>

                </div>

                <div class="chart-stats">

                    <div>

                        <span>
                            Price
                        </span>

                        <strong id="chart-price">
                            —
                        </strong>

                    </div>

                    <div>

                        <span>
                            Daily change
                        </span>

                        <strong id="chart-change">
                            —
                        </strong>

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

    // Close button
    const closeButton =
        document.getElementById("chart-close");

    if (closeButton) {
        closeButton.addEventListener(
            "click",
            closeChart
        );
    }

    // Click outside chart
    const overlay =
        modal.querySelector(".chart-overlay");

    if (overlay) {
        overlay.addEventListener(
            "click",
            closeChart
        );
    }
}

// ===============================
// OPEN CHART
// ===============================

function openChart(ticker) {

    const stock = stocks.find(
        item => item.ticker === ticker
    );

    const data = liveData[ticker];

    if (!stock) {
        console.error(
            "Stock not found:",
            ticker
        );
        return;
    }

    if (!data) {
        console.error(
            "No live data found for:",
            ticker
        );
        return;
    }

    if (!document.getElementById("chart-modal")) {
        createChartModal();
    }

    const modal =
        document.getElementById("chart-modal");

    // Open modal
    modal.classList.add("open");

    // Fill chart information
    document.getElementById(
        "chart-ticker"
    ).textContent = stock.ticker;

    document.getElementById(
        "chart-name"
    ).textContent = stock.name;

    document.getElementById(
        "chart-price"
    ).textContent = stock.price;

    const changeElement =
        document.getElementById("chart-change");

    changeElement.textContent =
        stock.change;

    changeElement.className =
        stock.direction;

    // IMPORTANT:
    // Wait until the modal has actually rendered
    // before measuring the chart width.
    requestAnimationFrame(() => {

        requestAnimationFrame(() => {

            drawChart(data.history);

        });

    });
}

// ===============================
// DRAW 30-DAY CHART
// ===============================

function drawChart(history) {

    const canvas =
        document.getElementById("price-chart");

    if (!canvas) return;

    const ctx =
        canvas.getContext("2d");

    const container =
        canvas.parentElement;

    if (!container) return;

    // No history
    if (!Array.isArray(history) || history.length === 0) {

        const width =
            Math.max(
                container.clientWidth,
                300
            );

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

        ctx.setTransform(
            ratio,
            0,
            0,
            ratio,
            0,
            0
        );

        ctx.clearRect(
            0,
            0,
            width,
            height
        );

        ctx.font =
            "14px Arial";

        ctx.fillStyle =
            "#6b7280";

        ctx.textAlign =
            "center";

        ctx.fillText(
            "No historical data available",
            width / 2,
            height / 2
        );

        return;
    }

    // Alpha Vantage returns newest → oldest.
    // Reverse so chart displays oldest → newest.
    const points =
        [...history]
            .reverse()
            .map(item => ({
                date: item.date,
                price: Number(item.close)
            }))
            .filter(
                item =>
                    Number.isFinite(item.price)
            );

    if (points.length < 2) {

        console.error(
            "Not enough chart data:",
            points
        );

        return;
    }

    // Get actual visible width
    const width =
        Math.max(
            container.clientWidth,
            300
        );

    const height = 360;

    const ratio =
        window.devicePixelRatio || 1;

    // High-resolution canvas
    canvas.width =
        width * ratio;

    canvas.height =
        height * ratio;

    canvas.style.width =
        `${width}px`;

    canvas.style.height =
        `${height}px`;

    ctx.setTransform(
        ratio,
        0,
        0,
        ratio,
        0,
        0
    );

    ctx.clearRect(
        0,
        0,
        width,
        height
    );

    const prices =
        points.map(
            point => point.price
        );

    const minPrice =
        Math.min(...prices);

    const maxPrice =
        Math.max(...prices);

    const padding = {
        top: 25,
        right: 25,
        bottom: 45,
        left: 70
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

    // ===========================
    // GRID
    // ===========================

    ctx.strokeStyle =
        "#e5e7eb";

    ctx.lineWidth = 1;

    ctx.font =
        "11px Arial";

    ctx.textAlign =
        "right";

    for (
        let i = 0;
        i <= 4;
        i++
    ) {

        const y =
            padding.top +
            (chartHeight / 4) * i;

        // Grid line
        ctx.beginPath();

        ctx.moveTo(
            padding.left,
            y
        );

        ctx.lineTo(
            width - padding.right,
            y
        );

        ctx.stroke();

        // Price label
        const value =
            maxPrice -
            (range / 4) * i;

        ctx.fillStyle =
            "#9ca3af";

        ctx.fillText(
            "$" + value.toFixed(2),
            padding.left - 10,
            y + 4
        );
    }

    // ===========================
    // PRICE LINE
    // ===========================

    ctx.beginPath();

    points.forEach(
        (point, index) => {

            const x =
                padding.left +
                (
                    index /
                    (points.length - 1)
                ) *
                chartWidth;

            const y =
                padding.top +
                (
                    (maxPrice - point.price) /
                    range
                ) *
                chartHeight;

            if (index === 0) {

                ctx.moveTo(x, y);

            } else {

                ctx.lineTo(x, y);

            }

        }
    );

    ctx.strokeStyle =
        "#111827";

    ctx.lineWidth = 3;

    ctx.lineJoin =
        "round";

    ctx.lineCap =
        "round";

    ctx.stroke();

    // ===========================
    // LAST PRICE DOT
    // ===========================

    const last =
        points[points.length - 1];

    const lastX =
        padding.left +
        chartWidth;

    const lastY =
        padding.top +
        (
            (maxPrice - last.price) /
            range
        ) *
        chartHeight;

    ctx.beginPath();

    ctx.arc(
        lastX,
        lastY,
        5,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "#111827";

    ctx.fill();

    // ===========================
    // DATE LABELS
    // ===========================

    ctx.fillStyle =
        "#9ca3af";

    ctx.font =
        "11px Arial";

    ctx.textAlign =
        "center";

    ctx.fillText(
        points[0].date,
        padding.left,
        height - 12
    );

    ctx.fillText(
        points[points.length - 1].date,
        width - padding.right,
        height - 12
    );

    console.log(
        "Chart drawn:",
        points.length,
        "points",
        width,
        "px wide"
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
// RESIZE CHART
// ===============================

window.addEventListener(
    "resize",
    () => {

        const modal =
            document.getElementById(
                "chart-modal"
            );

        if (
            !modal ||
            !modal.classList.contains("open")
        ) {
            return;
        }

        const ticker =
            document.getElementById(
                "chart-ticker"
            ).textContent;

        if (
            ticker &&
            liveData[ticker]
        ) {

            requestAnimationFrame(() => {

                drawChart(
                    liveData[ticker].history
                );

            });

        }

    }
);

// ===============================
// DATE
// ===============================

const dateElement =
    document.getElementById("date");

if (dateElement) {

    const today =
        new Date();

    dateElement.textContent =
        new Intl.DateTimeFormat(
            "en-GB",
            {
                dateStyle: "full"
            }
        ).format(today);

}

// ===============================
// START
// ===============================

loadLiveData();
