// Offboarding Module JavaScript

const dashboardModule = {
    init() {
        console.log('Initializing offboarding module...');
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
        const steps = document.querySelectorAll('.step-container');
        steps.forEach(step => {
            step.style.display = 'none';
        });

        // Show the selected step
        const targetStep = document.querySelector(`.step-container[data-step="${stageNumber}"]`);
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

    setupEventListeners() {
        // Offboarding Request Form
        document.getElementById('offboarding-request-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            if (!formData.get('lastWorkingDay') || !formData.get('reason')) {
                this.showNotification('Please fill in all required fields.', 'error');
                return;
            }
            this.stepCompleted[1] = true;
            this.showNotification('Offboarding request submitted successfully.', 'success');
                this.updateStepStatus(1, 'completed');
            this.updateNavigationButtons();
        });

        // Notification Completion
        document.getElementById('notification-complete')?.addEventListener('change', (e) => {
            this.stepCompleted[2] = e.target.checked;
            this.updateStepStatus(2, e.target.checked ? 'completed' : 'pending');
            this.updateNavigationButtons();
        });

        // Asset Return
        document.getElementById('submit-assets')?.addEventListener('click', () => {
            const assets = document.querySelectorAll('input[name="assets"]:checked');
            if (assets.length === 0) {
                this.showNotification('Please select at least one asset to return.', 'error');
                return;
            }
            this.stepCompleted[3] = true;
            this.showNotification('Assets returned successfully.', 'success');
            this.updateStepStatus(3, 'completed');
            this.updateNavigationButtons();
        });

        // System Access
        document.getElementById('system-access-complete')?.addEventListener('change', (e) => {
            this.stepCompleted[4] = e.target.checked;
            this.updateStepStatus(4, e.target.checked ? 'completed' : 'pending');
                this.updateNavigationButtons();
        });

        // Exit Interview Form
        document.getElementById('exit-interview-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const requiredFields = ['employee_name', 'designation', 'doj', 'lwd', 'resignation_date', 
                                 'reporting_manager', 'department', 'enjoyed_most', 'enjoyed_least'];
            
            const missingFields = requiredFields.filter(field => !formData.get(field));
            if (missingFields.length > 0) {
                this.showNotification('Please fill in all required fields.', 'error');
                return;
            }

            this.stepCompleted[5] = true;
            this.showNotification('Exit interview submitted successfully.', 'success');
                this.updateStepStatus(5, 'completed');
            this.updateNavigationButtons();
        });

        // Financial Settlement
        document.getElementById('financial-complete')?.addEventListener('change', (e) => {
            this.stepCompleted[6] = e.target.checked;
            this.updateStepStatus(6, e.target.checked ? 'completed' : 'pending');
            this.updateNavigationButtons();
        });

        // Completion
        document.getElementById('completion-complete')?.addEventListener('change', (e) => {
            this.stepCompleted[7] = e.target.checked;
            this.updateStepStatus(7, e.target.checked ? 'completed' : 'pending');
                this.updateNavigationButtons();
        });
        },

    showCurrentStep() {
        // Hide all steps
        const steps = document.querySelectorAll('.step-container');
        steps.forEach(step => {
            step.style.display = 'none';
        });

        // Show the current step
        const currentStepElement = document.querySelector(`.step-container[data-step="${this.currentStep}"]`);
        if (currentStepElement) {
            currentStepElement.style.display = 'block';
        }
        },

    updateStepStatus(stepNumber, status) {
            const stepContainer = document.querySelector(`.step-container[data-step="${stepNumber}"]`);
            if (!stepContainer) return;

            // Update status badge
            const statusBadge = stepContainer.querySelector('.status-badge');
            if (statusBadge) {
                statusBadge.className = `status-badge ${status}`;
                statusBadge.textContent = status.charAt(0).toUpperCase() + status.slice(1);
            }

        // Update stage indicator
        const stageIndicator = document.querySelector(`.stage-indicator[data-stage="${stepNumber}"]`);
        if (stageIndicator) {
            stageIndicator.classList.remove('active', 'completed');
                if (status === 'completed') {
                stageIndicator.classList.add('completed');
                } else if (stepNumber === this.currentStep) {
                stageIndicator.classList.add('active');
                }
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

    showNotification(message, type = 'info') {
            // Create notification element
            const notification = document.createElement('div');
            notification.className = `notification ${type}`;
            notification.textContent = message;

            // Add notification to the page
            document.body.appendChild(notification);

        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

            // Remove notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
            }, 3000);
        }
    };

// Initialize offboarding module
dashboardModule.init(); 