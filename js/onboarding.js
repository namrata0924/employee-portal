// Onboarding Module
const onboardingModule = {
    init() {
        this.currentStage = 1;
        this.progressBar = document.querySelector('.onboarding-progress .progress');
        this.progressPercentage = document.querySelector('.onboarding-progress .progress-percentage');
        this.stageIndicators = document.querySelectorAll('.stage-indicator');
        this.stepGroups = document.querySelectorAll('.step-group');
        this.steps = document.querySelectorAll('.step');
        this.forms = document.querySelectorAll('.onboarding-form');
        this.videos = document.querySelectorAll('video');
        this.fileInputs = document.querySelectorAll('input[type="file"]');
        this.quizForms = document.querySelectorAll('.quiz-form');
        
        this.bindEvents();
        this.initializeStage();
        this.updateProgress();
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

        // Checkbox Events
        document.querySelectorAll('.completion-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.handleStepCompletion(e.target.closest('.step'));
                }
            });
        });

        // Navigation Buttons
        document.querySelectorAll('.prev-step').forEach(button => {
            button.addEventListener('click', () => {
                const currentStep = button.closest('.step');
                const prevStep = currentStep.previousElementSibling;
                if (prevStep && prevStep.classList.contains('step')) {
                    this.activateStep(prevStep);
                }
            });
        });

        document.querySelectorAll('.next-step').forEach(button => {
            button.addEventListener('click', () => {
                const currentStep = button.closest('.step');
                const nextStep = currentStep.nextElementSibling;
                if (nextStep && nextStep.classList.contains('step')) {
                    this.activateStep(nextStep);
                }
            });
        });

        // Document submission
        document.querySelector('.submit-documents')?.addEventListener('click', () => {
            const fileInputs = document.querySelectorAll('.document-upload input[type="file"]');
            let allFilesUploaded = true;
            
            fileInputs.forEach(input => {
                if (!input.files || input.files.length === 0) {
                    allFilesUploaded = false;
                    this.showNotification('Please upload all required documents', 'error');
                }
            });

            if (allFilesUploaded) {
                this.handleStepCompletion(document.querySelector('.step[data-step="9"]'));
            }
        });
    },

    initializeStage() {
        // Show first stage and its first step
        this.showStage(1);
        this.updateStageIndicators();
    },

    showStage(stageNumber) {
        this.stepGroups.forEach(group => {
            if (parseInt(group.dataset.stage) === stageNumber) {
                group.classList.add('active');
                // Activate first incomplete step in this stage
                const firstIncompleteStep = group.querySelector('.step:not(.completed)');
                if (firstIncompleteStep) {
                    this.activateStep(firstIncompleteStep);
                }
            } else {
                group.classList.remove('active');
            }
        });
    },

    updateStageIndicators() {
        this.stageIndicators.forEach(indicator => {
            const stage = parseInt(indicator.dataset.stage);
            indicator.classList.remove('active', 'completed', 'disabled');
            
            if (stage < this.currentStage) {
                indicator.classList.add('completed');
            } else if (stage === this.currentStage) {
                indicator.classList.add('active');
            } else {
                indicator.classList.add('disabled');
            }
        });
    },

    activateStep(step) {
        if (!step) return;

        const currentStageSteps = step.closest('.step-group').querySelectorAll('.step');
        currentStageSteps.forEach(s => s.classList.remove('active'));
        
        step.classList.add('active');
        
        // Scroll step into view
        step.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },

    handleStepCompletion(step) {
        if (!step) return;

        const stepNumber = parseInt(step.dataset.step);
        const stageNumber = parseInt(step.closest('.step-group').dataset.stage);
        
        // Update step status
        step.classList.add('completed');
        step.querySelector('.status-badge').textContent = 'Completed';
        step.querySelector('.status-badge').classList.remove('pending');
        step.querySelector('.status-badge').classList.add('completed');

        // Find next step in current stage
        const nextStep = step.nextElementSibling;
        if (nextStep && nextStep.classList.contains('step')) {
            this.activateStep(nextStep);
        } else {
            // If no more steps in current stage, move to next stage
            if (this.isStageCompleted(stageNumber)) {
                this.moveToNextStage();
            }
        }

        this.updateProgress();
    },

    isStageCompleted(stageNumber) {
        const stageGroup = document.querySelector(`.step-group[data-stage="${stageNumber}"]`);
        const stageSteps = stageGroup.querySelectorAll('.step');
        return Array.from(stageSteps).every(step => step.classList.contains('completed'));
    },

    moveToNextStage() {
        if (this.currentStage < 4) {
            this.currentStage++;
            this.showStage(this.currentStage);
            this.updateStageIndicators();
        } else {
            this.handleOnboardingCompletion();
        }
    },

    handleFormSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Simulate API call
        setTimeout(() => {
            this.handleStepCompletion(form.closest('.step'));
            this.showNotification('Form submitted successfully');
        }, 1000);
    },

    handleVideoCompletion(video) {
        const step = video.closest('.step');
        const checkbox = step.querySelector('.completion-checkbox');
        
        if (checkbox && !checkbox.checked) {
            checkbox.disabled = false;
            this.showNotification('Video completed. Please check the acknowledgment box to proceed.');
        }
    },

    handleFileUpload(input) {
        const files = input.files;
        if (files.length > 0) {
            // Simulate file upload
            setTimeout(() => {
                this.handleStepCompletion(input.closest('.step'));
                this.showNotification('File uploaded successfully');
            }, 1000);
        }
    },

    handleQuizSubmission(form) {
        const formData = new FormData(form);
        const answers = Array.from(formData.entries());
        const correctAnswers = this.getCorrectAnswers(form);
        
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
            this.showNotification('Please review the material and try again', 'error');
        }
    },

    handleOnboardingCompletion() {
        // Notify admin and trigger final processes
        this.showNotification('Onboarding completed! Notifying admin...', 'success');
        // Here you would typically make an API call to notify admin
    },

    getCorrectAnswers(form) {
        // This would typically come from your backend
        // For now, we'll use a simple object
        return {
            'q1': '2',
            'q2': '1',
            'q3': '3'
        };
    },

    updateProgress() {
        const completedSteps = document.querySelectorAll('.step.completed').length;
        const totalSteps = this.steps.length;
        const progress = (completedSteps / totalSteps) * 100;

        this.progressBar.style.width = `${progress}%`;
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

// Initialize onboarding module
document.addEventListener('DOMContentLoaded', () => {
    onboardingModule.init();
}); 