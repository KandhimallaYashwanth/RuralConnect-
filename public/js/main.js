
// Mobile menu toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');

// Initialize auth state from localStorage
let isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
let currentUser = null;
try {
  const userJson = localStorage.getItem('currentUser');
  if (userJson) {
    currentUser = JSON.parse(userJson);
  }
} catch (e) {
  console.error('Error parsing user data', e);
}

// Update UI based on login state
const updateAuthUI = () => {
  // Update login buttons
  const loginBtns = document.querySelectorAll('.login-btn');
  loginBtns.forEach(btn => {
    btn.textContent = isLoggedIn ? 'Logout' : 'Login';
  });
  
  // Show/hide user-specific elements
  document.querySelectorAll('.authenticated-only').forEach(el => {
    el.style.display = isLoggedIn ? 'block' : 'none';
  });
  
  document.querySelectorAll('.unauthenticated-only').forEach(el => {
    el.style.display = isLoggedIn ? 'none' : 'block';
  });
};

// Handle login/logout
const handleAuth = () => {
  if (isLoggedIn) {
    // Logout
    isLoggedIn = false;
    currentUser = null;
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    notify('You have been logged out.', 'info');
  } else {
    // Login (simplified for demo)
    isLoggedIn = true;
    currentUser = {
      id: 'user123',
      name: 'Demo User',
      email: 'user@example.com'
    };
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    notify('Login successful! Welcome back.', 'success');
    
    // Check if we need to redirect after login
    const redirectPath = localStorage.getItem('redirectAfterLogin');
    if (redirectPath) {
      localStorage.removeItem('redirectAfterLogin');
      
      // If there's a redirect to the report issue page
      if (redirectPath === '/report-issue' || redirectPath === 'report-issue.html') {
        window.location.href = 'report-issue.html';
      }
    }
  }
  
  updateAuthUI();
};

if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    
    // Animate hamburger
    const spans = hamburger.querySelectorAll('span');
    spans.forEach(span => span.classList.toggle('active'));
  });
}

// Attach login/logout handler to all login buttons
document.addEventListener('DOMContentLoaded', () => {
  // Update UI based on current login state
  updateAuthUI();
  
  // Attach event listener to login buttons
  const loginBtns = document.querySelectorAll('.login-btn');
  loginBtns.forEach(btn => {
    btn.addEventListener('click', handleAuth);
  });
  
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
  
  // Special handling for report issue button
  const reportIssueButtons = document.querySelectorAll('a[href="report-issue.html"], .report-issue-btn');
  reportIssueButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      if (!isLoggedIn) {
        e.preventDefault();
        notify('Please login to report an issue', 'warning');
        localStorage.setItem('redirectAfterLogin', 'report-issue.html');
        return false;
      }
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
  const reportForm = document.getElementById('issueForm');
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
  
  // Issue tracking functionality
  initializeIssueTracking();
});

// Function to manage issues in localStorage
const getStoredIssues = () => {
  try {
    const issuesJson = localStorage.getItem('issues');
    return issuesJson ? JSON.parse(issuesJson) : [];
  } catch (e) {
    console.error('Error loading issues', e);
    return [];
  }
};

const saveIssuesToStorage = (issues) => {
  localStorage.setItem('issues', JSON.stringify(issues));
};

const createNewIssue = (data) => {
  const issueId = `ISSUE-${Date.now().toString(36)}`;
  const newIssue = {
    id: issueId,
    type: data.issueType,
    description: data.description,
    location: data.location,
    ward: data.ward,
    status: 'submitted',
    dateSubmitted: new Date().toISOString(),
    images: data.fileUrls || [],
    updates: [
      {
        id: `UPDATE-${Date.now().toString(36)}`,
        date: new Date().toISOString(),
        status: 'submitted',
        comment: 'Issue has been submitted successfully.',
        by: 'System'
      }
    ]
  };
  
  return newIssue;
};

