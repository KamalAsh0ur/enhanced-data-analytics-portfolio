// Notebooks Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    initializeNotebookFilters();
    initializeNotebookAnimations();
    initializeNotebookStats();
});

// Notebook Filters
function initializeNotebookFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const notebookCards = document.querySelectorAll('.notebook-card');

    if (filterButtons.length === 0) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const filterValue = button.dataset.filter;

            notebookCards.forEach(card => {
                const categories = card.dataset.category ? card.dataset.category.split(' ') : ['all'];
                
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1) translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8) translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Notebook Animations
function initializeNotebookAnimations() {
    const notebookCards = document.querySelectorAll('.notebook-card');
    
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    notebookCards.forEach(card => {
        observer.observe(card);
    });

    // Add hover effects for notebook cards
    notebookCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Notebook Statistics Animation
function initializeNotebookStats() {
    const statNumbers = document.querySelectorAll('.hero-stats .stat-number');
    let statsAnimated = false;

    const animateStats = () => {
        if (statsAnimated) return;
        
        statNumbers.forEach(stat => {
            const finalText = stat.textContent;
            const hasPlus = finalText.includes('+');
            const hasPercent = finalText.includes('%');
            const targetNumber = parseInt(finalText.replace(/[+%]/g, ''));
            
            let current = 0;
            const increment = targetNumber / 50;
            
            const updateCounter = () => {
                if (current < targetNumber) {
                    current += increment;
                    let displayValue = Math.ceil(current);
                    
                    if (hasPlus) displayValue += '+';
                    if (hasPercent) displayValue += '%';
                    
                    stat.textContent = displayValue;
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = finalText;
                }
            };
            
            updateCounter();
        });
        
        statsAnimated = true;
    };

    // Trigger animation when hero stats are visible
    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                }
            });
        }, { threshold: 0.5 });

        observer.observe(heroStats);
    }
}

// Notebook Card Interactions
function initializeNotebookInteractions() {
    const notebookCards = document.querySelectorAll('.notebook-card');
    
    notebookCards.forEach(card => {
        // Add click tracking for analytics (if needed)
        const githubLink = card.querySelector('a[href*="github"]');
        const colabLink = card.querySelector('a[href*="colab"]');
        
        if (githubLink) {
            githubLink.addEventListener('click', (e) => {
                // Track GitHub link clicks
                console.log('GitHub notebook viewed:', githubLink.href);
            });
        }
        
        if (colabLink) {
            colabLink.addEventListener('click', (e) => {
                // Track Colab link clicks
                console.log('Colab notebook opened:', colabLink.href);
            });
        }
    });
}

// Search Functionality (if needed in the future)
function initializeNotebookSearch() {
    const searchInput = document.getElementById('notebook-search');
    if (!searchInput) return;
    
    const notebookCards = document.querySelectorAll('.notebook-card');
    
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        notebookCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
            
            const isMatch = title.includes(searchTerm) || 
                          description.includes(searchTerm) || 
                          tags.some(tag => tag.includes(searchTerm));
            
            if (isMatch) {
                card.style.display = 'block';
                card.style.opacity = '1';
            } else {
                card.style.opacity = '0.3';
            }
        });
    });
}

// Lazy Loading for Notebook Previews (future enhancement)
function initializeLazyLoading() {
    const notebookCards = document.querySelectorAll('.notebook-card');
    
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const card = entry.target;
                // Load notebook preview or additional content
                card.classList.add('loaded');
                imageObserver.unobserve(card);
            }
        });
    });
    
    notebookCards.forEach(card => {
        imageObserver.observe(card);
    });
}

// Utility Functions
function showNotebookModal(notebookId) {
    // Future enhancement: Show detailed notebook information in a modal
    console.log('Show modal for notebook:', notebookId);
}

function copyNotebookLink(notebookUrl) {
    navigator.clipboard.writeText(notebookUrl).then(() => {
        showNotification('Notebook link copied to clipboard!', 'success');
    }).catch(err => {
        console.error('Failed to copy link:', err);
        showNotification('Failed to copy link', 'error');
    });
}

// Initialize additional features when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeNotebookInteractions();
    initializeLazyLoading();
});

// Export functions for potential use in other scripts
window.NotebooksPage = {
    showNotebookModal,
    copyNotebookLink,
    initializeNotebookFilters,
    initializeNotebookAnimations
};
