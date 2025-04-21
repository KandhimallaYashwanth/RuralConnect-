
// Authority Dashboard functionality
document.addEventListener('DOMContentLoaded', () => {
  // Check if user is authority
  const userType = localStorage.getItem('userType');
  const authorityRole = localStorage.getItem('authorityRole');
  
  if (userType !== 'authority') {
    // Redirect non-authority users
    notify('Access denied. Authority access only.', 'error');
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 2000);
    return;
  }
  
  // Display authority role
  const roleDisplay = document.getElementById('authority-role');
  if (roleDisplay && authorityRole) {
    roleDisplay.textContent = authorityRole.charAt(0).toUpperCase() + authorityRole.slice(1);
  }
  
  // Handle logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userType');
      localStorage.removeItem('authorityRole');
      
      notify('Logged out successfully', 'success');
      
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 1000);
    });
  }
  
  // Handle sidebar navigation
  const sidebarItems = document.querySelectorAll('.sidebar-menu li');
  const dashboardSections = document.querySelectorAll('.dashboard-section');
  
  sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
      // Hide all sections
      dashboardSections.forEach(section => {
        section.classList.remove('active');
      });
      
      // Remove active class from all sidebar items
      sidebarItems.forEach(menuItem => {
        menuItem.classList.remove('active');
      });
      
      // Add active class to clicked item
      item.classList.add('active');
      
      // Show corresponding section
      const sectionId = item.dataset.section;
      const section = document.getElementById(sectionId);
      if (section) {
        section.classList.add('active');
      }
    });
  });
  
  // Load initial data
  loadPendingIssues();
  loadInProgressIssues();
  loadResolvedIssues();
  loadRejectedIssues();
  loadBudgetItemsForDashboard();
  loadHistoryItemsForDashboard();
  loadResourceItemsForDashboard();
  loadGalleryItemsForDashboard();
  loadEventItemsForDashboard();
  
  // Update issue counts
  updateIssueCounts();
  
  // Handle budget form submission
  const budgetForm = document.getElementById('budget-form');
  if (budgetForm) {
    budgetForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get form data
      const title = document.getElementById('budget-title').value;
      const category = document.getElementById('budget-category').value;
      const allocation = parseFloat(document.getElementById('budget-allocation').value);
      const spent = parseFloat(document.getElementById('budget-spent').value);
      const description = document.getElementById('budget-description').value;
      const projectsInput = document.getElementById('budget-projects').value;
      
      // Validate form
      if (!title || !category || isNaN(allocation) || isNaN(spent) || !description) {
        notify('Please fill in all required fields', 'error');
        return;
      }
      
      // Process projects input
      const projects = projectsInput ? projectsInput.split(',').map(p => p.trim()) : [];
      
      // Create new budget item
      const newBudgetItem = {
        id: Date.now(),
        title: title,
        category: category,
        allocation: allocation,
        spent: spent,
        description: description,
        projects: projects,
        createdAt: new Date().toISOString(),
        createdBy: authorityRole
      };
      
      // Save to localStorage
      const budgetItems = JSON.parse(localStorage.getItem('budgetItems') || '[]');
      budgetItems.push(newBudgetItem);
      localStorage.setItem('budgetItems', JSON.stringify(budgetItems));
      
      // Show success message
      notify('Budget item added successfully!', 'success');
      
      // Reset form
      budgetForm.reset();
      
      // Reload budget items
      loadBudgetItemsForDashboard();
    });
  }
  
  // Handle history form submission
  const historyForm = document.getElementById('history-form');
  if (historyForm) {
    historyForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get form data
      const title = document.getElementById('history-title').value;
      const date = document.getElementById('history-date').value;
      const description = document.getElementById('history-description').value;
      
      // Validate form
      if (!title || !date || !description) {
        notify('Please fill in all required fields', 'error');
        return;
      }
      
      // Create new history item
      const newHistoryItem = {
        id: Date.now(),
        title: title,
        date: date,
        description: description,
        createdAt: new Date().toISOString(),
        createdBy: authorityRole
      };
      
      // Save to localStorage
      const historyItems = JSON.parse(localStorage.getItem('historyItems') || '[]');
      historyItems.push(newHistoryItem);
      localStorage.setItem('historyItems', JSON.stringify(historyItems));
      
      // Show success message
      notify('History item added successfully!', 'success');
      
      // Reset form
      historyForm.reset();
      
      // Reload history items
      loadHistoryItemsForDashboard();
    });
  }
  
  // Handle resources form submission
  const resourceForm = document.getElementById('resources-form');
  if (resourceForm) {
    resourceForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get form data
      const title = document.getElementById('resource-title').value;
      const category = document.getElementById('resource-category').value;
      const description = document.getElementById('resource-description').value;
      const fileLink = document.getElementById('resource-file-link').value;
      
      // Validate form
      if (!title || !category || !description || !fileLink) {
        notify('Please fill in all required fields', 'error');
        return;
      }
      
      // Create new resource item
      const newResourceItem = {
        id: Date.now(),
        title: title,
        category: category,
        description: description,
        fileLink: fileLink,
        fileSize: '2.4 MB', // Placeholder, in real app would get actual file size
        fileType: 'PDF', // Placeholder, in real app would get actual file type
        createdAt: new Date().toISOString(),
        createdBy: authorityRole
      };
      
      // Save to localStorage
      const resourceItems = JSON.parse(localStorage.getItem('resourceItems') || '[]');
      resourceItems.push(newResourceItem);
      localStorage.setItem('resourceItems', JSON.stringify(resourceItems));
      
      // Show success message
      notify('Resource added successfully!', 'success');
      
      // Reset form
      resourceForm.reset();
      
      // Reload resource items
      loadResourceItemsForDashboard();
    });
  }
  
  // Handle gallery form submission
  const galleryForm = document.getElementById('gallery-form');
  if (galleryForm) {
    galleryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get form data
      const title = document.getElementById('image-title').value;
      const description = document.getElementById('image-description').value;
      const category = document.getElementById('image-category').value;
      
      // Validate form
      if (!title || !description || !category) {
        notify('Please fill in all required fields', 'error');
        return;
      }
      
      // For demo, we'll use placeholder images
      const placeholderImages = [
        'https://images.unsplash.com/photo-1472396961693-142e6e269027',
        'https://images.unsplash.com/photo-1466721591366-2d5fba72006d',
        'https://images.unsplash.com/photo-1493962853295-0fd70327578a',
        'https://images.unsplash.com/photo-1517022812141-23620dba5c23',
        'https://images.unsplash.com/photo-1465379944081-7f47de8d74ac'
      ];
      
      const randomImage = placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
      
      // Create new gallery item
      const newGalleryItem = {
        id: Date.now(),
        title: title,
        description: description,
        category: category,
        imageUrl: randomImage,
        createdAt: new Date().toISOString(),
        createdBy: authorityRole
      };
      
      // Save to localStorage
      const galleryItems = JSON.parse(localStorage.getItem('galleryItems') || '[]');
      galleryItems.push(newGalleryItem);
      localStorage.setItem('galleryItems', JSON.stringify(galleryItems));
      
      // Show success message
      notify('Gallery item added successfully!', 'success');
      
      // Reset form
      galleryForm.reset();
      
      // Reload gallery items
      loadGalleryItemsForDashboard();
    });
  }
  
  // Handle event form submission
  const eventForm = document.getElementById('event-form');
  if (eventForm) {
    eventForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Get form data
      const title = document.getElementById('event-title').value;
      const date = document.getElementById('event-date').value;
      const time = document.getElementById('event-time').value;
      const location = document.getElementById('event-location').value;
      const description = document.getElementById('event-description').value;
      
      // Validate form
      if (!title || !date || !time || !location || !description) {
        notify('Please fill in all required fields', 'error');
        return;
      }
      
      // Create new event item
      const newEventItem = {
        id: Date.now(),
        title: title,
        date: date,
        time: time,
        location: location,
        description: description,
        createdAt: new Date().toISOString(),
        createdBy: authorityRole
      };
      
      // Save to localStorage
      const eventItems = JSON.parse(localStorage.getItem('eventItems') || '[]');
      eventItems.push(newEventItem);
      localStorage.setItem('eventItems', JSON.stringify(eventItems));
      
      // Show success message
      notify('Event added successfully!', 'success');
      
      // Reset form
      eventForm.reset();
      
      // Reload event items
      loadEventItemsForDashboard();
    });
  }
});

