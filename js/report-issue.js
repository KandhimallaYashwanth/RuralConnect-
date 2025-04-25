// Report Issue page functionality
document.addEventListener('DOMContentLoaded', () => {
  const loginRequiredMessage = document.getElementById('loginRequiredMessage');
  const reportFormContainer = document.getElementById('reportFormContainer');
  const reportForm = document.getElementById('report-issue-form');
  const fileUpload = document.querySelector('.file-upload');
  const fileInput = document.getElementById('file-input');
  const filePreview = document.querySelector('.file-preview');
  const issueCards = document.getElementById('issueCards');
  const modal = document.getElementById('issueTrackingModal');
  const modalClose = document.querySelector('.modal-close');
  const modalIssueTitle = document.getElementById('modalIssueTitle');
  const issueTimeline = document.getElementById('issueTimeline');
  
  // Check login status
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const loginStatusBtn = document.getElementById('login-status-btn');
  
  // Update login/logout button
  updateLoginStatusUI();
  
  // Update form visibility based on login status
  if (isLoggedIn) {
    loginRequiredMessage.style.display = 'none';
    reportFormContainer.style.display = 'block';
  } else {
    loginRequiredMessage.style.display = 'block';
    reportFormContainer.style.display = 'none';
  }
  
  // File upload handling
  if (fileUpload && fileInput) {
    fileUpload.addEventListener('click', () => {
      fileInput.click();
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0 && filePreview) {
        filePreview.innerHTML = ''; // Clear previous previews

        Array.from(fileInput.files).forEach(file => {
          if (file.type.startsWith('image/')) {
            const thumbnail = document.createElement('div');
            thumbnail.className = 'file-thumbnail';

            // Create image element for preview
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            thumbnail.appendChild(img);

            // Add remove button
            const removeBtn = document.createElement('div');
            removeBtn.className = 'file-remove';
            removeBtn.innerHTML = '&times;';
            removeBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              thumbnail.remove();
              // Note: We can't actually remove items from a FileList,
              // this just removes the preview
            });

            thumbnail.appendChild(removeBtn);
            filePreview.appendChild(thumbnail);
          }
        });
      }
    });
  }

  // Handle form submission
  if (reportForm) {
    reportForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Check if user is logged in - redundant check for security
      if (!isLoggedIn) {
        notify('Please log in to report an issue', 'warning');
        return;
      }

      // Get form data
      const title = document.getElementById('issue-title').value;
      const category = document.getElementById('issue-category').value;
      const location = document.getElementById('issue-location').value;
      const description = document.getElementById('issue-description').value;

      // Validate form
      if (!title || !category || !location || !description) {
        notify('Please fill in all fields', 'error');
        return;
      }

      // Create new issue object
      const newIssue = {
        id: `#${category.substring(0, 3).toUpperCase()}-${Date.now()}`,
        title: title,
        category: category,
        location: location,
        description: description,
        status: 'reported',
        reportedBy: localStorage.getItem('userPhone') || 'Anonymous',
        reportedAt: new Date().toISOString(),
        timeline: [
          {
            status: 'reported',
            date: new Date().toISOString(),
            message: 'Issue reported successfully'
          }
        ]
      };

      // Save to localStorage
      const userIssues = JSON.parse(localStorage.getItem('userIssues') || '[]');
      userIssues.push(newIssue);
      localStorage.setItem('userIssues', JSON.stringify(userIssues));

      // Add to pending issues for authorities
      const pendingIssues = JSON.parse(localStorage.getItem('pendingIssues') || '[]');
      pendingIssues.push(newIssue);
      localStorage.setItem('pendingIssues', JSON.stringify(pendingIssues));

      // Show success message
      notify('Issue reported successfully! Authorities have been notified.', 'success');

      // Reset form
      reportForm.reset();
      if (filePreview) {
        filePreview.innerHTML = '';
      }
      
      // Refresh the issues list
      loadIssues();

      // Wait a moment before scrolling to the new issue
      setTimeout(() => {
        const newIssueElement = document.getElementById(newIssue.id.replace('#', ''));
        if (newIssueElement) {
          newIssueElement.scrollIntoView({ behavior: 'smooth' });
          newIssueElement.classList.add('highlight');
          setTimeout(() => newIssueElement.classList.remove('highlight'), 3000);
        }
      }, 500);
    });
  }
  
  // Function to load and display issues
  function loadIssues() {
    if (!issueCards) return;
    
    issueCards.innerHTML = '';
    
    // Get all issues - combine user issues and pending issues
    const userIssues = JSON.parse(localStorage.getItem('userIssues') || '[]');
    const pendingIssues = JSON.parse(localStorage.getItem('pendingIssues') || '[]');
    const resolvedIssues = JSON.parse(localStorage.getItem('resolvedIssues') || '[]');
    
    // Combine all issues and remove duplicates based on id
    const allIssues = [...userIssues, ...pendingIssues, ...resolvedIssues];
    const uniqueIssues = Array.from(new Map(allIssues.map(issue => [issue.id, issue])).values());
    
    if (uniqueIssues.length === 0) {
      issueCards.innerHTML = '<p class="no-issues-message">No issues have been reported yet.</p>';
      return;
    }
    
    // Sort issues by date (newest first)
    uniqueIssues.sort((a, b) => new Date(b.reportedAt) - new Date(a.reportedAt));
    
    // Create issue cards
    uniqueIssues.forEach(issue => {
      const card = document.createElement('div');
      card.className = 'issue-card';
      card.id = issue.id.replace('#', '');
      
      // Format date
      const reportDate = new Date(issue.reportedAt);
      const formattedDate = reportDate.toLocaleDateString('en-US', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric' 
      });
      
      // Status class
      let statusClass = '';
      switch(issue.status) {
        case 'reported':
          statusClass = 'status-reported';
          break;
        case 'verified':
          statusClass = 'status-verified';
          break;
        case 'in-progress':
          statusClass = 'status-in-progress';
          break;
        case 'resolved':
          statusClass = 'status-resolved';
          break;
        default:
          statusClass = 'status-reported';
      }
      
      card.innerHTML = `
        <div class="issue-card-header">
          <h4>${issue.title}</h4>
          <span class="issue-status ${statusClass}">${issue.status}</span>
        </div>
        <div class="issue-card-body">
          <p>${issue.description.substring(0, 150)}${issue.description.length > 150 ? '...' : ''}</p>
          <div class="issue-card-details">
            <span><i class="fas fa-map-marker-alt"></i> ${issue.location}</span>
            <span><i class="fas fa-calendar"></i> ${formattedDate}</span>
          </div>
        </div>
        <div class="issue-card-footer">
          <button class="btn-outline-accent track-button" data-issue-id="${issue.id}">
            <i class="fas fa-route"></i> Track Issue
          </button>
        </div>
      `;
      
      issueCards.appendChild(card);
    });
    
    // Add event listeners to track buttons
    document.querySelectorAll('.track-button').forEach(button => {
      button.addEventListener('click', function() {
        const issueId = this.getAttribute('data-issue-id');
        showIssueTrackingModal(issueId);
      });
    });
  }
  
  // Function to show the issue tracking modal
  function showIssueTrackingModal(issueId) {
    // Find the issue by ID
    const userIssues = JSON.parse(localStorage.getItem('userIssues') || '[]');
    const pendingIssues = JSON.parse(localStorage.getItem('pendingIssues') || '[]');
    const resolvedIssues = JSON.parse(localStorage.getItem('resolvedIssues') || '[]');
    
    const allIssues = [...userIssues, ...pendingIssues, ...resolvedIssues];
    const issue = allIssues.find(issue => issue.id === issueId);
    
    if (!issue) {
      notify('Issue not found', 'error');
      return;
    }
    
    // Set modal title
    modalIssueTitle.textContent = `Issue Tracking: ${issue.title}`;
    
    // Clear previous timeline items
    issueTimeline.innerHTML = '';
    
    // Build timeline for the issue
    const timelineSteps = [
      { status: 'reported', label: 'Reported', icon: 'exclamation-circle' },
      { status: 'verified', label: 'Verified', icon: 'check-circle' },
      { status: 'in-progress', label: 'In Progress', icon: 'tools' },
      { status: 'resolved', label: 'Resolved', icon: 'flag-checkered' }
    ];
    
    // Get the current status index
    const currentStatusIndex = timelineSteps.findIndex(step => step.status === issue.status);
    
    // Create timeline items
    timelineSteps.forEach((step, index) => {
      const isCompleted = index <= currentStatusIndex;
      const isActive = index === currentStatusIndex;
      const isPending = index > currentStatusIndex;
      
      let statusClass = '';
      if (isCompleted && !isActive) statusClass = 'completed';
      if (isActive) statusClass = 'active';
      if (isPending) statusClass = 'pending';
      
      const timelineStep = document.createElement('div');
      timelineStep.className = `timeline-item ${statusClass}`;
      
      // Find the specific timeline entry for this step
      const timelineEntry = issue.timeline ? issue.timeline.find(t => t.status === step.status) : null;
      const stepDate = timelineEntry ? new Date(timelineEntry.date).toLocaleDateString('en-US', { 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) : '';
      
      timelineStep.innerHTML = `
        <div class="timeline-icon">
          <i class="fas fa-${step.icon}"></i>
        </div>
        <div class="timeline-content">
          <div class="timeline-header">
            <h4>${step.label}</h4>
            <span>${stepDate}</span>
          </div>
          <p>${timelineEntry ? timelineEntry.message : (isPending ? 'Pending' : '')}</p>
        </div>
      `;
      
      issueTimeline.appendChild(timelineStep);
    });
    
    // Show the modal
    modal.style.display = 'block';
  }
  
  // Close modal when clicking on the X
  if (modalClose) {
    modalClose.addEventListener('click', () => {
      modal.style.display = 'none';
    });
  }
  
  // Close modal when clicking outside of it
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
  
  // Load issues on page load
  loadIssues();
});

// Function to update login/logout button
function updateLoginStatusUI() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const loginStatusBtn = document.getElementById('login-status-btn');
  
  if (loginStatusBtn) {
    if (isLoggedIn) {
      loginStatusBtn.textContent = 'Logout';
      loginStatusBtn.classList.remove('login-btn');
      loginStatusBtn.classList.add('logout-btn');
      
      loginStatusBtn.onclick = function() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userType');
        localStorage.removeItem('authorityRole');
        notify('Logged out successfully', 'success');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      };
    } else {
      loginStatusBtn.textContent = 'Login';
      loginStatusBtn.classList.add('login-btn');
      loginStatusBtn.classList.remove('logout-btn');
      
      loginStatusBtn.onclick = function() {
        sessionStorage.setItem('redirectFrom', window.location.href);
        window.location.href = 'login.html';
      };
    }
  }
}

// Create a basic popup notification system if it doesn't exist
function notify(message, type = 'info') {
  // Check if the notification function exists in the main.js
  if (typeof window.notify === 'function') {
    return window.notify(message, type);
  }
  
  // Otherwise, create a simple notification here
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
