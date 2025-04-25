
// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger
    const spans = hamburger.querySelectorAll('span');
    spans.forEach(span => span.classList.toggle('active'));
  });
}

// Add ripple effect to buttons
document.addEventListener('DOMContentLoaded', () => {
  // Check login status and update UI accordingly
  updateLoginStatusUI();
  
  // Update report issue links
  updateReportIssueLinkBehavior();
  
  const buttons = document.querySelectorAll('.btn, button:not([disabled])');
  
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      const x = e.clientX - e.target.getBoundingClientRect().left;
      const y = e.clientY - e.target.getBoundingClientRect().top;
      
      const ripple = document.createElement('span');
      ripple.classList.add('ripple-effect');
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
});

// Language switcher
const langButtons = document.querySelectorAll('.lang-btn');
langButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Remove active class from all buttons
    langButtons.forEach(btn => btn.classList.remove('active'));
    // Add active class to clicked button
    button.classList.add('active');
    
    // Here you would normally handle language change logic
    console.log('Language changed to:', button.textContent.trim());
    notify(`Language changed to: ${button.textContent.trim()}`, 'success');
  });
});

// Handle form submission for report issue
document.addEventListener('DOMContentLoaded', () => {
  const reportForm = document.getElementById('report-issue-form');
  if (reportForm) {
    reportForm.addEventListener('submit', function(e) {
      e.preventDefault();
      handleReportIssueSubmit(e);
    });
  }
  
  // Add hover effects to cards
  const cards = document.querySelectorAll('.rural-card, .feature-card, .event-card, .resource-card');
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.classList.add('card-hover');
    });
    
    card.addEventListener('mouseleave', function() {
      this.classList.remove('card-hover');
    });
  });
  
  // Enhanced button interactivity
  const actionButtons = document.querySelectorAll('.btn-primary, .btn-accent, .btn-secondary, .btn-outline-accent, .btn-outline');
  actionButtons.forEach(button => {
    if (!button.hasAttribute('data-has-handler')) {
      button.setAttribute('data-has-handler', 'true');
      
      button.addEventListener('click', function() {
        const buttonText = this.textContent.trim();
        notify(`Action: ${buttonText}`, 'info');
        
        // Add temporary active state visual feedback
        this.classList.add('btn-active');
        setTimeout(() => {
          this.classList.remove('btn-active');
        }, 300);
      });
      
      // Add hover animation
      button.addEventListener('mouseenter', function() {
        this.classList.add('btn-hover');
      });
      
      button.addEventListener('mouseleave', function() {
        this.classList.remove('btn-hover');
      });
    }
  });
  
  // File upload handling
  const fileUpload = document.querySelector('.file-upload');
  const fileInput = document.getElementById('file-input');
  const filePreview = document.querySelector('.file-preview');
  
  if (fileUpload && fileInput) {
    fileUpload.addEventListener('click', () => {
      fileInput.click();
    });
    
    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0 && filePreview) {
        filePreview.innerHTML = ''; // Clear previous previews
        
        Array.from(fileInput.files).forEach(file => {
          const thumbnail = document.createElement('div');
          thumbnail.className = 'file-thumbnail';
          
          if (file.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            thumbnail.appendChild(img);
          } else {
            thumbnail.textContent = file.name.substring(0, 10) + '...';
          }
          
          const removeBtn = document.createElement('div');
          removeBtn.className = 'file-remove';
          removeBtn.innerHTML = '&times;';
          removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            thumbnail.remove();
            // Note: We can't actually remove items from a FileList, this is just for UI
          });
          
          thumbnail.appendChild(removeBtn);
          filePreview.appendChild(thumbnail);
        });
        
        notify('Files uploaded successfully', 'success');
      }
    });
  }
  
  // Add smooth scrolling to all internal links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });

  // Enhance resource download buttons
  const resourceButtons = document.querySelectorAll('.download-btn');
  resourceButtons.forEach(button => {
    button.addEventListener('click', function() {
      const resourceTitle = this.closest('.resource-card').querySelector('h3').textContent;
      notify(`Downloading resource: ${resourceTitle}`, 'info');
      
      // Add download animation
      this.classList.add('downloading');
      setTimeout(() => {
        this.classList.remove('downloading');
        notify(`${resourceTitle} downloaded successfully!`, 'success');
      }, 1500);
    });
  });
  
  // Enhance event detail buttons
  const eventDetailButtons = document.querySelectorAll('.event-card .btn-outline-accent');
  eventDetailButtons.forEach(button => {
    button.addEventListener('click', function() {
      const eventTitle = this.closest('.event-card').querySelector('h3').textContent;
      notify(`Viewing details for event: ${eventTitle}`, 'info');
      
      // In a real app, this would navigate to the event details page
      this.classList.add('loading');
      setTimeout(() => {
        this.classList.remove('loading');
        // Simulating navigation delay
        window.location.href = '#'; // Would go to event page in real app
      }, 500);
    });
  });
  
  // Real-time content synchronization between authority dashboard and public pages
  setupStorageListener();
});

