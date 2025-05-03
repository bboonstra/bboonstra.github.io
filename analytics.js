// Import pathing from the script
import pathing from "https://www.pathing.cc/pathing.js";

document.addEventListener("DOMContentLoaded", () => {
    // Initialize pathing if needed
    if (pathing && typeof pathing.init === "function") {
        pathing.init("pk_927a2c5c19ef6b96d7ab99cea62a9e64aa2785e3c896283d");
    }

    // Set up analytics tracking for social links
    const linkedinLink = document.getElementById("linkedin-link");
    const githubLink = document.getElementById("github-link");
    const emailLink = document.getElementById("email-link");

    // LinkedIn tracking
    if (linkedinLink && pathing && pathing.link) {
        pathing.link.button(linkedinLink, {
            location: "homepage",
            action: "linkedin_click",
            category: "social_link",
        });
    }

    // GitHub tracking
    if (githubLink && pathing && pathing.link) {
        pathing.link.button(githubLink, {
            location: "homepage",
            action: "github_click",
            category: "social_link",
        });
    }

    // Email tracking
    if (emailLink && pathing && pathing.link) {
        pathing.link.button(emailLink, {
            location: "homepage",
            action: "email_click",
            category: "social_link",
        });
    }
});
