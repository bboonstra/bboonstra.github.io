document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("project-search");
    const filterPills = document.querySelectorAll(".filter-pill");
    const projects = document.querySelectorAll(".project");
    const layoutButtons = document.querySelectorAll(".layout");
    // Add the stats toggle button
    const statsToggle = document.querySelector(".project-stats-toggle .pill");
    const statsElements = document.querySelectorAll(".stats");

    // Add event listener for the Effortless banner
    const effortlessBanner = document.getElementById("effortless-banner");
    if (effortlessBanner) {
        effortlessBanner.addEventListener("click", () => {
            window.location.href = "https://bboonstra.dev/effortless/";
        });
    }

    // Add event listener for the Stats for Nerds toggle
    if (statsToggle) {
        statsToggle.addEventListener("click", () => {
            const isActive =
                statsToggle.classList.contains("filter-pill-active");

            // Ensure all toggles are in sync
            if (isActive) {
                statsToggle.classList.remove("filter-pill-active");
                statsElements.forEach((stat) => {
                    stat.classList.remove("stats-active");
                });
            } else {
                statsToggle.classList.add("filter-pill-active");
                statsElements.forEach((stat) => {
                    stat.classList.add("stats-active");
                });
            }
        });
    }

    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        filterProjects(query);

        // Remove 'filter-pill-active' class from all pills when typing in search
        filterPills.forEach((p) => p.classList.remove("filter-pill-active"));
    });

    filterPills.forEach((pill) => {
        pill.addEventListener("click", () => {
            if (pill.classList.contains("filter-pill-active")) {
                // If the pill is already active, remove the active class and show all projects
                pill.classList.remove("filter-pill-active");
                filterProjects("");
            } else {
                // Clear text in the input
                searchInput.value = "";
                // Remove 'filter-pill-active' class from all pills
                filterPills.forEach((p) =>
                    p.classList.remove("filter-pill-active")
                );

                // Add 'filter-pill-active' class to the clicked pill
                pill.classList.add("filter-pill-active");

                const filter = pill.getAttribute("data-filter");
                filterProjects(filter);
            }
        });
    });

    layoutButtons.forEach((button, index) => {
        button.addEventListener("click", () => {
            // Remove 'layout-active' class from all buttons
            layoutButtons.forEach((btn) =>
                btn.classList.remove("layout-active")
            );

            // Add 'layout-active' class to the clicked button
            button.classList.add("layout-active");

            switch (index) {
                case 0:
                    setProjectWidth("90%");
                    break;
                case 1:
                    setProjectWidth("40%");
                    break;
                case 2:
                    setProjectWidth("25%");
                    break;
            }
        });
    });

    function filterProjects(query) {
        projects.forEach((project) => {
            const tags = project.getAttribute("data-tags");
            if (tags.includes(query)) {
                project.style.display = "block";
            } else {
                project.style.display = "none";
            }
        });
    }

    function setProjectWidth(width) {
        projects.forEach((project) => {
            project.style.width = width;
        });
    }
});
