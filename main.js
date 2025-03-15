
// Global state
const appState = {
  isLoggedIn: false,
  currentUser: null,
  redirectAfterLogin: null,
  issues: [],
  currentIssue: null
};

// DOM elements
const loginBtn = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginModal');
const closeModalBtn = document.querySelector('.close-modal');
const loginForm = document.getElementById('loginForm');
const reportIssueBtn = document.getElementById('reportIssueBtn');
const reportIssueCard = document.getElementById('reportIssueCard');
const hamburgerBtn = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const notificationEl = document.getElementById('notification');

// Check if user is logged in (from localStorage)
function init() {
  const savedLogin = localStorage.getItem('isLoggedIn');
  const savedUser = localStorage.getItem('currentUser');
  
  if (savedLogin === 'true' && savedUser) {
    appState.isLoggedIn = true;
    appState.currentUser = JSON.parse(savedUser);
    updateUIForLogin();
  }
  
  // Load issues from localStorage
  const savedIssues = localStorage.getItem('issues');
  if (savedIssues) {
    appState.issues = JSON.parse(savedIssues);
  }
  
  // Page-specific initialization
  const currentPage = window.location.pathname.split('/').pop();
  
  if (currentPage === 'report-issue.html') {
    initReportIssuePage();
  } else if (currentPage === 'issue-tracking.html') {
    initIssueTrackingPage();
  } else if (currentPage === '' || currentPage === 'index.html') {
    initHomePage();
  } else if (currentPage === 'budget.html') {
    loadContentPage('budget');
  } else if (currentPage === 'history.html') {
    loadContentPage('history');
  } else if (currentPage === 'resources.html') {
    loadContentPage('resources');
  } else if (currentPage === 'announcements.html') {
    loadContentPage('announcements');
  }
  
  // Add authorities link to navigation menu (if not already present)
  addAuthoritiesLink();
}

// Load content posted by authorities
function loadContentPage(type) {
  const contentContainer = document.getElementById(`${type}Container`);
  if (!contentContainer) return;
  
  const contentItems = JSON.parse(localStorage.getItem(`content_${type}`)) || [];
  
  if (contentItems.length === 0) {
    contentContainer.innerHTML = `<div class="empty-message">No ${type} information available at this time.</div>`;
    return;
  }
  
  let contentHTML = '';
  
  contentItems.forEach(item => {
    let itemHTML = `
      <div class="content-card">
        <div class="content-header">
          <h3>${item.title}</h3>
          <span class="content-meta">
            <i class="fas fa-user-shield"></i> ${item.createdBy} (${roleToPosition(item.authorityRole)})
          </span>
        </div>
        <div class="content-body">
    `;
    
    // Different content types have different displays
    if (type === 'budget') {
      itemHTML += `
        <p class="content-description">${item.description}</p>
        <div class="content-details">${item.details}</div>
      `;
    } else if (type === 'history') {
      itemHTML += `
        <div class="content-year"><i class="fas fa-calendar-alt"></i> ${item.year}</div>
        <div class="content-text">${item.content}</div>
      `;
    } else if (type === 'resources') {
      itemHTML += `
        <p class="content-description">${item.description}</p>
        ${item.type === 'link' ? `<a href="${item.link}" target="_blank" class="resource-link"><i class="fas fa-external-link-alt"></i> Access Resource</a>` : ''}
      `;
    } else if (type === 'announcements') {
      const priorityClass = item.priority === 'high' ? 'priority-high' : (item.priority === 'medium' ? 'priority-medium' : 'priority-normal');
      
      itemHTML += `
        <div class="announcement-date"><i class="fas fa-calendar-day"></i> ${item.date || new Date(item.dateCreated).toLocaleDateString()}</div>
        <div class="announcement-priority ${priorityClass}">
          <i class="fas fa-exclamation-circle"></i> ${item.priority.charAt(0).toUpperCase() + item.priority.slice(1)} Priority
        </div>
        <div class="announcement-content">${item.content}</div>
      `;
    }
    
    // Add images if available
    const images = item.images || item.files || [];
    if (images && images.length > 0) {
      itemHTML += `
        <div class="content-images">
          ${images.map((img, index) => `
            <div class="content-image">
              <img src="${img}" alt="${item.title} image ${index + 1}">
            </div>
          `).join('')}
        </div>
      `;
    }
    
    itemHTML += `
        </div>
        <div class="content-footer">
          <span class="content-date">Posted on ${new Date(item.dateCreated).toLocaleDateString()}</span>
        </div>
      </div>
    `;
    
    contentHTML += itemHTML;
  });
  
  contentContainer.innerHTML = contentHTML;
}

