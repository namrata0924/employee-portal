const dashboardModule = {
    init() {
        this.currentStep = 1;
        this.totalSteps = 7;
        this.stepCompleted = {
            1: false,
            2: false,
            3: false,
            4: false,
            5: false,
            6: false,
            7: false
        };

        this.bindEvents();
        this.bindProgressBarClick();
        this.showCurrentStep();
        this.updateNavigationButtons();
    },

    bindProgressBarClick() {
        const circles = document.querySelectorAll('.circle');
        circles.forEach((circle, index) => {
            circle.addEventListener('click', () => {
                const stepNumber = index + 1;
                
                // Check if trying to access a future step
                if (stepNumber > this.currentStep) {
                    this.showNotification('Please complete the current step before proceeding.', 'error');
                    return;
                }

                // Check if trying to access step 2 without completing step 1
                if (stepNumber === 2 && !this.stepCompleted[1]) {
                    this.showNotification('Please complete Step 1 before proceeding to Step 2.', 'error');
                    return;
                }

                this.currentStep = stepNumber;
                this.showCurrentStep();
                this.updateNavigationButtons();
            });
        });
    },

    showCurrentStep() {
        // Hide all steps
        const steps = document.querySelectorAll('.step');
        steps.forEach(step => step.style.display = 'none');

        // Show the current step
        const currentStepElement = document.querySelector(`.step[data-step="${this.currentStep}"]`);
        if (currentStepElement) {
            currentStepElement.style.display = 'block';
        }

        // Update circle indicators
        const circles = document.querySelectorAll('.circle');
        circles.forEach((circle, index) => {
            circle.classList.remove('active', 'completed');
            if (index + 1 < this.currentStep) {
                circle.classList.add('completed');
            } else if (index + 1 === this.currentStep) {
                circle.classList.add('active');
            }
        });
    },

    bindEvents() {
        // Document Type Selection Handlers
        document.getElementById('process-doc-type')?.addEventListener('change', (e) => {
            const pdfUpload = e.target.closest('form').querySelector('.pdf-upload');
            const videoUpload = e.target.closest('form').querySelector('.video-upload');
            
            pdfUpload.style.display = e.target.value === 'pdf' ? 'block' : 'none';
            videoUpload.style.display = e.target.value === 'video' ? 'block' : 'none';
        });

        document.getElementById('training-content-type')?.addEventListener('change', (e) => {
            const pdfUpload = e.target.closest('form').querySelector('.pdf-upload');
            const videoUpload = e.target.closest('form').querySelector('.video-upload');
            
            pdfUpload.style.display = e.target.value === 'pdf' ? 'block' : 'none';
            videoUpload.style.display = e.target.value === 'video' ? 'block' : 'none';
        });

        // Video Completion Checkbox
        document.getElementById('video-watched')?.addEventListener('change', (e) => {
            this.stepCompleted[2] = e.target.checked;
            this.updateStepStatus(2, e.target.checked ? 'completed' : 'pending');
            this.updateNavigationButtons();
        });

        // Process Docs Form
        document.getElementById('process-docs-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const docType = formData.get('documentType');
            
            if (!docType) {
                this.showNotification('Please select a document type.', 'error');
                return;
            }

            if (docType === 'pdf' && !formData.get('pdfDocument')) {
                this.showNotification('Please upload a PDF document.', 'error');
                return;
            }

            if (docType === 'video' && !formData.get('videoLink')) {
                this.showNotification('Please provide a video link.', 'error');
                return;
            }

            this.stepCompleted[1] = true;
            this.showNotification('Process documents submitted successfully.', 'success');
            this.updateStepStatus(1, 'completed');
            this.updateNavigationButtons();
        });

        // Training Form
        document.getElementById('training-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const contentType = formData.get('contentType');
            
            if (!contentType) {
                this.showNotification('Please select a content type.', 'error');
                return;
            }

            if (contentType === 'pdf' && !formData.get('trainingPdf')) {
                this.showNotification('Please upload a training PDF.', 'error');
                return;
            }

            if (contentType === 'video' && !formData.get('trainingVideoLink')) {
                this.showNotification('Please provide a training video link.', 'error');
                return;
            }

            this.stepCompleted[2] = true;
            this.showNotification('Training content submitted successfully.', 'success');
            this.updateStepStatus(2, 'completed');
            this.updateNavigationButtons();
        });

        // Feedback Form
        document.getElementById('feedback-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            if (!formData.get('rating') || !formData.get('strengths') || !formData.get('improvements')) {
                this.showNotification('Please fill in all required fields.', 'error');
                return;
            }
            this.stepCompleted[3] = true;
            this.showNotification('Feedback submitted successfully.', 'success');
            this.updateStepStatus(3, 'completed');
            this.updateNavigationButtons();
        });

        // KPI Form
        document.getElementById('kpi-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            if (!formData.get('category') || !formData.get('score') || !formData.get('comments')) {
                this.showNotification('Please fill in all required fields.', 'error');
                return;
            }
            this.stepCompleted[4] = true;
            this.showNotification('KPI submitted successfully.', 'success');
            this.updateStepStatus(4, 'completed');
            this.updateNavigationButtons();
        });

        // Brand Survey Form
        document.getElementById('brand-survey-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            if (!formData.get('rating') || !formData.get('improvements')) {
                this.showNotification('Please fill in all required fields.', 'error');
                return;
            }
            this.stepCompleted[5] = true;
            this.showNotification('Brand survey submitted successfully.', 'success');
            this.updateStepStatus(5, 'completed');
            this.updateNavigationButtons();
        });

        // Grievance Form
        document.getElementById('grievance-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            if (!formData.get('type') || !formData.get('description')) {
                this.showNotification('Please fill in all required fields.', 'error');
                return;
            }
            this.stepCompleted[6] = true;
            this.showNotification('Grievance submitted successfully.', 'success');
            this.updateStepStatus(6, 'completed');
            this.updateNavigationButtons();
        });

        // POSH Form
        document.getElementById('posh-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            if (!formData.get('date') || !formData.get('location') || !formData.get('description')) {
                this.showNotification('Please fill in all required fields.', 'error');
                return;
            }
            this.stepCompleted[7] = true;
            this.showNotification('POSH complaint submitted successfully.', 'success');
            this.updateStepStatus(7, 'completed');
            this.updateNavigationButtons();
        });

        // Navigation Buttons
        document.querySelectorAll('#prev-step').forEach(button => {
            button.addEventListener('click', () => {
                if (this.currentStep > 1) {
                    this.currentStep--;
                    this.showCurrentStep();
                    this.updateNavigationButtons();
                }
            });
        });

        document.querySelectorAll('#next-step').forEach(button => {
            button.addEventListener('click', () => {
                if (this.currentStep < this.totalSteps) {
                    if (!this.stepCompleted[this.currentStep]) {
                        this.showNotification('Please complete the current step before proceeding.', 'error');
                        return;
                    }
                    this.currentStep++;
                    this.showCurrentStep();
                    this.updateNavigationButtons();
                }
            });
        });
    },

    updateStepStatus(stepNumber, status) {
        const stepContainer = document.querySelector(`.step[data-step="${stepNumber}"]`);
        if (!stepContainer) return;

        // Update circle indicator
        const circle = document.querySelector(`.circle:nth-child(${stepNumber})`);
        if (circle) {
            circle.classList.remove('active', 'pending');
            circle.classList.add(status);
        }

        // Update step header status if it exists
        const statusBadge = stepContainer.querySelector('.status-badge');
        if (statusBadge) {
            statusBadge.className = `status-badge ${status}`;
            statusBadge.textContent = status.charAt(0).toUpperCase() + status.slice(1);
        }
    },

    updateNavigationButtons() {
        const prevButtons = document.querySelectorAll('#prev-step');
        const nextButtons = document.querySelectorAll('#next-step');

        prevButtons.forEach(button => {
            button.disabled = this.currentStep === 1;
        });

        nextButtons.forEach(button => {
            button.disabled = !this.stepCompleted[this.currentStep];
            button.textContent = this.currentStep === this.totalSteps ? 'Finish' : 'Next';
        });
    },

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        // Add notification to the page
        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
};

// Initialize existing module
document.addEventListener('DOMContentLoaded', () => {
    dashboardModule.init();
});