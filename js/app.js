// ========================================
// MAHI GOLD RATE - LOAD APP SETTINGS
// VERSION 3
// ========================================

const savedSettings = localStorage.getItem("MAHI_SETTINGS");

let APP_SETTINGS = {

    darkMode: false,
    priceAlert: false,
    autoRefresh: true,
    currency: "PKR"

};

if (savedSettings) {

    APP_SETTINGS = JSON.parse(savedSettings);

}

console.log("APP SETTINGS:", APP_SETTINGS);


// ========================================
// DOM ELEMENTS
// ========================================

const refreshBtn = document.querySelector(".refresh-btn");
const updateTime = document.getElementById("updateTime");

function updateGoldCards(data) {


            // Gold Price (1 Troy Ounce in USD)
        // const goldUSD = data.rates.USDXAU;
        const goldUSD = data.goldPrice;
        const usdToPkr = data.usdToPkr;

        // USD → PKR
    const gram24 = (goldUSD * usdToPkr) / 31.1035;

    const tola24 = gram24 * 11.664;

    const price24 = Math.round(tola24);
    const price22 = Math.round(price24 * 22 / 24);
    const price21 = Math.round(price24 * 21 / 24);
    const price18 = Math.round(price24 * 18 / 24);

            // ========================================
        // SAVE LIVE DATA
        // ========================================

        LIVE_GOLD.gold24 = price24;
        LIVE_GOLD.gold22 = price22;
        LIVE_GOLD.gold21 = price21;
        LIVE_GOLD.gold18 = price18;

        LIVE_GOLD.usd = usdToPkr;
        LIVE_GOLD.international = goldUSD;



    // Gold Cards
    document.getElementById("gold24").innerHTML =
        "Rs " + price24.toLocaleString();

    document.getElementById("gold22").innerHTML =
        "Rs " + price22.toLocaleString();

    document.getElementById("gold21").innerHTML =
        "Rs " + price21.toLocaleString();

    document.getElementById("gold18").innerHTML =
        "Rs " + price18.toLocaleString();

    // International Gold Price
    document.getElementById("internationalPrice").innerHTML =
        "$" + goldUSD.toFixed(2);

    // Currency Exchange
    document.getElementById("usdRate").innerHTML =
        "Rs " + usdToPkr.toFixed(2);

    document.getElementById("tolaPrice").innerHTML =
    "Rs " + price24.toLocaleString();

// Save Live Rates

    LIVE_GOLD.gold24 = price24;
    LIVE_GOLD.gold22 = price22;
    LIVE_GOLD.gold21 = price21;
    LIVE_GOLD.gold18 = price18;
    LIVE_GOLD.usd = usdToPkr;

    localStorage.setItem("LIVE_GOLD", JSON.stringify(LIVE_GOLD));
}

// ========================================
// START APP
// ========================================

// ========================================
// UPDATE TIME
// ========================================

function updateLastUpdated() {

    const now = new Date();

    updateTime.innerHTML = now.toLocaleString("en-PK", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });

}

// ========================================
// REFRESH BUTTON
// ========================================

refreshBtn.addEventListener("click", async () => {

    refreshBtn.disabled = true;

    refreshBtn.innerHTML = "Refreshing...";

    await getGoldPrice();

    updateLastUpdated();

    refreshBtn.innerHTML = "";

    refreshBtn.disabled = false;

});

getGoldPrice();

updateLastUpdated();


// ========================================
// AUTO REFRESH
// ========================================

if (APP_SETTINGS.autoRefresh) {

    setInterval(() => {

        getGoldPrice();

    }, 60000);

}

// ========================================
// MARKET STATISTICS
// ========================================

