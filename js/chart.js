// ========================================
// MAHI GOLD RATE - LIVE CHART
// ========================================

console.log("Chart JS Loaded");


// ========================================
// LIVE GOLD DATA
// ========================================

let liveGold = JSON.parse(
    localStorage.getItem("LIVE_GOLD")
) || {

    gold24: 0,
    gold22: 0,
    gold21: 0,
    gold18: 0,

    usd: 0,
    international: 0

};


console.log("Chart LIVE_GOLD:", liveGold);


// ========================================
// CURRENT SELECTION
// ========================================

let currentKarat = "24";
let currentPeriod = "1D";


// ========================================
// DOM
// ========================================

const livePrice =
    document.getElementById("livePrice");

const chartCanvas =
    document.getElementById("goldChart");

const highPrice =
    document.getElementById("highPrice");

const lowPrice =
    document.getElementById("lowPrice");

const openPrice =
    document.getElementById("openPrice");

const changePrice =
    document.getElementById("changePrice");


// ========================================
// CHECK CANVAS
// ========================================

if (!chartCanvas) {

    console.error(
        "goldChart canvas not found!"
    );

}


// ========================================
// GET CURRENT KARAT PRICE
// ========================================

function getKaratPrice() {

    if (currentKarat === "24") {
        return Number(liveGold.gold24) || 0;
    }

    if (currentKarat === "22") {
        return Number(liveGold.gold22) || 0;
    }

    if (currentKarat === "21") {
        return Number(liveGold.gold21) || 0;
    }

    if (currentKarat === "18") {
        return Number(liveGold.gold18) || 0;
    }

    return 0;
}


// ========================================
// LIVE PRICE
// ========================================

function updateLivePrice() {

    const price = getKaratPrice();

    if (livePrice) {

        livePrice.textContent =
            "Rs " + price.toLocaleString();

    }

    console.log(
        "Current Chart Price:",
        price
    );
}


// ========================================
// CHART DATA
// ========================================

function createChartData() {

    const currentPrice =
        getKaratPrice();


    // Agar live price available nahi
    if (!currentPrice) {

        return [0];

    }


    // Current price ke around
    // temporary chart points

    return [

        Math.round(currentPrice * 0.995),

        Math.round(currentPrice * 0.998),

        Math.round(currentPrice * 0.997),

        Math.round(currentPrice * 1.001),

        Math.round(currentPrice * 1.003),

        Math.round(currentPrice * 1.001),

        currentPrice

    ];

}


// ========================================
// CHART
// ========================================

let goldChart = null;


function createChart() {

    if (!chartCanvas) {
        return;
    }


    const data =
        createChartData();


    const labels = [

        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "Today"

    ];


    goldChart =
        new Chart(chartCanvas, {

            type: "line",

            data: {

                labels: labels,

                datasets: [{

                    label:
                        currentKarat +
                        "K Gold Price",

                    data: data,

                    borderColor: "#FFD700",

                    backgroundColor:
                        "rgba(255,215,0,0.15)",

                    borderWidth: 3,

                    pointRadius: 5,

                    pointBackgroundColor:
                        "#FFD700",

                    fill: true,

                    tension: 0.4

                }]

            },


            options: {

                responsive: true,

                maintainAspectRatio: false,

                plugins: {

                    legend: {

                        display: true

                    }

                },

                scales: {

                    y: {

                        ticks: {

                            callback: function(value) {

                                return (
                                    "Rs " +
                                    Number(value)
                                        .toLocaleString()
                                );

                            }

                        }

                    }

                }

            }

        });


    updateStats(data);

}


// ========================================
// UPDATE CHART
// ========================================

function updateChart() {

    const data =
        createChartData();


    if (!goldChart) {

        return;

    }


    goldChart.data.datasets[0].data =
        data;


    goldChart.data.datasets[0].label =
        currentKarat + "K Gold Price";


    goldChart.update();


    updateStats(data);

}


// ========================================
// UPDATE STATISTICS
// ========================================

function updateStats(data) {

    if (!data || !data.length) {
        return;
    }


    const validData =
        data.filter(value => value > 0);


    if (!validData.length) {

        if (highPrice)
            highPrice.textContent = "Rs 0";

        if (lowPrice)
            lowPrice.textContent = "Rs 0";

        if (openPrice)
            openPrice.textContent = "Rs 0";

        if (changePrice)
            changePrice.textContent = "0%";

        return;

    }


    const high =
        Math.max(...validData);


    const low =
        Math.min(...validData);


    const open =
        validData[0];


    const close =
        validData[validData.length - 1];


    const change =
        open > 0
            ? ((close - open) / open) * 100
            : 0;


    if (highPrice) {

        highPrice.textContent =
            "Rs " +
            high.toLocaleString();

    }


    if (lowPrice) {

        lowPrice.textContent =
            "Rs " +
            low.toLocaleString();

    }


    if (openPrice) {

        openPrice.textContent =
            "Rs " +
            open.toLocaleString();

    }


    if (changePrice) {

        changePrice.textContent =
            (change >= 0 ? "+" : "") +
            change.toFixed(2) +
            "%";

    }

}


// ========================================
// KARAT BUTTONS
// ========================================

document
    .querySelectorAll(".karat-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            function() {

                document
                    .querySelectorAll(".karat-btn")
                    .forEach(btn => {

                        btn.classList.remove(
                            "active"
                        );

                    });


                this.classList.add("active");


                currentKarat =
                    this.dataset.karat;


                console.log(
                    "Selected Karat:",
                    currentKarat + "K"
                );


                updateLivePrice();

                updateChart();

            }

        );

    });


// ========================================
// TIME BUTTONS
// ========================================

document
    .querySelectorAll(".time-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            function() {

                document
                    .querySelectorAll(".time-btn")
                    .forEach(btn => {

                        btn.classList.remove(
                            "active"
                        );

                    });


                this.classList.add("active");


                currentPeriod =
                    this.dataset.time;


                console.log(
                    "Selected Period:",
                    currentPeriod
                );


                updateChart();

            }

        );

    });


// ========================================
// REFRESH BUTTON
// ========================================

const refreshBtn =
    document.querySelector(".refresh-btn");


if (refreshBtn) {

    refreshBtn.addEventListener(
        "click",
        async function() {

            refreshBtn.disabled = true;


            try {

                // API se fresh price lao

                if (
                    typeof getGoldPrice ===
                    "function"
                ) {

                    await getGoldPrice();

                }


                // LocalStorage se fresh data

                liveGold =
                    JSON.parse(
                        localStorage.getItem(
                            "LIVE_GOLD"
                        )
                    ) || liveGold;


                updateLivePrice();

                updateChart();

            }

            catch (error) {

                console.error(
                    "Chart refresh error:",
                    error
                );

            }


            refreshBtn.disabled = false;

        }
    );

}


// ========================================
// AUTO UPDATE
// ========================================

setInterval(function() {

    const saved =
        localStorage.getItem(
            "LIVE_GOLD"
        );


    if (saved) {

        liveGold =
            JSON.parse(saved);


        updateLivePrice();

        updateChart();

    }

}, 60000);


// ========================================
// FIRST LOAD
// ========================================

updateLivePrice();

createChart();

console.log(
    "Mahi Gold Chart Ready"
);