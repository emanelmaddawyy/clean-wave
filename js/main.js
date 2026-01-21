/**
 * Clean Wave - Professional Cleaning Services
 * Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initMobileMenu();
    initSmoothScroll();
    initBookingForm();
    initPricingToggle();
    initScrollAnimations();
    initNavbarScroll();
});

/**
 * Mobile Menu Toggle
 */
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');

    if (menuBtn && navMenu) {
        menuBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            menuBtn.classList.toggle('active');

            // Toggle aria-expanded
            const isExpanded = navMenu.classList.contains('active');
            menuBtn.setAttribute('aria-expanded', isExpanded);
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!menuBtn.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                menuBtn.classList.remove('active');
            }
        });

        // Close menu when clicking a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                menuBtn.classList.remove('active');
            });
        });
    }
}

/**
 * Smooth Scroll for anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navbarHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Booking Form Handling
 */
function initBookingForm() {
    const form = document.getElementById('bookingForm');

    if (form) {
        // Form input focus effects
        const inputs = form.querySelectorAll('.form-input');

        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.classList.add('active');
            });

            input.addEventListener('blur', function() {
                if (!this.value) {
                    this.classList.remove('active');
                }
            });
        });

        // Form submission
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Get form data
            const formData = new FormData(form);
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });

            // Validate form
            if (validateForm(data)) {
                // Show success message
                showNotification('Thank you! Your booking request has been submitted.', 'success');
                form.reset();

                // Remove active class from all inputs
                inputs.forEach(input => input.classList.remove('active'));
            }
        });
    }
}

/**
 * Form Validation
 */
function validateForm(data) {
    const { username, email, phone, service, message } = data;

    if (!username || username.trim() === '') {
        showNotification('Please enter your name.', 'error');
        return false;
    }

    if (!email || !isValidEmail(email)) {
        showNotification('Please enter a valid email address.', 'error');
        return false;
    }

    if (!phone || phone.trim() === '') {
        showNotification('Please enter your phone number.', 'error');
        return false;
    }

    if (!service || service === '') {
        showNotification('Please select a service type.', 'error');
        return false;
    }

    return true;
}

/**
 * Email Validation
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Show Notification
 */
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-message">${message}</span>
        <button class="notification-close">&times;</button>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 16px 24px;
        background: ${type === 'success' ? '#113065' : '#dc3545'};
        color: white;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 16px;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;

    // Add close functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 24px;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    `;

    closeBtn.addEventListener('click', () => {
        notification.remove();
    });

    // Add to DOM
    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

/**
 * Pricing Toggle
 */
function initPricingToggle() {
    const toggleBtns = document.querySelectorAll('.toggle-btn');
    const priceAmounts = document.querySelectorAll('.price-box .amount');

    // Price data
    const prices = {
        monthly: ['59.00', '69.00', '99.00'],
        onetime: ['149.00', '199.00', '299.00']
    };

    toggleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active from all buttons
            toggleBtns.forEach(b => b.classList.remove('active'));
            // Add active to clicked button
            this.classList.add('active');

            // Get plan type
            const planType = this.dataset.plan;

            // Update prices with animation
            priceAmounts.forEach((amount, index) => {
                amount.style.opacity = '0';
                setTimeout(() => {
                    amount.textContent = prices[planType][index];
                    amount.style.opacity = '1';
                }, 150);
            });

            // Update period text
            const periods = document.querySelectorAll('.price-box .period');
            periods.forEach(period => {
                period.textContent = planType === 'monthly' ? '/Monthly' : '/One time';
            });
        });
    });
}

/**
 * Scroll Animations
 */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.service-card, .feature-card, .pricing-card, .about-content, .about-images'
    );

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

/**
 * Navbar Scroll Effect
 */
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        if (currentScrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.45)';
            navbar.style.boxShadow = 'none';
        }

        lastScrollY = currentScrollY;
    });

    // Update active nav link based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');

    window.addEventListener('scroll', () => {
        let current = '';
        const scrollY = window.scrollY;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 200;
            const sectionHeight = section.offsetHeight;

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

/**
 * Add CSS Animation Keyframes
 */
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