// Function to load pending issues
function loadPendingIssues() {
  const pendingIssuesList = document.getElementById('pending-issues-list');
  if (!pendingIssuesList) return;
  
  const pendingIssues = JSON.parse(localStorage.getItem('pendingIssues') || '[]');
  
  pendingIssuesList.innerHTML = '';
  
  if (pendingIssues.length === 0) {
    pendingIssuesList.innerHTML = `
      <div class="empty-state">
        <p>No pending issues at this time.</p>
      </div>
    `;
    return;
  }
  
  pendingIssues.forEach(issue => {
    const issueCard = document.createElement('div');
    issueCard.className = 'issue-card';
    
    // Get the current authority role
    const authorityRole = localStorage.getItem('authorityRole');
    
    // Create different actions based on role
    let actionButtons = '';
    
    if (authorityRole === 'ward-member') {
      actionButtons = `
        <button class="btn btn-secondary issue-action" data-action="forward" data-id="${issue.id}">Forward</button>
        <button class="btn btn-primary issue-action" data-action="validate" data-id="${issue.id}">Validate</button>
      `;
    } else if (authorityRole === 'sarpanch' || authorityRole === 'vice-sarpanch') {
      actionButtons = `
        <button class="btn btn-secondary issue-action" data-action="view-details" data-id="${issue.id}">View Details</button>
        <button class="btn btn-accent issue-action" data-action="reject" data-id="${issue.id}">Reject</button>
        <button class="btn btn-primary issue-action" data-action="resolve" data-id="${issue.id}">Resolve</button>
      `;
    }
    
    issueCard.innerHTML = `
      <h3>${issue.title}</h3>
      <div class="issue-meta">
        <span>${issue.id}</span>
        <span>Reported: ${formatDate(issue.reportedAt)}</span>
      </div>
      <span class="issue-category ${issue.category}">${issue.category}</span>
      <p class="issue-description">${issue.description}</p>
      <div class="issue-detail"><strong>Location:</strong> ${issue.location}</div>
      <div class="issue-detail"><strong>Reported By:</strong> ${issue.reportedBy}</div>
      <div class="issue-actions">
        ${actionButtons}
      </div>
    `;
    
    pendingIssuesList.appendChild(issueCard);
  });
  
  // Add event listeners to action buttons
  const actionButtons = pendingIssuesList.querySelectorAll('.issue-action');
  actionButtons.forEach(button => {
    button.addEventListener('click', handleIssueAction);
  });
}

