
// Authorities Module
const authoritiesModule = (function() {
  // State Management
  const state = {
    currentAuthority: null,
    issues: [],
    menuSection: 'pending-issues',
    contentItems: {
      budget: [],
      history: [],
      resources: [],
      announcements: []
    }
  };

  // Authority role credentials
  const authorityCredentials = {
    sarpanch: { password: "sarpanch", level: 3 },
    uppasarpanch: { password: "uppasarpanch", level: 2 },
    wardmember: { password: "wardmember", level: 1 }
  };

  // DOM Elements
  const DOM = {
    // Login form
    authoritiesLoginForm: document.getElementById('authoritiesLoginForm'),
    
    // Dashboard elements
    authorityName: document.getElementById('authorityName'),
    authorityLogoutBtn: document.getElementById('authorityLogoutBtn'),
    menuItems: document.querySelectorAll('.menu-item'),
    dashboardSections: document.querySelectorAll('.dashboard-section'),
    
    // Issue counters
    pendingCount: document.getElementById('pendingCount'),
    inProgressCount: document.getElementById('inProgressCount'),
    resolvedCount: document.getElementById('resolvedCount'),
    
    // Issue lists
    pendingIssuesList: document.getElementById('pendingIssuesList'),
    inProgressIssuesList: document.getElementById('inProgressIssuesList'),
    resolvedIssuesList: document.getElementById('resolvedIssuesList'),
    
    // Issue details modal
    issueDetailsModal: document.getElementById('issueDetailsModal'),
    closeIssueModal: document.getElementById('closeIssueModal'),
    issueDetailsContent: document.getElementById('issueDetailsContent'),
    
    // Content management buttons
    saveBudgetBtn: document.getElementById('saveBudgetBtn'),
    saveHistoryBtn: document.getElementById('saveHistoryBtn'),
    saveResourceBtn: document.getElementById('saveResourceBtn'),
    saveAnnouncementBtn: document.getElementById('saveAnnouncementBtn'),
    saveProfileBtn: document.getElementById('saveProfileBtn')
  };

  // Initialize the module
  function init() {
    // Check if we're on the login page or dashboard
    if (DOM.authoritiesLoginForm) {
      initLoginPage();
    } else if (DOM.authorityLogoutBtn) {
      initDashboard();
    }
  }

  // Initialize login page functionality
  function initLoginPage() {
    // Check if already logged in as authority
    const savedAuthority = localStorage.getItem('currentAuthority');
    if (savedAuthority) {
      // Redirect to dashboard
      window.location.href = 'authorities-dashboard.html';
      return;
    }

    // Handle login form submission
    DOM.authoritiesLoginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const role = document.getElementById('authorityRole').value;
      const email = document.getElementById('authorityEmail').value;
      const password = document.getElementById('authorityPassword').value;
      
      // Validate against predefined credentials
      if (!role || !email || !password) {
        displayNotification('Please fill in all fields', 'warning');
        return;
      }
      
      // Check if role exists and password matches
      if (authorityCredentials[role] && authorityCredentials[role].password === password) {
        // Create authority object
        const authority = {
          id: generateId(),
          name: email.split('@')[0].replace(/\./g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
          email: email,
          role: role,
          level: authorityCredentials[role].level,
          position: roleToPosition(role),
          dateJoined: new Date().toISOString()
        };
        
        // Save to localStorage
        localStorage.setItem('currentAuthority', JSON.stringify(authority));
        
        // Show success message
        displayNotification('Login successful. Redirecting to dashboard...', 'success');
        
        // Redirect to dashboard
        setTimeout(() => {
          window.location.href = 'authorities-dashboard.html';
        }, 1500);
      } else {
        displayNotification('Invalid credentials. Please try again.', 'error');
      }
    });
  }

  // Convert role to position title
  function roleToPosition(role) {
    switch(role) {
      case 'sarpanch': return 'Sarpanch';
      case 'uppasarpanch': return 'Uppasarpanch';
      case 'wardmember': return 'Ward Member';
      default: return 'Village Authority';
    }
  }

  // Initialize dashboard functionality
  function initDashboard() {
    // Load authority data
    const savedAuthority = localStorage.getItem('currentAuthority');
    if (!savedAuthority) {
      // Not logged in, redirect to login page
      window.location.href = 'authorities-login.html';
      return;
    }
    
    state.currentAuthority = JSON.parse(savedAuthority);
    
    if (DOM.authorityName) {
      DOM.authorityName.textContent = state.currentAuthority.name;
    }
    
    // Load issues from localStorage
    loadIssues();
    
    // Load content items
    loadContentItems();
    
    // Set up event listeners
    setupEventListeners();
    
    // Initialize the dashboard UI
    updateIssueCounters();
    populateIssueLists();
    
    // Adjust UI based on authority level
    adjustUIForAuthorityLevel();
  }

  // Adjust UI elements based on authority level
  function adjustUIForAuthorityLevel() {
    const level = state.currentAuthority.level;
    
    // Handle issue assignment based on authority level
    if (level < 3) { // Not Sarpanch
      const resolveButtons = document.querySelectorAll('.resolve-issue-btn');
      resolveButtons.forEach(btn => {
        btn.disabled = true;
        btn.title = "Only Sarpanch can resolve issues";
      });
    }
    
    if (level < 2) { // Ward Member
      const escalateToSarpanchButtons = document.querySelectorAll('.escalate-sarpanch-btn');
      escalateToSarpanchButtons.forEach(btn => {
        btn.disabled = true;
        btn.title = "Only Uppasarpanch can escalate to Sarpanch";
      });
    }
  }

  // Set up dashboard event listeners
  function setupEventListeners() {
    // Logout button
    if (DOM.authorityLogoutBtn) {
      DOM.authorityLogoutBtn.addEventListener('click', function() {
        localStorage.removeItem('currentAuthority');
        displayNotification('Logged out successfully', 'info');
        window.location.href = 'authorities-login.html';
      });
    }
    
    // Menu item clicks
    if (DOM.menuItems) {
      DOM.menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
          e.preventDefault();
          
          const section = this.getAttribute('data-section');
          changeActiveSection(section);
        });
      });
    }
    
    // Close issue details modal
    if (DOM.closeIssueModal) {
      DOM.closeIssueModal.addEventListener('click', function() {
        DOM.issueDetailsModal.classList.remove('active');
      });
    }
    
    // Content form submissions
    if (DOM.saveBudgetBtn) {
      DOM.saveBudgetBtn.addEventListener('click', saveBudgetItem);
    }
    
    if (DOM.saveHistoryBtn) {
      DOM.saveHistoryBtn.addEventListener('click', saveHistoryItem);
    }
    
    if (DOM.saveResourceBtn) {
      DOM.saveResourceBtn.addEventListener('click', saveResourceItem);
    }
    
    if (DOM.saveAnnouncementBtn) {
      DOM.saveAnnouncementBtn.addEventListener('click', saveAnnouncementItem);
    }
    
    if (DOM.saveProfileBtn) {
      DOM.saveProfileBtn.addEventListener('click', saveProfileSettings);
    }
    
    // Content type change
    const resourceType = document.getElementById('resourceType');
    if (resourceType) {
      resourceType.addEventListener('change', function() {
        const linkRow = document.getElementById('resourceLinkRow');
        if (this.value === 'link') {
          linkRow.style.display = 'block';
        } else {
          linkRow.style.display = 'none';
        }
      });
    }
    
    // File uploads
    setupFileUploads();
  }

  // Load issues from localStorage
  function loadIssues() {
    const savedIssues = localStorage.getItem('issues');
    state.issues = savedIssues ? JSON.parse(savedIssues) : [];
  }

  // Load content items
  function loadContentItems() {
    // Load from localStorage
    ['budget', 'history', 'resources', 'announcements'].forEach(type => {
      const saved = localStorage.getItem(`content_${type}`);
      state.contentItems[type] = saved ? JSON.parse(saved) : [];
    });
  }

  // Change active section
  function changeActiveSection(sectionId) {
    // Update menu items
    if (DOM.menuItems) {
      DOM.menuItems.forEach(item => {
        if (item.getAttribute('data-section') === sectionId) {
          item.classList.add('active');
        } else {
          item.classList.remove('active');
        }
      });
    }
    
    // Update visible section
    if (DOM.dashboardSections) {
      DOM.dashboardSections.forEach(section => {
        if (section.id === sectionId) {
          section.classList.add('active');
        } else {
          section.classList.remove('active');
        }
      });
    }
    
    state.menuSection = sectionId;
  }

  // Update issue counters
  function updateIssueCounters() {
    // Count issues by status
    let pendingCount = 0;
    let inProgressCount = 0;
    let resolvedCount = 0;
    
    state.issues.forEach(issue => {
      const status = issue.status.toLowerCase();
      if (status === 'submitted') {
        pendingCount++;
      } else if (status === 'in-progress' || status === 'in-review') {
        inProgressCount++;
      } else if (status === 'resolved' || status === 'closed') {
        resolvedCount++;
      }
    });
    
    // Update DOM
    if (DOM.pendingCount) DOM.pendingCount.textContent = pendingCount;
    if (DOM.inProgressCount) DOM.inProgressCount.textContent = inProgressCount;
    if (DOM.resolvedCount) DOM.resolvedCount.textContent = resolvedCount;
  }

  // Filter issues based on authority level
  function getIssuesForCurrentAuthority() {
    const level = state.currentAuthority.level;
    
    return state.issues.filter(issue => {
      // Ward Members can only see newly submitted issues
      if (level === 1) {
        return issue.status.toLowerCase() === 'submitted' || 
               issue.assignedTo === state.currentAuthority.role;
      }
      
      // Uppasarpanch can see issues escalated to them or higher
      if (level === 2) {
        return issue.status.toLowerCase() === 'submitted' || 
               issue.status.toLowerCase() === 'in-review' ||
               issue.escalationLevel >= 2 ||
               issue.assignedTo === state.currentAuthority.role;
      }
      
      // Sarpanch can see all issues
      return true;
    });
  }

  // Populate issue lists
  function populateIssueLists() {
    // Clear existing lists
    if (DOM.pendingIssuesList) DOM.pendingIssuesList.innerHTML = '';
    if (DOM.inProgressIssuesList) DOM.inProgressIssuesList.innerHTML = '';
    if (DOM.resolvedIssuesList) DOM.resolvedIssuesList.innerHTML = '';
    
    // Get filtered issues for current authority
    const filteredIssues = getIssuesForCurrentAuthority();
    
    // Group issues by status
    const pending = [];
    const inProgress = [];
    const resolved = [];
    
    filteredIssues.forEach(issue => {
      const status = issue.status.toLowerCase();
      if (status === 'submitted') {
        pending.push(issue);
      } else if (status === 'in-progress' || status === 'in-review') {
        inProgress.push(issue);
      } else if (status === 'resolved' || status === 'closed') {
        resolved.push(issue);
      }
    });
    
    // Populate lists
    if (DOM.pendingIssuesList) {
      if (pending.length === 0) {
        DOM.pendingIssuesList.innerHTML = '<div class="empty-message">No pending issues at this time.</div>';
      } else {
        pending.forEach(issue => {
          DOM.pendingIssuesList.appendChild(createIssueCard(issue));
        });
      }
    }
    
    if (DOM.inProgressIssuesList) {
      if (inProgress.length === 0) {
        DOM.inProgressIssuesList.innerHTML = '<div class="empty-message">No issues in progress at this time.</div>';
      } else {
        inProgress.forEach(issue => {
          DOM.inProgressIssuesList.appendChild(createIssueCard(issue));
        });
      }
    }
    
    if (DOM.resolvedIssuesList) {
      if (resolved.length === 0) {
        DOM.resolvedIssuesList.innerHTML = '<div class="empty-message">No resolved issues to show.</div>';
      } else {
        resolved.forEach(issue => {
          DOM.resolvedIssuesList.appendChild(createIssueCard(issue));
        });
      }
    }
  }

  // Create issue card element
  function createIssueCard(issue) {
    const card = document.createElement('div');
    card.className = 'issue-card';
    card.setAttribute('data-issue-id', issue.id);
    
    const statusClass = getStatusClass(issue.status);
    
    card.innerHTML = `
      <div class="issue-card-header">
        <div>
          <h3>${issue.type}</h3>
          <p>Reference ID: #${issue.id}</p>
        </div>
        <div class="issue-status ${statusClass}">${issue.status}</div>
      </div>
      <p class="issue-description">${issue.description}</p>
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
      <div class="issue-actions">
        <button class="btn btn-primary">
          <i class="fas fa-eye"></i> View Details
        </button>
      </div>
    `;
    
    // Add click event
    card.addEventListener('click', function() {
      showIssueDetails(issue.id);
    });
    
    return card;
  }

  // Show issue details in modal
  function showIssueDetails(issueId) {
    // Find the issue
    const issue = state.issues.find(issue => issue.id === issueId);
    if (!issue) return;
    
    // Determine available actions based on authority level
    const authorityLevel = state.currentAuthority.level;
    const canResolve = authorityLevel === 3; // Only Sarpanch can resolve
    const canEscalateToSarpanch = authorityLevel >= 2; // Uppasarpanch or Sarpanch
    const canTakeAction = authorityLevel >= 1; // Any authority
    
    // Populate modal content
    if (DOM.issueDetailsContent) {
      DOM.issueDetailsContent.innerHTML = `
        <div class="issue-card-header">
          <div>
            <h2>${issue.type}</h2>
            <p>Reference ID: #${issue.id}</p>
          </div>
          <div class="issue-status ${getStatusClass(issue.status)}">${issue.status}</div>
        </div>
        
        <div class="mt-6">
          <h3>Description</h3>
          <p>${issue.description}</p>
        </div>
        
        <div class="grid-2 mt-6">
          <div>
            <h3>Location</h3>
            <div class="flex items-center gap-2">
              <i class="fas fa-map-marker-alt text-terracotta"></i>
              <span>${issue.location}, Ward ${issue.ward}</span>
            </div>
          </div>
          <div>
            <h3>Date Submitted</h3>
            <div class="flex items-center gap-2">
              <i class="fas fa-clock text-terracotta"></i>
              <span>${new Date(issue.dateSubmitted).toLocaleString()}</span>
            </div>
          </div>
        </div>
        
        ${issue.images && issue.images.length > 0 ? `
          <div class="mt-6">
            <h3>Uploaded Images</h3>
            <div class="issue-images">
              ${issue.images.map((image, index) => `
                <div class="issue-image">
                  <img src="${image}" alt="Issue image ${index + 1}">
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
        
        <div class="issue-timeline">
          <h3>Issue Timeline</h3>
          ${renderIssueTimeline(issue)}
        </div>
        
        <div class="issue-response-form">
          <h3>Respond to Issue</h3>
          <div class="response-options">
            ${canTakeAction ? `
              <div class="response-option" data-status="in-review">
                <i class="fas fa-search"></i>
                <span>Mark as In Review</span>
              </div>
              <div class="response-option" data-status="in-progress">
                <i class="fas fa-tools"></i>
                <span>Mark as In Progress</span>
              </div>
            ` : ''}
            
            ${canEscalateToSarpanch ? `
              <div class="response-option escalate-sarpanch-btn" data-status="escalated-sarpanch">
                <i class="fas fa-level-up-alt"></i>
                <span>Escalate to Sarpanch</span>
              </div>
            ` : ''}
            
            ${canResolve ? `
              <div class="response-option resolve-issue-btn" data-status="resolved">
                <i class="fas fa-check-circle"></i>
                <span>Mark as Resolved</span>
              </div>
            ` : ''}
          </div>
          
          <div class="form-row">
            <label for="responseComment">Add a Comment</label>
            <textarea id="responseComment" class="form-textarea" rows="4" placeholder="Add details about the action taken or status update"></textarea>
          </div>
          
          <div class="form-actions">
            <button id="submitResponseBtn" class="btn btn-primary">
              <i class="fas fa-paper-plane"></i> Submit Response
            </button>
          </div>
        </div>
      `;
    
      // Show the modal
      if (DOM.issueDetailsModal) {
        DOM.issueDetailsModal.classList.add('active');
      }
      
      // Add event listeners for response options
      const responseOptions = DOM.issueDetailsContent.querySelectorAll('.response-option');
      responseOptions.forEach(option => {
        option.addEventListener('click', function() {
          // Remove selected class from all options
          responseOptions.forEach(opt => opt.classList.remove('selected'));
          // Add selected class to clicked option
          this.classList.add('selected');
        });
      });
      
      // Add event listener for submit response button
      const submitResponseBtn = document.getElementById('submitResponseBtn');
      if (submitResponseBtn) {
        submitResponseBtn.addEventListener('click', function() {
          const selectedOption = DOM.issueDetailsContent.querySelector('.response-option.selected');
          if (!selectedOption) {
            displayNotification('Please select a status update option', 'warning');
            return;
          }
          
          const newStatus = selectedOption.getAttribute('data-status');
          const comment = document.getElementById('responseComment').value;
          
          if (!comment.trim()) {
            displayNotification('Please add a comment with details', 'warning');
            return;
          }
          
          // Update the issue with proper escalation tracking
          updateIssueStatus(issue.id, newStatus, comment);
          
          // Close the modal
          if (DOM.issueDetailsModal) {
            DOM.issueDetailsModal.classList.remove('active');
          }
        });
      }
    }
  }

  // Render issue timeline
  function renderIssueTimeline(issue) {
    let timelineHTML = '<div class="timeline">';
    
    issue.updates.forEach(update => {
      timelineHTML += `
        <div class="timeline-item completed">
          <div class="timeline-icon">
            <i class="fas fa-${getStatusIcon(update.status)}"></i>
          </div>
          <div class="timeline-content">
            <div class="timeline-header">
              <h4>${update.status}</h4>
              <span>${new Date(update.date).toLocaleString()}</span>
            </div>
            <p>${update.comment}</p>
            <div class="text-sm text-gray-500">by ${update.by}</div>
          </div>
        </div>
      `;
    });
    
    timelineHTML += '</div>';
    return timelineHTML;
  }

  // Update issue status
  function updateIssueStatus(issueId, newStatus, comment) {
    // Find the issue
    const issueIndex = state.issues.findIndex(issue => issue.id === issueId);
    if (issueIndex === -1) return;
    
    // Create a copy of the issue
    const updatedIssue = { ...state.issues[issueIndex] };
    
    // Set escalation level based on authority role
    if (newStatus === 'escalated-sarpanch') {
      updatedIssue.escalationLevel = 3;
      updatedIssue.assignedTo = 'sarpanch';
      newStatus = 'in-review'; // Change displayed status
    } else if (newStatus === 'in-review' || newStatus === 'in-progress') {
      updatedIssue.escalationLevel = state.currentAuthority.level;
      updatedIssue.assignedTo = state.currentAuthority.role;
    }
    
    // Update status
    updatedIssue.status = newStatus;
    
    // Add update to timeline
    updatedIssue.updates.push({
      id: generateId(),
      status: getDisplayStatus(newStatus, state.currentAuthority.role),
      date: new Date().toISOString(),
      comment: comment,
      by: `${state.currentAuthority.position} (${state.currentAuthority.name})`
    });
    
    // Update issue in state
    state.issues[issueIndex] = updatedIssue;
    
    // Save to localStorage
    localStorage.setItem('issues', JSON.stringify(state.issues));
    
    // Update UI
    updateIssueCounters();
    populateIssueLists();
    
    displayNotification(`Issue has been updated to "${getDisplayStatus(newStatus, state.currentAuthority.role)}" status`, 'success');
  }

  // Get user-friendly status display
  function getDisplayStatus(status, role) {
    if (status === 'escalated-sarpanch') return 'Escalated to Sarpanch';
    if (status === 'in-review') return `In Review by ${roleToPosition(role)}`;
    if (status === 'in-progress') return `In Progress by ${roleToPosition(role)}`;
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  // Save budget item
  function saveBudgetItem() {
    const title = document.getElementById('budgetTitle').value;
    const description = document.getElementById('budgetDescription').value;
    const details = document.getElementById('budgetDetails').value;
    
    if (!title || !description || !details) {
      displayNotification('Please fill in all required fields', 'warning');
      return;
    }
    
    const budgetItem = {
      id: generateId(),
      title,
      description,
      details,
      dateCreated: new Date().toISOString(),
      createdBy: state.currentAuthority.name,
      authorityRole: state.currentAuthority.role,
      images: getUploadedFileUrls('budgetFilePreview')
    };
    
    // Add to state
    state.contentItems.budget.push(budgetItem);
    
    // Save to localStorage
    localStorage.setItem('content_budget', JSON.stringify(state.contentItems.budget));
    
    // Clear form
    document.getElementById('budgetTitle').value = '';
    document.getElementById('budgetDescription').value = '';
    document.getElementById('budgetDetails').value = '';
    document.getElementById('budgetFilePreview').innerHTML = '';
    
    displayNotification('Budget information has been saved successfully', 'success');
  }

  // Save history item
  function saveHistoryItem() {
    const title = document.getElementById('historyTitle').value;
    const content = document.getElementById('historyContent').value;
    const year = document.getElementById('historyYear').value;
    
    if (!title || !content) {
      displayNotification('Please fill in all required fields', 'warning');
      return;
    }
    
    const historyItem = {
      id: generateId(),
      title,
      content,
      year,
      dateCreated: new Date().toISOString(),
      createdBy: state.currentAuthority.name,
      authorityRole: state.currentAuthority.role,
      images: getUploadedFileUrls('historyFilePreview')
    };
    
    // Add to state
    state.contentItems.history.push(historyItem);
    
    // Save to localStorage
    localStorage.setItem('content_history', JSON.stringify(state.contentItems.history));
    
    // Clear form
    document.getElementById('historyTitle').value = '';
    document.getElementById('historyContent').value = '';
    document.getElementById('historyYear').value = '';
    document.getElementById('historyFilePreview').innerHTML = '';
    
    displayNotification('Historical information has been saved successfully', 'success');
  }

  // Save resource item
  function saveResourceItem() {
    const title = document.getElementById('resourceTitle').value;
    const description = document.getElementById('resourceDescription').value;
    const type = document.getElementById('resourceType').value;
    const link = document.getElementById('resourceLink').value;
    
    if (!title || !description) {
      displayNotification('Please fill in all required fields', 'warning');
      return;
    }
    
    if (type === 'link' && !link) {
      displayNotification('Please provide a link for the resource', 'warning');
      return;
    }
    
    const resourceItem = {
      id: generateId(),
      title,
      description,
      type,
      link,
      dateCreated: new Date().toISOString(),
      createdBy: state.currentAuthority.name,
      authorityRole: state.currentAuthority.role,
      files: getUploadedFileUrls('resourceFilePreview')
    };
    
    // Add to state
    state.contentItems.resources.push(resourceItem);
    
    // Save to localStorage
    localStorage.setItem('content_resources', JSON.stringify(state.contentItems.resources));
    
    // Clear form
    document.getElementById('resourceTitle').value = '';
    document.getElementById('resourceDescription').value = '';
    document.getElementById('resourceType').value = 'document';
    document.getElementById('resourceLink').value = '';
    document.getElementById('resourceFilePreview').innerHTML = '';
    
    displayNotification('Resource has been saved successfully', 'success');
  }

  // Save announcement item
  function saveAnnouncementItem() {
    const title = document.getElementById('announcementTitle').value;
    const content = document.getElementById('announcementContent').value;
    const date = document.getElementById('announcementDate').value;
    const priority = document.getElementById('announcementPriority').value;
    
    if (!title || !content) {
      displayNotification('Please fill in all required fields', 'warning');
      return;
    }
    
    const announcementItem = {
      id: generateId(),
      title,
      content,
      date,
      priority,
      dateCreated: new Date().toISOString(),
      createdBy: state.currentAuthority.name,
      authorityRole: state.currentAuthority.role,
      images: getUploadedFileUrls('announcementFilePreview')
    };
    
    // Add to state
    state.contentItems.announcements.push(announcementItem);
    
    // Save to localStorage
    localStorage.setItem('content_announcements', JSON.stringify(state.contentItems.announcements));
    
    // Clear form
    document.getElementById('announcementTitle').value = '';
    document.getElementById('announcementContent').value = '';
    document.getElementById('announcementDate').value = '';
    document.getElementById('announcementPriority').value = 'normal';
    document.getElementById('announcementFilePreview').innerHTML = '';
    
    displayNotification('Announcement has been published successfully', 'success');
  }

  // Save profile settings
  function saveProfileSettings() {
    const fullName = document.getElementById('authorityFullName').value;
    const position = document.getElementById('authorityPosition').value;
    const email = document.getElementById('authorityContactEmail').value;
    const currentPassword = document.getElementById('authorityCurrentPassword').value;
    const newPassword = document.getElementById('authorityNewPassword').value;
    const confirmPassword = document.getElementById('authorityConfirmPassword').value;
    
    if (!fullName || !position || !email) {
      displayNotification('Please fill in all required fields', 'warning');
      return;
    }
    
    // In a real app, we would verify the current password here
    
    if (newPassword && newPassword !== confirmPassword) {
      displayNotification('New passwords do not match', 'error');
      return;
    }
    
    // Update authority object
    state.currentAuthority.name = fullName;
    state.currentAuthority.position = position;
    state.currentAuthority.email = email;
    
    // Save to localStorage
    localStorage.setItem('currentAuthority', JSON.stringify(state.currentAuthority));
    
    // Update UI
    if (DOM.authorityName) {
      DOM.authorityName.textContent = fullName;
    }
    
    // Clear password fields
    document.getElementById('authorityCurrentPassword').value = '';
    document.getElementById('authorityNewPassword').value = '';
    document.getElementById('authorityConfirmPassword').value = '';
    
    displayNotification('Profile settings have been updated successfully', 'success');
  }

  // Set up file uploads
  function setupFileUploads() {
    const uploadElements = [
      { uploadArea: 'budgetFileUpload', input: 'budget-file-input', preview: 'budgetFilePreview' },
      { uploadArea: 'historyFileUpload', input: 'history-file-input', preview: 'historyFilePreview' },
      { uploadArea: 'resourceFileUpload', input: 'resource-file-input', preview: 'resourceFilePreview' },
      { uploadArea: 'announcementFileUpload', input: 'announcement-file-input', preview: 'announcementFilePreview' }
    ];
    
    uploadElements.forEach(element => {
      const uploadArea = document.getElementById(element.uploadArea);
      const fileInput = document.getElementById(element.input);
      const filePreview = document.getElementById(element.preview);
      
      if (uploadArea && fileInput && filePreview) {
        // Click on upload area to trigger file input
        uploadArea.addEventListener('click', function() {
          fileInput.click();
        });
        
        // Handle file selection
        fileInput.addEventListener('change', function() {
          if (fileInput.files.length > 0) {
            filePreview.innerHTML = '';
            
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
                // Note: We can't actually remove items from a FileList
              });
              
              thumbnail.appendChild(removeBtn);
              filePreview.appendChild(thumbnail);
            });
          }
        });
        
        // Drag and drop functionality
        uploadArea.addEventListener('dragover', function(e) {
          e.preventDefault();
          uploadArea.classList.add('dragover');
        });
        
        uploadArea.addEventListener('dragleave', function() {
          uploadArea.classList.remove('dragover');
        });
        
        uploadArea.addEventListener('drop', function(e) {
          e.preventDefault();
          uploadArea.classList.remove('dragover');
          
          if (e.dataTransfer.files.length > 0) {
            fileInput.files = e.dataTransfer.files;
            // Trigger change event
            const event = new Event('change');
            fileInput.dispatchEvent(event);
          }
        });
      }
    });
  }

  // Get uploaded file URLs
  function getUploadedFileUrls(previewId) {
    const filePreview = document.getElementById(previewId);
    const urls = [];
    
    if (filePreview) {
      const thumbnails = filePreview.querySelectorAll('.file-thumbnail img');
      thumbnails.forEach(thumbnail => {
        urls.push(thumbnail.src);
      });
    }
    
    return urls;
  }

  // Utility functions
  function generateId() {
    return Math.random().toString(36).substring(2, 10);
  }

  function getStatusClass(status) {
    status = status.toLowerCase();
    if (status === 'submitted') return 'reported';
    if (status === 'in-progress' || status === 'in-review') return 'in-progress';
    return 'resolved';
  }

  function getStatusIcon(status) {
    status = status.toLowerCase();
    if (status === 'submitted') return 'file-alt';
    if (status === 'in-review') return 'search';
    if (status === 'in-progress') return 'tools';
    if (status === 'resolved') return 'check-circle';
    if (status === 'closed') return 'lock';
    if (status.includes('escalated')) return 'level-up-alt';
    return 'info-circle';
  }

  // Initialize when DOM is loaded
  document.addEventListener('DOMContentLoaded', init);

  // Return public API
  return {
    init
  };
})();

