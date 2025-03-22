
// Authorities functionality
let authorityState = {
  isLoggedIn: false,
  currentAuthority: null,
  contentTypes: ['events', 'budget', 'history', 'resources', 'announcements']
};

// Predefined authority credentials
const authorityCredentials = [
  { email: "sarpanch@gmail.com", password: "sarpanch", role: "Sarpanch" },
  { email: "uppasarpanch@gmail.com", password: "uppasarpanch", role: "Uppasarpanch" },
  { email: "wardmember@gmail.com", password: "wardmember", role: "Ward Member" }
];

// DOM elements
const authoritiesLoginForm = document.getElementById('authoritiesLoginForm');
const authorityDashboard = document.getElementById('authorityDashboard');
const contentManagementSection = document.getElementById('contentManagementSection');
const addContentForm = document.getElementById('addContentForm');
const contentTypeSelect = document.getElementById('contentType');
const contentFormFields = document.getElementById('contentFormFields');
const contentList = document.getElementById('contentList');
const saveContentBtn = document.getElementById('saveContentBtn');
const logoutAuthorityBtn = document.getElementById('logoutAuthorityBtn');
const issueManagementSection = document.getElementById('issueManagementSection');
const issuesList = document.getElementById('issuesList');
const issueDetailPanel = document.getElementById('issueDetailPanel');

// Check if authority is logged in (from localStorage)
function initAuthorities() {
  const savedLogin = localStorage.getItem('authorityIsLoggedIn');
  const savedAuthority = localStorage.getItem('currentAuthority');
  
  if (savedLogin === 'true' && savedAuthority) {
    authorityState.isLoggedIn = true;
    authorityState.currentAuthority = JSON.parse(savedAuthority);
    updateUIForAuthorityLogin();
  }
  
  // Determine the current page
  const currentPage = window.location.pathname.split('/').pop();
  
  if (currentPage === 'authorities-login.html') {
    setupLoginPage();
  } else if (currentPage === 'authorities-dashboard.html') {
    setupDashboardPage();
  }
}

// Setup login page
function setupLoginPage() {
  if (authoritiesLoginForm) {
    authoritiesLoginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('authorityEmail').value;
      const password = document.getElementById('authorityPassword').value;
      
      // Validate credentials against predefined authorities
      const authority = authorityCredentials.find(auth => 
        auth.email === email && auth.password === password
      );
      
      if (authority) {
        authorityLogin(email, authority.role);
      } else {
        showNotification('Invalid credentials. Please try again.', 'error');
      }
    });
  }
  
  // If already logged in, redirect to dashboard
  if (authorityState.isLoggedIn) {
    window.location.href = 'authorities-dashboard.html';
  }
}

// Setup dashboard page
function setupDashboardPage() {
  // If not logged in, redirect to login page
  if (!authorityState.isLoggedIn) {
    window.location.href = 'authorities-login.html';
    return;
  }
  
  // Setup content type selection
  if (contentTypeSelect) {
    contentTypeSelect.addEventListener('change', function() {
      const selectedType = this.value;
      if (selectedType) {
        updateContentForm(selectedType);
      }
    });
  }
  
  // Setup content form submission
  if (addContentForm) {
    addContentForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const contentType = contentTypeSelect.value;
      
      if (!contentType) {
        showNotification('Please select a content type', 'warning');
        return;
      }
      
      saveContent(contentType);
    });
  }
  
  // Setup logout
  if (logoutAuthorityBtn) {
    logoutAuthorityBtn.addEventListener('click', function() {
      authorityLogout();
    });
  }
  
  // Initialize dashboard with authority role
  updateDashboardForRole();
  
  // Load content management section
  loadContentSection();
  
  // Load issues management section
  loadIssuesSection();
}

// Authority login
function authorityLogin(email, role) {
  // In a real app, this would authenticate with backend
  const authority = {
    id: generateId(),
    email: email,
    role: role,
    name: role // For simplicity
  };
  
  authorityState.isLoggedIn = true;
  authorityState.currentAuthority = authority;
  
  // Save to localStorage for persistence
  localStorage.setItem('authorityIsLoggedIn', 'true');
  localStorage.setItem('currentAuthority', JSON.stringify(authority));
  
  showNotification(`Login successful! Welcome, ${role}`, 'success');
  
  // Redirect to dashboard
  setTimeout(() => {
    window.location.href = 'authorities-dashboard.html';
  }, 1000);
}