// Function to load in-progress issues
function loadInProgressIssues() {
  const inProgressIssuesList = document.getElementById('in-progress-issues-list');
  if (!inProgressIssuesList) return;
  
  const allIssues = JSON.parse(localStorage.getItem('userIssues') || '[]');
  const inProgressIssues = allIssues.filter(issue => 
    issue.status === 'forwarded' || 
    issue.status === 'validated' || 
    issue.status === 'in-progress'
  );
  
  inProgressIssuesList.innerHTML = '';
  
  if (inProgressIssues.length === 0) {
    inProgressIssuesList.innerHTML = `
      <div class="empty-state">
        <p>No in-progress issues at this time.</p>
      </div>
    `;
    return;
  }
  
  inProgressIssues.forEach(issue => {
    const issueCard = document.createElement('div');
    issueCard.className = 'issue-card';
    
    // Get the current authority role
    const authorityRole = localStorage.getItem('authorityRole');
    
    // Create different actions based on role
    let actionButtons = '';
    
    if (authorityRole === 'ward-member') {
      actionButtons = `
        <button class="btn btn-secondary issue-action" data-action="view-details" data-id="${issue.id}">View Details</button>
      `;
    } else if (authorityRole === 'sarpanch' || authorityRole === 'vice-sarpanch') {
      actionButtons = `
        <button class="btn btn-secondary issue-action" data-action="view-details" data-id="${issue.id}">View Details</button>
        <button class="btn btn-primary issue-action" data-action="resolve" data-id="${issue.id}">Mark Resolved</button>
      `;
    }
    
    issueCard.innerHTML = `
      <h3>${issue.title}</h3>
      <div class="issue-meta">
        <span>${issue.id}</span>
        <span>Reported: ${formatDate(issue.reportedAt)}</span>
      </div>
      <span class="issue-category ${issue.category}">${issue.category}</span>
      <p class="issue-description">${issue.description}</p>
      <div class="issue-detail"><strong>Location:</strong> ${issue.location}</div>
      <div class="issue-detail"><strong>Reported By:</strong> ${issue.reportedBy}</div>
      <div class="issue-detail"><strong>Status:</strong> ${issue.status.charAt(0).toUpperCase() + issue.status.slice(1)}</div>
      <div class="issue-actions">
        ${actionButtons}
      </div>
    `;
    
    inProgressIssuesList.appendChild(issueCard);
  });
  
  // Add event listeners to action buttons
  const actionButtons = inProgressIssuesList.querySelectorAll('.issue-action');
  actionButtons.forEach(button => {
    button.addEventListener('click', handleIssueAction);
  });
}

