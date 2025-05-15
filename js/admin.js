// Admin Dashboard JavaScript

// Employee Onboarding State Management
class OnboardingState {
    constructor() {
        this.employees = new Map();
        this.loadFromLocalStorage();
    }

    // Load existing data from localStorage
    loadFromLocalStorage() {
        const savedData = localStorage.getItem('onboardingData');
        if (savedData) {
            const parsedData = JSON.parse(savedData);
            parsedData.forEach(emp => {
                this.employees.set(emp.id, emp);
            });
            this.updateUI();
        }
    }

    // Save current state to localStorage
    saveToLocalStorage() {
        const data = Array.from(this.employees.values());
        localStorage.setItem('onboardingData', JSON.stringify(data));
    }

    // Add new employee
    addEmployee(employeeData) {
        const employee = {
            id: employeeData.employeeId,
            name: employeeData.employeeName,
            department: employeeData.department,
            startDate: employeeData.joiningDate,
            progress: 0,
            status: 'Pending',
            tasks: this.initializeTasks()
        };

        this.employees.set(employee.id, employee);
        this.saveToLocalStorage();
        this.updateUI();
        this.notifyStakeholders(employee, 'new_employee');
    }

    // Initialize default tasks for a new employee
    initializeTasks() {
        return {
            itSetup: {
                onboardingForm: { status: 'pending', assignedTo: ['HR', 'IT'] },
                assetPreparation: { status: 'pending', assignedTo: ['Admin', 'IT', 'HR'] },
                loginCredentials: { status: 'pending', assignedTo: ['Admin', 'IT'] }
            },
            welcome: {
                marketingKit: { status: 'pending', assignedTo: ['HR', 'Marketing'] },
                brandingAssets: { status: 'pending', assignedTo: ['Admin', 'HR'] }
            },
            documentation: {
                personalInfo: { status: 'pending', assignedTo: ['Employee'] },
                documents: { status: 'pending', assignedTo: ['Employee'] },
                officialLetters: { status: 'pending', assignedTo: ['HR'] }
            }
        };
    }

    // Update task status
    updateTask(employeeId, taskCategory, taskName, status) {
        const employee = this.employees.get(employeeId);
        if (employee && employee.tasks[taskCategory] && employee.tasks[taskCategory][taskName]) {
            employee.tasks[taskCategory][taskName].status = status;
            this.updateEmployeeProgress(employeeId);
            this.saveToLocalStorage();
            this.updateUI();
            this.notifyStakeholders(employee, 'task_update');
        }
    }

    // Calculate and update employee progress
    updateEmployeeProgress(employeeId) {
        const employee = this.employees.get(employeeId);
        if (!employee) return;

        let completedTasks = 0;
        let totalTasks = 0;

        Object.values(employee.tasks).forEach(category => {
            Object.values(category).forEach(task => {
                totalTasks++;
                if (task.status === 'completed') completedTasks++;
            });
        });

        employee.progress = Math.round((completedTasks / totalTasks) * 100);
        employee.status = employee.progress === 100 ? 'Completed' : 'In Progress';
    }

    // Update UI with current state
    updateUI() {
        this.updateProgressTable();
        this.updateTaskChecklist();
    }

    // Update the progress table in the UI
    updateProgressTable() {
        const tableBody = document.getElementById('employee-progress-body');
        if (!tableBody) return;

        tableBody.innerHTML = '';
        this.employees.forEach(employee => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${employee.name}</td>
                <td>${employee.department}</td>
                <td>${new Date(employee.startDate).toLocaleDateString()}</td>
                <td>
                    <div class="progress-bar">
                        <div class="progress" style="width: ${employee.progress}%"></div>
                        <span>${employee.progress}%</span>
                    </div>
                </td>
                <td><span class="status-badge ${employee.status.toLowerCase()}">${employee.status}</span></td>
                <td>
                    <button class="btn-view" onclick="onboardingState.viewEmployee('${employee.id}')">View</button>
                    <button class="btn-edit" onclick="onboardingState.editEmployee('${employee.id}')">Edit</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Update the task checklist in the UI
    updateTaskChecklist() {
        const taskSections = document.querySelectorAll('.task-section');
        taskSections.forEach(section => {
            const checkboxes = section.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                checkbox.addEventListener('change', (e) => {
                    const taskId = e.target.id;
                    const [category, name] = taskId.replace('task-', '').split('-');
                    // Update for the currently selected employee
                    const selectedEmployee = this.getSelectedEmployee();
                    if (selectedEmployee) {
                        this.updateTask(
                            selectedEmployee.id,
                            category,
                            name,
                            e.target.checked ? 'completed' : 'pending'
                        );
                    }
                });
            });
        });
    }

