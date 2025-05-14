const dashboardModule = {
    init() {
        this.currentStep = 1;
        this.totalSteps = 7;

        this.processDocsContent = `
            <p><strong>Document/Form:</strong> PDF/Video</p>
            <p><button class="btn-primary">View Process Documents</button></p>
        `;

        this.deptTrainingContent = `
               <div class="training-section">
                    <h4>Department Training Videos</h4>
                    <div class="video-list">
                        <div class="video-item">
                            <video controls>
                                <source src="assets/videos/dept-training-1.mp4" type="video/mp4">
                            </video>
                            <div class="video-info">
                                <h5>Department Overview</h5>
                                <p>Duration: 15 minutes</p>
                            </div>
                        </div>
                    </div>
                </div>
        `;

        this.feedbackContent = `
            <p><strong>Document/Form:</strong> Microsoft Form</p>
             <form class="modal-form" id="feedback-form">
                    <div class="form-group">
                        <label>How would you rate your team collaboration?</label>
                        <select required>
                            <option value="">Select Rating</option>
                            <option value="5">Excellent</option>
                            <option value="4">Very Good</option>
                            <option value="3">Good</option>
                            <option value="2">Fair</option>
                            <option value="1">Poor</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>What are your team's strengths?</label>
                        <textarea required></textarea>
                    </div>
                    <div class="form-group">
                        <label>What areas need improvement?</label>
                        <textarea required></textarea>
                    </div>
                    <button type="submit" class="btn-primary">Submit Feedback</button>
                </form>
        `;

        this.kpiKriContent = `
            <p><strong>Document/Form:</strong> Microsoft Form</p>
             <form class="modal-form" id="kpi-form">
                    <div class="form-group">
                        <label>Select KPI Category</label>
                        <select required>
                            <option value="">Select Category</option>
                            <option value="performance">Performance</option>
                            <option value="quality">Quality</option>
                            <option value="efficiency">Efficiency</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>KPI Score (1-10)</label>
                        <input type="number" min="1" max="10" required>
                    </div>
                    <div class="form-group">
                        <label>Comments</label>
                        <textarea required></textarea>
                    </div>
                    <button type="submit" class="btn-primary">Submit KPI</button>
                </form>
        `;

        this.brandSurveyContent = `
            <p><strong>Document/Form:</strong> Microsoft Form</p>
             <form class="modal-form" id="brand-survey-form">
                    <div class="form-group">
                        <label>How would you rate our brand reputation?</label>
                        <select required>
                            <option value="">Select Rating</option>
                            <option value="5">Excellent</option>
                            <option value="4">Very Good</option>
                            <option value="3">Good</option>
                            <option value="2">Fair</option>
                            <option value="1">Poor</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>What aspects of our brand could be improved?</label>
                        <textarea required></textarea>
                    </div>
                    <button type="submit" class="btn-primary">Submit Survey</button>
                </form>
        `;

        this.grievanceContent = `
            <p><strong>Document/Form:</strong> HTML Form/Anonymous</p>
           <form class="modal-form" id="grievance-form">
                    <div class="form-group">
                        <label>Grievance Type</label>
                        <select required>
                            <option value="">Select Type</option>
                            <option value="workplace">Workplace Environment</option>
                            <option value="colleague">Colleague Behavior</option>
                            <option value="management">Management Issues</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Description</label>
                        <textarea required placeholder="Please describe your grievance in detail"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Would you like to remain anonymous?</label>
                        <div class="radio-group">
                            <label>
                                <input type="radio" name="anonymous" value="yes" checked> Yes
                            </label>
                            <label>
                                <input type="radio" name="anonymous" value="no"> No
                            </label>
                        </div>
                    </div>
                    <button type="submit" class="btn-primary">Submit Grievance</button>
                </form>
        `;

        this.poshContent = `
            <p><strong>Document/Form:</strong> HTML Form inside step-card</p>
            <form class="modal-form" id="posh-form">
                    <div class="form-group">
                        <label>Incident Date</label>
                        <input type="date" required>
                    </div>
                    <div class="form-group">
                        <label>Incident Location</label>
                        <input type="text" required>
                    </div>
                    <div class="form-group">
                        <label>Description of Incident</label>
                        <textarea required placeholder="Please provide detailed information about the incident"></textarea>
                    </div>
                    <div class="form-group">
                        <label>Witnesses (if any)</label>
                        <textarea placeholder="Please list any witnesses to the incident"></textarea>
                    </div>
                    <button type="submit" class="btn-primary">Submit Complaint</button>
                </form>
        `;

        this.bindEvents();
        this.updateStepContent();
    },

    bindEvents() {
        document.getElementById('next-step').addEventListener('click', () => {
            if (this.currentStep < this.totalSteps) {
                this.currentStep++;
                this.updateStepContent();
                this.updateNavigationButtons();
            }
        });

        document.getElementById('prev-step').addEventListener('click', () => {
            if (this.currentStep > 1) {
                this.currentStep--;
                this.updateStepContent();
                this.updateNavigationButtons();
            }
        });
    },

    updateStepContent() {
        // Hide all steps
        const steps = document.querySelectorAll('.step');
        steps.forEach(step => step.style.display = 'none');

        // Show the current step
        const currentStepElement = document.querySelector(`.step[data-step="${this.currentStep}"]`);
        currentStepElement.style.display = 'block';

        // Inject content based on the current step
        switch (this.currentStep) {
            case 1:
                document.getElementById('process-docs-content').innerHTML = this.processDocsContent;
                break;
            case 2:
                document.getElementById('dept-training-content').innerHTML = this.deptTrainingContent;
                break;
            case 3:
                document.getElementById('feedback-content').innerHTML = this.feedbackContent;
                break;
            case 4:
                document.getElementById('kpi-kri-content').innerHTML = this.kpiKriContent;
                break;
            case 5:
                document.getElementById('brand-survey-content').innerHTML = this.brandSurveyContent;
                break;
            case 6:
                document.getElementById('grievance-content').innerHTML = this.grievanceContent;
                break;
            case 7:
                document.getElementById('posh-content').innerHTML = this.poshContent;
                break;
            default:
                break;
        }
    },

    updateNavigationButtons() {
        document.getElementById('prev-step').disabled = this.currentStep === 1;
        document.getElementById('next-step').textContent = this.currentStep === this.totalSteps ? 'Finish' : 'Next';

        // Update circle indicators
        const circles = document.querySelectorAll('.circle');
        circles.forEach((circle, index) => {
            circle.classList.remove('active');
            if (index < this.currentStep) {
                circle.classList.add('active');
            }
        });
    }
};

