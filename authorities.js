
// Authority credentials and roles
const AUTHORITY_CREDENTIALS = {
  sarpanch: {
    password: "sarpanch",
    level: 3,
    permissions: ["review", "update", "resolve", "post-content", "manage-content"]
  },
  uppasarpanch: {
    password: "uppasarpanch",
    level: 2,
    permissions: ["review", "update", "resolve", "post-content", "manage-content"]
  },
  wardmember: {
    password: "wardmember",
    level: 1,
    permissions: ["review", "update", "escalate", "post-content"]
  }
};

// Global state for authorities
const authorityState = {
  isLoggedIn: false,
  currentAuthority: null,
  redirectAfterLogin: null
};

// Check if authority is logged in from localStorage
function initAuthority() {
  const savedLogin = localStorage.getItem('authority_isLoggedIn');
  const savedAuthority = localStorage.getItem('authority_currentUser');
  
  if (savedLogin === 'true' && savedAuthority) {
    authorityState.isLoggedIn = true;
    authorityState.currentAuthority = JSON.parse(savedAuthority);
    updateUIForAuthorityLogin();
    
    // If on the authorities-login page but already logged in, redirect to dashboard
    if (window.location.pathname.includes('authorities-login.html')) {
      window.location.href = 'authorities-dashboard.html';
    }
  }
  
  // Initialize authority-specific page functionality
  const currentPage = window.location.pathname.split('/').pop();
  
  if (currentPage === 'authorities-dashboard.html') {
    // If not logged in but trying to access dashboard, redirect to login
    if (!authorityState.isLoggedIn) {
      window.location.href = 'authorities-login.html';
      return;
    }
    initAuthoritiesDashboard();
  } else if (currentPage === 'authorities-login.html') {
    initAuthoritiesLogin();
  }
}

// Initialize authorities login page
function initAuthoritiesLogin() {
  const authoritiesLoginForm = document.getElementById('authoritiesLoginForm');
  
  if (authoritiesLoginForm) {
    authoritiesLoginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const role = document.getElementById('authorityRole').value;
      const email = document.getElementById('authorityEmail').value;
      const password = document.getElementById('authorityPassword').value;
      
      // Validate credentials
      if (!role || !email || !password) {
        showNotification('Please fill in all fields', 'error');
        return;
      }
      
      // Check if role exists
      if (!AUTHORITY_CREDENTIALS[role]) {
        showNotification('Invalid role selected', 'error');
        return;
      }
      
      // Check password
      if (password !== AUTHORITY_CREDENTIALS[role].password) {
        showNotification('Invalid credentials', 'error');
        return;
      }
      
      // Login successful
      const authority = {
        id: `auth_${Date.now()}`,
        role: role,
        email: email,
        name: roleToDisplayName(role),
        permissions: AUTHORITY_CREDENTIALS[role].permissions,
        level: AUTHORITY_CREDENTIALS[role].level
      };
      
      authorityState.isLoggedIn = true;
      authorityState.currentAuthority = authority;
      
      // Save to localStorage
      localStorage.setItem('authority_isLoggedIn', 'true');
      localStorage.setItem('authority_currentUser', JSON.stringify(authority));
      
      showNotification(`Welcome ${roleToDisplayName(role)}! You have been logged in successfully.`, 'success');
      
      // Redirect to dashboard
      window.location.href = 'authorities-dashboard.html';
    });
  }
}

// Initialize authorities dashboard
function initAuthoritiesDashboard() {
  if (!authorityState.isLoggedIn) {
    window.location.href = 'authorities-login.html';
    return;
  }
  
  // Load UI elements based on authority role
  loadAuthorityDashboard();
  
  // Set up event listeners for dashboard actions
  setupDashboardEvents();
}

// Load authority dashboard with appropriate content
function loadAuthorityDashboard() {
  const authName = document.getElementById('authorityName');
  const authRole = document.getElementById('authorityRole');
  const pendingIssuesCount = document.getElementById('pendingIssuesCount');
  const issuesList = document.getElementById('issuesList');
  const contentTabButtons = document.querySelectorAll('.content-tab-btn');
  const contentTabContents = document.querySelectorAll('.content-tab-content');
  
  if (authName) authName.textContent = authorityState.currentAuthority.name;
  if (authRole) authRole.textContent = roleToDisplayName(authorityState.currentAuthority.role);
  
  // Load issues relevant to this authority
  loadAuthorityIssues(issuesList, pendingIssuesCount);
  
  // Set up content tabs
  if (contentTabButtons.length > 0) {
    contentTabButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Remove active class from all buttons
        contentTabButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        this.classList.add('active');
        
        // Hide all content tabs
        contentTabContents.forEach(content => content.classList.add('hidden'));
        
        // Show the selected content tab
        const tabId = this.getAttribute('data-tab');
        document.getElementById(`${tabId}Content`).classList.remove('hidden');
        
        // Load content for the selected tab
        loadContentForTab(tabId);
      });
    });
    
    // Trigger click on first tab to load by default
    if (contentTabButtons[0]) {
      contentTabButtons[0].click();
    }
  }
}

