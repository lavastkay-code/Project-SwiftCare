document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       SCREEN 5
       Start Triage -> Show Error Modal
    ========================================= */

    const startTriageButton =
        document.querySelector(".start-triage-button");

    const errorModalOverlay =
        document.getElementById("errorModalOverlay");

    const retryButton =
        document.getElementById("retryButton");

    const backToQueueButton =
        document.getElementById("backToQueueButton");


    if (startTriageButton && errorModalOverlay) {

        startTriageButton.addEventListener("click", () => {

            errorModalOverlay.classList.add("show");

        });

    }


    /* =========================================
       SCREEN 5
       Retry -> SCREEN 6
    ========================================= */

    if (retryButton) {

        retryButton.addEventListener("click", () => {

            /* Close Screen 5 */
            if (errorModalOverlay) {
                errorModalOverlay.classList.remove("show");
            }

            /* Show Screen 6 */
            showLoadingScreen();

        });

    }


    /* =========================================
       SCREEN 5
       Back to Queue -> SCREEN 2
    ========================================= */

    if (backToQueueButton) {

        backToQueueButton.addEventListener("click", () => {

            window.location.href =
                "Nurse-Dashboard/index.html";

        });

    }

    if (startTriageButton) {
        startTriageButton.addEventListener("click", () => {
            window.location.href = "screen7.html"; // Replace with your target file path or URL
        });
    }

    /* =========================================
       SCREEN 6
       Loading Modal
    ========================================= */

    const loadingModalOverlay =
        document.getElementById("loadingModalOverlay");

    const cancelLoadingButton =
        document.getElementById("cancelLoadingButton");


    function showLoadingScreen() {

        if (!loadingModalOverlay) {
            return;
        }

        loadingModalOverlay.classList.add("show");


        /*
         * Figma interaction:
         *
         * After delay: 800ms
         * Navigate to Screen 7
         * Animation: Instant
         */

        setTimeout(() => {

            window.location.href =
                "screen7.html";

        }, 800);

    }


    /* =========================================
       SCREEN 6
       Cancel -> SCREEN 2
    ========================================= */

    if (cancelLoadingButton) {

        cancelLoadingButton.addEventListener("click", () => {

            window.location.href =
                "Nurse-Dashboard/index.html";

        });

    }

});