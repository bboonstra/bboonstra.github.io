let inactivityTimer;
const fadeDuration = 200;
const dot = document.getElementById("dot-cursor");
const inactiveDuration = 3000;

let mouseX = 0;
let mouseY = 0;
let isMoving = false;

function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    if (dot.style.opacity === "0") {
        dot.style.opacity = "1";
        setDotScale(1);
    }
    inactivityTimer = setTimeout(() => {
        dot.style.opacity = "0";
        setDotScale(0);
    }, inactiveDuration);
}

// 👇 Listen to mousemove and store coords
document.addEventListener("mousemove", function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    isMoving = true;
    dot.style.display = "block";
    resetInactivityTimer();
});

function updateCursor() {
    if (isMoving) {
        if (!document.querySelector("a:hover")) {
            dot.style.left = `${mouseX}px`;
            dot.style.top = `${mouseY}px`;
        }
        isMoving = false;
    }
    requestAnimationFrame(updateCursor);
}

// 👇 Start animation loop
requestAnimationFrame(updateCursor);

document.addEventListener("mouseleave", function () {
    dot.style.opacity = "0";
    setDotScale(0);
});

document.addEventListener("mouseenter", function () {
    dot.style.opacity = "1";
    setDotScale(1);
    resetInactivityTimer();
});

document.addEventListener("mousedown", function (e) {
    // Check if the click is on an anchor element
    if (e.target.closest("a")) {
        // Special effect for clicking links
        setDotScale(3);
        dot.style.backgroundColor = "rgba(255, 255, 255, 0.8)";
    } else {
        // Normal click effect for non-links
        setDotScale(2.5);
    }
});

document.addEventListener("mouseup", function () {
    // Reset to normal state after click
    setDotScale(1);
    dot.style.backgroundColor = "#fff";
});

document.addEventListener("dragstart", function () {
    dot.style.display = "none";
});

document.addEventListener("dragend", function () {
    dot.style.display = "block";
});
// Handle anchor hover scaling
document.querySelectorAll("a").forEach((anchor) => {
    let isHovering = false;
    let anchorRect = null;

    anchor.addEventListener("mouseenter", () => {
        isHovering = true;
        updateAnchorCursor(anchor);
    });

    anchor.addEventListener("mouseleave", () => {
        isHovering = false;
        anchorRect = null;

        // Reset styles with smooth transition
        dot.style.transition = `
            opacity ${fadeDuration * 2}ms,
            transform ${fadeDuration}ms ease,
            width ${fadeDuration / 2}ms ease,
            height ${fadeDuration / 2}ms ease,
            background-color ${fadeDuration}ms ease,
            border-radius ${fadeDuration}ms ease
        `;
        setDotScale(1);
        dot.style.width = "10px";
        dot.style.height = "10px";
        dot.style.borderRadius = "50%";
        dot.style.backgroundColor = "#fff";
        dot.style.opacity = "1";
        dot.style.padding = "0";

        // Resume normal cursor following
        isMoving = true;
    });

    // Override the standard mousemove behavior for links
    anchor.addEventListener("mousemove", (e) => {
        if (isHovering) {
            // Update mouseX and mouseY to allow scroll to affect positioning
            mouseX = e.clientX;
            mouseY = e.clientY;
            isMoving = true;
            // Instead of stopping propagation, we'll update the anchor cursor
            updateAnchorCursor(anchor);
        }
    });

    // Add scroll event listener to update cursor position on scroll when hovering a link
    window.addEventListener("scroll", () => {
        if (isHovering) {
            updateAnchorCursor(anchor);
        }
    });
});

// Function to update the cursor when hovering over an anchor
function updateAnchorCursor(anchor) {
    const anchorRect = anchor.getBoundingClientRect();

    // Apply smooth transitions for all properties
    dot.style.transition = `
        opacity ${fadeDuration * 2}ms ease,
        transform ${fadeDuration}ms ease,
        width ${fadeDuration}ms ease,
        height ${fadeDuration}ms ease,
        background-color ${fadeDuration}ms ease,
        border-radius ${fadeDuration}ms ease
    `;

    // Set the new styles for expansion
    dot.style.width = anchorRect.width + "px";
    dot.style.height = anchorRect.height + "px";
    dot.style.borderRadius = anchorRect.borderRadius || "0%";
    dot.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
    dot.style.opacity = "0.5";

    // Position the dot at the center of the link element
    dot.style.left = anchorRect.left + anchorRect.width / 2 + "px";
    dot.style.top = anchorRect.top + anchorRect.height / 2 + "px";
}

function setDotScale(scale) {
    // console.log(`Set scale: ${scale}`);
    // console.trace();
    dot.style.transform = `translate(-50%, -50%) scale(${scale})`;
}