// Load issues that are relevant to the current authority
function loadAuthorityIssues(issuesList, pendingIssuesCount) {
  if (!issuesList) return;
  
  const allIssues = JSON.parse(localStorage.getItem('issues')) || [];
  const role = authorityState.currentAuthority.role;
  const level = authorityState.currentAuthority.level;
  
  // Filter issues based on authority role
  let relevantIssues = [];
  
  if (role === 'wardmember') {
    // Ward members see all new issues and those assigned to them
    relevantIssues = allIssues.filter(issue => 
      issue.status === 'submitted' || 
      issue.assignedTo === 'wardmember'
    );
  } else if (role === 'uppasarpanch') {
    // Uppasarpanch sees issues escalated to them or higher
    relevantIssues = allIssues.filter(issue => 
      issue.escalationLevel >= 2 ||
      issue.assignedTo === 'uppasarpanch'
    );
  } else if (role === 'sarpanch') {
    // Sarpanch sees all issues
    relevantIssues = allIssues;
  }
  
  // Update pending issues count
  const pendingCount = relevantIssues.filter(issue => 
    issue.status.toLowerCase() !== 'resolved' && 
    issue.status.toLowerCase() !== 'closed'
  ).length;
  
  if (pendingIssuesCount) pendingIssuesCount.textContent = pendingCount;
  
  // Clear previous issues
  issuesList.innerHTML = '';
  
  // No issues case
  if (relevantIssues.length === 0) {
    issuesList.innerHTML = `
      <div class="no-issues-message">
        <i class="fas fa-check-circle"></i>
        <p>No issues to display.</p>
      </div>
    `;
    return;
  }
  
  // Sort issues: pending first, then by date (newest first)
  relevantIssues.sort((a, b) => {
    // Sort by status (pending first)
    const statusA = a.status.toLowerCase();
    const statusB = b.status.toLowerCase();
    
    const isResolvedA = statusA === 'resolved' || statusA === 'closed';
    const isResolvedB = statusB === 'resolved' || statusB === 'closed';
    
    if (isResolvedA && !isResolvedB) return 1;
    if (!isResolvedA && isResolvedB) return -1;
    
    // Sort by date (newest first)
    return new Date(b.dateSubmitted) - new Date(a.dateSubmitted);
  });
  
  // Display issues
  relevantIssues.forEach(issue => {
    const issueCard = document.createElement('div');
    issueCard.className = 'issue-card';
    
    const statusClass = getStatusClass(issue.status);
    
    // Create action buttons based on authority role and issue status
    let actionButtons = '';
    
    // Determine available actions based on role and current status
    if (role === 'wardmember' && issue.status === 'submitted') {
      actionButtons = `
        <button class="btn btn-sm btn-primary review-issue-btn" data-issue-id="${issue.id}">
          <i class="fas fa-check"></i> Review
        </button>
        <button class="btn btn-sm btn-danger reject-issue-btn" data-issue-id="${issue.id}">
          <i class="fas fa-times"></i> Reject
        </button>
      `;
    } else if ((role === 'uppasarpanch' || role === 'sarpanch') && 
               (issue.status !== 'resolved' && issue.status !== 'closed')) {
      actionButtons = `
        <button class="btn btn-sm btn-primary update-issue-btn" data-issue-id="${issue.id}">
          <i class="fas fa-comment"></i> Respond
        </button>
        <button class="btn btn-sm btn-success resolve-issue-btn" data-issue-id="${issue.id}">
          <i class="fas fa-check-circle"></i> Resolve
        </button>
      `;
    } else if (issue.status !== 'closed') {
      // For all other cases, just allow updates
      actionButtons = `
        <button class="btn btn-sm btn-primary update-issue-btn" data-issue-id="${issue.id}">
          <i class="fas fa-comment"></i> Update
        </button>
      `;
    }
    
    issueCard.innerHTML = `
      <div class="issue-card-header">
        <div>
          <h3>${issue.type}</h3>
          <p class="issue-id">ID: #${issue.id}</p>
        </div>
        <div class="issue-status ${statusClass}">${issue.status}</div>
      </div>
      <div class="issue-details">
        <p>${issue.description}</p>
        <div class="issue-meta">
          <div>
            <i class="fas fa-map-marker-alt"></i>
            <span>${issue.location}, Ward ${issue.ward}</span>
          </div>
          <div>
            <i class="fas fa-clock"></i>
            <span>${new Date(issue.dateSubmitted).toLocaleString()}</span>
          </div>
        </div>
        ${issue.images && issue.images.length > 0 ? `
          <div class="issue-images">
            ${issue.images.map((img, i) => `
              <div class="issue-image">
                <img src="${img}" alt="Issue image ${i+1}">
              </div>
            `).join('')}
          </div>
        ` : ''}
      </div>
      <div class="issue-actions">
        ${actionButtons}
        <button class="btn btn-sm btn-text view-details-btn" data-issue-id="${issue.id}">
          View History <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    `;
    
    issuesList.appendChild(issueCard);
  });
  
  // Add event listeners for action buttons
  issuesList.querySelectorAll('.review-issue-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const issueId = this.getAttribute('data-issue-id');
      reviewIssue(issueId);
    });
  });
  
  issuesList.querySelectorAll('.reject-issue-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const issueId = this.getAttribute('data-issue-id');
      rejectIssue(issueId);
    });
  });
  
  issuesList.querySelectorAll('.update-issue-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const issueId = this.getAttribute('data-issue-id');
      updateIssue(issueId);
    });
  });
  
  issuesList.querySelectorAll('.resolve-issue-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const issueId = this.getAttribute('data-issue-id');
      resolveIssue(issueId);
    });
  });
  
  issuesList.querySelectorAll('.view-details-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const issueId = this.getAttribute('data-issue-id');
      viewIssueDetails(issueId);
    });
  });
}

