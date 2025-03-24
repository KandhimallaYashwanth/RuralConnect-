// Content management for public-facing pages
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    // Handle different sections based on the current page
    const currentPage = window.location.pathname.split('/').pop();
    
    // Redirect to home page events section if not logged in
    if (!isLoggedIn && (
        currentPage === 'budget.html' || 
        currentPage === 'resources.html' || 
        currentPage === 'history.html' || 
        currentPage === 'announcements.html'
    )) {
        localStorage.setItem('redirectAfterLogin', currentPage);
        notify('Please login to view this section', 'warning');
        window.location.href = 'index.html#events-section';
        return;
    }
    
    // Load appropriate content based on the current page
    switch (currentPage) {
        case 'budget.html':
            loadBudgetContent();
            setupBudgetModal();
            break;
        case 'events.html':
            loadEventsContent();
            break;
        case 'resources.html':
            loadResourcesContent();
            break;
        case 'history.html':
            loadHistoryContent();
            break;
        case 'announcements.html':
            loadAnnouncementsContent();
            break;
        case 'index.html':
        case '':
            // Load preview sections for the landing page
            loadBudgetPreview();
            loadEventsPreview();
            loadResourcesPreview();
            break;
    }
});

// Load budget content
function loadBudgetContent() {
    const budgetContainer = document.getElementById('budgetContainer');
    if (!budgetContainer) return;
    
    // Get budget content from localStorage
    const villageContent = JSON.parse(localStorage.getItem('villageContent')) || [];
    const budgetContent = villageContent.filter(content => content.type === 'budget');
    
    if (budgetContent.length === 0) {
        budgetContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-money-bill-wave"></i>
                </div>
                <h2>No Budget Information Available</h2>
                <p>Budget information will be posted by village authorities soon.</p>
            </div>
        `;
        return;
    }
    
    let budgetHTML = '<div class="budget-cards">';
    
    budgetContent.forEach(budget => {
        const completionPercentage = budget.completion || 0;
        
        budgetHTML += `
            <div class="budget-card" data-id="${budget.id}">
                <div class="budget-header">
                    <h3>${budget.title}</h3>
                </div>
                <div class="budget-body">
                    <div class="budget-amount">₹${budget.allocated ? budget.allocated.toLocaleString() : '0'}</div>
                    <div class="budget-description">${budget.description}</div>
                    
                    <div class="budget-stats">
                        <div class="stat">
                            <span class="stat-label">Allocated</span>
                            <span class="stat-value">₹${budget.allocated ? budget.allocated.toLocaleString() : '0'}</span>
                        </div>
                        <div class="stat">
                            <span class="stat-label">Expenditure</span>
                            <span class="stat-value">₹${budget.expenditure ? budget.expenditure.toLocaleString() : '0'}</span>
                        </div>
                    </div>
                    
                    <div class="progress-wrapper">
                        <div class="progress-label">
                            <span>Completion</span>
                            <span>${completionPercentage}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress" style="width: ${completionPercentage}%"></div>
                        </div>
                    </div>
                    
                    <button class="btn btn-outline-accent w-full mt-4 view-budget-details" data-id="${budget.id}">
                        <i class="fas fa-info-circle"></i> View Details
                    </button>
                    
                    <div class="budget-meta">
                        <span><i class="fas fa-user"></i> Posted by: ${budget.postedBy}</span>
                        <span><i class="fas fa-clock"></i> ${new Date(budget.postedDate).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    budgetHTML += '</div>';
    budgetContainer.innerHTML = budgetHTML;
    
    // Add event listeners for budget detail buttons
    document.querySelectorAll('.view-budget-details').forEach(button => {
        button.addEventListener('click', function() {
            const budgetId = this.getAttribute('data-id');
            showBudgetDetails(budgetId);
        });
    });
}

// Setup budget detail modal
function setupBudgetModal() {
    const modal = document.getElementById('budgetDetailModal');
    const modalClose = document.getElementById('modalClose');
    
    if (modal && modalClose) {
        modalClose.addEventListener('click', function() {
            modal.classList.remove('active');
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.classList.remove('active');
            }
        });
    }
}

// Show budget details in modal
function showBudgetDetails(budgetId) {
    const modal = document.getElementById('budgetDetailModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    if (!modal || !modalTitle || !modalBody) return;
    
    // Get budget data
    const villageContent = JSON.parse(localStorage.getItem('villageContent')) || [];
    const budget = villageContent.find(content => content.id === budgetId);
    
    if (!budget) return;
    
    modalTitle.textContent = budget.title;
    
    const completionPercentage = budget.completion || 0;
    const remaining = (budget.allocated || 0) - (budget.expenditure || 0);
    
    modalBody.innerHTML = `
        <div class="budget-detail">
            <p class="mb-4">${budget.description}</p>
            
            <div class="budget-detail-stats grid grid-cols-2 gap-4 mb-6">
                <div class="stat-card bg-gray-100 p-4 rounded-lg text-center">
                    <div class="text-xl font-bold text-leaf">₹${budget.allocated ? budget.allocated.toLocaleString() : '0'}</div>
                    <div class="text-sm text-gray-600">Total Allocated</div>
                </div>
                <div class="stat-card bg-gray-100 p-4 rounded-lg text-center">
                    <div class="text-xl font-bold text-terracotta">₹${budget.expenditure ? budget.expenditure.toLocaleString() : '0'}</div>
                    <div class="text-sm text-gray-600">Total Expenditure</div>
                </div>
                <div class="stat-card bg-gray-100 p-4 rounded-lg text-center">
                    <div class="text-xl font-bold text-sky">₹${remaining.toLocaleString()}</div>
                    <div class="text-sm text-gray-600">Remaining Budget</div>
                </div>
                <div class="stat-card bg-gray-100 p-4 rounded-lg text-center">
                    <div class="text-xl font-bold text-mustard">${completionPercentage}%</div>
                    <div class="text-sm text-gray-600">Completion</div>
                </div>
            </div>
            
            <div class="progress-wrapper mb-6">
                <div class="progress-label">
                    <span>Project Completion</span>
                    <span>${completionPercentage}%</span>
                </div>
                <div class="progress-bar">
                    <div class="progress" style="width: ${completionPercentage}%"></div>
                </div>
            </div>
            
            <div class="budget-meta-detail">
                <div class="meta-item mb-2">
                    <span class="font-semibold">Posted by:</span> ${budget.postedBy}
                </div>
                <div class="meta-item mb-2">
                    <span class="font-semibold">Posted on:</span> ${new Date(budget.postedDate).toLocaleString()}
                </div>
            </div>
        </div>
    `;
    
    modal.classList.add('active');
}

// Load budget preview on landing page
function loadBudgetPreview() {
    const budgetPreviewContainer = document.getElementById('budgetPreviewContainer');
    if (!budgetPreviewContainer) return;
    
    // Get budget content from localStorage
    const villageContent = JSON.parse(localStorage.getItem('villageContent')) || [];
    const budgetContent = villageContent.filter(content => content.type === 'budget');
    
    // Display only the latest 3 budgets
    const recentBudgets = budgetContent.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate)).slice(0, 3);
    
    if (recentBudgets.length === 0) {
        budgetPreviewContainer.innerHTML = `
            <div class="empty-state">
                <p>No budget information available yet.</p>
                <a href="budget.html" class="btn btn-outline-accent mt-4">View All Budgets</a>
            </div>
        `;
        return;
    }
    
    let budgetHTML = '<div class="budget-cards">';
    
    recentBudgets.forEach(budget => {
        const completionPercentage = budget.completion || 0;
        
        budgetHTML += `
            <div class="budget-card">
                <div class="budget-header">
                    <h3>${budget.title}</h3>
                </div>
                <div class="budget-body">
                    <div class="budget-amount">₹${budget.allocated ? budget.allocated.toLocaleString() : '0'}</div>
                    <div class="budget-description">${budget.description.substring(0, 100)}${budget.description.length > 100 ? '...' : ''}</div>
                    
                    <div class="progress-wrapper">
                        <div class="progress-label">
                            <span>Completion</span>
                            <span>${completionPercentage}%</span>
                        </div>
                        <div class="progress-bar">
                            <div class="progress" style="width: ${completionPercentage}%"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    budgetHTML += '</div>';
    budgetHTML += `
        <div class="text-center mt-8">
            <a href="budget.html" class="btn btn-primary">View All Budgets</a>
        </div>
    `;
    
    budgetPreviewContainer.innerHTML = budgetHTML;
}

// Load events content
function loadEventsContent() {
    const eventsContainer = document.getElementById('eventsContainer');
    if (!eventsContainer) return;
    
    // Get events content from localStorage
    const villageContent = JSON.parse(localStorage.getItem('villageContent')) || [];
    const eventsContent = villageContent.filter(content => content.type === 'event');
    
    if (eventsContent.length === 0) {
        eventsContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-calendar-alt"></i>
                </div>
                <h2>No Events Available</h2>
                <p>Events will be posted by village authorities soon.</p>
            </div>
        `;
        return;
    }
    
    // Sort events by date (upcoming first)
    const sortedEvents = eventsContent.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    let eventsHTML = '<div class="events-grid">';
    
    sortedEvents.forEach(event => {
        const eventDate = new Date(event.date);
        const isUpcoming = eventDate >= new Date();
        
        eventsHTML += `
            <div class="event-card ${isUpcoming ? 'upcoming' : 'past'}">
                <div class="event-header">
                    <span>${isUpcoming ? 'Upcoming' : 'Past'}</span>
                    <h3>${event.title}</h3>
                </div>
                
                <div class="event-details">
                    <div class="event-detail">
                        <i class="fas fa-calendar-day"></i>
                        <span>${eventDate.toLocaleDateString()}</span>
                    </div>
                    <div class="event-detail">
                        <i class="fas fa-clock"></i>
                        <span>${event.time}</span>
                    </div>
                    <div class="event-detail">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${event.location}</span>
                    </div>
                    <div class="event-detail">
                        <i class="fas fa-users"></i>
                        <span>Expected: ${event.attendees} attendees</span>
                    </div>
                </div>
                
                <p>${event.description}</p>
                
                <button class="btn btn-outline-accent w-full mt-4 view-event-details" data-id="${event.id}">
                    <i class="fas fa-info-circle"></i> Event Details
                </button>
                
                <div class="event-meta">
                    <span><i class="fas fa-user"></i> Posted by: ${event.postedBy}</span>
                    <span><i class="fas fa-clock"></i> ${new Date(event.postedDate).toLocaleDateString()}</span>
                </div>
            </div>
        `;
    });
    
    eventsHTML += '</div>';
    eventsContainer.innerHTML = eventsHTML;
    
    // Add event listeners for event detail buttons
    document.querySelectorAll('.view-event-details').forEach(button => {
        button.addEventListener('click', function() {
            const eventId = this.getAttribute('data-id');
            showEventDetails(eventId);
        });
    });
}

// Load events preview on landing page
function loadEventsPreview() {
    const eventsPreviewContainer = document.getElementById('eventsPreviewContainer');
    if (!eventsPreviewContainer) return;
    
    // Get events content from localStorage
    const villageContent = JSON.parse(localStorage.getItem('villageContent')) || [];
    const eventsContent = villageContent.filter(content => content.type === 'event');
    
    // Get only upcoming events and sort by date (closest first)
    const today = new Date();
    const upcomingEvents = eventsContent
        .filter(event => new Date(event.date) >= today)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 3); // Get only the next 3 events
    
    if (upcomingEvents.length === 0) {
        // If no upcoming events, show the default events from the HTML
        return;
    }
    
    let eventsHTML = '<div class="events-grid">';
    
    upcomingEvents.forEach(event => {
        const eventDate = new Date(event.date);
        
        eventsHTML += `
            <div class="event-card">
                <div class="event-header">
                    <span>Upcoming</span>
                    <h3>${event.title}</h3>
                </div>
                
                <div class="event-details">
                    <div class="event-detail">
                        <i class="fas fa-calendar-day"></i>
                        <span>${eventDate.toLocaleDateString()}</span>
                    </div>
                    <div class="event-detail">
                        <i class="fas fa-clock"></i>
                        <span>${event.time}</span>
                    </div>
                    <div class="event-detail">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${event.location}</span>
                    </div>
                    <div class="event-detail">
                        <i class="fas fa-users"></i>
                        <span>Expected: ${event.attendees} attendees</span>
                    </div>
                </div>
                
                <p>${event.description.substring(0, 100)}${event.description.length > 100 ? '...' : ''}</p>
                
                <button class="btn btn-outline-accent w-full mt-4">
                    <i class="fas fa-info-circle"></i> Event Details
                </button>
            </div>
        `;
    });
    
    eventsHTML += '</div>';
    eventsHTML += `
        <div class="text-center mt-8">
            <a href="events.html" class="btn btn-primary">View All Events</a>
        </div>
    `;
    
    eventsPreviewContainer.innerHTML = eventsHTML;
}

