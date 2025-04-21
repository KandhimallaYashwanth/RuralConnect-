
// Report Issue page functionality
document.addEventListener('DOMContentLoaded', () => {
  const reportForm = document.getElementById('report-issue-form');
  const fileUpload = document.querySelector('.file-upload');
  const fileInput = document.getElementById('file-input');
  const filePreview = document.querySelector('.file-preview');

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

      // Check if user is logged in
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      if (!isLoggedIn) {
        notify('Please log in to report an issue', 'warning');
        
        // Store current page and redirect to login
        sessionStorage.setItem('redirectFrom', window.location.href);
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 1500);
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

      // Create new issue object with tracking workflow
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

      // Redirect to issue tracking page after a delay
      setTimeout(() => {
        window.location.href = 'issue-tracking.html';
      }, 2000);
    });
  }
  
  // Load user issues if on issue tracking page
  if (document.getElementById('issue-tracking-container')) {
    loadUserIssues();
  }
});

// Function to load user issues
function loadUserIssues() {
  const issueTrackingContainer = document.getElementById('issue-tracking-container');
  if (!issueTrackingContainer) return;
  
  const userPhone = localStorage.getItem('userPhone');
  if (!userPhone) {
    issueTrackingContainer.innerHTML = '<div class="empty-state">Please log in to view your reported issues.</div>';
    return;
  }
  
  const userIssues = JSON.parse(localStorage.getItem('userIssues') || '[]');
  const userSpecificIssues = userIssues.filter(issue => issue.reportedBy === userPhone);
  
  if (userSpecificIssues.length === 0) {
    issueTrackingContainer.innerHTML = '<div class="empty-state">You have not reported any issues yet.</div>';
    return;
  }
  
  // Display the latest issue (or the one specified by URL parameter)
  const urlParams = new URLSearchParams(window.location.search);
  const issueId = urlParams.get('id');
  
  let issueToDisplay = null;
  
  if (issueId) {
    issueToDisplay = userSpecificIssues.find(issue => issue.id === issueId);
  }
  
  if (!issueToDisplay) {
    // If no specific issue requested or not found, show the latest one
    issueToDisplay = userSpecificIssues[userSpecificIssues.length - 1];
  }
  
  displayIssueDetails(issueToDisplay, issueTrackingContainer);
}

// Function to display issue details with timeline
function displayIssueDetails(issue, container) {
  if (!issue || !container) return;
  
  container.innerHTML = '';
  
  // Create header section
  const issueHeader = createElement('div', 'issue-header');
  issueHeader.innerHTML = `
    <h2>${issue.title}</h2>
    <div class="issue-meta-info">
      <div class="issue-meta-item">
        <span class="issue-meta-label">Issue ID</span>
        <span class="issue-meta-value">${issue.id}</span>
      </div>
      <div class="issue-meta-item">
        <span class="issue-meta-label">Category</span>
        <span class="issue-meta-value">${issue.category}</span>
      </div>
      <div class="issue-meta-item">
        <span class="issue-meta-label">Location</span>
        <span class="issue-meta-value">${issue.location}</span>
      </div>
      <div class="issue-meta-item">
        <span class="issue-meta-label">Reported On</span>
        <span class="issue-meta-value">${formatDate(issue.reportedAt)}</span>
      </div>
      <div class="issue-meta-item">
        <span class="issue-meta-label">Status</span>
        <span class="issue-status-badge ${issue.status}">${issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}</span>
      </div>
    </div>
  `;
  
  // Create description box
  const descriptionBox = createElement('div', 'issue-description-box');
  descriptionBox.textContent = issue.description;
  
  // Create timeline section
  const timelineContainer = createElement('div', 'issue-timeline');
  const timelineHeader = createElement('h3', '', 'Issue Timeline');
  timelineContainer.appendChild(timelineHeader);
  
  // Get all possible statuses in the workflow
  const allStatuses = ['reported', 'forwarded', 'validated', 'in-progress', 'resolved', 'rejected'];
  
  // Get the current status index
  const currentStatusIndex = allStatuses.indexOf(issue.status);
  
  // Create timeline items for each status
  allStatuses.forEach((status, index) => {
    const isCompleted = index < currentStatusIndex;
    const isActive = index === currentStatusIndex;
    const isPending = index > currentStatusIndex;
    
    let statusClass = isCompleted ? 'completed' : (isActive ? 'active' : 'pending');
    
    // Find the timeline entry for this status
    const timelineEntry = issue.timeline.find(entry => entry.status === status);
    
    // Skip rejected status if current status is not rejected
    if (status === 'rejected' && issue.status !== 'rejected') return;
    
    // Skip resolved status if current status is rejected
    if (status === 'resolved' && issue.status === 'rejected') return;
    
    const timelineItem = createElement('div', `timeline-item ${statusClass}`);
    
    // Create timeline icon
    const iconClass = getIconClassForStatus(status);
    const timelineIcon = createElement('div', 'timeline-icon');
    timelineIcon.innerHTML = `<i class="${iconClass}"></i>`;
    
    // Create timeline content
    const timelineContent = createElement('div', 'timeline-content');
    
    // Create timeline header
    const timelineHeader = createElement('div', 'timeline-header');
    const timelineTitle = createElement('div', 'timeline-title');
    timelineTitle.textContent = getStatusTitle(status);
    
    timelineHeader.appendChild(timelineTitle);
    
    // Add date if status is completed or active
    if (timelineEntry) {
      const timelineDate = createElement('div', 'timeline-date');
      timelineDate.textContent = formatDate(timelineEntry.date);
      timelineHeader.appendChild(timelineDate);
    }
    
    timelineContent.appendChild(timelineHeader);
    
    // Add message if exists
    if (timelineEntry && timelineEntry.message) {
      const timelineMessage = createElement('div', 'timeline-message');
      timelineMessage.textContent = timelineEntry.message;
      timelineContent.appendChild(timelineMessage);
    } else if (isPending) {
      const timelineMessage = createElement('div', 'timeline-message');
      timelineMessage.textContent = 'Pending';
      timelineContent.appendChild(timelineMessage);
    }
    
    // Assemble timeline item
    timelineItem.appendChild(timelineIcon);
    timelineItem.appendChild(timelineContent);
    timelineContainer.appendChild(timelineItem);
  });
  
  // Assemble issue tracking content
  container.appendChild(issueHeader);
  container.appendChild(descriptionBox);
  container.appendChild(timelineContainer);
}

// Helper function to get icon class for status
function getIconClassForStatus(status) {
  switch (status) {
    case 'reported': return 'fas fa-flag';
    case 'forwarded': return 'fas fa-share';
    case 'validated': return 'fas fa-check-circle';
    case 'in-progress': return 'fas fa-tools';
    case 'resolved': return 'fas fa-check-double';
    case 'rejected': return 'fas fa-times-circle';
    default: return 'fas fa-circle';
  }
}

// Helper function to get title for status
function getStatusTitle(status) {
  switch (status) {
    case 'reported': return 'Issue Reported';
    case 'forwarded': return 'Forwarded to Authority';
    case 'validated': return 'Issue Validated';
    case 'in-progress': return 'Work In Progress';
    case 'resolved': return 'Issue Resolved';
    case 'rejected': return 'Issue Rejected';
    default: return status.charAt(0).toUpperCase() + status.slice(1);
  }
}
