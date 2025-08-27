// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initializeLoading();
    initializeNavigation();
    initializeAnimations();
    initializeStats();
    initializeProjectFilters();
    initializeSkillBars();
    initializeContactForm();
    initializeModal();
    initializeBackToTop();
    initializeScrollAnimations();
});

// Loading Screen
function initializeLoading() {
    const loadingScreen = document.getElementById('loading-screen');
    
    // Simulate loading time
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        // Remove from DOM after animation
        setTimeout(() => {
            loadingScreen.remove();
        }, 500);
    }, 2000);
}

// Navigation
function initializeNavigation() {
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Smooth scrolling and active link updates
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }

            // Close mobile menu
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Update active nav link on scroll
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section[id]');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
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

// Animations
function initializeAnimations() {
    // Floating elements parallax effect
    const floatingElements = document.querySelectorAll('.floating-element');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        
        floatingElements.forEach(element => {
            const speed = element.dataset.speed;
            const yPos = -(scrolled * speed / 10);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

// Animated Statistics Counter
function initializeStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    let statsAnimated = false;

    const animateStats = () => {
        if (statsAnimated) return;
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.dataset.target);
            const increment = target / 100;
            let current = 0;
            
            const updateCounter = () => {
                if (current < target) {
                    current += increment;
                    stat.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = target;
                }
            };
            
            updateCounter();
        });
        
        statsAnimated = true;
    };

    // Trigger animation when stats section is visible
    const statsSection = document.querySelector('.stats-section');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
            }
        });
    }, { threshold: 0.5 });

    if (statsSection) {
        observer.observe(statsSection);
    }
}

// Project Filters
function initializeProjectFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.dataset.filter;

            projectCards.forEach(card => {
                if (filterValue === 'all' || card.dataset.category === filterValue) {
                    card.classList.remove('hidden');
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.classList.add('hidden');
                    }, 300);
                }
            });
        });
    });
}

// Skill Bars Animation
function initializeSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    let skillsAnimated = false;

    const animateSkills = () => {
        if (skillsAnimated) return;
        
        skillBars.forEach(bar => {
            const width = bar.dataset.width;
            setTimeout(() => {
                bar.style.width = width;
            }, 200);
        });
        
        skillsAnimated = true;
    };

    // Trigger animation when skills section is visible
    const skillsSection = document.querySelector('.about-skills');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkills();
            }
        });
    }, { threshold: 0.5 });

    if (skillsSection) {
        observer.observe(skillsSection);
    }
}

// Contact Form
function initializeContactForm() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(contactForm);
            const formObject = {};
            
            // Convert FormData to object
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Basic validation
            if (!validateForm(formObject)) {
                return;
            }
            
            // Show loading state
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            try {
                // Simulate form submission (replace with actual endpoint)
                await simulateFormSubmission(formObject);
                
                // Show success message
                showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
                contactForm.reset();
                
            } catch (error) {
                console.error('Form submission error:', error);
                showNotification('Failed to send message. Please try again.', 'error');
            } finally {
                // Reset button state
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

// Form Validation
function validateForm(data) {
    const errors = [];
    
    if (!data.firstName || data.firstName.trim().length < 2) {
        errors.push('First name must be at least 2 characters long');
    }
    
    if (!data.lastName || data.lastName.trim().length < 2) {
        errors.push('Last name must be at least 2 characters long');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (errors.length > 0) {
        showNotification(errors.join('\n'), 'error');
        return false;
    }
    
    return true;
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Simulate form submission
function simulateFormSubmission(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate success/failure
            if (Math.random() > 0.1) { // 90% success rate
                resolve(data);
            } else {
                reject(new Error('Network error'));
            }
        }, 2000);
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <p>${message}</p>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 10000;
        max-width: 400px;
        animation: slideInFromRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutToRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Manual close
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutToRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
}

// Project Modal
function initializeModal() {
    const modal = document.getElementById('project-modal');
    const closeBtn = modal.querySelector('.close');
    
    // Close modal events
    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            closeModal();
        }
    });
}

