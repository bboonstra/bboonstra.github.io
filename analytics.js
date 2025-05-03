document.addEventListener("DOMContentLoaded", () => {
    window.pathing.init("pk_927a2c5c19ef6b96d7ab99cea62a9e64aa2785e3c896283d");

    const linkedinLink = document.getElementById("linkedin-link");
    const githubLink = document.getElementById("github-link");
    const emailLink = document.getElementById("email-link");

    window.pathing.link.button(linkedinLink, {
        location: "homepage",
        action: "linkedin_click",
        category: "social_link",
    });

    window.pathing.link.button(githubLink, {
        location: "homepage",
        action: "github_click",
        category: "social_link",
    });

    window.pathing.link.button(emailLink, {
        location: "homepage",
        action: "email_click",
        category: "social_link",
    });
});
