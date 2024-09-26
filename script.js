function goToAndHighlight(anchor) {
    const targetSection = document.querySelector(anchor);
    if (targetSection) {
        if (getComputedStyle(targetSection).display === 'none') {
            targetSection.style.display = 'block';
            targetSection.classList.add("show");
        }        
        targetSection.scrollIntoView({ block: 'center', behavior: 'smooth' });
        targetSection.classList.add('highlight');
        setTimeout(() => {
            targetSection.classList.remove('highlight');
            targetSection.classList.add('dehighlight');
        }, 2000);
        setTimeout(() => {
            targetSection.classList.remove('dehighlight');
        }, 3000);
    }
}

const items = document.querySelectorAll('.gallery-item');
const descriptionBox = document.getElementById('item-description');

items.forEach(item => {
    item.addEventListener('mouseenter', () => {
        descriptionBox.textContent = item.getAttribute('data-description');
    });
    item.addEventListener('mouseleave', () => {
        descriptionBox.textContent = '';
    });
    item.addEventListener('touchstart', () => {
        descriptionBox.textContent = item.getAttribute('data-description');
    });
    item.addEventListener('click', () => {
        const anchor = item.getAttribute('data-anchor');
        if (anchor) {
            goToAndHighlight(anchor);
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
        const x = Math.random() * (containerWidth - bubbleWidth);
        const y = Math.random() * (containerHeight - bubbleHeight);
        bubble.style.left = `${x}px`;
        bubble.style.top = `${y}px`;
        const speedX = (Math.random() - 0.5) * 2;
        const speedY = (Math.random() - 0.5) * 2;
        moveBubble(bubble, speedX, speedY);
    });
}

function moveBubble(bubble, speedX, speedY) {
    let x = parseFloat(bubble.style.left);
    let y = parseFloat(bubble.style.top);
    
    function animate() {
        x += speedX;
        y += speedY;
        if (x < 0 || x + bubble.offsetWidth > containerWidth) {
            speedX *= -1;
        }
        if (y < 0 || y + bubble.offsetHeight > containerHeight) {
            speedY *= -1;
        }
        bubble.style.left = `${x}px`;
        bubble.style.top = `${y}px`;
        requestAnimationFrame(animate);
    }
    
    animate();
}

randomPosition();

bubbles.forEach(bubble => {
    bubble.addEventListener('click', () => {
        bubble.classList.add('pop');
        setTimeout(() => {
            const anchor = bubble.getAttribute('data-anchor');
            if (anchor) {
                goToAndHighlight(anchor);
            }
        }, 200);
        setTimeout(() => {
            bubble.style.display = 'block';
            bubble.classList.remove('pop');
        }, 10000 + Math.random() * 10000);
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const projects = document.querySelectorAll(".project-item");
    const loadMoreButton = document.getElementById("load-more");
    const projectsToLoad = 4;
    let currentIndex = 0;

    function loadProjects() {
        const endIndex = currentIndex + projectsToLoad;
        for (let i = currentIndex; i < endIndex && i < projects.length; i++) {
            projects[i].style.display = "block";
            setTimeout(() => {
                projects[i].classList.add("show");
            }, 10);
        }
        currentIndex += projectsToLoad;
        if (currentIndex >= projects.length) {
            loadMoreButton.style.display = "none";
        }
    }

    loadProjects();
    loadMoreButton.addEventListener("click", loadProjects);
});