function updateMarketStats() {

    const currentPrice = Number(
        LIVE_GOLD.gold24 || 0
    );


    if (!currentPrice) {

        console.log(
            "Market stats: price unavailable"
        );

        return;

    }


    // Today's High / Low
    let high =
        Number(
            localStorage.getItem(
                "MAHI_TODAY_HIGH"
            )
        ) || currentPrice;


    let low =
        Number(
            localStorage.getItem(
                "MAHI_TODAY_LOW"
            )
        ) || currentPrice;


    // Update High
    if (currentPrice > high) {

        high = currentPrice;

    }


    // Update Low
    if (currentPrice < low) {

        low = currentPrice;

    }


    // Save
    localStorage.setItem(
        "MAHI_TODAY_HIGH",
        high
    );

    localStorage.setItem(
        "MAHI_TODAY_LOW",
        low
    );


    // Previous price
    const previousPrice =
        Number(
            localStorage.getItem(
                "MAHI_PREVIOUS_PRICE"
            )
        ) || currentPrice;


    // Change
    const change =
        currentPrice - previousPrice;


    // Percentage
    const percentage =
        previousPrice > 0
            ? (change / previousPrice) * 100
            : 0;


    // ========================================
    // UPDATE HTML
    // ========================================

    const statCurrent =
        document.getElementById(
            "statCurrent"
        );

    const statHigh =
        document.getElementById(
            "statHigh"
        );

    const statLow =
        document.getElementById(
            "statLow"
        );

    const statChange =
        document.getElementById(
            "statChange"
        );

    const statPercent =
        document.getElementById(
            "statPercent"
        );


    if (statCurrent) {

        statCurrent.textContent =
            "Rs " +
            currentPrice.toLocaleString();

    }


    if (statHigh) {

        statHigh.textContent =
            "Rs " +
            high.toLocaleString();

    }


    if (statLow) {

        statLow.textContent =
            "Rs " +
            low.toLocaleString();

    }


    if (statChange) {

        statChange.textContent =
            (change >= 0 ? "+" : "") +
            "Rs " +
            Math.abs(change)
                .toLocaleString();

    }


    if (statPercent) {

        statPercent.textContent =
            (percentage >= 0 ? "+" : "") +
            percentage.toFixed(2) +
            "%";

    }


    // Save current as previous
    localStorage.setItem(
        "MAHI_PREVIOUS_PRICE",
        currentPrice
    );


    console.log(
        "Market Stats Updated:",
        {
            currentPrice,
            high,
            low,
            change,
            percentage
        }
    );

}



// ========================================
// STATISTICS KARAT BUTTONS
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const buttons =
            document.querySelectorAll(
                ".stats-karat"
            );


        console.log(
            "Karat buttons:",
            buttons.length
        );


        buttons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {


                        // ========================================
                        // REMOVE ACTIVE
                        // ========================================

                        buttons.forEach(
                            function (btn) {

                                btn.classList.remove(
                                    "active"
                                );

                            }
                        );


                        // ========================================
                        // ADD ACTIVE
                        // ========================================

                        this.classList.add(
                            "active"
                        );


                        // ========================================
                        // GET KARAT
                        // ========================================

                        const karat =
                            this.dataset.karat;


                        selectedStatsKarat =
                            karat;


                        console.log(
                            "Selected:",
                            karat + "K"
                        );


                        // ========================================
                        // UPDATE TITLE
                        // ========================================

                        const statsKarat =
                            document.getElementById(
                                "statsKarat"
                            );


                        if (statsKarat) {

                            statsKarat.textContent =
                                karat + "K";

                        }


                        // ========================================
                        // UPDATE STATISTICS
                        // ========================================

                        updateMarketStats(
                            karat
                        );

                    }
                );

            }
        );


    }
);




// ========================================
// HYDERABAD GOLD MARKET STATUS (2 PM OPEN, FRIDAY OFF)
// ========================================

