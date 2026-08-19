// ========================================
// LOAD MAHI SETTINGS
// ========================================

const calculatorSettings =
    JSON.parse(
        localStorage.getItem("MAHI_SETTINGS")
    ) || {

        currency: "PKR",
        autoRefresh: true,
        darkMode: false,
        priceAlert: false

    };

console.log("Calculator Settings:", calculatorSettings);


// ========================================
// MAHI GOLD RATE CALCULATOR
// ========================================

const savedGold = JSON.parse(localStorage.getItem("LIVE_GOLD"));

if (savedGold) {
    LIVE_GOLD.gold24 = savedGold.gold24;
    LIVE_GOLD.gold22 = savedGold.gold22;
    LIVE_GOLD.gold21 = savedGold.gold21;
    LIVE_GOLD.gold18 = savedGold.gold18;
    LIVE_GOLD.usd = savedGold.usd;
}

console.log(LIVE_GOLD);



    console.log("LIVE_GOLD =", LIVE_GOLD);

function getLiveRate(karat) {

    switch (karat) {

        case "24":
            return LIVE_GOLD.gold24;

        case "22":
            return LIVE_GOLD.gold22;

        case "21":
            return LIVE_GOLD.gold21;

        case "18":
            return LIVE_GOLD.gold18;

        default:
            return 0;
    }

}

// ========================================
// DOM ELEMENTS
// ========================================

const goldType = document.getElementById("goldType");
const weightUnit = document.getElementById("weightUnit");
const weightInput = document.getElementById("weightInput");
const calculateBtn = document.getElementById("calculateBtn");
const totalPrice = document.getElementById("totalPrice");

// ========================================
// CALCULATE PRICE
// ========================================

function calculateGoldPrice() {

    console.log(LIVE_GOLD);
    console.log("24K Rate:", LIVE_GOLD.gold24);

    const karat = goldType.value;
    const unit = weightUnit.value;
    const weight = parseFloat(weightInput.value);

    if (isNaN(weight) || weight <= 0) {

        alert("Please enter a valid weight.");

        return;
    }

    // Per Tola Rate
    const tolaRate = getLiveRate(karat);

    let finalPrice = 0;

    // Convert Weight

    if (unit === "tola") {

        finalPrice = tolaRate * weight;

    }

    else if (unit === "gram") {

        const gramRate = tolaRate / 11.664;

        finalPrice = gramRate * weight;

    }

    else if (unit === "ounce") {

        const ounceRate = (tolaRate / 11.664) * 31.1035;

        finalPrice = ounceRate * weight;

    }

    // Show Result

    totalPrice.innerHTML =
        "Rs " + Math.round(finalPrice).toLocaleString();

}

// ========================================
// BUTTON EVENT
// ========================================

calculateBtn.addEventListener("click", calculateGoldPrice);