// Load resources content
function loadResourcesContent() {
    const resourcesContainer = document.getElementById('resourcesContainer');
    if (!resourcesContainer) return;
    
    // Get resources content from localStorage
    const villageContent = JSON.parse(localStorage.getItem('villageContent')) || [];
    const resourcesContent = villageContent.filter(content => content.type === 'resource');
    
    if (resourcesContent.length === 0) {
        resourcesContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-file-alt"></i>
                </div>
                <h2>No Resources Available</h2>
                <p>Resources will be posted by village authorities soon.</p>
            </div>
        `;
        return;
    }
    
    let resourcesHTML = '<div class="resources-grid">';
    
    resourcesContent.forEach(resource => {
        let resourceIcon = 'fas fa-file-alt';
        
        // Set icon based on resource type
        switch(resource.resourceType) {
            case 'document':
                resourceIcon = 'fas fa-file-pdf';
                break;
            case 'form':
                resourceIcon = 'fas fa-file-alt';
                break;
            case 'guide':
                resourceIcon = 'fas fa-book';
                break;
            case 'contact':
                resourceIcon = 'fas fa-address-card';
                break;
        }
        
        resourcesHTML += `
            <div class="resource-card">
                <div class="resource-icon">
                    <i class="${resourceIcon}"></i>
                </div>
                <div class="resource-details">
                    <h3>${resource.title}</h3>
                    <p>${resource.description}</p>
                    <div class="resource-meta">
                        <span>Type: ${resource.resourceType}</span>
                        <a href="${resource.resourceLink}" target="_blank" class="download-btn">
                            <i class="fas fa-download"></i> Download
                        </a>
                    </div>
                </div>
            </div>
        `;
    });
    
    resourcesHTML += '</div>';
    resourcesContainer.innerHTML = resourcesHTML;
}

// Load resources preview on landing page
function loadResourcesPreview() {
    const resourcesPreviewContainer = document.getElementById('resourcesPreviewContainer');
    if (!resourcesPreviewContainer) return;
    
    // Get resources content from localStorage
    const villageContent = JSON.parse(localStorage.getItem('villageContent')) || [];
    const resourcesContent = villageContent.filter(content => content.type === 'resource');
    
    // Get the latest 4 resources
    const recentResources = resourcesContent
        .sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate))
        .slice(0, 4);
    
    if (recentResources.length === 0) {
        // If no resources, keep the default resources from the HTML
        return;
    }
    
    let resourcesHTML = '<div class="resources-grid">';
    
    recentResources.forEach(resource => {
        let resourceIcon = 'fas fa-file-alt';
        
        // Set icon based on resource type
        switch(resource.resourceType) {
            case 'document':
                resourceIcon = 'fas fa-file-pdf';
                break;
            case 'form':
                resourceIcon = 'fas fa-file-alt';
                break;
            case 'guide':
                resourceIcon = 'fas fa-book';
                break;
            case 'contact':
                resourceIcon = 'fas fa-address-card';
                break;
        }
        
        resourcesHTML += `
            <div class="resource-card">
                <div class="resource-icon">
                    <i class="${resourceIcon}"></i>
                </div>
                <div class="resource-details">
                    <h3>${resource.title}</h3>
                    <p>${resource.description.substring(0, 80)}${resource.description.length > 80 ? '...' : ''}</p>
                    <div class="resource-meta">
                        <span>Type: ${resource.resourceType}</span>
                        <a href="${resource.resourceLink}" target="_blank" class="download-btn">
                            <i class="fas fa-download"></i> Download
                        </a>
                    </div>
                </div>
            </div>
        `;
    });
    
    resourcesHTML += '</div>';
    resourcesHTML += `
        <div class="text-center mt-8">
            <a href="resources.html" class="btn btn-primary">
                <i class="fas fa-file-alt"></i> Explore All Resources
            </a>
        </div>
    `;
    
    resourcesPreviewContainer.innerHTML = resourcesHTML;
}

// Load history content
function loadHistoryContent() {
    const historyContainer = document.getElementById('historyContainer');
    if (!historyContainer) return;
    
    // Get history content from localStorage
    const villageContent = JSON.parse(localStorage.getItem('villageContent')) || [];
    const historyContent = villageContent.filter(content => content.type === 'history');
    
    if (historyContent.length === 0) {
        historyContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-history"></i>
                </div>
                <h2>No Historical Information Available</h2>
                <p>Historical information will be posted by village authorities soon.</p>
            </div>
        `;
        return;
    }
    
    // Sort history by posted date (newest first)
    const sortedHistory = historyContent.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
    
    let historyHTML = '<div class="history-timeline">';
    
    sortedHistory.forEach(history => {
        historyHTML += `
            <div class="history-item">
                <div class="history-marker"></div>
                <div class="history-content">
                    <div class="history-header">
                        <h3>${history.title}</h3>
                        <span>${new Date(history.postedDate).toLocaleDateString()}</span>
                    </div>
                    <div class="history-body">
                        <p>${history.description}</p>
                    </div>
                    <div class="history-meta">
                        <span>Posted by: ${history.postedBy}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    historyHTML += '</div>';
    historyContainer.innerHTML = historyHTML;
}

// Load announcements content
function loadAnnouncementsContent() {
    const announcementsContainer = document.getElementById('announcementsContainer');
    if (!announcementsContainer) return;
    
    // Get announcements content from localStorage
    const villageContent = JSON.parse(localStorage.getItem('villageContent')) || [];
    const announcementsContent = villageContent.filter(content => content.type === 'announcement');
    
    if (announcementsContent.length === 0) {
        announcementsContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-bullhorn"></i>
                </div>
                <h2>No Announcements Available</h2>
                <p>Announcements will be posted by village authorities soon.</p>
            </div>
        `;
        return;
    }
    
    // Sort announcements by posted date (newest first)
    const sortedAnnouncements = announcementsContent.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
    
    let announcementsHTML = '<div class="announcements-list">';
    
    sortedAnnouncements.forEach(announcement => {
        const postedDate = new Date(announcement.postedDate);
        const isRecent = (new Date() - postedDate) / (1000 * 60 * 60 * 24) < 7; // Less than 7 days old
        
        announcementsHTML += `
            <div class="announcement-card ${isRecent ? 'recent' : ''}">
                ${isRecent ? '<div class="new-badge">New</div>' : ''}
                <div class="announcement-header">
                    <h3>${announcement.title}</h3>
                    <span>${postedDate.toLocaleDateString()}</span>
                </div>
                <div class="announcement-body">
                    <p>${announcement.description}</p>
                </div>
                <div class="announcement-meta">
                    <span>Posted by: ${announcement.postedBy}</span>
                    <span>${formatTimeAgo(postedDate)}</span>
                </div>
            </div>
        `;
    });
    
    announcementsHTML += '</div>';
    announcementsContainer.innerHTML = announcementsHTML;
}

// Format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
}

