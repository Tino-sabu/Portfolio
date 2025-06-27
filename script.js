// Portfolio Website JavaScript
// Author: Tino Sabu

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initSmoothScrolling();
    initActiveNavigation();
    initScrollAnimations();
    initContactForm();
    initScrollToTop();
    initTypingEffect();
    initSkillTagAnimations();
    initEmailJS();

});

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-links a, .cta-button');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only handle internal links
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const headerHeight = document.querySelector('header').offsetHeight;
                    const targetPosition = targetElement.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Active navigation highlighting
function initActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    function updateActiveNav() {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', throttle(updateActiveNav, 100));
}

// Scroll animations using Intersection Observer
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.project-card, .timeline-item, .contact-item');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// EmailJS Configuration
function initEmailJS() {
    // Replace with your EmailJS public key
    emailjs.init("fnc31xCnM8QWq64QS");
}

// Contact form handling with EmailJS
function initContactForm() {
    const form = document.getElementById('projectInquiryForm');
    const submitBtn = document.getElementById('submitBtn');
    const formMessage = document.getElementById('formMessage');
    
    if (!form) return;
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validate form data
        if (!validateForm(data)) {
            showFormMessage('Please fill in all required fields correctly.', 'error');
            return;
        }
        
        // Disable submit button and show loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        
        try {
            // Send email using EmailJS
            await sendEmailWithEmailJS(data);
            
            showFormMessage('Thank you! Your project inquiry has been sent successfully. I\'ll get back to you soon!', 'success');
            form.reset();
            
        } catch (error) {
            console.error('Email sending failed:', error);
            showFormMessage('Sorry, there was an error sending your message. Please try again or contact me directly at tinosabu2117@gmail.com', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send Project Inquiry';
        }
    });
}

// Send email using EmailJS
async function sendEmailWithEmailJS(formData) {
    const templateParams = {
        client_name: formData.clientName,
        client_email: formData.clientEmail,
        project_name: formData.projectName,
        project_description: formData.projectDescription,
        to_email: 'tinosabu2117@gmail.com', // Your email
        from_name: formData.clientName,
        reply_to: formData.clientEmail,
        date: new Date().toLocaleDateString()
    };
    return emailjs.send(
        'service_hq8sqbe',      // service ID
        'template_d35zrlr',     // template ID
        templateParams
    );
}

// Form validation
function validateForm(data) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    return (
        data.clientName.trim().length > 0 &&
        emailRegex.test(data.clientEmail) &&
        data.projectName.trim().length > 0 &&
        data.projectDescription.trim().length > 20
    );
}

// Show form message
function showFormMessage(message, type) {
    const formMessage = document.getElementById('formMessage');
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';
    
    // Hide message after 5 seconds
    setTimeout(() => {
        formMessage.style.display = 'none';
    }, 5000);
}

// Scroll to top button
function initScrollToTop() {
    // Create scroll to top button
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.innerHTML = '↑';
    scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollTopBtn);
    
    // Show/hide button based on scroll position
    function toggleScrollTopBtn() {
        if (window.scrollY > 300) {
            scrollTopBtn.style.display = 'block';
        } else {
            scrollTopBtn.style.display = 'none';
        }
    }
    
    // Scroll to top functionality
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    window.addEventListener('scroll', throttle(toggleScrollTopBtn, 100));
}

// Typing effect for hero text
function initTypingEffect() {
    const heroText = document.querySelector('.hero-text p');
    if (!heroText) return;
    
    const originalText = heroText.textContent;
    const titles = [
        'Computer Science Student',
        'Full-Stack Developer',
        'Problem Solver',
        'Tech Enthusiast'
    ];
    
    let currentTitleIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;
    
    function typeWriter() {
        const currentTitle = titles[currentTitleIndex];
        
        if (isDeleting) {
            heroText.textContent = currentTitle.substring(0, currentCharIndex - 1);
            currentCharIndex--;
        } else {
            heroText.textContent = currentTitle.substring(0, currentCharIndex + 1);
            currentCharIndex++;
        }
        
        let typeSpeed = isDeleting ? 50 : 100;
        
        if (!isDeleting && currentCharIndex === currentTitle.length) {
            typeSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && currentCharIndex === 0) {
            isDeleting = false;
            currentTitleIndex = (currentTitleIndex + 1) % titles.length;
            typeSpeed = 200; // Pause before typing next
        }
        
        setTimeout(typeWriter, typeSpeed);
    }
    
    // Start typing effect after 1 second
    setTimeout(typeWriter, 1000);
}

// Skill tag hover animations
function initSkillTagAnimations() {
    const skillTags = document.querySelectorAll('.skill-tag');
    
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(2deg)';
        });
        
        tag.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}

// Utility function to throttle scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
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

// Handle window resize
window.addEventListener('resize', debounce(() => {
    // Recalculate positions if needed
    console.log('Window resized');
}, 250));

// Handle page visibility change
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        console.log('Page hidden');
    } else {
        console.log('Page visible');
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Remove any loading spinners or overlays
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.display = 'none';
    }
});

// Error handling for images
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            console.log('Image failed to load:', this.src);
            // You could set a fallback image here
            // this.src = 'path/to/fallback-image.jpg';
        });
    });
});

// Console welcome message
console.log(`
🚀 Welcome to Tino Sabu's Portfolio!
📧 Contact: tinosabu2117@gmail.com
💼 LinkedIn: linkedin.com/in/tinosahu
🐙 GitHub: github.com/tinosahu

Thanks for checking out the code! 
Feel free to reach out if you have any questions.
`);

// Export functions for potential testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateForm,
        throttle,
        debounce
    };
}