
// Authority Dashboard functionality
document.addEventListener('DOMContentLoaded', () => {
  // Check if user is logged in as authority
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userType = localStorage.getItem('userType');
  
  if (!isLoggedIn || userType !== 'authority') {
    // Redirect non-authority users to login
    alert('Please login as an authority to access the dashboard');
    window.location.href = 'authority-login.html';
    return;
  }
  
  // Display authority role
  const authorityRole = localStorage.getItem('authorityRole');
  const roleDisplay = document.getElementById('authority-role');
  if (roleDisplay && authorityRole) {
    roleDisplay.textContent = authorityRole.charAt(0).toUpperCase() + authorityRole.slice(1);
  }
  
  // Handle sidebar navigation
  const sidebarItems = document.querySelectorAll('.sidebar-menu li');
  const dashboardSections = document.querySelectorAll('.dashboard-section');
  
  sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
      // Get the target section ID
      const sectionId = item.getAttribute('data-section');
      
      // Remove active class from all items and sections
      sidebarItems.forEach(i => i.classList.remove('active'));
      dashboardSections.forEach(s => s.classList.remove('active'));
      
      // Add active class to clicked item and corresponding section
      item.classList.add('active');
      document.getElementById(sectionId)?.classList.add('active');
    });
  });
  
  // Initialize issue counters
  updateIssueCounts();
  
  // Load issues
  loadPendingIssues();
  loadInProgressIssues();
  loadResolvedIssues();
  
  // Load content management data
  loadBudgetItemsForDashboard();
  loadGalleryItemsForDashboard();
  loadEventsForDashboard();
  
  // Handle logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('userType');
      localStorage.removeItem('authorityRole');
      
      // Redirect to home page
      window.location.href = 'index.html';
    });
  }
  
  // Set up form submissions
  setupBudgetForm();
  setupGalleryForm();
  setupEventForm();
});

// Function to update issue counts
function updateIssueCounts() {
  const pendingIssues = JSON.parse(localStorage.getItem('pendingIssues') || '[]');
  const inProgressIssues = JSON.parse(localStorage.getItem('inProgressIssues') || '[]');
  const resolvedIssues = JSON.parse(localStorage.getItem('resolvedIssues') || '[]');
  
  document.getElementById('pending-count').textContent = pendingIssues.length;
  document.getElementById('progress-count').textContent = inProgressIssues.length;
  document.getElementById('resolved-count').textContent = resolvedIssues.length;
}

// Function to load pending issues
function loadPendingIssues() {
  const pendingIssuesList = document.getElementById('pending-issues-list');
  if (!pendingIssuesList) return;
  
  const pendingIssues = JSON.parse(localStorage.getItem('pendingIssues') || '[]');
  
  // Clear the container
  pendingIssuesList.innerHTML = '';
  
  if (pendingIssues.length === 0) {
    pendingIssuesList.innerHTML = `
      <div class="empty-state">
        <p>No pending issues at this time.</p>
      </div>
    `;
    return;
  }
  
  // Create cards for each pending issue
  pendingIssues.forEach(issue => {
    const issueCard = document.createElement('div');
    issueCard.className = 'issue-card';
    issueCard.innerHTML = `
      <h3>${issue.title}</h3>
      <div class="issue-meta">
        <span>${issue.id}</span>
        <span>Reported: ${formatDate(issue.reportedAt)}</span>
      </div>
      <span class="issue-category ${issue.category}">${getCategoryName(issue.category)}</span>
      <p class="issue-description">${issue.description}</p>
      <div class="issue-detail"><strong>Location:</strong> ${issue.location}</div>
      <div class="issue-detail"><strong>Reported By:</strong> ${issue.reportedBy}</div>
      <div class="issue-actions">
        <button class="btn btn-secondary reject-issue" data-id="${issue.id}">Reject</button>
        <button class="btn btn-primary approve-issue" data-id="${issue.id}">Approve</button>
      </div>
    `;
    
    pendingIssuesList.appendChild(issueCard);
  });
  
  // Add event listeners to buttons
  pendingIssuesList.querySelectorAll('.approve-issue').forEach(button => {
    button.addEventListener('click', function() {
      const issueId = this.getAttribute('data-id');
      approveIssue(issueId);
    });
  });
  
  pendingIssuesList.querySelectorAll('.reject-issue').forEach(button => {
    button.addEventListener('click', function() {
      const issueId = this.getAttribute('data-id');
      rejectIssue(issueId);
    });
  });
}