// Authority logout
function authorityLogout() {
  authorityState.isLoggedIn = false;
  authorityState.currentAuthority = null;
  
  // Clear localStorage
  localStorage.removeItem('authorityIsLoggedIn');
  localStorage.removeItem('currentAuthority');
  
  showNotification('You have been logged out', 'info');
  
  // Redirect to login page
  window.location.href = 'authorities-login.html';
}

// Update UI based on authority login
function updateUIForAuthorityLogin() {
  // This function can be expanded as needed
  const authorityRoleDisplay = document.getElementById('authorityRoleDisplay');
  if (authorityRoleDisplay && authorityState.currentAuthority) {
    authorityRoleDisplay.textContent = authorityState.currentAuthority.role;
  }
}

// Update dashboard based on authority role
function updateDashboardForRole() {
  if (!authorityState.currentAuthority) return;
  
  const role = authorityState.currentAuthority.role;
  const roleDisplay = document.getElementById('authorityRoleDisplay');
  
  if (roleDisplay) {
    roleDisplay.textContent = role;
  }
  
  // Different roles can have different dashboard views/permissions
  // This can be expanded as needed
}

// Load content management section
function loadContentSection() {
  if (!contentManagementSection) return;
  
  // Initialize the content type select
  if (contentTypeSelect) {
    contentTypeSelect.innerHTML = '<option value="">Select Content Type</option>';
    
    authorityState.contentTypes.forEach(type => {
      const option = document.createElement('option');
      option.value = type;
      option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
      contentTypeSelect.appendChild(option);
    });
  }
  
  // Load existing content
  loadExistingContent();
}

