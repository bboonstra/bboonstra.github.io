document.addEventListener("DOMContentLoaded", () => {
    // Get the actual pathing object
    const pathingObj = window.pathing?.pathing;

    // Initialize pathing if needed
    if (pathingObj && typeof pathingObj.init === "function") {
        pathingObj.init("pk_927a2c5c19ef6b96d7ab99cea62a9e64aa2785e3c896283d");
    }

    // Set up analytics tracking for social links
    const linkedinLink = document.getElementById("linkedin-link");
    const githubLink = document.getElementById("github-link");
    const emailLink = document.getElementById("email-link");

    // LinkedIn tracking
    if (linkedinLink && pathingObj && pathingObj.link) {
        pathingObj.link.button(linkedinLink, {
            location: "homepage",
            action: "linkedin_click",
            category: "social_link",
        });
    }

    // GitHub tracking
    if (githubLink && pathingObj && pathingObj.link) {
        pathingObj.link.button(githubLink, {
            location: "homepage",
            action: "github_click",
            category: "social_link",
        });
    }

    // Email tracking
    if (emailLink && pathingObj && pathingObj.link) {
        pathingObj.link.button(emailLink, {
            location: "homepage",
            action: "email_click",
            category: "social_link",
        });
    }
});
