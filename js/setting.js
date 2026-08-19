// ========================================
// MAHI GOLD RATE - PRICE ALERT
// ========================================

console.log("Setting JS Working!");


// ========================================
// ELEMENTS
// ========================================

const saveAlert = document.getElementById("saveAlert");
const alertKarat = document.getElementById("alertKarat");
const targetPrice = document.getElementById("targetPrice");
const alertCondition = document.getElementById("alertCondition");


// Active Alert Elements
const activeGold = document.getElementById("activeGold");
const activeTarget = document.getElementById("activeTarget");
const alertStatus = document.getElementById("alertStatus");
const removeAlert = document.getElementById("removeAlert");


// ========================================
// SAVE ALERT
// ========================================

saveAlert.addEventListener("click", function () {

    const karat = alertKarat.value;
    const price = Number(targetPrice.value);
    const condition = alertCondition.value;


    // Check price
    if (!price || price <= 0) {

        alert("Please enter target price!");

        return;
    }


    // Create alert
    const alertData = {

        karat: karat,

        targetPrice: price,

        condition: condition,

        active: true

    };


    // Save in browser
    localStorage.setItem(
        "MAHI_PRICE_ALERT",
        JSON.stringify(alertData)
    );


    console.log("ALERT SAVED:", alertData);


    // Show result immediately
    displayAlert(alertData);


    alert("✅ Price Alert Set Successfully!");

});


// ========================================
// DISPLAY ALERT
// ========================================

function displayAlert(alertData) {

    if (!alertData) {
        return;
    }


    // Gold
    if (activeGold) {

        activeGold.textContent =
            alertData.karat + "K Gold";

    }


    // Target
    if (activeTarget) {

        activeTarget.textContent =
            "Rs " +
            Number(alertData.targetPrice)
                .toLocaleString("en-PK");

    }


    // Status
    if (alertStatus) {

        alertStatus.textContent = "ON";

    }


    console.log(
        "Active Alert:",
        alertData.karat + "K Gold",
        alertData.targetPrice
    );

}


// ========================================
// LOAD SAVED ALERT
// ========================================

function loadAlert() {

    const saved =
        localStorage.getItem("MAHI_PRICE_ALERT");


    if (!saved) {

        console.log("No saved alert");

        return;

    }


    try {

        const alertData = JSON.parse(saved);

        displayAlert(alertData);

    }

    catch (error) {

        console.error(
            "Alert Load Error:",
            error
        );

    }

}


// ========================================
// REMOVE ALERT
// ========================================

if (removeAlert) {

    removeAlert.addEventListener(
        "click",
        function () {

            localStorage.removeItem(
                "MAHI_PRICE_ALERT"
            );


            if (activeGold) {
                activeGold.textContent = "--";
            }


            if (activeTarget) {
                activeTarget.textContent = "--";
            }


            if (alertStatus) {
                alertStatus.textContent = "OFF";
            }


            alert("🗑 Alert Removed!");

        }
    );

}


// ========================================
// PAGE LOAD
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadAlert();

    }
);


// ========================================
// CHECK LIVE GOLD PRICE
// ========================================

function checkGoldPriceAlert() {

    // Saved alert
    const savedAlert =
        localStorage.getItem("MAHI_PRICE_ALERT");

    if (!savedAlert) {
        return;
    }

    const alertData = JSON.parse(savedAlert);

    // Alert already triggered
    if (!alertData.active) {
        return;
    }


    // LIVE_GOLD check
    if (typeof LIVE_GOLD === "undefined") {

        console.log("LIVE_GOLD not available.");

        return;
    }


    // Get selected karat price
    let currentPrice = 0;

    switch (alertData.karat) {

        case "24":
            currentPrice = LIVE_GOLD.gold24;
            break;

        case "22":
            currentPrice = LIVE_GOLD.gold22;
            break;

        case "21":
            currentPrice = LIVE_GOLD.gold21;
            break;

        case "18":
            currentPrice = LIVE_GOLD.gold18;
            break;

        default:
            return;
    }


    console.log(
        "Alert Check:",
        alertData.karat + "K",
        "Current:",
        currentPrice,
        "Target:",
        alertData.targetPrice
    );


    // No valid price
    if (!currentPrice || currentPrice <= 0) {
        return;
    }


    // ========================================
    // ABOVE
    // ========================================

    if (
        alertData.condition === "above" &&
        currentPrice >= alertData.targetPrice
    ) {

        triggerGoldAlert(
            alertData,
            currentPrice
        );

    }


    // ========================================
    // BELOW
    // ========================================

    if (
        alertData.condition === "below" &&
        currentPrice <= alertData.targetPrice
    ) {

        triggerGoldAlert(
            alertData,
            currentPrice
        );

    }

}


// ========================================
// TRIGGER ALERT
// ========================================

