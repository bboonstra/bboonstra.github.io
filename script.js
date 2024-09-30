const texts = [
    // max length cutoff  |v|
    "Coding since 2nd grade",
    "Robotics co-captain",
    "Award-winning game dev",
    "AI-integrated projects",
    "Cybersecurity defender",
    "Full-stack developer",
    "Lead programmer",
    "Back-end builder",
    "Database architect",
    "NASDAQ outperformer",
    "Machine learner",
    "Front-end wizard",
    "Problem-solver",
    "Algorithm optimizer",
    "Project manager",
    "Open-source contributor",
    "UI-UX designer",
    "Python powerhouse",
    "Raspberry Pi lover",
    "MacBook master",
    "Academic letter...er",
    "API engineer",
    "Unit tester",
    "Command-line interfacer",
    "code cool stuff",
    "okay thats it",
];

let currentIndex = 0;
const dynamicTextElement = document.getElementById('dynamic-text');

/* best. anim. ever. */
async function typeText() {
    const text = texts[currentIndex];
    let index = 0;
    dynamicTextElement.textContent = ''

    // Typing the text
    async function typeCharacter() {
        if (index < text.length) {
            dynamicTextElement.textContent += text.charAt(index);
            index++;
            setTimeout(typeCharacter, 80);
        } else {
            setTimeout(deleteCharacter, 1500);
        }
    }

    // Deleting the text
    async function deleteCharacter() {
        if (index > 0) {
            dynamicTextElement.textContent = dynamicTextElement.textContent.slice(0, -1);
            index--;
            setTimeout(deleteCharacter, 35);
        } else {
            // Move to the next text after deleting
            currentIndex = (currentIndex + 1) % texts.length;
            setTimeout(typeText, 200);
        }
    }
    
    typeCharacter();
}
setTimeout(typeText, 5000); // wait for the initial anim first

document.getElementById('read-more-btn').addEventListener('click', function() {
    const additionalText = document.getElementById('additional-text');

    // Toggle visibility
    if (additionalText.style.height === '0px' || additionalText.style.height === '') {
        additionalText.style.display = 'block'; // Show the content
        setTimeout(() => {
            additionalText.style.height = additionalText.scrollHeight + 'px'; // Set height to full content height
            additionalText.style.opacity = '1'; // Make it visible
        }, 10); // Timeout to ensure display is set before animation
        document.getElementById('read-more-btn').innerText = 'Click me if you hate reading';
        
        // Adjust font size based on screen size
        if (window.matchMedia("(max-width: 768px)").matches) { // Change this value according to your breakpoint
            document.getElementById('dynamic-text').style.fontSize = '5vw'; // Mobile size
        } else {
            document.getElementById('dynamic-text').style.fontSize = '3.5vw'; // Desktop size
        }
    } else {
        additionalText.style.height = '0px'; // Animate height to 0
        additionalText.style.opacity = '0'; // Fade out
        setTimeout(() => {
            additionalText.style.display = 'none'; // Hide after the fade-out animation
        }, 300); // Match this duration with the transition time
        document.getElementById('read-more-btn').innerText = 'Click me if you like reading';

        // Adjust font size based on screen size
        if (window.matchMedia("(max-width: 768px)").matches) { // Change this value according to your breakpoint
            document.getElementById('dynamic-text').style.fontSize = '7vw'; // Mobile size
        } else {
            document.getElementById('dynamic-text').style.fontSize = '6vw'; // Desktop size
        }
    }
});

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