// Initialize the authorities module when the document is loaded
document.addEventListener('DOMContentLoaded', function() {
  authoritiesModule.init();
});

// Fixed notification function to avoid recursive calls - renamed to displayNotification
function displayNotification(message, type = 'info') {
  // Check if the function is already defined in global scope
  if (typeof window.showNotification === 'function') {
    window.showNotification(message, type);
    return;
  }
  
  const notificationEl = document.getElementById('notification');
  if (!notificationEl) return;
  
  notificationEl.className = `notification ${type}`;
  notificationEl.innerHTML = `
    ${message}
    <span class="notification-close">&times;</span>
  `;
  
  notificationEl.classList.remove('hidden');
  
  // Add close event
  const closeBtn = notificationEl.querySelector('.notification-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      notificationEl.classList.add('fadeOut');
      setTimeout(() => {
        notificationEl.classList.add('hidden');
        notificationEl.classList.remove('fadeOut');
      }, 300);
    });
  }
  
  // Auto-hide after 5 seconds
  setTimeout(() => {
    if (!notificationEl.classList.contains('hidden')) {
      notificationEl.classList.add('fadeOut');
      setTimeout(() => {
        notificationEl.classList.add('hidden');
        notificationEl.classList.remove('fadeOut');
      }, 300);
    }
  }, 5000);
}
