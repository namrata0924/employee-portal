// Offboarding Module JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize offboarding module
    const offboardingModule = {
        // DOM Elements
        elements: {
            offboardingRequestForm: document.getElementById('offboarding-request-form'),
            exitInterviewForm: document.getElementById('exit-interview-form'),
            submitAssetsButton: document.getElementById('submit-assets'),
            progressBar: document.querySelector('.progress'),
            progressPercentage: document.querySelector('.progress-percentage'),
            stepContainers: document.querySelectorAll('.step-container'),
            nextButton: document.getElementById('next-step'),
            prevButton: document.getElementById('prev-step')
        },

        // Initialize the module
        currentStep: 1,
        totalSteps: 7,
        stepCompleted: {
            1: false,
            2: false,
            3: false,
            4: false,
            5: false,
            6: false,
            7: false
        },

        init: function() {
            this.bindEvents();
            this.bindProgressBarClick();
            this.showCurrentStep();
            this.updateNavigationButtons();
            this.updateProgress();
        },

        bindProgressBarClick: function() {
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

        showCurrentStep: function() {
            const steps = document.querySelectorAll('.step-container');
            steps.forEach((step, index) => {
                step.style.display = (index + 1 === this.currentStep) ? 'block' : 'none';
            });

            // Update circle indicators
            const circles = document.querySelectorAll('.circle');
            circles.forEach((circle, index) => {
                const stepNumber = index + 1;
                circle.classList.remove('active', 'completed');
                
                if (this.stepCompleted[stepNumber]) {
                    circle.classList.add('completed');
                } else if (stepNumber === this.currentStep) {
                    circle.classList.add('active');
                }
            });
        },

        // Bind event listeners
        bindEvents: function() {
            this.elements.offboardingRequestForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleOffboardingRequest(e.target);
            });

            this.elements.exitInterviewForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleExitInterview(e.target);
            });

            this.elements.submitAssetsButton.addEventListener('click', () => {
                this.handleAssetReturn();
            });

            // Add event listeners for completion checkboxes
            const completionCheckboxes = {
                'notification-complete': 2,
                'system-access-complete': 4,
                'financial-complete': 6,
                'completion-complete': 7
            };

            Object.entries(completionCheckboxes).forEach(([checkboxId, stepNumber]) => {
                const checkbox = document.getElementById(checkboxId);
                if (checkbox) {
                    checkbox.addEventListener('change', (e) => {
                        this.stepCompleted[stepNumber] = e.target.checked;
                        if (e.target.checked) {
                            this.updateStepStatus(stepNumber, 'completed');
                            const circle = document.querySelector(`.circle:nth-child(${stepNumber})`);
                            if (circle) {
                                circle.classList.remove('active');
                                circle.classList.add('completed');
                            }
                        } else {
                            this.updateStepStatus(stepNumber, 'pending');
                            const circle = document.querySelector(`.circle:nth-child(${stepNumber})`);
                            if (circle) {
                                circle.classList.remove('completed');
                                circle.classList.add('active');
                            }
                        }
                        this.updateProgress();
                        this.updateNavigationButtons();
                    });
                }
            });

            this.elements.nextButton.addEventListener('click', () => {
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

            this.elements.prevButton.addEventListener('click', () => {
                if (this.currentStep > 1) {
                    this.currentStep--;
                    this.showCurrentStep();
                    this.updateNavigationButtons();
                }
            });
        },

        // Handle offboarding request submission
        handleOffboardingRequest: function(form) {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Validate required fields
            if (!data.lastWorkingDay || !data.reason) {
                this.showNotification('Please fill in all required fields.', 'error');
                return;
            }

            // Simulate API call
            setTimeout(() => {
                // Update step status
                this.updateStepStatus(1, 'completed');
                this.stepCompleted[1] = true;
                this.updateStepStatus(2, 'pending');
                
                // Update circle indicator
                const circle = document.querySelector('.circle:nth-child(1)');
                if (circle) {
                    circle.classList.remove('active');
                    circle.classList.add('completed');
                }
                
                // Show success notification
                this.showNotification('Offboarding request submitted successfully', 'success');
                
                // Update progress and navigation
                this.updateProgress();
                this.updateNavigationButtons();
            }, 1000);
        },

        // Handle exit interview submission
        handleExitInterview: function(form) {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Validate required fields
            if (!data.employee_name || !data.designation || !data.doj || !data.lwd) {
                this.showNotification('Please fill in all required fields.', 'error');
                return;
            }

            // Simulate API call
            setTimeout(() => {
                // Update step status
                this.updateStepStatus(5, 'completed');
                this.stepCompleted[5] = true;
                
                // Show success notification
                this.showNotification('Exit interview submitted successfully', 'success');
                
                // Update progress and navigation
                this.updateProgress();
                this.updateNavigationButtons();
            }, 1000);
        },

        // Handle asset return submission
        handleAssetReturn: function() {
            const checkedAssets = document.querySelectorAll('input[name="assets"]:checked');
            
            if (checkedAssets.length === 0) {
                this.showNotification('Please select at least one asset to return', 'error');
                return;
            }

            // Simulate API call
            setTimeout(() => {
                // Update step status
                this.updateStepStatus(3, 'completed');
                this.stepCompleted[3] = true;
                
                // Show success notification
                this.showNotification('Assets returned successfully', 'success');
                
                // Update progress and navigation
                this.updateProgress();
                this.updateNavigationButtons();
            }, 1000);
        },

        // Update step status
        updateStepStatus: function(stepNumber, status) {
            const stepContainer = document.querySelector(`.step-container[data-step="${stepNumber}"]`);
            if (!stepContainer) return;

            // Update status badge
            const statusBadge = stepContainer.querySelector('.status-badge');
            if (statusBadge) {
                statusBadge.className = `status-badge ${status}`;
                statusBadge.textContent = status.charAt(0).toUpperCase() + status.slice(1);
            }

            // Update circle indicator
            const circle = document.querySelector(`.circle:nth-child(${stepNumber})`);
            if (circle) {
                circle.classList.remove('active', 'completed');
                if (status === 'completed') {
                    circle.classList.add('completed');
                } else if (stepNumber === this.currentStep) {
                    circle.classList.add('active');
                }
            }

            // Update individual status items if they exist
            const statusItems = stepContainer.querySelectorAll('.status');
            statusItems.forEach(item => {
                item.className = `status ${status}`;
                item.textContent = status.charAt(0).toUpperCase() + status.slice(1);
            });
        },

        // Update overall progress
        updateProgress: function() {
            const completedSteps = Object.values(this.stepCompleted).filter(Boolean).length;
            const progress = (completedSteps / this.totalSteps) * 100;

            if (this.elements.progressBar) {
                this.elements.progressBar.style.width = `${progress}%`;
            }
            if (this.elements.progressPercentage) {
                this.elements.progressPercentage.textContent = `${Math.round(progress)}%`;
            }
        },

        // Show notification
        showNotification: function(message, type = 'info') {
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
        },

        updateNavigationButtons: function() {
            this.elements.prevButton.disabled = this.currentStep === 1;
            this.elements.nextButton.disabled = !this.stepCompleted[this.currentStep];
            this.elements.nextButton.textContent = this.currentStep === this.totalSteps ? 'Finish' : 'Next';
        }
    };

    // Initialize the offboarding module
    offboardingModule.init();
}); 