// Convert authority role to position title
function roleToPosition(role) {
  if (!role) return 'Village Authority';
  
  switch(role) {
    case 'sarpanch': return 'Sarpanch';
    case 'uppasarpanch': return 'Uppasarpanch';
    case 'wardmember': return 'Ward Member';
    default: return 'Village Authority';
  }
}

// Initialize report issue page
function initReportIssuePage() {
  const issueFormContainer = document.getElementById('issueFormContainer');
  const loginRequiredContainer = document.getElementById('loginRequiredContainer');
  const issueSuccessContainer = document.getElementById('issueSuccessContainer');
  const issueForm = document.getElementById('issueForm');
  const uploadBtn = document.getElementById('uploadBtn');
  const fileInput = document.getElementById('file-input');
  const filePreview = document.getElementById('filePreview');
  const loginToReportBtn = document.getElementById('loginToReportBtn');
  const trackIssueBtn = document.getElementById('trackIssueBtn');
  const reportAnotherBtn = document.getElementById('reportAnotherBtn');
  
  // Check if user is logged in
  if (!appState.isLoggedIn) {
    issueFormContainer.classList.add('hidden');
    loginRequiredContainer.classList.remove('hidden');
  }
  
  // Login to report button
  if (loginToReportBtn) {
    loginToReportBtn.addEventListener('click', function() {
      appState.redirectAfterLogin = 'report-issue.html';
      localStorage.setItem('redirectAfterLogin', appState.redirectAfterLogin);
      showLoginModal();
    });
  }
  
  // Track issue button
  if (trackIssueBtn) {
    trackIssueBtn.addEventListener('click', function() {
      window.location.href = 'issue-tracking.html';
    });
  }
  
  // Report another issue button
  if (reportAnotherBtn) {
    reportAnotherBtn.addEventListener('click', function() {
      issueSuccessContainer.classList.add('hidden');
      issueFormContainer.classList.remove('hidden');
      issueForm.reset();
      filePreview.innerHTML = '';
    });
  }
  
  // File upload button
  if (uploadBtn && fileInput) {
    uploadBtn.addEventListener('click', function() {
      fileInput.click();
    });
    
    fileInput.addEventListener('change', function() {
      if (fileInput.files.length > 0) {
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
  
  // Issue form submission
  if (issueForm) {
    issueForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      if (!appState.isLoggedIn) {
        showNotification('Please login to report an issue', 'warning');
        return;
      }
      
      // Get form values
      const issueType = document.getElementById('issueType').value;
      const description = document.getElementById('description').value;
      const ward = document.getElementById('ward').value;
      const location = document.getElementById('location').value;
      
      // Create image URLs for uploaded files
      const imageUrls = [];
      if (fileInput && fileInput.files.length > 0) {
        Array.from(fileInput.files).forEach(file => {
          if (file.type.startsWith('image/')) {
            imageUrls.push(URL.createObjectURL(file));
          }
        });
      }
      
      // Create new issue with the authority escalation workflow
      const newIssue = createIssue(issueType, description, location, ward, imageUrls);
      
      // Save issue to local storage
      appState.issues.push(newIssue);
      localStorage.setItem('issues', JSON.stringify(appState.issues));
      
      // Show success view
      issueFormContainer.classList.add('hidden');
      issueSuccessContainer.classList.remove('hidden');
      
      // Populate issue details in success view
      const submittedIssueDetails = document.getElementById('submittedIssueDetails');
      if (submittedIssueDetails) {
        submittedIssueDetails.innerHTML = `
          <div class="issue-card-header">
            <div>
              <h3>${newIssue.type}</h3>
              <p>Reference ID: #${newIssue.id}</p>
            </div>
            <div class="issue-status reported">Submitted</div>
          </div>
          <p>${newIssue.description}</p>
          <div class="issue-meta">
            <div>
              <i class="fas fa-map-marker-alt"></i>
              <span>${newIssue.location}, Ward ${newIssue.ward}</span>
            </div>
            <div>
              <i class="fas fa-clock"></i>
              <span>${new Date(newIssue.dateSubmitted).toLocaleString()}</span>
            </div>
          </div>
        `;
      }
      
      showNotification('Your issue has been reported successfully!', 'success');
    });
  }
}

// Initialize issue tracking page
function initIssueTrackingPage() {
  const issuesListContainer = document.getElementById('issuesListContainer');
  const issueDetailContainer = document.getElementById('issueDetailContainer');
  const loginRequiredContainer = document.getElementById('loginRequiredContainer');
  const noIssuesMessage = document.getElementById('noIssuesMessage');
  const issuesList = document.getElementById('issuesList');
  const backToListBtn = document.getElementById('backToListBtn');
  const loginToTrackBtn = document.getElementById('loginToTrackBtn');
  const goToReportBtn = document.getElementById('goToReportBtn');
  const commentForm = document.getElementById('commentForm');
  
  // Check if user is logged in
  if (!appState.isLoggedIn) {
    if (issuesListContainer) issuesListContainer.classList.add('hidden');
    if (issueDetailContainer) issueDetailContainer.classList.add('hidden');
    if (loginRequiredContainer) loginRequiredContainer.classList.remove('hidden');
    
    // Login to track button
    if (loginToTrackBtn) {
      loginToTrackBtn.addEventListener('click', function() {
        appState.redirectAfterLogin = 'issue-tracking.html';
        localStorage.setItem('redirectAfterLogin', appState.redirectAfterLogin);
        showLoginModal();
      });
    }
    
    return;
  }
  
  // User is logged in, show appropriate view
  if (loginRequiredContainer) loginRequiredContainer.classList.add('hidden');
  if (issuesListContainer) issuesListContainer.classList.remove('hidden');
  
  // Filter issues for the current user
  const userIssues = appState.issues.filter(issue => {
    return issue.reportedBy === appState.currentUser.id;
  });
  
  // Load user's issues
  if (userIssues.length === 0) {
    if (noIssuesMessage) noIssuesMessage.classList.remove('hidden');
    if (issuesList) issuesList.classList.add('hidden');
    
    // Go to report button
    if (goToReportBtn) {
      goToReportBtn.addEventListener('click', function() {
        window.location.href = 'report-issue.html';
      });
    }
  } else {
    // Display issues
    if (noIssuesMessage) noIssuesMessage.classList.add('hidden');
    if (issuesList) {
      issuesList.classList.remove('hidden');
      issuesList.innerHTML = '';
      
      userIssues.forEach(issue => {
        const issueCard = document.createElement('div');
        issueCard.className = 'issue-list-card';
        issueCard.setAttribute('data-issue-id', issue.id);
        
        issueCard.innerHTML = `
          <div class="issue-card-header">
            <div>
              <h3>${issue.type}</h3>
              <p>Reference ID: #${issue.id}</p>
            </div>
            <div class="issue-status ${getStatusClass(issue.status)}">${issue.status}</div>
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
            <button class="btn btn-text view-details-btn" data-issue-id="${issue.id}">
              View Details
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        `;
        
        issuesList.appendChild(issueCard);
        
        // Add click event to the issue card
        issueCard.addEventListener('click', function() {
          const issueId = this.getAttribute('data-issue-id');
          showIssueDetail(issueId);
        });
      });
      
      // Add click events to view details buttons
      document.querySelectorAll('.view-details-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          const issueId = this.getAttribute('data-issue-id');
          showIssueDetail(issueId);
        });
      });
    }
  }
  
  // Back to list button
  if (backToListBtn) {
    backToListBtn.addEventListener('click', function() {
      issueDetailContainer.classList.add('hidden');
      issuesListContainer.classList.remove('hidden');
      appState.currentIssue = null;
    });
  }
  
  // Comment form submission
  if (commentForm) {
    commentForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      if (!appState.currentIssue) return;
      
      const commentText = document.getElementById('commentText').value;
      if (!commentText.trim()) return;
      
      // Add comment as an update
      const updatedIssue = addIssueUpdate(
        appState.currentIssue,
        appState.currentIssue.status,
        commentText,
        appState.currentUser.name
      );
      
      // Update in state and localStorage
      const issueIndex = appState.issues.findIndex(issue => issue.id === updatedIssue.id);
      if (issueIndex !== -1) {
        appState.issues[issueIndex] = updatedIssue;
        appState.currentIssue = updatedIssue;
        
        localStorage.setItem('issues', JSON.stringify(appState.issues));
        
        // Refresh the issue timeline
        const issueTimeline = document.getElementById('issueTimeline');
        if (issueTimeline) {
          renderIssueTimeline(updatedIssue, issueTimeline);
        }
        
        // Clear the comment form
        document.getElementById('commentText').value = '';
        
        showNotification('Comment added successfully', 'success');
      }
    });
  }
}