// Open project modal
function openProjectModal(projectId) {
    const modal = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-body');
    
    const projectData = getProjectData(projectId);
    
    modalBody.innerHTML = `
        <h2>${projectData.title}</h2>
        <img src="${projectData.image}" alt="${projectData.title}" style="width: 100%; border-radius: 10px; margin: 1rem 0;">
        <p>${projectData.description}</p>
        <div class="project-details">
            <h3>Key Features:</h3>
            <ul>
                ${projectData.features.map(feature => `<li>${feature}</li>`).join('')}
            </ul>
            <h3>Technologies Used:</h3>
            <div class="tech-tags">
                ${projectData.technologies.map(tech => `<span class="tag">${tech}</span>`).join('')}
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Close modal
function closeModal() {
    const modal = document.getElementById('project-modal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Project data
function getProjectData(projectId) {
    const projects = {
        zomato: {
            title: 'Zomato Restaurant Industry Sales Dashboard',
            image: 'https://static.wixstatic.com/media/994459_120880a37ae34f20a8b907932d08b10f~mv2.png/v1/fit/w_1440,h_1080,q_90,enc_avif,quality_auto/994459_120880a37ae34f20a8b907932d08b10f~mv2.png',
            description: 'A comprehensive Power BI dashboard analyzing restaurant industry sales data with interactive visualizations, trend analysis, and performance metrics.',
            features: [
                'Real-time sales tracking and monitoring',
                'Geographic analysis of restaurant performance',
                'Customer behavior and preference insights',
                'Revenue trend analysis and forecasting',
                'Interactive filters for detailed exploration'
            ],
            technologies: ['Power BI', 'SQL', 'DAX', 'Excel']
        },
        performance: {
            title: 'Performance Tracker Power BI Dashboard',
            image: 'https://static.wixstatic.com/media/994459_4d79c3daf0ea4b33a5e8f646ec3c5ef5~mv2.png/v1/fit/w_1440,h_1080,q_90,enc_avif,quality_auto/994459_4d79c3daf0ea4b33a5e8f646ec3c5ef5~mv2.png',
            description: 'A real-time performance tracking dashboard with KPI monitoring, trend analysis, and automated reporting capabilities.',
            features: [
                'KPI tracking and monitoring',
                'Automated performance alerts',
                'Trend analysis and forecasting',
                'Comparative performance metrics',
                'Executive summary reports'
            ],
            technologies: ['Power BI', 'SQL Server', 'Python', 'DAX']
        },
        sales: {
            title: 'Sales Performance and Growth Analysis',
            image: 'https://static.wixstatic.com/media/994459_e997afdad7ad4ef494bb884855e33730~mv2.png/v1/fit/w_1440,h_1080,q_90,enc_avif,quality_auto/994459_e997afdad7ad4ef494bb884855e33730~mv2.png',
            description: 'Advanced sales analytics dashboard with growth forecasting, performance metrics, and strategic insights for business decision-making.',
            features: [
                'Sales growth analysis and forecasting',
                'Product performance comparison',
                'Customer segmentation analysis',
                'Market trend identification',
                'Strategic recommendations'
            ],
            technologies: ['Power BI', 'Python', 'Machine Learning', 'SQL']
        },
        plants: {
            title: 'Plants Sales Performance Analysis',
            image: 'https://static.wixstatic.com/media/994459_c9246cd5459b4d5792f3a14062544ded~mv2.png/v1/fit/w_1440,h_1080,q_90,enc_avif,quality_auto/994459_c9246cd5459b4d5792f3a14062544ded~mv2.png',
            description: 'Detailed analysis of plant sales data with seasonal trends, customer insights, and inventory optimization recommendations.',
            features: [
                'Seasonal trend analysis',
                'Customer preference insights',
                'Inventory optimization',
                'Sales forecasting',
                'Product category performance'
            ],
            technologies: ['Power BI', 'Excel', 'SQL', 'Statistical Analysis']
        },
        atm: {
            title: 'ATM Transactions Analysis Dashboard',
            image: 'https://static.wixstatic.com/media/994459_3acd5b913f904183a74ba1c849fa8a48~mv2.png/v1/fit/w_1440,h_1080,q_90,enc_avif,quality_auto/994459_3acd5b913f904183a74ba1c849fa8a48~mv2.png',
            description: 'Financial transaction analysis dashboard with fraud detection capabilities and usage pattern insights for banking operations.',
            features: [
                'Transaction pattern analysis',
                'Fraud detection algorithms',
                'Usage trend monitoring',
                'Geographic transaction mapping',
                'Security alert system'
            ],
            technologies: ['Power BI', 'Python', 'Machine Learning', 'SQL Server']
        },
        amazon: {
            title: 'Amazon Product Analytics Dashboard',
            image: 'https://static.wixstatic.com/media/994459_3ef4dd788f9a4282ac7d665c0ec39fe1~mv2.png/v1/fit/w_1440,h_1080,q_90,enc_avif,quality_auto/994459_3ef4dd788f9a4282ac7d665c0ec39fe1~mv2.png',
            description: 'E-commerce product performance analysis with market trends, competitor insights, and optimization recommendations.',
            features: [
                'Product performance tracking',
                'Market trend analysis',
                'Competitor comparison',
                'Price optimization insights',
                'Customer review sentiment analysis'
            ],
            technologies: ['Power BI', 'Python', 'Web Scraping', 'NLP', 'SQL']
        }
    };
    
    return projects[projectId] || projects.zomato;
}

// Back to Top Button
function initializeBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Scroll Animations
function initializeScrollAnimations() {
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

// Utility Functions
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
    }
}

// Performance optimized scroll handler
const optimizedScrollHandler = throttle(() => {
    // Handle scroll events here if needed
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
    // You could send this to an error tracking service
});

// Unhandled promise rejections
window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled Promise Rejection:', e.reason);
    e.preventDefault();
});

// Add CSS animations for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInFromRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutToRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .notification-close:hover {
        opacity: 0.7;
    }
`;

document.head.appendChild(notificationStyles);
