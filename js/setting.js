// ========================================
// MAHI GOLD RATE - SETTINGS
// ========================================


// ========================================
// DEFAULT SETTINGS
// ========================================

let APP_SETTINGS = {

    darkMode: false,

    priceAlert: false,

    autoRefresh: true,

    currency: "PKR"

};


// ========================================
// LOAD SETTINGS
// ========================================

const savedSettings =
    localStorage.getItem("MAHI_SETTINGS");


if (savedSettings) {

    try {

        APP_SETTINGS =
            JSON.parse(savedSettings);

    } catch (error) {

        console.error(
            "Settings load error:",
            error
        );

    }

}


console.log(
    "APP SETTINGS:",
    APP_SETTINGS
);


// ========================================
// DOM READY
// ========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        initSettings();

        initPriceAlert();

        initLogout();

    }
);


// ========================================
// SAVE SETTINGS
// ========================================

function saveSettings() {

    localStorage.setItem(
        "MAHI_SETTINGS",
        JSON.stringify(APP_SETTINGS)
    );

    console.log(
        "Settings Saved:",
        APP_SETTINGS
    );

}


// ========================================
// INITIALIZE SETTINGS
// ========================================

function initSettings() {

    const darkMode =
        document.getElementById(
            "darkMode"
        );

    const priceAlert =
        document.getElementById(
            "priceAlert"
        );

    const autoRefresh =
        document.getElementById(
            "autoRefresh"
        );

    const currency =
        document.getElementById(
            "currency"
        );


    // ====================================
    // SET CURRENT VALUES
    // ====================================

    if (darkMode) {

        darkMode.checked =
            APP_SETTINGS.darkMode;

    }


    if (priceAlert) {

        priceAlert.checked =
            APP_SETTINGS.priceAlert;

    }


    if (autoRefresh) {

        autoRefresh.checked =
            APP_SETTINGS.autoRefresh;

    }


    if (currency) {

        currency.value =
            APP_SETTINGS.currency;

    }


    // ====================================
    // DARK MODE
    // ====================================

    applyTheme();


    // ====================================
    // DARK MODE EVENT
    // ====================================

    if (darkMode) {

        darkMode.addEventListener(
            "change",
            function () {

                APP_SETTINGS.darkMode =
                    this.checked;

                applyTheme();

                saveSettings();

            }
        );

    }


    // ====================================
    // PRICE ALERT TOGGLE
    // ====================================

    if (priceAlert) {

        priceAlert.addEventListener(
            "change",
            function () {

                APP_SETTINGS.priceAlert =
                    this.checked;

                saveSettings();

                const alertData =
                    getSavedAlert();

                if (
                    this.checked &&
                    alertData
                ) {

                    showAlertStatus(
                        "Price alerts enabled.",
                        "success"
                    );

                }

            }
        );

    }


    // ====================================
    // AUTO REFRESH
    // ====================================

    if (autoRefresh) {

        autoRefresh.addEventListener(
            "change",
            function () {

                APP_SETTINGS.autoRefresh =
                    this.checked;

                saveSettings();

            }
        );

    }


    // ====================================
    // CURRENCY
    // ====================================

    if (currency) {

        currency.addEventListener(
            "change",
            function () {

                APP_SETTINGS.currency =
                    this.value;

                saveSettings();

                console.log(
                    "Currency:",
                    this.value
                );

            }
        );

    }

}


// ========================================
// APPLY THEME
// ========================================

function applyTheme() {

    if (
        APP_SETTINGS.darkMode
    ) {

        document.body.classList.remove(
            "light-mode"
        );

    } else {

        document.body.classList.add(
            "light-mode"
        );

    }

}


// ========================================
// PRICE ALERT
// ========================================

function initPriceAlert() {

    const saveAlertBtn =
        document.getElementById(
            "saveAlertBtn"
        );

    const deleteAlertBtn =
        document.getElementById(
            "deleteAlertBtn"
        );


    // Load existing alert

    loadActiveAlert();


    // Save alert

    if (saveAlertBtn) {

        saveAlertBtn.addEventListener(
            "click",
            savePriceAlert
        );

    }


    // Delete alert

    if (deleteAlertBtn) {

        deleteAlertBtn.addEventListener(
            "click",
            deletePriceAlert
        );

    }

}


// ========================================
// SAVE PRICE ALERT
// ========================================

