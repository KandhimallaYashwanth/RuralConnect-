
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
});

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
  
  if (isValid) {
    // Add loading state to submit button
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.classList.add('loading');
      
      // Simulate submission delay
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        notify('Your issue has been reported successfully!', 'success');
        
        // Reset form after successful submission
        if (form) form.reset();
        
        // Clear file previews
        const filePreview = document.querySelector('.file-preview');
        if (filePreview) filePreview.innerHTML = '';
      }, 1500);
    } else {
      notify('Your issue has been reported successfully!', 'success');
      
      // Reset form after successful submission
      if (form) form.reset();
      
      // Clear file previews
      const filePreview = document.querySelector('.file-preview');
      if (filePreview) filePreview.innerHTML = '';
    }
  }
};

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
