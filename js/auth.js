// Authentication handling script

document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    checkAuthStatus();
    
    // Add logout button to the UI if it doesn't exist
    addLogoutButton();
    
    // Add event listener for logout
    document.addEventListener('click', function(e) {
        if (e.target && e.target.classList.contains('logout-btn')) {
            logout();
        }
    });
});

// Check if the user is authorized to access this page
function checkAuthStatus() {
    const isEmployeeLoggedIn = localStorage.getItem('employeeLoggedIn') === 'true';
    const isAdminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    const currentPath = window.location.pathname;

    // If on login page and already logged in, redirect to appropriate page
    if (currentPath.includes('login.html')) {
        if (isAdminLoggedIn) {
            window.location.href = 'employee-portal/modules/admin/dashboard.html';
        } else if (isEmployeeLoggedIn) {
            window.location.href = 'employee-portal/index.html';
        }
        return;
    }

    // If not on login page and not logged in, redirect to login
    if (!isEmployeeLoggedIn && !isAdminLoggedIn) {
        window.location.href = 'login.html';
        return;
    }

    // // If admin tries to access employee pages, redirect to admin dashboard
    // if (isAdminLoggedIn && !currentPath.includes('modules/admin/')) {
    //     window.location.href = 'employee-portal/modules/admin/dashboard.html';
    //     return;
    // }

    // // If employee tries to access admin pages, redirect to index
    // if (isEmployeeLoggedIn && currentPath.includes('employee-portal/modules/admin')) {
    //     window.location.href = 'index.html';
    //     return;
    // }
    
    // Set username in the interface if it exists
    updateUserInfo();
}

// Add the logout button to the user interface
function addLogoutButton() {
    // Only add if we're on a protected page (not login page)
    if (window.location.pathname.includes('login.html')) {
        return;
    }
    
    // Check if the sidebar exists
    const sidebar = document.querySelector('.sidebar .nav-links');
    if (sidebar) {
        // Check if logout button already exists
        if (!document.querySelector('.logout-btn')) {
            const logoutItem = document.createElement('li');
            logoutItem.innerHTML = `
                <a href="#" class="nav-link logout-btn" onclick="logout(); return false;">
                    <i class="fas fa-sign-out-alt"></i>
                    <span>Logout</span>
                </a>
            `;
            sidebar.appendChild(logoutItem);
        }
    }
    
    // For admin pages that have a different layout
    const adminProfile = document.querySelector('.admin-profile');
    if (adminProfile && !adminProfile.querySelector('.logout-btn')) {
        const logoutBtn = document.createElement('a');
        logoutBtn.href = '#';
        logoutBtn.className = 'logout-btn';
        logoutBtn.innerHTML = '<i class="fas fa-sign-out-alt"></i>';
        logoutBtn.title = 'Logout';
        logoutBtn.style.marginLeft = '10px';
        logoutBtn.style.color = '#dc3545';
        logoutBtn.onclick = function(e) {
            e.preventDefault();
            logout();
        };
        adminProfile.appendChild(logoutBtn);
    }
}

// Update user info in the UI
function updateUserInfo() {
    // Get the employee name from storage
    const employeeEmail = localStorage.getItem('employeeEmail') || sessionStorage.getItem('employeeEmail');
    const adminUsername = localStorage.getItem('adminUsername') || sessionStorage.getItem('adminUsername');
    
    // Update admin profile if it exists
    const adminNameElem = document.querySelector('.admin-name');
    if (adminNameElem && adminUsername) {
        adminNameElem.textContent = adminUsername;
    }
    
    // Other user interface elements can be updated here
}

// Logout function
function logout() {
    // Clear all authentication data
    localStorage.removeItem('employeeLoggedIn');
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('employeeEmail');
    localStorage.removeItem('employeeName');
    localStorage.removeItem('adminUsername');
    
    // Get current path to determine correct redirect
    const currentPath = window.location.pathname;
    let redirectPath = 'login.html';
    
    // If we're in modules/admin directory, go back two levels
    if (currentPath.includes('/modules/admin/')) {
        redirectPath = '../../login.html';
    }
    // If we're in modules directory, go back one level
    else if (currentPath.includes('/modules/')) {
        redirectPath = '../login.html';
    }
    
    // Redirect to login page
    window.location.href = redirectPath;
}

// MSAL configuration
const msalConfig = {
    auth: {
        clientId: "4052a213-d406-4764-97ce-6b3a03709ae5",
        authority: "https://login.microsoftonline.com/c3c3e928-85e8-43af-80c2-e705fe9b0cb0",
        redirectUri: "http://localhost/employee-portal/login.html",
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false
    }
};

