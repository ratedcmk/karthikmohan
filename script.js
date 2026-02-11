document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu ---
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });

    // --- Metrics Counter Animation ---
    const runCounterAnimation = () => {
        const counters = document.querySelectorAll('.metric-value');
        console.log("Found counters:", counters.length);

        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            if (!target) return; // Skip if no number to animate

            const suffix = counter.getAttribute('data-suffix') || '';
            const duration = 2000; // 2 seconds
            const increment = target / (duration / 16); // 60fps

            let current = 0;
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.innerText = Math.ceil(current) + suffix;
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target + suffix;
                }
            };
            updateCounter();
        });
    };

    // Trigger animation when Dashboard section is in view
    const dashboardSection = document.querySelector('#dashboard');
    if (dashboardSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    runCounterAnimation();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(dashboardSection);
    }

    // --- Scroll Animations (Fade Up) ---
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.hero-content, .section-title, .timeline-item, .expertise-card, .metric-card');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        elements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(el);
        });
    };

    // Inject class for animation
    const style = document.createElement('style');
    style.innerHTML = `
        .fade-in-up {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    animateOnScroll();

    // --- Contact Form Handling ---
    const contactForm = document.querySelector('.contact-form');
    const hiddenIframe = document.querySelector('#hidden_iframe');
    const successModal = document.querySelector('#success-modal');
    const closeModalBtn = document.querySelector('#close-modal-btn');
    const submitBtn = contactForm ? contactForm.querySelector('button[type="submit"]') : null;

    if (contactForm && hiddenIframe && successModal && closeModalBtn && submitBtn) {
        let isSubmitting = false;

        // Function to close modal
        const closeModal = () => {
            successModal.classList.remove('active');
            contactForm.reset();
            submitBtn.disabled = false;
            submitBtn.innerText = 'Send Message';
            submitBtn.style.opacity = '1';
            submitBtn.style.cursor = 'pointer';
        };

        contactForm.addEventListener('submit', () => {
            isSubmitting = true;
            submitBtn.disabled = true;
            submitBtn.innerText = 'Sending...';
            submitBtn.style.opacity = '0.7';
            submitBtn.style.cursor = 'not-allowed';
        });

        hiddenIframe.addEventListener('load', () => {
            if (isSubmitting) {
                successModal.classList.add('active');
                isSubmitting = false;
            }
        });

        closeModalBtn.addEventListener('click', closeModal);

        // Close when clicking outside the modal content
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                closeModal();
            }
        });
    }
});