// Update content form based on selected type
function updateContentForm(contentType) {
  if (!contentFormFields) return;
  
  let formHTML = '';
  
  // Common fields for all content types
  formHTML += `
    <div class="form-row">
      <label for="contentTitle" class="form-label">Title</label>
      <input type="text" id="contentTitle" class="form-input" required placeholder="Enter title">
    </div>
  `;
  
  // Type-specific fields
  switch (contentType) {
    case 'events':
      formHTML += `
        <div class="form-row grid-2">
          <div>
            <label for="eventDate" class="form-label">Date & Time</label>
            <input type="datetime-local" id="eventDate" class="form-input" required>
          </div>
          <div>
            <label for="eventLocation" class="form-label">Location</label>
            <input type="text" id="eventLocation" class="form-input" required placeholder="Event location">
          </div>
        </div>
        <div class="form-row">
          <label for="eventDescription" class="form-label">Description</label>
          <textarea id="eventDescription" class="form-textarea" rows="4" required placeholder="Event description..."></textarea>
        </div>
      `;
      break;
      
    case 'budget':
      formHTML += `
        <div class="form-row">
          <label for="fiscalYear" class="form-label">Fiscal Year</label>
          <input type="text" id="fiscalYear" class="form-input" required placeholder="e.g., 2023-2024">
        </div>
        <div class="form-row">
          <label for="budgetDescription" class="form-label">Description</label>
          <textarea id="budgetDescription" class="form-textarea" rows="4" required placeholder="Budget overview..."></textarea>
        </div>
        <div class="form-row">
          <label class="form-label">Budget Allocations</label>
          <div id="budgetAllocations">
            <div class="budget-allocation-item">
              <div class="grid-3">
                <div>
                  <input type="text" class="form-input allocation-category" placeholder="Category" required>
                </div>
                <div>
                  <input type="number" class="form-input allocation-amount" placeholder="Amount (₹)" required>
                </div>
                <div>
                  <input type="number" class="form-input allocation-percentage" placeholder="%" required>
                </div>
              </div>
            </div>
          </div>
          <button type="button" id="addAllocationBtn" class="btn btn-outline-accent mt-2">
            <i class="fas fa-plus"></i> Add Allocation
          </button>
        </div>
      `;
      break;
      
    case 'history':
      formHTML += `
        <div class="form-row">
          <label for="historyContent" class="form-label">Historical Content</label>
          <textarea id="historyContent" class="form-textarea" rows="6" required placeholder="Write about village history..."></textarea>
        </div>
        <div class="form-row">
          <label class="form-label">Historical Timeline (Optional)</label>
          <div id="historyTimeline">
            <div class="history-timeline-item">
              <div class="grid-3">
                <div>
                  <input type="text" class="form-input timeline-year" placeholder="Year/Period" required>
                </div>
                <div>
                  <input type="text" class="form-input timeline-title" placeholder="Event Title" required>
                </div>
                <div>
                  <input type="text" class="form-input timeline-description" placeholder="Brief Description" required>
                </div>
              </div>
            </div>
          </div>
          <button type="button" id="addTimelineEventBtn" class="btn btn-outline-accent mt-2">
            <i class="fas fa-plus"></i> Add Timeline Event
          </button>
        </div>
      `;
      break;
      
    case 'resources':
      formHTML += `
        <div class="form-row grid-2">
          <div>
            <label for="resourceType" class="form-label">Resource Type</label>
            <select id="resourceType" class="form-select" required>
              <option value="">Select Type</option>
              <option value="document">Document</option>
              <option value="form">Form</option>
              <option value="scheme">Government Scheme</option>
              <option value="education">Educational</option>
              <option value="health">Health</option>
              <option value="agriculture">Agriculture</option>
              <option value="link">External Link</option>
              <option value="video">Video</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label for="resourceLink" class="form-label">Resource Link (Optional)</label>
            <input type="url" id="resourceLink" class="form-input" placeholder="https://example.com">
          </div>
        </div>
        <div class="form-row">
          <label for="resourceDescription" class="form-label">Description</label>
          <textarea id="resourceDescription" class="form-textarea" rows="4" required placeholder="Resource description..."></textarea>
        </div>
      `;
      break;
      
    case 'announcements':
      formHTML += `
        <div class="form-row">
          <label for="announcementContent" class="form-label">Announcement</label>
          <textarea id="announcementContent" class="form-textarea" rows="4" required placeholder="Announcement content..."></textarea>
        </div>
        <div class="form-row grid-2">
          <div>
            <label for="announcementDate" class="form-label">Date</label>
            <input type="date" id="announcementDate" class="form-input" required>
          </div>
          <div>
            <label for="announcementAuthor" class="form-label">Author (Optional)</label>
            <input type="text" id="announcementAuthor" class="form-input" placeholder="Author name">
          </div>
        </div>
        <div class="form-row">
          <label class="form-label checkbox-label">
            <input type="checkbox" id="announcementImportant">
            <span>Mark as Important</span>
          </label>
        </div>
      `;
      break;
  }
  
  contentFormFields.innerHTML = formHTML;
  
  // Add event listeners for dynamic form elements
  if (contentType === 'budget') {
    const addAllocationBtn = document.getElementById('addAllocationBtn');
    if (addAllocationBtn) {
      addAllocationBtn.addEventListener('click', function() {
        const budgetAllocations = document.getElementById('budgetAllocations');
        if (budgetAllocations) {
          const newAllocation = document.createElement('div');
          newAllocation.className = 'budget-allocation-item mt-2';
          newAllocation.innerHTML = `
            <div class="grid-3">
              <div>
                <input type="text" class="form-input allocation-category" placeholder="Category" required>
              </div>
              <div>
                <input type="number" class="form-input allocation-amount" placeholder="Amount (₹)" required>
              </div>
              <div>
                <input type="number" class="form-input allocation-percentage" placeholder="%" required>
              </div>
            </div>
          `;
          budgetAllocations.appendChild(newAllocation);
        }
      });
    }
  }
  
  if (contentType === 'history') {
    const addTimelineEventBtn = document.getElementById('addTimelineEventBtn');
    if (addTimelineEventBtn) {
      addTimelineEventBtn.addEventListener('click', function() {
        const historyTimeline = document.getElementById('historyTimeline');
        if (historyTimeline) {
          const newEvent = document.createElement('div');
          newEvent.className = 'history-timeline-item mt-2';
          newEvent.innerHTML = `
            <div class="grid-3">
              <div>
                <input type="text" class="form-input timeline-year" placeholder="Year/Period" required>
              </div>
              <div>
                <input type="text" class="form-input timeline-title" placeholder="Event Title" required>
              </div>
              <div>
                <input type="text" class="form-input timeline-description" placeholder="Brief Description" required>
              </div>
            </div>
          `;
          historyTimeline.appendChild(newEvent);
        }
      });
    }
  }
}

