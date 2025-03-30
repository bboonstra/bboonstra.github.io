ådocument.addEventListener("DOMContentLoaded", () => {
    const socialIcons = document.querySelector(".social-icons");

    // Remove the fixed-socials div as we'll use canvas squares instead
    const fixedSocialsDiv = document.getElementById("fixed-socials");
    if (fixedSocialsDiv) {
        fixedSocialsDiv.remove();
    }

    // Function to check if the original social icons are visible
    function checkSocialIconsVisibility() {
        const rect = socialIcons.getBoundingClientRect();

        // Access the socialIcons array from bg.js
        if (typeof window.socialIcons !== "undefined") {
            const icons = window.socialIcons;

            // If the original social icons are above the viewport
            if (rect.bottom <= 0) {
                // Show icons with staggered animation and drop-in effect
                icons.forEach((icon, index) => {
                    // Start all icons from hidden
                    icon.visible = false;

                    // Then reveal them with a staggered delay
                    setTimeout(() => {
                        icon.visible = true;
                        // Trigger animation effect through canvas
                        icon.animating = true;

                        // Reset animation after a certain time
                        setTimeout(() => {
                            icon.animating = false;
                        }, 500);
                    }, index * 200); // Increased delay between icons
                });
            } else {
                // Hide all icons immediately
                icons.forEach((icon) => {
                    icon.visible = false;
                    icon.animating = false;
                });
            }
        }
    }

    // Listen for scroll events with debouncing for better performance
    let scrollTimeout;
    window.addEventListener("scroll", () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(checkSocialIconsVisibility, 100);
    });

    // Check visibility on page load
    checkSocialIconsVisibility();
});
