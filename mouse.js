let inactivityTimer;
const fadeDuration = 300;
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
        if (!document.querySelector("a:hover, .hoverable:hover")) {
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
    if (e.target.closest("a, .hoverable")) {
        // Special effect for clicking links
        setDotScale(0.1);
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
document.querySelectorAll("a, .hoverable").forEach((anchor) => {
    let isHovering = false;
    let anchorRect = null;

    anchor.addEventListener("mouseenter", () => {
        isHovering = true;
        updateAnchorCursor(anchor);
    });

    anchor.addEventListener("mouseleave", () => {
        isHovering = false;
        anchorRect = null;
        dot.style.width /= 2;
        dot.style.height /= 2;

        // Reset styles with smooth transition
        dot.style.transition = `
            opacity ${fadeDuration * 2}ms,
            transform ${fadeDuration}ms ease,
            width ${fadeDuration / 3}ms ease,
            height ${fadeDuration / 3}ms ease,
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
    let anchorRect;
    try {
        anchorRect = anchor.getBoundingClientRect();
    } catch (error) {
        anchorRect = anchor.firstElementChild.getBoundingClientRect();
    }

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
    dot.style.borderRadius =
        window.getComputedStyle(anchor).borderRadius || "0%";
    dot.style.backgroundColor = "rgba(100, 149, 237, 0.7)"; // Light hyperlink blue with transparency
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

document.addEventListener("DOMContentLoaded", () => {
    setupSocialNavigation();
});

function setupSocialNavigation() {
    const originalSocials = document.querySelector(".social-icons");
    const navSocials = originalSocials.cloneNode(true);
    navSocials.classList.add("nav-social-icons");
    document.body.appendChild(navSocials);

    // Initialize state
    navSocials.style.opacity = "0";
    navSocials.style.pointerEvents = "none";

    let isVisible = false;

    // Add event listeners to the cloned social icon anchors
    navSocials.querySelectorAll("a, .hoverable").forEach((anchor) => {
        let isHovering = false;

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

        anchor.addEventListener("mousemove", (e) => {
            if (isHovering) {
                mouseX = e.clientX;
                mouseY = e.clientY;
                isMoving = true;
                updateAnchorCursor(anchor);
            }
        });
    });

    window.addEventListener("scroll", () => {
        const socialRect = originalSocials.getBoundingClientRect();
        const splashSection = document.querySelector(".splash-container");
        const splashRect = splashSection.getBoundingClientRect();

        // When original socials go off-screen or splash section is not visible
        if (socialRect.bottom < 0 || splashRect.bottom < 0) {
            if (!isVisible) {
                navSocials.classList.remove("hidden");
                navSocials.classList.add("visible");
                navSocials.style.opacity = "1";
                navSocials.style.pointerEvents = "auto";
                isVisible = true;
            }
        } else {
            if (isVisible) {
                navSocials.classList.remove("visible");
                navSocials.classList.add("hidden");
                // Wait for animation to finish before disabling pointer events
                setTimeout(() => {
                    if (!isVisible) {
                        // Check if state hasn't changed during timeout
                        navSocials.style.opacity = "0";
                        navSocials.style.pointerEvents = "none";
                    }
                }, 300); // Match animation duration
                isVisible = false;
            }
        }

        // Call updateSocialBoxes to ensure we have the latest positions
        if (typeof updateSocialBoxes === "function") {
            updateSocialBoxes();
        }
    });
}