// Initialize dashboard module
document.addEventListener('DOMContentLoaded', () => {
    dashboardModule.init();
});


let currentStep = 1;
const totalSteps = 7;

document.getElementById('next-step').addEventListener('click', () => {
    if (currentStep < totalSteps) {
        document.querySelector(`.step[data-step="${currentStep}"]`).style.display = 'none';
        currentStep++;
        document.querySelector(`.step[data-step="${currentStep}"]`).style.display = 'block';
        updateNavigationButtons();
        updateProgressBar();
    }
});

document.getElementById('prev-step').addEventListener('click', () => {
    if (currentStep > 1) {
        document.querySelector(`.step[data-step="${currentStep}"]`).style.display = 'none';
        currentStep--;
        document.querySelector(`.step[data-step="${currentStep}"]`).style.display = 'block';
        updateNavigationButtons();
        updateProgressBar();
    }
});

function updateNavigationButtons() {
    document.getElementById('prev-step').disabled = currentStep === 1;
    document.getElementById('next-step').textContent = currentStep === totalSteps ? 'Finish' : 'Next';

    // Update circle indicators
    const circles = document.querySelectorAll('.circle');
    circles.forEach((circle, index) => {
        circle.classList.remove('active');
        if (index < currentStep) {
            circle.classList.add('active');
        }
    });
}

function updateProgressBar() {
    const progressPercentage = (currentStep / totalSteps) * 100;
    document.getElementById('progress').style.width = `${progressPercentage}%`;
    document.querySelector('.progress-percentage').textContent = `${Math.round(progressPercentage)}%`;
}
