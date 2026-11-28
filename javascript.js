
document.addEventListener("DOMContentLoaded", () => {

    // ==========================================
    // ELEMENT REFERENCES
    // ==========================================

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    const pages = [
        ...document.querySelectorAll(".page-section[data-page]")
    ];

    const pageLinks = [
        ...document.querySelectorAll("[data-page-link]")
    ];

    const backToTop = document.getElementById("backToTop");
    const year = document.getElementById("year");

    const homePage = document.querySelector(
        '.page-section[data-page="home"]'
    );

    const homeVisual = document.querySelector(
        ".hero-visual-redesign"
    );

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    // ==========================================
    // FOOTER YEAR
    // ==========================================

    if (year) {
        year.textContent = new Date().getFullYear();
    }

    // ==========================================
    // HOME PAGE AI / ML ANIMATION
    // ==========================================

    let animationFrame = null;
    let canvas = null;
    let ctx = null;
    let animationRunning = false;
    let canvasWidth = 0;
    let canvasHeight = 0;
    let nodes = [];

    function addAnimationStyles() {

        if (document.getElementById("home-ai-animation-styles")) {
            return;
        }

        const style = document.createElement("style");

        style.id = "home-ai-animation-styles";

        style.textContent = `
            .hero-visual-redesign {
                position: relative;
                isolation: isolate;
            }

            .ai-neural-canvas {
                position: absolute;
                inset: 0;
                width: 100%;
                height: 100%;
                z-index: 0;
                pointer-events: none;
                overflow: visible;
            }

            .hero-visual-redesign > .profile-card {
                position: relative;
                z-index: 2;
            }

            .hero-visual-redesign .floating-info {
                z-index: 3;
            }

            @media (prefers-reduced-motion: reduce) {
                .ai-neural-canvas {
                    animation: none !important;
                }
            }
        `;

        document.head.appendChild(style);
    }

    function createNodes() {

        nodes = [];

        const totalNodes = Math.min(
            34,
            Math.max(20, Math.floor(canvasWidth / 14))
        );

        for (let i = 0; i < totalNodes; i++) {

            nodes.push({
                x: Math.random() * canvasWidth,
                y: Math.random() * canvasHeight,

                vx: (Math.random() - 0.5) * 0.35,
                vy: (Math.random() - 0.5) * 0.35,

                radius: Math.random() * 2.5 + 1.5,

                phase: Math.random() * Math.PI * 2,

                gold: Math.random() > 0.72
            });
        }
    }

    function resizeCanvas() {

        if (!canvas || !ctx || !homeVisual) return;

        const rect = homeVisual.getBoundingClientRect();

        if (!rect.width || !rect.height) return;

        const previousWidth = canvasWidth;

        canvasWidth = rect.width;
        canvasHeight = rect.height;

        const pixelRatio = Math.min(
            window.devicePixelRatio || 1,
            2
        );

        canvas.width = canvasWidth * pixelRatio;
        canvas.height = canvasHeight * pixelRatio;

        canvas.style.width = canvasWidth + "px";
        canvas.style.height = canvasHeight + "px";

        ctx.setTransform(
            pixelRatio,
            0,
            0,
            pixelRatio,
            0,
            0
        );

        if (!previousWidth || !nodes.length) {
            createNodes();
        } else {

            const scaleX = canvasWidth / previousWidth;

            nodes.forEach(node => {
                node.x *= scaleX;
            });
        }

        drawNetwork(false);
    }

    function drawNetwork(animate = true) {

        if (!ctx || !canvas) return;

        ctx.clearRect(
            0,
            0,
            canvasWidth,
            canvasHeight
        );

        // Subtle background glow

        const glow = ctx.createRadialGradient(
            canvasWidth / 2,
            canvasHeight / 2,
            10,
            canvasWidth / 2,
            canvasHeight / 2,
            canvasWidth * 0.55
        );

        glow.addColorStop(0, "rgba(85, 123, 100, 0.10)");
        glow.addColorStop(1, "rgba(85, 123, 100, 0)");

        ctx.fillStyle = glow;

        ctx.fillRect(
            0,
            0,
            canvasWidth,
            canvasHeight
        );

        // Update node positions

        nodes.forEach(node => {

            if (animate) {

                node.x += node.vx;
                node.y += node.vy;

                node.phase += 0.035;

                if (node.x < 5 || node.x > canvasWidth - 5) {
                    node.vx *= -1;
                }

                if (node.y < 5 || node.y > canvasHeight - 5) {
                    node.vy *= -1;
                }
            }
        });

        // Draw neural network connections

        const connectionDistance = 125;

        for (let i = 0; i < nodes.length; i++) {

            for (let j = i + 1; j < nodes.length; j++) {

                const a = nodes[i];
                const b = nodes[j];

                const dx = b.x - a.x;
                const dy = b.y - a.y;

                const distance = Math.sqrt(
                    dx * dx + dy * dy
                );

                if (distance < connectionDistance) {

                    const opacity =
                        (1 - distance / connectionDistance) * 0.32;

                    ctx.beginPath();

                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);

                    ctx.strokeStyle =
                        `rgba(85, 123, 100, ${opacity})`;

                    ctx.lineWidth = 1;

                    ctx.stroke();

                    // Small moving data pulse

                    if (animate && (i + j) % 5 === 0) {

                        const progress =
                            (performance.now() * 0.00025 + i * 0.13) % 1;

                        const pulseX =
                            a.x + (b.x - a.x) * progress;

                        const pulseY =
                            a.y + (b.y - a.y) * progress;

                        ctx.beginPath();

                        ctx.arc(
                            pulseX,
                            pulseY,
                            2,
                            0,
                            Math.PI * 2
                        );

                        ctx.fillStyle =
                            "rgba(177, 139, 80, 0.85)";

                        ctx.fill();
                    }
                }
            }
        }

        // Draw neural nodes

        nodes.forEach(node => {

            const pulse = animate
                ? Math.sin(node.phase) * 0.8
                : 0;

            const radius = node.radius + pulse * 0.5;

            const color = node.gold
                ? "177, 139, 80"
                : "85, 123, 100";

            // Outer glow

            ctx.beginPath();

            ctx.arc(
                node.x,
                node.y,
                radius * 3,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                `rgba(${color}, 0.09)`;

            ctx.fill();

            // Main node

            ctx.beginPath();

            ctx.arc(
                node.x,
                node.y,
                radius,
                0,
                Math.PI * 2
            );

            ctx.fillStyle =
                `rgba(${color}, 0.85)`;

            ctx.fill();
        });

        // AI / ML labels

        ctx.font = "700 9px Segoe UI, Arial";

        ctx.fillStyle = "rgba(85, 123, 100, 0.75)";

        ctx.textAlign = "left";

        ctx.fillText(
            "NEURAL NETWORK",
            12,
            20
        );

        ctx.textAlign = "right";

        ctx.fillStyle = "rgba(177, 139, 80, 0.85)";

        ctx.fillText(
            "MACHINE LEARNING",
            canvasWidth - 12,
            canvasHeight - 12
        );
    }

    function animateNetwork() {

        if (!animationRunning) return;

        if (
            !homePage ||
            !homePage.classList.contains("active") ||
            document.hidden
        ) {
            stopNetworkAnimation();
            return;
        }

        drawNetwork(true);

        animationFrame = requestAnimationFrame(
            animateNetwork
        );
    }

    function startNetworkAnimation() {

        if (!canvas || !ctx) return;

        if (
            !homePage ||
            !homePage.classList.contains("active")
        ) {
            return;
        }

        if (prefersReducedMotion) {
            drawNetwork(false);
            return;
        }

        if (animationRunning) return;

        animationRunning = true;

        animationFrame = requestAnimationFrame(
            animateNetwork
        );
    }

    function stopNetworkAnimation() {

        animationRunning = false;

        if (animationFrame !== null) {

            cancelAnimationFrame(animationFrame);

            animationFrame = null;
        }
    }

    function initializeHomeAnimation() {

        if (!homeVisual || !homePage) return;

        addAnimationStyles();

        canvas = document.createElement("canvas");

        canvas.className = "ai-neural-canvas";

        canvas.setAttribute("aria-hidden", "true");

        homeVisual.prepend(canvas);

        ctx = canvas.getContext("2d");

        if (!ctx) return;

        resizeCanvas();

        if ("ResizeObserver" in window) {

            const resizeObserver = new ResizeObserver(() => {
                resizeCanvas();
            });

            resizeObserver.observe(homeVisual);

        } else {

            window.addEventListener(
                "resize",
                resizeCanvas
            );
        }
    }

    // ==========================================
    // PAGE NAVIGATION
    // ==========================================

    function showPage(pageId, updateHistory = false) {

        const validPage = pages.some(
            page => page.dataset.page === pageId
        );

        const targetPage = validPage ? pageId : "home";

        pages.forEach(page => {

            const active =
                page.dataset.page === targetPage;

            page.classList.toggle("active", active);

            page.setAttribute(
                "aria-hidden",
                String(!active)
            );
        });

        pageLinks.forEach(link => {

            const active =
                link.dataset.pageLink === targetPage;

            // Match the existing CSS class

            link.classList.toggle("active", active);

            if (active) {

                link.setAttribute(
                    "aria-current",
                    "page"
                );

            } else {

                link.removeAttribute("aria-current");
            }
        });

        // Update URL

        if (
            updateHistory &&
            location.hash !== `#${targetPage}`
        ) {

            history.pushState(
                { page: targetPage },
                "",
                `#${targetPage}`
            );
        }

        // Close mobile menu

        if (navLinks) {
            navLinks.classList.remove("show");
        }

        if (menuToggle) {

            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );
        }

        // Stop animation outside Home

        stopNetworkAnimation();

        // Scroll to top

        window.scrollTo({
            top: 0,
            behavior: prefersReducedMotion ? "auto" : "smooth"
        });

        // Start animation only on Home

        if (targetPage === "home") {
            startNetworkAnimation();
        }

        requestAnimationFrame(() => {
            revealVisibleElements();
        });
    }

    function pageFromHash() {

        return (location.hash || "#home").slice(1);
    }

    // Navigation links

    pageLinks.forEach(link => {

        link.addEventListener("click", event => {

            const pageId = link.dataset.pageLink;

            if (!pageId) return;

            event.preventDefault();

            showPage(pageId, true);
        });
    });

    // Browser navigation

    window.addEventListener("hashchange", () => {

        showPage(pageFromHash());
    });

    window.addEventListener("popstate", () => {

        showPage(pageFromHash());
    });

    // ==========================================
    // MOBILE MENU
    // ==========================================

    if (menuToggle && navLinks) {

        menuToggle.addEventListener("click", () => {

            const isOpen = navLinks.classList.toggle("show");

            menuToggle.setAttribute(
                "aria-expanded",
                String(isOpen)
            );
        });
    }

    // ==========================================
    // BACK TO TOP
    // ==========================================

    if (backToTop) {

        window.addEventListener("scroll", () => {

            backToTop.classList.toggle(
                "visible",
                window.scrollY > 400
            );
        });

        backToTop.addEventListener("click", () => {

            window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion ? "auto" : "smooth"
            });
        });
    }

    // ==========================================
    // MODERN SCROLL ANIMATIONS
    // ==========================================

    const revealElements = document.querySelectorAll(`
        .section-heading,
        .about-text,
        .about-card,
        .skill-card,
        .project-card,
        .innovation-card,
        .education-card,
        .contact-box,
        .profile-card
    `);

    const revealedElements = new WeakSet();

    function animateElement(element) {

        if (
            prefersReducedMotion ||
            revealedElements.has(element)
        ) {
            return;
        }

        revealedElements.add(element);

        element.animate(
            [
                {
                    opacity: 0,
                    transform: "translateY(28px) scale(0.98)"
                },
                {
                    opacity: 1,
                    transform: "translateY(0) scale(1)"
                }
            ],
            {
                duration: 650,
                easing: "cubic-bezier(0.22, 1, 0.36, 1)",
                fill: "both"
            }
        );
    }

    let revealObserver = null;

    if ("IntersectionObserver" in window) {

        revealObserver = new IntersectionObserver(
            entries => {

                entries.forEach(entry => {

                    if (!entry.isIntersecting) return;

                    animateElement(entry.target);

                    revealObserver.unobserve(entry.target);
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -35px 0px"
            }
        );

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    }

    function revealVisibleElements() {

        if (!revealObserver) return;

        revealElements.forEach(element => {

            const page = element.closest(".page-section");

            if (
                page &&
                page.classList.contains("active")
            ) {

                const rect = element.getBoundingClientRect();

                if (
                    rect.top < window.innerHeight &&
                    rect.bottom > 0
                ) {

                    animateElement(element);

                    revealObserver.unobserve(element);
                }
            }
        });
    }

    // ==========================================
    // PROJECT CARD INTERACTION
    // ==========================================

    const projectCards = document.querySelectorAll(
        ".project-card"
    );

    projectCards.forEach(card => {

        card.addEventListener("mouseenter", () => {

            if (prefersReducedMotion) return;

            card.style.transition =
                "transform 0.3s ease, border-color 0.3s ease";
        });
    });

    // ==========================================
    // INITIALISE WEBSITE
    // ==========================================

    initializeHomeAnimation();

    showPage(pageFromHash());

    // Pause animation when browser tab is hidden

    document.addEventListener("visibilitychange", () => {

        if (document.hidden) {

            stopNetworkAnimation();

        } else if (
            homePage &&
            homePage.classList.contains("active")
        ) {

            startNetworkAnimation();
        }
    });

    console.log(
        "Portfolio navigation and Home AI/ML animation initialised."
    );

});
