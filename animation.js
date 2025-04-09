// Wait for DOM to load
document.addEventListener("DOMContentLoaded", () => {
    console.log("Animation script loaded"); // Debug log

    // IMPORTANT: Force elements to be visible immediately
    document.querySelectorAll('.navbar_component, .header_content, .header_lightbox-image, .header104_heading-wrapper, h1, .header104_heading-wrapper h1 span').forEach(el => {
        if (el) {
            el.style.visibility = 'visible';
            el.style.opacity = '1';
            el.style.display = el.tagName === 'SPAN' ? 'inline-block' : 'block';
        }
    });

    // Initialize GSAP plugins
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // --- Configuration ---
    const THEME_SETTINGS = {
        initialTheme: 'light', // 'light' or 'dark'
        sections: [
            { selector: 'header.header_wrap', theme: 'light' },
            { selector: 'section.subheader_wrap', theme: 'dark' }, // Example: Make subheader dark
            { selector: 'header.portfolio_wrap', theme: 'light' },
            { selector: 'section.layout_wrap', theme: 'dark' }, // Example: Make services dark
            { selector: 'section.faq_wrap', theme: 'light' },
            { selector: 'footer.footer_component', theme: 'dark' }
        ]
    };

    const CURSOR_COLORS = {
        light: {
            dot: 'var(--swatch--dark, #353233)',
            outline: 'var(--swatch--dark, #353233)'
        },
        dark: {
            dot: 'var(--swatch--brand, #c6fb50)',
            outline: 'var(--swatch--brand, #c6fb50)'
        }
    };

    const HOVER_SCALE = {
        dot: 1.5, // Scale factor for dot on hover
        outline: 1.8 // Scale factor for outline on hover
    };

    const RIPPLE_EFFECT = {
        scale: 4, // How much the outline expands for the ripple
        duration: 0.5,
        ease: "power2.out"
    };

    // --- Elements ---
    const pageWrap = document.querySelector('.page_wrap');
    const navbar = document.querySelector('.navbar_component');

    // --- Initial Setup ---
    const setupInitialState = () => {
        if (!pageWrap) {
            console.error("Page wrap element not found!");
            return;
        }
        // Ensure smooth transitions are enabled
        pageWrap.classList.add('section-transition');
        if (navbar) {
            navbar.classList.add('section-transition');
        }

        // Force initial visibility for critical elements
        document.querySelectorAll('.navbar_component, .header_content, .header_lightbox-image, .header104_heading-wrapper, h1, .header104_heading-wrapper h1 span').forEach(el => {
            if (el) {
                gsap.set(el, { visibility: 'visible', opacity: 1 });
                if (el.tagName !== 'SPAN') {
                    gsap.set(el, { display: 'block' });
                } else {
                    gsap.set(el, { display: 'inline-block' });
                }
            }
        });
        // Set initial theme
        updateTheme(THEME_SETTINGS.initialTheme);
    };

    // --- Custom Cursor ---
    const createCustomCursor = () => {
        const cursorDot = document.createElement("div");
        const cursorOutline = document.createElement("div");

        cursorDot.className = "cursor-dot";
        cursorOutline.className = "cursor-outline";
        document.body.appendChild(cursorDot);
        document.body.appendChild(cursorOutline);

        const style = document.createElement("style");
        style.textContent = `
            body { cursor: none; }
            .cursor-dot, .cursor-outline {
                position: fixed;
                top: 0;
                left: 0;
                pointer-events: none;
                z-index: 9999;
                border-radius: 50%;
                transform: translate(-50%, -50%);
                will-change: transform, background-color, border-color, width, height, opacity;
                transition: background-color 0.3s, border-color 0.3s; /* Smooth color transitions */
            }
            .cursor-dot {
                width: 8px;
                height: 8px;
                background-color: ${CURSOR_COLORS.light.dot}; /* Start with initial theme color */
            }
            .cursor-outline {
                width: 35px;
                height: 35px;
                border: 2px solid ${CURSOR_COLORS.light.outline}; /* Start with initial theme color */
                z-index: 9998;
                 /* Remove transition for scale/width/height - GSAP will handle */
            }
             /* Button specific hover - simpler */
            .btn_main_wrap:hover ~ .cursor-dot,
            button:hover ~ .cursor-dot,
            a.w-button:hover ~ .cursor-dot {
                background-color: white; /* Example: White dot on button hover */
            }
             .btn_main_wrap:hover ~ .cursor-outline,
             button:hover ~ .cursor-outline,
             a.w-button:hover ~ .cursor-outline {
                border-color: white; /* Example: White outline */
                opacity: 0.7;
             }
        `;
        document.head.appendChild(style);

        const cursorMove = (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            gsap.to(cursorDot, { x: posX, y: posY, duration: 0.1, ease: "power2.out" });
            gsap.to(cursorOutline, { x: posX, y: posY, duration: 0.15, ease: "power2.out" });
        };

        document.addEventListener('mousemove', cursorMove);

        // Add hover effects
        addCursorHoverEffects(cursorDot, cursorOutline);

        // Return elements for theme updates
        return { cursorDot, cursorOutline };
    };

    // --- Cursor Hover Effects (Refactored) ---
    const addCursorHoverEffects = (cursorDot, cursorOutline) => {
        const hoverableSelectors = [
            'a',
            'button',
            '.btn_main_wrap',
            '.navbar_brand',
            '.navbar_link',
            '.overlay_link',
            '.logo_icon',
            '.layout_item',
            '.header104_heading-wrapper h1 span', // Keep specific targets if needed
            '.portfolio_image-wrap',
            '.faq_question',
            '.g_heading', // General headings
            '.g_subheading',
            '[role="button"]' // Accessibility
        ];
        const hoverTargets = document.querySelectorAll(hoverableSelectors.join(', '));

        hoverTargets.forEach(target => {
            let hoverTimeline; // Store the timeline for reversing

            target.addEventListener('mouseenter', () => {
                const isButton = target.closest('.btn_main_wrap') || target.tagName === 'BUTTON' || target.classList.contains('w-button');

                // Kill previous tweens to prevent conflicts
                gsap.killTweensOf([cursorDot, cursorOutline]);

                hoverTimeline = gsap.timeline();

                // Base scale effect for dot and outline
                hoverTimeline.to(cursorDot, {
                    scale: HOVER_SCALE.dot,
                    duration: 0.3,
                    ease: "power2.out"
                }, 0);

                hoverTimeline.to(cursorOutline, {
                    scale: HOVER_SCALE.outline,
                    duration: 0.3,
                    ease: "power2.out"
                }, 0);

                // Apply WAVE effect to outline (unless it's a button, CSS handles button style)
                if (!isButton) {
                    // Animate the outline expanding and fading
                    hoverTimeline.fromTo(cursorOutline,
                        {
                            opacity: 1,
                            borderWidth: '2px',
                            scale: HOVER_SCALE.outline // Start from the hover scale
                        },
                        {
                            scale: HOVER_SCALE.outline * RIPPLE_EFFECT.scale, // Expand further
                            opacity: 0,
                            borderWidth: '1px', // Make border thinner as it expands
                            duration: RIPPLE_EFFECT.duration,
                            ease: RIPPLE_EFFECT.ease
                        }, 0); // Start wave at the same time as scaling
                } else {
                    // For buttons, maybe just reduce outline opacity slightly
                    hoverTimeline.to(cursorOutline, { opacity: 0.7, duration: 0.3 }, 0);
                }
            });

            target.addEventListener('mouseleave', () => {
                // Kill any running hover animations and reverse smoothly
                gsap.killTweensOf([cursorDot, cursorOutline]);
                gsap.to([cursorDot, cursorOutline], {
                    scale: 1,
                    opacity: 1,
                    borderWidth: '2px', // Reset border width
                    duration: 0.3,
                    ease: "power2.out",
                    overwrite: true // Ensure it overrides any part of the enter animation
                });
            });
        });
    };


    // --- Theme Management ---
    const setupThemeSwitching = (cursorDot, cursorOutline) => {
        if (!pageWrap) return;

        // Add class for transitions if not already present
        pageWrap.classList.add('section-transition');
        if (navbar) navbar.classList.add('section-transition');

        // Create ScrollTriggers for each defined section
        THEME_SETTINGS.sections.forEach((sectionInfo) => {
            const element = document.querySelector(sectionInfo.selector);
            if (element) {
                ScrollTrigger.create({
                    trigger: element,
                    start: "top 50%", // Trigger when section middle hits viewport middle
                    end: "bottom 50%",
                    // markers: true, // Uncomment for debugging
                    onEnter: () => updateTheme(sectionInfo.theme, cursorDot, cursorOutline),
                    onEnterBack: () => updateTheme(sectionInfo.theme, cursorDot, cursorOutline)
                });
            } else {
                console.warn(`Theme section selector not found: ${sectionInfo.selector}`);
            }
        });

        // Ensure initial theme is applied correctly after setup
        // Use timeout to allow layout calculation
        setTimeout(() => {
            let currentSectionTheme = THEME_SETTINGS.initialTheme;
            // Find the section currently in view
            const scrollMidPoint = window.scrollY + window.innerHeight / 2;
            for (const sectionInfo of THEME_SETTINGS.sections) {
                const element = document.querySelector(sectionInfo.selector);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    const elementTop = rect.top + window.scrollY;
                    const elementBottom = elementTop + rect.height;
                    if (scrollMidPoint >= elementTop && scrollMidPoint < elementBottom) {
                        currentSectionTheme = sectionInfo.theme;
                        break;
                    }
                }
            }
            updateTheme(currentSectionTheme, cursorDot, cursorOutline);
        }, 100); // Short delay
    };

    // --- Update Theme Function ---
    const updateTheme = (theme, cursorDot, cursorOutline) => {
        if (!pageWrap || !cursorDot || !cursorOutline) return;

        const isDark = theme === 'dark';
        pageWrap.classList.toggle('u-theme-dark', isDark);
        pageWrap.classList.toggle('u-theme-light', !isDark);
        pageWrap.setAttribute('data-current-theme', theme);

        // Update Navbar
        if (navbar) {
            navbar.setAttribute('data-wf--navbar--variant', theme);
            // Optionally, directly set styles if needed, but variant should handle it
            // navbar.style.backgroundColor = isDark ? 'rgba(0, 0, 0, 0.85)' : 'white';
            // navbar.style.color = isDark ? 'white' : '#353233';
        }

        // Update Cursor Colors (using direct style for immediate effect)
        const colors = isDark ? CURSOR_COLORS.dark : CURSOR_COLORS.light;
        gsap.to(cursorDot, { backgroundColor: colors.dot, duration: 0.3 });
        gsap.to(cursorOutline, { borderColor: colors.outline, duration: 0.3 });

        // Force reflow might not be necessary with GSAP controlling transitions
        // void pageWrap.offsetHeight;
    };


    // --- Section Animations ---

    // Header Animation (Heading + Video)
    const animateHeader = () => {
        const heading = document.querySelector('.header104_heading-wrapper h1');
        const headerVideo = document.querySelector('.header_lightbox-image');
        const headerSection = document.querySelector('.header_wrap');

        // Heading Span Animation (Right to Left)
        if (heading) {
            const spans = heading.querySelectorAll('span');
            gsap.set(heading, { opacity: 1 }); // Ensure container is visible
            gsap.set(spans, { opacity: 1 }); // Ensure spans are visible
            gsap.from(spans, {
                opacity: 0,
                x: 50, // Start from right
                duration: 0.8,
                stagger: 0.1, // Reduced stagger
                ease: "power3.out",
                delay: 0.5 // Delay after page load
            });
        }

        // Video Animation (Clip Path Reveal)
        if (headerVideo && headerSection) {
            gsap.set(headerVideo, {
                visibility: "visible",
                opacity: 1,
                clipPath: 'inset(0% 100% 0% 0%)' // Start clipped from the right
            });
            gsap.to(headerVideo, {
                clipPath: 'inset(0% 0% 0% 0%)', // Reveal fully
                ease: "power2.inOut",
                scrollTrigger: {
                    trigger: headerSection,
                    start: "top top",
                    end: "bottom center", // Reveal faster
                    scrub: 1,
                }
            });
            // Optional: slight scale on the video itself
            const videoEl = headerVideo.querySelector('video, img');
            if (videoEl) {
                gsap.from(videoEl, {
                    scale: 1.05, // Start slightly zoomed in
                    ease: "power2.inOut",
                    scrollTrigger: {
                        trigger: headerSection,
                        start: "top top",
                        end: "bottom center",
                        scrub: 1
                    }
                });
            }
        }
    };

    // Subheader Text Reveal
    const animateSubheader = () => {
        const subheader = document.querySelector('.subheader_wrap');
        if (!subheader) return;

        // Target the specific rich text paragraph for word reveal
        const richTextParagraph = subheader.querySelector('.u-rich-text p'); // Adjust selector if needed
        if (richTextParagraph) {
            const text = richTextParagraph.textContent;
            richTextParagraph.innerHTML = ''; // Clear original text
            richTextParagraph.style.opacity = 1;

            text.split(/(\s+)/).forEach(part => { // Split by spaces, keeping spaces
                if (part.trim().length > 0) {
                    const wordSpan = document.createElement('span');
                    wordSpan.className = 'reveal-word';
                    wordSpan.style.display = 'inline-block';
                    wordSpan.style.opacity = 0;
                    wordSpan.style.transform = 'translateY(20px)';
                    wordSpan.textContent = part;
                    richTextParagraph.appendChild(wordSpan);
                } else {
                    // Append spaces directly as text nodes
                    richTextParagraph.appendChild(document.createTextNode(part));
                }
            });

            const words = richTextParagraph.querySelectorAll('.reveal-word');
            ScrollTrigger.create({
                trigger: richTextParagraph,
                start: "top 85%",
                once: true,
                onEnter: () => {
                    gsap.to(words, {
                        opacity: 1,
                        y: 0,
                        stagger: 0.03, // Faster stagger
                        duration: 0.6,
                        ease: "power3.out"
                    });
                }
            });
        }
    };

    // Portfolio Section Animation
    const animatePortfolio = () => {
        const portfolioItems = gsap.utils.toArray('.portfolio_image-wrapper'); // More robust selection
        if (portfolioItems.length === 0) return;

        portfolioItems.forEach((item, index) => {
            gsap.set(item, { opacity: 0, x: 80, rotation: 1 }); // Start from right, slightly rotated

            ScrollTrigger.create({
                trigger: item,
                start: "top 90%", // Trigger a bit later
                once: true,
                onEnter: () => {
                    gsap.to(item, {
                        x: 0,
                        opacity: 1,
                        rotation: 0,
                        duration: 0.8,
                        delay: index * 0.1, // Slightly less delay
                        ease: "power3.out"
                    });
                }
            });

            // Subtle hover scale
            item.addEventListener('mouseenter', () => {
                gsap.to(item, { scale: 1.03, duration: 0.4, ease: "power2.out" });
            });
            item.addEventListener('mouseleave', () => {
                gsap.to(item, { scale: 1, duration: 0.4, ease: "power2.out" });
            });
        });
    };

    // Services Section Animation
    const animateServices = () => {
        const servicesSection = document.querySelector('.layout_wrap');
        if (!servicesSection) return;

        const title = servicesSection.querySelector('.g_heading');
        const items = gsap.utils.toArray(servicesSection.querySelectorAll('.layout_item'));

        // Animate title
        if (title) {
            gsap.set(title, { opacity: 0, y: 30 });
            ScrollTrigger.create({
                trigger: title,
                start: "top 85%",
                once: true,
                onEnter: () => {
                    gsap.to(title, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
                }
            });
        }

        // Animate items (staggered from left)
        if (items.length > 0) {
            gsap.set(items, { opacity: 0, x: -40 }); // Start from left
            ScrollTrigger.create({
                trigger: servicesSection, // Trigger based on the section
                start: "top 75%",
                once: true,
                onEnter: () => {
                    gsap.to(items, {
                        opacity: 1,
                        x: 0,
                        duration: 0.7,
                        stagger: 0.1,
                        ease: "power3.out",
                        delay: 0.2 // Slight delay after title might appear
                    });
                }
            });
        }
    };

    // FAQ Section Animation
    const animateFAQ = () => {
        const faqSection = document.querySelector('.faq_wrap');
        if (!faqSection) return;

        const faqTitle = faqSection.querySelector('.g_heading'); // Assuming a general heading class
        const faqQuestions = gsap.utils.toArray(faqSection.querySelectorAll('.faq_question'));
        const faqAnswers = gsap.utils.toArray(faqSection.querySelectorAll('.faq_answer'));

        // Initial state: hide answers
        gsap.set(faqAnswers, { height: 0, opacity: 0, display: 'none' });

        // Animate Title
        if (faqTitle) {
            gsap.set(faqTitle, { opacity: 0, y: 30 });
            ScrollTrigger.create({
                trigger: faqTitle,
                start: "top 85%",
                once: true,
                onEnter: () => {
                    gsap.to(faqTitle, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" });
                }
            });
        }

        // Animate Questions reveal (subtle slide-in)
        if (faqQuestions.length > 0) {
            gsap.set(faqQuestions, { opacity: 0, y: 20 });
            ScrollTrigger.create({
                trigger: faqSection,
                start: "top 70%",
                once: true,
                onEnter: () => {
                    gsap.to(faqQuestions, {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        stagger: 0.08,
                        ease: "power3.out",
                        delay: 0.2 // Delay after title
                    });
                }
            });
        }

        // Accordion Interaction
        faqQuestions.forEach((question, index) => {
            const answer = question.nextElementSibling; // Assumes answer is the direct sibling
            const iconWrapper = question.querySelector('.faq_icon-wrapper');

            if (!answer || !answer.classList.contains('faq_answer')) return; // Basic validation

            question.addEventListener('click', () => {
                const isOpen = question.classList.contains('active-faq');

                // Close all others first
                faqQuestions.forEach((q, i) => {
                    if (i !== index && q.classList.contains('active-faq')) {
                        const otherAnswer = q.nextElementSibling;
                        const otherIcon = q.querySelector('.faq_icon-wrapper');
                        q.classList.remove('active-faq');
                        gsap.to(otherAnswer, { height: 0, opacity: 0, display: 'none', duration: 0.4, ease: "power2.inOut" });
                        if (otherIcon) gsap.to(otherIcon, { rotation: 0, duration: 0.3 });
                    }
                });

                // Toggle clicked question
                question.classList.toggle('active-faq', !isOpen);

                if (!isOpen) {
                    // Open: Set auto height, then animate from 0
                    gsap.set(answer, { display: 'block', height: 'auto' }); // Measure height
                    gsap.fromTo(answer,
                        { height: 0, opacity: 0 },
                        { height: 'auto', opacity: 1, duration: 0.5, ease: "power2.out" }
                    );
                    if (iconWrapper) gsap.to(iconWrapper, { rotation: 135, duration: 0.3 }); // Rotate icon
                } else {
                    // Close: Animate to height 0
                    gsap.to(answer, {
                        height: 0,
                        opacity: 0,
                        duration: 0.4,
                        ease: "power2.inOut",
                        onComplete: () => gsap.set(answer, { display: 'none' }) // Hide after closing
                    });
                    if (iconWrapper) gsap.to(iconWrapper, { rotation: 0, duration: 0.3 });
                }
            });

            // Subtle hover effect on question
            question.addEventListener('mouseenter', () => {
                gsap.to(question, { backgroundColor: 'rgba(198, 251, 80, 0.08)', duration: 0.3 });
            });
            question.addEventListener('mouseleave', () => {
                gsap.to(question, { backgroundColor: 'transparent', duration: 0.3 });
            });
        });
    };

    // Footer Animation
    const animateFooter = () => {
        const footer = document.querySelector('footer.footer_component');
        if (!footer) return;

        const footerContent = footer.querySelectorAll('.footer_content-wrapper > *'); // Target direct children
        const footerBottom = footer.querySelector('.footer_bottom-wrapper');

        // Animate main content blocks
        if (footerContent.length > 0) {
            gsap.set(footerContent, { opacity: 0, y: 40 });
            ScrollTrigger.create({
                trigger: footer,
                start: "top 85%", // Start animation earlier
                once: true,
                onEnter: () => {
                    gsap.to(footerContent, {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        stagger: 0.1,
                        ease: "power3.out"
                    });
                }
            });
        }

        // Animate bottom wrapper
        if (footerBottom) {
            gsap.set(footerBottom, { opacity: 0 });
            ScrollTrigger.create({
                trigger: footerBottom, // Trigger based on the element itself
                start: "top 95%",
                once: true,
                onEnter: () => {
                    gsap.to(footerBottom, {
                        opacity: 1,
                        duration: 1.0,
                        ease: "power3.out",
                        delay: 0.5 // Delay after main content
                    });
                }
            });
        }
    };

    // Navbar Animation (Initial Fade-in & Scroll Behavior)
    const animateNavbar = () => {
        if (!navbar) return;

        // Initial fade-in and slide-down
        gsap.set(navbar, { y: -30, opacity: 0 });
        gsap.to(navbar, { y: 0, opacity: 1, duration: 1.0, ease: "power3.out", delay: 0.2 });

        // Scroll behavior (subtle background/shadow)
        ScrollTrigger.create({
            trigger: document.body, // Use body as trigger
            start: "top top-=100", // Start changing after scrolling 100px
            end: "max",
            toggleClass: { targets: navbar, className: "scrolled" }, // Add a 'scrolled' class
            // markers: true // For debugging
        });

        // Add CSS for the scrolled state
        const navStyle = document.createElement('style');
        navStyle.textContent = `
             .navbar_component.scrolled {
                 background-color: rgba(255, 255, 255, 0.9); /* Slightly transparent white */
                 box-shadow: 0 2px 15px rgba(0, 0, 0, 0.08);
                 backdrop-filter: blur(8px);
                 transition: background-color 0.4s ease, box-shadow 0.4s ease, backdrop-filter 0.4s ease;
             }
             .u-theme-dark .navbar_component.scrolled {
                 background-color: rgba(20, 20, 20, 0.85); /* Slightly transparent dark */
                 box-shadow: 0 2px 15px rgba(0, 0, 0, 0.2);
             }
         `;
        document.head.appendChild(navStyle);
    };

    // General Section Fade-in Animation
    const animateGeneralSections = () => {
        // Target sections that don't have specific animations already
        const sectionsToAnimate = gsap.utils.toArray('section:not(.header_wrap):not(.subheader_wrap):not(.portfolio_wrap):not(.layout_wrap):not(.faq_wrap)');

        sectionsToAnimate.forEach(section => {
            // Animate the section container itself for a simple fade/slide up
            gsap.set(section, { opacity: 0, y: 50 });

            ScrollTrigger.create({
                trigger: section,
                start: "top 85%",
                once: true,
                onEnter: () => {
                    gsap.to(section, {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: "power3.out"
                    });
                }
            });
        });
    };


    // --- Initialization ---
    const initAnimations = () => {
        setupInitialState();
        const { cursorDot, cursorOutline } = createCustomCursor(); // Create cursor and get elements
        setupThemeSwitching(cursorDot, cursorOutline); // Pass cursor elements to theme switcher

        // Initialize section animations
        animateNavbar();
        animateHeader();
        animateSubheader();
        animatePortfolio();
        animateServices();
        animateFAQ();
        animateFooter();
        // animateGeneralSections(); // Add this if needed for other sections

        // Refresh ScrollTrigger after everything is set up
        ScrollTrigger.refresh();
    };

    // --- Lenis Integration (Optional but Recommended) ---
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis();
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
        console.log("Lenis smooth scroll integrated.");
    } else {
        console.log("Lenis not found. Using native scroll.");
    }

    // Run Initialization
    initAnimations();

}); // End DOMContentLoaded
