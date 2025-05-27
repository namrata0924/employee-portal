// const dashboardModule = {
//     init() {
//         console.log('Initializing dashboard module...');
//         this.currentStep = 1;
//         this.totalSteps = 7;
//         this.stepCompleted = {
//             1: true,
//             2: true,
//             3: true,
//             4: true,
//             5: true,
//             6: true,
//             7: true
//         };

//         // Always wait for DOM to be fully loaded
//         document.addEventListener('DOMContentLoaded', () => {
//             console.log('DOM Content Loaded');
//             this.setupEventListeners();
//             this.initializeStageIndicatorClicks();
//             this.showCurrentStep();
//             this.updateProgress();
//         });
//     },

//     initializeStageIndicatorClicks() {
//         const indicators = document.querySelectorAll('.stage-indicator');
//         indicators.forEach((indicator, index) => {
//             indicator.addEventListener('click', () => {
//                 this.navigateToStage(index + 1);
//             });
//         });
//     },

//     canAccessStage(stageNumber) {
//         // Remove validation - allow access to all stages
//         return true;
//     },

//     navigateToStage(stageNumber) {
//         if (stageNumber === this.currentStep) return;

//         // Hide all steps
//         const steps = document.querySelectorAll('.step');
//         steps.forEach(step => {
//             step.style.display = 'none';
//         });

//         // Show the selected step
//         const targetStep = document.querySelector(`.step[data-step="${stageNumber}"]`);
//         if (targetStep) {
//             targetStep.style.display = 'block';
//         }

//         // Scroll to top when changing stage
//         window.scrollTo({ top: 0, behavior: 'smooth' });

//         // Update current step
//         this.currentStep = stageNumber;

//         // Update stage indicators
//         const indicators = document.querySelectorAll('.stage-indicator');
//         indicators.forEach((indicator, index) => {
//             indicator.classList.remove('active', 'completed');
//             if (index + 1 < stageNumber) {
//                 indicator.classList.add('completed');
//             } else if (index + 1 === stageNumber) {
//                 indicator.classList.add('active');
//             }
//         });

//         // Update navigation buttons
//         this.updateNavigationButtons();
        
//         // Update progress bar
//         this.updateProgress();
//     },

//     updateProgress() {
//         const progress = (this.currentStep - 1) / (this.totalSteps - 1) * 100;
//         const progressBar = document.querySelector('.stage-progress-bar .progress');
//         if (progressBar) {
//             progressBar.style.width = `${progress}%`;
//         }
//     },

//     updateNavigationButtons() {
//         const prevButton = document.querySelector('.btn-prev');
//         const nextButton = document.querySelector('.btn-next');

//         if (prevButton) {
//             prevButton.disabled = this.currentStep === 1;
//         }

//         if (nextButton) {
//             // Remove validation - always enable next button
//             nextButton.disabled = false;
//             nextButton.textContent = this.currentStep === this.totalSteps ? 'Finish' : 'Next';
//         }
//     },

//     nextStage() {
//         if (this.currentStep < this.totalSteps) {
//             // Remove validation - directly navigate
//             this.navigateToStage(this.currentStep + 1);
//         }
//     },

//     previousStage() {
//         if (this.currentStep > 1) {
//             this.navigateToStage(this.currentStep - 1);
//         }
//     },

//     setupEventListeners() {
//         console.log('Setting up event listeners');
        
//         // Content Type Selection Handler
//         const trainingContentType = document.getElementById('training-content-type');
//         if (trainingContentType) {
//             trainingContentType.addEventListener('change', (e) => {
//                 const form = e.target.closest('form');
//                 if (!form) return;

//                 const pdfContent = form.querySelector('.pdf-content');
//                 const videoContent = form.querySelector('.video-content');
                
//                 if (pdfContent && videoContent) {
//                     if (e.target.value === 'pdf') {
//                         pdfContent.style.display = 'block';
//                         videoContent.style.display = 'none';
//                     } else if (e.target.value === 'video') {
//                         pdfContent.style.display = 'none';
//                         videoContent.style.display = 'block';
//                     } else {
//                         pdfContent.style.display = 'none';
//                         videoContent.style.display = 'none';
//                     }
//                 }
//             });
//         }

//         // Document Type Selection Handlers
//         document.getElementById('process-doc-type')?.addEventListener('change', (e) => {
//             const pdfUpload = e.target.closest('form').querySelector('.pdf-upload');
//             const videoUpload = e.target.closest('form').querySelector('.video-upload');
            