    // Get currently selected employee (for task updates)
    getSelectedEmployee() {
        // This should be implemented based on your UI implementation
        // For now, return the first employee or null
        return this.employees.size > 0 ? this.employees.values().next().value : null;
    }

    // Notify relevant stakeholders about updates
    notifyStakeholders(employee, eventType) {
        // This would be implemented to integrate with your notification system
        console.log(`Notification: ${eventType} for employee ${employee.name}`);
        // Example: Send notifications to assigned stakeholders
        switch(eventType) {
            case 'new_employee':
                // Notify HR and IT about new employee
                break;
            case 'task_update':
                // Notify relevant stakeholders about task updates
                break;
        }
    }

    // View employee details
    viewEmployee(employeeId) {
        const employee = this.employees.get(employeeId);
        if (employee) {
            // Update the onboarding activities view
            const employeeSelect = document.getElementById('activity-employee-select');
            if (employeeSelect) {
                // Find or create option for this employee
                let option = Array.from(employeeSelect.options).find(opt => opt.value === employeeId);
                if (!option) {
                    option = document.createElement('option');
                    option.value = employeeId;
                    option.textContent = `${employee.name} (${employee.department})`;
                    employeeSelect.appendChild(option);
                }
                employeeSelect.value = employeeId;
                
                // Trigger change event to load employee data
                const event = new Event('change');
                employeeSelect.dispatchEvent(event);
            }
        }
    }

    // Edit employee details
    editEmployee(employeeId) {
        console.log(`Edit employee with ID: ${employeeId}`);
        // Implementation would open a form to edit employee details
    }
}

// Initialize the onboarding state manager
const onboardingState = new OnboardingState();

// Document ready function for all initialization
document.addEventListener('DOMContentLoaded', function() {
    // Form submission handler
    const onboardingForm = document.getElementById('it-onboarding-form');
    if (onboardingForm) {
        onboardingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(onboardingForm);
            onboardingState.addEmployee({
                employeeId: formData.get('employeeId'),
                employeeName: formData.get('employeeName'),
                department: formData.get('department'),
                joiningDate: formData.get('joiningDate')
            });
            onboardingForm.reset();
        });
    }

    // Task filter buttons for the task checklist
    const checklistFilterButtons = document.querySelectorAll('.task-filters .filter-btn');
    checklistFilterButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            checklistFilterButtons.forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            const filter = e.target.dataset.filter;
            filterTasks(filter);
        });
    });

    // Welcome task expansion
    initializeWelcomeTaskExpansion();
    
    // Onboarding Activities Section
    initializeOnboardingActivities();
});

// Filter tasks based on status
function filterTasks(filter) {
    const taskItems = document.querySelectorAll('.task-item');
    taskItems.forEach(item => {
        const checkbox = item.querySelector('input[type="checkbox"]');
        switch(filter) {
            case 'completed':
                item.style.display = checkbox.checked ? 'flex' : 'none';
                break;
            case 'pending':
                item.style.display = !checkbox.checked ? 'flex' : 'none';
                break;
            default: // 'all'
                item.style.display = 'flex';
        }
    });
}

