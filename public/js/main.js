
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

// Report issue form (for when you create the report-issue.html page)
document.addEventListener('DOMContentLoaded', () => {
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
  
  // Handle form submission for report issue
  const reportForm = document.getElementById('report-issue-form');
  if (reportForm) {
    reportForm.addEventListener('submit', function(e) {
      e.preventDefault();
      handleReportIssueSubmit();
    });
  }
  
  // Add click handlers to buttons in HTML version
  const resourceButtons = document.querySelectorAll('.download-btn');
  resourceButtons.forEach(button => {
    button.addEventListener('click', function() {
      const resourceTitle = this.closest('.resource-card').querySelector('h3').textContent;
      notify(`Downloading resource: ${resourceTitle}`, 'info');
    });
  });
  
  const eventDetailButtons = document.querySelectorAll('.event-card .btn-outline-accent');
  eventDetailButtons.forEach(button => {
    button.addEventListener('click', function() {
      const eventTitle = this.closest('.event-card').querySelector('h3').textContent;
      notify(`Viewing details for event: ${eventTitle}`, 'info');
    });
  });
  
  const issueActionButtons = document.querySelectorAll('.issue-actions .btn');
  issueActionButtons.forEach(button => {
    button.addEventListener('click', function() {
      const text = this.textContent.trim();
      notify(`${text} for issue #RCI-2023-06-15`, 'info');
    });
  });
  
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
});

// Animations on scroll
document.addEventListener('DOMContentLoaded', () => {
  const animateElements = document.querySelectorAll('.feature-card, .event-card, .resource-card, .feature-box');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, { threshold: 0.1 });
  
  animateElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    observer.observe(element);
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

// Placeholder for the report issue form submission
const handleReportIssueSubmit = (event) => {
  if (event) event.preventDefault();
  
  // Get form data, validate, etc.
  const form = document.getElementById('report-issue-form');
  let isValid = true;
  
  // Basic validation
  if (form) {
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
      if (!field.value.trim()) {
        isValid = false;
        field.classList.add('error');
        notify(`Please fill in the ${field.name || 'required'} field`, 'warning');
      } else {
        field.classList.remove('error');
      }
    });
  }
  
  if (isValid) {
    notify('Your issue has been reported successfully!', 'success');
    
    // Reset form after successful submission
    if (form) form.reset();
    
    // Clear file previews
    const filePreview = document.querySelector('.file-preview');
    if (filePreview) filePreview.innerHTML = '';
  }
};

// Make the notification system available globally
window.notify = notify;

// Optional: Add basic offline support notification
window.addEventListener('online', () => notify('You are back online!', 'success'));
window.addEventListener('offline', () => notify('You are offline. Some features may be unavailable.', 'warning'));

// Add event listeners to all buttons with class btn-primary or btn-accent
document.addEventListener('DOMContentLoaded', () => {
  const actionButtons = document.querySelectorAll('.btn-primary:not([data-has-handler]), .btn-accent:not([data-has-handler])');
  actionButtons.forEach(button => {
    button.setAttribute('data-has-handler', 'true');
    button.addEventListener('click', function() {
      const buttonText = this.textContent.trim();
      notify(`Action: ${buttonText}`, 'info');
    });
  });
});