// Function to update login status UI
function updateLoginStatusUI() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const loginStatusBtns = document.querySelectorAll('.login-btn, .logout-btn');
  
  loginStatusBtns.forEach(btn => {
    if (isLoggedIn) {
      btn.textContent = 'Logout';
      btn.classList.remove('login-btn');
      btn.classList.add('logout-btn');
      
      // Remove any existing event listeners
      const newBtn = btn.cloneNode(true);
      if (btn.parentNode) {
        btn.parentNode.replaceChild(newBtn, btn);
      }
      
      newBtn.addEventListener('click', () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userType');
        localStorage.removeItem('authorityRole');
        alert('You have been logged out.');
        window.location.reload();
      });
    } else {
      btn.textContent = 'Login';
      btn.classList.add('login-btn');
      btn.classList.remove('logout-btn');
      
      // Remove any existing event listeners
      const newBtn = btn.cloneNode(true);
      if (btn.parentNode) {
        btn.parentNode.replaceChild(newBtn, btn);
      }
      
      newBtn.addEventListener('click', () => {
        sessionStorage.setItem('redirectFrom', window.location.href);
        window.location.href = 'login.html';
      });
    }
  });
}

// Function to update report issue link behavior based on login status
function updateReportIssueLinkBehavior() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const reportIssueLinks = document.querySelectorAll('.report-issue-link');
  
  reportIssueLinks.forEach(link => {
    if (isLoggedIn) {
      link.classList.remove('disabled-link');
      
      // Remove any existing click listeners
      const newLink = link.cloneNode(true);
      if (link.parentNode) {
        link.parentNode.replaceChild(newLink, link);
      }
    } else {
      link.classList.add('disabled-link');
      
      // Remove any existing click listeners and add new one
      const newLink = link.cloneNode(true);
      if (link.parentNode) {
        link.parentNode.replaceChild(newLink, link);
      }
      
      newLink.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Please login to report an issue');
        sessionStorage.setItem('redirectFrom', window.location.href);
        window.location.href = 'login.html';
      });
    }
  });
}