// Function to load resolved issues
function loadResolvedIssues() {
  const resolvedIssuesList = document.getElementById('resolved-issues-list');
  if (!resolvedIssuesList) return;
  
  const allIssues = JSON.parse(localStorage.getItem('userIssues') || '[]');
  const resolvedIssues = allIssues.filter(issue => issue.status === 'resolved');
  
  resolvedIssuesList.innerHTML = '';
  
  if (resolvedIssues.length === 0) {
    resolvedIssuesList.innerHTML = `
      <div class="empty-state">
        <p>No resolved issues at this time.</p>
      </div>
    `;
    return;
  }
  
  resolvedIssues.forEach(issue => {
    const issueCard = document.createElement('div');
    issueCard.className = 'issue-card';
    
    // Find the resolved timeline entry
    const resolvedEntry = issue.timeline.find(entry => entry.status === 'resolved');
    const resolvedDate = resolvedEntry ? formatDate(resolvedEntry.date) : 'Unknown';
    
    issueCard.innerHTML = `
      <h3>${issue.title}</h3>
      <div class="issue-meta">
        <span>${issue.id}</span>
        <span>Resolved: ${resolvedDate}</span>
      </div>
      <span class="issue-category ${issue.category}">${issue.category}</span>
      <p class="issue-description">${issue.description}</p>
      <div class="issue-detail"><strong>Location:</strong> ${issue.location}</div>
      <div class="issue-detail"><strong>Reported By:</strong> ${issue.reportedBy}</div>
      <div class="issue-actions">
        <button class="btn btn-secondary issue-action" data-action="view-details" data-id="${issue.id}">View Details</button>
      </div>
    `;
    
    resolvedIssuesList.appendChild(issueCard);
  });
  
  // Add event listeners to action buttons
  const actionButtons = resolvedIssuesList.querySelectorAll('.issue-action');
  actionButtons.forEach(button => {
    button.addEventListener('click', handleIssueAction);
  });
}

