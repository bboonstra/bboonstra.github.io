const items = document.querySelectorAll('.gallery-item');
const descriptionBox = document.getElementById('item-description');

items.forEach(item => {
    item.addEventListener('mouseenter', () => {
        descriptionBox.textContent = item.getAttribute('data-description');
    });

    item.addEventListener('mouseleave', () => {
        descriptionBox.textContent = '';
    });

    item.addEventListener('click', () => {
        const anchor = item.getAttribute('data-anchor');
        if (anchor) {
            const targetSection = document.querySelector(anchor);
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
                setTimeout(() => {targetSection.classList.remove('section-highlight');
                                      targetSection.classList.add('section-dehighlight');}, 1000)
                setTimeout(() => {targetSection.classList.remove('section-dehighlight');}, 2000)
            }
        }
    });
});

const bubbles = document.querySelectorAll('.bubble');
const container = document.querySelector('.bubble-container');
const containerWidth = container.clientWidth;
const containerHeight = container.clientHeight;

function randomPosition() {
    bubbles.forEach(bubble => {
        const bubbleWidth = bubble.offsetWidth;
        const bubbleHeight = bubble.offsetHeight;

        // Generate random positions within the container
        const x = Math.random() * (containerWidth - bubbleWidth);
        const y = Math.random() * (containerHeight - bubbleHeight);

        bubble.style.left = `${x}px`;
        bubble.style.top = `${y}px`;

        // Generate random speed and direction
        const speedX = (Math.random() - 0.5) * 2; // Speed between -1 and 1
        const speedY = (Math.random() - 0.5) * 2; // Speed between -1 and 1

        moveBubble(bubble, speedX, speedY);
    });
}

function moveBubble(bubble, speedX, speedY) {
    let x = parseFloat(bubble.style.left);
    let y = parseFloat(bubble.style.top);

    function animate() {
        x += speedX;
        y += speedY;

        // Bounce off the edges
        if (x < 0 || x + bubble.offsetWidth > containerWidth) {
            speedX *= -1; // Reverse direction
        }
        if (y < 0 || y + bubble.offsetHeight > containerHeight) {
            speedY *= -1; // Reverse direction
        }

        bubble.style.left = `${x}px`;
        bubble.style.top = `${y}px`;

        requestAnimationFrame(animate); // Repeat the animation
    }

    animate();
}

// Initialize random positions and start movement
randomPosition();

bubbles.forEach(bubble => {
    bubble.addEventListener('click', () => {
        // Animate pop effect
        bubble.classList.add('pop');

        // Redirect to the anchor after a short delay
        setTimeout(() => {
            const anchor = bubble.getAttribute('data-anchor');
            if (anchor) {
                const targetSection = document.querySelector(anchor);
                if (targetSection) {
                    targetSection.scrollIntoView({block: "center",
                    inline: "center",
                    behavior: "smooth", alignToTop: false});
                    targetSection.classList.add('section-highlight');
                    setTimeout(() => {targetSection.classList.remove('section-highlight');
                                      targetSection.classList.add('section-dehighlight');}, 1000)
                    setTimeout(() => {targetSection.classList.remove('section-dehighlight');}, 2000)
                }
            }
        }, 200); // Delay for pop effect

        // Reform the bubbles after 10-20 seconds
        setTimeout(() => {
            bubble.style.display = 'block'; // Show the bubble again
            bubble.classList.remove('pop'); // Remove pop class
            randomPosition(); // Reset position
        }, 10000 + Math.random() * 10000); // Random delay between 10 and 20 seconds
    });
});