//             if (pdfUpload && videoUpload) {
//                 pdfUpload.style.display = e.target.value === 'pdf' ? 'block' : 'none';
//                 videoUpload.style.display = e.target.value === 'video' ? 'block' : 'none';
//             }
//         });

//         // Video Completion Checkbox - Modified to directly navigate
//         document.getElementById('video-watched')?.addEventListener('change', (e) => {
//             if (e.target.checked) {
//                 this.navigateToStage(this.currentStep + 1);
//             }
//         });

//         // Process Docs Form - Modified to directly navigate
//         document.getElementById('process-docs-form')?.addEventListener('submit', (e) => {
//             e.preventDefault();
//             this.navigateToStage(this.currentStep + 1);
//         });

//         // Training Form - Modified to directly navigate
//         document.getElementById('training-form')?.addEventListener('submit', (e) => {
//             e.preventDefault();
//             this.navigateToStage(this.currentStep + 1);
//         });

//         // Feedback Form - Modified to directly navigate
//         document.getElementById('feedback-form')?.addEventListener('submit', (e) => {
//             e.preventDefault();
//             this.navigateToStage(this.currentStep + 1);
//         });

//         // KPI Form - Modified to directly navigate
//         document.getElementById('kpi-form')?.addEventListener('submit', (e) => {
//             e.preventDefault();
//             this.navigateToStage(this.currentStep + 1);
//         });

//         // Brand Survey Form - Modified to directly navigate
//         document.getElementById('brand-survey-form')?.addEventListener('submit', (e) => {
//             e.preventDefault();
//             this.navigateToStage(this.currentStep + 1);
//         });

//         // Grievance Form - Modified to directly navigate
//         document.getElementById('grievance-form')?.addEventListener('submit', (e) => {
//             e.preventDefault();
//             this.navigateToStage(this.currentStep + 1);
//         });

//         // POSH Form - Modified to directly navigate
//         document.getElementById('posh-form')?.addEventListener('submit', (e) => {
//             e.preventDefault();
//             this.navigateToStage(this.currentStep + 1);
//         });
//     },

//     showCurrentStep() {
//         console.log('Showing current step:', this.currentStep);
//         // Hide all steps
//         const steps = document.querySelectorAll('.step');
//         steps.forEach(step => {
//             step.style.display = 'none';
//         });

//         // Show the current step
//         const currentStepElement = document.querySelector(`.step[data-step="${this.currentStep}"]`);
//         if (currentStepElement) {
//             currentStepElement.style.display = 'block';
            
//             // If it's step 2, ensure content type is properly initialized
//             if (this.currentStep === 2) {
//                 const trainingContentType = document.getElementById('training-content-type');
//                 if (trainingContentType) {
//                     const event = new Event('change');
//                     trainingContentType.dispatchEvent(event);
//                 }
//             }
//         }

//         // Update circle indicators
//         const circles = document.querySelectorAll('.circle');
//         circles.forEach((circle, index) => {
//             circle.classList.remove('active', 'completed');
//             if (index + 1 < this.currentStep) {
//                 circle.classList.add('completed');
//             } else if (index + 1 === this.currentStep) {
//                 circle.classList.add('active');
//             }
//         });
//     },

//     updateStepStatus(stepNumber, status) {
//         const stepContainer = document.querySelector(`.step[data-step="${stepNumber}"]`);
//         if (!stepContainer) return;

//         // Update circle indicator
//         const circle = document.querySelector(`.circle:nth-child(${stepNumber})`);
//         if (circle) {
//             circle.classList.remove('active', 'pending');
//             circle.classList.add(status);
//         }

//         // Update step header status if it exists
//         const statusBadge = stepContainer.querySelector('.status-badge');
//         if (statusBadge) {
//             statusBadge.className = `status-badge ${status}`;
//             statusBadge.textContent = status.charAt(0).toUpperCase() + status.slice(1);
//         }
//     },

//     showNotification(message, type = 'info') {
//         const notification = document.createElement('div');
//         notification.className = `notification ${type}`;
//         notification.textContent = message;
//         document.body.appendChild(notification);
//         setTimeout(() => {
//             notification.remove();
//         }, 3000);
//     }
// };

// // Initialize existing module
// dashboardModule.init();