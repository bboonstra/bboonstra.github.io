document.addEventListener("DOMContentLoaded", () => {
    // Initialize pathing if needed
    if (window.pathing && typeof window.pathing.init === "function") {
        window.pathing.init(
            "pk_927a2c5c19ef6b96d7ab99cea62a9e64aa2785e3c896283d"
        );
    }

    // Set up analytics tracking for social links
    const linkedinLink = document.getElementById("linkedin-link");
    const githubLink = document.getElementById("github-link");
    const emailLink = document.getElementById("email-link");

    // LinkedIn tracking
    if (linkedinLink && window.pathing && window.pathing.link) {
        window.pathing.link.button(linkedinLink, {
            location: "homepage",
            action: "linkedin_click",
            category: "social_link",
        });
    }

    // GitHub tracking
    if (githubLink && window.pathing && window.pathing.link) {
        window.pathing.link.button(githubLink, {
            location: "homepage",
            action: "github_click",
            category: "social_link",
        });
    }

    // Email tracking
    if (emailLink && window.pathing && window.pathing.link) {
        window.pathing.link.button(emailLink, {
            location: "homepage",
            action: "email_click",
            category: "social_link",
        });
    }
    console.log("Analytics state:");
    console.log("window.pathing:", window.pathing);
    console.log("window.pathing.init:", window.pathing.init);
    console.log("window.pathing.link:", window.pathing.link);
    console.log("window.pathing.link.button:", window.pathing.link.button);
});
