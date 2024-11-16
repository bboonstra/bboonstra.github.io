document.addEventListener("DOMContentLoaded", () => {
    const centralIcon = document.getElementById("centralIcon");
    const sections = document.querySelectorAll(".section");
    let isOpen = false;

    function calculateSectionPolygon(startAngle, endAngle) {
        const start = ((startAngle - 90) * Math.PI) / 180;
        const end = ((endAngle - 90) * Math.PI) / 180;
        const points = [[50, 50]];

        for (let i = 0; i <= 10; i++) {
            const angle = start + (end - start) * (i / 10);
            points.push([50 + 50 * Math.cos(angle), 50 + 50 * Math.sin(angle)]);
        }

        return points.map(([x, y]) => `${x}% ${y}%`).join(", ");
    }

    function applyClipPaths() {
        const sectionCount = sections.length;
        const anglePerSection = 360 / sectionCount;

        sections.forEach((section, index) => {
            const startAngle = index * anglePerSection;
            const endAngle = (index + 1) * anglePerSection;
            const clipPath = `polygon(${calculateSectionPolygon(
                startAngle,
                endAngle
            )})`;
            section.style.clipPath = clipPath;
        });
    }

    function swoosh() {
        const sectionCount = sections.length;
        const angle = 360 / sectionCount;
        isOpen = !isOpen;

        if (isOpen) {
            // Expand: Start all sections from -90 degrees (pointing left)
            // and rotate to their final positions
            sections.forEach((section, index) => {
                // First set initial position without transition
                section.style.transition = "none";
                section.style.transform = "rotate(-90deg)";
                section.classList.add("active");

                // Force reflow to ensure the initial position is applied
                section.offsetHeight;

                // Restore transition and animate to final position
                section.style.transition = "";
                const rotation = angle * index;
                section.style.transform = `rotate(${rotation}deg)`;
            });
        } else {
            // Collapse: Rotate all sections back to -90 degrees
            sections.forEach((section) => {
                section.style.transform = "rotate(-90deg)";
                section.classList.remove("active");
            });
        }
    }

    applyClipPaths();
    centralIcon.addEventListener("click", swoosh);
});