// Review and forward an issue to Uppasarpanch and Sarpanch
function reviewIssue(issueId) {
  const allIssues = JSON.parse(localStorage.getItem('issues')) || [];
  const issueIndex = allIssues.findIndex(issue => issue.id === issueId);
  
  if (issueIndex === -1) {
    showNotification('Issue not found', 'error');
    return;
  }
  
  const issue = allIssues[issueIndex];
  
  // Show review dialog
  const reviewDialog = document.createElement('div');
  reviewDialog.className = 'modal active';
  reviewDialog.innerHTML = `
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      <h2>Review Issue #${issue.id}</h2>
      <p class="mb-4">After reviewing this issue, it will be forwarded to both the Uppasarpanch and Sarpanch.</p>
      
      <form id="reviewIssueForm">
        <div class="form-row">
          <label for="reviewComment">Add a comment</label>
          <textarea id="reviewComment" placeholder="Add your review comments..." rows="4" required></textarea>
        </div>
        <div class="form-actions">
          <button type="button" class="btn btn-outline-accent" id="cancelReview">Cancel</button>
          <button type="submit" class="btn btn-primary">
            <i class="fas fa-paper-plane"></i> Forward to Authorities
          </button>
        </div>
      </form>
    </div>
  `;
  
  document.body.appendChild(reviewDialog);
  
  // Handle close button
  const closeBtn = reviewDialog.querySelector('.close-modal');
  closeBtn.addEventListener('click', () => {
    document.body.removeChild(reviewDialog);
  });
  
  // Handle cancel button
  const cancelBtn = reviewDialog.querySelector('#cancelReview');
  cancelBtn.addEventListener('click', () => {
    document.body.removeChild(reviewDialog);
  });
  
  // Handle form submission
  const reviewForm = reviewDialog.querySelector('#reviewIssueForm');
  reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const comment = document.getElementById('reviewComment').value;
    
    // Update issue status
    issue.status = 'in-review';
    issue.escalationLevel = 2; // Escalate to level 2 (Uppasarpanch)
    issue.updates.push({
      id: `UPDATE-${Date.now().toString(36)}`,
      date: new Date().toISOString(),
      status: 'Forwarded to Authorities',
      comment: comment,
      by: roleToDisplayName(authorityState.currentAuthority.role)
    });
    
    // Save updated issues
    allIssues[issueIndex] = issue;
    localStorage.setItem('issues', JSON.stringify(allIssues));
    
    // Close dialog
    document.body.removeChild(reviewDialog);
    
    // Show notification
    showNotification('Issue has been reviewed and forwarded to authorities', 'success');
    
    // Reload issues list
    const issuesList = document.getElementById('issuesList');
    const pendingIssuesCount = document.getElementById('pendingIssuesCount');
    loadAuthorityIssues(issuesList, pendingIssuesCount);
  });
}