// Save content
function saveContent(contentType) {
  const title = document.getElementById('contentTitle').value;
  if (!title) return;
  
  let content;
  
  switch (contentType) {
    case 'events':
      content = {
        id: generateId(),
        title: title,
        date: document.getElementById('eventDate').value,
        location: document.getElementById('eventLocation').value,
        description: document.getElementById('eventDescription').value,
        createdBy: authorityState.currentAuthority.email,
        createdAt: new Date().toISOString()
      };
      break;
      
    case 'budget':
      const allocations = [];
      const allocationItems = document.querySelectorAll('.budget-allocation-item');
      
      allocationItems.forEach(item => {
        const category = item.querySelector('.allocation-category').value;
        const amount = parseFloat(item.querySelector('.allocation-amount').value);
        const percentage = parseFloat(item.querySelector('.allocation-percentage').value);
        
        if (category && !isNaN(amount) && !isNaN(percentage)) {
          allocations.push({
            category,
            amount,
            percentage
          });
        }
      });
      
      content = {
        id: generateId(),
        title: title,
        fiscalYear: document.getElementById('fiscalYear').value,
        description: document.getElementById('budgetDescription').value,
        allocations: allocations,
        createdBy: authorityState.currentAuthority.email,
        createdAt: new Date().toISOString()
      };
      break;
      
    case 'history':
      const timeline = [];
      const timelineItems = document.querySelectorAll('.history-timeline-item');
      
      timelineItems.forEach(item => {
        const year = item.querySelector('.timeline-year').value;
        const eventTitle = item.querySelector('.timeline-title').value;
        const description = item.querySelector('.timeline-description').value;
        
        if (year && eventTitle && description) {
          timeline.push({
            year,
            title: eventTitle,
            description
          });
        }
      });
      
      content = {
        id: generateId(),
        title: title,
        content: document.getElementById('historyContent').value,
        timeline: timeline,
        createdBy: authorityState.currentAuthority.email,
        createdAt: new Date().toISOString()
      };
      break;
      
    case 'resources':
      content = {
        id: generateId(),
        title: title,
        type: document.getElementById('resourceType').value,
        description: document.getElementById('resourceDescription').value,
        link: document.getElementById('resourceLink').value,
        createdBy: authorityState.currentAuthority.email,
        createdAt: new Date().toISOString()
      };
      break;
      
    case 'announcements':
      content = {
        id: generateId(),
        title: title,
        content: document.getElementById('announcementContent').value,
        date: document.getElementById('announcementDate').value,
        author: document.getElementById('announcementAuthor').value,
        important: document.getElementById('announcementImportant').checked,
        createdBy: authorityState.currentAuthority.email,
        createdAt: new Date().toISOString()
      };
      break;
  }
  
  if (content) {
    // Get existing content
    let existingContent = getContentByType(contentType) || [];
    
    // Add new content
    existingContent.unshift(content); // Add to beginning of array
    
    // Save to localStorage
    localStorage.setItem(`content_${contentType}`, JSON.stringify(existingContent));
    
    // Show success message
    showNotification(`${contentType.charAt(0).toUpperCase() + contentType.slice(1)} content added successfully!`, 'success');
    
    // Reset form
    addContentForm.reset();
    contentFormFields.innerHTML = '';
    contentTypeSelect.value = '';
    
    // Reload content list
    loadExistingContent();
  }
}