function triggerGoldAlert(alertData, currentPrice) {

    console.log("🔔 GOLD PRICE TARGET HIT!");


    alert(
        "🔔 Gold Price Alert!\n\n" +

        alertData.karat + "K Gold\n" +

        "Current Price: Rs " +
        currentPrice.toLocaleString() +

        "\nTarget Price: Rs " +
        Number(alertData.targetPrice)
            .toLocaleString()
    );


    // Mark alert as triggered
    alertData.active = false;

    alertData.triggered = true;

    alertData.triggeredPrice = currentPrice;

    alertData.triggeredAt =
        new Date().toISOString();


    localStorage.setItem(
        "MAHI_PRICE_ALERT",
        JSON.stringify(alertData)
    );

}


// ========================================
// CHECK EVERY 5 SECONDS
// ========================================

setInterval(
    checkGoldPriceAlert,
    5000
);


// Initial check
checkGoldPriceAlert();


function checkGoldPriceAlert() {

    const savedAlert =
        localStorage.getItem("MAHI_PRICE_ALERT");

    if (!savedAlert) {
        return;
    }

    const alertData = JSON.parse(savedAlert);

    if (!alertData.active) {
        return;
    }

    let currentPrice = 0;

    switch (alertData.karat) {

        case "24":
            currentPrice = LIVE_GOLD.gold24;
            break;

        case "22":
            currentPrice = LIVE_GOLD.gold22;
            break;

        case "21":
            currentPrice = LIVE_GOLD.gold21;
            break;

        case "18":
            currentPrice = LIVE_GOLD.gold18;
            break;
    }

    console.log("Current Gold Price:", currentPrice);
    console.log("Target Price:", alertData.targetPrice);

    if (
        alertData.condition === "above" &&
        currentPrice >= alertData.targetPrice
    ) {

        alert(
            "🔔 " +
            alertData.karat +
            "K Gold target reached!"
        );

        alertData.active = false;

        localStorage.setItem(
            "MAHI_PRICE_ALERT",
            JSON.stringify(alertData)
        );
    }


    if (
        alertData.condition === "below" &&
        currentPrice <= alertData.targetPrice
    ) {

        alert(
            "🔔 " +
            alertData.karat +
            "K Gold target reached!"
        );

        alertData.active = false;

        localStorage.setItem(
            "MAHI_PRICE_ALERT",
            JSON.stringify(alertData)
        );
    }
}


// Check every 5 seconds

setInterval(
    checkGoldPriceAlert,
    5000
);



// ========================================
// GOLD ALERT NOTIFICATION
// ========================================

function showGoldNotification(message) {

    if ("Notification" in window) {

        if (Notification.permission === "granted") {

            new Notification("Mahi Gold Rate 🔔", {
                body: message
            });

        }

        else if (Notification.permission !== "denied") {

            Notification.requestPermission().then(permission => {

                if (permission === "granted") {

                    new Notification("Mahi Gold Rate 🔔", {
                        body: message
                    });

                }

            });

        }

    }

}


// ========================================
// UPDATED ALERT CHECK
// ========================================

function checkLiveGoldAlert() {

    const savedAlert =
        localStorage.getItem("MAHI_PRICE_ALERT");

    if (!savedAlert) return;


    const alertData =
        JSON.parse(savedAlert);

    if (!alertData.active) return;


    let currentPrice = 0;


    if (alertData.karat === "24") {
        currentPrice = LIVE_GOLD.gold24;
    }

    if (alertData.karat === "22") {
        currentPrice = LIVE_GOLD.gold22;
    }

    if (alertData.karat === "21") {
        currentPrice = LIVE_GOLD.gold21;
    }

    if (alertData.karat === "18") {
        currentPrice = LIVE_GOLD.gold18;
    }


    if (!currentPrice || currentPrice <= 0) {

        console.log("LIVE_GOLD price unavailable");

        return;

    }


    console.log(
        `${alertData.karat}K Current:`,
        currentPrice
    );


    let targetReached = false;


    // ABOVE
    if (
        alertData.condition === "above" &&
        currentPrice >= alertData.targetPrice
    ) {

        targetReached = true;

    }


    // BELOW
    if (
        alertData.condition === "below" &&
        currentPrice <= alertData.targetPrice
    ) {

        targetReached = true;

    }


    if (targetReached) {

        const message =
            `${alertData.karat}K Gold reached Rs ${currentPrice.toLocaleString()}`;


        console.log("🔔 ALERT:", message);


        showGoldNotification(message);


        alertData.active = false;

        alertData.triggered = true;

        localStorage.setItem(
            "MAHI_PRICE_ALERT",
            JSON.stringify(alertData)
        );

    }

}


// Check every 5 seconds

setInterval(
    checkLiveGoldAlert,
    5000
);