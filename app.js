// App.js - Dynamic CSS injection based on screen size
// Breakpoint: 884px (Samsung Fold unfolded max size)

(function() {
    'use strict';

    // Constants
    const BREAKPOINT = 884;
    let currentStylesheet = null;
    let currentMode = null;

    // Detect and inject appropriate CSS
    function loadStylesheet() {
        const screenWidth = window.innerWidth;
        const newMode = screenWidth <= BREAKPOINT ? 'mobile' : 'desktop';

        // Only inject if mode changed or first load
        if (newMode !== currentMode) {
            // Remove existing stylesheet if any
            if (currentStylesheet) {
                currentStylesheet.remove();
            }

            // Create new stylesheet link
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = newMode === 'mobile' ? 'mobile.css' : 'desktop.css';
            link.id = 'dynamic-stylesheet';

            // Insert into head
            document.head.appendChild(link);

            // Update tracking variables
            currentStylesheet = link;
            currentMode = newMode;

            console.log(`Loaded ${newMode} stylesheet (screen width: ${screenWidth}px)`);
        }
    }

    // Debounce function for resize events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Initialize navigation
    function initNavigation() {
        const navToggle = document.getElementById('navToggle');
        const sideNav = document.getElementById('sideNav');
        const navLinks = document.querySelectorAll('.nav-links a');

        // Toggle navigation (open and close with same button)
        if (navToggle) {
            navToggle.addEventListener('click', () => {
                sideNav.classList.toggle('active');
            });
        }

        // Close nav when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= BREAKPOINT) {
                    sideNav.classList.remove('active');
                }

                // Update active state
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });

            // Close nav when clicking outside (mobile only)
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= BREAKPOINT) {
                if (!sideNav.contains(e.target) && !navToggle.contains(e.target)) {
                    sideNav.classList.remove('active');
                }
            }
        });
    }

    // Show/hide hamburger on scroll (mobile only)
    function initMobileHamburger() {
        const navToggle = document.getElementById('navToggle');

        if (!navToggle) return;

        function handleScroll() {
            const isMobile = window.innerWidth <= BREAKPOINT;

            if (isMobile) {
                const scrollPosition = window.pageYOffset;
                const heroHeight = window.innerHeight;

                if (scrollPosition > heroHeight * 0.3) {
                    navToggle.classList.add('scrolled');
                } else {
                    navToggle.classList.remove('scrolled');
                }
            } else {
                // On desktop, ensure hamburger is hidden
                navToggle.classList.remove('scrolled');
            }
        }

        // Initial check
        handleScroll();

        // Add scroll listener
        window.addEventListener('scroll', handleScroll);
    }

    // Smooth scroll with offset for sections
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const offset = window.innerWidth <= BREAKPOINT ? 0 : 0;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Intersection Observer for scroll animations
    function initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe sections
        const sections = document.querySelectorAll('.section');
        sections.forEach((section, index) => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(50px)';
            section.style.transition = `opacity 0.8s ease ${index * 0.1}s, transform 0.8s ease ${index * 0.1}s`;
            observer.observe(section);
        });

        // Observe product highlights
        const highlights = document.querySelectorAll('.highlight-item');
        highlights.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            observer.observe(item);
        });

        // Observe benefits
        const benefits = document.querySelectorAll('.benefit-item');
        benefits.forEach((item, index) => {
            item.style.opacity = '0';
            item.style.transform = 'scale(0.9)';
            item.style.transition = `opacity 0.6s ease ${index * 0.15}s, transform 0.6s ease ${index * 0.15}s`;
            observer.observe(item);
        });
    }

    // Parallax effect for hero background
    function initParallax() {
        const heroPattern = document.querySelector('.hero-pattern');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const heroHeight = window.innerHeight;
            
            if (scrolled < heroHeight && heroPattern) {
                const opacity = 1 - (scrolled / heroHeight) * 0.5;
                heroPattern.style.opacity = opacity;
                heroPattern.style.transform = `translateY(${scrolled * 0.3}px)`;
            }
        });
    }

    // Active section tracking
    function initSectionTracking() {
        const sections = document.querySelectorAll('.section[id]');
        const navLinks = document.querySelectorAll('.nav-links a[data-section]');

        window.addEventListener('scroll', () => {
            let current = '';
            const scrollPosition = window.pageYOffset + 200;

            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-section') === current) {
                    link.classList.add('active');
                }
            });
        });
    }

    // Form handling
    function initForms() {
        const contactForm = document.querySelector('.contact-form');
        
        if (contactForm) {
            const submitBtn = contactForm.querySelector('.btn-submit');
            
            submitBtn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Simple validation
                const inputs = contactForm.querySelectorAll('.form-input, .form-textarea');
                let isValid = true;
                
                inputs.forEach(input => {
                    if (!input.value.trim()) {
                        isValid = false;
                        input.style.borderColor = 'var(--accent-orange)';
                        setTimeout(() => {
                            input.style.borderColor = '';
                        }, 2000);
                    }
                });
                
                if (isValid) {
                    // Here you would typically send the form data
                    console.log('Form submitted successfully');
                    alert('Thank you for your message! We will get back to you soon.');
                    contactForm.reset();
                } else {
                    alert('Please fill in all fields');
                }
            });
        }
    }

    // Button click effects (mobile)
    function initTouchEffects() {
        if (window.innerWidth <= BREAKPOINT) {
            const buttons = document.querySelectorAll('.btn-category, .btn-wholesale, .btn-submit');
            
            buttons.forEach(button => {
                button.addEventListener('touchstart', function() {
                    this.style.transform = 'scale(0.95)';
                });
                
                button.addEventListener('touchend', function() {
                    setTimeout(() => {
                        this.style.transform = '';
                    }, 100);
                });
            });
        }
    }

    // Initialize everything
    function init() {
        // Load appropriate stylesheet
        loadStylesheet();

        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                initNavigation();
                initMobileHamburger();
                initSmoothScroll();
                initScrollAnimations();
                initParallax();
                initSectionTracking();
                initForms();
                initTouchEffects();
            });
        } else {
            initNavigation();
            initMobileHamburger();
            initSmoothScroll();
            initScrollAnimations();
            initParallax();
            initSectionTracking();
            initForms();
            initTouchEffects();
        }

        // Reload stylesheet on resize (debounced)
        window.addEventListener('resize', debounce(() => {
            loadStylesheet();
            initMobileHamburger();
            initTouchEffects();
        }, 250));
    }

    // Start the app
    init();
})();