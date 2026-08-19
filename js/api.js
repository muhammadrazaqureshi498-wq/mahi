// ========================================
// MAHI GOLD RATE - API
// ========================================


// ========================================
// GET GOLD PRICE
// ========================================

async function getGoldPrice() {

    try {

        const url =
            `${CONFIG.GOLD_API_URL}?api_key=${CONFIG.GOLD_API_KEY}&base=USD&currencies=XAU,PKR`;

        console.log("Requesting Gold API...");

        const response = await fetch(url, {

            headers: {
                "Accept": "application/json"
            }

        });

        if (!response.ok) {

            throw new Error(
                `HTTP Error: ${response.status}`
            );

        }

        const data = await response.json();

        console.log("Gold API Response:", data);

        console.log(
            JSON.stringify(data, null, 2)
        );


        // ========================================
        // API ERROR
        // ========================================

        if (!data.success) {

            console.warn(
                "API Error:",
                data.error
            );

            return null;

        }


        // ========================================
        // GET API VALUES
        // ========================================

        const goldPrice =
            Number(data.rates.USDXAU);

        const usdToPkr =
            Number(data.rates.PKR);


        console.log(
            "Gold USD:",
            goldPrice
        );

        console.log(
            "USD to PKR:",
            usdToPkr
        );


        // ========================================
        // CHECK VALUES
        // ========================================

        if (!goldPrice || !usdToPkr) {

            console.error(
                "Gold price or USD/PKR missing"
            );

            return null;

        }


        // ========================================
        // 24K GOLD - 1 TOLA
        // ========================================

        LIVE_GOLD.gold24 =
            Math.round(
                (
                    goldPrice *
                    usdToPkr /
                    31.1035
                ) * 11.664
            );


        // ========================================
        // OTHER KARATS
        // ========================================

        LIVE_GOLD.gold22 =
            Math.round(
                LIVE_GOLD.gold24 * 22 / 24
            );

        LIVE_GOLD.gold21 =
            Math.round(
                LIVE_GOLD.gold24 * 21 / 24
            );

        LIVE_GOLD.gold18 =
            Math.round(
                LIVE_GOLD.gold24 * 18 / 24
            );


        // ========================================
        // INTERNATIONAL + USD
        // ========================================

        LIVE_GOLD.international =
            goldPrice;

        LIVE_GOLD.usd =
            usdToPkr;


        // ========================================
        // SAVE
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
        // UPDATE HOME
        // ========================================

        if (
            typeof updateGoldCards === "function"
        ) {

            updateGoldCards({

                goldPrice: goldPrice,

                usdToPkr: usdToPkr

            });

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