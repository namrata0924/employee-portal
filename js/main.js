// DOM Elements
const navLinks = document.querySelectorAll('.nav-links li');
const modules = document.querySelectorAll('.module');
const personalInfoForm = document.getElementById('personal-info-form');

// Navigation Functionality
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        // Remove active class from all links
        navLinks.forEach(l => l.classList.remove('active'));
        // Add active class to clicked link
        link.classList.add('active');

        // Hide all modules
        modules.forEach(module => module.classList.remove('active'));
        // Show selected module
        const moduleId = link.getAttribute('data-module');
        document.getElementById(moduleId).classList.add('active');
    });
});

// Form Handling
if (personalInfoForm) {
    personalInfoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(personalInfoForm);
        const data = Object.fromEntries(formData);
        
        // Here you would typically send this data to your backend
        console.log('Form submitted:', data);
        
        // Show success message
        alert('Information submitted successfully!');
    });
}

// Dashboard Card Click Handlers
const dashboardCards = document.querySelectorAll('.card');
dashboardCards.forEach(card => {
    card.addEventListener('click', () => {
        const cardTitle = card.querySelector('h3').textContent;
        console.log(`Clicked on ${cardTitle}`);
        // Add your card click handling logic here
    });
});

// Offboarding Checklist Handling
const checklistItems = document.querySelectorAll('.checklist-item input[type="checkbox"]');
const submitOffboardingBtn = document.querySelector('.offboarding-checklist .btn-primary');

if (submitOffboardingBtn) {
    submitOffboardingBtn.addEventListener('click', () => {
        const completedItems = Array.from(checklistItems).filter(item => item.checked);
        
        if (completedItems.length === checklistItems.length) {
            alert('Offboarding request submitted successfully!');
        } else {
            alert('Please complete all checklist items before submitting.');
        }
    });
}

// Add smooth transitions
document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('loaded');
});

// Add loading state handling
function showLoading() {
    // Add your loading state UI here
    console.log('Loading...');
}

function hideLoading() {
    // Remove loading state UI here
    console.log('Loading complete');
}

// Example of async data fetching (commented out as it requires backend)
/*
async function fetchEmployeeData() {
    showLoading();
    try {
        const response = await fetch('/api/employee-data');
        const data = await response.json();
        // Handle the data
        console.log(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        hideLoading();
    }
}
*/

// Add notification handling
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Add to document
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Example usage of notifications
// showNotification('Welcome to the Employee Portal!', 'success');
// showNotification('Please complete your profile', 'warning');
// showNotification('Error loading data', 'error');

// Onboarding Progress Tracking
const progressBar = document.querySelector('.progress');
const completionCheckboxes = document.querySelectorAll('.completion-checkbox');
const totalSteps = document.querySelectorAll('.step').length;
let completedSteps = 0;

function updateProgress() {
    const progress = (completedSteps / totalSteps) * 100;
    progressBar.style.width = `${progress}%`;
}

// Handle completion checkboxes
completionCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
            completedSteps++;
        } else {
            completedSteps--;
        }
        updateProgress();
    });
});

// Form Handling
const employmentForm = document.getElementById('employment-form');

if (personalInfoForm) {
    personalInfoForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(personalInfoForm);
        const data = Object.fromEntries(formData);
        
        // Here you would typically send this data to your backend
        console.log('Personal Info submitted:', data);
        
        // Show success message
        showNotification('Personal information saved successfully!', 'success');
        completedSteps++;
        updateProgress();
    });
}

if (employmentForm) {
    employmentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(employmentForm);
        const data = Object.fromEntries(formData);
        
        // Here you would typically send this data to your backend
        console.log('Employment details submitted:', data);
        
        // Show success message
        showNotification('Employment details saved successfully!', 'success');
        completedSteps++;
        updateProgress();
    });
}

// Video Progress Tracking
const companyVideo = document.getElementById('company-video');
if (companyVideo) {
    companyVideo.addEventListener('ended', () => {
        const checkbox = document.querySelector('[data-step="1"]');
        if (checkbox && !checkbox.checked) {
            checkbox.checked = true;
            completedSteps++;
            updateProgress();
        }
    });
}

// Document Upload Handling
const fileInputs = document.querySelectorAll('input[type="file"]');
fileInputs.forEach(input => {
    input.addEventListener('change', (e) => {
        const files = e.target.files;
        if (files.length > 0) {
            // Here you would typically upload the files to your backend
            console.log('File selected:', files[0].name);
            showNotification('File uploaded successfully!', 'success');
        }
    });
});

