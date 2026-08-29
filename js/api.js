// New

// ========================================
// MAHI GOLD RATE - API
// XAUS API
// ========================================


// ========================================
// GET GOLD PRICE
// ========================================

async function getGoldPrice() {

    try {

        console.log("Requesting XAUS Gold API...");


        const response = await fetch(
            CONFIG.GOLD_API_URL
        );


        if (!response.ok) {

            throw new Error(
                `HTTP Error: ${response.status}`
            );

        }


        const data = await response.json();


        console.log(
            "XAUS API Response:",
            data
        );


        // ========================================
        // GET GOLD PRICE
        // ========================================

     const goldPrice =
    Number(
        data.spot_usd_oz
    );


        // ========================================
        // GET USD → PKR
        // ========================================

        const usdToPkr =
    Number(
        data.fx_rates.PKR
    );


        console.log(
            "Gold USD:",
            goldPrice
        );


        console.log(
            "USD → PKR:",
            usdToPkr
        );


        // ========================================
        // CHECK DATA
        // ========================================

        if (
            !goldPrice ||
            !usdToPkr
        ) {

            console.error(
                "Gold price or USD/PKR missing"
            );

            return null;

        }


        // ========================================
        // 24K GOLD - 1 TOLA
        // ========================================

        const gram24 =
            (
                goldPrice *
                usdToPkr
            ) / 31.1034768;


        const tola24 =
            gram24 * 11.6638125;


        const price24 =
            Math.round(tola24);


        // ========================================
        // OTHER KARATS
        // ========================================

        const price22 =
            Math.round(
                price24 * 22 / 24
            );


        const price21 =
            Math.round(
                price24 * 21 / 24
            );


        const price18 =
            Math.round(
                price24 * 18 / 24
            );


        // ========================================
        // SAVE LIVE GOLD DATA
        // ========================================

        LIVE_GOLD.gold24 =
            price24;

        LIVE_GOLD.gold22 =
            price22;

        LIVE_GOLD.gold21 =
            price21;

        LIVE_GOLD.gold18 =
            price18;

        LIVE_GOLD.usd =
            usdToPkr;

        LIVE_GOLD.international =
            goldPrice;


        // ========================================
        // LOCAL STORAGE
        // ========================================

        localStorage.setItem(
            "LIVE_GOLD",
            JSON.stringify(LIVE_GOLD)
        );


        console.log(
            "LIVE_GOLD Updated:",
            LIVE_GOLD
        );



        // ========================================
// SAVE CHART HISTORY
// ========================================

const chartHistory =
    JSON.parse(
        localStorage.getItem("MAHI_CHART_HISTORY")
    ) || [];

chartHistory.push({
    time: new Date().toISOString(),

    gold24: LIVE_GOLD.gold24,
    gold22: LIVE_GOLD.gold22,
    gold21: LIVE_GOLD.gold21,
    gold18: LIVE_GOLD.gold18
});

// Last 100 prices only
if (chartHistory.length > 100) {
    chartHistory.shift();
}

localStorage.setItem(
    "MAHI_CHART_HISTORY",
    JSON.stringify(chartHistory)
);

console.log("Chart History Saved:", chartHistory);


        // ========================================
        // UPDATE HOME PAGE
        // ========================================

        if (
            typeof updateGoldCards ===
            "function"
        ) {

            updateGoldCards({

                goldPrice: goldPrice,

                usdToPkr: usdToPkr

            });

        }

        // ========================================
// UPDATE MARKET STATISTICS
// ========================================

if (
    typeof updateMarketStats ===
    "function"
) {

    updateMarketStats();

}


        return data;


    } catch (error) {

        console.error(
            "Gold API Error:",
            error
        );

        return null;

    }

}