function updateHyderabadMarketStatus() {

    const status = document.getElementById("marketStatus");
    const message = document.getElementById("marketStatusMessage");
    const countdown = document.getElementById("marketCountdown");
    const icon = document.getElementById("marketStatusIcon");

    if (!status || !message || !countdown || !icon) {
        return;
    }

    const now = new Date();

    // Hyderabad / Pakistan time
    const hyderabadTime = new Date(
        now.toLocaleString("en-US", {
            timeZone: "Asia/Karachi"
        })
    );

    const day = hyderabadTime.getDay(); // 0 = Sunday, 5 = Friday
    const hour = hyderabadTime.getHours();
    const minute = hyderabadTime.getMinutes();

    const currentMinutes = hour * 60 + minute;

    // ========================================
    // HYDERABAD MARKET TIMING
    // 2:00 PM (14:00) - 8:00 PM (20:00)
    // Friday CLOSED
    // ========================================

    const openingMinutes = 14 * 60; // 2:00 PM
    const closingMinutes = 20 * 60; // 8:00 PM

    // ========================================
    // FRIDAY (OFF DAY)
    // ========================================

    if (day === 5) {

        status.textContent = "LOCAL MARKET CLOSED";

        message.textContent =
            "Hyderabad gold market is closed today (Friday).";

        countdown.textContent =
            "Opens Saturday at 2:00 PM";

        icon.innerHTML =
            '<i class="fa-solid fa-lock"></i>';

        icon.className =
            "market-status-icon closed";

        return;
    }

    // ========================================
    // BEFORE OPENING (BEFORE 2:00 PM)
    // ========================================

    if (currentMinutes < openingMinutes) {

        status.textContent = "MARKET CLOSED";

        message.textContent =
            "Hyderabad gold market opens at 2:00 PM.";

        countdown.textContent =
            getTimeUntilHyderabad(
                hyderabadTime,
                14,
                0
            );

        icon.innerHTML =
            '<i class="fa-solid fa-clock"></i>';

        icon.className =
            "market-status-icon closed";

        return;
    }

    // ========================================
    // AFTER CLOSING (AFTER 8:00 PM)
    // ========================================

    if (currentMinutes >= closingMinutes) {

        status.textContent = "LOCAL MARKET CLOSED";

        message.textContent =
            "Today's Hyderabad gold market session has ended.";

        if (day === 4) { // Thursday night
            countdown.textContent = "Opens Saturday at 2:00 PM";
        } else {
            countdown.textContent = "Opens tomorrow at 2:00 PM";
        }

        icon.innerHTML =
            '<i class="fa-solid fa-lock"></i>';

        icon.className =
            "market-status-icon closed";

        return;
    }

    // ========================================
    // MARKET OPEN (2:00 PM - 8:00 PM)
    // ========================================

    status.textContent = "LOCAL MARKET OPEN";

    message.textContent =
        "Hyderabad gold market is currently active.";

    countdown.textContent =
        getRemainingMarketTime(
            hyderabadTime
        );

    icon.innerHTML =
        '<i class="fa-solid fa-circle-check"></i>';

    icon.className =
        "market-status-icon open";
}


// ========================================
// TIME UNTIL OPEN
// ========================================

function getTimeUntilHyderabad(
    currentTime,
    targetHour,
    targetMinute
) {

    const target = new Date(currentTime);

    target.setHours(
        targetHour,
        targetMinute,
        0,
        0
    );

    let difference =
        target.getTime() -
        currentTime.getTime();

    if (difference < 0) {
        difference += 24 * 60 * 60 * 1000;
    }

    return formatTimeDifference(difference);
}


// ========================================
// REMAINING MARKET TIME
// ========================================

function getRemainingMarketTime(currentTime) {

    const closing = new Date(currentTime);

    closing.setHours(
        20,
        0,
        0,
        0
    );

    const difference =
        closing.getTime() -
        currentTime.getTime();

    return formatTimeDifference(difference) + " remaining";
}


// ========================================
// FORMAT TIME
// ========================================

function formatTimeDifference(milliseconds) {

    const totalMinutes =
        Math.max(
            0,
            Math.floor(
                milliseconds / 60000
            )
        );

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0) {
        return hours + "h " + minutes + "m";
    }

    return minutes + "m";
}


// ========================================
// START MARKET STATUS
// ========================================

updateHyderabadMarketStatus();

setInterval(
    updateHyderabadMarketStatus,
    30000
);



// ========================================
// MAHI GOLD RATE
// DYNAMIC GOLD RATE LIST
// ========================================