// Initialize issue tracking components
const initializeIssueTracking = () => {
  // Show issue tracking UI if on the tracking page
  const trackingContainer = document.getElementById('issue-tracking-container');
  if (trackingContainer) {
    renderIssuesList();
  }
  
  // If on report-issue.html page with success parameter, show success message
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('success') && urlParams.get('success') === 'true') {
    const issueId = urlParams.get('id');
    if (issueId) {
      showIssueSuccess(issueId);
    }
  }
};

// Render issues list
const renderIssuesList = () => {
  const trackingContainer = document.getElementById('issue-tracking-container');
  if (!trackingContainer) return;
  
  const issues = getStoredIssues();
  
  if (issues.length === 0) {
    trackingContainer.innerHTML = `
      <div class="rural-card bg-white p-8 text-center">
        <div class="icon-circle mx-auto mb-4">
          <i class="fas fa-exclamation-circle"></i>
        </div>
        <h2 class="text-xl font-bold mb-2">No Issues Reported Yet</h2>
        <p class="mb-6">You haven't reported any issues yet. When you do, they'll appear here.</p>
        <a href="report-issue.html" class="btn btn-primary">Report an Issue</a>
      </div>
    `;
    return;
  }
  
  // Create issues list HTML
  let issuesHtml = `<div class="issue-list">`;
  
  issues.forEach(issue => {
    issuesHtml += `
      <div class="issue-card" data-issue-id="${issue.id}">
        <div class="issue-header">
          <div>
            <h3>${issue.type}</h3>
            <p>Reference ID: #${issue.id}</p>
          </div>
          <div class="issue-status ${issue.status}">${issue.status}</div>
        </div>
        <p class="issue-description">${issue.description}</p>
        <div class="issue-details">
          <div><i class="fas fa-map-marker-alt"></i> ${issue.location}, Ward ${issue.ward}</div>
          <div><i class="fas fa-clock"></i> ${new Date(issue.dateSubmitted).toLocaleString()}</div>
        </div>
        <div class="issue-actions">
          <button class="btn btn-primary view-details" data-issue-id="${issue.id}">View Details <i class="fas fa-chevron-right"></i></button>
        </div>
      </div>
    `;
  });
  
  issuesHtml += `</div>`;
  trackingContainer.innerHTML = issuesHtml;
  
  // Add click handlers to view details buttons
  document.querySelectorAll('.view-details').forEach(button => {
    button.addEventListener('click', function() {
      const issueId = this.getAttribute('data-issue-id');
      showIssueDetails(issueId);
    });
  });
};