// Initialize home page
function initHomePage() {
  const trackUpdatesBtn = document.getElementById('trackUpdatesBtn');
  const exploreResourcesBtn = document.getElementById('exploreResourcesBtn');
  
  // Track updates button
  if (trackUpdatesBtn) {
    trackUpdatesBtn.addEventListener('click', function() {
      if (!appState.isLoggedIn) {
        appState.redirectAfterLogin = 'issue-tracking.html';
        localStorage.setItem('redirectAfterLogin', appState.redirectAfterLogin);
        showLoginModal();
      } else {
        window.location.href = 'issue-tracking.html';
      }
    });
  }
  
  // Explore resources button
  if (exploreResourcesBtn) {
    exploreResourcesBtn.addEventListener('click', function() {
      window.location.href = 'resources.html';
    });
  }
}

// Show issue detail
function showIssueDetail(issueId) {
  const issue = appState.issues.find(i => i.id === issueId);
  if (!issue) return;
  
  appState.currentIssue = issue;
  
  const issuesListContainer = document.getElementById('issuesListContainer');
  const issueDetailContainer = document.getElementById('issueDetailContainer');
  const issueDetailContent = document.getElementById('issueDetailContent');
  const issueTimeline = document.getElementById('issueTimeline');
  
  if (issuesListContainer) issuesListContainer.classList.add('hidden');
  if (issueDetailContainer) issueDetailContainer.classList.remove('hidden');
  
  // Populate issue details
  if (issueDetailContent) {
    issueDetailContent.innerHTML = `
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
      
      ${issue.escalationLevel ? `
        <div class="mt-4">
          <h3>Current Handler</h3>
          <div class="flex items-center gap-2 mt-2">
            <i class="fas fa-user-shield text-terracotta"></i>
            <span>${getAuthorityFromLevel(issue.escalationLevel)}</span>
          </div>
        </div>
      ` : ''}
      
      ${issue.images && issue.images.length > 0 ? `
        <div class="mt-6">
          <h3>Uploaded Images</h3>
          <div class="file-preview">
            ${issue.images.map((image, index) => `
              <div class="file-thumbnail">
                <img src="${image}" alt="Issue image ${index + 1}">
              </div>
            `).join('')}
          </div>
        </div>
      ` : ''}
    `;
  }
  
  // Render issue timeline
  if (issueTimeline) {
    renderIssueTimeline(issue, issueTimeline);
  }
}