// Function to approve an issue
function approveIssue(issueId) {
  const pendingIssues = JSON.parse(localStorage.getItem('pendingIssues') || '[]');
  const inProgressIssues = JSON.parse(localStorage.getItem('inProgressIssues') || '[]');
  
  // Find the issue to approve
  const issueIndex = pendingIssues.findIndex(issue => issue.id === issueId);
  if (issueIndex === -1) return;
  
  const issue = pendingIssues[issueIndex];
  
  // Update issue status
  issue.status = 'in-progress';
  issue.timeline.push({
    status: 'in-progress',
    date: new Date().toISOString(),
    message: 'Issue approved and moved to in-progress'
  });
  
  // Remove from pending and add to in-progress
  pendingIssues.splice(issueIndex, 1);
  inProgressIssues.push(issue);
  
  // Update localStorage
  localStorage.setItem('pendingIssues', JSON.stringify(pendingIssues));
  localStorage.setItem('inProgressIssues', JSON.stringify(inProgressIssues));
  
  // Update UI
  loadPendingIssues();
  loadInProgressIssues();
  updateIssueCounts();
  
  // Show notification
  alert('Issue approved and moved to in-progress');
}

// Function to reject an issue
function rejectIssue(issueId) {
  const pendingIssues = JSON.parse(localStorage.getItem('pendingIssues') || '[]');
  const resolvedIssues = JSON.parse(localStorage.getItem('resolvedIssues') || '[]');
  
  // Find the issue to reject
  const issueIndex = pendingIssues.findIndex(issue => issue.id === issueId);
  if (issueIndex === -1) return;
  
  const issue = pendingIssues[issueIndex];
  
  // Update issue status
  issue.status = 'rejected';
  issue.timeline.push({
    status: 'rejected',
    date: new Date().toISOString(),
    message: 'Issue rejected'
  });
  
  // Remove from pending and add to resolved (as rejected)
  pendingIssues.splice(issueIndex, 1);
  resolvedIssues.push(issue);
  
  // Update localStorage
  localStorage.setItem('pendingIssues', JSON.stringify(pendingIssues));
  localStorage.setItem('resolvedIssues', JSON.stringify(resolvedIssues));
  
  // Update UI
  loadPendingIssues();
  loadResolvedIssues();
  updateIssueCounts();
  
  // Show notification
  alert('Issue rejected');
}

// Function to load in-progress issues
function loadInProgressIssues() {
  const inProgressSection = document.getElementById('in-progress-issues');
  if (!inProgressSection) return;
  
  // For this example, I'll just add a placeholder
  inProgressSection.innerHTML = `
    <div class="section-header">
      <div class="section-icon">
        <i class="fas fa-spinner"></i>
      </div>
      <div>
        <h2>In Progress Issues</h2>
        <p>Issues that are currently being addressed.</p>
      </div>
    </div>
    
    <div class="issues-container" id="in-progress-issues-list">
      <!-- In progress issues would be loaded here -->
      <div class="issue-card">
        <h3>Road Condition Issue</h3>
        <div class="issue-meta">
          <span>#ROA-20230615</span>
          <span>Reported: 15 Jun 2023</span>
        </div>
        <span class="issue-category road">Road & Transportation</span>
        <p class="issue-description">The main road in Ward 5 has several large potholes making it difficult for vehicles to pass.</p>
        <div class="issue-detail"><strong>Location:</strong> Main Road, Ward 5</div>
        <div class="issue-detail"><strong>Reported By:</strong> +91 9876543210</div>
        <div class="issue-actions">
          <button class="btn btn-secondary">View Details</button>
          <button class="btn btn-primary">Mark Resolved</button>
        </div>
      </div>
    </div>
  `;
}