// Reject an issue
function rejectIssue(issueId) {
  const allIssues = JSON.parse(localStorage.getItem('issues')) || [];
  const issueIndex = allIssues.findIndex(issue => issue.id === issueId);
  
  if (issueIndex === -1) {
    showNotification('Issue not found', 'error');
    return;
  }
  
  const issue = allIssues[issueIndex];
  
  // Show reject dialog
  const rejectDialog = document.createElement('div');
  rejectDialog.className = 'modal active';
  rejectDialog.innerHTML = `
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      <h2>Reject Issue #${issue.id}</h2>
      <p class="mb-4">Please provide a reason for rejecting this issue. This information will be shown to the user.</p>
      
      <form id="rejectIssueForm">
        <div class="form-row">
          <label for="rejectReason">Reason for rejection</label>
          <textarea id="rejectReason" placeholder="Explain why this issue is being rejected..." rows="4" required></textarea>
        </div>
        <div class="form-actions">
          <button type="button" class="btn btn-outline-accent" id="cancelReject">Cancel</button>
          <button type="submit" class="btn btn-danger">
            <i class="fas fa-times"></i> Reject Issue
          </button>
        </div>
      </form>
    </div>
  `;
  
  document.body.appendChild(rejectDialog);
  
  // Handle close button
  const closeBtn = rejectDialog.querySelector('.close-modal');
  closeBtn.addEventListener('click', () => {
    document.body.removeChild(rejectDialog);
  });
  
  // Handle cancel button
  const cancelBtn = rejectDialog.querySelector('#cancelReject');
  cancelBtn.addEventListener('click', () => {
    document.body.removeChild(rejectDialog);
  });
  
  // Handle form submission
  const rejectForm = rejectDialog.querySelector('#rejectIssueForm');
  rejectForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const reason = document.getElementById('rejectReason').value;
    
    // Update issue status
    issue.status = 'closed';
    issue.updates.push({
      id: `UPDATE-${Date.now().toString(36)}`,
      date: new Date().toISOString(),
      status: 'Rejected',
      comment: reason,
      by: roleToDisplayName(authorityState.currentAuthority.role)
    });
    
    // Save updated issues
    allIssues[issueIndex] = issue;
    localStorage.setItem('issues', JSON.stringify(allIssues));
    
    // Close dialog
    document.body.removeChild(rejectDialog);
    
    // Show notification
    showNotification('Issue has been rejected', 'success');
    
    // Reload issues list
    const issuesList = document.getElementById('issuesList');
    const pendingIssuesCount = document.getElementById('pendingIssuesCount');
    loadAuthorityIssues(issuesList, pendingIssuesCount);
  });
}

// Update an issue with a comment
function updateIssue(issueId) {
  const allIssues = JSON.parse(localStorage.getItem('issues')) || [];
  const issueIndex = allIssues.findIndex(issue => issue.id === issueId);
  
  if (issueIndex === -1) {
    showNotification('Issue not found', 'error');
    return;
  }
  
  const issue = allIssues[issueIndex];
  
  // Show update dialog
  const updateDialog = document.createElement('div');
  updateDialog.className = 'modal active';
  updateDialog.innerHTML = `
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      <h2>Update Issue #${issue.id}</h2>
      <p class="mb-4">Add a comment or update to this issue. This will be visible to the user who reported it.</p>
      
      <form id="updateIssueForm">
        <div class="form-row">
          <label for="updateStatus">Update Status</label>
          <select id="updateStatus" required>
            <option value="in-review">In Review</option>
            <option value="in-progress">In Progress</option>
          </select>
        </div>
        <div class="form-row">
          <label for="updateComment">Comment</label>
          <textarea id="updateComment" placeholder="Add your update or comment..." rows="4" required></textarea>
        </div>
        <div class="form-actions">
          <button type="button" class="btn btn-outline-accent" id="cancelUpdate">Cancel</button>
          <button type="submit" class="btn btn-primary">
            <i class="fas fa-save"></i> Save Update
          </button>
        </div>
      </form>
    </div>
  `;
  
  document.body.appendChild(updateDialog);
  
  // Set default status to current status
  const statusSelect = document.getElementById('updateStatus');
  if (statusSelect) {
    // Find the option that matches the current status
    const options = statusSelect.options;
    for (let i = 0; i < options.length; i++) {
      if (options[i].value === issue.status) {
        statusSelect.selectedIndex = i;
        break;
      }
    }
  }
  
  // Handle close button
  const closeBtn = updateDialog.querySelector('.close-modal');
  closeBtn.addEventListener('click', () => {
    document.body.removeChild(updateDialog);
  });
  
  // Handle cancel button
  const cancelBtn = updateDialog.querySelector('#cancelUpdate');
  cancelBtn.addEventListener('click', () => {
    document.body.removeChild(updateDialog);
  });
  
  // Handle form submission
  const updateForm = updateDialog.querySelector('#updateIssueForm');
  updateForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const status = document.getElementById('updateStatus').value;
    const comment = document.getElementById('updateComment').value;
    
    // Update issue
    issue.status = status;
    issue.updates.push({
      id: `UPDATE-${Date.now().toString(36)}`,
      date: new Date().toISOString(),
      status: status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' '),
      comment: comment,
      by: roleToDisplayName(authorityState.currentAuthority.role)
    });
    
    // Save updated issues
    allIssues[issueIndex] = issue;
    localStorage.setItem('issues', JSON.stringify(allIssues));
    
    // Close dialog
    document.body.removeChild(updateDialog);
    
    // Show notification
    showNotification('Issue has been updated', 'success');
    
    // Reload issues list
    const issuesList = document.getElementById('issuesList');
    const pendingIssuesCount = document.getElementById('pendingIssuesCount');
    loadAuthorityIssues(issuesList, pendingIssuesCount);
  });
}

