// Dashboard Module
const dashboardModule = {
    init() {
        this.activityCards = document.querySelectorAll('.activity-card');
        this.modal = document.getElementById('activity-modal');
        this.modalTitle = document.getElementById('modal-title');
        this.modalBody = document.querySelector('.modal-body');
        this.closeModal = document.querySelector('.close-modal');
        this.overallProgress = document.querySelector('.dashboard-progress .progress');
        this.progressPercentage = document.querySelector('.progress-percentage');
        
        this.completedActivities = 0;
        this.totalActivities = this.activityCards.length;
        
        this.bindEvents();
        this.updateOverallProgress();
    },

    bindEvents() {
        // Activity Card Clicks
        this.activityCards.forEach(card => {
            const startButton = card.querySelector('.start-activity');
            startButton.addEventListener('click', () => {
                const activityType = card.getAttribute('data-activity');
                const activityTitle = card.querySelector('h3').textContent;
                this.openActivityModal(activityType, activityTitle);
            });
        });

        // Close Modal
        this.closeModal.addEventListener('click', () => {
            this.closeActivityModal();
        });

        // Close modal when clicking outside
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeActivityModal();
            }
        });
    },

    openActivityModal(activityType, activityTitle) {
        this.modalTitle.textContent = activityTitle;
        this.modalBody.innerHTML = this.getActivityContent(activityType);
        this.modal.classList.add('active');

        // Initialize form handlers
        const form = this.modalBody.querySelector('form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(activityType, form);
            });
        }
    },

    closeActivityModal() {
        this.modal.classList.remove('active');
    },

    getActivityContent(activityType) {
        const contentTemplates = {
            'process-docs': `
                <div class="document-viewer">
                    <h4>Process Documents</h4>
                    <div class="document-list">
                        <div class="document-item">
                            <i class="fas fa-file-pdf"></i>
                            <span>Company Process Guide</span>
                            <button class="btn-primary">View</button>
                        </div>
                        <div class="document-item">
                            <i class="fas fa-file-pdf"></i>
                            <span>Department Guidelines</span>
                            <button class="btn-primary">View</button>
                        </div>
                    </div>
                </div>
            `,
            'dept-training': `
                <div class="training-section">
                    <h4>Department Training Videos</h4>
                    <div class="video-list">
                        <div class="video-item">
                            <video controls>
                                <source src="assets/videos/dept-training-1.mp4" type="video/mp4">
                            </video>
                            <div class="video-info">
                                <h5>Department Overview</h5>
                                <p>Duration: 15 minutes</p>
                            </div>
                        </div>
                    </div>
                </div>
            `,
            'feedback': `
                <form class="modal-form" id="feedback-form">
                    <div class="form-group">
                        <label>How would you rate your team collaboration?</label>
                        <select required>
                            <option value="">Select Rating</option>
                            <option value="5">Excellent</option>
                            <option value="4">Very Good</option>
                            <option value="3">Good</option>
                            <option value="2">Fair</option>
                            <option value="1">Poor</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>What are your team's strengths?</label>
                        <textarea required></textarea>
                    </div>
                    <div class="form-group">
                        <label>What areas need improvement?</label>
                        <textarea required></textarea>
                    </div>
                    <button type="submit" class="btn-primary">Submit Feedback</button>
                </form>
            `,
            'kpi-kri': `
                <form class="modal-form" id="kpi-form">
                    <div class="form-group">
                        <label>Select KPI Category</label>
                        <select required>
                            <option value="">Select Category</option>
                            <option value="performance">Performance</option>
                            <option value="quality">Quality</option>
                            <option value="efficiency">Efficiency</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>KPI Score (1-10)</label>
                        <input type="number" min="1" max="10" required>
                    </div>
                    <div class="form-group">
                        <label>Comments</label>
                        <textarea required></textarea>
                    </div>
                    <button type="submit" class="btn-primary">Submit KPI</button>
                </form>
            `,
            'brand-survey': `
                <form class="modal-form" id="brand-survey-form">
                    <div class="form-group">
                        <label>How would you rate our brand reputation?</label>
                        <select required>
                            <option value="">Select Rating</option>
                            <option value="5">Excellent</option>
                            <option value="4">Very Good</option>
                            <option value="3">Good</option>
                            <option value="2">Fair</option>
                            <option value="1">Poor</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>What aspects of our brand could be improved?</label>
                        <textarea required></textarea>
                    </div>
                    <button type="submit" class="btn-primary">Submit Survey</button>
                </form>
            `,
            'grievance': `
                <form class="modal-form" id="grievance-form">
                    <div class="form-group">
                        <label>Grievance Type</label>
                        <select required>
                            <option value="">Select Type</option>
                            <option value="workplace">Workplace Environment</option>
                            <option value="colleague">Colleague Behavior</option>
                            <option value="management">Management Issues</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea required placeholder="Please describe your grievance in detail"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Would you like to remain anonymous?</label>
                        <div class="radio-group">
                            <label>
                                <input type="radio" name="anonymous" value="yes" checked> Yes
                            </label>
                            <label>
                                <input type="radio" name="anonymous" value="no"> No
                            </label>
                        </div>
                    </div>
                    <button type="submit" class="btn-primary">Submit Grievance</button>
                </form>
            `,
            'posh': `
                <form class="modal-form" id="posh-form">
                    <div class="form-group">
                        <label>Incident Date</label>
                        <input type="date" required>
                    </div>
                    <div class="form-group">
                        <label>Incident Location</label>
                        <input type="text" required>
                    </div>
                    <div class="form-group">
                        <label>Description of Incident</label>
                        <textarea required placeholder="Please provide detailed information about the incident"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Witnesses (if any)</label>
                        <textarea placeholder="Please list any witnesses to the incident"></textarea>
                    </div>
                    <button type="submit" class="btn-primary">Submit Complaint</button>
                </form>
            `
        };

        return contentTemplates[activityType] || '<p>Content not available</p>';
    },

    handleFormSubmission(activityType, form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Simulate API call
        setTimeout(() => {
            this.updateActivityProgress(activityType);
            this.closeActivityModal();
            this.showNotification('Form submitted successfully');
        }, 1000);
    },

    updateActivityProgress(activityType) {
        const card = document.querySelector(`[data-activity="${activityType}"]`);
        const progressBar = card.querySelector('.progress-indicator .progress');
        progressBar.style.width = '100%';
        
        this.completedActivities++;
        this.updateOverallProgress();
    },

    updateOverallProgress() {
        const progress = (this.completedActivities / this.totalActivities) * 100;
        this.overallProgress.style.width = `${progress}%`;
        this.progressPercentage.textContent = `${Math.round(progress)}%`;
    },

    showNotification(message, type = 'success') {
        if (window.appUtils && window.appUtils.showNotification) {
            window.appUtils.showNotification(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }
};

// Initialize dashboard module
document.addEventListener('DOMContentLoaded', () => {
    dashboardModule.init();
}); 