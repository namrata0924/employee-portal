document.addEventListener('DOMContentLoaded', function() {
    // Form elements
    const loginForm = document.querySelector('.login-form');
    const emailInput = document.querySelector('input[type="email"]');
    const passwordInput = document.querySelector('input[type="password"]');
    const togglePasswordBtn = document.querySelector('.toggle-password');
    const rememberMeCheckbox = document.querySelector('input[type="checkbox"]');
    const loginButton = document.querySelector('.btn-login');
    const microsoftBtn = document.querySelector('.btn-sso.microsoft');
    const googleBtn = document.querySelector('.btn-sso.google');

    // Toggle password visibility
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.querySelector('i').classList.toggle('fa-eye');
            this.querySelector('i').classList.toggle('fa-eye-slash');
        });
    }

    // Form validation
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    function validatePassword(password) {
        return password.length >= 6;
    }

    function showError(input, message) {
        const formGroup = input.closest('.form-group');
        let errorElement = formGroup.querySelector('.error-message');
        
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            formGroup.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        input.classList.add('error');
    }

    function clearError(input) {
        const formGroup = input.closest('.form-group');
        const errorElement = formGroup.querySelector('.error-message');
        
        if (errorElement) {
            errorElement.remove();
        }
        
        input.classList.remove('error');
    }

    // Input validation on blur
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            if (!validateEmail(this.value)) {
                showError(this, 'Please enter a valid email address');
            } else {
                clearError(this);
            }
        });
    }

    if (passwordInput) {
        passwordInput.addEventListener('blur', function() {
            if (!validatePassword(this.value)) {
                showError(this, 'Password must be at least 6 characters long');
            } else {
                clearError(this);
            }
        });
    }

    // Form submission
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            let isValid = true;
            
            // Validate email
            if (!validateEmail(emailInput.value)) {
                showError(emailInput, 'Please enter a valid email address');
                isValid = false;
            }
            
            // Validate password
            if (!validatePassword(passwordInput.value)) {
                showError(passwordInput, 'Password must be at least 6 characters long');
                isValid = false;
            }
            
            if (!isValid) return;
            
            // Disable login button and show loading state
            loginButton.disabled = true;
            loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
            
            try {
                // Here you would typically make an API call to your backend
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: emailInput.value,
                        password: passwordInput.value,
                        remember: rememberMeCheckbox.checked
                    })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    // Store the token if remember me is checked
                    if (rememberMeCheckbox.checked) {
                        localStorage.setItem('authToken', data.token);
                    } else {
                        sessionStorage.setItem('authToken', data.token);
                    }
                    
                    // Redirect to dashboard
                    window.location.href = '/dashboard.html';
                } else {
                    throw new Error(data.message || 'Login failed');
                }
            } catch (error) {
                // Show error message
                const errorMessage = document.createElement('div');
                errorMessage.className = 'alert alert-error';
                errorMessage.textContent = error.message || 'An error occurred during login';
                loginForm.insertBefore(errorMessage, loginForm.firstChild);
                
                // Remove error message after 5 seconds
                setTimeout(() => {
                    errorMessage.remove();
                }, 5000);
            } finally {
                // Reset login button
                loginButton.disabled = false;
                loginButton.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
            }
        });
    }

    // Microsoft SSO
    if (microsoftBtn) {
        microsoftBtn.addEventListener('click', function() {
            // Redirect to Microsoft OAuth endpoint
            const clientId = 'YOUR_MICROSOFT_CLIENT_ID'; // Replace with your actual client ID
            const redirectUri = encodeURIComponent(window.location.origin + '/auth/microsoft/callback');
            const scope = encodeURIComponent('openid profile email');
            
            window.location.href = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?` +
                `client_id=${clientId}&` +
                `response_type=code&` +
                `redirect_uri=${redirectUri}&` +
                `scope=${scope}&` +
                `response_mode=query`;
        });
    }

    // Google SSO
    if (googleBtn) {
        googleBtn.addEventListener('click', function() {
            // Redirect to Google OAuth endpoint
            const clientId = 'YOUR_GOOGLE_CLIENT_ID'; // Replace with your actual client ID
            const redirectUri = encodeURIComponent(window.location.origin + '/auth/google/callback');
            const scope = encodeURIComponent('openid profile email');
            
            window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?` +
                `client_id=${clientId}&` +
                `redirect_uri=${redirectUri}&` +
                `response_type=code&` +
                `scope=${scope}&` +
                `access_type=offline&` +
                `prompt=consent`;
        });
    }

    // Check for existing session
    function checkSession() {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        if (token) {
            // Verify token validity with backend
            fetch('/api/auth/verify', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                if (response.ok) {
                    // Redirect to dashboard if token is valid
                    window.location.href = '/dashboard.html';
                } else {
                    // Clear invalid token
                    localStorage.removeItem('authToken');
                    sessionStorage.removeItem('authToken');
                }
            })
            .catch(() => {
                // Clear token on error
                localStorage.removeItem('authToken');
                sessionStorage.removeItem('authToken');
            });
        }
    }

    // Check session on page load
    checkSession();
}); 