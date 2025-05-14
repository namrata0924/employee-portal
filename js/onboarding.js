// Onboarding Module
const onboardingModule = {
    init() {
        this.stages = document.querySelectorAll('.stage');
        this.stageIndicators = document.querySelectorAll('.stage-indicator');
        this.progressBar = document.querySelector('.stage-progress-bar .progress');
        this.steps = document.querySelectorAll('.step');
        this.forms = document.querySelectorAll('.onboarding-form');
        this.videos = document.querySelectorAll('video');
        this.fileInputs = document.querySelectorAll('input[type="file"]');
        this.quizForms = document.querySelectorAll('.quiz-form');
        
        this.currentStage = 1;
        this.totalStages = this.stages.length;
        this.completedStages = new Set();
        
        this.bindEvents();
        this.initializeStages();
        this.updateProgress();
    },

    initializeStages() {
        // Add click events to stage indicators
        this.stageIndicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                const stageNumber = index + 1;
                if (this.canAccessStage(stageNumber)) {
                    this.navigateToStage(stageNumber);
                } else {
                    this.showNotification('Please complete the previous stages first', 'error');
                }
            });
        });

        // Initialize navigation buttons
        document.querySelectorAll('.navigation-buttons').forEach(nav => {
            const prevBtn = nav.querySelector('.btn-prev');
            const nextBtn = nav.querySelector('.btn-next');
            
            if (prevBtn) {
                prevBtn.disabled = this.currentStage === 1;
            }
            if (nextBtn) {
                nextBtn.disabled = !this.canAccessStage(this.currentStage + 1);
            }
        });
    },

    canAccessStage(stageNumber) {
        if (stageNumber === 1) return true;
        if (stageNumber <= this.currentStage) return true;
        return this.completedStages.has(stageNumber - 1);
    },

