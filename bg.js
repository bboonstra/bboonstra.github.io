const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");
let shapes = [];
let mouse = { x: 0, y: 0 };
let socialBoxes = [];
let animationComplete = false; // Flag to track if the initial animation is complete
let animationStartTime = null; // Track when the animation started
let animationDelayed = true; // Flag to track if we're still in the delay period
const initialDelay = 700; // delay before animation starts

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    generateShapes();
    updateSocialBoxes();
});

window.addEventListener("mousemove", (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

function generateShapes() {
    shapes = [];

    // Reduce the number of shapes on mobile for better performance
    const isMobile = window.innerWidth <= 768;
    const numSquaresTall = isMobile ? 6 : 10; // Fewer squares on mobile

    const size = canvas.height / numSquaresTall;

    // Calculate the number of full columns that fit the canvas width
    const numColumns = Math.floor(canvas.width / size) + 1;

    // Calculate the offset to center the grid
    const offsetX = (canvas.width - numColumns * size) / 2;

    for (let col = 0; col < numColumns; col++) {
        for (let row = 0; row < numSquaresTall; row++) {
            shapes.push({
                x: offsetX + col * size,
                y: row * size,
                width: size,
                height: size,
                opacity: 0,
                col: col, // Store column for animation sequencing
                row: row, // Store row for animation sequencing
                revealed: false, // Track if this shape has been revealed in the animation
            });
        }
    }

    // Set up for delayed animation
    animationComplete = false;
    animationDelayed = true;
    animationStartTime = performance.now();

    // Generate social boxes
    updateSocialBoxes();
}

function updateSocialBoxes() {
    socialBoxes = [];
    const navIcons = document.querySelector(".nav-social-icons");

    if (!navIcons) return;

    const numSquaresTall = 10;
    const size = canvas.height / numSquaresTall;

    // Calculate the same offset used in generateShapes
    const numColumns = Math.floor(canvas.width / size) + 1;
    const offsetX = (canvas.width - numColumns * size) / 2;

    const iconElements = navIcons.querySelectorAll("a");

    iconElements.forEach((icon) => {
        // Get the actual position of each social icon
        const rect = icon.getBoundingClientRect();

        // Find the grid position that contains this icon
        // Adjust for the offset when calculating grid position
        const xPos = Math.floor((rect.left - offsetX) / size);
        const yPos = Math.floor(rect.top / size);

        socialBoxes.push({
            x: offsetX + xPos * size,
            y: yPos * size,
            width: size,
            height: size,
            opacity: 0,
            visible: false,
            element: icon,
        });
    });
}

function drawShapes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Check if on mobile
    const isMobile = window.innerWidth <= 768;

    // If on mobile, skip easter egg animations
    if (isMobile) {
        // Skip the easter egg animation logic
        for (let shape of shapes) {
            shape.revealed = true; // Reveal all shapes immediately
        }
    } else {
        // Existing animation logic for desktop
        // Only process animation if we're past the delay period and not yet complete
        if (!animationDelayed && !animationComplete) {
            const animationDuration = 1000; // Animation takes 1 second
            const elapsedTime = currentTime - animationStartTime;
            const animationProgress = Math.min(
                elapsedTime / animationDuration,
                1
            );

            if (animationProgress >= 1) {
                animationComplete = true;
            }

            // Reveal shapes in a diagonal wave pattern from top-left to bottom-right
            for (let shape of shapes) {
                // Calculate when this shape should appear based on its position
                const positionValue = shape.row + shape.col;
                const maxPositionValue = numColumns + numSquaresTall - 2; // Maximum possible sum of row+col
                const normalizedPosition = positionValue / maxPositionValue;

                // Determine if this shape should be revealed yet
                if (animationProgress >= normalizedPosition) {
                    shape.revealed = true;
                }
            }
        }
    }

    // Define the "bb" pattern in the bottom left with stems
    const numSquaresTall = 10;
    const size = canvas.height / numSquaresTall;
    const bbPattern = [
        { x: 0, y: 5 },
        { x: 0, y: 6 },
        { x: 0, y: 7 },
        { x: 0, y: 8 },
        { x: 0, y: 9 }, // First "b" stem
        { x: 1, y: 7 },
        { x: 1, y: 9 },
        { x: 2, y: 8 },
        { x: 4, y: 5 },
        { x: 4, y: 6 },
        { x: 4, y: 7 },
        { x: 4, y: 8 },
        { x: 4, y: 9 }, // Second "b" stem
        { x: 5, y: 7 },
        { x: 5, y: 9 },
        { x: 6, y: 8 },
    ];

    // Calculate the same offset used in generateShapes
    const numColumns = Math.floor(canvas.width / size) + 1;
    const offsetX = (canvas.width - numColumns * size) / 2;

    // Get the dot element and its properties
    const dotElement = document.getElementById("dot-cursor");
    const dotStyle = window.getComputedStyle(dotElement);
    const dotWidth = parseFloat(dotStyle.width);
    const dotHeight = parseFloat(dotStyle.height);
    const dotScale = parseFloat(
        dotStyle.transform.split("scale(")[1]?.split(")")[0] || "1"
    );

    // Get dot position from the element itself
    const dotRect = dotElement.getBoundingClientRect();
    const dotX = dotRect.left + dotRect.width / 2;
    const dotY = dotRect.top + dotRect.height / 2;

    // Calculate the effective size of the cursor for hover detection
    const effectiveWidth = dotWidth * dotScale;
    const effectiveHeight = dotHeight * dotScale;

    // Create a set to store drawn shape coordinates
    const drawnShapes = new Set();

    // Handle the initial loading animation with delay
    const currentTime = performance.now();

    // Check if we need to wait for the initial delay
    if (animationDelayed) {
        if (currentTime - animationStartTime >= initialDelay) {
            // Delay period is over, start the actual animation
            animationDelayed = false;
            animationStartTime = currentTime; // Reset the start time for the animation itself
        }
    }

    for (let shape of shapes) {
        // Skip shapes that haven't been revealed yet during the initial animation
        // Also skip all shapes during the delay period
        if (animationDelayed || (!animationComplete && !shape.revealed)) {
            continue;
        }

        // Check for hover based on dot position and size instead of mouse
        const isHovered =
            dotElement.style.opacity != "0" &&
            (dotX !== 0 || dotY !== 0) &&
            Math.abs(dotX - (shape.x + shape.width / 2)) <
                effectiveWidth / 2 + shape.width / 2 &&
            Math.abs(dotY - (shape.y + shape.height / 2)) <
                effectiveHeight / 2 + shape.height / 2 &&
            effectiveWidth <= shape.width * 2 && // Only hover if cursor is not wider than 2 boxes
            effectiveHeight <= shape.height * 2; // Only hover if cursor is not taller than 2 boxes

        // Check if the shape is part of the "bb" pattern
        // Adjust for offset when checking pattern
        const isBB = bbPattern.some(
            (bb) =>
                Math.floor((shape.x - offsetX) / shape.width) === bb.x &&
                Math.floor(shape.y / shape.height) === bb.y
        );

        // Adjust opacity and fade rate for "bb" pattern
        if (isBB) {
            shape.opacity = isHovered ? 0.5 : shape.opacity;
            shape.opacity -= 0.002; // Slower fade
        } else {
            shape.opacity = isHovered ? 0.25 : shape.opacity;
            shape.opacity -= 0.01;
        }
        shape.opacity = Math.max(shape.opacity, 0);

        // Check if the shape at this position has already been drawn
        const shapeKey = `${shape.x},${shape.y}`;

        if (!drawnShapes.has(shapeKey)) {
            ctx.beginPath();
            ctx.rect(shape.x, shape.y, shape.width, shape.height);
            ctx.fillStyle = `rgba(255, 255, 255, ${shape.opacity})`;
            ctx.fill();

            // Add the shape coordinates to the set
            drawnShapes.add(shapeKey);
        }

        // Add a minimalist border
        ctx.lineWidth = 1; // Set the border width
        ctx.strokeStyle = "rgba(255, 255, 255, 0.05)"; // Set the border color and opacity
        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    }

    // Draw social boxes when they should be visible
    const navIcons = document.querySelector(".nav-social-icons");
    const socialVisible = navIcons && navIcons.style.opacity === "1";

    // Update and draw social boxes
    if (socialVisible) {
        socialBoxes.forEach((box, index) => {
            box.visible = true;

            // Check for hover based on dot position and size
            const isHovered =
                Math.abs(dotX - (box.x + box.width / 2)) <
                    effectiveWidth / 2 + box.width / 2 &&
                Math.abs(dotY - (box.y + box.height / 2)) <
                    effectiveHeight / 2 + box.height / 2 &&
                effectiveWidth <= box.width * 2 && // Only hover if cursor is not wider than 2 boxes
                effectiveHeight <= box.height * 2; // Only hover if cursor is not taller than 2 boxes

            if (isHovered) {
                box.opacity = 0.25;
            } else {
                box.opacity = Math.max(0, box.opacity - 0.01);
            }

            // Draw the social box
            ctx.beginPath();
            ctx.rect(box.x, box.y, box.width, box.height);
            ctx.fillStyle = `rgba(255, 255, 255, ${box.opacity})`;
            ctx.fill();
            ctx.lineWidth = 1;
            ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
            ctx.strokeRect(box.x, box.y, box.width, box.height);
        });
    } else {
        // Reset opacity for hidden social boxes
        socialBoxes.forEach((box) => {
            box.visible = false;
            box.opacity = 0;
        });
    }

    requestAnimationFrame(drawShapes);
}

generateShapes();
drawShapes();
