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
            
            // Store user information
            localStorage.setItem('employeeEmail', tokenPayload.email);
            localStorage.setItem('employeeName', tokenPayload.name);
            localStorage.setItem('employeeLoggedIn', 'true');
            
            if (isAdmin) {
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