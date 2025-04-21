document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const authorityLoginForm = document.getElementById('authority-login-form');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    // Store the current page URL before login
    const currentPage = sessionStorage.getItem('currentPage') || window.location.href;
    
    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Public User Login
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const phoneNumber = document.getElementById('phone-number').value;
            const password = document.getElementById('password').value;
            
            // Simple validation
            if (phoneNumber && password) {
                // In a real app, you would verify this against a database
                // For demo, set login status and redirect back to original page
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userType', 'public');
                localStorage.setItem('userPhone', phoneNumber);
                
                alert('Login successful!');
                
                // Redirect back to the page they were on or to index if none stored
                const redirectTo = sessionStorage.getItem('redirectFrom') || 'index.html';
                sessionStorage.removeItem('redirectFrom'); // Clear the stored page
                window.location.href = redirectTo;
            } else {
                alert('Please fill in all fields');
            }
        });
    }

    // User Registration
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const phoneNumber = document.getElementById('phone-number').value;
            const password = document.getElementById('password').value;
            
            // Simple validation
            if (name && phoneNumber && password) {
                alert('Registration successful!');
                // In a real app, you would store this in a database
                localStorage.setItem('userName', name);
                localStorage.setItem('userPhone', phoneNumber);
                window.location.href = 'login.html';
            } else {
                alert('Please fill in all fields');
            }
        });
    }

    // Authority Login
    if (authorityLoginForm) {
        authorityLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const role = document.getElementById('role').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Predefined credentials
            const credentials = {
                'sarpanch': { email: 'sarpanch@gmail.com', password: 'sarpanch' },
                'wise-sarpanch': { email: 'wisesarpanch@gmail.com', password: 'wisesarpanch' },
                'ward-member': { email: 'wardmember@gmail.com', password: 'wardmember' }
            };

            // Check credentials
            if (role && credentials[role]) {
                if (email === credentials[role].email && password === credentials[role].password) {
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('userType', 'authority');
                    localStorage.setItem('authorityRole', role);
                    
                    alert(`Login successful for ${role}!`);
                    // Redirect to authority dashboard
                    window.location.href = 'authority-dashboard.html';
                } else {
                    alert('Invalid email or password');
                }
            } else {
                alert('Please select a role and enter credentials');
            }
        });
    }

    // Login buttons in the navigation - update to handle both login and logout
    const loginButtons = document.querySelectorAll('.login-btn');
    loginButtons.forEach(button => {
        // Check login status
        if (localStorage.getItem('isLoggedIn') === 'true') {
            // User is logged in, show logout button
            button.textContent = 'Logout';
            button.classList.remove('login-btn');
            button.classList.add('logout-btn');
            
            button.addEventListener('click', () => {
                // Handle logout
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userType');
                localStorage.removeItem('authorityRole');
                alert('You have been logged out.');
                window.location.reload();
            });
        } else {
            // User is not logged in, show login button
            button.addEventListener('click', () => {
                window.location.href = 'login.html';
            });
        }
    });

    // Update the report issue link behavior based on login status
    const updateReportIssueAccess = () => {
        const reportIssueLinks = document.querySelectorAll('.report-issue-link');
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        
        reportIssueLinks.forEach(link => {
            if (isLoggedIn) {
                link.classList.remove('disabled-link');
                // Remove any existing event listeners by cloning
                const newLink = link.cloneNode(true);
                if (link.parentNode) {
                    link.parentNode.replaceChild(newLink, link);
                }
            } else {
                link.classList.add('disabled-link');
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    alert('Please login to report an issue');
                    sessionStorage.setItem('redirectFrom', window.location.href);
                    window.location.href = 'login.html';
                });
            }
        });
    };

    // Call on page load
    updateReportIssueAccess();
});
