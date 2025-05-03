document.addEventListener("DOMContentLoaded", () => {
    // Set up analytics tracking for social links
    const linkedinLink = document.getElementById("linkedin-link");
    const githubLink = document.getElementById("github-link");
    const emailLink = document.getElementById("email-link");

    // LinkedIn tracking
    if (linkedinLink) {
        pathing.link.button(linkedinLink, {
            location: "homepage",
            action: "linkedin_click",
            category: "social_link",
        });
    }

    // GitHub tracking
    if (githubLink) {
        pathing.link.button(githubLink, {
            location: "homepage",
            action: "github_click",
            category: "social_link",
        });
    }

    // Email tracking
    if (emailLink) {
        pathing.link.button(emailLink, {
            location: "homepage",
            action: "email_click",
            category: "social_link",
        });
    }
});
