// Onboarding Module
const onboardingModule = {
    init() {
        this.progressBar = document.querySelector('.onboarding-progress .progress');
        this.progressPercentage = document.querySelector('.onboarding-progress .progress-percentage');
        this.steps = document.querySelectorAll('.step');
        this.forms = document.querySelectorAll('.onboarding-form');
        this.videos = document.querySelectorAll('video');
        this.fileInputs = document.querySelectorAll('input[type="file"]');
        this.quizForms = document.querySelectorAll('.quiz-form');
        
        this.bindEvents();
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
    },

    handleFormSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Simulate API call
        setTimeout(() => {
            this.updateStepStatus(form.closest('.step'));
            this.updateProgress();
            this.showNotification('Form submitted successfully');
        }, 1000);
    },

    handleVideoCompletion(video) {
        const step = video.closest('.step');
        const checkbox = step.querySelector('.completion-checkbox');
        
        if (checkbox && !checkbox.checked) {
            checkbox.checked = true;
            this.updateStepStatus(step);
            this.updateProgress();
            this.showNotification('Video completed successfully');
        }
    },

    handleFileUpload(input) {
        const files = input.files;
        if (files.length > 0) {
            // Simulate file upload
            setTimeout(() => {
                const step = input.closest('.step');
                this.updateStepStatus(step);
                this.updateProgress();
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

        const percentage = (score / correctAnswers.length) * 100;
        if (percentage >= 80) {
            const step = form.closest('.step');
            this.updateStepStatus(step);
            this.updateProgress();
            this.showNotification('Quiz completed successfully!');
        } else {
            this.showNotification('Please review the material and try again', 'error');
        }
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

    updateStepStatus(step) {
        const checkbox = step.querySelector('.completion-checkbox');
        if (checkbox) {
            checkbox.checked = true;
        }
    },

    updateProgress() {
        const completedSteps = document.querySelectorAll('.completion-checkbox:checked').length;
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