// Format time ago
function formatTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    
    let interval = Math.floor(seconds / 31536000);
    if (interval > 1) return interval + ' years ago';
    
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) return interval + ' months ago';
    
    interval = Math.floor(seconds / 86400);
    if (interval > 1) return interval + ' days ago';
    
    interval = Math.floor(seconds / 3600);
    if (interval > 1) return interval + ' hours ago';
    
    interval = Math.floor(seconds / 60);
    if (interval > 1) return interval + ' minutes ago';
    
    return Math.floor(seconds) + ' seconds ago';
}

// Show event details
function showEventDetails(eventId) {
    // Get event data
    const villageContent = JSON.parse(localStorage.getItem('villageContent')) || [];
    const event = villageContent.find(content => content.id === eventId);
    
    if (!event) return;
    
    // Create modal if it doesn't exist
    let modal = document.getElementById('eventDetailModal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'eventDetailModal';
        modal.className = 'modal';
        
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 id="eventModalTitle">Event Details</h3>
                    <button class="modal-close" id="eventModalClose">&times;</button>
                </div>
                <div class="modal-body" id="eventModalBody">
                    <!-- Event details will be loaded here -->
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listener to close button
        document.getElementById('eventModalClose').addEventListener('click', function() {
            modal.classList.remove('active');
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.classList.remove('active');
            }
        });
    }
    
    // Update modal content
    const modalTitle = document.getElementById('eventModalTitle');
    const modalBody = document.getElementById('eventModalBody');
    
    modalTitle.textContent = event.title;
    
    const eventDate = new Date(event.date);
    const isUpcoming = eventDate >= new Date();
    
    modalBody.innerHTML = `
        <div class="event-detail">
            <p class="mb-4">${event.description}</p>
            
            <div class="event-detail-info">
                <div class="detail-item">
                    <div class="detail-label">Date</div>
                    <div class="detail-value">${eventDate.toLocaleDateString()}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Time</div>
                    <div class="detail-value">${event.time}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Location</div>
                    <div class="detail-value">${event.location}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Expected Attendees</div>
                    <div class="detail-value">${event.attendees}</div>
                </div>
                <div class="detail-item">
                    <div class="detail-label">Status</div>
                    <div class="detail-value status-badge ${isUpcoming ? 'upcoming' : 'past'}">
                        ${isUpcoming ? 'Upcoming' : 'Past Event'}
                    </div>
                </div>
            </div>
            
            <div class="event-meta-detail">
                <div class="meta-item mb-2">
                    <span class="font-semibold">Posted by:</span> ${event.postedBy}
                </div>
                <div class="meta-item mb-2">
                    <span class="font-semibold">Posted on:</span> ${new Date(event.postedDate).toLocaleString()}
                </div>
            </div>
            
            ${isUpcoming ? `
                <div class="event-actions">
                    <button class="btn btn-primary add-to-calendar">
                        <i class="fas fa-calendar-plus"></i> Add to Calendar
                    </button>
                </div>
            ` : ''}
        </div>
    `;
    
    // Add event listener to "Add to Calendar" button
    const addToCalendarBtn = modalBody.querySelector('.add-to-calendar');
    if (addToCalendarBtn) {
        addToCalendarBtn.addEventListener('click', function() {
            // Create calendar event URL (Google Calendar format)
            const eventTitle = encodeURIComponent(event.title);
            const eventDesc = encodeURIComponent(event.description);
            const eventLoc = encodeURIComponent(event.location);
            
            // Format date and time for Google Calendar
            const startDate = new Date(event.date + 'T' + event.time);
            const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000); // Add 2 hours
            
            const startDateStr = startDate.toISOString().replace(/-|:|\.\d+/g, '');
            const endDateStr = endDate.toISOString().replace(/-|:|\.\d+/g, '');
            
            const calendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&details=${eventDesc}&location=${eventLoc}&dates=${startDateStr}/${endDateStr}`;
            
            // Open calendar in new tab
            window.open(calendarUrl, '_blank');
        });
    }
    
    // Show modal
    modal.classList.add('active');
}
