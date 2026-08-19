// ========================================
// MAHI GOLD RATE - CHART
// VERSION 3
// ========================================


// ========================================
// LOAD SETTINGS
// ========================================

const chartSettings =
    JSON.parse(
        localStorage.getItem("MAHI_SETTINGS")
    ) || {

        currency: "PKR",
        autoRefresh: true,
        darkMode: false,
        priceAlert: false

    };

console.log("Chart Settings:", chartSettings);


// ========================================
// CURRENT SELECTION
// ========================================

let currentKarat = "24";
let currentPeriod = "1D";


// ========================================
// HISTORICAL DEMO DATA
// ========================================
//
// IMPORTANT:
// Last value will be replaced with LIVE_GOLD
// current price.
//

const chartData = {

    "24": {

        "1D": [
            423000,
            424000,
            422500,
            423500,
            424200,
            423800,
            423176
        ],

        "7D": [
            418000,
            419500,
            420000,
            421500,
            422800,
            423500,
            423176
        ],

        "1M": [
            398000,
            401000,
            404000,
            408000,
            412000,
            418000,
            423176
        ],

        "1Y": [
            290000,
            305000,
            325000,
            345000,
            365000,
            395000,
            423176
        ]

    },


    "22": {

        "1D": [
            387000,
            388000,
            387500,
            388500,
            389000,
            388200,
            387911
        ],

        "7D": [
            382000,
            383500,
            384000,
            385500,
            386800,
            387500,
            387911
        ],

        "1M": [
            365000,
            368000,
            372000,
            377000,
            381000,
            385000,
            387911
        ],

        "1Y": [
            270000,
            280000,
            295000,
            320000,
            340000,
            365000,
            387911
        ]

    },


    "21": {

        "1D": [
            369000,
            370000,
            369500,
            370500,
            371000,
            370400,
            370279
        ],

        "7D": [
            365000,
            366000,
            367500,
            368500,
            369500,
            370000,
            370279
        ],

        "1M": [
            350000,
            353000,
            357000,
            362000,
            366000,
            369000,
            370279
        ],

        "1Y": [
            255000,
            265000,
            280000,
            300000,
            325000,
            350000,
            370279
        ]

    },


    "18": {

        "1D": [
            316000,
            317000,
            316500,
            317500,
            318000,
            317400,
            317382
        ],

        "7D": [
            312000,
            313000,
            314500,
            315000,
            316000,
            317000,
            317382
        ],

        "1M": [
            300000,
            302000,
            305000,
            309000,
            312000,
            315000,
            317382
        ],

        "1Y": [
            220000,
            230000,
            245000,
            265000,
            285000,
            300000,
            317382
        ]

    }

};


// ========================================
// GET LIVE CURRENT PRICE
// ========================================

function getLivePrice(karat) {

    if (
        typeof LIVE_GOLD === "undefined"
    ) {

        console.warn(
            "LIVE_GOLD not available"
        );

        return null;

    }


    const price = Number(
        LIVE_GOLD["gold" + karat]
    );


    if (!price || price <= 0) {

        return null;

    }


    return price;

}


// ========================================
// UPDATE LAST DATA POINT
// ========================================

function updateLiveChartPrice() {

    const livePrice =
        getLivePrice(currentKarat);


    if (!livePrice) {

        console.warn(
            "Live price unavailable"
        );

        return;

    }


    chartData[currentKarat][currentPeriod]
        [
            chartData[currentKarat][currentPeriod].length - 1
        ] = livePrice;


    console.log(
        "Chart Live Price:",
        currentKarat,
        livePrice
    );

}


// ========================================
// CANVAS
// ========================================

const canvas =
    document.getElementById("goldChart");