// Function to load rejected issues
function loadRejectedIssues() {
  const rejectedIssuesList = document.getElementById('rejected-issues-list');
  if (!rejectedIssuesList) return;
  
  const allIssues = JSON.parse(localStorage.getItem('userIssues') || '[]');
  const rejectedIssues = allIssues.filter(issue => issue.status === 'rejected');
  
  rejectedIssuesList.innerHTML = '';
  
  if (rejectedIssues.length === 0) {
    rejectedIssuesList.innerHTML = `
      <div class="empty-state">
        <p>No rejected issues at this time.</p>
      </div>
    `;
    return;
  }
  
  rejectedIssues.forEach(issue => {
    const issueCard = document.createElement('div');
    issueCard.className = 'issue-card';
    
    // Find the rejected timeline entry
    const rejectedEntry = issue.timeline.find(entry => entry.status === 'rejected');
    const rejectedDate = rejectedEntry ? formatDate(rejectedEntry.date) : 'Unknown';
    
    issueCard.innerHTML = `
      <h3>${issue.title}</h3>
      <div class="issue-meta">
        <span>${issue.id}</span>
        <span>Rejected: ${rejectedDate}</span>
      </div>
      <span class="issue-category ${issue.category}">${issue.category}</span>
      <p class="issue-description">${issue.description}</p>
      <div class="issue-detail"><strong>Location:</strong> ${issue.location}</div>
      <div class="issue-detail"><strong>Reported By:</strong> ${issue.reportedBy}</div>
      <div class="issue-actions">
        <button class="btn btn-secondary issue-action" data-action="view-details" data-id="${issue.id}">View Details</button>
      </div>
    `;
    
    rejectedIssuesList.appendChild(issueCard);
  });
  
  // Add event listeners to action buttons
  const actionButtons = rejectedIssuesList.querySelectorAll('.issue-action');
  actionButtons.forEach(button => {
    button.addEventListener('click', handleIssueAction);
  });
}

// Function to handle issue actions
function handleIssueAction(e) {
  const action = e.target.dataset.action;
  const issueId = e.target.dataset.id;
  const authorityRole = localStorage.getItem('authorityRole');
  
  if (!action || !issueId) return;
  
  // Find the issue in storage
  const userIssues = JSON.parse(localStorage.getItem('userIssues') || '[]');
  const pendingIssues = JSON.parse(localStorage.getItem('pendingIssues') || '[]');
  
  const issueIndex = userIssues.findIndex(issue => issue.id === issueId);
  const pendingIndex = pendingIssues.findIndex(issue => issue.id === issueId);
  
  if (issueIndex === -1) {
    notify('Issue not found!', 'error');
    return;
  }
  
  const issue = userIssues[issueIndex];
  
  switch (action) {
    case 'forward':
      if (authorityRole !== 'ward-member') {
        notify('Only Ward Members can forward issues.', 'error');
        return;
      }
      
      // Update issue status
      issue.status = 'forwarded';
      
      // Add to timeline
      issue.timeline.push({
        status: 'forwarded',
        date: new Date().toISOString(),
        message: `Issue forwarded by ${authorityRole} for further action.`
      });
      
      // Remove from pending issues
      if (pendingIndex !== -1) {
        pendingIssues.splice(pendingIndex, 1);
      }
      
      notify('Issue forwarded successfully!', 'success');
      break;
      
    case 'validate':
      if (authorityRole !== 'ward-member') {
        notify('Only Ward Members can validate issues.', 'error');
        return;
      }
      
      // Update issue status
      issue.status = 'validated';
      
      // Add to timeline
      issue.timeline.push({
        status: 'validated',
        date: new Date().toISOString(),
        message: `Issue validated by ${authorityRole}.`
      });
      
      // Remove from pending issues
      if (pendingIndex !== -1) {
        pendingIssues.splice(pendingIndex, 1);
      }
      
      notify('Issue validated successfully!', 'success');
      break;
      
    case 'reject':
      if (authorityRole !== 'sarpanch' && authorityRole !== 'vice-sarpanch') {
        notify('Only Sarpanch or Vice Sarpanch can reject issues.', 'error');
        return;
      }
      
      // Update issue status
      issue.status = 'rejected';
      
      // Add to timeline
      issue.timeline.push({
        status: 'rejected',
        date: new Date().toISOString(),
        message: `Issue rejected by ${authorityRole}.`
      });
      
      // Remove from pending issues
      if (pendingIndex !== -1) {
        pendingIssues.splice(pendingIndex, 1);
      }
      
      notify('Issue rejected successfully!', 'success');
      break;
      
    case 'resolve':
      if (authorityRole !== 'sarpanch' && authorityRole !== 'vice-sarpanch') {
        notify('Only Sarpanch or Vice Sarpanch can resolve issues.', 'error');
        return;
      }
      
      // Update issue status
      issue.status = 'resolved';
      
      // Add to timeline
      issue.timeline.push({
        status: 'resolved',
        date: new Date().toISOString(),
        message: `Issue resolved by ${authorityRole}.`
      });
      
      // Remove from pending issues
      if (pendingIndex !== -1) {
        pendingIssues.splice(pendingIndex, 1);
      }
      
      notify('Issue resolved successfully!', 'success');
      break;
      
    case 'view-details':
      // In a real app, this would navigate to a detail page
      alert(`Issue Details:\n\nID: ${issue.id}\nTitle: ${issue.title}\nStatus: ${issue.status}\nCategory: ${issue.category}\nLocation: ${issue.location}\nDescription: ${issue.description}\nReported By: ${issue.reportedBy}\nReported At: ${formatDate(issue.reportedAt)}`);
      return;
  }
  
  // Update storage
  userIssues[issueIndex] = issue;
  localStorage.setItem('userIssues', JSON.stringify(userIssues));
  localStorage.setItem('pendingIssues', JSON.stringify(pendingIssues));
  
  // Reload issue lists
  loadPendingIssues();
  loadInProgressIssues();
  loadResolvedIssues();
  loadRejectedIssues();
  
  // Update counts
  updateIssueCounts();
}