// Show issue details
const showIssueDetails = (issueId) => {
  const issues = getStoredIssues();
  const issue = issues.find(i => i.id === issueId);
  
  if (!issue) {
    notify('Issue not found', 'error');
    return;
  }
  
  const trackingContainer = document.getElementById('issue-tracking-container');
  if (!trackingContainer) return;
  
  let detailsHtml = `
    <div class="issue-details-view">
      <button class="back-to-list"><i class="fas fa-arrow-left"></i> Back to All Issues</button>
      
      <div class="rural-card bg-white">
        <div class="issue-details-header">
          <div>
            <h2>${issue.type}</h2>
            <p>Reference ID: #${issue.id}</p>
          </div>
          <div class="issue-status ${issue.status}">${issue.status}</div>
        </div>
        
        <div class="issue-details-section">
          <h3>Description</h3>
          <p>${issue.description}</p>
        </div>
        
        <div class="issue-details-grid">
          <div>
            <h3>Location</h3>
            <p><i class="fas fa-map-marker-alt"></i> ${issue.location}, Ward ${issue.ward}</p>
          </div>
          <div>
            <h3>Date Submitted</h3>
            <p><i class="fas fa-clock"></i> ${new Date(issue.dateSubmitted).toLocaleString()}</p>
          </div>
        </div>
  `;
  
  // Add images if available
  if (issue.images && issue.images.length > 0) {
    detailsHtml += `
      <div class="issue-details-section">
        <h3>Uploaded Images</h3>
        <div class="issue-images">
    `;
    
    issue.images.forEach(image => {
      detailsHtml += `<div class="issue-image"><img src="${image}" alt="Issue image"></div>`;
    });
    
    detailsHtml += `
        </div>
      </div>
    `;
  }
  
  detailsHtml += `</div>`; // Close the first card
  
  // Add timeline
  detailsHtml += `
    <div class="rural-card bg-white">
      <h3><i class="fas fa-history"></i> Issue Timeline</h3>
      <div class="issue-timeline">
  `;
  
  issue.updates.forEach(update => {
    detailsHtml += `
      <div class="timeline-item">
        <div class="timeline-marker"></div>
        <div class="timeline-content">
          <div class="timeline-header">
            <h4>${update.status}</h4>
            <span>${new Date(update.date).toLocaleString()}</span>
          </div>
          <p>${update.comment}</p>
          <div class="timeline-by">by ${update.by}</div>
        </div>
      </div>
    `;
  });
  
  detailsHtml += `
      </div>
    </div>
  `;
  
  // Add comment form
  detailsHtml += `
    <div class="rural-card bg-white">
      <h3>Add a Comment</h3>
      <form id="comment-form" data-issue-id="${issue.id}">
        <textarea placeholder="Add your comment or question about this issue..." required></textarea>
        <button type="submit" class="btn btn-primary">Add Comment</button>
      </form>
    </div>
  `;
  
  // Close the details view container
  detailsHtml += `</div>`;
  
  // Update the container with the details view
  trackingContainer.innerHTML = detailsHtml;
  
  // Add event listeners for back button and comment form
  document.querySelector('.back-to-list').addEventListener('click', renderIssuesList);
  
  const commentForm = document.getElementById('comment-form');
  if (commentForm) {
    commentForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const issueId = this.getAttribute('data-issue-id');
      const commentText = this.querySelector('textarea').value.trim();
      
      if (!commentText) return;
      
      addIssueComment(issueId, commentText);
      // Re-render details view to show the new comment
      showIssueDetails(issueId);
    });
  }
};

// Add comment to an issue
const addIssueComment = (issueId, comment) => {
  const issues = getStoredIssues();
  const issueIndex = issues.findIndex(i => i.id === issueId);
  
  if (issueIndex === -1) {
    notify('Issue not found', 'error');
    return;
  }
  
  // Add the comment as an update
  issues[issueIndex].updates.push({
    id: `UPDATE-${Date.now().toString(36)}`,
    date: new Date().toISOString(),
    status: issues[issueIndex].status,
    comment: comment,
    by: currentUser ? currentUser.name : 'You'
  });
  
  // Save updated issues
  saveIssuesToStorage(issues);
  notify('Comment added successfully', 'success');
};

// Show issue success message
const showIssueSuccess = (issueId) => {
  const issues = getStoredIssues();
  const issue = issues.find(i => i.id === issueId);
  
  if (!issue) return;
  
  const formContainer = document.querySelector('.report-form');
  if (!formContainer) return;
  
  // Replace form with success message
  formContainer.innerHTML = `
    <div class="issue-success">
      <div class="success-header">
        <div class="success-icon"><i class="fas fa-check"></i></div>
        <div>
          <h2>Issue Submitted Successfully!</h2>
          <p>Your issue has been registered with the following details:</p>
        </div>
      </div>
      
      <div class="issue-summary">
        <div class="issue-summary-header">
          <div>
            <h3>${issue.type}</h3>
            <p>Reference ID: #${issue.id}</p>
          </div>
          <div class="issue-status ${issue.status}">${issue.status}</div>
        </div>
        <p>${issue.description}</p>
        <div class="issue-details">
          <div><i class="fas fa-map-marker-alt"></i> ${issue.location}, Ward ${issue.ward}</div>
          <div><i class="fas fa-clock"></i> ${new Date(issue.dateSubmitted).toLocaleString()}</div>
        </div>
      </div>
      
      <div class="next-steps">
        <h3>What happens next?</h3>
        <ol>
          <li>Your issue has been submitted to the local authorities</li>
          <li>It will be reviewed by the Ward Member within 48 hours</li>
          <li>You'll receive updates as your issue progresses</li>
          <li>You can track the status of your issue any time</li>
        </ol>
      </div>
      
      <div class="success-actions">
        <a href="issue-tracking.html" class="btn btn-primary">Track Your Issues <i class="fas fa-chevron-right"></i></a>
        <button id="report-another" class="btn btn-outline">Report Another Issue</button>
      </div>
    </div>
  `;
  
  // Add event listener to "Report Another Issue" button
  const reportAnotherBtn = document.getElementById('report-another');
  if (reportAnotherBtn) {
    reportAnotherBtn.addEventListener('click', () => {
      window.location.href = 'report-issue.html';
    });
  }
};