// Resolve an issue
function resolveIssue(issueId) {
  const allIssues = JSON.parse(localStorage.getItem('issues')) || [];
  const issueIndex = allIssues.findIndex(issue => issue.id === issueId);
  
  if (issueIndex === -1) {
    showNotification('Issue not found', 'error');
    return;
  }
  
  const issue = allIssues[issueIndex];
  
  // Show resolve dialog
  const resolveDialog = document.createElement('div');
  resolveDialog.className = 'modal active';
  resolveDialog.innerHTML = `
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      <h2>Resolve Issue #${issue.id}</h2>
      <p class="mb-4">Add a resolution comment. This will mark the issue as resolved.</p>
      
      <form id="resolveIssueForm">
        <div class="form-row">
          <label for="resolutionComment">Resolution Comment</label>
          <textarea id="resolutionComment" placeholder="Explain how this issue was resolved..." rows="4" required></textarea>
        </div>
        <div class="form-actions">
          <button type="button" class="btn btn-outline-accent" id="cancelResolve">Cancel</button>
          <button type="submit" class="btn btn-success">
            <i class="fas fa-check-circle"></i> Mark as Resolved
          </button>
        </div>
      </form>
    </div>
  `;
  
  document.body.appendChild(resolveDialog);
  
  // Handle close button
  const closeBtn = resolveDialog.querySelector('.close-modal');
  closeBtn.addEventListener('click', () => {
    document.body.removeChild(resolveDialog);
  });
  
  // Handle cancel button
  const cancelBtn = resolveDialog.querySelector('#cancelResolve');
  cancelBtn.addEventListener('click', () => {
    document.body.removeChild(resolveDialog);
  });
  
  // Handle form submission
  const resolveForm = resolveDialog.querySelector('#resolveIssueForm');
  resolveForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const comment = document.getElementById('resolutionComment').value;
    
    // Update issue status
    issue.status = 'resolved';
    issue.updates.push({
      id: `UPDATE-${Date.now().toString(36)}`,
      date: new Date().toISOString(),
      status: 'Resolved',
      comment: comment,
      by: roleToDisplayName(authorityState.currentAuthority.role)
    });
    
    // Save updated issues
    allIssues[issueIndex] = issue;
    localStorage.setItem('issues', JSON.stringify(allIssues));
    
    // Close dialog
    document.body.removeChild(resolveDialog);
    
    // Show notification
    showNotification('Issue has been marked as resolved', 'success');
    
    // Reload issues list
    const issuesList = document.getElementById('issuesList');
    const pendingIssuesCount = document.getElementById('pendingIssuesCount');
    loadAuthorityIssues(issuesList, pendingIssuesCount);
  });
}

// View issue details with history
function viewIssueDetails(issueId) {
  const allIssues = JSON.parse(localStorage.getItem('issues')) || [];
  const issue = allIssues.find(issue => issue.id === issueId);
  
  if (!issue) {
    showNotification('Issue not found', 'error');
    return;
  }
  
  // Show issue details dialog
  const detailsDialog = document.createElement('div');
  detailsDialog.className = 'modal active';
  
  const statusClass = getStatusClass(issue.status);
  
  detailsDialog.innerHTML = `
    <div class="modal-content modal-lg">
      <span class="close-modal">&times;</span>
      <h2>Issue #${issue.id} Details</h2>
      
      <div class="issue-details-card">
        <div class="issue-card-header">
          <div>
            <h3>${issue.type}</h3>
          </div>
          <div class="issue-status ${statusClass}">${issue.status}</div>
        </div>
        
        <div class="issue-section">
          <h4>Description</h4>
          <p>${issue.description}</p>
        </div>
        
        <div class="grid-2">
          <div class="issue-section">
            <h4>Location</h4>
            <p><i class="fas fa-map-marker-alt"></i> ${issue.location}, Ward ${issue.ward}</p>
          </div>
          <div class="issue-section">
            <h4>Reported On</h4>
            <p><i class="fas fa-calendar-alt"></i> ${new Date(issue.dateSubmitted).toLocaleDateString()}</p>
          </div>
        </div>
        
        ${issue.images && issue.images.length > 0 ? `
          <div class="issue-section">
            <h4>Images</h4>
            <div class="issue-images">
              ${issue.images.map((img, i) => `
                <div class="issue-image">
                  <img src="${img}" alt="Issue image ${i+1}">
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
        
        <div class="issue-section">
          <h4>Updates Timeline</h4>
          <div class="issue-timeline">
            ${issue.updates.map(update => `
              <div class="timeline-item">
                <div class="timeline-icon">
                  <i class="fas ${getTimelineIcon(update.status)}"></i>
                </div>
                <div class="timeline-content">
                  <div class="timeline-header">
                    <h5>${update.status}</h5>
                    <small>${new Date(update.date).toLocaleString()}</small>
                  </div>
                  <p>${update.comment}</p>
                  <div class="timeline-footer">
                    <small>By ${update.by}</small>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(detailsDialog);
  
  // Handle close button
  const closeBtn = detailsDialog.querySelector('.close-modal');
  closeBtn.addEventListener('click', () => {
    document.body.removeChild(detailsDialog);
  });
}

// Get icon for timeline based on status
function getTimelineIcon(status) {
  status = status.toLowerCase();
  
  if (status.includes('submit') || status.includes('reported')) {
    return 'fa-file-alt';
  } else if (status.includes('review') || status.includes('forward')) {
    return 'fa-search';
  } else if (status.includes('progress')) {
    return 'fa-tools';
  } else if (status.includes('resolved')) {
    return 'fa-check-circle';
  } else if (status.includes('reject') || status.includes('closed')) {
    return 'fa-times-circle';
  } else {
    return 'fa-info-circle';
  }
}

// Setup dashboard events
function setupDashboardEvents() {
  const logoutBtn = document.getElementById('logoutBtn');
  const contentForm = document.getElementById('contentForm');
  
  // Logout button
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      authorityLogout();
    });
  }
  
  // Content form submission
  if (contentForm) {
    contentForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const contentType = document.getElementById('contentType').value;
      const contentTitle = document.getElementById('contentTitle').value;
      const contentDescription = document.getElementById('contentDescription').value;
      const contentPriority = document.getElementById('contentPriority')?.value || 'normal';
      
      // Process form based on content type
      saveAuthorityContent(contentType, contentTitle, contentDescription, contentPriority);
    });
  }
}