// Quiz Handling
function loadQuiz(quizForm) {
    // Example quiz questions
    const questions = [
        {
            question: "What is the company's safety policy regarding PPE?",
            options: [
                "PPE is optional",
                "PPE must be worn at all times in designated areas",
                "PPE is only required for certain departments",
                "PPE is not required"
            ],
            correct: 1
        },
        // Add more questions as needed
    ];

    // Generate quiz HTML
    questions.forEach((q, index) => {
        const questionDiv = document.createElement('div');
        questionDiv.className = 'quiz-question';
        questionDiv.innerHTML = `
            <p>${index + 1}. ${q.question}</p>
            <div class="options">
                ${q.options.map((opt, i) => `
                    <label>
                        <input type="radio" name="q${index}" value="${i}">
                        ${opt}
                    </label>
                `).join('')}
            </div>
        `;
        quizForm.appendChild(questionDiv);
    });

    // Add submit button
    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.className = 'btn-primary';
    submitBtn.textContent = 'Submit Quiz';
    quizForm.appendChild(submitBtn);

    // Handle quiz submission
    quizForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const formData = new FormData(quizForm);
        let score = 0;

        questions.forEach((q, index) => {
            const answer = parseInt(formData.get(`q${index}`));
            if (answer === q.correct) {
                score++;
            }
        });

        const percentage = (score / questions.length) * 100;
        if (percentage >= 80) {
            showNotification('Quiz completed successfully!', 'success');
            completedSteps++;
            updateProgress();
        } else {
            showNotification('Please review the material and try again.', 'error');
        }
    });
}

// Initialize quizzes
document.querySelectorAll('.quiz-form').forEach(quizForm => {
    loadQuiz(quizForm);
});

// Dashboard Functionality
const activityCards = document.querySelectorAll('.activity-card');
const modal = document.getElementById('activity-modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.querySelector('.modal-body');
const closeModal = document.querySelector('.close-modal');
const overallProgress = document.querySelector('.dashboard-progress .progress');
const progressPercentage = document.querySelector('.progress-percentage');

let completedActivities = 0;
const totalActivities = activityCards.length;

// Activity Content Templates
const activityContent = {
    'process-docs': `
        <div class="document-viewer">
            <h4>Process Documents</h4>
            <div class="document-list">
                <div class="document-item">
                    <i class="fas fa-file-pdf"></i>
                    <span>Company Process Guide</span>
                    <button class="btn-primary">View</button>
                </div>
                <div class="document-item">
                    <i class="fas fa-file-pdf"></i>
                    <span>Department Guidelines</span>
                    <button class="btn-primary">View</button>
                </div>
            </div>
        </div>
    `,
    'dept-training': `
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
    `,
    'feedback': `
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
    `,
    'kpi-kri': `
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
    `,
    'brand-survey': `
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
    `,
    'grievance': `
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
    `,
    'posh': `
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
    `
};

// Handle Activity Card Clicks
activityCards.forEach(card => {
    const startButton = card.querySelector('.start-activity');
    startButton.addEventListener('click', () => {
        const activityType = card.getAttribute('data-activity');
        const activityTitle = card.querySelector('h3').textContent;
        
        modalTitle.textContent = activityTitle;
        modalBody.innerHTML = activityContent[activityType];
        
        modal.classList.add('active');
        
        // Initialize form handlers
        const form = modalBody.querySelector('form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                handleFormSubmission(activityType, form);
            });
        }
    });
});

// Close Modal
closeModal.addEventListener('click', () => {
    modal.classList.remove('active');
});

// Handle Form Submissions
function handleFormSubmission(activityType, form) {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Here you would typically send this data to your backend
    console.log(`${activityType} submitted:`, data);
    
    // Update progress
    const card = document.querySelector(`[data-activity="${activityType}"]`);
    const progressBar = card.querySelector('.progress-indicator .progress');
    progressBar.style.width = '100%';
    
    completedActivities++;
    updateOverallProgress();
    
    // Show success message
    showNotification('Form submitted successfully!', 'success');
    
    // Close modal
    modal.classList.remove('active');
}

// Update Overall Progress
function updateOverallProgress() {
    const progress = (completedActivities / totalActivities) * 100;
    overallProgress.style.width = `${progress}%`;
    progressPercentage.textContent = `${Math.round(progress)}%`;
}