// Function to show notifications
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

// Function to handle report issue form submission
const handleReportIssueSubmit = (event) => {
  if (event) event.preventDefault();
  
  // Check if user is logged in
  if (!isLoggedIn) {
    notify('Please login to report an issue', 'warning');
    localStorage.setItem('redirectAfterLogin', 'report-issue.html');
    return;
  }
  
  // Get form data
  const form = document.getElementById('issueForm');
  if (!form) return;
  
  const issueType = document.getElementById('issueType').value;
  const description = document.getElementById('description').value;
  const ward = document.getElementById('ward').value;
  const location = document.getElementById('location').value;
  
  // Basic validation
  if (!issueType || !description || !ward || !location) {
    notify('Please fill all required fields', 'warning');
    return;
  }
  
  // Create file URLs (in a real app, this would upload to a server)
  const fileInput = document.getElementById('file-input');
  const files = fileInput ? fileInput.files : [];
  const fileUrls = [];
  
  if (files.length > 0) {
    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        fileUrls.push(URL.createObjectURL(file));
      }
    });
  }
  
  // Create new issue
  const issueData = {
    issueType,
    description,
    ward,
    location,
    fileUrls
  };
  
  const newIssue = createNewIssue(issueData);
  
  // Save to localStorage
  const existingIssues = getStoredIssues();
  existingIssues.push(newIssue);
  saveIssuesToStorage(existingIssues);
  
  // Show success notification
  notify('Issue reported successfully! You can now track its status.', 'success');
  
  // Redirect to success page or show success UI
  window.location.href = `report-issue.html?success=true&id=${newIssue.id}`;
};

// Fixed the broken anchor tag selector issue
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('a[href]').forEach(anchor => {
    if (anchor.getAttribute('href') && anchor.getAttribute('href').startsWith('#')) {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href').substring(1);
        const target = document.getElementById(targetId);
        
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth'
          });
        }
      });
    }
  });
});

