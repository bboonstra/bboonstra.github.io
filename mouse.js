let inactivityTimer;
const fadeDuration = 300;
const dot = document.getElementById("dot-cursor");
const inactiveDuration = 3000;

let mouseX = 0;
let mouseY = 0;
let isMoving = false;

window.addEventListener("DOMContentLoaded", () => {
    dot.style.transition = `opacity ${fadeDuration}ms, transform ${fadeDuration}ms`;
});

function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    dot.style.opacity = "1";
    dot.style.transform = "scale(1)";
    inactivityTimer = setTimeout(() => {
        dot.style.opacity = "0";
        dot.style.transform = "scale(0)";
    }, inactiveDuration);
}

// 👇 Listen to mousemove and store coords
document.addEventListener("mousemove", function (e) {
    mouseX = e.pageX;
    mouseY = e.pageY;
    isMoving = true;
    dot.style.display = "block";
    resetInactivityTimer();
});

function updateCursor() {
    if (isMoving) {
        dot.style.left = `${mouseX}px`;
        dot.style.top = `${mouseY}px`;
        isMoving = false;
    }
    requestAnimationFrame(updateCursor);
}

// 👇 Start animation loop
requestAnimationFrame(updateCursor);

document.addEventListener("mouseleave", function () {
    dot.style.opacity = "0";
    dot.style.transform = "scale(0)";
});

document.addEventListener("mouseenter", function () {
    dot.style.opacity = "1";
    dot.style.transform = "scale(1)";
    resetInactivityTimer();
});

document.addEventListener("mousedown", function () {
    dot.style.transform = "scale(2.5)";
});

document.addEventListener("mouseup", function () {
    dot.style.transform = "scale(1)";
});

document.addEventListener("dragstart", function () {
    dot.style.display = "none";
});

document.addEventListener("dragend", function () {
    dot.style.display = "block";
});
