document.addEventListener("DOMContentLoaded", () => {
    const centralIcon = document.getElementById("centralIcon");
    const sections = document.querySelectorAll(".section");
    let isExpanded = false;

    function expandSections() {
        const sectionCount = sections.length;
        const angle = 360 / sectionCount;

        sections.forEach((section, index) => {
            const rotation = angle * index;
            if (isExpanded) {
                section.style.transform = `rotate(${rotation}deg) translate(0, 0)`;
                section.style.width = "0";
                section.style.height = "0";
                section.classList.remove("active");
            } else {
                section.style.transform = `rotate(${rotation}deg) translate(0, -50%)`;
                section.style.width = "50vw";
                section.style.height = "50vh";
                section.classList.add("active");
            }
        });

        isExpanded = !isExpanded;
    }

    centralIcon.addEventListener("click", expandSections);
});
