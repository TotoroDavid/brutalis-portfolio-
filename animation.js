document.addEventListener("DOMContentLoaded", () => {
    console.log("hello world"); // Added test log
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

    // Create custom cursor
    const cursorDot = document.createElement("div");
    const cursorOutline = document.createElement("div");
    const cursorRipple = document.createElement("div"); // New ripple element

    // Add cursor elements to the DOM
    cursorDot.className = "cursor-dot";
    cursorOutline.className = "cursor-outline";
    cursorRipple.className = "cursor-ripple"; // Add ripple element
    document.body.appendChild(cursorDot);
    document.body.appendChild(cursorOutline);
    document.body.appendChild(cursorRipple); // Add ripple to DOM

    // Add CSS for cursor with ripple effect
    const style = document.createElement("style");
    style.textContent = `
    body {
      cursor: none;
    }
    
    .cursor-dot {
      position: fixed;
      top: 0;
      left: 0;
      width: 6px; /* Smaller cursor dot */
      height: 6px;
      background-color: var(--swatch--brand, #c6fb50);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 10px rgba(0,0,0,0.5);
      transition: width 0.3s, height 0.3s, background-color 0.3s;
    }
    
    .cursor-outline {
      position: fixed;
      top: 0;
      left: 0;
      width: 30px; /* Smaller cursor outline */
      height: 30px;
      border: 2px solid var(--swatch--brand, #c6fb50);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9998;
      transform: translate(-50%, -50%);
      box-shadow: 0 0 15px rgba(0,0,0,0.3);
      transition: width 0.3s, height 0.3s, border-color 0.3s, opacity 0.3s;
    }
    
    /* Cursor ripple effect */
    .cursor-ripple {
      position: fixed;
      top: 0;
      left: 0;
      width: 0;
      height: 0;
      background-color: transparent;
      border: 1px solid var(--swatch--brand, #c6fb50);
      border-radius: 50%;
      pointer-events: none;
      z-index: 9997;
      transform: translate(-50%, -50%);
      opacity: 0;
      transition: width 0.5s ease-out, height 0.5s ease-out, opacity 0.5s ease-out;
    }

    .u-theme-dark .cursor-dot {
      background-color: var(--swatch--brand, #c6fb50);
      box-shadow: 0 0 10px rgba(255,255,255,0.5);
    }
    
    .u-theme-dark .cursor-outline,
    .u-theme-dark .cursor-ripple {
      border-color: var(--swatch--brand, #c6fb50);
      box-shadow: 0 0 15px rgba(255,255,255,0.3);
    }
    
    .u-theme-light .cursor-dot {
      background-color: var(--swatch--dark, #353233);
    }
    
    .u-theme-light .cursor-outline,
    .u-theme-light .cursor-ripple {
      border-color: var(--swatch--dark, #353233);
    }

    /* Button hover effect */
    .btn_main_wrap:hover .cursor-dot,
    button:hover .cursor-dot {
      background-color: white !important;
      width: 10px !important;
      height: 10px !important;
    }

    .btn_main_wrap:hover .cursor-outline,
    button:hover .cursor-outline {
      border-color: white !important;
      width: 50px !important;
      height: 50px !important;
      opacity: 0.8 !important;
    }

    /* Animation specific styles */
    .section-transition {
      transition: background-color 0.7s ease-in-out, color 0.7s ease-in-out;
    }

    .header_lightbox-image {
      overflow: hidden;
      transform-origin: center center;
      will-change: transform, opacity;
      z-index: 2;
      visibility: visible !important;
      opacity: 1 !important;
    }

    .section-reveal {
      opacity: 0;
      transform: translateY(30px);
    }

    .g_visual_video {
      filter: none !important;
      will-change: transform, opacity;
    }
    
    .reveal-text {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.8s ease, transform 0.8s ease;
    }
    
    .reveal-text.active {
      opacity: 1;
      transform: translateY(0);
    }
    
    .char {
      display: inline-block;
      opacity: 0;
      transform: translateY(30px);
      transition: transform 0.5s, opacity 0.5s;
    }

    /* Critical elements visibility fixes */
    .navbar_component,
    .header_content, 
    .header_lightbox-image,
    .header104_heading-wrapper,
    .header104_heading-wrapper h1,
    .header104_heading-wrapper h1 span {
        visibility: visible !important;
        opacity: 1 !important;
        display: block;
    }
    .header104_heading-wrapper h1 span {
        display: inline-block !important;
    }

    /* Light mode fix */
    .page_wrap:not(.u-theme-dark):not(.u-theme-light) {
        background-color: white !important;
        color: #353233 !important;
    }

    /* FAQ animation styles */
    .faq_icon-wrapper {
        transition: transform 0.3s ease;
    }

    .faq_question {
        transition: background-color 0.3s ease;
    }

    .faq_question:hover {
        background-color: rgba(198, 251, 80, 0.1);
    }

    /* Animated characters */
    .animated-char {
        display: inline-block;
        position: relative;
        transform: translateY(15px) rotate(5deg);
        opacity: 0;
        transition: transform 0.3s, opacity 0.3s, color 0.3s;
    }

    .navbar-logo-char {
        display: inline-block;
        position: relative;
    }

    .footer-logo-char {
        display: inline-block;
        position: relative;
    }
  `;
    document.head.appendChild(style);

    // Functions for cursor movement
    const cursorMove = (e) => {
        const posX = e.clientX;
        const posY = e.clientY;

        gsap.to(cursorDot, {
            x: posX,
            y: posY,
            duration: 0.1
        });

        gsap.to(cursorOutline, {
            x: posX,
            y: posY,
            duration: 0.15
        });

        gsap.to(cursorRipple, {
            x: posX,
            y: posY,
            duration: 0.1
        });
    };

    // Create ripple effect on click
    document.addEventListener('click', (e) => {
        // Get current theme color
        const isDarkMode = document.querySelector('.u-theme-dark') !== null;
        const color = isDarkMode ?
            "var(--swatch--brand, #c6fb50)" :
            "var(--swatch--dark, #353233)";

        // Position the ripple element at the click position
        gsap.set(cursorRipple, {
            x: e.clientX,
            y: e.clientY,
            width: 0,
            height: 0,
            opacity: 0.8,
            borderColor: color
        });

        // Animate the ripple
        gsap.to(cursorRipple, {
            width: 100,
            height: 100,
            opacity: 0,
            duration: 0.6,
            ease: "power1.out",
            onComplete: () => {
                gsap.set(cursorRipple, { width: 0, height: 0, opacity: 0 });
            }
        });
    });

    // Function to add hover effects to elements
    const addHoverTargets = () => {
        // Find all hoverable elements
        const hoverableSelectors = [
            '.navbar_brand',
            '.navbar_link',
            '.overlay_link',
            '.logo_icon',
            '.btn_main_wrap',
            'button',
            '.layout_item',
            'a',
            '.header104_heading-wrapper h1 span',
            '.portfolio_item',
            '.portfolio_image-wrap',
            '.g_heading',
            '.g_subheading'
        ];

        const hoverTargets = document.querySelectorAll(hoverableSelectors.join(','));

        // For each target, add hover events
        hoverTargets.forEach(target => {
            target.classList.add('hover-target');

            // Mouse enter effect
            target.addEventListener('mouseenter', () => {
                // Add hover-active class to body
                document.body.classList.add('hover-active');

                // Check if we need a specific hover effect
                if (target.closest('.btn_main_wrap') || target.tagName === 'BUTTON') {
                    // Button effect handled by CSS
                    return;
                }
                // Heading effect
                else if (target.closest('.header104_heading-wrapper') || target.closest('.g_heading')) {
                    // Get current theme color
                    const isDarkMode = document.querySelector('.u-theme-dark') !== null;
                    const color = isDarkMode ?
                        "var(--swatch--brand, #c6fb50)" :
                        "var(--swatch--dark, #353233)";

                    gsap.to(cursorDot, {
                        width: 12,
                        height: 12,
                        backgroundColor: color,
                        duration: 0.3
                    });

                    gsap.to(cursorOutline, {
                        width: 60,
                        height: 60,
                        borderColor: color,
                        opacity: 0.6,
                        duration: 0.3
                    });

                    // Create ripple animation on hover
                    gsap.set(cursorRipple, {
                        width: 10,
                        height: 10,
                        borderWidth: 2,
                        opacity: 0.8,
                        borderColor: color
                    });

                    gsap.to(cursorRipple, {
                        width: 80,
                        height: 80,
                        opacity: 0,
                        duration: 1,
                        repeat: -1,
                        ease: "power1.out"
                    });
                }
                // Default hover effect
                else {
                    gsap.to(cursorDot, {
                        width: 8,
                        height: 8,
                        backgroundColor: "var(--swatch--brand, #c6fb50)",
                        duration: 0.3
                    });

                    gsap.to(cursorOutline, {
                        width: 40,
                        height: 40,
                        borderColor: "var(--swatch--brand, #c6fb50)",
                        opacity: 0.8,
                        duration: 0.3
                    });
                }
            });

            // Mouse leave effect
            target.addEventListener('mouseleave', () => {
                // Remove hover-active class from body
                document.body.classList.remove('hover-active');

                // Check if we're in dark or light mode
                const isDarkMode = document.querySelector('.u-theme-dark') !== null;

                gsap.to(cursorDot, {
                    width: 6, // Back to smaller size
                    height: 6,
                    backgroundColor: isDarkMode ? "var(--swatch--brand, #c6fb50)" : "var(--swatch--dark, #353233)",
                    duration: 0.3
                });

                gsap.to(cursorOutline, {
                    width: 30, // Back to smaller size
                    height: 30,
                    borderColor: isDarkMode ? "var(--swatch--brand, #c6fb50)" : "var(--swatch--dark, #353233)",
                    opacity: 1,
                    duration: 0.3
                });

                // Stop ripple animation on mouse leave
                gsap.killTweensOf(cursorRipple);
                gsap.to(cursorRipple, {
                    width: 0,
                    height: 0,
                    opacity: 0,
                    duration: 0.3
                });
            });
        });
    };

    // Initialize cursor movement
    document.addEventListener('mousemove', cursorMove);

    // Initialize hover targets
    addHoverTargets();

    // Integrate with Lenis for smooth scrolling
    // (The Lenis initialization is already in your HTML)

    // Connect GSAP ScrollTrigger to Lenis
    if (typeof lenis !== 'undefined') {
        lenis.on('scroll', ScrollTrigger.update);

        // Connect GSAP ticker to Lenis
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });

        // Cancel default gsap ticker that might conflict with Lenis
        gsap.ticker.lagSmoothing(0);
    }

    // Theme switching based on scroll position - RANDOMIZED VERSION
    const setupThemeSwitching = () => {
        try {
            console.log("Setting up randomized theme switching"); // Debug log

            // Add class to enable smooth transitions
            const pageWrap = document.querySelector('.page_wrap');
            const navbar = document.querySelector('.navbar_component');

            if (!pageWrap) {
                console.error("ERROR: Page wrap element not found!");
                return;
            }

            if (pageWrap) {
                pageWrap.classList.add('section-transition');
            }
            if (navbar) {
                navbar.classList.add('section-transition');
            }

            // Set initial theme to LIGHT and make it visible
            updateTheme('light');
            console.log("Initial theme set to light");

            // Get all sections
            const sectionSelectors = [
                'header.header_wrap',
                'section.subheader_wrap',
                'header.portfolio_wrap',
                'section.layout_wrap',
                'section.faq_wrap',
                'footer.footer_component'
            ];

            // RANDOMIZE themes - but keep first section light and last section dark
            const sections = [];

            // First section is always light
            sections.push({ selector: 'header.header_wrap', theme: 'light' });

            // Randomize themes for middle sections
            const middleSelectors = sectionSelectors.slice(1, -1);
            middleSelectors.forEach(selector => {
                // Randomly assign 'dark' or 'light' theme (50/50 chance)
                const randomTheme = Math.random() < 0.5 ? 'dark' : 'light';
                sections.push({ selector, theme: randomTheme });
            });

            // Last section is always dark
            sections.push({ selector: 'footer.footer_component', theme: 'dark' });

            console.log("Randomized sections:", sections);

            // Verificar si las secciones existen
            sections.forEach(section => {
                const el = document.querySelector(section.selector);
                if (!el) {
                    console.warn(`Warning: Section with selector "${section.selector}" not found`);
                } else {
                    console.log(`Found section: ${section.selector} for theme ${section.theme}`);
                }
            });

            // Add visual indicators for debugging theme changes
            sections.forEach(section => {
                const el = document.querySelector(section.selector);
                if (el) {
                    // Add a data attribute to make debugging easier
                    el.setAttribute('data-theme', section.theme);

                    const indicator = document.createElement('div');
                    indicator.className = 'theme-indicator';
                    indicator.style.cssText = `
                        position: absolute;
                        top: 5px;
                        right: 5px;
                        width: 10px;
                        height: 10px;
                        border-radius: 50%;
                        background-color: ${section.theme === 'dark' ? '#c6fb50' : '#353233'};
                        opacity: 0.7;
                        z-index: 999;
                    `;

                    // Ensure the section has position relative for the indicator
                    const currentPosition = window.getComputedStyle(el).position;
                    if (currentPosition === 'static') {
                        el.style.position = 'relative';
                    }

                    el.appendChild(indicator);
                }
            });

            // Force a refresh of ScrollTrigger
            ScrollTrigger.refresh();

            // Create simpler and more reliable triggers for theme switching
            sections.forEach((section, index) => {
                const el = document.querySelector(section.selector);
                if (!el) return;

                // Add a single ScrollTrigger with better position detection
                ScrollTrigger.create({
                    trigger: el,
                    start: "top 50%", // Simplify to trigger at the middle of the viewport
                    end: "bottom 50%",
                    markers: false, // Set to true temporarily for debugging
                    id: `theme-trigger-${index}`,
                    onEnter: () => {
                        console.log(`ENTER: ${section.selector} (${section.theme})`);
                        updateTheme(section.theme);
                    },
                    onEnterBack: () => {
                        console.log(`ENTER BACK: ${section.selector} (${section.theme})`);
                        updateTheme(section.theme);
                    }
                });
            });

            // Apply theme for current scroll position
            setTimeout(() => {
                // Determinar qué sección es visible actualmente
                const scrollPosition = window.scrollY + window.innerHeight / 2;
                let currentSectionIndex = -1;

                sections.forEach((section, index) => {
                    const el = document.querySelector(section.selector);
                    if (!el) return;

                    const rect = el.getBoundingClientRect();
                    const offsetTop = rect.top + window.scrollY;
                    const offsetBottom = offsetTop + rect.height;

                    if (scrollPosition >= offsetTop && scrollPosition <= offsetBottom) {
                        currentSectionIndex = index;
                    }
                });

                if (currentSectionIndex >= 0) {
                    const currentSection = sections[currentSectionIndex];
                    console.log(`Current visible section: ${currentSection.selector}, applying theme: ${currentSection.theme}`);
                    updateTheme(currentSection.theme);
                } else {
                    console.log("No section detected at current scroll position, keeping light theme");
                }
            }, 100);

        } catch (error) {
            console.error("Error in setupThemeSwitching:", error);
        }
    };

    // Update theme function with better cursor handling - FIXED
    const updateTheme = (theme) => {
        try {
            console.log("Updating theme to:", theme); // Debug log
            const pageWrap = document.querySelector('.page_wrap');
            const navbar = document.querySelector('.navbar_component');

            if (!pageWrap) {
                console.error("ERROR: Page wrap element not found in updateTheme!");
                return;
            }

            // Primero eliminar cualquier tema existente para evitar conflictos
            pageWrap.classList.remove('u-theme-dark', 'u-theme-light');

            if (theme === 'dark') {
                // Aplicar tema oscuro
                pageWrap.classList.add('u-theme-dark');

                // Actualizar navbar si existe
                if (navbar) {
                    navbar.setAttribute('data-wf--navbar--variant', 'dark');
                    navbar.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
                    navbar.style.color = 'white';
                }

                // Update cursor for dark theme
                const cursorDot = document.querySelector('.cursor-dot');
                const cursorOutline = document.querySelector('.cursor-outline');

                if (cursorDot) {
                    cursorDot.style.backgroundColor = "#c6fb50";
                    cursorDot.style.boxShadow = "0 0 10px rgba(255,255,255,0.5)";
                }

                if (cursorOutline) {
                    cursorOutline.style.borderColor = "#c6fb50";
                    cursorOutline.style.boxShadow = "0 0 15px rgba(255,255,255,0.3)";
                }

                // Verificar si se aplicó correctamente el tema
                setTimeout(() => {
                    if (!pageWrap.classList.contains('u-theme-dark')) {
                        console.warn("WARNING: Dark theme class was not applied correctly!");
                        pageWrap.classList.add('u-theme-dark');
                    }
                }, 50);

            } else {
                // Aplicar tema claro
                pageWrap.classList.add('u-theme-light');

                // Actualizar navbar si existe
                if (navbar) {
                    navbar.setAttribute('data-wf--navbar--variant', 'light');
                    navbar.style.backgroundColor = 'white';
                    navbar.style.color = '#353233';
                }

                // Update cursor for light theme
                const cursorDot = document.querySelector('.cursor-dot');
                const cursorOutline = document.querySelector('.cursor-outline');

                if (cursorDot) {
                    cursorDot.style.backgroundColor = "#353233";
                    cursorDot.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";
                }

                if (cursorOutline) {
                    cursorOutline.style.borderColor = "#353233";
                    cursorOutline.style.boxShadow = "0 0 15px rgba(0,0,0,0.3)";
                }

                // Verificar si se aplicó correctamente el tema
                setTimeout(() => {
                    if (!pageWrap.classList.contains('u-theme-light')) {
                        console.warn("WARNING: Light theme class was not applied correctly!");
                        pageWrap.classList.add('u-theme-light');
                    }
                }, 50);
            }

            // Agregar un atributo de datos para facilitar la depuración
            pageWrap.setAttribute('data-current-theme', theme);

            // Forzar un reflow del DOM para asegurar que se apliquen los cambios
            void pageWrap.offsetHeight;

        } catch (error) {
            console.error("Error in updateTheme:", error);
        }
    };

    // Add an event listener for scroll to help debug theme changes
    document.addEventListener('scroll', () => {
        // Throttle to avoid too many logs
        if (!window.themeDebugThrottle) {
            window.themeDebugThrottle = true;
            setTimeout(() => {
                const currentTheme = document.querySelector('.page_wrap').getAttribute('data-current-theme');
                const hasDarkClass = document.querySelector('.page_wrap').classList.contains('u-theme-dark');
                const hasLightClass = document.querySelector('.page_wrap').classList.contains('u-theme-light');

                console.log(`Current theme: ${currentTheme}, Dark class: ${hasDarkClass}, Light class: ${hasLightClass}`);

                window.themeDebugThrottle = false;
            }, 1000);
        }
    });

    // Add portfolio image animations with right-to-left motion
    const animatePortfolioImages = () => {
        const portfolioItems = document.querySelectorAll('.portfolio_image-wrapper');
        const portfolioSection = document.querySelector('.portfolio_wrap');

        // Cyberpunk colors
        const cyberpunkColors = [
            { background: 'rgba(246, 3, 171, 0.15)', text: '#f603ab' },  // Neon Pink
            { background: 'rgba(12, 230, 242, 0.15)', text: '#0ce6f2' },  // Cyan
            { background: 'rgba(201, 254, 38, 0.15)', text: '#c9fe26' }   // Lime Green
        ];

        // Store original colors
        let originalBgColor = '';
        let originalTextColor = '';

        if (portfolioSection) {
            // Save original colors
            originalBgColor = window.getComputedStyle(portfolioSection).backgroundColor;
            originalTextColor = window.getComputedStyle(portfolioSection).color;

            // Add transition for smooth color change
            portfolioSection.style.transition = 'background-color 0.6s ease, color 0.6s ease';
        }

        portfolioItems.forEach((item, index) => {
            // Assign a color based on index (cycling through the 3 colors)
            const colorIndex = index % cyberpunkColors.length;
            const color = cyberpunkColors[colorIndex];

            // Add data attribute to remember which color this item uses
            item.setAttribute('data-color-index', colorIndex);

            // Create enhanced hover effect
            item.addEventListener('mouseenter', () => {
                // Scale the item with slight rotation
                gsap.to(item, {
                    scale: 1.03,
                    rotation: 0.5,
                    duration: 0.5,
                    ease: "power2.out"
                });

                // Change section color
                if (portfolioSection) {
                    gsap.to(portfolioSection, {
                        backgroundColor: color.background,
                        color: color.text,
                        duration: 0.6,
                        ease: "power2.out"
                    });

                    // Add glow effect to section
                    portfolioSection.style.boxShadow = `0 0 30px ${color.background}`;

                    // Also update the cursor to match color
                    const cursorDot = document.querySelector('.cursor-dot');
                    const cursorOutline = document.querySelector('.cursor-outline');

                    if (cursorDot && cursorOutline) {
                        gsap.to(cursorDot, {
                            backgroundColor: color.text,
                            duration: 0.3
                        });

                        gsap.to(cursorOutline, {
                            borderColor: color.text,
                            duration: 0.3
                        });
                    }
                }
            });

            item.addEventListener('mouseleave', () => {
                // Return item to original scale and rotation
                gsap.to(item, {
                    scale: 1,
                    rotation: 0,
                    duration: 0.5,
                    ease: "power2.out"
                });

                // Return section to original color
                if (portfolioSection) {
                    gsap.to(portfolioSection, {
                        backgroundColor: originalBgColor,
                        color: originalTextColor,
                        duration: 0.6,
                        ease: "power2.out"
                    });

                    // Remove glow effect
                    portfolioSection.style.boxShadow = 'none';

                    // Reset cursor
                    const isDarkMode = document.querySelector('.u-theme-dark') !== null;
                    const cursorDot = document.querySelector('.cursor-dot');
                    const cursorOutline = document.querySelector('.cursor-outline');

                    if (cursorDot && cursorOutline) {
                        gsap.to(cursorDot, {
                            backgroundColor: isDarkMode ? "#c6fb50" : "#353233",
                            duration: 0.3
                        });

                        gsap.to(cursorOutline, {
                            borderColor: isDarkMode ? "#c6fb50" : "#353233",
                            duration: 0.3
                        });
                    }
                }
            });

            // Create right-to-left entry animation (instead of bottom-up)
            gsap.set(item, {
                opacity: 0,
                x: 100, // Start from right
                rotation: 2 // Slight rotation
            });

            ScrollTrigger.create({
                trigger: item,
                start: "top 85%",
                onEnter: () => {
                    gsap.to(item, {
                        x: 0, // Move to original position
                        opacity: 1,
                        rotation: 0, // Rotate back to normal
                        duration: 0.9,
                        delay: index * 0.15,
                        ease: "power3.out"
                    });
                },
                once: true
            });
        });
    };

    // Animate the heading spans - SIMPLIFIED VERSION
    const animateHeadingSpans = () => {
        try {
            console.log("Starting heading animation"); // Debug
            const heading = document.querySelector('.header104_heading-wrapper h1');
            if (!heading) {
                console.log("Heading not found!"); // Debug
                return;
            }

            // First make the whole heading visible without animation
            gsap.set(heading, {
                visibility: "visible",
                opacity: 1,
                display: "block"
            });

            // Get all spans
            const spans = heading.querySelectorAll('span');
            console.log(`Found ${spans.length} spans in heading`); // Debug

            // Simply make spans visible first, then animate them
            spans.forEach(span => {
                gsap.set(span, {
                    visibility: "visible",
                    opacity: 1,
                    display: "inline-block"
                });
            });

            // Now add animations
            gsap.fromTo(spans,
                { opacity: 0, x: 50 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.8,
                    stagger: 0.2,
                    ease: "power3.out",
                    delay: 0.5
                }
            );
        } catch (error) {
            console.error("Error in animateHeadingSpans:", error);
        }
    };

    // Animate the header video - SIMPLIFIED LATERAL ENTRY
    const animateHeaderVideo = () => {
        try {
            const headerVideo = document.querySelector('.header_lightbox-image');
            const headerSection = document.querySelector('.header_wrap');

            if (!headerVideo || !headerSection) {
                console.log("Header video container or section not found"); // Debug
                return;
            }

            // First ensure video container is visible but with clipPath initially hiding it
            gsap.set(headerVideo, {
                visibility: "visible",
                opacity: 1,
                display: "block",
                zIndex: 2,
                clipPath: 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)' // Inicialmente oculto (desde la izquierda)
            });

            // Get the actual video element
            const videoEl = headerVideo.querySelector('video') || headerVideo.querySelector('img');
            if (videoEl) {
                gsap.set(videoEl, {
                    visibility: "visible",
                    opacity: 1
                });
            }

            // Lateral reveal animation - similar to the example provided
            gsap.to(headerVideo, {
                clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', // Reveal completely
                ease: "power2.inOut",
                scrollTrigger: {
                    trigger: headerSection,
                    start: "top top",
                    end: "+=100%", // Similar to example that used +=200%
                    scrub: 1,
                    markers: false
                }
            });

            // Add slight scale effect to video element if it exists
            if (videoEl) {
                gsap.from(videoEl, {
                    scale: 1.1,
                    ease: "power2.inOut",
                    scrollTrigger: {
                        trigger: headerSection,
                        start: "top top",
                        end: "+=100%",
                        scrub: 1
                    }
                });
            }

        } catch (error) {
            console.error("Error in animateHeaderVideo:", error);
        }
    };

    // Animate the subheader section with improved text reveal - FIXED TO ONLY APPLY TO SPECIFIC TEXT
    const animateSubheader = () => {
        const subheader = document.querySelector('.subheader_wrap');
        if (!subheader) return;

        // Be more specific - only get the first paragraph or one containing the text "Great ideas"
        const longTextParagraph = Array.from(subheader.querySelectorAll('.u-rich-text p')).find(p =>
            p.textContent.includes('Greatideas') ||
            p.textContent.includes('Great ideas') ||
            p.textContent.toLowerCase().includes('ideas')
        );

        if (longTextParagraph) {
            // Only process this specific paragraph
            const text = longTextParagraph.textContent;
            longTextParagraph.innerHTML = '';
            longTextParagraph.style.opacity = 1; // Make container visible

            // Create word spans
            text.split(' ').forEach((word, index) => {
                const wordSpan = document.createElement('span');
                wordSpan.className = 'reveal-text';
                wordSpan.style.display = 'inline-block';
                wordSpan.style.marginRight = '0.25em';
                wordSpan.textContent = word;
                longTextParagraph.appendChild(wordSpan);
            });

            // Create animation only for this paragraph
            ScrollTrigger.create({
                trigger: longTextParagraph,
                start: "top 80%",
                onEnter: () => {
                    const words = longTextParagraph.querySelectorAll('.reveal-text');
                    gsap.to(words, {
                        opacity: 1,
                        y: 0,
                        stagger: 0.02, // Slightly faster stagger
                        duration: 0.7,
                        ease: "power3.out"
                    });
                },
                once: true
            });
        } else {
            console.log("Specific paragraph not found in subheader");
        }
    };

    // Animate services section with improved animations
    const animateServices = () => {
        const services = document.querySelector('.layout_wrap');
        if (!services) return;

        const title = services.querySelector('.g_heading');
        const lists = services.querySelectorAll('.layout_item-list');
        const items = services.querySelectorAll('.layout_item');

        gsap.set([title, ...lists], { opacity: 0, y: 30 });
        gsap.set(items, { opacity: 0, x: -30 });

        ScrollTrigger.create({
            trigger: services,
            start: "top 70%",
            onEnter: () => {
                gsap.to(title, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power3.out"
                });

                gsap.to(lists, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: "power3.out",
                    delay: 0.3
                });

                gsap.to(items, {
                    opacity: 1,
                    x: 0,
                    duration: 0.8,
                    stagger: 0.08,
                    ease: "power3.out",
                    delay: 0.5
                });
            },
            once: true
        });
    };

    // Animate general sections
    const animateGeneralSections = () => {
        // Find all major section headings and content blocks
        const sections = document.querySelectorAll('section, header:not(.navbar_component)');

        sections.forEach(section => {
            // Skip already animated sections
            if (section.classList.contains('header_wrap') ||
                section.classList.contains('subheader_wrap') ||
                section.classList.contains('layout_wrap') ||
                section.classList.contains('portfolio_wrap')) {
                return;
            }

            const headings = section.querySelectorAll('h1, h2, h3, h4, h5, h6');
            const contentBlocks = section.querySelectorAll('p, .btn_main_wrap, .layout_item, .faq_accordion');

            gsap.set(headings, { opacity: 0, y: 20 });
            gsap.set(contentBlocks, { opacity: 0, y: 30 });

            ScrollTrigger.create({
                trigger: section,
                start: "top 75%",
                onEnter: () => {
                    gsap.to(headings, {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        stagger: 0.1,
                        ease: "power2.out"
                    });

                    gsap.to(contentBlocks, {
                        opacity: 1,
                        y: 0,
                        duration: 0.9,
                        stagger: 0.07,
                        ease: "power2.out",
                        delay: 0.2
                    });
                },
                once: true
            });
        });
    };

    // Add header animation
    const animateHeader = () => {
        // Replace the default header animation with our new specialized animations
        animateHeadingSpans();
        animateHeaderVideo();
    };

    // FAQ accordion animation with ENHANCED DYNAMIC effects
    const animateFAQ = () => {
        const faqQuestions = document.querySelectorAll('.faq_question');
        const faqItems = document.querySelectorAll('.faq_accordion');

        // Usar la técnica proporcionada para animar las preguntas
        const faqBoxes = gsap.utils.toArray('.faq_question');
        faqBoxes.forEach(box => {
            // Configurar el estado inicial - ancho reducido
            gsap.set(box, {
                width: '90%',
                transformOrigin: 'left center'
            });

            // Animar al hacer scroll
            gsap.to(box, {
                duration: 1.2,
                ease: "expo.out",
                width: '100%',
                backgroundColor: 'rgba(198, 251, 80, 0.1)',
                scrollTrigger: {
                    trigger: box,
                    start: "top 80%",
                    toggleActions: "play none none reverse",
                }
            });
        });

        faqQuestions.forEach(question => {
            // Add initial plus/minus icon state
            const iconWrapper = question.querySelector('.faq_icon-wrapper');

            // Add hover effect to FAQ questions
            question.addEventListener('mouseenter', () => {
                gsap.to(question, {
                    backgroundColor: 'rgba(198, 251, 80, 0.15)',
                    scale: 1.02,
                    duration: 0.3
                });

                if (iconWrapper) {
                    gsap.to(iconWrapper, {
                        scale: 1.2,
                        rotation: 45,
                        duration: 0.3
                    });
                }
            });

            question.addEventListener('mouseleave', () => {
                // No removemos el background color para mantener el efecto del scrollTrigger
                gsap.to(question, {
                    scale: 1,
                    duration: 0.3
                });

                if (iconWrapper && !question.classList.contains('active-faq')) {
                    gsap.to(iconWrapper, {
                        scale: 1,
                        rotation: 0,
                        duration: 0.3
                    });
                }
            });

            question.addEventListener('click', () => {
                const answer = question.nextElementSibling;
                const isOpen = answer.style.height !== '0px' && answer.style.height !== '';

                // Toggle active class
                question.classList.toggle('active-faq', !isOpen);

                // Close all other FAQs
                faqQuestions.forEach(q => {
                    if (q !== question) {
                        q.classList.remove('active-faq');
                        const a = q.nextElementSibling;
                        const i = q.querySelector('.faq_icon-wrapper');

                        if (a.style.height !== '0px' && a.style.height !== '') {
                            // Enhanced closing animation
                            gsap.to(a, {
                                height: 0,
                                opacity: 0,
                                duration: 0.4,
                                ease: "power2.inOut"
                            });

                            if (i) {
                                gsap.to(i, {
                                    rotation: 0,
                                    scale: 1,
                                    duration: 0.3,
                                    ease: "power2.inOut"
                                });
                            }
                        }
                    }
                });

                if (isOpen) {
                    // Close this FAQ with enhanced effect
                    gsap.to(answer, {
                        height: 0,
                        opacity: 0,
                        duration: 0.4,
                        ease: "power2.inOut"
                    });

                    if (iconWrapper) {
                        gsap.to(iconWrapper, {
                            rotation: 0,
                            scale: 1,
                            duration: 0.3,
                            ease: "power2.inOut"
                        });
                    }

                } else {
                    // Open this FAQ with enhanced effect
                    // First make it visible to measure height
                    answer.style.opacity = 0;
                    answer.style.height = 'auto';
                    answer.style.display = 'block';

                    const height = answer.offsetHeight;
                    answer.style.height = '0px';

                    // Add more dynamic "opening" animation
                    gsap.to(answer, {
                        height: height,
                        opacity: 1,
                        duration: 0.5,
                        ease: "power2.out"
                    });

                    if (iconWrapper) {
                        gsap.to(iconWrapper, {
                            rotation: 135,
                            scale: 1.2,
                            duration: 0.3,
                            ease: "power2.inOut"
                        });
                    }

                    // Add subtle animation to answer content
                    const answerContent = answer.querySelector('.faq_answer-text');
                    if (answerContent) {
                        gsap.fromTo(answerContent,
                            { y: 20, opacity: 0 },
                            { y: 0, opacity: 1, duration: 0.5, delay: 0.1, ease: "power2.out" }
                        );
                    }
                }
            });
        });

        // Initial animation of FAQ section with more dynamic effects
        const faqSection = document.querySelector('.faq_wrap');
        if (faqSection) {
            const faqTitle = faqSection.querySelector('h2, h3, .g_heading');

            if (faqTitle) {
                // Animate title characters
                const titleText = faqTitle.textContent;
                faqTitle.innerHTML = '';

                // Create character spans
                [...titleText].forEach((char, index) => {
                    const charSpan = document.createElement('span');
                    charSpan.className = 'animated-char';
                    charSpan.textContent = char === ' ' ? '\u00A0' : char;
                    faqTitle.appendChild(charSpan);
                });
            }

            gsap.set(faqTitle, { opacity: 1 }); // Keep container visible but chars are hidden
            gsap.set(faqItems, { opacity: 0, y: 40 });

            ScrollTrigger.create({
                trigger: faqSection,
                start: "top 70%",
                onEnter: () => {
                    // Animate title characters
                    const chars = faqSection.querySelectorAll('.animated-char');
                    if (chars.length > 0) {
                        gsap.to(chars, {
                            y: 0,
                            rotation: 0,
                            opacity: 1,
                            stagger: 0.03,
                            duration: 0.8,
                            ease: "power3.out"
                        });
                    } else if (faqTitle) {
                        // Fallback animation if character split didn't work
                        gsap.to(faqTitle, {
                            opacity: 1,
                            y: 0,
                            duration: 0.8,
                            ease: "power3.out"
                        });
                    }

                    // More dynamic staggered reveal for FAQ items
                    gsap.to(faqItems, {
                        opacity: 1,
                        y: 0,
                        stagger: 0.12,
                        duration: 0.7,
                        ease: "power3.out",
                        delay: 0.2,
                        onComplete: () => {
                            // Add subtle bounce effect after items appear
                            faqItems.forEach((item, index) => {
                                gsap.to(item, {
                                    y: -5,
                                    duration: 0.3,
                                    delay: index * 0.05,
                                    yoyo: true,
                                    repeat: 1,
                                    ease: "power2.inOut"
                                });
                            });
                        }
                    });
                },
                once: true
            });
        }
    };

    // Footer animation with improved effects and animated logo
    const animateFooter = () => {
        const footer = document.querySelector('footer');
        if (!footer) return;

        const footerLogo = footer.querySelector('.g_heading');
        const footerColumns = footer.querySelectorAll('.footer_link-list');
        const footerLinks = footer.querySelectorAll('.footer_link, .footer16_link');
        const footerForm = footer.querySelector('.footer_form-block');
        const footerBottom = footer.querySelector('.footer_bottom-wrapper');

        // Enhanced animation for the totoropixel logo
        if (footerLogo) {
            // Split the text into characters for animation if it contains "totoropixel"
            if (footerLogo.textContent.toLowerCase().includes('totoropixel')) {
                const logoText = footerLogo.textContent;
                footerLogo.innerHTML = '';

                // Create a wrapper for the animated text
                const textWrapper = document.createElement('div');
                textWrapper.className = 'footer-logo-wrapper';
                footerLogo.appendChild(textWrapper);

                // Split into characters
                [...logoText].forEach((char, index) => {
                    const charSpan = document.createElement('span');
                    charSpan.className = 'footer-logo-char';
                    charSpan.textContent = char;
                    charSpan.style.display = 'inline-block';
                    charSpan.style.position = 'relative';
                    charSpan.style.transform = 'translateY(30px) rotate(10deg)';
                    charSpan.style.opacity = '0';
                    textWrapper.appendChild(charSpan);
                });
            }
        }

        // Set up animations
        gsap.set(footerLogo, { opacity: 1 }); // Keep the container visible
        gsap.set(footerColumns, { opacity: 0, y: 30 });
        gsap.set(footerLinks, { opacity: 0, y: 20 });
        gsap.set(footerForm, { opacity: 0, y: 30 });
        gsap.set(footerBottom, { opacity: 0, y: 20 });

        ScrollTrigger.create({
            trigger: footer,
            start: "top 75%",
            onEnter: () => {
                // Animated logo chars
                const logoChars = footer.querySelectorAll('.footer-logo-char');
                if (logoChars.length > 0) {
                    gsap.to(logoChars, {
                        y: 0,
                        rotation: 0,
                        opacity: 1,
                        duration: 1.2,
                        stagger: 0.05,
                        ease: "elastic.out(1, 0.5)"
                    });

                    // Add a hover effect to the logo
                    const logoWrapper = footer.querySelector('.footer-logo-wrapper');
                    if (logoWrapper) {
                        logoWrapper.addEventListener('mouseenter', () => {
                            gsap.to(logoChars, {
                                y: -10,
                                color: '#c6fb50',
                                stagger: 0.02,
                                duration: 0.5,
                                ease: "power2.out"
                            });
                        });

                        logoWrapper.addEventListener('mouseleave', () => {
                            gsap.to(logoChars, {
                                y: 0,
                                color: '',
                                stagger: 0.02,
                                duration: 0.5,
                                ease: "power2.out"
                            });
                        });
                    }
                } else if (footerLogo) {
                    // Fallback if we couldn't split the text
                    gsap.fromTo(footerLogo,
                        { scale: 0.9, y: 20, rotation: 5 },
                        {
                            scale: 1,
                            y: 0,
                            rotation: 0,
                            duration: 1.2,
                            ease: "elastic.out(1, 0.5)"
                        }
                    );

                    // Add hover animation
                    footerLogo.addEventListener('mouseenter', () => {
                        gsap.to(footerLogo, {
                            y: -10,
                            color: '#c6fb50',
                            scale: 1.05,
                            duration: 0.5,
                            ease: "power2.out"
                        });
                    });

                    footerLogo.addEventListener('mouseleave', () => {
                        gsap.to(footerLogo, {
                            y: 0,
                            color: '',
                            scale: 1,
                            duration: 0.5,
                            ease: "power2.out"
                        });
                    });
                }

                // Columns animation
                gsap.to(footerColumns, {
                    opacity: 1,
                    y: 0,
                    stagger: 0.1,
                    duration: 0.8,
                    ease: "power2.out",
                    delay: 0.2
                });

                // Links animation
                gsap.to(footerLinks, {
                    opacity: 1,
                    y: 0,
                    stagger: 0.03,
                    duration: 0.6,
                    ease: "power2.out",
                    delay: 0.4
                });

                // Form animation
                gsap.to(footerForm, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    delay: 0.6
                });

                // Bottom section animation
                gsap.to(footerBottom, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power2.out",
                    delay: 0.8
                });
            },
            once: true
        });
    };

    // Add navbar logo animation - CORRECTED VERSION
    const animateNavbarLogo = () => {
        // Find the navbar logo/title that contains "totoropixel"
        const navbarLogo = document.querySelector('.navbar_component .navbar_logo-link');

        if (navbarLogo) {
            const logoText = navbarLogo.textContent;
            if (logoText.toLowerCase().includes('totoropixel') || logoText.toLowerCase().includes('totoro')) {
                // Primero guardamos el elemento h original para preservar sus propiedades
                const originalH = navbarLogo.querySelector('h1, h2, h3, h4, h5, h6');
                let originalFontSize = '24px'; // Valor por defecto por si no conseguimos el elemento h
                let originalClassName = '';

                if (originalH) {
                    // Capturar la información original del elemento h
                    const computedStyle = window.getComputedStyle(originalH);
                    originalFontSize = computedStyle.fontSize;
                    originalClassName = originalH.className;
                    console.log("Original font size:", originalFontSize);
                }

                // Clear and prepare for animation
                const originalHTML = navbarLogo.innerHTML;
                navbarLogo.innerHTML = '';

                // Create a wrapper for the animated text that mantendrá las propiedades del h original
                const textWrapper = document.createElement('div');
                textWrapper.className = 'navbar-logo-wrapper';
                if (originalClassName) {
                    textWrapper.className += ' ' + originalClassName;
                }
                textWrapper.style.display = 'inline-block';
                textWrapper.style.fontSize = originalFontSize; // Aplicar el tamaño de fuente original
                navbarLogo.appendChild(textWrapper);

                // Split text into characters
                [...logoText].forEach((char, index) => {
                    const charSpan = document.createElement('span');
                    charSpan.className = 'navbar-logo-char';
                    charSpan.textContent = char === ' ' ? '\u00A0' : char; // Use non-breaking space for spaces
                    charSpan.style.display = 'inline-block';
                    charSpan.style.fontSize = originalFontSize; // Mantener tamaño de fuente original
                    charSpan.style.opacity = '0'; // Start invisible para la animación de entrada
                    charSpan.style.transform = 'translateY(30px) rotate(10deg)'; // Para animación inicial como en footer
                    textWrapper.appendChild(charSpan);
                });

                // Animación inicial (similar al footer)
                const chars = textWrapper.querySelectorAll('.navbar-logo-char');
                gsap.to(chars, {
                    y: 0,
                    rotation: 0,
                    opacity: 1,
                    duration: 1.2,
                    stagger: 0.05,
                    ease: "elastic.out(1, 0.5)",
                    delay: 0.2
                });

                // Después de la animación inicial, añadir movimiento sutil y continuo
                chars.forEach((char, index) => {
                    gsap.to(char, {
                        y: -3 + Math.random() * 6, // Random slight up/down movement
                        repeat: -1,
                        yoyo: true,
                        duration: 1 + Math.random() * 2,
                        ease: "sine.inOut",
                        delay: 1 + (index * 0.05) // Delay después de la animación inicial
                    });
                });

                // Add hover effect to the entire logo
                textWrapper.addEventListener('mouseenter', () => {
                    gsap.to(chars, {
                        color: '#c6fb50',
                        y: -10, // Más pronunciado al hacer hover
                        stagger: 0.03,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                });

                textWrapper.addEventListener('mouseleave', () => {
                    gsap.to(chars, {
                        color: '',
                        y: 0,
                        stagger: 0.02,
                        duration: 0.3,
                        ease: "power2.out",
                        onComplete: () => {
                            // Restaurar el movimiento sutil tras finalizar el hover
                            chars.forEach((char, index) => {
                                gsap.to(char, {
                                    y: -3 + Math.random() * 6,
                                    repeat: -1,
                                    yoyo: true,
                                    duration: 1 + Math.random() * 2,
                                    ease: "sine.inOut"
                                });
                            });
                        }
                    });
                });
            }
        }
    };

    // Navbar animation on scroll - FIXED
    const animateNavbar = () => {
        try {
            const navbar = document.querySelector('.navbar_component');
            if (!navbar) {
                console.log("Navbar not found"); // Debug
                return;
            }

            // First ensure navbar is visible with light appearance
            gsap.set(navbar, {
                visibility: "visible",
                opacity: 1,
                display: "block",
                backgroundColor: "white",
                color: "#353233"
            });

            // Force navbar styling to light mode initially
            navbar.setAttribute('data-wf--navbar--variant', 'light');

            // Create scroll-driven animation for navbar
            ScrollTrigger.create({
                start: 1,
                end: "max",
                onUpdate: (self) => {
                    const scrollY = window.scrollY;

                    // Add subtle background when scrolled
                    if (scrollY > 50) {
                        gsap.to(navbar, {
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                            backdropFilter: 'blur(10px)',
                            duration: 0.3
                        });
                    } else {
                        gsap.to(navbar, {
                            backgroundColor: 'white',
                            boxShadow: 'none',
                            backdropFilter: 'blur(0px)',
                            duration: 0.3
                        });
                    }
                }
            });

            // Initial animation
            gsap.from(navbar, {
                y: -50,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            });
        } catch (error) {
            console.error("Error in animateNavbar:", error);
        }
    };

    // Utility to ensure elements are visible
    const ensureVisibility = () => {
        try {
            // Make sure critical elements are visible
            const criticalElements = [
                '.navbar_component',
                '.header_content',
                '.header_lightbox-image',
                '.header104_heading-wrapper',
                '.header104_heading-wrapper h1',
                '.header104_heading-wrapper h1 span'
            ];

            criticalElements.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                if (elements.length === 0) {
                    console.log(`Warning: No elements found for selector: ${selector}`);
                } else {
                    elements.forEach(el => {
                        el.style.visibility = 'visible';
                        el.style.opacity = '1';
                        el.style.display = el.tagName === 'SPAN' ? 'inline-block' : 'block';
                    });
                }
            });

            // Force light mode on page initially
            const pageWrap = document.querySelector('.page_wrap');
            if (pageWrap) {
                pageWrap.classList.add('u-theme-light');
                pageWrap.classList.remove('u-theme-dark');
            }
        } catch (error) {
            console.error("Error in ensureVisibility:", error);
        }
    };

    // Initialize all animations
    const initAllAnimations = () => {
        try {
            console.log("Initializing animations");

            // First ensure critical elements are visible
            ensureVisibility();

            // Explicitly call updateTheme with light mode
            updateTheme('light');

            // Run immediate animations
            animateNavbar();
            animateHeader();
            animateNavbarLogo(); // Add animation to navbar logo

            // Set up scroll animations
            animateSubheader();
            animatePortfolioImages();
            animateServices();
            animateFAQ();
            animateFooter();
            animateGeneralSections();

            // Re-enable theme switching
            setupThemeSwitching();
        } catch (error) {
            console.error("Error initializing animations:", error);
        }
    };

    // Start all animations immediately to ensure visibility
    initAllAnimations();
});


