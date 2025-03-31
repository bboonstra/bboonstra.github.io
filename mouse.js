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
        if (document.querySelector("a:hover, .hoverable:hover")) {
            resetInactivityTimer();
        } else {
            dot.style.opacity = "0";
            setDotScale(0);
        }
    }, inactiveDuration);
}

// 👇 Listen to mousemove and store coords
document.addEventListener("mousemove", function (e) {
    // Only process if not on mobile
    if (window.innerWidth > 768) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        isMoving = true;

        // Ensure the cursor is visible if it was previously hidden
        if (dot.style.display !== "block") {
            dot.style.display = "block";
        }

        resetInactivityTimer();
    }
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
    setDotScale(0.5);
});

document.addEventListener("mouseup", function () {
    // Reset to normal state after click
    setDotScale(1);
    dot.style.backgroundColor = "#fff";
    dot.style.backgroundImage = "none"; // Ensure gradient is removed
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
        // dot.style.width /= 2; // Removed this scaling, as setDotScale handles it
        // dot.style.height /= 2; // Removed this scaling

        // Reset styles with smooth transition
        dot.style.transition = `
            opacity ${fadeDuration * 2}ms,
            transform ${fadeDuration}ms ease,
            width ${fadeDuration / 3}ms ease,
            height ${fadeDuration / 3}ms ease,
            background-color ${fadeDuration}ms ease,
            background-image ${fadeDuration}ms ease, /* Add transition for gradient */
            border-radius ${fadeDuration}ms ease
        `;
        setDotScale(1);
        dot.style.width = "10px";
        dot.style.height = "10px";
        dot.style.borderRadius = "50%";
        dot.style.backgroundImage = "none"; // Remove gradient
        dot.style.backgroundColor = "#fff"; // Restore background color
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
        // Ensure width/height are not zero or negative, minimum 1px
        if (anchorRect.width <= 0 || anchorRect.height <= 0) {
            if (anchor.firstElementChild) {
                anchorRect = anchor.firstElementChild.getBoundingClientRect();
                if (anchorRect.width <= 0 || anchorRect.height <= 0) {
                    console.warn(
                        "Could not get valid bounding rect for:",
                        anchor
                    );
                    return; // Exit if still invalid
                }
            } else {
                console.warn("Could not get valid bounding rect for:", anchor);
                return; // Exit if no child element either
            }
        }
    } catch (error) {
        // Fallback for potential elements without direct bounding box (like SVG wrappers)
        if (anchor.firstElementChild) {
            anchorRect = anchor.firstElementChild.getBoundingClientRect();
            if (anchorRect.width <= 0 || anchorRect.height <= 0) {
                console.warn(
                    "Could not get valid bounding rect for child of:",
                    anchor
                );
                return; // Exit if child is invalid
            }
        } else {
            // If no fallback, exit to prevent errors
            console.warn("Could not get bounding rect for:", anchor, error);
            return;
        }
    }

    // Calculate mouse position relative to the element's top-left corner
    const relativeX = mouseX - anchorRect.left;
    const relativeY = mouseY - anchorRect.top;

    // Calculate the gradient size
    const minDimension = Math.max(
        1,
        Math.min(anchorRect.width, anchorRect.height)
    ); // Ensure minDimension is at least 1
    let gradientSize = minDimension * 0.7; // 70% of the smaller dimension
    gradientSize = Math.min(gradientSize, 200); // Cap at 200px
    // Ensure gradientSize is at least a small positive number to avoid rendering issues
    gradientSize = Math.max(1, gradientSize);

    console.log("Calculated gradient size:", gradientSize);

    // Apply smooth transitions for all properties
    dot.style.transition = `
        opacity ${fadeDuration * 2}ms ease,
        transform ${fadeDuration}ms ease,
        width ${fadeDuration}ms ease,
        height ${fadeDuration}ms ease,
        background-color ${fadeDuration}ms ease,
        background-image ${fadeDuration}ms ease, /* Add transition for gradient */
        border-radius ${fadeDuration}ms ease
    `;

    // Set the new styles for expansion
    dot.style.width = anchorRect.width + "px";
    dot.style.height = anchorRect.height + "px";
    dot.style.borderRadius =
        window.getComputedStyle(anchor).borderRadius || "0px"; // Use 0px default

    // Apply the radial gradient with calculated size, centered at the relative mouse position
    const opacityFactor = Math.max(0.1, 1 - gradientSize / 200); // Stronger opacity for smaller gradient sizes
    dot.style.backgroundImage = `radial-gradient(circle ${gradientSize}px at ${relativeX}px ${relativeY}px, rgba(100, 149, 237, ${opacityFactor}) 0%, rgba(100, 149, 237, ${
        opacityFactor * 0.5
    }) 50%, rgba(100, 149, 237, ${opacityFactor * 0.2}) 100%)`;
    dot.style.backgroundColor = "transparent"; // Make base color transparent to see gradient

    dot.style.opacity = "0.7"; // Adjust opacity as desired for the effect

    // Position the dot at the center of the link element
    // This transform is already handled by translate(-50%, -50%)
    dot.style.left = anchorRect.left + anchorRect.width / 2 + "px";
    dot.style.top = anchorRect.top + anchorRect.height / 2 + "px";
}