// Make the notification system available globally
window.notify = notify;
window.handleReportIssueSubmit = handleReportIssueSubmit;

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
      
      /* Issue tracking styles */
      .issue-list {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      
      .issue-card {
        background: white;
        border-radius: var(--border-radius, 0.5rem);
        padding: 1.5rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        transition: all 0.3s ease;
      }
      
      .issue-card:hover {
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      }
      
      .issue-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1rem;
      }
      
      .issue-status {
        padding: 0.25rem 0.75rem;
        border-radius: 2rem;
        font-size: 0.875rem;
        font-weight: 500;
      }
      
      .issue-status.submitted {
        background-color: var(--sky-light, #e1f5fe);
        color: var(--sky, #0288d1);
      }
      
      .issue-status.in-review {
        background-color: #e8eaf6;
        color: #3949ab;
      }
      
      .issue-status.in-progress {
        background-color: var(--mustard-light, #fff8e1);
        color: var(--mustard, #ffa000);
      }
      
      .issue-status.resolved {
        background-color: var(--leaf-light, #e8f5e9);
        color: var(--leaf, #4D724D);
      }
      
      .issue-status.closed {
        background-color: #eceff1;
        color: #546e7a;
      }
      
      .issue-description {
        margin-bottom: 1rem;
        color: var(--gray-700, #4a5568);
      }
      
      .issue-details {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
        color: var(--gray-500, #718096);
        font-size: 0.875rem;
        margin-bottom: 1.5rem;
      }
      
      .issue-actions {
        display: flex;
        justify-content: flex-end;
      }
      
      /* Issue Details View */
      .issue-details-view {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }
      
      .back-to-list {
        color: var(--terracotta, #CD5D45);
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 1rem;
        cursor: pointer;
        background: none;
        border: none;
        padding: 0;
        font-size: 1rem;
      }
      
      .back-to-list:hover {
        text-decoration: underline;
      }
      
      .issue-details-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 2rem;
        padding-bottom: 1rem;
        border-bottom: 1px solid var(--gray-200, #e2e8f0);
      }
      
      .issue-details-section {
        margin-bottom: 2rem;
      }
      
      .issue-details-section h3 {
        font-size: 1.125rem;
        font-weight: 500;
        color: var(--gray-700, #4a5568);
        margin-bottom: 0.75rem;
      }
      
      .issue-details-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        margin-bottom: 2rem;
      }
      
      @media (max-width: 640px) {
        .issue-details-grid {
          grid-template-columns: 1fr;
          gap: 1rem;
        }
      }
      
      .issue-images {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
      }
      
      .issue-image {
        width: 6rem;
        height: 6rem;
        border-radius: 0.5rem;
        overflow: hidden;
      }
      
      .issue-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      
      /* Timeline */
      .issue-timeline {
        position: relative;
        padding-left: 2rem;
      }
      
      .timeline-item {
        position: relative;
        padding-bottom: 2rem;
      }
      
      .timeline-item:last-child {
        padding-bottom: 0;
      }
      
      .timeline-marker {
        position: absolute;
        left: -2rem;
        top: 0;
        width: 1rem;
        height: 1rem;
        border-radius: 50%;
        background-color: var(--terracotta, #CD5D45);
        z-index: 2;
      }
      
      .timeline-item:after {
        content: '';
        position: absolute;
        left: -1.5rem;
        top: 0.5rem;
        bottom: 0;
        width: 2px;
        background-color: var(--gray-200, #e2e8f0);
        z-index: 1;
      }
      
      .timeline-item:last-child:after {
        display: none;
      }
      
      .timeline-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
      }
      
      .timeline-header h4 {
        font-weight: 600;
        color: var(--gray-800, #2d3748);
      }
      
      .timeline-header span {
        font-size: 0.875rem;
        color: var(--gray-500, #718096);
      }
      
      .timeline-by {
        font-size: 0.875rem;
        margin-top: 0.5rem;
        color: var(--gray-500, #718096);
      }
      
      /* Comment form */
      #comment-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      
      #comment-form textarea {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid var(--gray-300, #d1d5db);
        border-radius: 0.5rem;
        min-height: 6rem;
        resize: vertical;
      }
      
      #comment-form button {
        align-self: flex-end;
      }
      
      /* Success View */
      .issue-success {
        background: white;
        border-radius: var(--border-radius, 0.5rem);
        padding: 2rem;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
      }
      
      .success-header {
        display: flex;
        align-items: center;
        gap: 1rem;
        margin-bottom: 2rem;
      }
      
      .success-icon {
        width: 3rem;
        height: 3rem;
        background-color: var(--leaf-light, #e8f5e9);
        color: var(--leaf, #4D724D);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
      }
      
      .success-header h2 {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--gray-900, #1a202c);
        margin-bottom: 0.25rem;
      }
      
      .issue-summary {
        padding: 1.5rem;
        border: 1px solid var(--gray-200, #e2e8f0);
        border-radius: 0.5rem;
        margin-bottom: 2rem;
      }
      
      .issue-summary-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 1rem;
      }
      
      .next-steps {
        background-color: var(--terracotta-light, #fdf2f0);
        padding: 1.5rem;
        border-radius: 0.5rem;
        margin-bottom: 2rem;
      }
      
      .next-steps h3 {
        font-weight: 600;
        margin-bottom: 1rem;
      }
      
      .next-steps ol {
        padding-left: 1.5rem;
        list-style-type: decimal;
      }
      
      .next-steps li {
        margin-bottom: 0.5rem;
      }
      
      .success-actions {
        display: flex;
        justify-content: center;
        gap: 1rem;
        flex-wrap: wrap;
      }
    `;
    document.head.appendChild(style);
  }
});
