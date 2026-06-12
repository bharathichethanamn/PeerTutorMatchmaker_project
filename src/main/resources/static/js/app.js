// PeerTutorMatchmaker JavaScript Application
class PeerTutorApp {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.loadCurrentUser();
        this.setupEventListeners();
        this.initModals();
    }

    loadCurrentUser() {
        const userData = localStorage.getItem('currentUser');
        if (userData) {
            this.currentUser = JSON.parse(userData);
        }
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', this.handleLogin.bind(this));
        }

        // Register form
        const registerForm = document.getElementById('registerForm');
        if (registerForm) {
            registerForm.addEventListener('submit', this.handleRegister.bind(this));
        }

        // Session form
        const sessionForm = document.getElementById('sessionForm');
        if (sessionForm) {
            sessionForm.addEventListener('submit', this.handleCreateSession.bind(this));
        }

        // Feedback form
        const feedbackForm = document.getElementById('feedbackForm');
        if (feedbackForm) {
            feedbackForm.addEventListener('submit', this.handleSubmitFeedback.bind(this));
        }

        // Search tutors
        const searchInput = document.getElementById('searchTutors');
        if (searchInput) {
            searchInput.addEventListener('input', this.handleSearchTutors.bind(this));
        }
    }

    initModals() {
        // Modal close buttons
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', this.closeModal.bind(this));
        });

        // Close modal on backdrop click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        });
    }

    async handleLogin(e) {
        e.preventDefault();
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        // Add loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Signing in...';
        
        const formData = new FormData(e.target);
        const loginData = {
            email: formData.get('email'),
            password: formData.get('password')
        };

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            });

            const result = await response.json();
            
            if (response.ok) {
                this.currentUser = result;
                localStorage.setItem('currentUser', JSON.stringify(result));
                this.showNotification('Welcome back!', 'success', 'Login Successful');
                
                // Add a small delay for better UX
                setTimeout(() => {
                    if (result.role === 'TUTOR') {
                        window.location.href = '/tutor-dashboard';
                    } else {
                        window.location.href = '/student-dashboard';
                    }
                }, 1000);
            } else {
                this.showNotification(result.error || 'Invalid email or password', 'error', 'Login Failed');
                
                // Reset button state
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        } catch (error) {
            this.showNotification('Unable to connect. Please check your internet connection.', 'error', 'Connection Error');
            
            // Reset button state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const registerData = {
            name: formData.get('name'),
            email: formData.get('email'),
            password: formData.get('password'),
            role: formData.get('role'),
            subjects: formData.get('subjects') || '',
            skillLevel: formData.get('skillLevel') || '',
            availability: formData.get('availability') || ''
        };

        try {
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(registerData)
            });

            const result = await response.json();
            
            if (response.ok) {
                this.showNotification('Registration successful! Please login.', 'success');
                window.location.href = '/login';
            } else {
                this.showNotification(result.error || 'Registration failed', 'error');
            }
        } catch (error) {
            this.showNotification('Network error. Please try again.', 'error');
        }
    }

    async handleCreateSession(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const sessionData = {
            tutorId: parseInt(formData.get('tutorId')),
            studentId: this.currentUser.userId,
            subject: formData.get('subject'),
            dateTime: formData.get('dateTime')
        };

        try {
            const response = await fetch('/api/sessions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sessionData)
            });

            const result = await response.json();
            
            if (response.ok) {
                this.showNotification('Session request sent successfully!', 'success');
                this.closeModal();
                this.loadSessions();
            } else {
                this.showNotification(result.error || 'Failed to create session', 'error');
            }
        } catch (error) {
            this.showNotification('Network error. Please try again.', 'error');
        }
    }

    async handleSubmitFeedback(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const feedbackData = {
            sessionId: parseInt(formData.get('sessionId')),
            tutorId: parseInt(formData.get('tutorId')),
            studentId: this.currentUser.userId,
            rating: parseInt(formData.get('rating')),
            comments: formData.get('comments')
        };

        try {
            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(feedbackData)
            });

            const result = await response.json();
            
            if (response.ok) {
                this.showNotification('Feedback submitted successfully!', 'success');
                this.closeModal();
                this.loadSessions();
            } else {
                this.showNotification(result.error || 'Failed to submit feedback', 'error');
            }
        } catch (error) {
            this.showNotification('Network error. Please try again.', 'error');
        }
    }

    async handleSearchTutors(e) {
        const searchTerm = e.target.value;
        await this.loadTutors(searchTerm);
    }

    async loadTutors(subject = '') {
        const container = document.getElementById('tutorsContainer');
        if (container) {
            this.showSkeleton(container, 4);
        }
        
        try {
            let url = '/api/tutors';
            if (subject) {
                url += `?subject=${encodeURIComponent(subject)}`;
            }

            const response = await fetch(url);
            const tutors = await response.json();
            
            // Simulate network delay for better UX demonstration
            await new Promise(resolve => setTimeout(resolve, 800));
            
            this.displayTutors(tutors);
        } catch (error) {
            if (container) {
                container.innerHTML = `
                    <div class="empty-state">
                        <span class="empty-state-icon">⚠️</span>
                        <h3>Failed to load tutors</h3>
                        <p>Please check your connection and try again.</p>
                        <button class="empty-state-action" onclick="app.loadTutors()">
                            Retry
                        </button>
                    </div>
                `;
            }
            this.showNotification('Failed to load tutors', 'error', 'Connection Error');
        }
    }

    displayTutors(tutors) {
        const container = document.getElementById('tutorsContainer');
        if (!container) return;

        if (tutors.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <span class="empty-state-icon">🔍</span>
                    <h3>No tutors found</h3>
                    <p>Try adjusting your search criteria or check back later for new tutors.</p>
                    <button class="empty-state-action" onclick="document.getElementById('searchTutors').value = ''; app.loadTutors();">
                        Show All Tutors
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = tutors.map(tutor => {
            const subjects = (tutor.profile?.subjects || '').split(',').filter(s => s.trim()).slice(0, 3);
            const rating = tutor.profile?.rating || 0;
            const totalRatings = tutor.profile?.totalRatings || 0;
            
            return `
                <div class="tutor-card animate-fade-in">
                    <div class="tutor-card-header">
                        <div class="tutor-avatar">
                            ${tutor.name.charAt(0).toUpperCase()}
                        </div>
                        <div class="tutor-info">
                            <div class="tutor-name">${tutor.name}</div>
                            <div class="tutor-subject">${subjects.length > 0 ? subjects[0] : 'Various subjects'}</div>
                        </div>
                    </div>
                    
                    <div class="tutor-meta">
                        <div class="tutor-rating">
                            <div class="rating-stars">
                                ${this.generateStars(rating)}
                            </div>
                            <span class="rating-text">${rating.toFixed(1)} (${totalRatings})</span>
                        </div>
                        ${tutor.profile?.skillLevel ? `<div class="skill-badge">${tutor.profile.skillLevel}</div>` : ''}
                    </div>
                    
                    ${subjects.length > 0 ? `
                        <div class="tutor-subjects">
                            ${subjects.map(subject => `<span class="subject-tag">${subject.trim()}</span>`).join('')}
                        </div>
                    ` : ''}
                    
                    <div class="tutor-card-footer">
                        <div class="tutor-availability">
                            <span class="availability-dot"></span>
                            ${tutor.profile?.availability || 'Available'}
                        </div>
                        <button class="btn-book-session" onclick="app.openSessionModal(${tutor.userId})">
                            📅 Book Session
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }

    generateStars(rating) {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(`<span class="rating-star ${i <= rating ? 'filled' : ''}">${i <= rating ? '★' : '☆'}</span>`);
        }
        return stars.join('');
    }

    async loadSessions() {
        if (!this.currentUser) return;

        try {
            const endpoint = this.currentUser.role === 'TUTOR' 
                ? `/api/sessions/tutor/${this.currentUser.userId}`
                : `/api/sessions/student/${this.currentUser.userId}`;
            
            const response = await fetch(endpoint);
            const sessions = await response.json();
            
            this.displaySessions(sessions);
        } catch (error) {
            this.showNotification('Failed to load sessions', 'error');
        }
    }

    displaySessions(sessions) {
        const container = document.getElementById('sessionsContainer');
        if (!container) return;

        container.innerHTML = sessions.map(session => `
            <tr>
                <td>${session.subject}</td>
                <td>${this.currentUser.role === 'TUTOR' ? session.student.name : session.tutor.name}</td>
                <td>${new Date(session.dateTime).toLocaleString()}</td>
                <td>
                    <span class="badge badge-${this.getStatusBadgeClass(session.status)}">
                        ${session.status}
                    </span>
                </td>
                <td>
                    ${this.getSessionActions(session)}
                </td>
            </tr>
        `).join('');
    }

    getStatusBadgeClass(status) {
        switch (status) {
            case 'CONFIRMED': return 'success';
            case 'PENDING': return 'warning';
            case 'COMPLETED': return 'primary';
            case 'CANCELLED': return 'error';
            default: return 'primary';
        }
    }

    getSessionActions(session) {
        const actions = [];
        
        if (this.currentUser.role === 'TUTOR' && session.status === 'PENDING') {
            actions.push(`<button class="btn btn-success btn-sm" onclick="app.updateSessionStatus(${session.sessionId}, 'CONFIRMED')">Accept</button>`);
            actions.push(`<button class="btn btn-error btn-sm" onclick="app.updateSessionStatus(${session.sessionId}, 'CANCELLED')">Decline</button>`);
        }
        
        if (session.status === 'CONFIRMED') {
            actions.push(`<button class="btn btn-primary btn-sm" onclick="app.updateSessionStatus(${session.sessionId}, 'COMPLETED')">Mark Complete</button>`);
        }
        
        if (this.currentUser.role === 'STUDENT' && session.status === 'COMPLETED') {
            actions.push(`<button class="btn btn-warning btn-sm" onclick="app.openFeedbackModal(${session.sessionId}, ${session.tutor.userId})">Give Feedback</button>`);
        }
        
        return actions.join(' ');
    }

    async updateSessionStatus(sessionId, status) {
        try {
            const response = await fetch(`/api/sessions/${sessionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status })
            });

            const result = await response.json();
            
            if (response.ok) {
                this.showNotification(`Session ${status.toLowerCase()} successfully!`, 'success');
                this.loadSessions();
            } else {
                this.showNotification(result.error || 'Failed to update session', 'error');
            }
        } catch (error) {
            this.showNotification('Network error. Please try again.', 'error');
        }
    }

    openSessionModal(tutorId) {
        const modal = document.getElementById('sessionModal');
        const tutorIdInput = document.getElementById('sessionTutorId');
        
        if (tutorIdInput) {
            tutorIdInput.value = tutorId;
        }
        
        this.showModal(modal);
    }

    openFeedbackModal(sessionId, tutorId) {
        const modal = document.getElementById('feedbackModal');
        const sessionIdInput = document.getElementById('feedbackSessionId');
        const tutorIdInput = document.getElementById('feedbackTutorId');
        
        if (sessionIdInput) sessionIdInput.value = sessionId;
        if (tutorIdInput) tutorIdInput.value = tutorId;
        
        this.showModal(modal);
    }

    showModal(modal) {
        if (modal) {
            modal.classList.add('active');
        }
    }

    closeModal() {
        document.querySelectorAll('.modal').forEach(modal => {
            modal.classList.remove('active');
        });
    }

    showNotification(message, type = 'info', title = null) {
        // Remove existing notifications
        document.querySelectorAll('.notification').forEach(n => n.remove());
        
        // Icon mapping
        const icons = {
            info: 'ℹ️',
            success: '✓',
            warning: '⚠️',
            error: '❌'
        };
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-icon">${icons[type] || icons.info}</div>
            <div class="notification-content">
                ${title ? `<div class="notification-title">${title}</div>` : ''}
                <div class="notification-message">${message}</div>
            </div>
            <button class="notification-close">&times;</button>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        const autoRemove = setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);

        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            clearTimeout(autoRemove);
            notification.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        });
    }

    showLoading(container, message = 'Loading...') {
        if (typeof container === 'string') {
            container = document.getElementById(container);
        }
        if (!container) return;
        
        container.innerHTML = `
            <div class="loading-container">
                <div class="loading-spinner"></div>
                <span>${message}</span>
            </div>
        `;
    }

    showSkeleton(container, count = 3) {
        if (typeof container === 'string') {
            container = document.getElementById(container);
        }
        if (!container) return;
        
        const skeletons = Array.from({ length: count }, (_, i) => `
            <div class="tutor-card">
                <div class="tutor-card-header">
                    <div class="skeleton" style="width: 52px; height: 52px; border-radius: var(--radius-xl);"></div>
                    <div style="flex: 1;">
                        <div class="skeleton skeleton-line short"></div>
                        <div class="skeleton skeleton-line medium"></div>
                    </div>
                </div>
                <div class="skeleton skeleton-line long"></div>
                <div class="skeleton skeleton-line medium"></div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1rem;">
                    <div class="skeleton skeleton-line short"></div>
                    <div class="skeleton" style="width: 100px; height: 32px;"></div>
                </div>
            </div>
        `).join('');
        
        container.innerHTML = skeletons;
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        window.location.href = '/';
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new PeerTutorApp();
});

// Notification styles
const notificationStyles = `
<style>
.notification {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    color: white;
    z-index: 1000;
    animation: slideIn 0.3s ease-out;
}

.notification-info { background-color: #3b82f6; }
.notification-success { background-color: #10b981; }
.notification-warning { background-color: #f59e0b; }
.notification-error { background-color: #ef4444; }

.notification-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
}

.notification-close {
    background: none;
    border: none;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
}

@keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
}
</style>
`;

document.head.insertAdjacentHTML('beforeend', notificationStyles);