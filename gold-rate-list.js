// ========================================
// MAHI GOLD RATE
// LIVE GOLD RATE LIST
// ========================================


// ========================================
// DOM
// ========================================

const rateList =
    document.getElementById("rateList");

const refreshBtn =
    document.getElementById("refreshBtn");

const liveStatus =
    document.getElementById("liveStatus");

const lastUpdated =
    document.getElementById("lastUpdated");


// ========================================
// GOLD SETTINGS
// ========================================

// 1 Tola = 11.664 grams

const GRAMS_PER_TOLA = 11.664;


// Karats shown in rate list

const KARATS = [
    24,
    22,
    21,
    20,
    18
];


// ========================================
// FORMAT PRICE
// ========================================

function formatPrice(price) {

    return Math.round(price)
        .toLocaleString("en-PK");

}


// ========================================
// KARAT PRICE
// ========================================

function getKaratPrice(
    price24,
    karat
) {

    return (
        price24 *
        Number(karat)
        / 24
    );

}


// ========================================
// GRAM PRICE
// ========================================

function getGramPrice(
    price24,
    karat
) {

    const tolaPrice =
        getKaratPrice(
            price24,
            karat
        );

    return (
        tolaPrice /
        GRAMS_PER_TOLA
    );

}


// ========================================
// WEIGHT PRICE
// ========================================

function getWeightPrice(
    price24,
    karat,
    grams
) {

    const gramPrice =
        getGramPrice(
            price24,
            karat
        );

    return (
        gramPrice *
        grams
    );

}


// ========================================
// CREATE SECTION
// ========================================

function createSection(
    title,
    subtitle,
    rows,
    isTola = false
) {

    const section =
        document.createElement("section");

    section.className =
        "rate-section" +
        (isTola ? " tola" : "");


    section.innerHTML = `

        <div class="rate-section-header">

            <h2>
                ${title}
            </h2>

            <p>
                ${subtitle}
            </p>

        </div>


        <table class="rate-table">

            <thead>

                <tr>

                    <th>
                        Gold Weight
                    </th>

                    <th>
                        Gold Karat
                    </th>

                    <th>
                        Gold Rate
                    </th>

                </tr>

            </thead>


            <tbody>

                ${rows}

            </tbody>

        </table>

    `;


    rateList.appendChild(
        section
    );

}


// ========================================
// CREATE TOLA
// ========================================

function createTolaRates(
    price24
) {

    let rows = "";


    KARATS.forEach(
        function (karat) {

            const price =
                getKaratPrice(
                    price24,
                    karat
                );


            rows += `

                <tr>

                    <td>
                        Per Tola
                    </td>

                    <td class="karat">
                        ${karat}K
                    </td>

                    <td class="rate">

                        <span class="currency">
                            PKR
                        </span>

                        ${formatPrice(price)}

                    </td>

                </tr>

            `;

        }
    );


    createSection(
        "Per Tola",
        "1 Tola = 11.664 grams",
        rows,
        true
    );

}


// ========================================
// CREATE GRAM RATES
// ========================================

function createGramRates(
    price24,
    grams
) {

    let rows = "";


    KARATS.forEach(
        function (karat) {

            const price =
                getWeightPrice(
                    price24,
                    karat,
                    grams
                );


            rows += `

                <tr>

                    <td>
                        ${grams} Gram
                    </td>

                    <td class="karat">
                        ${karat}K
                    </td>

                    <td class="rate">

                        <span class="currency">
                            PKR
                        </span>

                        ${formatPrice(price)}

                    </td>

                </tr>

            `;

        }
    );


    createSection(
        `${grams} Gram`,
        `${grams} gram live gold rates`,
        rows
    );

}


// ========================================
// RENDER ALL RATES
// ========================================

