
// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
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
  
  // Update login status UI on all pages
  updateLoginStatusUI();
  
  // Add ripple effect to buttons
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
  
  // Add hover effects to cards
  const cards = document.querySelectorAll('.rural-card, .feature-card, .event-card, .resource-card, .budget-card, .issue-card, .gallery-item');
  cards.forEach(card => {
    if (card) {
      card.addEventListener('mouseenter', function() {
        this.classList.add('card-hover');
      });
      
      card.addEventListener('mouseleave', function() {
        this.classList.remove('card-hover');
      });
    }
  });
  
  // Enhanced button interactivity
  const actionButtons = document.querySelectorAll('.btn-primary, .btn-accent, .btn-secondary, .btn-outline-accent, .btn-outline');
  actionButtons.forEach(button => {
    if (!button.hasAttribute('data-has-handler')) {
      button.setAttribute('data-has-handler', 'true');
      
      // Add temporary active state visual feedback
      button.addEventListener('mousedown', function() {
        this.classList.add('btn-active');
      });
      
      button.addEventListener('mouseup', function() {
        this.classList.remove('btn-active');
      });
      
      button.addEventListener('mouseleave', function() {
        this.classList.remove('btn-active');
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
  
  // File upload handling (if on a page with file uploads)
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
  
  // Listen for storage events to update UI in real-time
  window.addEventListener('storage', function(e) {
    if (e.key === 'isLoggedIn' || e.key === 'userType' || e.key === 'authorityRole') {
      // Update login UI when authentication state changes
      updateLoginStatusUI();
    }
  });
  
  // Update report issue link behavior based on login status
  updateReportIssueLinkBehavior();
});

// Function to update login status UI
function updateLoginStatusUI() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const loginStatusBtn = document.getElementById('login-status-btn');
  
  if (loginStatusBtn) {
    if (isLoggedIn) {
      loginStatusBtn.textContent = 'Logout';
      loginStatusBtn.classList.remove('login-btn');
      loginStatusBtn.classList.add('logout-btn');
      
      // Remove any existing event listeners and add new one
      const newBtn = loginStatusBtn.cloneNode(true);
      if (loginStatusBtn.parentNode) {
        loginStatusBtn.parentNode.replaceChild(newBtn, loginStatusBtn);
      }
      
      newBtn.addEventListener('click', () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userType');
        localStorage.removeItem('authorityRole');
        notify('Logged out successfully', 'success');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      });
    } else {
      loginStatusBtn.textContent = 'Login';
      loginStatusBtn.classList.add('login-btn');
      loginStatusBtn.classList.remove('logout-btn');
      
      // Remove any existing event listeners and add new one
      const newBtn = loginStatusBtn.cloneNode(true);
      if (loginStatusBtn.parentNode) {
        loginStatusBtn.parentNode.replaceChild(newBtn, loginStatusBtn);
      }
      
      newBtn.addEventListener('click', () => {
        sessionStorage.setItem('redirectFrom', window.location.href);
        window.location.href = 'login.html';
      });
    }
  }
}

// Function to update report issue link behavior based on login status
function updateReportIssueLinkBehavior() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const reportIssueLinks = document.querySelectorAll('.report-issue-link');
  
  reportIssueLinks.forEach(link => {
    // We'll still let users visit the page even if not logged in,
    // as we now show the login required message on the report issue page
    link.classList.remove('disabled-link');
  });
}

// Create a basic popup notification system
function notify(message, type = 'info') {
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
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (document.body.contains(notification)) {
      notification.classList.add('fadeOut');
      setTimeout(() => notification.remove(), 500);
    }
  }, 5000);
  
  return notification;
}

// Handle storage events from authority dashboard
window.addEventListener('storage', (event) => {
  // Check if any data has been updated
  if (event.key === 'events' || event.key === 'budgetItems' || event.key === 'historyItems' || event.key === 'galleryItems') {
    // Show notification of new content
    const messages = {
      'events': 'New events have been added by the village authority.',
      'budgetItems': 'Budget information has been updated by the village authority.',
      'historyItems': 'Village history has been updated with new information.',
      'galleryItems': 'New images have been added to the village gallery.'
    };
    
    const message = messages[event.key] || 'New content has been added by the village authority.';
    notify(message, 'info');
    
    // Reload the current page if it matches the updated content type
    const currentPage = window.location.pathname.split('/').pop();
    
    if (
      (event.key === 'events' && currentPage === 'events.html') ||
      (event.key === 'budgetItems' && currentPage === 'budget.html') ||
      (event.key === 'historyItems' && currentPage === 'history.html') ||
      (event.key === 'galleryItems' && currentPage === 'gallery.html')
    ) {
      // Wait a moment before reloading to ensure the notification is seen
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  }
});
