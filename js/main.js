// Global utility functions and state management
// This file contains common functionality used across multiple pages

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('navMenu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', function() {
      navMenu.classList.toggle('active');
    });
  }

  // Check login status and update UI
  updateLoginStatus();
  
  // Update report issue links based on login status
  updateReportIssueLinks();
});

// Function to check login status and update UI
function updateLoginStatus() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const loginButtons = document.querySelectorAll('.login-btn');
  
  loginButtons.forEach(button => {
    if (isLoggedIn) {
      // If user is logged in, show logout button
      button.textContent = 'Logout';
      button.classList.remove('login-btn');
      button.classList.add('logout-btn');
      
      // Update click behavior
      button.addEventListener('click', function(e) {
        e.preventDefault();
        logout();
      });
    } else {
      // If user is not logged in, ensure it's a login button
      button.textContent = 'Login';
      button.classList.add('login-btn');
      button.classList.remove('logout-btn');
      
      // Keep the default href behavior to navigate to login page
    }
  });
}

// Function to handle logout
function logout() {
  // Clear login status
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userType');
  localStorage.removeItem('userPhone');
  localStorage.removeItem('authorityRole');
  
  // Show notification
  notify('Logged out successfully', 'success');
  
  // Refresh the page
  setTimeout(() => {
    window.location.reload();
  }, 1000);
}

// Function to update report issue links based on login status
function updateReportIssueLinks() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const reportIssueLinks = document.querySelectorAll('.report-issue-link');
  
  reportIssueLinks.forEach(link => {
    if (isLoggedIn) {
      // If logged in, enable the link
      link.classList.remove('disabled-link');
      link.href = 'report-issue.html';
    } else {
      // If not logged in, disable the link and store current page URL
      link.classList.add('disabled-link');
      
      // Add click handler to show login message and redirect
      link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Store the current page URL to redirect back after login
        sessionStorage.setItem('redirectFrom', window.location.href);
        
        notify('Please login to report an issue', 'warning');
        
        // Redirect to login page
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 1500);
      });
    }
  });
}

// Notification function
function notify(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  
  // Create message content
  const messageText = document.createElement('span');
  messageText.textContent = message;
  
  // Create close button
  const closeButton = document.createElement('span');
  closeButton.innerHTML = '&times;';
  closeButton.className = 'notification-close';
  closeButton.addEventListener('click', () => {
    notification.classList.add('fadeOut');
    setTimeout(() => {
      notification.remove();
    }, 300);
  });
  
  // Assemble notification
  notification.appendChild(messageText);
  notification.appendChild(closeButton);
  
  // Add to the page
  document.body.appendChild(notification);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (document.body.contains(notification)) {
      notification.classList.add('fadeOut');
      setTimeout(() => {
        notification.remove();
      }, 300);
    }
  }, 5000);
  
  return notification;
}

// Function to format date
function formatDate(dateString) {
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Storage event listener for real-time content sync
window.addEventListener('storage', function(e) {
  // When another tab/window updates localStorage, sync content
  if (e.key === 'budgetItems') {
    // Update budget items if on budget page
    if (document.getElementById('budget-cards-container')) {
      loadBudgetItems();
    }
  } else if (e.key === 'galleryItems') {
    // Update gallery if on gallery page
    if (document.getElementById('gallery-container')) {
      loadGalleryItems();
    }
  } else if (e.key === 'eventItems') {
    // Update events if on events page
    if (document.getElementById('events-container')) {
      loadEvents();
    }
  }
});