// Function to load resolved issues
function loadResolvedIssues() {
  const resolvedSection = document.getElementById('resolved-issues');
  if (!resolvedSection) return;
  
  // For this example, I'll just add placeholders
  resolvedSection.innerHTML = `
    <div class="section-header">
      <div class="section-icon">
        <i class="fas fa-check-circle"></i>
      </div>
      <div>
        <h2>Resolved Issues</h2>
        <p>Issues that have been successfully addressed and completed.</p>
      </div>
    </div>
    
    <div class="issues-container" id="resolved-issues-list">
      <!-- Resolved issues would be loaded here -->
      <div class="issue-card">
        <h3>Street Light Repair</h3>
        <div class="issue-meta">
          <span>#ELE-20230605</span>
          <span>Resolved: 12 Jun 2023</span>
        </div>
        <span class="issue-category electricity">Electricity</span>
        <p class="issue-description">Street lights in Ward 3 not functioning for the past week.</p>
        <div class="issue-detail"><strong>Location:</strong> Ward 3, Market Area</div>
        <div class="issue-detail"><strong>Reported By:</strong> +91 9876543210</div>
        <div class="issue-actions">
          <button class="btn btn-secondary">View Details</button>
        </div>
      </div>
      
      <div class="issue-card">
        <h3>Water Supply Disruption</h3>
        <div class="issue-meta">
          <span>#WAT-20230601</span>
          <span>Resolved: 10 Jun 2023</span>
        </div>
        <span class="issue-category water">Water Supply</span>
        <p class="issue-description">No water supply in Ward 2 for the last 3 days.</p>
        <div class="issue-detail"><strong>Location:</strong> Ward 2, Residential Area</div>
        <div class="issue-detail"><strong>Reported By:</strong> +91 9876543211</div>
        <div class="issue-actions">
          <button class="btn btn-secondary">View Details</button>
        </div>
      </div>
    </div>
  `;
}

// Function to set up budget form submission
function setupBudgetForm() {
  const budgetForm = document.getElementById('budget-form');
  if (!budgetForm) return;
  
  budgetForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const title = document.getElementById('budget-title').value;
    const category = document.getElementById('budget-category').value;
    const allocation = Number(document.getElementById('budget-allocation').value);
    const spent = Number(document.getElementById('budget-spent').value);
    const description = document.getElementById('budget-description').value;
    const projectsInput = document.getElementById('budget-projects').value;
    
    // Parse projects (comma separated)
    const projects = projectsInput ? projectsInput.split(',').map(p => p.trim()) : [];
    
    // Create budget object
    const newBudget = {
      id: Date.now().toString(),
      title,
      category,
      allocation,
      spent,
      description,
      projects,
      createdAt: new Date().toISOString()
    };
    
    // Get existing budgets and add new one
    const budgets = JSON.parse(localStorage.getItem('budgetItems') || '[]');
    budgets.push(newBudget);
    
    // Save to localStorage
    localStorage.setItem('budgetItems', JSON.stringify(budgets));
    
    // Update UI
    loadBudgetItemsForDashboard();
    
    // Reset form
    budgetForm.reset();
    
    // Show success message
    alert('Budget item added successfully');
  });
}