document.addEventListener("DOMContentLoaded", function () {

    const container =
        document.getElementById("dynamicGoldRateList");

    if (!container) {

        console.error(
            "dynamicGoldRateList element not found"
        );

        return;
    }


    // ========================================
    // GOLD KARATS
    // ========================================

    const karats = [24, 22, 21, 20, 18];


    // ========================================
    // 1 TOLA = 11.664 GRAMS
    // ========================================

    const TOLA_GRAMS = 11.664;


    // ========================================
    // FORMAT PRICE
    // ========================================

    function formatPrice(price) {

        return "Rs " +
            Math.round(Number(price || 0))
                .toLocaleString("en-PK");

    }


    // ========================================
    // GET LIVE GOLD DATA
    // ========================================

    function getLiveGoldData() {

        // First try global LIVE_GOLD

        if (
            typeof LIVE_GOLD !== "undefined" &&
            LIVE_GOLD.gold24 > 0
        ) {

            return LIVE_GOLD;

        }


        // Backup: localStorage

        try {

            const saved =
                localStorage.getItem("LIVE_GOLD");

            if (saved) {

                return JSON.parse(saved);

            }

        } catch (error) {

            console.error(
                "LIVE_GOLD localStorage error:",
                error
            );

        }


        return null;

    }


    // ========================================
    // GET KARAT PRICE
    // ========================================

    function getKaratPrice(gold, karat) {

        switch (karat) {

            case 24:
                return Number(gold.gold24 || 0);

            case 22:
                return Number(gold.gold22 || 0);

            case 21:
                return Number(gold.gold21 || 0);

            case 20:

                // Calculate 20K from 24K

                return Number(gold.gold24 || 0)
                    * 20 / 24;

            case 18:
                return Number(gold.gold18 || 0);

            default:
                return 0;

        }

    }


    // ========================================
    // CREATE RATE SECTION
    // ========================================

    function createRateSection(
        title,
        subtitle,
        weightInGrams,
        gold
    ) {

        const section =
            document.createElement("section");

        section.className = "home-rate-section";


        // ========================================
        // HEADER
        // ========================================

        const header =
            document.createElement("div");

        header.className =
            "home-rate-section-header";


        header.innerHTML = `

            <div>

                <h3>
                    ${title}
                </h3>

                <p>
                    ${subtitle}
                </p>

            </div>

        `;


        section.appendChild(header);


        // ========================================
        // TABLE HEADER
        // ========================================

        const tableHeader =
            document.createElement("div");

        tableHeader.className =
            "home-rate-table-header";


        tableHeader.innerHTML = `

            <span>
                Gold Weight
            </span>

            <span>
                Gold Karat
            </span>

            <span>
                Gold Rate
            </span>

        `;


        section.appendChild(tableHeader);


        // ========================================
        // KARAT ROWS
        // ========================================

        karats.forEach(function (karat) {

            const tolaPrice =
                getKaratPrice(gold, karat);


            const gramPrice =
                tolaPrice / TOLA_GRAMS;


            const finalPrice =
                gramPrice * weightInGrams;


            const row =
                document.createElement("div");

            row.className = "home-rate-row";


            row.innerHTML = `

                <span>
                    ${weightInGrams === TOLA_GRAMS
                        ? "Per Tola"
                        : weightInGrams + " Gram"}
                </span>

                <span>
                    ${karat}K
                </span>

                <strong>
                    <small>PKR</small>
                    ${Math.round(finalPrice)
                        .toLocaleString("en-PK")}
                </strong>

            `;


            section.appendChild(row);

        });


        return section;

    }


    // ========================================
    // UPDATE LIST
    // ========================================

    function updateGoldRateList() {

        const gold =
            getLiveGoldData();


        if (!gold) {

            console.log(
                "Waiting for LIVE_GOLD..."
            );

            return;

        }


        if (
            !gold.gold24 ||
            Number(gold.gold24) <= 0
        ) {

            console.log(
                "Gold price not available yet..."
            );

            return;

        }


        // Clear old list

        container.innerHTML = "";


        // ========================================
        // 1 TOLA
        // ========================================

        container.appendChild(

            createRateSection(

                "Per Tola",

                "1 Tola = 11.664 grams",

                TOLA_GRAMS,

                gold

            )

        );


        // ========================================
        // 10 GRAM → 1 GRAM
        // ========================================

        for (
            let grams = 10;
            grams >= 1;
            grams--
        ) {

            container.appendChild(

                createRateSection(

                    grams + " Gram",

                    grams + " gram gold rate",

                    grams,

                    gold

                )

            );

        }


        console.log(
            "Dynamic Gold Rate List Updated"
        );

    }


    // ========================================
    // FIRST LOAD
    // ========================================

    updateGoldRateList();


    // ========================================
    // WAIT FOR LIVE API
    // ========================================

    const waitingInterval =
        setInterval(function () {

            updateGoldRateList();

            const gold =
                getLiveGoldData();

            if (
                gold &&
                Number(gold.gold24) > 0
            ) {

                clearInterval(
                    waitingInterval
                );

            }

        }, 2000);


    // ========================================
    // AUTO UPDATE
    // ========================================

    setInterval(function () {

        updateGoldRateList();

    }, 60000);

});