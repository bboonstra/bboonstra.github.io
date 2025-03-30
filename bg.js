const canvas = document.getElementById("bg-canvas");
const ctx = canvas.getContext("2d");
let shapes = [];
let mouse = { x: 0, y: 0 };

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
    const numSquaresTall = 10;
    const size = canvas.height / numSquaresTall; // Calculate size based on height
    for (let x = 0; x < canvas.width; x += size) {
        for (let y = 0; y < canvas.height; y += size) {
            shapes.push({
                x,
                y,
                width: size,
                height: size,
                opacity: 0,
            });
        }
    }
}

function drawShapes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let shape of shapes) {
        const isHovered =
            (mouse.x !== 0 || mouse.y !== 0) &&
            mouse.x >= shape.x &&
            mouse.x <= shape.x + shape.width &&
            mouse.y >= shape.y &&
            mouse.y <= shape.y + shape.height &&
            dot.style.opacity != "0";
        // Smooth transition
        shape.opacity = isHovered ? 0.25 : shape.opacity;
        shape.opacity -= 0.01;
        shape.opacity = Math.max(shape.opacity, 0);

        ctx.beginPath();
        ctx.rect(shape.x, shape.y, shape.width, shape.height);
        ctx.fillStyle = `rgba(255, 255, 255, ${shape.opacity})`;
        ctx.fill();

        // Add a minimalist border
        ctx.lineWidth = 1; // Set the border width
        ctx.strokeStyle = "rgba(255, 255, 255, 0.05)"; // Set the border color and opacity
        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    }

    requestAnimationFrame(drawShapes);
}

generateShapes();
drawShapes();