// Create a basic popup notification system
const notify = (message, type = 'info') => {
  // Remove any notifications with the same message to prevent duplicates
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(notification => {
    if (notification.textContent.includes(message)) {
      notification.remove();
    }
  });
  
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  const closeBtn = document.createElement('span');
  closeBtn.className = 'notification-close';
  closeBtn.innerHTML = '&times;';
  closeBtn.addEventListener('click', () => {
    notification.classList.add('fadeOut');
    setTimeout(() => notification.remove(), 500);
  });
  
  notification.appendChild(closeBtn);
  document.body.appendChild(notification);
  
  // Apply CSS if it's not already in the page
  if (!document.querySelector('#notification-styles')) {
    const style = document.createElement('style');
    style.id = 'notification-styles';
    style.textContent = `
      .notification {
        position: fixed;
        bottom: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: var(--border-radius, 0.5rem);
        background-color: var(--white, white);
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        justify-content: space-between;
        z-index: 1000;
        min-width: 250px;
        max-width: 400px;
        animation: slideIn 0.3s ease-out forwards;
      }
      .notification.info { border-left: 4px solid var(--sky, #7EC8E3); }
      .notification.success { border-left: 4px solid var(--leaf, #4D724D); }
      .notification.warning { border-left: 4px solid var(--mustard, #F0C05A); }
      .notification.error { border-left: 4px solid var(--terracotta, #CD5D45); }
      .notification-close {
        cursor: pointer;
        margin-left: 10px;
        font-size: 20px;
      }
      .notification.fadeOut {
        animation: fadeOut 0.5s ease-out forwards;
      }
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
      
      /* Button effects */
      .ripple-effect {
        position: absolute;
        background: rgba(255, 255, 255, 0.4);
        border-radius: 50%;
        pointer-events: none;
        width: 100px;
        height: 100px;
        transform: translate(-50%, -50%) scale(0);
        animation: ripple 0.6s linear;
      }
      
      @keyframes ripple {
        to {
          transform: translate(-50%, -50%) scale(4);
          opacity: 0;
        }
      }
      
      .btn-hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      }
      
      .btn-active {
        transform: translateY(1px);
      }
      
      .card-hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0,0,0,0.1);
      }
      
      .downloading {
        position: relative;
        pointer-events: none;
        color: transparent !important;
      }
      
      .downloading::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 1.2em;
        height: 1.2em;
        border: 2px solid rgba(255,255,255,0.2);
        border-radius: 50%;
        border-top-color: currentColor;
        animation: spin 0.8s linear infinite;
      }
      
      @keyframes spin {
        to { transform: translate(-50%, -50%) rotate(360deg); }
      }
      
      .loading {
        position: relative;
        pointer-events: none;
      }
      
      .loading::after {
        content: '...';
        display: inline-block;
        animation: loading 1.5s infinite;
      }
      
      @keyframes loading {
        0% { content: '.'; }
        33% { content: '..'; }
        66% { content: '...'; }
      }
      
      /* Disabled link styling */
      .disabled-link {
        pointer-events: none;
        opacity: 0.6;
        cursor: not-allowed;
      }
    `;
    document.head.appendChild(style);
  }
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (document.body.contains(notification)) {
      notification.classList.add('fadeOut');
      setTimeout(() => notification.remove(), 500);
    }
  }, 5000);
  
  return notification;
};

// Function to handle report issue form submission
const handleReportIssueSubmit = (event) => {
  if (event) event.preventDefault();
  
  // Get form data, validate, etc.
  const form = document.getElementById('report-issue-form') || document.getElementById('issueForm');
  let isValid = true;
  
  // Basic validation
  if (form) {
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        isValid = false;
        field.classList.add('error');
        
        // Add shake animation to invalid fields
        field.classList.add('shake-error');
        setTimeout(() => {
          field.classList.remove('shake-error');
        }, 500);
        
        notify(`Please fill in the ${field.name || field.id || 'required'} field`, 'warning');
      } else {
        field.classList.remove('error');
      }
    });
  }
  
  if (isValid && form) {
    // Add loading state to submit button
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add('loading');
      
      // Get form data
      const issueTitle = document.getElementById('issue-title')?.value || '';
      const issueCategory = document.getElementById('issue-category')?.value || 'general';
      const issueLocation = document.getElementById('issue-location')?.value || '';
      const issueDescription = document.getElementById('issue-description')?.value || '';
      const userPhone = localStorage.getItem('userPhone') || 'Anonymous';
      const userName = localStorage.getItem('userName') || 'User';
      
      // Create new issue object
      const issue = {
        id: `#${issueCategory.substring(0, 3).toUpperCase()}-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}`,
        title: issueTitle,
        category: issueCategory,
        location: issueLocation,
        description: issueDescription,
        status: 'reported', // Initial status is always 'reported'
        reporter: {
          name: userName,
          phone: userPhone
        },
        timeline: [
          {
            status: 'reported',
            date: new Date().toISOString(),
            message: 'Issue reported successfully'
          }
        ],
        currentStep: 'ward-member', // Always sent to Ward Member first
        created: new Date().toISOString()
      };
      
      // Save to localStorage
      const userIssues = JSON.parse(localStorage.getItem('userIssues') || '[]');
      userIssues.push(issue);
      localStorage.setItem('userIssues', JSON.stringify(userIssues));
      
      // Also add to pending issues for authorities
      const pendingIssues = JSON.parse(localStorage.getItem('pendingIssues') || '[]');
      pendingIssues.push(issue);
      localStorage.setItem('pendingIssues', JSON.stringify(pendingIssues));
      
      // Simulate submission delay
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        notify('Your issue has been reported successfully!', 'success');
        
        // Reset form after successful submission
        form.reset();
        
        // Clear file previews
        const filePreview = document.querySelector('.file-preview');
        if (filePreview) filePreview.innerHTML = '';
        
        // If we're on the report-issue page, refresh the list
        if (window.location.href.includes('report-issue.html')) {
          displayUserIssues();
        }
      }, 1500);
    } else {
      notify('Your issue has been reported successfully!', 'success');
      
      // Reset form after successful submission
      form.reset();
      
      // Clear file previews
      const filePreview = document.querySelector('.file-preview');
      if (filePreview) filePreview.innerHTML = '';
    }
  }
};

