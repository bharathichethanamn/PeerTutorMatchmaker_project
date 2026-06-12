// Interactive Demo for Homepage
document.addEventListener('DOMContentLoaded', function() {
    // Load real statistics
    loadRealStatistics();
    
    // Add interactive elements to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach((card, index) => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
            
            // Add a subtle glow effect
            const icon = this.querySelector('.feature-icon');
            if (icon) {
                icon.style.background = 'var(--primary)';
                icon.style.color = 'white';
                icon.style.transform = 'scale(1.1) rotate(5deg)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            
            const icon = this.querySelector('.feature-icon');
            if (icon) {
                icon.style.background = 'var(--primary-bg)';
                icon.style.color = 'var(--primary)';
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
    
    // Add floating animation to the hero badge
    const heroBadge = document.querySelector('.hero-badge');
    if (heroBadge) {
        setInterval(() => {
            heroBadge.style.transform = 'translateY(-3px)';
            setTimeout(() => {
                heroBadge.style.transform = 'translateY(0px)';
            }, 1000);
        }, 3000);
    }
    
    // Interactive CTA button
    const ctaButtons = document.querySelectorAll('.btn-hero-primary');
    ctaButtons.forEach(btn => {
        let originalText = btn.innerHTML;
        
        btn.addEventListener('mouseenter', function() {
            // Get current stats for dynamic text
            const tutorCount = document.querySelector('.hero-stats .hero-stat-number')?.textContent || '0';
            this.innerHTML = `🎯 Join ${tutorCount}+ Learners!`;
        });
        
        btn.addEventListener('mouseleave', function() {
            this.innerHTML = originalText;
        });
    });
});

// Load real statistics from backend
async function loadRealStatistics() {
    try {
        const response = await fetch('/api/stats');
        const stats = await response.json();
        const heroStats = document.querySelectorAll('.hero-stat-number');
        if (heroStats.length < 4) return;

        animateValue(heroStats[0], 0, stats.activeTutors,   1200, '+');
        animateValue(heroStats[1], 0, stats.studentsHelped, 1200, '+');
        animateValue(heroStats[2], 0, stats.subjects,       1200, '+');
        animateValue(heroStats[3], 0, stats.avgRating,      1200, '★', true);
    } catch (error) {
        console.warn('Could not load statistics:', error);
    }
}

function animateValue(element, start, end, duration, suffix, isDecimal = false) {
    const steps = duration / 16;
    const increment = (end - start) / steps;
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        const done = increment >= 0 ? current >= end : current <= end;
        if (done) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = (isDecimal ? current.toFixed(1) : Math.floor(current)) + suffix;
    }, 16);
}