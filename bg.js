const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");
let shapes = [];
let mouse = { x: 0, y: 0 };
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
});

window.addEventListener("mousemove", (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

function generateShapes() {
    shapes = [];
    const isMobile = window.innerWidth <= 768;

    // Use fewer squares for mobile
    const numSquaresTall = isMobile ? 5 : 10;
    const size = canvas.height / numSquaresTall; // Calculate size based on height

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
}

function drawShapes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const isMobile = window.innerWidth <= 768;
    const numSquaresTall = isMobile ? 5 : 10;
    const size = canvas.height / numSquaresTall;

    // Only implement the "bb" pattern on desktop
    const bbPattern = !isMobile
        ? [
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
          ]
        : [];

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

    // Only process animation if we're past the delay period and not yet complete
    if (!animationDelayed && !animationComplete) {
        const animationDuration = 1000; // Animation takes 1 second
        const elapsedTime = currentTime - animationStartTime;
        const animationProgress = Math.min(elapsedTime / animationDuration, 1);

        if (animationProgress >= 1) {
            animationComplete = true;
        }

        // Reveal shapes in a diagonal wave pattern from top-left to bottom-right
        for (let shape of shapes) {
            // Calculate when this shape should appear based on its position
            // The sum of row and column creates a diagonal wave effect
            const positionValue = shape.row + shape.col;
            const maxPositionValue = numColumns + numSquaresTall - 2; // Maximum possible sum of row+col
            const normalizedPosition = positionValue / maxPositionValue;

            // Determine if this shape should be revealed yet
            if (animationProgress >= normalizedPosition) {
                shape.revealed = true;
            }
        }
    }

    // On mobile, use touch position instead of dot cursor for hover detection
    let touchX = 0;
    let touchY = 0;

    if (isMobile) {
        // Get the last known touch position
        if (
            window.lastTouchX !== undefined &&
            window.lastTouchY !== undefined
        ) {
            touchX = window.lastTouchX;
            touchY = window.lastTouchY;
        }

        for (let shape of shapes) {
            // Skip shapes that haven't been revealed yet during the initial animation
            if (animationDelayed || (!animationComplete && !shape.revealed)) {
                continue;
            }

            // Check for touch/tap based hover
            const isTouched =
                touchX !== 0 &&
                touchY !== 0 &&
                touchX > shape.x &&
                touchX < shape.x + shape.width &&
                touchY > shape.y &&
                touchY < shape.y + shape.height;

            if (isTouched) {
                shape.opacity = 0.25;
            } else {
                shape.opacity -= 0.01;
            }

            shape.opacity = Math.max(shape.opacity, 0);

            // Check if the shape is part of the "bb" pattern
            // Adjust for offset when checking pattern
            const isBB = bbPattern.some(
                (bb) =>
                    Math.floor((shape.x - offsetX) / shape.width) === bb.x &&
                    Math.floor(shape.y / shape.height) === bb.y
            );

            // Adjust opacity and fade rate for "bb" pattern
            if (isBB) {
                shape.opacity = isTouched ? 0.5 : shape.opacity;
                shape.opacity -= 0.002; // Slower fade
            } else {
                shape.opacity = isTouched ? 0.25 : shape.opacity;
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
    } else {
        // Keep existing desktop hover behavior
        for (let shape of shapes) {
            // Skip shapes that haven't been revealed yet during the initial animation
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
    }

    requestAnimationFrame(drawShapes);
}

generateShapes();
drawShapes();

// Add touch event handling for mobile
window.lastTouchX = 0;
window.lastTouchY = 0;

window.addEventListener("touchstart", (event) => {
    if (event.touches.length > 0) {
        window.lastTouchX = event.touches[0].clientX;
        window.lastTouchY = event.touches[0].clientY;
    }
});

window.addEventListener("touchmove", (event) => {
    if (event.touches.length > 0) {
        window.lastTouchX = event.touches[0].clientX;
        window.lastTouchY = event.touches[0].clientY;
    }
});

window.addEventListener("touchend", () => {
    // Reset after a delay to allow for shape lighting up
    setTimeout(() => {
        window.lastTouchX = 0;
        window.lastTouchY = 0;
    }, 300);
});

function favi() {
    const size = 128; // Display size of the square
    const resolutionMultiplier = 1.5; // Increase this for higher resolution
    const highResSize = size * resolutionMultiplier; // High-resolution size
    const backgroundSize = size * 2; // Size of the background

    // Create and style background div
    const backgroundDiv = document.createElement("div");
    Object.assign(backgroundDiv.style, {
        width: `${backgroundSize}px`,
        height: `${backgroundSize}px`,
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: "9998",
        backgroundColor: "rgba(24, 24, 24, 1)",
        borderRadius: "24px",
    });

    // Create and style text element
    const textElement = document.createElement("p");
    textElement.textContent = "bb";
    Object.assign(textElement.style, {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: "10000",
        fontFamily: '"Hack Nerd Font", monospace',
        fontSize: "64px",
        color: "#ffe9dd",
        margin: "0",
        padding: "1px",
    });

    // Append text element to body to measure its bounding box
    document.body.appendChild(textElement);

    // Measure the bounding box of the text element
    const textRect = textElement.getBoundingClientRect();
    const textX = textRect.left - (window.innerWidth - size) / 2;
    const textY = textRect.top - (window.innerHeight - size) / 2;
    const textWidth = textRect.width;
    const textHeight = textRect.height;

    // Create and style high-resolution canvas
    const canvas = document.createElement("canvas");
    canvas.width = highResSize;
    canvas.height = highResSize;
    Object.assign(canvas.style, {
        width: `${size}px`, // Display size
        height: `${size}px`, // Display size
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        zIndex: "9999",
        borderRadius: "12px",
        padding: "0px",
    });

    // Draw on high-resolution canvas
    const ctx = canvas.getContext("2d");
    ctx.scale(resolutionMultiplier, resolutionMultiplier); // Scale context for high resolution
    ctx.fillStyle = "rgba(24, 24, 24, 1)";
    ctx.fillRect(0, 0, size, size);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
    ctx.lineWidth = 2 / resolutionMultiplier; // Adjust line width for high resolution

    // Draw lines from the edges of the text box to the edges of the canvas
    // Top line
    ctx.beginPath();
    ctx.moveTo(0, textY);
    ctx.lineTo(size, textY);
    ctx.stroke();

    // Bottom line
    ctx.beginPath();
    ctx.moveTo(0, textY + textHeight);
    ctx.lineTo(size, textY + textHeight);
    ctx.stroke();

    // Left line
    ctx.beginPath();
    ctx.moveTo(textX, 0);
    ctx.lineTo(textX, size);
    ctx.stroke();

    // Right line
    ctx.beginPath();
    ctx.moveTo(textX + textWidth, 0);
    ctx.lineTo(textX + textWidth, size);
    ctx.stroke();

    // Append elements to body
    document.body.appendChild(backgroundDiv);
    document.body.appendChild(canvas);
}
window.favi = favi;
