document.addEventListener("DOMContentLoaded", () => {
    const centralIcon = document.getElementById("centralIcon");
    const sections = document.querySelectorAll(".section");
    let isOpen = false;

    function calculateSectionPolygon(startAngle, endAngle, isCollapsed = true) {
        const start = ((startAngle - 90) * Math.PI) / 180;
        const end = ((endAngle - 90) * Math.PI) / 180;
        const points = [[50, 50]];

        if (isCollapsed) {
            for (let i = 0; i <= 10; i++) {
                const angle = start + (end - start) * (i / 10);
                const x = 50;
                const y = 50;
                points.push([x, y]);
            }
        } else {
            for (let i = 0; i <= 10; i++) {
                const angle = start + (end - start) * (i / 10);
                points.push([
                    50 + 50 * Math.cos(angle),
                    50 + 50 * Math.sin(angle),
                ]);
            }
        }

        return points.map((point) => `${point[0]}% ${point[1]}%`).join(", ");
    }

    function initializeSections() {
        const anglePerSection = 360 / sections.length;

        sections.forEach((section, index) => {
            const startAngle = index * anglePerSection;
            const endAngle = startAngle + anglePerSection;
            section.style.clipPath = `polygon(${calculateSectionPolygon(
                startAngle,
                endAngle
            )})`;
        });
    }

    function animateSections() {
        const delay = 150;
        isOpen = !isOpen;

        sections.forEach((section, index) => {
            const timing = isOpen ? index : sections.length - 1 - index;
            const startAngle = index * (360 / sections.length);
            const endAngle = startAngle + 360 / sections.length;

            if (isOpen) {
                section.style.transition = "none";
                section.style.clipPath = `polygon(${calculateSectionPolygon(
                    startAngle,
                    endAngle,
                    true
                )})`;
                section.classList.add("active");
                section.offsetHeight; // Force reflow

                setTimeout(() => {
                    section.style.transition = "clip-path 0.5s ease";
                    section.style.clipPath = `polygon(${calculateSectionPolygon(
                        startAngle,
                        endAngle,
                        false
                    )})`;
                }, timing * delay);
            } else {
                setTimeout(() => {
                    section.style.clipPath = `polygon(${calculateSectionPolygon(
                        startAngle,
                        endAngle,
                        true
                    )})`;
                    section.classList.remove("active");
                }, timing * delay);
            }
        });
    }

    initializeSections();
    centralIcon.addEventListener("click", animateSections);
});