// Function to update issue counts
function updateIssueCounts() {
  const pendingCount = document.getElementById('pending-count');
  const progressCount = document.getElementById('progress-count');
  const resolvedCount = document.getElementById('resolved-count');
  
  const userIssues = JSON.parse(localStorage.getItem('userIssues') || '[]');
  const pendingIssues = JSON.parse(localStorage.getItem('pendingIssues') || '[]');
  
  const inProgressIssues = userIssues.filter(issue => 
    issue.status === 'forwarded' || 
    issue.status === 'validated' || 
    issue.status === 'in-progress'
  );
  
  const resolvedIssues = userIssues.filter(issue => issue.status === 'resolved');
  
  if (pendingCount) pendingCount.textContent = pendingIssues.length;
  if (progressCount) progressCount.textContent = inProgressIssues.length;
  if (resolvedCount) resolvedCount.textContent = resolvedIssues.length;
}

// Function to load budget items for dashboard
function loadBudgetItemsForDashboard() {
  const budgetItemsList = document.getElementById('budget-items-list');
  if (!budgetItemsList) return;
  
  const budgetItems = JSON.parse(localStorage.getItem('budgetItems') || '[]');
  
  budgetItemsList.innerHTML = '';
  
  if (budgetItems.length === 0) {
    budgetItemsList.innerHTML = `
      <div class="empty-state">
        <p>No budget items added yet.</p>
      </div>
    `;
    return;
  }
  
  budgetItems.forEach(item => {
    const progress = (item.spent / item.allocation) * 100;
    
    const budgetCard = document.createElement('div');
    budgetCard.className = 'preview-card';
    
    budgetCard.innerHTML = `
      <div class="preview-actions">
        <button class="edit-btn" data-id="${item.id}"><i class="fas fa-edit"></i></button>
        <button class="delete-btn" data-id="${item.id}"><i class="fas fa-trash"></i></button>
      </div>
      <h4>${item.title}</h4>
      <p><strong>Category:</strong> ${item.category}</p>
      <div class="allocation-bar">
        <div class="allocation-progress" style="width: ${progress}%"></div>
      </div>
      <div class="allocation-info">
        <span>Budget: ₹${item.allocation.toLocaleString()}</span>
        <span>Spent: ₹${item.spent.toLocaleString()} (${Math.round(progress)}%)</span>
      </div>
      <p>${item.description}</p>
      ${item.projects && item.projects.length > 0 ? `
        <div class="projects-list">
          <strong>Projects:</strong>
          <ul>
            ${item.projects.map(project => `<li>${project}</li>`).join('')}
          </ul>
        </div>
      ` : ''}
    `;
    
    budgetItemsList.appendChild(budgetCard);
  });
  
  // Add event listeners to action buttons
  const editButtons = budgetItemsList.querySelectorAll('.edit-btn');
  const deleteButtons = budgetItemsList.querySelectorAll('.delete-btn');
  
  editButtons.forEach(button => {
    button.addEventListener('click', () => {
      const itemId = parseInt(button.dataset.id);
      editBudgetItem(itemId);
    });
  });
  
  deleteButtons.forEach(button => {
    button.addEventListener('click', () => {
      const itemId = parseInt(button.dataset.id);
      deleteBudgetItem(itemId);
    });
  });
}

