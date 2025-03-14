
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
      }
    });
  }
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
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  const closeBtn = document.createElement('span');
  closeBtn.className = 'notification-close';
  closeBtn.innerHTML = '&times;';
  closeBtn.addEventListener('click', () => {
    notification.remove();
  });
  
  notification.appendChild(closeBtn);
  document.body.appendChild(notification);
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    notification.classList.add('fadeOut');
    setTimeout(() => notification.remove(), 500);
  }, 5000);
  
  return notification;
};

// Add this CSS for notifications to styles.css
// .notification {
//   position: fixed;
//   bottom: 20px;
//   right: 20px;
//   padding: 15px 20px;
//   border-radius: var(--border-radius);
//   background-color: var(--white);
//   box-shadow: 0 4px 12px rgba(0,0,0,0.15);
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   z-index: 1000;
//   min-width: 250px;
//   max-width: 400px;
//   animation: slideIn 0.3s ease-out forwards;
// }
// .notification.info { border-left: 4px solid var(--sky); }
// .notification.success { border-left: 4px solid var(--leaf); }
// .notification.warning { border-left: 4px solid var(--mustard); }
// .notification.error { border-left: 4px solid var(--terracotta); }
// .notification-close {
//   cursor: pointer;
//   margin-left: 10px;
//   font-size: 20px;
// }
// .notification.fadeOut {
//   animation: fadeOut 0.5s ease-out forwards;
// }
// @keyframes slideIn {
//   from { transform: translateX(100%); opacity: 0; }
//   to { transform: translateX(0); opacity: 1; }
// }
// @keyframes fadeOut {
//   from { opacity: 1; }
//   to { opacity: 0; }
// }

// Example usage:
// notify('Your issue has been reported successfully!', 'success');
// notify('Please fill all required fields.', 'warning');
// notify('Error saving your data. Please try again.', 'error');
// notify('Loading your profile...', 'info');

// Placeholder for the report issue form submission
const handleReportIssueSubmit = (event) => {
  if (event) event.preventDefault();
  
  // Get form data, validate, etc.
  // This would be replaced with actual form handling logic
  
  notify('Your issue has been reported successfully!', 'success');
  
  // In a real application, you'd submit to a server, etc.
  console.log('Issue reported');
};

// Optional: Add basic offline support notification
window.addEventListener('online', () => notify('You are back online!', 'success'));
window.addEventListener('offline', () => notify('You are offline. Some features may be unavailable.', 'warning'));
