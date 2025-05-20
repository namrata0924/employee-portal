const dashboardModule = {
    init() {
        console.log('Initializing dashboard module...');
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

        // Always wait for DOM to be fully loaded
        document.addEventListener('DOMContentLoaded', () => {
            console.log('DOM Content Loaded');
            this.setupEventListeners();
            this.initializeStageIndicatorClicks();
        this.showCurrentStep();
            this.updateProgress();
        });
    },

    initializeStageIndicatorClicks() {
        const indicators = document.querySelectorAll('.stage-indicator');
        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                const stageNumber = index + 1;
                if (this.canAccessStage(stageNumber)) {
                    this.navigateToStage(stageNumber);
                } else {
                    this.showNotification('Please complete the previous steps first.', 'error');
                }
            });
        });
    },

    canAccessStage(stageNumber) {
        // Can only access current stage or completed stages
        return stageNumber <= this.currentStep || this.stepCompleted[stageNumber - 1];
    },

    navigateToStage(stageNumber) {
        if (stageNumber === this.currentStep) return;

        // Hide all steps
        const steps = document.querySelectorAll('.step');
        steps.forEach(step => {
            step.style.display = 'none';
        });

        // Show the selected step
        const targetStep = document.querySelector(`.step[data-step="${stageNumber}"]`);
        if (targetStep) {
            targetStep.style.display = 'block';
        }

        // Update current step
        this.currentStep = stageNumber;

        // Update stage indicators
        const indicators = document.querySelectorAll('.stage-indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.remove('active', 'completed');
            if (index + 1 < stageNumber) {
                indicator.classList.add('completed');
            } else if (index + 1 === stageNumber) {
                indicator.classList.add('active');
            }
        });

        // Update navigation buttons
        this.updateNavigationButtons();
        
        // Update progress bar
        this.updateProgress();
    },

    updateProgress() {
        const progress = (this.currentStep - 1) / (this.totalSteps - 1) * 100;
        const progressBar = document.querySelector('.stage-progress-bar .progress');
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
    },

    updateNavigationButtons() {
        const prevButton = document.querySelector('.btn-prev');
        const nextButton = document.querySelector('.btn-next');

        if (prevButton) {
            prevButton.disabled = this.currentStep === 1;
        }

        if (nextButton) {
            nextButton.disabled = !this.stepCompleted[this.currentStep];
            nextButton.textContent = this.currentStep === this.totalSteps ? 'Finish' : 'Next';
        }
    },

    nextStage() {
        if (this.currentStep < this.totalSteps) {
            if (!this.stepCompleted[this.currentStep]) {
                this.showNotification('Please complete the current step before proceeding.', 'error');
                return;
            }
            this.navigateToStage(this.currentStep + 1);
        }
    },

    previousStage() {
        if (this.currentStep > 1) {
            this.navigateToStage(this.currentStep - 1);
        }
    },

    setupEventListeners() {
        console.log('Setting up event listeners');
        
        // Content Type Selection Handler
        const trainingContentType = document.getElementById('training-content-type');
        console.log('Training Content Type Element:', trainingContentType);
        
        if (trainingContentType) {
            trainingContentType.addEventListener('change', (e) => {
                console.log('Content type changed:', e.target.value);
                const form = e.target.closest('form');
                if (!form) {
                    console.log('Form not found');
                    return;
                }

                const pdfContent = form.querySelector('.pdf-content');
                const videoContent = form.querySelector('.video-content');
                
                console.log('PDF Content Element:', pdfContent);
                console.log('Video Content Element:', videoContent);
                
                if (pdfContent && videoContent) {
                    if (e.target.value === 'pdf') {
                        pdfContent.style.display = 'block';
                        videoContent.style.display = 'none';
                    } else if (e.target.value === 'video') {
                        pdfContent.style.display = 'none';
                        videoContent.style.display = 'block';
                    } else {
                        pdfContent.style.display = 'none';
                        videoContent.style.display = 'none';
                    }
                }
            });
        }

        // Document Type Selection Handlers
        document.getElementById('process-doc-type')?.addEventListener('change', (e) => {
            const pdfUpload = e.target.closest('form').querySelector('.pdf-upload');
            const videoUpload = e.target.closest('form').querySelector('.video-upload');
            
            if (pdfUpload && videoUpload) {
            pdfUpload.style.display = e.target.value === 'pdf' ? 'block' : 'none';
            videoUpload.style.display = e.target.value === 'video' ? 'block' : 'none';
            }
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
    },

    showCurrentStep() {
        console.log('Showing current step:', this.currentStep);
        // Hide all steps
        const steps = document.querySelectorAll('.step');
        steps.forEach(step => {
            step.style.display = 'none';
            console.log('Hiding step:', step.dataset.step);
        });

        // Show the current step
        const currentStepElement = document.querySelector(`.step[data-step="${this.currentStep}"]`);
        if (currentStepElement) {
            currentStepElement.style.display = 'block';
            console.log('Showing step:', this.currentStep);
            
            // If it's step 2, ensure content type is properly initialized
            if (this.currentStep === 2) {
                const trainingContentType = document.getElementById('training-content-type');
                if (trainingContentType) {
                    // Trigger change event to show/hide appropriate content
                    const event = new Event('change');
                    trainingContentType.dispatchEvent(event);
                }
            }
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
    dashboardModule.init();