// Function to load budget items for dashboard
function loadBudgetItemsForDashboard() {
  const budgetItemsList = document.getElementById('budget-items-list');
  if (!budgetItemsList) return;
  
  // Get budget items
  const budgetItems = JSON.parse(localStorage.getItem('budgetItems') || '[]');
  
  // Clear container
  budgetItemsList.innerHTML = '';
  
  if (budgetItems.length === 0) {
    budgetItemsList.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 2rem;">
        <p>No budget items available. Use the form to add some.</p>
      </div>
    `;
    return;
  }
  
  // Add each budget item
  budgetItems.forEach(item => {
    const progress = (item.spent / item.allocation) * 100;
    
    const previewCard = document.createElement('div');
    previewCard.className = 'preview-card';
    previewCard.innerHTML = `
      <div class="preview-actions">
        <button class="edit-btn" data-id="${item.id}"><i class="fas fa-edit"></i></button>
        <button class="delete-btn" data-id="${item.id}"><i class="fas fa-trash"></i></button>
      </div>
      <h3>${item.title}</h3>
      <div class="allocation-bar">
        <div class="allocation-progress" style="width: ${progress}%"></div>
      </div>
      <div style="display: flex; justify-content: space-between; margin-top: 0.5rem;">
        <span>₹${item.allocation.toLocaleString()}</span>
        <span>${Math.round(progress)}% spent</span>
      </div>
      <p style="margin-top: 1rem;">${item.description}</p>
    `;
    
    budgetItemsList.appendChild(previewCard);
  });
  
  // Add event listeners to delete buttons
  budgetItemsList.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', function() {
      const itemId = this.getAttribute('data-id');
      if (confirm('Are you sure you want to delete this budget item?')) {
        deleteBudgetItem(itemId);
      }
    });
  });
}

// Function to delete budget item
function deleteBudgetItem(itemId) {
  let budgetItems = JSON.parse(localStorage.getItem('budgetItems') || '[]');
  budgetItems = budgetItems.filter(item => item.id !== itemId);
  localStorage.setItem('budgetItems', JSON.stringify(budgetItems));
  
  // Update UI
  loadBudgetItemsForDashboard();
  
  // Show success message
  alert('Budget item deleted successfully');
}

// Function to set up gallery form submission
function setupGalleryForm() {
  const galleryForm = document.getElementById('gallery-form');
  const fileInput = document.getElementById('gallery-file-input');
  const filePreview = document.getElementById('gallery-file-preview');
  
  if (!galleryForm || !fileInput || !filePreview) return;
  
  // Set up file upload preview
  const fileUpload = document.querySelector('#gallery-management .file-upload');
  if (fileUpload) {
    fileUpload.addEventListener('click', () => {
      fileInput.click();
    });
    
    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0) {
        filePreview.innerHTML = '';
        
        const file = fileInput.files[0];
        if (file.type.startsWith('image/')) {
          const thumbnail = document.createElement('div');
          thumbnail.className = 'file-thumbnail';
          
          const img = document.createElement('img');
          img.src = URL.createObjectURL(file);
          thumbnail.appendChild(img);
          
          filePreview.appendChild(thumbnail);
        }
      }
    });
  }
  
  // Set up form submission
  galleryForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Check if file is selected
    if (fileInput.files.length === 0) {
      alert('Please select an image to upload');
      return;
    }
    
    // Get form values
    const title = document.getElementById('image-title').value;
    const description = document.getElementById('image-description').value;
    const category = document.getElementById('image-category').value;
    const file = fileInput.files[0];
    
    // Create a placeholder URL (in a real app, you would upload the file to a server)
    // Here we're just using a placeholder URL for demo purposes
    const imageUrl = URL.createObjectURL(file);
    
    // Create gallery item object
    const newGalleryItem = {
      id: Date.now().toString(),
      title,
      description,
      category,
      image: imageUrl,  // In a real app, this would be the server URL
      uploadedAt: new Date().toISOString()
    };
    
    // Get existing gallery items and add new one
    const galleryItems = JSON.parse(localStorage.getItem('galleryItems') || '[]');
    galleryItems.push(newGalleryItem);
    
    // Save to localStorage
    localStorage.setItem('galleryItems', JSON.stringify(galleryItems));
    
    // Update UI
    loadGalleryItemsForDashboard();
    
    // Reset form
    galleryForm.reset();
    filePreview.innerHTML = '';
    
    // Show success message
    alert('Image added to gallery successfully');
  });
}

// Function to load gallery items for dashboard
function loadGalleryItemsForDashboard() {
  const galleryPreviewList = document.getElementById('gallery-preview-list');
  if (!galleryPreviewList) return;
  
  // Get gallery items
  const galleryItems = JSON.parse(localStorage.getItem('galleryItems') || '[]');
  
  // Clear container
  galleryPreviewList.innerHTML = '';
  
  if (galleryItems.length === 0) {
    galleryPreviewList.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 2rem;">
        <p>No gallery images available. Use the form to add some.</p>
      </div>
    `;
    return;
  }
  
  // Add each gallery item
  galleryItems.forEach(item => {
    const previewItem = document.createElement('div');
    previewItem.className = 'gallery-preview-item';
    previewItem.innerHTML = `
      <img src="${item.image}" alt="${item.title}">
      <div class="gallery-preview-actions">
        <button class="edit-btn" data-id="${item.id}"><i class="fas fa-edit"></i></button>
        <button class="delete-btn" data-id="${item.id}"><i class="fas fa-trash"></i></button>
      </div>
    `;
    
    galleryPreviewList.appendChild(previewItem);
  });
  
  // Add event listeners to delete buttons
  galleryPreviewList.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', function() {
      const itemId = this.getAttribute('data-id');
      if (confirm('Are you sure you want to delete this gallery image?')) {
        deleteGalleryItem(itemId);
      }
    });
  });
}

