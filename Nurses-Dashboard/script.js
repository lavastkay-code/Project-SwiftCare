document.addEventListener("DOMContentLoaded", () => {

    /* ELEMENTS */

    const menuButton = document.getElementById("menuButton");
    const sidebar = document.getElementById("sidebar");
    const sidebarOverlay = document.getElementById("sidebarOverlay");

    const nurseToggle = document.getElementById("nurseToggle");
    const nurseSubmenu = document.getElementById("nurseSubmenu");
    const nurseArrow = document.querySelector(".nurse-arrow");

    const filterButtons = document.querySelectorAll(".filter-button");
    const patientRows = document.querySelectorAll("#patientTable tr");
    const actionButtons = document.querySelectorAll(".action-button");

    const refreshButton = document.getElementById("refreshButton");

    const paginationButtons =
        document.querySelectorAll(".pagination-button");


    /* MOBILE SIDEBAR */

    function openSidebar() {
        sidebar.classList.add("open");
        sidebarOverlay.classList.add("show");

        document.body.style.overflow = "hidden";
    }


    function closeSidebar() {
        sidebar.classList.remove("open");
        sidebarOverlay.classList.remove("show");

        document.body.style.overflow = "";
    }


    if (menuButton) {
        menuButton.addEventListener("click", () => {

            if (sidebar.classList.contains("open")) {
                closeSidebar();
            } else {
                openSidebar();
            }

        });
    }


    if (sidebarOverlay) {
        sidebarOverlay.addEventListener("click", closeSidebar);
    }


    /* NURSES DROPDOWN */

    if (nurseToggle) {

        nurseToggle.addEventListener("click", () => {

            const isClosed =
                nurseSubmenu.style.display === "none";

            if (isClosed) {

                nurseSubmenu.style.display = "flex";

                if (nurseArrow) {
                    nurseArrow.style.transform = "rotate(0deg)";
                }

            } else {

                nurseSubmenu.style.display = "none";

                if (nurseArrow) {
                    nurseArrow.style.transform = "rotate(-90deg)";
                }

            }

        });

    }


    /* FILTER BUTTONS */

    filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            /* Remove active class */
            filterButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            /* Add active class */
            button.classList.add("active");

            const filter = button.dataset.filter;


            /* Filter patients */
            patientRows.forEach(row => {

                const status = row.dataset.status;

                if (filter === "all") {

                    row.style.display = "";

                } else if (status === filter) {

                    row.style.display = "";

                } else {

                    row.style.display = "none";

                }

            });

        });

    });


    /* TRIAGE BUTTONS */

    actionButtons.forEach(button => {

        button.addEventListener("click", () => {

            const row = button.closest("tr");


            /* START TRIAGE */
            if (button.classList.contains("start-button")) {

                button.textContent = "Resume";

                button.classList.remove("start-button");
                button.classList.add("resume-button");

                if (row) {
                    row.dataset.status = "progress";
                }

                return;
            }


            /* RESUME */
            if (button.classList.contains("resume-button")) {

                button.textContent = "Completed";

                button.disabled = true;

            }

        });

    });


    /* REFRESH BUTTON */

    if (refreshButton) {

        refreshButton.addEventListener("click", () => {

            const originalText = refreshButton.textContent.trim();

            refreshButton.textContent = "Refreshing...";
            refreshButton.disabled = true;


            setTimeout(() => {

                refreshButton.textContent = originalText;
                refreshButton.disabled = false;

            }, 800);

        });

    }


    /* PAGINATION */

    paginationButtons.forEach(button => {

        button.addEventListener("click", () => {

            const text = button.textContent.trim();


            /* Ignore < and > buttons */
            if (text === "<" || text === ">") {
                return;
            }


            /* Remove active */
            paginationButtons.forEach(btn => {
                btn.classList.remove("active");
            });


            /* Activate selected page */
            button.classList.add("active");

        });

    });


    /* CLOSE MOBILE SIDEBAR WHEN NAV ITEM IS CLICKED */

    const navLinks =
        document.querySelectorAll(
            ".nav-item:not(.nurse-toggle)"
        );


    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            if (window.innerWidth <= 950) {
                closeSidebar();
            }

        });

    });


    /* RESPONSIVE CLEANUP */

    window.addEventListener("resize", () => {

        if (window.innerWidth > 950) {
            closeSidebar();
        }

    });

});