// Load existing content
function loadExistingContent() {
  if (!contentList) return;
  
  contentList.innerHTML = '';
  
  authorityState.contentTypes.forEach(type => {
    const content = getContentByType(type);
    
    if (content && content.length > 0) {
      const typeHeading = document.createElement('h3');
      typeHeading.className = 'content-type-heading';
      typeHeading.textContent = type.charAt(0).toUpperCase() + type.slice(1);
      contentList.appendChild(typeHeading);
      
      const typeList = document.createElement('div');
      typeList.className = 'content-type-list';
      
      content.forEach(item => {
        const contentItem = document.createElement('div');
        contentItem.className = 'content-item';
        contentItem.innerHTML = `
          <div class="content-item-header">
            <h4>${item.title}</h4>
            <span class="content-date">${new Date(item.createdAt).toLocaleDateString()}</span>
          </div>
        `;
        typeList.appendChild(contentItem);
      });
      
      contentList.appendChild(typeList);
    }
  });
  
  if (contentList.innerHTML === '') {
    contentList.innerHTML = '<p class="no-content">No content has been added yet.</p>';
  }
}

// Load issues management section
function loadIssuesSection() {
  if (!issueManagementSection) return;
  
  // Check authority role
  if (!authorityState.currentAuthority) return;
  
  const role = authorityState.currentAuthority.role;
  
  // Load issues based on role
  const issues = getIssues();
  
  if (!issues || issues.length === 0) {
    if (issuesList) {
      issuesList.innerHTML = '<p class="no-issues">No issues have been reported yet.</p>';
    }
    return;
  }
  
  // Filter issues based on role
  let filteredIssues = [];
  
  switch (role) {
    case 'Ward Member':
      // Ward Member sees all submitted issues
      filteredIssues = issues.filter(issue => 
        issue.status === 'Submitted' || 
        issue.assignedTo === role
      );
      break;
      
    case 'Sarpanch':
    case 'Uppasarpanch':
      // These roles see issues that have been forwarded to them
      filteredIssues = issues.filter(issue => 
        issue.status !== 'Submitted' && 
        issue.status !== 'Rejected' &&
        (issue.assignedTo === 'All Authorities' || issue.assignedTo === role)
      );
      break;
  }
  
  // Display issues
  displayIssues(filteredIssues, role);
}

// Display issues
function displayIssues(issues, role) {
  if (!issuesList) return;
  
  issuesList.innerHTML = '';
  
  if (issues.length === 0) {
    issuesList.innerHTML = '<p class="no-issues">No issues found for your role.</p>';
    return;
  }
  
  issues.forEach(issue => {
    const issueItem = document.createElement('div');
    issueItem.className = `issue-item ${getIssueStatusClass(issue.status)}`;
    issueItem.dataset.issueId = issue.id;
    
    issueItem.innerHTML = `
      <div class="issue-header">
        <h4>${issue.type}</h4>
        <div class="issue-status">${issue.status}</div>
      </div>
      <div class="issue-meta">
        <div><i class="fas fa-hashtag"></i> ${issue.id}</div>
        <div><i class="fas fa-map-marker-alt"></i> Ward ${issue.ward}</div>
        <div><i class="fas fa-clock"></i> ${new Date(issue.dateSubmitted).toLocaleDateString()}</div>
      </div>
      <p class="issue-description">${issue.description.substring(0, 100)}${issue.description.length > 100 ? '...' : ''}</p>
    `;
    
    issuesList.appendChild(issueItem);
    
    // Add click event
    issueItem.addEventListener('click', function() {
      const issueId = this.dataset.issueId;
      displayIssueDetail(getIssueById(issueId), role);
    });
  });
}