// Create MSAL instance
const msalInstance = new msal.PublicClientApplication(msalConfig);

// Login request configuration
const loginRequest = {
    scopes: ["User.Read", "profile", "email"],
    prompt: "select_account" // This will force account selection
};

// Handle Microsoft login
async function handleMicrosoftLogin() {
    try {
        const response = await msalInstance.loginPopup(loginRequest);
        if (response) {
            // Get the ID token
            const idToken = response.idToken;
            
            // Decode the ID token to get user information
            const tokenPayload = JSON.parse(atob(idToken.split('.')[1]));
            
            // Get user roles from token
            const roles = tokenPayload.roles || [];
            const isAdmin = roles.includes('Admin');
            const isEmployee = roles.includes('Employee');
            
            // Store user information
            localStorage.setItem('employeeEmail', tokenPayload.email);
            localStorage.setItem('employeeName', tokenPayload.name);
            localStorage.setItem('employeeLoggedIn', 'true');
            
            // If user has both roles, show role selection
            if (isAdmin && isEmployee) {
                const selectedRole = await showRoleSelection();
                if (selectedRole === 'admin') {
                    localStorage.setItem('adminLoggedIn', 'true');
                    localStorage.setItem('adminUsername', tokenPayload.name);
                    window.location.href = 'modules/admin/dashboard.html';
                } else {
                    window.location.href = 'index.html';
                }
            } else if (isAdmin) {
                localStorage.setItem('adminLoggedIn', 'true');
                localStorage.setItem('adminUsername', tokenPayload.name);
                window.location.href = 'modules/admin/dashboard.html';
            } else {
                window.location.href = 'index.html';
            }
        }
    } catch (error) {
        console.error("Login failed:", error);
        alert("Login failed. Please try again.");
    }
}

// Show role selection dialog
function showRoleSelection() {
    return new Promise((resolve) => {
        const dialog = document.createElement('div');
        dialog.className = 'role-selection-dialog';
        dialog.innerHTML = `
            <div class="role-selection-content">
                <h3>Select Role</h3>
                <p>You have access to multiple roles. Please select which role you want to use:</p>
                <div class="role-buttons">
                    <button class="role-btn admin-btn" onclick="this.closest('.role-selection-dialog').remove(); window.roleSelectionResult = 'admin';">
                        <i class="fas fa-user-shield"></i>
                        Admin Portal
                    </button>
                    <button class="role-btn employee-btn" onclick="this.closest('.role-selection-dialog').remove(); window.roleSelectionResult = 'employee';">
                        <i class="fas fa-user"></i>
                        Employee Portal
                    </button>
                </div>
            </div>
        `;

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .role-selection-dialog {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }
            .role-selection-content {
                background: white;
                padding: 20px;
                border-radius: 8px;
                text-align: center;
                max-width: 400px;
                width: 90%;
            }
            .role-buttons {
                display: flex;
                gap: 10px;
                justify-content: center;
                margin-top: 20px;
            }
            .role-btn {
                padding: 10px 20px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 14px;
                transition: all 0.3s ease;
            }
            .admin-btn {
                background: #dc3545;
                color: white;
            }
            .employee-btn {
                background: #0d6efd;
                color: white;
            }
            .role-btn:hover {
                opacity: 0.9;
                transform: translateY(-2px);
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(dialog);

        // Wait for role selection
        const checkSelection = setInterval(() => {
            if (window.roleSelectionResult) {
                clearInterval(checkSelection);
                resolve(window.roleSelectionResult);
                delete window.roleSelectionResult;
            }
        }, 100);
    });
}

// Check if user is already logged in
async function checkLoginStatus() {
    const accounts = msalInstance.getAllAccounts();
    if (accounts.length > 0) {
        try {
            // Get the current account
            const account = accounts[0];
            
            // Get the ID token silently
            const response = await msalInstance.acquireTokenSilent({
                scopes: ["User.Read", "profile", "email"],
                account: account
            });
            
            // Decode the ID token
            const tokenPayload = JSON.parse(atob(response.idToken.split('.')[1]));
            const roles = tokenPayload.roles || [];
            const isAdmin = roles.includes('Admin');
            
            // Store user information
            localStorage.setItem('employeeEmail', tokenPayload.email);
            localStorage.setItem('employeeLoggedIn', 'true');
            
            if (isAdmin) {
                localStorage.setItem('adminLoggedIn', 'true');
                localStorage.setItem('adminUsername', tokenPayload.name);
            }
            
            return true;
        } catch (error) {
            console.error("Error checking login status:", error);
            return false;
        }
    }
    return false;
} 