document.addEventListener("DOMContentLoaded", () => {
    const centralIcon = document.getElementById("centralIcon");
    const sections = document.querySelectorAll(".section");
    let isOpen = false;

    // Calculate polygon points for a section
    function calculateSectionPolygon(startAngle, endAngle) {
        const start = (startAngle - 90) * (Math.PI / 180); // Subtract 90 to align first section at top
        const end = (endAngle - 90) * (Math.PI / 180);

        const points = [[50, 50]]; // center point

        // Add point at start radius
        points.push([50 + 50 * Math.cos(start), 50 + 50 * Math.sin(start)]);

        // Add points along the arc
        const steps = 10; // Increased for smoother curves
        for (let i = 1; i < steps; i++) {
            const angle = start + (end - start) * (i / steps);
            points.push([50 + 50 * Math.cos(angle), 50 + 50 * Math.sin(angle)]);
        }

        // Add point at end radius
        points.push([50 + 50 * Math.cos(end), 50 + 50 * Math.sin(end)]);

        return points.map(([x, y]) => `${x}% ${y}%`).join(", ");
    }

    // Apply clip paths to all sections
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
        // Offset needed to align first section at the top
        const startOffset = -90 + angle / 2;

        isOpen = !isOpen;

        sections.forEach((section, index) => {
            const rotation = angle * index + startOffset;

            if (isOpen) {
                section.style.transform = `rotate(${rotation}deg)`;
                section.classList.add("active");
            } else {
                section.style.transform = `rotate(${startOffset}deg)`;
                section.classList.remove("active");
            }
        });
    }

    // Initialize clip paths
    applyClipPaths();
    centralIcon.addEventListener("click", swoosh);
});