// Display issue detail
function displayIssueDetail(issue, role) {
  if (!issueDetailPanel || !issue) return;
  
  issueDetailPanel.innerHTML = `
    <div class="issue-detail-header">
      <h3>${issue.type}</h3>
      <div class="issue-status ${getIssueStatusClass(issue.status)}">${issue.status}</div>
    </div>
    
    <div class="issue-meta">
      <div><strong>ID:</strong> ${issue.id}</div>
      <div><strong>Ward:</strong> ${issue.ward}</div>
      <div><strong>Location:</strong> ${issue.location}</div>
      <div><strong>Submitted:</strong> ${new Date(issue.dateSubmitted).toLocaleString()}</div>
      <div><strong>Assigned to:</strong> ${issue.assignedTo || 'Pending Review'}</div>
    </div>
    
    <div class="issue-description-full">
      <h4>Description</h4>
      <p>${issue.description}</p>
    </div>
    
    ${issue.images && issue.images.length > 0 ? `
      <div class="issue-images">
        <h4>Images</h4>
        <div class="image-gallery">
          ${issue.images.map(image => `
            <div class="image-thumbnail">
              <img src="${image}" alt="Issue image">
            </div>
          `).join('')}
        </div>
      </div>
    ` : ''}
    
    <div class="issue-timeline">
      <h4>Issue Timeline</h4>
      <div class="timeline">
        ${issue.updates.map(update => `
          <div class="timeline-item">
            <div class="timeline-icon">
              <i class="fas ${getStatusIcon(update.status)}"></i>
            </div>
            <div class="timeline-content">
              <div class="timeline-header">
                <h5>${update.status}</h5>
                <span>${new Date(update.date).toLocaleString()}</span>
              </div>
              <p>${update.comment}</p>
              <div class="text-sm text-gray-500">by ${update.by}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  // Add action buttons based on role and issue status
  const actionsDiv = document.createElement('div');
  actionsDiv.className = 'issue-actions';
  
  if (role === 'Ward Member' && issue.status === 'Submitted') {
    // Ward Member can forward or reject submitted issues
    actionsDiv.innerHTML = `
      <button id="forwardIssueBtn" class="btn btn-primary">
        <i class="fas fa-share"></i> Forward to Authorities
      </button>
      <button id="rejectIssueBtn" class="btn btn-outline-accent">
        <i class="fas fa-times"></i> Reject Issue
      </button>
    `;
  } else if ((role === 'Sarpanch' || role === 'Uppasarpanch') && 
             (issue.status === 'In-Review' || issue.status === 'In-Progress')) {
    // Sarpanch and Uppasarpanch can update and resolve issues
    actionsDiv.innerHTML = `
      <button id="updateStatusBtn" class="btn btn-primary">
        <i class="fas fa-sync-alt"></i> Update Status
      </button>
      <button id="resolveIssueBtn" class="btn btn-outline-accent">
        <i class="fas fa-check"></i> Mark as Resolved
      </button>
    `;
  }
  
  // Add comment form for all roles
  actionsDiv.innerHTML += `
    <div class="comment-form mt-4">
      <h4>Add Comment</h4>
      <textarea id="issueComment" class="form-textarea" rows="3" placeholder="Add a comment or update..."></textarea>
      <button id="addCommentBtn" class="btn btn-primary mt-2">
        <i class="fas fa-comment"></i> Add Comment
      </button>
    </div>
  `;
  
  issueDetailPanel.appendChild(actionsDiv);
  
  // Add event listeners for action buttons
  const forwardIssueBtn = document.getElementById('forwardIssueBtn');
  const rejectIssueBtn = document.getElementById('rejectIssueBtn');
  const updateStatusBtn = document.getElementById('updateStatusBtn');
  const resolveIssueBtn = document.getElementById('resolveIssueBtn');
  const addCommentBtn = document.getElementById('addCommentBtn');
  
  if (forwardIssueBtn) {
    forwardIssueBtn.addEventListener('click', function() {
      updateIssueStatus(issue.id, 'In-Review', 'All Authorities', 'Issue has been reviewed and forwarded to village authorities');
    });
  }
  
  if (rejectIssueBtn) {
    rejectIssueBtn.addEventListener('click', function() {
      updateIssueStatus(issue.id, 'Rejected', 'Ward Member', 'Issue has been reviewed and rejected due to insufficient information or invalid request');
    });
  }
  
  if (updateStatusBtn) {
    updateStatusBtn.addEventListener('click', function() {
      updateIssueStatus(issue.id, 'In-Progress', authorityState.currentAuthority.role, 'Issue is now being addressed by the authorities');
    });
  }
  
  if (resolveIssueBtn) {
    resolveIssueBtn.addEventListener('click', function() {
      updateIssueStatus(issue.id, 'Resolved', authorityState.currentAuthority.role, 'Issue has been successfully resolved');
    });
  }
  
  if (addCommentBtn) {
    addCommentBtn.addEventListener('click', function() {
      const comment = document.getElementById('issueComment').value;
      if (comment.trim()) {
        addIssueComment(issue.id, comment);
      } else {
        showNotification('Please enter a comment', 'warning');
      }
    });
  }
}