// Function to edit budget item
function editBudgetItem(itemId) {
  const budgetItems = JSON.parse(localStorage.getItem('budgetItems') || '[]');
  const itemIndex = budgetItems.findIndex(item => item.id === itemId);
  
  if (itemIndex === -1) {
    notify('Budget item not found!', 'error');
    return;
  }
  
  const item = budgetItems[itemIndex];
  
  // Populate form with item data
  document.getElementById('budget-title').value = item.title;
  document.getElementById('budget-category').value = item.category;
  document.getElementById('budget-allocation').value = item.allocation;
  document.getElementById('budget-spent').value = item.spent;
  document.getElementById('budget-description').value = item.description;
  document.getElementById('budget-projects').value = item.projects ? item.projects.join(', ') : '';
  
  // Change form submit button text
  const submitButton = document.querySelector('#budget-form .btn-primary');
  submitButton.textContent = 'Update Budget Item';
  
  // Add itemId to form for later use
  document.getElementById('budget-form').dataset.editId = itemId;
  
  // Scroll to form
  document.getElementById('budget-form').scrollIntoView();
  
  notify('Please update the budget item and submit the form.', 'info');
}

// Function to delete budget item
function deleteBudgetItem(itemId) {
  if (!confirm('Are you sure you want to delete this budget item?')) return;
  
  const budgetItems = JSON.parse(localStorage.getItem('budgetItems') || '[]');
  const updatedItems = budgetItems.filter(item => item.id !== itemId);
  
  localStorage.setItem('budgetItems', JSON.stringify(updatedItems));
  
  loadBudgetItemsForDashboard();
  notify('Budget item deleted successfully!', 'success');
}

// Functions for History Items
function loadHistoryItemsForDashboard() {
  const historyItemsList = document.getElementById('history-items-list');
  if (!historyItemsList) return;
  
  const historyItems = JSON.parse(localStorage.getItem('historyItems') || '[]');
  
  historyItemsList.innerHTML = '';
  
  if (historyItems.length === 0) {
    historyItemsList.innerHTML = `
      <div class="empty-state">
        <p>No historical information added yet.</p>
      </div>
    `;
    return;
  }
  
  historyItems.forEach(item => {
    const historyCard = document.createElement('div');
    historyCard.className = 'preview-card';
    
    historyCard.innerHTML = `
      <div class="preview-actions">
        <button class="edit-btn" data-id="${item.id}"><i class="fas fa-edit"></i></button>
        <button class="delete-btn" data-id="${item.id}"><i class="fas fa-trash"></i></button>
      </div>
      <h4>${item.title}</h4>
      <p><strong>Date:</strong> ${formatDate(item.date)}</p>
      <p>${item.description}</p>
    `;
    
    historyItemsList.appendChild(historyCard);
  });
}

