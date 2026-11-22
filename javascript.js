
document.addEventListener("DOMContentLoaded", function () {

    // Mobile navigation
    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.getElementById("nav-links");

    if (menuToggle && navLinks) {

        menuToggle.addEventListener("click", function () {
            navLinks.classList.toggle("active");
        });

        // Close mobile menu after clicking a navigation link
        const navigationLinks = navLinks.querySelectorAll("a");

        navigationLinks.forEach(function (link) {
            link.addEventListener("click", function () {
                navLinks.classList.remove("active");
            });
        });

    }

    // Automatically update copyright year
    const currentYear = document.getElementById("current-year");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // Back-to-top button
    const backToTop = document.getElementById("back-to-top");

    if (backToTop) {

        window.addEventListener("scroll", function () {

            if (window.scrollY > 400) {
                backToTop.classList.add("visible");
            } else {
                backToTop.classList.remove("visible");
            }

        });

        backToTop.addEventListener("click", function () {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });

    }

    // Smooth navigation
    const allNavigationLinks = document.querySelectorAll('a[href^="#"]');

    allNavigationLinks.forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetId = link.getAttribute("href");

            if (targetId === "#") {
                return;
            }

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                event.preventDefault();

                targetElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }

        });

    });

    console.log("Anam Hashmat Portfolio Loaded Successfully!");

});