// Get authority title from escalation level
function getAuthorityFromLevel(level) {
  switch(level) {
    case 3: return 'Sarpanch';
    case 2: return 'Uppasarpanch';
    case 1: return 'Ward Member';
    default: return 'Local Authority';
  }
}

// Render issue timeline
function renderIssueTimeline(issue, timelineElement) {
  timelineElement.innerHTML = '';
  
  issue.updates.forEach(update => {
    const timelineItem = document.createElement('div');
    timelineItem.className = 'timeline-item';
    
    // Determine status class
    let statusClass = 'pending';
    if (update.date < Date.now()) {
      statusClass = update.status.toLowerCase() === issue.status.toLowerCase() ? 'active' : 'completed';
    }
    
    timelineItem.classList.add(statusClass);
    
    // Determine icon
    let icon = 'exclamation-triangle';
    if (statusClass === 'completed') icon = 'check';
    else if (statusClass === 'active') icon = 'clock';
    
    timelineItem.innerHTML = `
      <div class="timeline-icon">
        <i class="fas fa-${icon}"></i>
      </div>
      <div class="timeline-content">
        <div class="timeline-header">
          <h4>${update.status}</h4>
          <span>${new Date(update.date).toLocaleString()}</span>
        </div>
        <p>${update.comment}</p>
        <div class="text-sm text-gray-500">by ${update.by}</div>
      </div>
    `;
    
    timelineElement.appendChild(timelineItem);
  });
}