// Update issue status
function updateIssueStatus(issueId, status, assignedTo, comment) {
  if (!authorityState.currentAuthority) return;
  
  // Get all issues
  let allIssues = getIssues();
  if (!allIssues) return;
  
  // Find the issue to update
  const issueIndex = allIssues.findIndex(issue => issue.id === issueId);
  if (issueIndex === -1) return;
  
  // Update the issue
  allIssues[issueIndex].status = status;
  allIssues[issueIndex].assignedTo = assignedTo;
  
  // Add update to issue timeline
  allIssues[issueIndex].updates.push({
    id: generateId(),
    status: status,
    date: Date.now(),
    comment: comment,
    by: authorityState.currentAuthority.role
  });
  
  // Save updated issues
  localStorage.setItem('issues', JSON.stringify(allIssues));
  
  // Show notification
  showNotification(`Issue status updated to ${status}`, 'success');
  
  // Reload issues section
  loadIssuesSection();
  
  // Display updated issue detail
  displayIssueDetail(allIssues[issueIndex], authorityState.currentAuthority.role);
}

// Add comment to issue
function addIssueComment(issueId, comment) {
  if (!authorityState.currentAuthority) return;
  
  // Get all issues
  let allIssues = getIssues();
  if (!allIssues) return;
  
  // Find the issue to update
  const issueIndex = allIssues.findIndex(issue => issue.id === issueId);
  if (issueIndex === -1) return;
  
  // Add comment to issue timeline
  allIssues[issueIndex].updates.push({
    id: generateId(),
    status: allIssues[issueIndex].status, // Maintain current status
    date: Date.now(),
    comment: comment,
    by: authorityState.currentAuthority.role
  });
  
  // Save updated issues
  localStorage.setItem('issues', JSON.stringify(allIssues));
  
  // Show notification
  showNotification('Comment added successfully', 'success');
  
  // Clear comment field
  const commentField = document.getElementById('issueComment');
  if (commentField) {
    commentField.value = '';
  }
  
  // Display updated issue detail
  displayIssueDetail(allIssues[issueIndex], authorityState.currentAuthority.role);
}

// Helper Functions

// Get content by type from localStorage
function getContentByType(type) {
  const content = localStorage.getItem(`content_${type}`);
  return content ? JSON.parse(content) : null;
}

// Get all issues from localStorage
function getIssues() {
  const issues = localStorage.getItem('issues');
  return issues ? JSON.parse(issues) : [];
}

// Get issue by ID
function getIssueById(id) {
  const issues = getIssues();
  return issues.find(issue => issue.id === id);
}

// Get CSS class for issue status
function getIssueStatusClass(status) {
  switch (status.toLowerCase()) {
    case 'submitted':
      return 'status-submitted';
    case 'in-review':
      return 'status-in-review';
    case 'in-progress':
      return 'status-in-progress';
    case 'resolved':
      return 'status-resolved';
    case 'rejected':
      return 'status-rejected';
    default:
      return 'status-submitted';
  }
}

// Get icon for status
function getStatusIcon(status) {
  switch (status.toLowerCase()) {
    case 'submitted':
      return 'fa-paper-plane';
    case 'in-review':
      return 'fa-search';
    case 'in-progress':
      return 'fa-tools';
    case 'resolved':
      return 'fa-check-circle';
    case 'rejected':
      return 'fa-times-circle';
    default:
      return 'fa-info-circle';
  }
}

// Generate a random ID
function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

// Initialize authorities functionality
document.addEventListener('DOMContentLoaded', function() {
  initAuthorities();
});