// Load content for a specific tab
function loadContentForTab(tabId) {
  const contentList = document.getElementById(`${tabId}List`);
  if (!contentList) return;
  
  const contentItems = JSON.parse(localStorage.getItem(`content_${tabId}`)) || [];
  
  // Clear previous content
  contentList.innerHTML = '';
  
  // No content case
  if (contentItems.length === 0) {
    contentList.innerHTML = `
      <div class="no-content-message">
        <i class="fas fa-info-circle"></i>
        <p>No ${tabId} content has been added yet.</p>
      </div>
    `;
    return;
  }
  
  // Display content items
  contentItems.forEach(item => {
    const contentCard = document.createElement('div');
    contentCard.className = 'content-card';
    
    // Build card based on content type
    let cardContent = '';
    
    if (tabId === 'budget') {
      cardContent = `
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <div class="content-details">${item.details || ''}</div>
      `;
    } else if (tabId === 'history') {
      cardContent = `
        <h3>${item.title}</h3>
        <div class="content-year">${item.year || 'N/A'}</div>
        <div class="content-text">${item.description}</div>
      `;
    } else if (tabId === 'resources') {
      cardContent = `
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        ${item.link ? `<a href="${item.link}" target="_blank" class="resource-link"><i class="fas fa-external-link-alt"></i> Access Resource</a>` : ''}
      `;
    } else if (tabId === 'announcements') {
      const priorityClass = item.priority === 'high' ? 'priority-high' : (item.priority === 'medium' ? 'priority-medium' : 'priority-normal');
      
      cardContent = `
        <h3>${item.title}</h3>
        <div class="announcement-date"><i class="fas fa-calendar-day"></i> ${item.date || new Date(item.dateCreated).toLocaleDateString()}</div>
        <div class="announcement-priority ${priorityClass}">
          <i class="fas fa-exclamation-circle"></i> ${item.priority.charAt(0).toUpperCase() + item.priority.slice(1)} Priority
        </div>
        <div class="announcement-content">${item.description}</div>
      `;
    } else {
      // Default content card
      cardContent = `
        <h3>${item.title}</h3>
        <p>${item.description}</p>
      `;
    }
    
    // Add meta information and actions
    contentCard.innerHTML = `
      <div class="content-header">
        ${cardContent}
      </div>
      <div class="content-meta">
        <span>
          <i class="fas fa-user-shield"></i> Posted by ${item.createdBy} (${roleToDisplayName(item.authorityRole)})
        </span>
        <span>
          <i class="fas fa-calendar-alt"></i> ${new Date(item.dateCreated).toLocaleDateString()}
        </span>
      </div>
      <div class="content-actions">
        <button class="btn btn-sm btn-primary edit-content-btn" data-id="${item.id}" data-type="${tabId}">
          <i class="fas fa-edit"></i> Edit
        </button>
        <button class="btn btn-sm btn-danger delete-content-btn" data-id="${item.id}" data-type="${tabId}">
          <i class="fas fa-trash"></i> Delete
        </button>
      </div>
    `;
    
    contentList.appendChild(contentCard);
  });
  
  // Add event listeners for content actions
  contentList.querySelectorAll('.edit-content-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const contentId = this.getAttribute('data-id');
      const contentType = this.getAttribute('data-type');
      editContent(contentId, contentType);
    });
  });
  
  contentList.querySelectorAll('.delete-content-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      const contentId = this.getAttribute('data-id');
      const contentType = this.getAttribute('data-type');
      deleteContent(contentId, contentType);
    });
  });
}

