document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById("project-search");
    const filterPills = document.querySelectorAll(".filter-pill");
    const projects = document.querySelectorAll(".project");
    const layoutButtons = document.querySelectorAll(".layout");

    searchInput.addEventListener("input", () => {
        const query = searchInput.value.toLowerCase();
        filterProjects(query);

        // Remove 'filter-pill-active' class from all pills when typing in search
        filterPills.forEach((p) => p.classList.remove("filter-pill-active"));
    });

    filterPills.forEach((pill) => {
        pill.addEventListener("click", () => {
            // Remove 'filter-pill-active' class from all pills
            filterPills.forEach((p) =>
                p.classList.remove("filter-pill-active")
            );

            // Add 'filter-pill-active' class to the clicked pill
            pill.classList.add("filter-pill-active");

            const filter = pill.getAttribute("data-filter");
            filterProjects(filter);
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
