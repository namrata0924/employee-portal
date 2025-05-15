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
        
        this.bindEvents();
        this.initializeStageIndicatorClicks();
        this.navigateToStage(this.currentStage); // Initialize view to current stage (Stage 1)
        this.updateProgress();
    },

    initializeStageIndicatorClicks() {
        this.stageIndicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                const stageNumber = index + 1;
                // Allow navigation if the stage is already completed, OR if it's accessible (previous is completed)
                if (this.completedStages.has(stageNumber) || this.canAccessStage(stageNumber)) {
                    this.navigateToStage(stageNumber);
                } else {
                    // If neither completed nor accessible, show error
                    this.showNotification('Please complete the previous stages first.', 'error');
                }
            });
        });
    },

    canAccessStage(stageNumber) {
        if (stageNumber === 1) return true; // Stage 1 is always accessible initially
        // For any other stage, the previous stage must be completed
        const previousStageNumber = stageNumber - 1;
        if (!this.completedStages.has(previousStageNumber)) {
            console.log(`canAccessStage(${stageNumber}): Denied. Previous stage ${previousStageNumber} not in completedStages:`, this.completedStages);
            return false;
        }
        console.log(`canAccessStage(${stageNumber}): Allowed. Previous stage ${previousStageNumber} is completed.`);
        return true;
    },

    navigateToStage(stageNumber) {
        console.log(`[navigateToStage] Attempting to navigate to Stage ${stageNumber}. Current list of completed stages:`, Array.from(this.completedStages));

        // If trying to move forward to a stage that's not yet accessible
        const canAccess = this.canAccessStage(stageNumber);
        console.log(`[navigateToStage] canAccessStage(${stageNumber}) returned: ${canAccess}`);
        if (stageNumber > this.currentStage && !canAccess) {
            console.warn(`[navigateToStage] Navigation to Stage ${stageNumber} denied. It's not yet accessible.`);
            // this.showNotification('Please complete the current stage first.', 'error'); // Optional: canAccessStage might show its own.
            return;
        }

        const newStageElement = document.querySelector(`.stage[data-stage="${stageNumber}"]`);

        if (!newStageElement) {
            console.error(`[navigateToStage] Stage element for data-stage="${stageNumber}" not found.`);
            return;
        }
        console.log(`[navigateToStage] Found newStageElement for Stage ${stageNumber}:`, newStageElement);

        // Hide all other stages
        this.stages.forEach(s => {
            if (s !== newStageElement) {
                s.classList.remove('active');
            }
        });

        // Show the new stage
        console.log(`[navigateToStage] About to add 'active' class to Stage ${stageNumber} div.`);
        if (!newStageElement.classList.contains('active')) {
            newStageElement.classList.add('active');
            console.log(`[navigateToStage] Added 'active' class to Stage ${stageNumber} div. It should now be visible.`);
            if (newStageElement.classList.contains('active')) {
                console.log(`[navigateToStage] Confirmed: Stage ${stageNumber} div now has 'active' class.`);
            } else {
                console.error(`[navigateToStage] ERROR: Stage ${stageNumber} div DOES NOT have 'active' class after attempting to add it.`);
            }
        } else {
            console.log(`[navigateToStage] Stage ${stageNumber} div already has 'active' class.`);
        }
        
        this.currentStage = stageNumber;
        
        // Update stage indicators
        this.stageIndicators.forEach((indicator_elem, index) => {
            const indicatorStageNum = index + 1;

            // Reset classes for this indicator
            indicator_elem.classList.remove('active', 'locked', 'completed');

            // Add 'completed' if the stage is in completedStages
            if (this.completedStages.has(indicatorStageNum)) {
                indicator_elem.classList.add('completed');
            }

            // Set 'active' for the current stage, or 'locked' for inaccessible future stages
            if (indicatorStageNum === stageNumber) { // Current stage being navigated to
                indicator_elem.classList.add('active');
                // 'locked' is implicitly removed by the reset and not re-added for active stage
            } else {
                // For non-active stages, lock them if they are not completed AND their prerequisite is not met
                if (!this.completedStages.has(indicatorStageNum) && 
                    indicatorStageNum > 1 && 
                    !this.completedStages.has(indicatorStageNum - 1)) {
                    indicator_elem.classList.add('locked');
                }
            }
        });

        // Update header status of the now active stage
        const stageHeaderStatus = newStageElement.querySelector('.stage-header .stage-status');
        if (stageHeaderStatus) {
            if (this.completedStages.has(stageNumber)) {
                stageHeaderStatus.textContent = 'Completed';
                stageHeaderStatus.className = 'stage-status completed';
            } else if (stageHeaderStatus.textContent === 'Locked' || stageHeaderStatus.classList.contains('locked')) {
                stageHeaderStatus.textContent = 'In Progress';
                stageHeaderStatus.className = 'stage-status in-progress';
            } else if (!stageHeaderStatus.classList.contains('completed')) { // If not completed and not locked, ensure 'In Progress'
                 stageHeaderStatus.textContent = 'In Progress';
                 stageHeaderStatus.className = 'stage-status in-progress';
            }
        }
        
        this.updateNavigationButtons();
        // newStageElement.scrollIntoView({ behavior: 'smooth', block: 'start' }); // Temporarily disable scroll for testing
        console.log(`Successfully navigated to Stage ${stageNumber}. Display should be updated.`);
    },

    updateNavigationButtons() {
        const currentStageElement = document.querySelector(`.stage.active[data-stage="${this.currentStage}"]`);
        if (!currentStageElement) {
            console.warn(`updateNavigationButtons: No active stage found for currentStage: ${this.currentStage}. Disabling all nav buttons.`);
            document.querySelectorAll('.navigation-buttons button').forEach(btn => btn.disabled = true);
            return;
        }

        const nav = currentStageElement.querySelector('.navigation-buttons');
        console.log(`updateNavigationButtons called for currentStage: ${this.currentStage}`);
        
        if (nav) {
            const prevBtn = nav.querySelector('.btn-prev');
            const nextBtn = nav.querySelector('.btn-next');
            
            if (prevBtn) {
                prevBtn.disabled = this.currentStage === 1;
            }
            if (nextBtn) {
                if (this.currentStage >= this.totalStages) {
                    nextBtn.disabled = true; // Last stage, no next
                } else {
                    // Enable "Next" if the current stage is completed OR if the next stage is directly accessible (e.g. already completed)
                    const canAccessNextStage = this.canAccessStage(this.currentStage + 1);
                    nextBtn.disabled = !canAccessNextStage;
                    console.log(`updateNavigationButtons: For Stage ${this.currentStage}, Next button disabled: ${nextBtn.disabled} (canAccessStage(${this.currentStage + 1}): ${canAccessNextStage})`);
                }
            }
        } else {
            console.warn(`updateNavigationButtons: Navigation buttons container not found for Stage ${this.currentStage}.`);
        }
    },

    bindEvents() {
        console.log('onboardingModule.bindEvents() called');
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
                if (e.target.checked) {
                    this.handleStepCompletion(e.target.closest('.step'));
                }
            });
        });

        // Event listeners for dynamically added buttons will be attached here or delegated
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
    },

    handleStepCompletion(step) {
        console.log(`handleStepCompletion called for step: ${step.dataset.step}, parent stage: ${step.closest('.stage').dataset.stage}`);
        const stepStatus = step.querySelector('.step-status');
        stepStatus.textContent = 'Completed';
        stepStatus.classList.remove('pending');
        stepStatus.classList.add('completed');

        this.checkStageCompletion(step.closest('.stage'));
        // this.showNotification('Stage completed successfully!', 'success'); // Moved to checkStageCompletion
    },

    checkStageCompletion(stage) {
        // Only select direct child steps of the stage
        const steps = stage.querySelectorAll(':scope > .steps > .step');
        const completedSteps = stage.querySelectorAll(':scope > .steps > .step > .step-header > .step-status.completed');
        console.log(`checkStageCompletion for Stage ${stage.dataset.stage}: Total steps: ${steps.length}, Completed steps: ${completedSteps.length}`);

        if (steps.length === completedSteps.length && steps.length > 0) {
            this.completeStage(stage); // This will handle notification now
        }
    },
    
    completeStage(stageElement) {
        const stageNumber = parseInt(stageElement.dataset.stage);
        if (this.completedStages.has(stageNumber)) {
            console.log(`Stage ${stageNumber} is already marked as completed.`);
            // return; // Optionally return if already processed
        }
        console.log(`completeStage called for Stage ${stageNumber}.`);

        const stageStatusHeader = stageElement.querySelector('.stage-header .stage-status');
        if (stageStatusHeader) {
            stageStatusHeader.textContent = 'Completed';
            stageStatusHeader.className = 'stage-status completed';
        }

        // Update stage indicator for the completed stage
        if (this.stageIndicators[stageNumber - 1]) {
            this.stageIndicators[stageNumber - 1].classList.remove('active', 'locked');
            this.stageIndicators[stageNumber - 1].classList.add('completed');
        }
        this.completedStages.add(stageNumber);
        console.log('Completed stages set:', Array.from(this.completedStages));
        this.showNotification(`Stage ${stageNumber} completed successfully!`, 'success');


        // Unlock and update status for the next stage, if it exists
        if (stageNumber < this.totalStages) {
            const nextStageNumber = stageNumber + 1;
            const nextStageElement = document.querySelector(`.stage[data-stage="${nextStageNumber}"]`);
            if (nextStageElement) {
                const nextStageHeaderStatus = nextStageElement.querySelector('.stage-header .stage-status');
                if (nextStageHeaderStatus && (nextStageHeaderStatus.textContent === 'Locked' || nextStageHeaderStatus.classList.contains('locked'))) {
                    nextStageHeaderStatus.textContent = 'In Progress';
                    nextStageHeaderStatus.className = 'stage-status in-progress';
                    console.log(`Updated Stage ${nextStageNumber} header status to 'In Progress'.`);
                }
                // Update next stage indicator to remove 'locked' and make it clickable if conditions met
                if (this.stageIndicators[nextStageNumber - 1]) {
                    this.stageIndicators[nextStageNumber - 1].classList.remove('locked');
                    console.log(`Unlocked stage indicator for Stage ${nextStageNumber}.`);
                }
            }
        }
        this.updateNavigationButtons(); // Update buttons on the *current* (now completed) stage
        this.updateProgress();
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
            console.log(`Progress bar updated to ${progressPercentage}%`);
        } else {
            console.warn("Progress bar element not found.");
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
        // Navigate to the next stage if accessible
        const targetStage = this.currentStage + 1;
        if (targetStage <= this.totalStages) {
            if(this.canAccessStage(targetStage)){ // Check if current stage is completed to allow next
                 this.navigateToStage(targetStage);
            } else {
                this.showNotification('Please complete the current stage first.', 'error');
                console.warn(`Cannot move to Next Stage ${targetStage}. Current stage ${this.currentStage} not completed or other pre-requisites not met.`);
            }
        } else {
            console.log("Already on the last stage.");
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