// Save content posted by authority
function saveAuthorityContent(contentType, title, description, priority = 'normal') {
  if (!contentType || !title || !description) {
    showNotification('Please fill in all required fields', 'error');
    return;
  }
  
  // Get additional fields based on content type
  let contentData = {
    id: `content_${Date.now()}`,
    title,
    description,
    dateCreated: new Date().toISOString(),
    createdBy: authorityState.currentAuthority.name,
    authorityRole: authorityState.currentAuthority.role
  };
  
  // Add specific fields based on content type
  if (contentType === 'budget') {
    const budgetYear = document.getElementById('budgetYear')?.value;
    const budgetAmount = document.getElementById('budgetAmount')?.value;
    const budgetDetails = document.getElementById('budgetDetails')?.value;
    
    contentData = {
      ...contentData,
      year: budgetYear,
      amount: budgetAmount,
      details: budgetDetails
    };
  } else if (contentType === 'history') {
    const historyYear = document.getElementById('historyYear')?.value;
    
    contentData = {
      ...contentData,
      year: historyYear
    };
  } else if (contentType === 'resources') {
    const resourceLink = document.getElementById('resourceLink')?.value;
    const resourceType = document.getElementById('resourceType')?.value;
    
    contentData = {
      ...contentData,
      link: resourceLink,
      type: resourceType
    };
  } else if (contentType === 'announcements') {
    contentData = {
      ...contentData,
      priority: priority,
      date: new Date().toLocaleDateString()
    };
  }
  
  // Save to localStorage
  const contentKey = `content_${contentType}`;
  const existingContent = JSON.parse(localStorage.getItem(contentKey)) || [];
  existingContent.push(contentData);
  localStorage.setItem(contentKey, JSON.stringify(existingContent));
  
  // Show notification
  showNotification(`${contentType.charAt(0).toUpperCase() + contentType.slice(1)} content has been saved successfully`, 'success');
  
  // Reset form
  document.getElementById('contentForm').reset();
  
  // Reload content list
  loadContentForTab(contentType);
}

// Edit existing content
function editContent(contentId, contentType) {
  const contentKey = `content_${contentType}`;
  const contentItems = JSON.parse(localStorage.getItem(contentKey)) || [];
  const contentItem = contentItems.find(item => item.id === contentId);
  
  if (!contentItem) {
    showNotification('Content not found', 'error');
    return;
  }
  
  // Show edit dialog
  const editDialog = document.createElement('div');
  editDialog.className = 'modal active';
  
  // Create form fields based on content type
  let additionalFields = '';
  
  if (contentType === 'budget') {
    additionalFields = `
      <div class="form-row">
        <label for="editBudgetYear">Budget Year</label>
        <input type="text" id="editBudgetYear" value="${contentItem.year || ''}">
      </div>
      <div class="form-row">
        <label for="editBudgetAmount">Budget Amount</label>
        <input type="text" id="editBudgetAmount" value="${contentItem.amount || ''}">
      </div>
      <div class="form-row">
        <label for="editBudgetDetails">Budget Details</label>
        <textarea id="editBudgetDetails" rows="4">${contentItem.details || ''}</textarea>
      </div>
    `;
  } else if (contentType === 'history') {
    additionalFields = `
      <div class="form-row">
        <label for="editHistoryYear">Year</label>
        <input type="text" id="editHistoryYear" value="${contentItem.year || ''}">
      </div>
    `;
  } else if (contentType === 'resources') {
    additionalFields = `
      <div class="form-row">
        <label for="editResourceLink">Resource Link</label>
        <input type="url" id="editResourceLink" value="${contentItem.link || ''}">
      </div>
      <div class="form-row">
        <label for="editResourceType">Resource Type</label>
        <select id="editResourceType">
          <option value="document" ${contentItem.type === 'document' ? 'selected' : ''}>Document</option>
          <option value="video" ${contentItem.type === 'video' ? 'selected' : ''}>Video</option>
          <option value="link" ${contentItem.type === 'link' ? 'selected' : ''}>Link</option>
          <option value="other" ${contentItem.type === 'other' ? 'selected' : ''}>Other</option>
        </select>
      </div>
    `;
  } else if (contentType === 'announcements') {
    additionalFields = `
      <div class="form-row">
        <label for="editAnnouncementPriority">Priority</label>
        <select id="editAnnouncementPriority">
          <option value="normal" ${contentItem.priority === 'normal' ? 'selected' : ''}>Normal</option>
          <option value="medium" ${contentItem.priority === 'medium' ? 'selected' : ''}>Medium</option>
          <option value="high" ${contentItem.priority === 'high' ? 'selected' : ''}>High</option>
        </select>
      </div>
    `;
  }
  
  editDialog.innerHTML = `
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      <h2>Edit ${contentType.charAt(0).toUpperCase() + contentType.slice(1)}</h2>
      
      <form id="editContentForm">
        <div class="form-row">
          <label for="editContentTitle">Title</label>
          <input type="text" id="editContentTitle" value="${contentItem.title}" required>
        </div>
        <div class="form-row">
          <label for="editContentDescription">Description</label>
          <textarea id="editContentDescription" rows="4" required>${contentItem.description}</textarea>
        </div>
        
        ${additionalFields}
        
        <div class="form-actions">
          <button type="button" class="btn btn-outline-accent" id="cancelEdit">Cancel</button>
          <button type="submit" class="btn btn-primary">
            <i class="fas fa-save"></i> Save Changes
          </button>
        </div>
      </form>
    </div>
  `;
  
  document.body.appendChild(editDialog);
  
  // Handle close button
  const closeBtn = editDialog.querySelector('.close-modal');
  closeBtn.addEventListener('click', () => {
    document.body.removeChild(editDialog);
  });
  
  // Handle cancel button
  const cancelBtn = editDialog.querySelector('#cancelEdit');
  cancelBtn.addEventListener('click', () => {
    document.body.removeChild(editDialog);
  });
  
  // Handle form submission
  const editForm = editDialog.querySelector('#editContentForm');
  editForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = document.getElementById('editContentTitle').value;
    const description = document.getElementById('editContentDescription').value;
    
    // Update common fields
    contentItem.title = title;
    contentItem.description = description;
    
    // Update specific fields based on content type
    if (contentType === 'budget') {
      contentItem.year = document.getElementById('editBudgetYear').value;
      contentItem.amount = document.getElementById('editBudgetAmount').value;
      contentItem.details = document.getElementById('editBudgetDetails').value;
    } else if (contentType === 'history') {
      contentItem.year = document.getElementById('editHistoryYear').value;
    } else if (contentType === 'resources') {
      contentItem.link = document.getElementById('editResourceLink').value;
      contentItem.type = document.getElementById('editResourceType').value;
    } else if (contentType === 'announcements') {
      contentItem.priority = document.getElementById('editAnnouncementPriority').value;
    }
    
    // Save updated content
    const contentIndex = contentItems.findIndex(item => item.id === contentId);
    contentItems[contentIndex] = contentItem;
    localStorage.setItem(contentKey, JSON.stringify(contentItems));
    
    // Close dialog
    document.body.removeChild(editDialog);
    
    // Show notification
    showNotification('Content has been updated successfully', 'success');
    
    // Reload content list
    loadContentForTab(contentType);
  });
}