// Offboarding Module
const offboardingModule = {
    init() {
        this.offboardingRequestForm = document.getElementById('offboarding-request-form');
        this.exitInterviewForm = document.getElementById('exit-interview-form');
        this.submitAssetsBtn = document.getElementById('submit-assets');
        this.progressBar = document.querySelector('.offboarding-progress .progress');
        this.progressPercentage = document.querySelector('.offboarding-progress .progress-percentage');
        this.steps = document.querySelectorAll('.step-container');
        
        this.bindEvents();
        this.updateProgress();
    },

    bindEvents() {
        // Offboarding Request Form
        if (this.offboardingRequestForm) {
            this.offboardingRequestForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleOffboardingRequest(e.target);
            });
        }

        // Exit Interview Form
        if (this.exitInterviewForm) {
            this.exitInterviewForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleExitInterview(e.target);
            });
        }

        // Asset Return
        if (this.submitAssetsBtn) {
            this.submitAssetsBtn.addEventListener('click', () => {
                this.handleAssetReturn();
            });
        }
    },

    handleOffboardingRequest(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Simulate API call
        setTimeout(() => {
            this.updateStepStatus(1, 'completed');
            this.updateStepStatus(2, 'in-progress');
            this.updateProgress();
            this.showNotification('Offboarding request submitted successfully');
        }, 1000);
    },

    handleExitInterview(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        
        // Simulate API call
        setTimeout(() => {
            this.updateStepStatus(5, 'completed');
            this.updateProgress();
            this.showNotification('Exit interview submitted successfully');
        }, 1000);
    },

    handleAssetReturn() {
        const assets = document.querySelectorAll('.asset-checklist input[type="checkbox"]');
        const returnedAssets = Array.from(assets).filter(asset => asset.checked);
        
        if (returnedAssets.length === 0) {
            this.showNotification('Please select at least one asset to return', 'error');
            return;
        }

        // Simulate API call
        setTimeout(() => {
            this.updateStepStatus(3, 'completed');
            this.updateProgress();
            this.showNotification('Assets returned successfully');
        }, 1000);
    },

    updateStepStatus(stepNumber, status) {
        const step = document.querySelector(`.step-container[data-step="${stepNumber}"]`);
        if (!step) return;

        const statusBadge = step.querySelector('.status-badge');
        if (statusBadge) {
            statusBadge.className = `status-badge ${status}`;
            statusBadge.textContent = status.charAt(0).toUpperCase() + status.slice(1);
        }

        // Update individual status items if they exist
        const statusItems = step.querySelectorAll('.status');
        statusItems.forEach(item => {
            item.className = `status ${status}`;
            item.textContent = status.charAt(0).toUpperCase() + status.slice(1);
        });

        // If step is completed, enable next step
        if (status === 'completed' && stepNumber < this.steps.length) {
            const nextStep = this.steps[stepNumber];
            if (nextStep) {
                nextStep.classList.remove('disabled');
            }
        }
    },

    updateProgress() {
        const completedSteps = document.querySelectorAll('.status-badge.completed').length;
        const totalSteps = this.steps.length;
        const progress = (completedSteps / totalSteps) * 100;

        this.progressBar.style.width = `${progress}%`;
        this.progressPercentage.textContent = `${Math.round(progress)}%`;
    },

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
};

// Initialize offboarding module
document.addEventListener('DOMContentLoaded', () => {
    offboardingModule.init();
});

// Main JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Initialize navigation
    initializeNavigation();
    
    // Initialize notifications
    initializeNotifications();
});

// Navigation Functions
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            e.currentTarget.classList.add('active');
        });
    });
}

// Notification Functions
function initializeNotifications() {
    // Create notification container if it doesn't exist
    if (!document.querySelector('.notification-container')) {
        const container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
    }
}

function showNotification(message, type = 'info') {
    const container = document.querySelector('.notification-container');
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    container.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            container.removeChild(notification);
        }, 300);
    }, 3000);
}

// Module Card Functions
function initializeModuleCards() {
    const cards = document.querySelectorAll('.module-card');
    
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const module = card.dataset.module;
            if (module) {
                window.location.href = `modules/${module}.html`;
            }
        });
    });
}

// Utility Functions
function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Export functions for use in other modules
window.appUtils = {
    showNotification,
    formatDate,
    formatCurrency
}; 