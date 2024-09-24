// Function to go to and highlight a target section
function goToAndHighlight(anchor) {
    const targetSection = document.querySelector(anchor);
    if (targetSection) {
        targetSection.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth', alignToTop: false });
        targetSection.classList.add('section-highlight');
        
        // Remove highlight after 1 second and add dehighlight class
        setTimeout(() => {
            targetSection.classList.remove('section-highlight');
            targetSection.classList.add('section-dehighlight');
        }, 1000);

        // Remove dehighlight class after another second
        setTimeout(() => {
            targetSection.classList.remove('section-dehighlight');
        }, 2000);
    }
}

// Event listeners for gallery items
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
            goToAndHighlight(anchor); // Use the new function to handle scrolling and highlighting
        }
    });
});

// Function to initialize random positions and start moving the bubbles
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

        moveBubble(bubble, speedX, speedY); // Start bubble movement
    });
}

// Function to move a bubble and make it bounce within the container
function moveBubble(bubble, speedX, speedY) {
    let x = parseFloat(bubble.style.left);
    let y = parseFloat(bubble.style.top);

    function animate() {
        x += speedX;
        y += speedY;

        // Bounce off the edges of the container
        if (x < 0 || x + bubble.offsetWidth > containerWidth) {
            speedX *= -1; // Reverse horizontal direction
        }
        if (y < 0 || y + bubble.offsetHeight > containerHeight) {
            speedY *= -1; // Reverse vertical direction
        }

        bubble.style.left = `${x}px`;
        bubble.style.top = `${y}px`;

        requestAnimationFrame(animate); // Continue the animation
    }

    animate(); // Start the animation
}

// Initialize random positions and start the movement
randomPosition();

// Event listeners for bubbles
bubbles.forEach(bubble => {
    bubble.addEventListener('click', () => {
        // Animate the pop effect
        bubble.classList.add('pop');

        // Delay for the pop effect before scrolling
        setTimeout(() => {
            const anchor = bubble.getAttribute('data-anchor');
            if (anchor) {
                goToAndHighlight(anchor); // Use the new function to scroll and highlight
            }
        }, 200); // Delay for pop effect

        // Reform the bubbles after 10-20 seconds
        setTimeout(() => {
            bubble.style.display = 'block'; // Show the bubble again
            bubble.classList.remove('pop'); // Remove the pop class
            randomPosition(); // Reset position
        }, 10000 + Math.random() * 10000); // Random delay between 10 and 20 seconds
    });
});
