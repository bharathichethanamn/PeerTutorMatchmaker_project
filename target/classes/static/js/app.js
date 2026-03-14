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
                this.showNotification('Login successful!', 'success');
                
                // Redirect based on role
                if (result.role === 'TUTOR') {
                    window.location.href = '/tutor-dashboard';
                } else {
                    window.location.href = '/student-dashboard';
                }
            } else {
                this.showNotification(result.error || 'Login failed', 'error');
            }
        } catch (error) {
            this.showNotification('Network error. Please try again.', 'error');
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
        try {
            let url = '/api/tutors';
            if (subject) {
                url += `?subject=${encodeURIComponent(subject)}`;
            }

            const response = await fetch(url);
            const tutors = await response.json();
            
            this.displayTutors(tutors);
        } catch (error) {
            this.showNotification('Failed to load tutors', 'error');
        }
    }

    displayTutors(tutors) {
        const container = document.getElementById('tutorsContainer');
        if (!container) return;

        container.innerHTML = tutors.map(tutor => `
            <div class="card">
                <div class="card-body">
                    <h3 class="mb-2">${tutor.name}</h3>
                    <p class="text-gray-600 mb-2">${tutor.profile?.subjects || 'No subjects listed'}</p>
                    <p class="text-sm text-gray-500 mb-2">Skill Level: ${tutor.profile?.skillLevel || 'Not specified'}</p>
                    <p class="text-sm text-gray-500 mb-4">Rating: ${tutor.profile?.rating || 0}/5 (${tutor.profile?.totalRatings || 0} reviews)</p>
                    <button class="btn btn-primary" onclick="app.openSessionModal(${tutor.userId})">
                        Book Session
                    </button>
                </div>
            </div>
        `).join('');
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

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);

        // Manual close
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });
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