// Delete content
function deleteContent(contentId, contentType) {
  const contentKey = `content_${contentType}`;
  const contentItems = JSON.parse(localStorage.getItem(contentKey)) || [];
  
  // Show confirm dialog
  const confirmDialog = document.createElement('div');
  confirmDialog.className = 'modal active';
  confirmDialog.innerHTML = `
    <div class="modal-content">
      <span class="close-modal">&times;</span>
      <h2>Delete ${contentType.charAt(0).toUpperCase() + contentType.slice(1)}</h2>
      <p class="mb-4">Are you sure you want to delete this content? This action cannot be undone.</p>
      
      <div class="form-actions">
        <button class="btn btn-outline-accent" id="cancelDelete">Cancel</button>
        <button class="btn btn-danger" id="confirmDelete">
          <i class="fas fa-trash"></i> Delete
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(confirmDialog);
  
  // Handle close button
  const closeBtn = confirmDialog.querySelector('.close-modal');
  closeBtn.addEventListener('click', () => {
    document.body.removeChild(confirmDialog);
  });
  
  // Handle cancel button
  const cancelBtn = confirmDialog.querySelector('#cancelDelete');
  cancelBtn.addEventListener('click', () => {
    document.body.removeChild(confirmDialog);
  });
  
  // Handle confirm button
  const confirmBtn = confirmDialog.querySelector('#confirmDelete');
  confirmBtn.addEventListener('click', () => {
    // Filter out the deleted item
    const updatedItems = contentItems.filter(item => item.id !== contentId);
    localStorage.setItem(contentKey, JSON.stringify(updatedItems));
    
    // Close dialog
    document.body.removeChild(confirmDialog);
    
    // Show notification
    showNotification('Content has been deleted successfully', 'success');
    
    // Reload content list
    loadContentForTab(contentType);
  });
}

// Authority logout function
function authorityLogout() {
  authorityState.isLoggedIn = false;
  authorityState.currentAuthority = null;
  
  // Clear localStorage
  localStorage.removeItem('authority_isLoggedIn');
  localStorage.removeItem('authority_currentUser');
  
  // Show notification
  if (window.showNotification) {
    window.showNotification('You have been logged out successfully', 'info');
  }
  
  // Redirect to login page
  window.location.href = 'authorities-login.html';
}

// Helper function to convert role to display name
function roleToDisplayName(role) {
  if (!role) return 'Authority';
  
  switch(role) {
    case 'sarpanch': return 'Sarpanch';
    case 'uppasarpanch': return 'Uppasarpanch';
    case 'wardmember': return 'Ward Member';
    default: return role.charAt(0).toUpperCase() + role.slice(1);
  }
}

// Helper function to get status CSS class
function getStatusClass(status) {
  switch (status.toLowerCase()) {
    case 'submitted':
      return 'reported';
    case 'in-review':
      return 'in-review';
    case 'in-progress':
      return 'in-progress';
    case 'resolved':
      return 'resolved';
    case 'rejected':
    case 'closed':
      return 'closed';
    default:
      return 'reported';
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initAuthority);
