document.addEventListener('DOMContentLoaded', function() {
    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const loginForms = document.querySelectorAll('.login-form');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all tabs and forms
            tabButtons.forEach(btn => btn.classList.remove('active'));
            loginForms.forEach(form => form.classList.remove('active'));
            
            // Add active class to current tab and corresponding form
            button.classList.add('active');
            const tabId = button.getAttribute('data-tab');
            document.getElementById(`${tabId}-login-form`).classList.add('active');
        });
    });
    
    // Toggle password visibility
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', function() {
            const passwordInput = this.previousElementSibling;
            const toggleIcon = this.querySelector('i');
            
            // Toggle password visibility
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                toggleIcon.classList.remove('fa-eye');
                toggleIcon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                toggleIcon.classList.remove('fa-eye-slash');
                toggleIcon.classList.add('fa-eye');
            }
        });
    });
    
    // Unified Login Form Submission
    const unifiedLoginForm = document.getElementById('unified-login-form');
    if (unifiedLoginForm) {
        unifiedLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const userInput = document.getElementById('user-email').value;
            const password = document.getElementById('user-password').value;
            const rememberMe = document.getElementById('remember-me').checked;
            
            // Check if input is admin credentials
            if (userInput === 'admin' && password === 'admin123') {
                // Admin login successful
                console.log('Admin login successful');
                
                // Save to localStorage if remember me is checked
                if (rememberMe) {
                    localStorage.setItem('adminLoggedIn', 'true');
                    localStorage.setItem('adminUsername', userInput);
                } else {
                    sessionStorage.setItem('adminLoggedIn', 'true');
                    sessionStorage.setItem('adminUsername', userInput);
                }
                
                // Redirect to admin dashboard
                window.location.href = 'modules/admin/dashboard.html';
            } 
            // Check if input is employee credentials
            else if (userInput === 'employee@example.com' && password === 'password') {
                // Employee login successful
                console.log('Employee login successful');
                
                // Save to localStorage if remember me is checked
                if (rememberMe) {
                    localStorage.setItem('employeeLoggedIn', 'true');
                    localStorage.setItem('employeeEmail', userInput);
                } else {
                    sessionStorage.setItem('employeeLoggedIn', 'true');
                    sessionStorage.setItem('employeeEmail', userInput);
                }
                
                // Redirect to employee dashboard
                window.location.href = 'home.html';
            } 
            else {
                // Invalid credentials
                showErrorMessage(unifiedLoginForm, 'Invalid username/email or password');
            }
        });
    }
    
    // Microsoft login button handler
    const microsoftButton = document.querySelector('.btn-microsoft');
    if (microsoftButton) {
        microsoftButton.addEventListener('click', function() {
            // In a real application, you would implement Microsoft OAuth flow
            console.log('Microsoft login initiated');
            
            // For demonstration purposes, show "coming soon" message
            alert('Microsoft login integration is coming soon!');
            
            // In a real application, you would do something like:
            // initiateOAuth('microsoft', {redirectUri: window.location.origin + '/auth/microsoft/callback'});
        });
    }
    
    // Function to show error messages
    function showErrorMessage(form, message) {
        // Remove any existing error message
        const existingError = form.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Create and append new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        
        // Insert after login button
        const loginButton = form.querySelector('.btn-login');
        loginButton.insertAdjacentElement('afterend', errorDiv);
    }
    
    // Check if user is already logged in (demo purposes)
    function checkLoggedInStatus() {
        // Check if employee is logged in
        if (localStorage.getItem('employeeLoggedIn') === 'true' || 
            sessionStorage.getItem('employeeLoggedIn') === 'true') {
            window.location.href = 'home.html';
            return;
        }
        
        // Check if admin is logged in
        if (localStorage.getItem('adminLoggedIn') === 'true' || 
            sessionStorage.getItem('adminLoggedIn') === 'true') {
            window.location.href = 'modules/admin/dashboard.html';
            return;
        }
    }
    
    // Comment this out for testing the login page without auto-redirect
    // checkLoggedInStatus();
}); 