function renderRates(
    price24
) {

    rateList.innerHTML = "";


    if (
        !price24 ||
        Number(price24) <= 0
    ) {

        showError(
            "Live gold price is not available."
        );

        return;

    }


    // Per Tola

    createTolaRates(
        Number(price24)
    );


    // 10g → 1g

    for (
        let grams = 10;
        grams >= 1;
        grams--
    ) {

        createGramRates(
            Number(price24),
            grams
        );

    }


    updateStatus(
        "LIVE"
    );

}


// ========================================
// GET LIVE GOLD PRICE
// ========================================

function getLivePrice() {

    // ------------------------------------
    // OPTION 1
    // LIVE_GOLD variable
    // ------------------------------------

    if (
        typeof LIVE_GOLD !== "undefined"
    ) {

        const price =
            Number(
                LIVE_GOLD.gold24
            );


        if (price > 0) {

            return price;

        }

    }


    // ------------------------------------
    // OPTION 2
    // localStorage
    // ------------------------------------

    try {

        const saved =
            JSON.parse(
                localStorage.getItem(
                    "LIVE_GOLD"
                )
            );


        if (
            saved &&
            Number(saved.gold24) > 0
        ) {

            return Number(
                saved.gold24
            );

        }

    }

    catch (error) {

        console.log(
            "LIVE_GOLD storage error:",
            error
        );

    }


    return 0;

}


// ========================================
// LOAD LIVE RATES
// ========================================

async function loadRates() {

    setLoading();


    try {

        /*
         * Tumhare existing api.js ka
         * getGoldPrice() use hoga.
         */

        if (
            typeof getGoldPrice ===
            "function"
        ) {

            await getGoldPrice();

        }


        const price24 =
            getLivePrice();


        if (!price24) {

            throw new Error(
                "24K gold price unavailable"
            );

        }


        console.log(
            "Gold Rate List 24K:",
            price24
        );


        renderRates(
            price24
        );


        lastUpdated.textContent =
            "Updated: " +
            new Date()
                .toLocaleString(
                    "en-PK",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit"
                    }
                );

    }

    catch (error) {

        console.error(
            "Gold Rate List Error:",
            error
        );


        updateStatus(
            "OFFLINE"
        );


        showError(
            "Unable to load live gold rates."
        );

    }

}


// ========================================
// LOADING
// ========================================

function setLoading() {

    updateStatus(
        "LOADING"
    );


    rateList.innerHTML = `

        <div class="market-note">

            <i class="
                fa-solid
                fa-spinner
                fa-spin
            "></i>

            <span>
                Loading live gold rates...
            </span>

        </div>

    `;

}


// ========================================
// ERROR
// ========================================

function showError(
    message
) {

    rateList.innerHTML = `

        <div class="error-box">

            <i class="
                fa-solid
                fa-triangle-exclamation
            "></i>

            <p>
                ${message}
            </p>


            <button
                onclick="loadRates()"
            >

                Try Again

            </button>

        </div>

    `;

}


// ========================================
// STATUS
// ========================================

function updateStatus(
    status
) {

    if (!liveStatus) {

        return;

    }


    liveStatus.textContent =
        status;


    if (
        status === "LIVE"
    ) {

        liveStatus.style.color =
            "#36d98b";

    }

    else if (
        status === "LOADING"
    ) {

        liveStatus.style.color =
            "#ffd000";

    }

    else {

        liveStatus.style.color =
            "#ff6565";

    }

}


// ========================================
// REFRESH BUTTON
// ========================================

if (refreshBtn) {

    refreshBtn.addEventListener(
        "click",
        async function () {

            refreshBtn.disabled =
                true;


            refreshBtn.innerHTML = `

                <i class="
                    fa-solid
                    fa-spinner
                    fa-spin
                "></i>

            `;


            await loadRates();


            refreshBtn.disabled =
                false;


            refreshBtn.innerHTML = `

                <i class="
                    fa-solid
                    fa-rotate-right
                "></i>

            `;

        }
    );

}


// ========================================
// FIRST LOAD
// ========================================

loadRates();


// ========================================
// AUTO REFRESH
// ========================================

setInterval(
    function () {

        loadRates();

    },
    60000
);