// Initialize welcome task expansion functionality
function initializeWelcomeTaskExpansion() {
    // Get all expand buttons
    const expandButtons = document.querySelectorAll('.expand-btn');
    
    // Add click event to each button
    expandButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the parent task item
            const taskItem = this.closest('.welcome-task');
            
            // Get the expanded section
            const expandedSection = taskItem.querySelector('.task-expanded');
            
            // Toggle the visibility
            if (expandedSection.style.display === 'block') {
                expandedSection.style.display = 'none';
                this.querySelector('i').classList.remove('fa-chevron-up');
                this.querySelector('i').classList.add('fa-chevron-down');
            } else {
                expandedSection.style.display = 'block';
                this.querySelector('i').classList.remove('fa-chevron-down');
                this.querySelector('i').classList.add('fa-chevron-up');
            }
        });
    });
    
    // Update date when HR completion checkbox is clicked
    const hrCompletedCheckbox = document.getElementById('hr-completed');
    if (hrCompletedCheckbox) {
        hrCompletedCheckbox.addEventListener('change', function() {
            if (this.checked) {
                const dateInput = document.querySelector('.date-stamp input');
                const today = new Date().toISOString().split('T')[0];
                dateInput.value = today;
            }
        });
    }
}

// Initialize Onboarding Activities functionality
function initializeOnboardingActivities() {
    // 1. Expand/Collapse Activity Steps
    setupExpandableActivities();
    
    // 2. Handle completion checkboxes
    setupCompletionTracking();
    
    // 3. Handle document uploads
    setupDocumentUploads();
    
    // 4. Setup activity filters
    setupActivityFilters();
    
    // 5. Populate employee dropdown
    populateEmployeeDropdown();
}

// Setup expandable activities
function setupExpandableActivities() {
    const expandButtons = document.querySelectorAll('.expand-activity');
    
    expandButtons.forEach(button => {
        button.addEventListener('click', function() {
            const activityContent = this.closest('.activity-content');
            const activityDetails = activityContent.querySelector('.activity-details');
            
            if (activityDetails.style.display === 'block') {
                activityDetails.style.display = 'none';
                this.querySelector('i').classList.remove('fa-chevron-up');
                this.querySelector('i').classList.add('fa-chevron-down');
            } else {
                // Close all other open activities
                document.querySelectorAll('.activity-details').forEach(details => {
                    if (details !== activityDetails) {
                        details.style.display = 'none';
                        const otherButton = details.closest('.activity-content').querySelector('.expand-activity i');
                        if (otherButton) {
                            otherButton.classList.remove('fa-chevron-up');
                            otherButton.classList.add('fa-chevron-down');
                        }
                    }
                });
                
                activityDetails.style.display = 'block';
                this.querySelector('i').classList.remove('fa-chevron-down');
                this.querySelector('i').classList.add('fa-chevron-up');
            }
        });
    });
}

// Setup completion tracking
function setupCompletionTracking() {
    // Get all completion checkboxes
    const completionCheckboxes = document.querySelectorAll('[id$="-complete"]');
    
    completionCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const stepId = this.id.replace('-complete', '');
            const dateElement = document.getElementById(stepId + '-date');
            const byElement = document.getElementById(stepId + '-by');
            const activityStep = this.closest('.activity-step');
            
            if (this.checked) {
                // Update date and completed by
                const today = new Date();
                const dateStr = today.toLocaleDateString();
                
                if (dateElement) dateElement.textContent = dateStr;
                if (byElement) byElement.textContent = 'Admin User'; // This would come from the logged-in user
                
                // Mark step as completed
                activityStep.classList.add('completed');
                activityStep.classList.remove('pending');
            } else {
                // Reset completion status
                if (dateElement) dateElement.textContent = 'Not completed';
                if (byElement) byElement.textContent = '-';
                
                // Mark step as not completed
                activityStep.classList.remove('completed');
            }
        });
    });
}