function setDotScale(scale) {
    // console.log(`Set scale: ${scale}`);
    // console.trace();
    dot.style.transform = `translate(-50%, -50%) scale(${scale})`;
}

document.addEventListener("DOMContentLoaded", () => {
    const cursor = document.getElementById("dot-cursor");
    let isMobile = window.innerWidth <= 768;

    // Function to update mobile status
    function checkMobile() {
        isMobile = window.innerWidth <= 768;
        if (isMobile) {
            cursor.style.display = "none";
        } else {
            // On desktop, keep it hidden until mouse movement
            cursor.style.display = "none";
            cursor.style.opacity = "0";
        }
    }

    // Check on load and on resize
    checkMobile();
    window.addEventListener("resize", checkMobile);

    // Show cursor only on first mouse movement for desktop
    document.addEventListener("mousemove", function onFirstMouseMove(e) {
        if (!isMobile) {
            cursor.style.display = "block";
            cursor.style.opacity = "1";
            mouseX = e.clientX;
            mouseY = e.clientY;
            // After first movement, we can use the regular handler
            document.removeEventListener("mousemove", onFirstMouseMove);
        }
    });

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
        // let anchorRect = null; // This variable is not used in this scope, can be removed or commented

        anchor.addEventListener("mouseenter", () => {
            isHovering = true;
            updateAnchorCursor(anchor);
        });

        anchor.addEventListener("mouseleave", () => {
            isHovering = false;
            // anchorRect = null; // Not needed here either

            // Reset styles with smooth transition
            dot.style.transition = `
                opacity ${fadeDuration * 2}ms,
                transform ${fadeDuration}ms ease,
                width ${fadeDuration / 2}ms ease,
                height ${fadeDuration / 2}ms ease,
                background-color ${fadeDuration}ms ease,
                background-image ${fadeDuration}ms ease, /* Add transition for gradient */
                border-radius ${fadeDuration}ms ease
            `;
            setDotScale(1);
            dot.style.width = "10px";
            dot.style.height = "10px";
            dot.style.borderRadius = "50%";
            dot.style.backgroundImage = "none"; // Remove gradient
            dot.style.backgroundColor = "#fff"; // Restore background color
            dot.style.opacity = "1";
            dot.style.padding = "0";

            // Resume normal cursor following
            isMoving = true;
        });

        anchor.addEventListener("mousemove", (e) => {
            if (isHovering) {
                mouseX = e.clientX;
                mouseY = e.clientY;
                isMoving = true; // Keep this true so the main loop knows to update
                updateAnchorCursor(anchor); // Update gradient position
            }
        });

        // Add scroll event listener specific to these nav icons if needed
        window.addEventListener("scroll", () => {
            if (isHovering) {
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
