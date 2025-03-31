document.addEventListener("DOMContentLoaded", () => {
    const scrollPrompt = document.getElementById("scroll-prompt");
    let hasScrolled = false;
    let promptTimer;

    // Function to show the prompt if the user hasn't scrolled
    const showPromptIfNeeded = () => {
        if (!hasScrolled && window.scrollY < 10) {
            // Check scrollY just in case
            scrollPrompt.classList.add("visible");
        }
    };

    // Function to handle the first scroll event
    const handleFirstScroll = () => {
        if (window.scrollY > 10) {
            // Check for meaningful scroll
            hasScrolled = true;
            // Hide the prompt if it's visible
            if (scrollPrompt.classList.contains("visible")) {
                scrollPrompt.classList.remove("visible");
            }
            // Clear the timer if the user scrolls before 10 seconds
            clearTimeout(promptTimer);
            // Remove the scroll listener after the first scroll
            window.removeEventListener("scroll", handleFirstScroll);
        }
    };

    // Set a timer to show the prompt after 10 seconds
    promptTimer = setTimeout(showPromptIfNeeded, 10000); // 10 seconds

    // Listen for scroll events
    window.addEventListener("scroll", handleFirstScroll, { passive: true });

    // Initial check in case the page loads already scrolled (e.g., refresh)
    if (window.scrollY > 10) {
        hasScrolled = true;
        clearTimeout(promptTimer);
        window.removeEventListener("scroll", handleFirstScroll);
    }
});
