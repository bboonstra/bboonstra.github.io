document.addEventListener("DOMContentLoaded", () => {
    // Wait for pathing to be available
    const checkForPathing = () => {
        if (
            window.pathing &&
            window.pathing.link &&
            window.pathing.link.button
        ) {
            // Set up analytics tracking for social links
            const linkedinLink = document.getElementById("linkedin-link");
            const githubLink = document.getElementById("github-link");
            const emailLink = document.getElementById("email-link");

            // LinkedIn tracking
            if (linkedinLink) {
                window.pathing.link.button(linkedinLink, {
                    location: "homepage",
                    action: "linkedin_click",
                    category: "social_link",
                });
            }

            // GitHub tracking
            if (githubLink) {
                window.pathing.link.button(githubLink, {
                    location: "homepage",
                    action: "github_click",
                    category: "social_link",
                });
            }

            // Email tracking
            if (emailLink) {
                window.pathing.link.button(emailLink, {
                    location: "homepage",
                    action: "email_click",
                    category: "social_link",
                });
            }
        } else {
            // Try again after a short delay
            setTimeout(checkForPathing, 100);
        }
    };

    checkForPathing();
});
