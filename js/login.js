
// Login functionality
document.addEventListener('DOMContentLoaded', () => {
  // Handle public user login
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const phoneNumber = document.getElementById('phone-number').value;
      const password = document.getElementById('password').value;
      
      // Simple validation
      if (!phoneNumber || !password) {
        notify('Please fill in all fields', 'error');
        return;
      }
      
      // For demo purposes, simple authentication
      // In a real app, this would be an API call
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userType', 'public');
      localStorage.setItem('userPhone', phoneNumber);
      
      notify('Login successful!', 'success');
      
      // Get the redirect path if any
      const redirectPath = sessionStorage.getItem('redirectFrom') || 'index.html';
      sessionStorage.removeItem('redirectFrom'); // Clear the stored page
      
      // Redirect after a short delay
      setTimeout(() => {
        window.location.href = redirectPath;
      }, 1000);
    });
  }
  
  // Handle authority login
  const authorityLoginForm = document.getElementById('authority-login-form');
  if (authorityLoginForm) {
    authorityLoginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const role = document.getElementById('role').value;
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      // Validate inputs
      if (!role || !email || !password) {
        notify('Please fill in all fields', 'error');
        return;
      }
      
      // Predefined credentials for demo
      const credentials = {
        'sarpanch': { email: 'sarpanch@gmail.com', password: 'sarpanch' },
        'wise-sarpanch': { email: 'wisesarpanch@gmail.com', password: 'wisesarpanch' },
        'ward-member': { email: 'wardmember@gmail.com', password: 'wardmember' }
      };
      
      // Check credentials
      if (credentials[role] && email === credentials[role].email && password === credentials[role].password) {
        // Set login status
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userType', 'authority');
        localStorage.setItem('authorityRole', role);
        
        notify(`Login successful as ${role}!`, 'success');
        
        // Redirect to authority dashboard after a short delay
        setTimeout(() => {
          window.location.href = 'authority-dashboard.html';
        }, 1000);
      } else {
        notify('Invalid credentials. Please try again.', 'error');
      }
    });
  }
});