// Helper function to get status CSS class
function getStatusClass(status) {
  switch (status.toLowerCase()) {
    case 'submitted':
      return 'reported';
    case 'in-review':
    case 'in-progress':
      return 'in-progress';
    case 'resolved':
    case 'completed':
      return 'resolved';
    default:
      return 'reported';
  }
}

// Create a new issue with authority workflow integration
function createIssue(type, description, location, ward, images = []) {
  const id = generateId();
  const now = Date.now();
  
  return {
    id,
    type,
    description,
    location,
    ward,
    dateSubmitted: now,
    status: 'Submitted',
    images,
    reportedBy: appState.currentUser.id,
    escalationLevel: 1, // Start at Ward Member level
    assignedTo: 'wardmember', // Initially assigned to Ward Member
    updates: [
      {
        id: generateId(),
        status: 'Submitted to Ward Member',
        date: now,
        comment: 'Issue has been submitted and is awaiting review by the Ward Member.',
        by: appState.currentUser ? appState.currentUser.name : 'System'
      }
    ]
  };
}

// Add an update to an issue
function addIssueUpdate(issue, status, comment, by) {
  const updatedIssue = { ...issue };
  
  updatedIssue.updates.push({
    id: generateId(),
    status,
    date: Date.now(),
    comment,
    by
  });
  
  return updatedIssue;
}

// Generate a random ID
function generateId() {
  return Math.random().toString(36).substring(2, 10);
}

// Show login modal
function showLoginModal() {
  if (loginModal) {
    loginModal.classList.add('active');
  }
}

// Close login modal
function closeLoginModal() {
  if (loginModal) {
    loginModal.classList.remove('active');
  }
}

// Update UI based on login state
function updateUIForLogin() {
  // Update login button text
  if (loginBtn) {
    loginBtn.textContent = appState.isLoggedIn ? 'Logout' : 'Login';
  }
  
  // Update report issue nav link
  const reportIssueNav = document.getElementById('reportIssueNav');
  if (reportIssueNav) {
    reportIssueNav.setAttribute('href', appState.isLoggedIn ? 'report-issue.html' : '#');
    if (!appState.isLoggedIn) {
      reportIssueNav.addEventListener('click', function(e) {
        e.preventDefault();
        appState.redirectAfterLogin = 'report-issue.html';
        localStorage.setItem('redirectAfterLogin', appState.redirectAfterLogin);
        showLoginModal();
      });
    }
  }
}