// Setup storage event listener for real-time content sync
function setupStorageListener() {
  window.addEventListener('storage', function(e) {
    // Handle different types of content updates
    switch (e.key) {
      case 'eventItems':
        if (window.location.href.includes('events.html')) {
          refreshEventsDisplay();
        }
        break;
      case 'budgetItems':
        if (window.location.href.includes('budget.html')) {
          refreshBudgetDisplay();
        }
        break;
      case 'resourceItems':
        if (window.location.href.includes('resources.html')) {
          refreshResourcesDisplay();
        }
        break;
      case 'historyItems':
        if (window.location.href.includes('history.html')) {
          refreshHistoryDisplay();
        }
        break;
      case 'galleryItems':
        if (window.location.href.includes('gallery.html')) {
          refreshGalleryDisplay();
        }
        break;
      case 'userIssues':
      case 'pendingIssues':
        if (window.location.href.includes('report-issue.html') ||
            window.location.href.includes('public-dashboard.html')) {
          refreshUserIssuesDisplay();
        }
        break;
      case 'isLoggedIn':
        // Update login UI and report issue functionality
        updateLoginStatusUI();
        updateReportIssueLinkBehavior();
        break;
    }
  });
}

// Helper functions for refreshing content displays
function refreshEventsDisplay() {
  // Implementation would depend on page structure
  notify('Events have been updated', 'info');
  // Specific implementation would reload events from localStorage
}

function refreshBudgetDisplay() {
  // Implementation would depend on page structure
  notify('Budget information has been updated', 'info');
  // Specific implementation would reload budget data from localStorage
}

function refreshResourcesDisplay() {
  // Implementation would depend on page structure
  notify('Resources have been updated', 'info');
  // Specific implementation would reload resources from localStorage
}

function refreshHistoryDisplay() {
  // Implementation would depend on page structure
  notify('Historical records have been updated', 'info');
  // Specific implementation would reload history from localStorage
}

function refreshGalleryDisplay() {
  // Implementation would depend on page structure
  notify('Gallery has been updated', 'info');
  // Specific implementation would reload gallery from localStorage
}

function refreshUserIssuesDisplay() {
  // Implementation would depend on page structure
  notify('Issue status has been updated', 'info');
  // Specific implementation would reload user issues from localStorage
}

// Make the notification system available globally
window.notify = notify;

// Optional: Add basic offline support notification
window.addEventListener('online', () => notify('You are back online!', 'success'));
window.addEventListener('offline', () => notify('You are offline. Some features may be unavailable.', 'warning'));

// Add CSS for button animations and error states
document.addEventListener('DOMContentLoaded', () => {
  if (!document.getElementById('animation-styles')) {
    const style = document.createElement('style');
    style.id = 'animation-styles';
    style.textContent = `
      .shake-error {
        animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
      }
      
      @keyframes shake {
        10%, 90% { transform: translateX(-1px); }
        20%, 80% { transform: translateX(2px); }
        30%, 50%, 70% { transform: translateX(-4px); }
        40%, 60% { transform: translateX(4px); }
      }
    `;
    document.head.appendChild(style);
  }
});
