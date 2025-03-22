
// Main JavaScript functionality for RuralConnect
document.addEventListener('DOMContentLoaded', function() {
    // Get main UI elements
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    const loginBtn = document.getElementById('loginBtn');
    const notification = document.getElementById('notification');
    
    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Check login status
    const isUserLoggedIn = localStorage.getItem('isUserLoggedIn') === 'true';
    const isAuthorityLoggedIn = localStorage.getItem('isAuthorityLoggedIn') === 'true';
    
    // Update login button based on login status
    if (loginBtn) {
        if (isUserLoggedIn) {
            loginBtn.textContent = 'Logout';
            loginBtn.classList.add('logout-btn');
        } else if (isAuthorityLoggedIn) {
            loginBtn.textContent = 'Dashboard';
            loginBtn.classList.add('dashboard-btn');
        }
        
        loginBtn.addEventListener('click', function() {
            if (isUserLoggedIn) {
                // Handle user logout
                localStorage.removeItem('isUserLoggedIn');
                localStorage.removeItem('userName');
                localStorage.removeItem('userPhone');
                localStorage.removeItem('userEmail');
                
                // Show logout notification
                showNotification('Logged out successfully!', 'info');
                
                // Redirect to home after logout
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else if (isAuthorityLoggedIn) {
                // Redirect to authority dashboard
                window.location.href = 'authorities-dashboard.html';
            } else {
                // Show login modal when not logged in
                showLoginModal();
            }
        });
    }
    
    // Handle issue reporting page functionality
    const issueForm = document.getElementById('issueForm');
    if (issueForm) {
        // Show login required message if not logged in
        const loginRequiredContainer = document.getElementById('loginRequiredContainer');
        const issueFormContainer = document.getElementById('issueFormContainer');
        const issueSuccessContainer = document.getElementById('issueSuccessContainer');
        
        if (loginRequiredContainer && issueFormContainer) {
            if (!isUserLoggedIn) {
                loginRequiredContainer.classList.remove('hidden');
                issueFormContainer.classList.add('hidden');
                
                // Handle login to report button
                const loginToReportBtn = document.getElementById('loginToReportBtn');
                if (loginToReportBtn) {
                    loginToReportBtn.addEventListener('click', function() {
                        showLoginModal();
                    });
                }
            } else {
                loginRequiredContainer.classList.add('hidden');
                issueFormContainer.classList.remove('hidden');
                
                // Handle issue form submission
                issueForm.addEventListener('submit', function(e) {
                    e.preventDefault();
                    
                    // Get form values
                    const issueType = document.getElementById('issueType').value;
                    const description = document.getElementById('description').value;
                    const ward = document.getElementById('ward').value;
                    const location = document.getElementById('location').value;
                    const locationCoordinates = document.getElementById('locationCoordinates').value || '0,0';
                    
                    // Create issue object
                    const newIssue = {
                        id: Date.now().toString(),
                        type: issueType,
                        description: description,
                        ward: ward,
                        location: location,
                        coordinates: locationCoordinates,
                        reportedBy: localStorage.getItem('userEmail') || 'anonymous',
                        dateReported: new Date().toISOString(),
                        status: 'pending',
                        // Files would be handled with actual backend
                        photos: []
                    };
                    
                    // Get existing issues
                    let villageIssues = JSON.parse(localStorage.getItem('villageIssues')) || [];
                    
                    // Add new issue
                    villageIssues.push(newIssue);
                    
                    // Save to localStorage
                    localStorage.setItem('villageIssues', JSON.stringify(villageIssues));
                    
                    // Show success message
                    issueFormContainer.classList.add('hidden');
                    if (issueSuccessContainer) {
                        issueSuccessContainer.classList.remove('hidden');
                        
                        // Populate submitted issue details
                        const submittedIssueDetails = document.getElementById('submittedIssueDetails');
                        if (submittedIssueDetails) {
                            submittedIssueDetails.innerHTML = `
                                <div class="issue-details">
                                    <h3>${issueType}</h3>
                                    <p>${description}</p>
                                    <div class="issue-meta">
                                        <span><i class="fas fa-map-marker-alt"></i> ${location}</span>
                                        <span><i class="fas fa-sort-numeric-up"></i> Ward ${ward}</span>
                                        <span><i class="fas fa-calendar-alt"></i> ${new Date().toLocaleDateString()}</span>
                                        <span><i class="fas fa-tag"></i> ${newIssue.id}</span>
                                    </div>
                                </div>
                            `;
                        }
                        
                        // Handle track issue button
                        const trackIssueBtn = document.getElementById('trackIssueBtn');
                        if (trackIssueBtn) {
                            trackIssueBtn.addEventListener('click', function() {
                                window.location.href = `issue-tracking.html?id=${newIssue.id}`;
                            });
                        }
                        
                        // Handle report another issue button
                        const reportAnotherBtn = document.getElementById('reportAnotherBtn');
                        if (reportAnotherBtn) {
                            reportAnotherBtn.addEventListener('click', function() {
                                issueSuccessContainer.classList.add('hidden');
                                issueFormContainer.classList.remove('hidden');
                                issueForm.reset();
                            });
                        }
                    }
                });
            }
        }
    }
    
    // Handle login form for user accounts
    function showLoginModal() {
        // Create login modal if it doesn't exist
        let loginModal = document.getElementById('loginModal');
        if (!loginModal) {
            loginModal = document.createElement('div');
            loginModal.id = 'loginModal';
            loginModal.className = 'modal';
            loginModal.innerHTML = `
                <div class="modal-content">
                    <span class="close-modal">&times;</span>
                    <h2>Login / Register</h2>
                    <div class="tabs">
                        <button class="tab-btn active" data-tab="login">Login</button>
                        <button class="tab-btn" data-tab="register">Register</button>
                    </div>
                    <div class="tab-content">
                        <div id="login" class="tab-pane active">
                            <form id="loginForm">
                                <div class="form-group">
                                    <label for="loginEmail">Email</label>
                                    <input type="email" id="loginEmail" required>
                                </div>
                                <div class="form-group">
                                    <label for="loginPassword">Password</label>
                                    <input type="password" id="loginPassword" required>
                                </div>
                                <button type="submit" class="btn btn-primary">Login</button>
                            </form>
                        </div>
                        <div id="register" class="tab-pane">
                            <form id="registerForm">
                                <div class="form-group">
                                    <label for="registerName">Full Name</label>
                                    <input type="text" id="registerName" required>
                                </div>
                                <div class="form-group">
                                    <label for="registerPhone">Phone Number</label>
                                    <input type="tel" id="registerPhone" required>
                                </div>
                                <div class="form-group">
                                    <label for="registerEmail">Email</label>
                                    <input type="email" id="registerEmail" required>
                                </div>
                                <div class="form-group">
                                    <label for="registerPassword">Password</label>
                                    <input type="password" id="registerPassword" required>
                                </div>
                                <div class="form-group">
                                    <label for="registerAddress">Address</label>
                                    <textarea id="registerAddress" required></textarea>
                                </div>
                                <div class="form-group">
                                    <label for="registerWard">Ward Number</label>
                                    <input type="text" id="registerWard" required>
                                </div>
                                <button type="submit" class="btn btn-primary">Register</button>
                            </form>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(loginModal);
            
            // Handle tabs
            const tabBtns = loginModal.querySelectorAll('.tab-btn');
            tabBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    const tab = this.dataset.tab;
                    
                    // Update active tab button
                    tabBtns.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Update active tab content
                    const tabPanes = loginModal.querySelectorAll('.tab-pane');
                    tabPanes.forEach(pane => pane.classList.remove('active'));
                    loginModal.querySelector(`#${tab}`).classList.add('active');
                });
            });
            
            // Handle close modal
            const closeModal = loginModal.querySelector('.close-modal');
            closeModal.addEventListener('click', function() {
                loginModal.style.display = 'none';
            });
            
            // Handle login form submission
            const loginForm = loginModal.querySelector('#loginForm');
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const email = document.getElementById('loginEmail').value;
                const password = document.getElementById('loginPassword').value;
                
                // In a real app, validate credentials against server
                // For demo purposes, we'll just use localStorage
                
                const users = JSON.parse(localStorage.getItem('villageUsers')) || [];
                const user = users.find(u => u.email === email && u.password === password);
                
                if (user) {
                    // Store user info
                    localStorage.setItem('isUserLoggedIn', 'true');
                    localStorage.setItem('userName', user.name);
                    localStorage.setItem('userEmail', user.email);
                    localStorage.setItem('userPhone', user.phone);
                    localStorage.setItem('userAddress', user.address);
                    localStorage.setItem('userWard', user.ward);
                    
                    // Close modal
                    loginModal.style.display = 'none';
                    
                    // Show success notification
                    showNotification('Login successful!', 'success');
                    
                    // Refresh page after short delay
                    setTimeout(() => {
                        window.location.reload();
                    }, 1500);
                } else {
                    showNotification('Invalid email or password', 'error');
                }
            });
            
            // Handle register form submission
            const registerForm = loginModal.querySelector('#registerForm');
            registerForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const name = document.getElementById('registerName').value;
                const phone = document.getElementById('registerPhone').value;
                const email = document.getElementById('registerEmail').value;
                const password = document.getElementById('registerPassword').value;
                const address = document.getElementById('registerAddress').value;
                const ward = document.getElementById('registerWard').value;
                
                // Get existing users
                let users = JSON.parse(localStorage.getItem('villageUsers')) || [];
                
                // Check if email already exists
                if (users.some(user => user.email === email)) {
                    showNotification('Email already registered', 'error');
                    return;
                }
                
                // Create new user
                const newUser = {
                    name,
                    phone,
                    email,
                    password,
                    address,
                    ward,
                    dateRegistered: new Date().toISOString()
                };
                
                // Add to users array
                users.push(newUser);
                
                // Save to localStorage
                localStorage.setItem('villageUsers', JSON.stringify(users));
                
                // Auto login
                localStorage.setItem('isUserLoggedIn', 'true');
                localStorage.setItem('userName', name);
                localStorage.setItem('userEmail', email);
                localStorage.setItem('userPhone', phone);
                localStorage.setItem('userAddress', address);
                localStorage.setItem('userWard', ward);
                
                // Close modal
                loginModal.style.display = 'none';
                
                // Show success notification
                showNotification('Registration successful!', 'success');
                
                // Refresh page after short delay
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            });
        }
        
        // Show modal
        loginModal.style.display = 'block';
    }
});

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    // Clear any existing timeouts
    if (window.notificationTimeout) {
        clearTimeout(window.notificationTimeout);
    }
    
    // Set notification content
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.classList.remove('hidden');
    
    // Hide notification after delay
    window.notificationTimeout = setTimeout(() => {
        notification.classList.add('hidden');
    }, 4000);
}
