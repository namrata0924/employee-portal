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
            stepContainers: document.querySelectorAll('.step-container')
        },

        // Initialize the module
        currentStep: 1,
        totalSteps: 7,

        init: function() {
            this.bindEvents();
            this.showCurrentStep();
            this.updateNavigationButtons();
            this.updateProgress();
        },

        showCurrentStep: function() {
            const steps = document.querySelectorAll('.step-container');
            steps.forEach((step, index) => {
                step.style.display = (index + 1 === this.currentStep) ? 'block' : 'none';
            });

            // Update circle indicators
            const circles = document.querySelectorAll('.circle');
            circles.forEach((circle, index) => {
                circle.classList.remove('active');
                if (index < this.currentStep) {
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

            document.getElementById('next-step').addEventListener('click', () => {
                if (this.currentStep < this.totalSteps) {
                    this.currentStep++;
                    this.showCurrentStep();
                    this.updateNavigationButtons();
                }
            });

            document.getElementById('prev-step').addEventListener('click', () => {
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

            // Simulate API call
            setTimeout(() => {
                // Update step status
                this.updateStepStatus(1, 'completed');
                this.updateStepStatus(2, 'pending');
                
                // Show success notification
                this.showNotification('Offboarding request submitted successfully', 'success');
                
                // Update progress
                this.updateProgress();
            }, 1000);
        },

        // Handle exit interview submission
        handleExitInterview: function(form) {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Simulate API call
            setTimeout(() => {
                // Update step status
                this.updateStepStatus(5, 'completed');
                
                // Show success notification
                this.showNotification('Exit interview submitted successfully', 'success');
                
                // Update progress
                this.updateProgress();
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
                
                // Show success notification
                this.showNotification('Assets returned successfully', 'success');
                
                // Update progress
                this.updateProgress();
            }, 1000);
        },

        // Update step status
        updateStepStatus: function(stepNumber, status) {
            const stepContainer = document.querySelector(`.step-container[data-step="${stepNumber}"]`);
            if (!stepContainer) return;

            const statusBadge = stepContainer.querySelector('.status-badge');
            if (statusBadge) {
                statusBadge.className = `status-badge ${status}`;
                statusBadge.textContent = status.charAt(0).toUpperCase() + status.slice(1);
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
            const completedSteps = document.querySelectorAll('.status-badge.completed').length;
            const totalSteps = this.elements.stepContainers.length;
            const progress = (completedSteps / totalSteps) * 100;

            this.elements.progressBar.style.width = `${progress}%`;
            this.elements.progressPercentage.textContent = `${Math.round(progress)}%`;
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
            document.getElementById('prev-step').disabled = this.currentStep === 1;
            document.getElementById('next-step').textContent = this.currentStep === this.totalSteps ? 'Finish' : 'Next';
        }
    };

    // Initialize the offboarding module
    offboardingModule.init();
}); 