// Function to delete gallery item
function deleteGalleryItem(itemId) {
  let galleryItems = JSON.parse(localStorage.getItem('galleryItems') || '[]');
  galleryItems = galleryItems.filter(item => item.id !== itemId);
  localStorage.setItem('galleryItems', JSON.stringify(galleryItems));
  
  // Update UI
  loadGalleryItemsForDashboard();
  
  // Show success message
  alert('Gallery image deleted successfully');
}

// Function to set up event form submission
function setupEventForm() {
  const eventForm = document.getElementById('event-form');
  if (!eventForm) return;
  
  eventForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const title = document.getElementById('event-title').value;
    const date = document.getElementById('event-date').value;
    const time = document.getElementById('event-time').value;
    const location = document.getElementById('event-location').value;
    const description = document.getElementById('event-description').value;
    
    // Create event object
    const newEvent = {
      id: Date.now().toString(),
      title,
      date,
      time,
      location,
      description,
      createdAt: new Date().toISOString()
    };
    
    // Get existing events and add new one
    const events = JSON.parse(localStorage.getItem('eventItems') || '[]');
    events.push(newEvent);
    
    // Save to localStorage
    localStorage.setItem('eventItems', JSON.stringify(events));
    
    // Update UI
    loadEventsForDashboard();
    
    // Reset form
    eventForm.reset();
    
    // Show success message
    alert('Event added successfully');
  });
}

// Function to load events for dashboard
function loadEventsForDashboard() {
  const eventsPreviewList = document.getElementById('events-preview-list');
  if (!eventsPreviewList) return;
  
  // Get events
  const events = JSON.parse(localStorage.getItem('eventItems') || '[]');
  
  // Clear container
  eventsPreviewList.innerHTML = '';
  
  if (events.length === 0) {
    eventsPreviewList.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 2rem;">
        <p>No events available. Use the form to add some.</p>
      </div>
    `;
    return;
  }
  
  // Sort events by date (upcoming first)
  events.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Add each event
  events.forEach(event => {
    // Format date
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    
    const previewCard = document.createElement('div');
    previewCard.className = 'preview-card';
    previewCard.innerHTML = `
      <div class="preview-actions">
        <button class="edit-btn" data-id="${event.id}"><i class="fas fa-edit"></i></button>
        <button class="delete-btn" data-id="${event.id}"><i class="fas fa-trash"></i></button>
      </div>
      <h3>${event.title}</h3>
      <div style="margin: 0.75rem 0; color: var(--gray-600);">
        <div><i class="fas fa-calendar-alt"></i> ${formattedDate}</div>
        <div><i class="fas fa-clock"></i> ${event.time}</div>
        <div><i class="fas fa-map-marker-alt"></i> ${event.location}</div>
      </div>
      <p>${event.description}</p>
    `;
    
    eventsPreviewList.appendChild(previewCard);
  });
  
  // Add event listeners to delete buttons
  eventsPreviewList.querySelectorAll('.delete-btn').forEach(button => {
    button.addEventListener('click', function() {
      const eventId = this.getAttribute('data-id');
      if (confirm('Are you sure you want to delete this event?')) {
        deleteEvent(eventId);
      }
    });
  });
}

// Function to delete event
function deleteEvent(eventId) {
  let events = JSON.parse(localStorage.getItem('eventItems') || '[]');
  events = events.filter(event => event.id !== eventId);
  localStorage.setItem('eventItems', JSON.stringify(events));
  
  // Update UI
  loadEventsForDashboard();
  
  // Show success message
  alert('Event deleted successfully');
}

// Helper function to format date
function formatDate(dateString) {
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Helper function to get category display name
function getCategoryName(categoryId) {
  const categories = {
    'road': 'Road & Transportation',
    'water': 'Water Supply',
    'electricity': 'Electricity',
    'sanitation': 'Sanitation & Waste',
    'health': 'Health Services',
    'education': 'Education',
    'agriculture': 'Agriculture',
    'public-safety': 'Public Safety',
    'other': 'Other'
  };
  
  return categories[categoryId] || categoryId;
}
