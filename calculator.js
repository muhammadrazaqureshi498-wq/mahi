// ========================================
// MAHI GOLD RATE - LIVE GOLD CALCULATOR
// ========================================


// ========================================
// GET LIVE GOLD DATA
// ========================================

function getLiveGold() {

    const savedGold = localStorage.getItem("LIVE_GOLD");

    if (!savedGold) {

        console.warn("LIVE_GOLD data not found");

        return null;
    }

    try {

        return JSON.parse(savedGold);

    } catch (error) {

        console.error(
            "LIVE_GOLD JSON Error:",
            error
        );

        return null;
    }
}


// ========================================
// GET KARAT PRICE
// ========================================

function getKaratPrice(karat) {

    const gold = getLiveGold();

    if (!gold) {

        return 0;
    }

    const price = Number(
        gold[`gold${karat}`]
    );

    return price || 0;
}


// ========================================
// DOM ELEMENTS
// ========================================

const goldType =
    document.getElementById("goldType");

const weightUnit =
    document.getElementById("weightUnit");

const weightInput =
    document.getElementById("weightInput");

const calculateBtn =
    document.getElementById("calculateBtn");

const totalPrice =
    document.getElementById("totalPrice");


// ========================================
// CHECK ELEMENTS
// ========================================

if (!goldType) {

    console.error(
        "goldType element not found"
    );
}

if (!weightUnit) {

    console.error(
        "weightUnit element not found"
    );
}

if (!weightInput) {

    console.error(
        "weightInput element not found"
    );
}

if (!calculateBtn) {

    console.error(
        "calculateBtn element not found"
    );
}

if (!totalPrice) {

    console.error(
        "totalPrice element not found"
    );
}


// ========================================
// CALCULATE GOLD PRICE
// ========================================

function calculateGoldPrice() {

    // Selected Karat
    const karat =
        goldType.value;


    // Selected Unit
    const unit =
        weightUnit.value;


    // Entered Weight
    const weight =
        Number(weightInput.value);


    // ========================================
    // VALIDATE WEIGHT
    // ========================================

    if (!weight || weight <= 0) {

        totalPrice.textContent =
            "Enter Weight";

        return;
    }


    // ========================================
    // GET LIVE KARAT PRICE
    // ========================================

    const pricePerTola =
        getKaratPrice(karat);


    // ========================================
    // CHECK LIVE PRICE
    // ========================================

    if (!pricePerTola) {

        totalPrice.textContent =
            "Live Price Unavailable";

        console.error(
            "Live gold price unavailable"
        );

        return;
    }


    // ========================================
    // PRICE CONVERSION
    // ========================================

    let price;


    // ========================================
    // TOLA
    // ========================================

    if (unit === "tola") {

        price =
            pricePerTola * weight;
    }


    // ========================================
    // GRAM
    // ========================================

    else if (unit === "gram") {

        const pricePerGram =
            pricePerTola / 11.664;

        price =
            pricePerGram * weight;
    }


    // ========================================
    // TROY OUNCE
    // ========================================

    else if (unit === "ounce") {

        const pricePerOunce =
            pricePerTola *
            31.1035 /
            11.664;

        price =
            pricePerOunce * weight;
    }


    // ========================================
    // SHOW RESULT
    // ========================================

    totalPrice.textContent =
        "Rs " +
        Math.round(price).toLocaleString();


    // ========================================
    // CONSOLE
    // ========================================

    console.log(
        "Gold Calculator:",
        {
            karat,
            unit,
            weight,
            pricePerTola,
            totalPrice: Math.round(price)
        }
    );
}


// ========================================
// CALCULATE BUTTON
// ========================================

if (calculateBtn) {

    calculateBtn.addEventListener(
        "click",
        calculateGoldPrice
    );

}


// ========================================
// ENTER KEY
// ========================================

if (weightInput) {

    weightInput.addEventListener(
        "keydown",
        function (event) {

            if (event.key === "Enter") {

                calculateGoldPrice();

            }

        }
    );

}


// ========================================
// LOAD LIVE API PRICE
// ========================================

async function loadLiveGoldForCalculator() {

    console.log(
        "Calculator: Loading LIVE GOLD..."
    );


    // First check localStorage
    const savedGold =
        getLiveGold();


    if (
        savedGold &&
        Number(savedGold.gold24) > 0
    ) {

        console.log(
            "Calculator using saved LIVE_GOLD:",
            savedGold
        );

        return;
    }


    // If no saved price, request API
    if (
        typeof getGoldPrice ===
        "function"
    ) {

        console.log(
            "Calculator requesting Gold API..."
        );

        await getGoldPrice();

        console.log(
            "Calculator LIVE_GOLD after API:",
            getLiveGold()
        );

    } else {

        console.error(
            "getGoldPrice() not found"
        );

    }

}


// ========================================
// FIRST LOAD
// ========================================

loadLiveGoldForCalculator();