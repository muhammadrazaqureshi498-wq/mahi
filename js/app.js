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

    refreshBtn.innerHTML = "Refresh";

    refreshBtn.disabled = false;

});

getGoldPrice();

updateLastUpdated();

updateMarketStats();

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

document.addEventListener("DOMContentLoaded", function () {

    const buttons = document.querySelectorAll(".stats-karat");

    console.log("Karat buttons:", buttons.length);


    buttons.forEach(function (button) {

        button.addEventListener("click", function () {

            // Remove active from all
            buttons.forEach(function (btn) {
                btn.classList.remove("active");
            });


            // Add active to clicked button
            this.classList.add("active");


            // Get selected karat
            const karat = this.dataset.karat;

            console.log("Selected:", karat + "K");


            // Update heading
            const statsKarat =
                document.getElementById("statsKarat");

            if (statsKarat) {

                statsKarat.textContent =
                    karat + "K";

            }

        });

    });

});