function savePriceAlert() {

    const karat =
        document.getElementById(
            "alertKarat"
        ).value;


    const priceInput =
        document.getElementById(
            "alertPrice"
        );


    const condition =
        document.getElementById(
            "alertCondition"
        ).value;


    const price =
        Number(priceInput.value);


    // ====================================
    // VALIDATION
    // ====================================

    if (!price || price <= 0) {

        showAlertStatus(
            "Please enter a valid target price.",
            "error"
        );

        return;

    }


    // ====================================
    // ALERT DATA
    // ====================================

    const alertData = {

        enabled: true,

        karat: karat,

        price: price,

        condition: condition,

        createdAt:
            new Date().toISOString()

    };


    // ====================================
    // SAVE
    // ====================================

    localStorage.setItem(
        "MAHI_PRICE_ALERT",
        JSON.stringify(alertData)
    );


    // Enable price alert setting

    APP_SETTINGS.priceAlert = true;

    const priceAlert =
        document.getElementById(
            "priceAlert"
        );

    if (priceAlert) {

        priceAlert.checked = true;

    }


    saveSettings();


    // ====================================
    // UPDATE UI
    // ====================================

    loadActiveAlert();


    showAlertStatus(
        "Price alert successfully set!",
        "success"
    );


    console.log(
        "Price Alert:",
        alertData
    );

}


// ========================================
// GET SAVED ALERT
// ========================================

function getSavedAlert() {

    const savedAlert =
        localStorage.getItem(
            "MAHI_PRICE_ALERT"
        );


    if (!savedAlert) {

        return null;

    }


    try {

        return JSON.parse(
            savedAlert
        );

    } catch (error) {

        console.error(
            "Alert data error:",
            error
        );

        return null;

    }

}


// ========================================
// LOAD ACTIVE ALERT
// ========================================

function loadActiveAlert() {

    const alertData =
        getSavedAlert();


    const badge =
        document.getElementById(
            "alertBadge"
        );


    const activeKarat =
        document.getElementById(
            "activeAlertKarat"
        );


    const activePrice =
        document.getElementById(
            "activeAlertPrice"
        );


    if (!alertData) {

        if (badge) {

            badge.textContent = "OFF";

            badge.classList.remove(
                "active"
            );

        }


        if (activeKarat) {

            activeKarat.textContent =
                "--";

        }


        if (activePrice) {

            activePrice.textContent =
                "--";

        }


        return;

    }


    // ====================================
    // BADGE
    // ====================================

    if (badge) {

        badge.textContent = "ON";

        badge.classList.add(
            "active"
        );

    }


    // ====================================
    // KARAT
    // ====================================

    if (activeKarat) {

        activeKarat.textContent =
            alertData.karat + "K Gold";

    }


    // ====================================
    // PRICE
    // ====================================

    if (activePrice) {

        activePrice.textContent =
            "Rs " +
            Number(
                alertData.price
            ).toLocaleString();

    }

}


// ========================================
// DELETE ALERT
// ========================================

function deletePriceAlert() {

    localStorage.removeItem(
        "MAHI_PRICE_ALERT"
    );


    APP_SETTINGS.priceAlert =
        false;


    const priceAlert =
        document.getElementById(
            "priceAlert"
        );


    if (priceAlert) {

        priceAlert.checked = false;

    }


    saveSettings();


    loadActiveAlert();


    showAlertStatus(
        "Price alert removed.",
        "success"
    );


    console.log(
        "Price Alert Removed"
    );

}


// ========================================
// ALERT STATUS MESSAGE
// ========================================

function showAlertStatus(
    message,
    type
) {

    const status =
        document.getElementById(
            "alertStatus"
        );


    if (!status) {

        return;

    }


    status.textContent =
        message;


    status.classList.add(
        "show"
    );


    // ====================================
    // SUCCESS
    // ====================================

    if (type === "success") {

        status.style.color =
            "#22c55e";

    }


    // ====================================
    // ERROR
    // ====================================

    else if (type === "error") {

        status.style.color =
            "#ef4444";

    }


    // ====================================
    // HIDE AFTER 3 SEC
    // ====================================

    setTimeout(
        function () {

            status.classList.remove(
                "show"
            );

        },
        3000
    );

}


// ========================================
// LOGOUT
// ========================================

function initLogout() {

    const logoutBtn =
        document.getElementById(
            "logoutBtn"
        );


    if (!logoutBtn) {

        return;

    }


    logoutBtn.addEventListener(
        "click",
        function () {

            const confirmLogout =
                confirm(
                    "Are you sure you want to logout?"
                );


            if (!confirmLogout) {

                return;

            }


            console.log(
                "Logout clicked"
            );


            // For now simply show message

            alert(
                "Logout feature will be connected later."
            );

        }
    );

}