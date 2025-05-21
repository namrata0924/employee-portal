// Onboarding Module
const onboardingModule = {
    init() {
        console.log('onboardingModule.init() called');
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
        this.nextOrganizationIndex = 2; // For adding new organizations
        
        // Hide all stages initially except the first one
        this.stages.forEach((stage, index) => {
            if (index === 0) {
                stage.style.display = 'block';
                stage.classList.add('active');
            } else {
                stage.style.display = 'none';
                stage.classList.remove('active');
            }
        });
        
        this.bindEvents();
        this.initializeStageIndicatorClicks();
        
        // Force enable next button on initialization
        const nextBtn = document.querySelector('.btn-next');
        if (nextBtn) {
            nextBtn.disabled = false;
            nextBtn.style.display = 'flex'; // Ensure button is visible
            nextBtn.style.opacity = '1';
        }
        
        this.navigateToStage(this.currentStage);
        this.updateProgress();
    },

    initializeStageIndicatorClicks() {
        this.stageIndicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                const stageNumber = index + 1;
                if (this.canAccessStage(stageNumber)) {
                    this.navigateToStage(stageNumber);
                } else {
                    this.showNotification('Please complete the previous stages first.', 'error');
                }
            });
        });
    },

    canAccessStage(stageNumber) {
        // Remove validation - allow access to all stages
        return true;
    },

    navigateToStage(stageNumber) {
        console.log(`[navigateToStage] Attempting to navigate to Stage ${stageNumber}. Current list of completed stages:`, Array.from(this.completedStages));

        // Hide all stages first
        this.stages.forEach(stage => {
            stage.style.display = 'none';
            stage.classList.remove('active');
        });

        // Show and activate the new stage
        const newStageElement = document.querySelector(`.stage[data-stage="${stageNumber}"]`);
        if (!newStageElement) {
            console.error(`[navigateToStage] Stage element for data-stage="${stageNumber}" not found.`);
            return;
        }

        newStageElement.style.display = 'block';
        newStageElement.classList.add('active');
        this.currentStage = stageNumber;
        
        // Update stage indicators
        this.stageIndicators.forEach((indicator, index) => {
            const indicatorStageNum = index + 1;
            indicator.classList.remove('active', 'completed', 'locked');

            if (this.completedStages.has(indicatorStageNum)) {
                indicator.classList.add('completed');
            } else if (indicatorStageNum === stageNumber) {
                indicator.classList.add('active');
            } else if (!this.canAccessStage(indicatorStageNum)) {
                indicator.classList.add('locked');
            }
        });

        // Update header status
        const stageHeaderStatus = newStageElement.querySelector('.stage-header .stage-status');
        if (stageHeaderStatus) {
            if (this.completedStages.has(stageNumber)) {
                stageHeaderStatus.textContent = 'Completed';
                stageHeaderStatus.className = 'stage-status completed';
            } else if (stageNumber === 1 || this.canAccessStage(stageNumber)) {
                stageHeaderStatus.textContent = 'In Progress';
                stageHeaderStatus.className = 'stage-status in-progress';
            } else {
                stageHeaderStatus.textContent = 'Locked';
                stageHeaderStatus.className = 'stage-status locked';
            }
        }
        
        this.updateNavigationButtons();
        this.updateProgress();
    },

    updateNavigationButtons() {
        const prevBtn = document.querySelector('.btn-prev');
        const nextBtn = document.querySelector('.btn-next');
        
        if (prevBtn) {
            prevBtn.disabled = this.currentStage === 1;
        }
        
        if (nextBtn) {
            // Force enable next button and ensure it's visible
            nextBtn.disabled = false;
            nextBtn.style.display = 'flex';
            nextBtn.style.opacity = '1';
            nextBtn.style.visibility = 'visible';
            nextBtn.style.pointerEvents = 'auto';
            nextBtn.style.cursor = 'pointer';
            nextBtn.textContent = this.currentStage >= this.totalStages ? 'Finish' : 'Next';
        }
    },

    bindEvents() {
        console.log('onboardingModule.bindEvents() called');
        // Form Submissions
        this.forms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                // Remove validation and directly navigate
                this.navigateToStage(this.currentStage + 1);
            });
        });

        // Video Progress
        this.videos.forEach(video => {
            video.addEventListener('ended', () => {
                // Remove validation and directly navigate
                this.navigateToStage(this.currentStage + 1);
            });
        });

        // File Uploads
        this.fileInputs.forEach(input => {
            input.addEventListener('change', (e) => {
                // Remove validation and directly navigate
                this.navigateToStage(this.currentStage + 1);
            });
        });

        // Quiz Submissions
        this.quizForms.forEach(form => {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                // Remove validation and directly navigate
                this.navigateToStage(this.currentStage + 1);
            });
        });

        // Checkbox completion - Modified to not affect button visibility
        document.querySelectorAll('.completion-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                // Just update the status without affecting navigation
                const step = e.target.closest('.step');
                if (step) {
                    const stepStatus = step.querySelector('.step-status');
                    if (stepStatus) {
                        stepStatus.textContent = e.target.checked ? 'Completed' : 'Pending';
                        stepStatus.className = `step-status ${e.target.checked ? 'completed' : 'pending'}`;
                    }
                }
            });
        });

        // Ensure next button is always visible and enabled
        const nextBtn = document.querySelector('.btn-next');
        if (nextBtn) {
            nextBtn.disabled = false;
            nextBtn.style.display = 'flex';
            nextBtn.style.opacity = '1';
            nextBtn.style.visibility = 'visible';
            nextBtn.style.pointerEvents = 'auto';
        }

        // Event listeners for dynamically added buttons
        document.addEventListener('click', (e) => {
            const addOrgButton = e.target.closest('#add-organization-btn');
            if (addOrgButton) {
                this.addOrganizationSection();
                return; 
            }

            const removeFamilyButton = e.target.closest('.btn-remove-family-member');
            if (removeFamilyButton) {
                this.removeFamilyMemberSection(removeFamilyButton);
                return;
            }

            const removeOrgButton = e.target.closest('.btn-remove-organization');
            if (removeOrgButton) {
                this.removeOrganizationSection(removeOrgButton);
                return;
            }
        });

        const sameAsCurrentCheckbox = document.getElementById('sameAsCurrent');
        if (sameAsCurrentCheckbox) {
            sameAsCurrentCheckbox.addEventListener('change', (e) => {
                const permanentFields = {
                    address: document.getElementById('permanentAddress'),
                    state: document.getElementById('permanentState'),
                    city: document.getElementById('permanentCity'),
                    pincode: document.getElementById('permanentPincode')
                };
                
                const currentFields = {
                    address: document.getElementById('currentAddress'),
                    state: document.getElementById('currentState'),
                    city: document.getElementById('currentCity'),
                    pincode: document.getElementById('currentPincode')
                };

                if (e.target.checked) {
                    // Copy current address values to permanent address
                    permanentFields.address.value = currentFields.address.value;
                    permanentFields.state.value = currentFields.state.value;
                    permanentFields.city.value = currentFields.city.value;
                    permanentFields.pincode.value = currentFields.pincode.value;
                    
                    // Disable permanent address fields
                    Object.values(permanentFields).forEach(field => {
                        field.disabled = true;
                    });
                } else {
                    // Enable permanent address fields
                    Object.values(permanentFields).forEach(field => {
                        field.disabled = false;
                        field.value = ''; // Clear the fields
                    });
                }
            });

            // Also add listeners to current address fields to update permanent address if checkbox is checked
            ['address', 'state', 'city', 'pincode'].forEach(field => {
                const currentField = document.getElementById(`current${field.charAt(0).toUpperCase() + field.slice(1)}`);
                const permanentField = document.getElementById(`permanent${field.charAt(0).toUpperCase() + field.slice(1)}`);
                
                currentField.addEventListener('input', () => {
                    if (sameAsCurrentCheckbox.checked) {
                        permanentField.value = currentField.value;
                    }
                });
            });
        }
    },

    handleFormSubmission(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Validate form
        if (!this.validateForm(form)) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        // Find the step containing this form
        const step = form.closest('.step');
        if (!step) {
            console.error('Could not find parent step for form', form);
            return;
        }

        // Simulate API call
        setTimeout(() => {
            const stepStatus = step.querySelector('.step-status');
            if (stepStatus) {
                stepStatus.textContent = 'Completed';
                stepStatus.classList.remove('pending');
                stepStatus.classList.add('completed');
                this.checkStageCompletion(step.closest('.stage'));
            }
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
        // This should be dynamic or configurable based on actual quizzes
        return { 
            'q1': '2', // Example
            'q2': '1', // Example
            'q3': '3'  // Example
        };
    },

    updateProgress() {
        const completedStageCount = this.completedStages.size;
        const progressPercentage = (completedStageCount / this.totalStages) * 100;
        if (this.progressBar) {
            this.progressBar.style.width = `${progressPercentage}%`;
        }
    },

    showNotification(message, type = 'success') {
        const notificationArea = document.body; // Or a more specific container
        const existingNotification = notificationArea.querySelector('.notification');
        if (existingNotification) { // Remove any existing notification first
            existingNotification.remove();
        }

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        notificationArea.appendChild(notification);
        
        // Trigger reflow to enable animation
        void notification.offsetWidth; 
        notification.classList.add('show');
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 500); // Match CSS transition for fade out
        }, 3000);
    },

    nextStage() {
        if (this.currentStage < this.totalStages) {
            // Directly navigate without any validation
            this.navigateToStage(this.currentStage + 1);
        }
    },

    previousStage() {
        if (this.currentStage > 1) {
            this.navigateToStage(this.currentStage - 1);
        }
    },

    removeFamilyMemberSection(button) {
        console.log('Attempting to remove family member section...', button);
        const section = button.closest('.family-member-section');
        if (section) {
            section.style.display = 'none'; 
            this.showNotification('Family member section removed.', 'success');
        } else {
            console.error('Could not find ".family-member-section" for remove button', button);
        }
    },

    addOrganizationSection() {
        console.log('Attempting to add organization section...');
        const list = document.getElementById('work-experience-list');
        if (!list) {
            console.error('Element with ID "work-experience-list" not found for adding organization.');
            return;
        }

        const orgIndex = this.nextOrganizationIndex++;
        const newSection = document.createElement('div');
        newSection.className = 'work-experience-section';
        // Ensure unique IDs and names if these forms are submitted
        newSection.innerHTML = `
            <h5>Organization ${orgIndex}</h5>
            <div class="form-group">
                <label for="org${orgIndex}Name">Organization Name</label>
                <input type="text" id="org${orgIndex}Name" name="org${orgIndex}Name">
            </div>
            <div class="experience-details">
                <div class="form-row">
                    <div class="form-group">
                        <label for="org${orgIndex}Designation1">Designation</label>
                        <input type="text" id="org${orgIndex}Designation1" name="org${orgIndex}Designation1">
                    </div>
                    <div class="form-group">
                        <label for="org${orgIndex}From1">From</label>
                        <input type="date" id="org${orgIndex}From1" name="org${orgIndex}From1">
                    </div>
                    <div class="form-group">
                        <label for="org${orgIndex}To1">To</label>
                        <input type="date" id="org${orgIndex}To1" name="org${orgIndex}To1">
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label for="org${orgIndex}JobDescription">Job Description</label>
                <textarea id="org${orgIndex}JobDescription" name="org${orgIndex}JobDescription" rows="3"></textarea>
            </div>
            <button type="button" class="btn-remove-organization" style="margin-top: 10px; background-color: var(--error-color); color: white; border: none; padding: 0.5rem 1rem; border-radius: var(--border-radius); cursor: pointer;">Remove Organization</button>
        `;
        list.appendChild(newSection);
        this.showNotification(`Organization ${orgIndex} section added.`, 'success');
    },

    removeOrganizationSection(button) {
        console.log('Attempting to remove organization section...', button);
        const section = button.closest('.work-experience-section');
        if (section) {
            section.remove();
            this.showNotification('Organization section removed.', 'success');
        } else {
            console.error('Could not find ".work-experience-section" for remove button', button);
        }
    }
};

// Initialize onboarding module
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOMContentLoaded event fired. Initializing onboardingModule...');
    onboardingModule.init();
}); 