// Setup document uploads
function setupDocumentUploads() {
    // Handle file uploads and update status
    const fileInputs = document.querySelectorAll('input[type="file"]');
    
    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            const inputId = this.id;
            const statusId = inputId.replace('-upload', '-status');
            const statusElement = document.getElementById(statusId);
            
            if (this.files.length > 0) {
                // Update status to show uploaded
                if (statusElement) {
                    statusElement.textContent = 'Uploaded: ' + this.files[0].name;
                    statusElement.classList.add('uploaded');
                }
                
                // Update label to show filename
                const label = this.nextElementSibling;
                if (label && label.tagName === 'LABEL') {
                    const icon = label.querySelector('i');
                    const iconHTML = icon ? icon.outerHTML : '';
                    label.innerHTML = iconHTML + ' ' + this.files[0].name;
                }
            }
        });
    });
}

// Setup activity filters
function setupActivityFilters() {
    const filterButtons = document.querySelectorAll('.activity-filters .filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Update active button
            document.querySelectorAll('.activity-filters .filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            const activitySteps = document.querySelectorAll('.activity-step');
            
            activitySteps.forEach(step => {
                if (filter === 'all') {
                    step.style.display = 'block';
                } else if (filter === 'completed' && step.classList.contains('completed')) {
                    step.style.display = 'block';
                } else if (filter === 'pending' && !step.classList.contains('completed')) {
                    step.style.display = 'block';
                } else {
                    step.style.display = 'none';
                }
            });
        });
    });
}

// Populate employee dropdown (mock data for demo)
function populateEmployeeDropdown() {
    const employeeSelect = document.getElementById('activity-employee-select');
    if (!employeeSelect) return;
    
    // Get employees from the onboarding state
    let employees = [];
    if (onboardingState && onboardingState.employees.size > 0) {
        employees = Array.from(onboardingState.employees.values());
    } else {
        // Fallback sample data if no employees in state
        employees = [
            { id: 1, name: 'John Doe', department: 'IT' },
            { id: 2, name: 'Jane Smith', department: 'HR' },
            { id: 3, name: 'Robert Johnson', department: 'Marketing' },
            { id: 4, name: 'Emily Davis', department: 'Online' }
        ];
    }
    
    // Clear existing options except the first one
    while (employeeSelect.options.length > 1) {
        employeeSelect.remove(1);
    }
    
    // Add employee options
    employees.forEach(employee => {
        const option = document.createElement('option');
        option.value = employee.id;
        option.textContent = `${employee.name} (${employee.department})`;
        employeeSelect.appendChild(option);
    });
    
    // Handle employee selection
    employeeSelect.addEventListener('change', function() {
        // In a real app, this would load the employee's onboarding data
        console.log('Selected employee ID:', this.value);
        
        // Mock loading data - simulate checking some steps as completed
        if (this.value) {
            // Reset all steps
            document.querySelectorAll('.activity-step').forEach(step => {
                step.classList.remove('completed');
                const checkbox = step.querySelector('[id$="-complete"]');
                if (checkbox) checkbox.checked = false;
                
                const dateElement = step.querySelector('[id$="-date"]');
                if (dateElement) dateElement.textContent = 'Not completed';
                
                const byElement = step.querySelector('[id$="-by"]');
                if (byElement) byElement.textContent = '-';
            });
            
            // Mark some steps as completed based on employee
            if (this.value == 1) { // John Doe
                completeStep('step1');
                completeStep('step2');
            } else if (this.value == 2) { // Jane Smith
                completeStep('step1');
                completeStep('step2');
                completeStep('step3');
                completeStep('step4');
            }
            
            // Show completed status count
            updateCompletionStatus();
        }
    });
}

// Helper function to mark a step as complete
function completeStep(stepId) {
    const checkbox = document.getElementById(stepId + '-complete');
    if (checkbox) {
        checkbox.checked = true;
        
        // Trigger the change event
        const event = new Event('change');
        checkbox.dispatchEvent(event);
    }
}

// Update completion status display
function updateCompletionStatus() {
    const totalSteps = document.querySelectorAll('.activity-step').length;
    const completedSteps = document.querySelectorAll('.activity-step.completed').length;
    
    // Here you could update a progress bar or status indicator
    console.log(`Completed ${completedSteps} of ${totalSteps} steps`);
}

// Export the onboarding state manager for global access
window.onboardingState = onboardingState; 