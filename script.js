document.addEventListener("DOMContentLoaded", () => {
    const centralIcon = document.getElementById("centralIcon");
    const sections = document.querySelectorAll(".section");
    let isOpen = false;

    function calculateSectionPolygon(startAngle, endAngle, isCollapsed = true) {
        const start = ((startAngle - 90) * Math.PI) / 180;
        const end = ((endAngle - 90) * Math.PI) / 180;
        const radius = isCollapsed ? 0 : 50;
        const points = [[50, 50]];

        for (let i = 0; i <= 10; i++) {
            const angle = start + (end - start) * (i / 10);
            points.push([
                50 + radius * Math.cos(angle),
                50 + radius * Math.sin(angle),
            ]);
        }

        return points.map((point) => `${point[0]}% ${point[1]}%`).join(", ");
    }

    function initializeSections() {
        const anglePerSection = 360 / sections.length;

        sections.forEach((section, index) => {
            const startAngle = index * anglePerSection;
            const endAngle = startAngle + anglePerSection;
            const midAngle = startAngle + anglePerSection / 2;

            section.style.setProperty("--section-angle", `${midAngle}deg`);

            section.style.clipPath = `polygon(${calculateSectionPolygon(
                startAngle,
                endAngle
            )})`;
        });
    }

    function animateSections() {
        const delay = 50;
        isOpen = !isOpen;

        sections.forEach((section, index) => {
            const startAngle = index * (360 / sections.length);
            const endAngle = startAngle + 360 / sections.length;

            section.style.transition = `clip-path 1s ${
                index * delay
            }ms cubic-bezier(0.4, 0, 0.2, 1),
                                      opacity 0.3s ${
                                          index * delay
                                      }ms cubic-bezier(0.4, 0, 0.2, 1)`;

            setTimeout(() => {
                section.style.clipPath = `polygon(${calculateSectionPolygon(
                    startAngle,
                    endAngle,
                    !isOpen
                )})`;
                section.classList.toggle("active");
            }, index * delay);
        });
    }

    initializeSections();
    centralIcon.addEventListener("click", animateSections);
});
