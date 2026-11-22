/* =========================================
   ANAM HASHMAT PORTFOLIO
   JavaScript Functionality
========================================= */


// =========================================
// MOBILE NAVIGATION
// =========================================

const menuToggle = document.getElementById("menu-toggle");

const navLinks = document.getElementById("nav-links");


menuToggle.addEventListener("click", () => {

    const isOpen = navLinks.classList.toggle("open");

    menuToggle.setAttribute(
        "aria-expanded",
        String(isOpen)
    );

    menuToggle.innerHTML = isOpen
        ? '<i class="fa-solid fa-xmark"></i>'
        : '<i class="fa-solid fa-bars"></i>';

});


// Close mobile menu after clicking a link

const navItems = document.querySelectorAll(".nav-link");

navItems.forEach(link => {

    link.addEventListener("click", () => {

        navLinks.classList.remove("open");

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        menuToggle.innerHTML =
            '<i class="fa-solid fa-bars"></i>';

    });

});


// =========================================
// AUTOMATIC FOOTER YEAR
// =========================================

document.getElementById("year").textContent =
    new Date().getFullYear();


// =========================================
// SCROLL REVEAL ANIMATIONS
// =========================================

const revealObserver = new IntersectionObserver(

    entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");

                revealObserver.unobserve(entry.target);

            }

        });

    },

    {
        threshold: 0.12
    }

);


document.querySelectorAll(".reveal").forEach(element => {

    revealObserver.observe(element);

});


// =========================================
// ACTIVE NAVIGATION SECTION
// =========================================

const sectionObserver = new IntersectionObserver(

    entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                const sectionId = entry.target.id;

                navItems.forEach(link => {

                    link.classList.toggle(
                        "active",
                        link.getAttribute("href") === `#${sectionId}`
                    );

                });

            }

        });

    },

    {
        rootMargin: "-35% 0px -55% 0px"
    }

);


document.querySelectorAll("main section[id]").forEach(section => {

    sectionObserver.observe(section);

});


// =========================================
// BACK TO TOP BUTTON
// =========================================

const backToTop = document.getElementById("back-to-top");


window.addEventListener("scroll", () => {

    backToTop.classList.toggle(
        "visible",
        window.scrollY > 450
    );

});


backToTop.addEventListener("click", () => {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

});