// Functions for Resource Items
function loadResourceItemsForDashboard() {
  const resourceItemsList = document.getElementById('resource-items-list');
  if (!resourceItemsList) return;
  
  const resourceItems = JSON.parse(localStorage.getItem('resourceItems') || '[]');
  
  resourceItemsList.innerHTML = '';
  
  if (resourceItems.length === 0) {
    resourceItemsList.innerHTML = `
      <div class="empty-state">
        <p>No resources added yet.</p>
      </div>
    `;
    return;
  }
  
  resourceItems.forEach(item => {
    const resourceCard = document.createElement('div');
    resourceCard.className = 'preview-card';
    
    resourceCard.innerHTML = `
      <div class="preview-actions">
        <button class="edit-btn" data-id="${item.id}"><i class="fas fa-edit"></i></button>
        <button class="delete-btn" data-id="${item.id}"><i class="fas fa-trash"></i></button>
      </div>
      <h4>${item.title}</h4>
      <p><strong>Category:</strong> ${item.category}</p>
      <p>${item.description}</p>
      <div class="resource-meta">
        <span>${item.fileType} · ${item.fileSize}</span>
        <a href="${item.fileLink}" target="_blank" class="download-btn">
          <i class="fas fa-download"></i> Download
        </a>
      </div>
    `;
    
    resourceItemsList.appendChild(resourceCard);
  });
}

// Functions for Gallery Items
function loadGalleryItemsForDashboard() {
  const galleryPreviewList = document.getElementById('gallery-preview-list');
  if (!galleryPreviewList) return;
  
  const galleryItems = JSON.parse(localStorage.getItem('galleryItems') || '[]');
  
  galleryPreviewList.innerHTML = '';
  
  if (galleryItems.length === 0) {
    galleryPreviewList.innerHTML = `
      <div class="empty-state">
        <p>No gallery items added yet.</p>
      </div>
    `;
    return;
  }
  
  galleryItems.forEach(item => {
    const galleryPreviewItem = document.createElement('div');
    galleryPreviewItem.className = 'gallery-preview-item';
    
    galleryPreviewItem.innerHTML = `
      <img src="${item.imageUrl}" alt="${item.title}">
      <div class="gallery-preview-actions">
        <button class="edit-btn" data-id="${item.id}"><i class="fas fa-edit"></i></button>
        <button class="delete-btn" data-id="${item.id}"><i class="fas fa-trash"></i></button>
      </div>
    `;
    
    galleryPreviewList.appendChild(galleryPreviewItem);
  });
}

// Functions for Event Items
function loadEventItemsForDashboard() {
  const eventsPreviewList = document.getElementById('events-preview-list');
  if (!eventsPreviewList) return;
  
  const eventItems = JSON.parse(localStorage.getItem('eventItems') || '[]');
  
  eventsPreviewList.innerHTML = '';
  
  if (eventItems.length === 0) {
    eventsPreviewList.innerHTML = `
      <div class="empty-state">
        <p>No events added yet.</p>
      </div>
    `;
    return;
  }
  
  eventItems.forEach(item => {
    const eventCard = document.createElement('div');
    eventCard.className = 'preview-card';
    
    eventCard.innerHTML = `
      <div class="preview-actions">
        <button class="edit-btn" data-id="${item.id}"><i class="fas fa-edit"></i></button>
        <button class="delete-btn" data-id="${item.id}"><i class="fas fa-trash"></i></button>
      </div>
      <h4>${item.title}</h4>
      <p><strong>Date:</strong> ${formatDate(item.date)}</p>
      <p><strong>Time:</strong> ${item.time}</p>
      <p><strong>Location:</strong> ${item.location}</p>
      <p>${item.description}</p>
    `;
    
    eventsPreviewList.appendChild(eventCard);
  });
}