// Login function
function login(email, password) {
  // In a real app, this would authenticate with backend
  // Here we just simulate a successful login
  const user = {
    id: generateId(),
    name: "Demo User",
    email: email || "user@example.com",
  };
  
  appState.isLoggedIn = true;
  appState.currentUser = user;
  
  // Save to localStorage for persistence
  localStorage.setItem('isLoggedIn', 'true');
  localStorage.setItem('currentUser', JSON.stringify(user));
  
  updateUIForLogin();
  
  showNotification('Login successful! Welcome back.', 'success');
  
  // Handle redirect if needed
  const redirect = appState.redirectAfterLogin || localStorage.getItem('redirectAfterLogin');
  if (redirect) {
    appState.redirectAfterLogin = null;
    localStorage.removeItem('redirectAfterLogin');
    window.location.href = redirect;
  }
}

// Logout function
function logout() {
  appState.isLoggedIn = false;
  appState.currentUser = null;
  
  // Clear localStorage
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('currentUser');
  
  updateUIForLogin();
  
  showNotification('You have been logged out.', 'info');
  
  // If on a page that requires login, redirect to home
  const currentPage = window.location.pathname.split('/').pop();
  if (currentPage === 'report-issue.html' || currentPage === 'issue-tracking.html') {
    window.location.href = 'index.html';
  } else {
    // Just refresh the current page
    window.location.reload();
  }
}

// Show notification
function showNotification(message, type = 'info') {
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

// Add authorities link to navigation menu
function addAuthoritiesLink() {
  const navMenu = document.getElementById('navMenu');
  
  // Check if authorities link already exists
  if (navMenu && !document.querySelector('a[href="authorities-login.html"]')) {
    // Create new link for authorities
    const authoritiesLink = document.createElement('a');
    authoritiesLink.href = 'authorities-login.html';
    authoritiesLink.className = 'nav-link';
    authoritiesLink.innerHTML = '<i class="fas fa-user-shield"></i> Authorities';
    
    // Insert before the login button
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
      navMenu.insertBefore(authoritiesLink, loginBtn);
    } else {
      navMenu.appendChild(authoritiesLink);
    }
  }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
  init();
  
  // Login button click
  if (loginBtn) {
    loginBtn.addEventListener('click', function() {
      if (appState.isLoggedIn) {
        logout();
      } else {
        showLoginModal();
      }
    });
  }
  
  // Close modal button
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeLoginModal);
  }
  
  // Close modal when clicking outside
  window.addEventListener('click', function(e) {
    if (e.target === loginModal) {
      closeLoginModal();
    }
  });
  
  // Login form submission
  if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;
      
      // In a real app, validate credentials
      login(email, password);
      closeLoginModal();
    });
  }
  
  // Report issue button click
  if (reportIssueBtn) {
    reportIssueBtn.addEventListener('click', function() {
      if (!appState.isLoggedIn) {
        appState.redirectAfterLogin = 'report-issue.html';
        localStorage.setItem('redirectAfterLogin', appState.redirectAfterLogin);
        showLoginModal();
      } else {
        window.location.href = 'report-issue.html';
      }
    });
  }
  
  // Report issue card click
  if (reportIssueCard) {
    reportIssueCard.addEventListener('click', function() {
      if (!appState.isLoggedIn) {
        appState.redirectAfterLogin = 'report-issue.html';
        localStorage.setItem('redirectAfterLogin', appState.redirectAfterLogin);
        showLoginModal();
      } else {
        window.location.href = 'report-issue.html';
      }
    });
  }
  
  // Hamburger menu
  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', function() {
      navMenu.classList.toggle('active');
    });
  }
});

// Make showNotification function available globally
window.showNotification = showNotification;