// Update the navigateToStage method in onboarding.js
navigateToStage(stageNumber) {
    if (!this.canAccessStage(stageNumber)) return;

    // Hide all stages
    this.stages.forEach(stage => stage.classList.remove('active'));
    
    // Show new stage
    const newStage = document.querySelector(`.stage[data-stage="${stageNumber}"]`);
    newStage.classList.add('active');
    
    // Update current stage
    this.currentStage = stageNumber;
    
    // Update navigation buttons
    this.updateNavigationButtons();
    
    // Scroll to top of the new stage
    newStage.scrollIntoView({ behavior: 'smooth' });
},

    updateNavigationButtons() {
        const currentStageElement = document.querySelector(`.stage[data-stage="${this.currentStage}"]`);
        const nav = currentStageElement.querySelector('.navigation-buttons');
        
        if (nav) {
            const prevBtn = nav.querySelector('.btn-prev');
            const nextBtn = nav.querySelector('.btn-next');
            
            if (prevBtn) {
                prevBtn.disabled = this.currentStage === 1;
            }
            if (nextBtn) {
                nextBtn.disabled = !this.canAccessStage(this.currentStage + 1);
            }
        }
    },

    bindEvents() {
        // Form Submissions
        this.forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmission(form);
            });
        });

        // Video Progress
        this.videos.forEach(video => {
            video.addEventListener('ended', () => {
                this.handleVideoCompletion(video);
            });
        });

        // File Uploads
        this.fileInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                this.handleFileUpload(e.target);
            });
        });

        // Quiz Submissions
        this.quizForms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleQuizSubmission(form);
            });
        });

        // Checkbox completion
        document.querySelectorAll('.completion-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.handleCheckboxChange(e.target);
                if (e.target.checked) {
                    this.handleStepCompletion(e.target.closest('.step'));
                }
            });
        });
    },
    handleCheckboxChange(checkbox) {
        const allCheckboxes = document.querySelectorAll('.completion-checkbox');
        const nextBtn = document.querySelector('.btn-next'); // Adjust selector if necessary
    
        // Check if all checkboxes are checked
        const allChecked = Array.from(allCheckboxes).every(cb => cb.checked);
    
        // Enable or disable the Next button based on checkbox state
        if (nextBtn) {
            nextBtn.disabled = !allChecked; // Disable if not all checked
        }
    },
    handleStepCompletion(step) {
        const stepStatus = step.querySelector('.step-status');
        stepStatus.textContent = 'Completed';
        stepStatus.classList.remove('pending');
        stepStatus.classList.add('completed');

        this.checkStageCompletion(step.closest('.stage'));
    },

    checkStageCompletion(stage) {
        const steps = stage.querySelectorAll('.step');
        const completedSteps = stage.querySelectorAll('.step-status.completed');

        if (steps.length === completedSteps.length) {
            this.completeStage(stage);
        }
    },

    completeStage(stage) {
        const stageNumber = parseInt(stage.dataset.stage);
        const stageStatus = stage.querySelector('.stage-status');
        stageStatus.textContent = 'Completed';
        
        // Update stage indicator
        this.stageIndicators[stageNumber - 1].classList.add('completed');
        this.completedStages.add(stageNumber);
        
        // Unlock next stage if available
        if (stageNumber < this.totalStages) {
            const nextStage = document.querySelector(`.stage[data-stage="${stageNumber + 1}"]`);
            const nextStageStatus = nextStage.querySelector('.stage-status');
            // nextStage.classList.add('active');
            nextStageStatus.textContent = 'In Progress';
            
            // Enable next stage navigation
            this.updateNavigationButtons();
        }
        
        this.updateProgress();
        this.showNotification('Stage completed successfully!', 'success');
    },

    handleFormSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Validate form
        if (!this.validateForm(form)) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Simulate API call
        setTimeout(() => {
            this.handleStepCompletion(form.closest('.step'));
            this.showNotification('Form submitted successfully');
        }, 1000);
    },

    validateForm(form) {
        const requiredFields = form.querySelectorAll('[required]');
        return Array.from(requiredFields).every(field => field.value.trim() !== '');
    },

    handleVideoCompletion(video) {
        const step = video.closest('.step');
        const checkbox = step.querySelector('.completion-checkbox');
        
        if (checkbox) {
            // checkbox.disabled = false;
            this.showNotification('Video completed. Please check the acknowledgment box to proceed.');
        }
    },

    handleFileUpload(input) {
        const files = input.files;
        if (files.length > 0) {
            // Validate file type and size
            if (!this.validateFile(files[0])) {
                this.showNotification('Invalid file type or size', 'error');
                return;
            }
            
            // Simulate file upload
            setTimeout(() => {
                this.handleStepCompletion(input.closest('.step'));
                this.showNotification('File uploaded successfully');
            }, 1000);
        }
    },

    validateFile(file) {
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
        return file.size <= maxSize && allowedTypes.includes(file.type);
    },

    handleQuizSubmission(form) {
        const formData = new FormData(form);
        const answers = Array.from(formData.entries());
        const correctAnswers = this.getCorrectAnswers();
        
        let score = 0;
        answers.forEach(([question, answer]) => {
            if (correctAnswers[question] === answer) {
                score++;
            }
        });

        const percentage = (score / Object.keys(correctAnswers).length) * 100;
        if (percentage >= 80) {
            this.handleStepCompletion(form.closest('.step'));
            this.showNotification('Quiz completed successfully!');
        } else {
            this.showNotification('Please review the material and try again. Required score: 80%', 'error');
        }
    },

    getCorrectAnswers() {
        return {
            'q1': '2',
            'q2': '1',
            'q3': '3'
        };
    },

    updateProgress() {
        const completedStages = this.completedStages.size;
        const progress = (completedStages / this.totalStages) * 100;
        this.progressBar.style.width = `${progress}%`;
    },

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type} show`; // Add 'show' class
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remove the notification after a delay
        setTimeout(() => {
            notification.classList.remove('show'); // Fade out
            setTimeout(() => {
                notification.remove(); // Remove from DOM after fade out
            }, 300); // Match the duration of the fade out
        }, 3000); // Show for 3 seconds
    },

    nextStage() {
        // Navigate to the next stage regardless of current stage completion
        if (this.currentStage < this.totalStages) {
            this.navigateToStage(this.currentStage + 1);
        }
    },

    previousStage() {
        if (this.currentStage > 1) {
            this.navigateToStage(this.currentStage - 1);
        }
    }
};

// Initialize onboarding module
document.addEventListener('DOMContentLoaded', () => {
    onboardingModule.init();
}); 