if (!canvas) {

    console.error(
        "goldChart canvas not found"
    );

} else {


    const ctx =
        canvas.getContext("2d");


    // ========================================
    // CREATE CHART
    // ========================================

    const goldChart = new Chart(ctx, {

        type: "line",


        data: {

            labels: [
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "Today"
            ],


            datasets: [{

                label: "Gold Price (PKR)",

                data:
                    chartData[
                        currentKarat
                    ][
                        currentPeriod
                    ],

                borderColor: "#FFD700",

                backgroundColor:
                    "rgba(255,215,0,.15)",

                fill: true,

                tension: .4,

                borderWidth: 3,

                pointRadius: 5,

                pointBackgroundColor:
                    "#FFD700"

            }]

        },


        options: {

            responsive: true,

            maintainAspectRatio: false,


            plugins: {

                legend: {

                    labels: {

                        color: "#fff"

                    }

                }

            },


            scales: {

                x: {

                    ticks: {

                        color: "#fff"

                    },

                    grid: {

                        color: "#333"

                    }

                },


                y: {

                    ticks: {

                        color: "#fff",

                        callback: function(value) {

                            return "Rs " +
                                Number(value)
                                    .toLocaleString();

                        }

                    },

                    grid: {

                        color: "#333"

                    }

                }

            }

        }

    });


    // ========================================
    // UPDATE CHART
    // ========================================

    function updateChart() {


        // Get current LIVE price

        updateLiveChartPrice();


        // Get selected data

        const data =
            chartData[
                currentKarat
            ][
                currentPeriod
            ];


        // Update chart

        goldChart.data.datasets[0].data =
            data;


        // Update label

        goldChart.data.datasets[0].label =
            currentKarat + "K Gold Price";


        // Update chart

        goldChart.update();


        // Update statistics

        updateStats(data);

    }


    // ========================================
    // UPDATE STATS
    // ========================================

    function updateStats(data) {


        const high =
            Math.max(...data);


        const low =
            Math.min(...data);


        const open =
            data[0];


        const close =
            data[data.length - 1];


        const change =
            (
                ((close - open) / open) *
                100
            ).toFixed(2);


        const highElement =
            document.getElementById(
                "highPrice"
            );


        const lowElement =
            document.getElementById(
                "lowPrice"
            );


        const openElement =
            document.getElementById(
                "openPrice"
            );


        const changeElement =
            document.getElementById(
                "changePercent"
            );


        if (highElement) {

            highElement.textContent =
                "Rs " +
                high.toLocaleString();

        }


        if (lowElement) {

            lowElement.textContent =
                "Rs " +
                low.toLocaleString();

        }


        if (openElement) {

            openElement.textContent =
                "Rs " +
                open.toLocaleString();

        }


        if (changeElement) {

            changeElement.textContent =
                (change >= 0 ? "+" : "") +
                change +
                "%";

        }

    }


    // ========================================
    // KARAT BUTTONS
    // ========================================

    document
        .querySelectorAll(".karat-btn")
        .forEach(btn => {


            btn.addEventListener(
                "click",
                function() {


                    document
                        .querySelectorAll(
                            ".karat-btn"
                        )
                        .forEach(
                            b =>
                                b.classList
                                    .remove(
                                        "active"
                                    )
                        );


                    this.classList
                        .add("active");


                    currentKarat =
                        this.dataset.karat;


                    console.log(
                        "Selected Karat:",
                        currentKarat
                    );


                    updateChart();

                }

            );

        });


    // ========================================
    // TIME BUTTONS
    // ========================================

    document
        .querySelectorAll(".time-btn")
        .forEach(btn => {


            btn.addEventListener(
                "click",
                function() {


                    document
                        .querySelectorAll(
                            ".time-btn"
                        )
                        .forEach(
                            b =>
                                b.classList
                                    .remove(
                                        "active"
                                    )
                        );


                    this.classList
                        .add("active");


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
    // FIRST LOAD
    // ========================================

    updateChart();


    // ========================================
    // AUTO UPDATE CHART
    // ========================================

    if (chartSettings.autoRefresh) {


        setInterval(
            function() {

                updateLiveChartPrice();

                updateChart();

            },
            60000
        );

    }

}