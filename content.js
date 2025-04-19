
// Content management for RuralConnect
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the home page
    const budgetPreviewContainer = document.getElementById('budgetPreviewContainer');
    if (budgetPreviewContainer) {
        loadBudgetPreview();
    }
    
    // Check if we're on the budget page
    const budgetContainer = document.getElementById('budgetContainer');
    if (budgetContainer) {
        loadBudgetContent();
        setupBudgetModal();
    }
    
    // Check if we're on the events page
    const eventsContainer = document.getElementById('eventsContainer');
    if (eventsContainer) {
        loadEventsContent();
    }
    
    // Check if we're on the history page
    const historyContainer = document.getElementById('historyContainer');
    if (historyContainer) {
        loadHistoryContent();
    }
    
    // Check if we're on the resources page
    const resourcesContainer = document.getElementById('resourcesContainer');
    if (resourcesContainer) {
        loadResourcesContent();
    }
    
    // Check if we're on the announcements page
    const announcementsContainer = document.getElementById('announcementsContainer');
    if (announcementsContainer) {
        loadAnnouncementsContent();
    }
    
    // Check if we're on the issue tracking page
    const issueTrackingContainer = document.getElementById('issueTrackingContainer');
    if (issueTrackingContainer) {
        loadIssueTracking();
    }
});

// Load budget preview on home page
function loadBudgetPreview() {
    const budgetPreviewContainer = document.getElementById('budgetPreviewContainer');
    if (!budgetPreviewContainer) return;
    
    // Get budget content from localStorage
    const villageContent = JSON.parse(localStorage.getItem('villageContent')) || [];
    const budgetContent = villageContent.filter(content => content.type === 'budget');
    
    if (budgetContent.length === 0) {
        budgetPreviewContainer.innerHTML = `
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
    
    // Get the latest 3 budgets
    const latestBudgets = budgetContent.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate)).slice(0, 3);
    
    let budgetHTML = '<div class="budget-cards">';
    
    latestBudgets.forEach(budget => {
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
                    
                    <div class="budget-meta">
                        <span>Posted by ${budget.postedBy}</span>
                        <span>${new Date(budget.postedDate).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    budgetHTML += '</div>';
    budgetHTML += `
        <div class="text-center mt-8">
            <a href="budget.html" class="btn btn-primary">
                <i class="fas fa-money-bill-wave"></i> View All Budget Details
            </a>
        </div>
    `;
    
    budgetPreviewContainer.innerHTML = budgetHTML;
}

// Load full budget content on budget page
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
                    
                    <div class="budget-meta">
                        <span>Posted by ${budget.postedBy}</span>
                        <span>${new Date(budget.postedDate).toLocaleDateString()}</span>
                    </div>
                    
                    <button class="btn btn-outline-accent w-full mt-4 view-budget-details" data-id="${budget.id}">
                        <i class="fas fa-info-circle"></i> View Details
                    </button>
                </div>
            </div>
        `;
    });
    
    budgetHTML += '</div>';
    
    budgetContainer.innerHTML = budgetHTML;
    
    // Add event listeners to view budget details buttons
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
    if (!modal) return;
    
    const modalClose = document.getElementById('modalClose');
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            modal.classList.remove('active');
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.classList.remove('active');
        }
    });
}

// Show budget details in modal
function showBudgetDetails(budgetId) {
    const modal = document.getElementById('budgetDetailModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    if (!modal || !modalTitle || !modalBody) return;
    
    // Get budget details from localStorage
    const villageContent = JSON.parse(localStorage.getItem('villageContent')) || [];
    const budget = villageContent.find(item => item.id === budgetId);
    
    if (!budget) {
        modalBody.innerHTML = '<p>Budget information not found.</p>';
        return;
    }
    
    modalTitle.textContent = budget.title;
    
    // Format budget details for modal
    const completionPercentage = budget.completion || 0;
    
    const detailsHTML = `
        <div class="budget-details">
            <div class="budget-amount-lg">₹${budget.allocated ? budget.allocated.toLocaleString() : '0'}</div>
            <p class="budget-desc">${budget.description}</p>
            
            <div class="budget-details-grid">
                <div class="detail-item">
                    <span class="detail-label">Allocated Amount</span>
                    <span class="detail-value">₹${budget.allocated ? budget.allocated.toLocaleString() : '0'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Current Expenditure</span>
                    <span class="detail-value">₹${budget.expenditure ? budget.expenditure.toLocaleString() : '0'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Remaining Budget</span>
                    <span class="detail-value">₹${budget.allocated && budget.expenditure ? (budget.allocated - budget.expenditure).toLocaleString() : '0'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Completion Status</span>
                    <span class="detail-value">${completionPercentage}%</span>
                </div>
            </div>
            
            <div class="progress-wrapper mt-4">
                <div class="progress-bar">
                    <div class="progress" style="width: ${completionPercentage}%"></div>
                </div>
            </div>
            
            <div class="budget-posted-by mt-4">
                <div><strong>Posted by:</strong> ${budget.postedBy}</div>
                <div><strong>Posted on:</strong> ${new Date(budget.postedDate).toLocaleDateString()}</div>
            </div>
        </div>
    `;
    
    modalBody.innerHTML = detailsHTML;
    
    // Show modal
    modal.classList.add('active');
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
                <h2>No Events Scheduled</h2>
                <p>Stay tuned for upcoming village events.</p>
            </div>
        `;
        return;
    }
    
    // Sort events by date
    const upcomingEvents = eventsContent.filter(event => new Date(event.date) >= new Date())
        .sort((a, b) => new Date(a.date) - new Date(b.date));
    
    const pastEvents = eventsContent.filter(event => new Date(event.date) < new Date())
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    let eventsHTML = '';
    
    // Display upcoming events
    if (upcomingEvents.length > 0) {
        eventsHTML += `
            <h2 class="text-center mb-6">Upcoming Events</h2>
            <div class="events-grid">
        `;
        
        upcomingEvents.forEach(event => {
            const eventDate = new Date(event.date);
            
            eventsHTML += `
                <div class="event-card">
                    <div class="event-header">
                        <span>${event.location}</span>
                        <h3>${event.title}</h3>
                    </div>
                    
                    <div class="event-details">
                        <div class="event-detail">
                            <i class="fas fa-calendar-day"></i>
                            <span>${eventDate.toDateString()}</span>
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
                            <span>Expected: ${event.attendees || 'N/A'}</span>
                        </div>
                    </div>
                    
                    <p>${event.description}</p>
                    
                    <div class="event-meta mt-4">
                        <span>Posted by ${event.postedBy}</span>
                        <span>${new Date(event.postedDate).toLocaleDateString()}</span>
                    </div>
                </div>
            `;
        });
        
        eventsHTML += '</div>';
    }
    
    // Display past events
    if (pastEvents.length > 0) {
        eventsHTML += `
            <h2 class="text-center mb-6 mt-8">Past Events</h2>
            <div class="events-grid">
        `;
        
        pastEvents.forEach(event => {
            const eventDate = new Date(event.date);
            
            eventsHTML += `
                <div class="event-card">
                    <div class="event-header">
                        <span class="past-event">${event.location}</span>
                        <h3>${event.title}</h3>
                    </div>
                    
                    <div class="event-details">
                        <div class="event-detail">
                            <i class="fas fa-calendar-day"></i>
                            <span>${eventDate.toDateString()}</span>
                        </div>
                        <div class="event-detail">
                            <i class="fas fa-clock"></i>
                            <span>${event.time}</span>
                        </div>
                        <div class="event-detail">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${event.location}</span>
                        </div>
                    </div>
                    
                    <p>${event.description}</p>
                    
                    <div class="event-meta mt-4">
                        <span>Posted by ${event.postedBy}</span>
                        <span>${new Date(event.postedDate).toLocaleDateString()}</span>
                    </div>
                </div>
            `;
        });
        
        eventsHTML += '</div>';
    }
    
    eventsContainer.innerHTML = eventsHTML;
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
                <h2>No Historical Records Available</h2>
                <p>Check back later for historical information about our village.</p>
            </div>
        `;
        return;
    }
    
    // Sort history content by date
    const sortedHistory = historyContent.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
    
    let historyHTML = '<div class="history-timeline">';
    
    sortedHistory.forEach((history, index) => {
        historyHTML += `
            <div class="history-item">
                <div class="history-content">
                    <h3>${history.title}</h3>
                    <p>${history.description}</p>
                    <div class="history-meta">
                        <span>Posted by ${history.postedBy}</span>
                        <span>${new Date(history.postedDate).toLocaleDateString()}</span>
                    </div>
                </div>
            </div>
        `;
    });
    
    historyHTML += '</div>';
    
    historyContainer.innerHTML = historyHTML;
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
                <p>Check back later for resources and documents.</p>
            </div>
        `;
        return;
    }
    
    // Sort resources by type
    const resourcesByType = {};
    resourcesContent.forEach(resource => {
        if (!resourcesByType[resource.resourceType]) {
            resourcesByType[resource.resourceType] = [];
        }
        resourcesByType[resource.resourceType].push(resource);
    });
    
    let resourcesHTML = '';
    
    // Display resources by type
    Object.keys(resourcesByType).forEach(type => {
        resourcesHTML += `
            <h2 class="text-center mb-6 mt-8">${type} Resources</h2>
            <div class="resources-grid">
        `;
        
        resourcesByType[type].forEach(resource => {
            resourcesHTML += `
                <div class="resource-card">
                    <div class="resource-icon">
                        <i class="fas fa-file-alt"></i>
                    </div>
                    <div class="resource-details">
                        <h3>${resource.title}</h3>
                        <p>${resource.description}</p>
                        <div class="resource-meta">
                            <span>Posted on ${new Date(resource.postedDate).toLocaleDateString()}</span>
                            <a href="${resource.resourceLink}" target="_blank" class="download-btn">
                                <i class="fas fa-download"></i> Download
                            </a>
                        </div>
                    </div>
                </div>
            `;
        });
        
        resourcesHTML += '</div>';
    });
    
    resourcesContainer.innerHTML = resourcesHTML;
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
                <p>Check back later for village announcements.</p>
            </div>
        `;
        return;
    }
    
    // Sort announcements by date (newest first)
    const sortedAnnouncements = announcementsContent.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
    
    let announcementsHTML = '<div class="announcements-list">';
    
    sortedAnnouncements.forEach(announcement => {
        const postedDate = new Date(announcement.postedDate);
        
        announcementsHTML += `
            <div class="announcement-card">
                <div class="announcement-header">
                    <h3>${announcement.title}</h3>
                    <span class="announcement-date">${postedDate.toLocaleDateString()}</span>
                </div>
                <div class="announcement-content">
                    <p>${announcement.description}</p>
                </div>
                <div class="announcement-footer">
                    <span>Posted by ${announcement.postedBy}</span>
                </div>
            </div>
        `;
    });
    
    announcementsHTML += '</div>';
    
    announcementsContainer.innerHTML = announcementsHTML;
}

// Load issue tracking
function loadIssueTracking() {
    const issueTrackingContainer = document.getElementById('issueTrackingContainer');
    if (!issueTrackingContainer) return;
    
    // Check if user is logged in
    const isUserLoggedIn = localStorage.getItem('isUserLoggedIn') === 'true';
    const userEmail = localStorage.getItem('userEmail');
    
    if (!isUserLoggedIn) {
        // Show login required message
        const loginRequiredContainer = document.getElementById('loginRequiredContainer');
        if (loginRequiredContainer) {
            loginRequiredContainer.classList.remove('hidden');
            
            // Setup login button
            const loginToTrackBtn = document.getElementById('loginToTrackBtn');
            if (loginToTrackBtn) {
                loginToTrackBtn.addEventListener('click', function() {
                    // Use the showLoginModal function from main.js
                    if (window.showLoginModal) {
                        window.showLoginModal();
                    } else {
                        alert('Please login to track issues.');
                    }
                });
            }
        }
        
        return;
    }
    
    // Get issues from localStorage
    let villageIssues = JSON.parse(localStorage.getItem('villageIssues')) || [];
    
    // Filter issues for current user
    const userIssues = villageIssues.filter(issue => issue.reportedBy === userEmail);
    
    if (userIssues.length === 0) {
        issueTrackingContainer.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-exclamation-circle"></i>
                </div>
                <h2>No Issues Reported</h2>
                <p>You haven't reported any issues yet. Click the button below to report a new issue.</p>
                <a href="report-issue.html" class="btn btn-primary mt-4">
                    <i class="fas fa-plus"></i> Report an Issue
                </a>
            </div>
        `;
        return;
    }
    
    // Sort issues by date (newest first)
    const sortedIssues = userIssues.sort((a, b) => new Date(b.dateReported) - new Date(a.dateReported));
    
    let issuesHTML = '<div class="issues-list">';
    
    sortedIssues.forEach(issue => {
        const reportedDate = new Date(issue.dateReported);
        
        issuesHTML += `
            <div class="issue-card">
                <div class="issue-header">
                    <h3>${issue.type}</h3>
                    <div class="issue-status ${issue.status}">${formatIssueStatus(issue.status)}</div>
                </div>
                
                <p>${issue.description}</p>
                
                <div class="issue-meta">
                    <span><i class="fas fa-map-marker-alt"></i> ${issue.location}</span>
                    <span><i class="fas fa-sort-numeric-up"></i> Ward ${issue.ward}</span>
                    <span><i class="fas fa-calendar-alt"></i> ${reportedDate.toLocaleDateString()}</span>
                    <span><i class="fas fa-tag"></i> ${issue.id}</span>
                </div>
                
                <div class="issue-timeline">
                    <div class="timeline-item ${issue.status !== 'pending' ? 'completed' : 'active'}">
                        <div class="timeline-icon">
                            <i class="fas fa-flag"></i>
                        </div>
                        <div class="timeline-content">
                            <div class="timeline-header">
                                <h4>Issue Reported</h4>
                                <span>${reportedDate.toLocaleDateString()}</span>
                            </div>
                            <p>Issue submitted with details and location.</p>
                        </div>
                    </div>
                    
                    <div class="timeline-item ${issue.status !== 'pending' ? 'completed' : 'pending'}">
                        <div class="timeline-icon">
                            <i class="fas fa-check"></i>
                        </div>
                        <div class="timeline-content">
                            <div class="timeline-header">
                                <h4>Reviewed by Ward Member</h4>
                                <span>${issue.reviewDate ? new Date(issue.reviewDate).toLocaleDateString() : 'Pending'}</span>
                            </div>
                            <p>${issue.status === 'rejected' ? 'Issue rejected by ward member.' : issue.status === 'pending' ? 'Waiting for ward member review.' : 'Issue verified and forwarded to village authorities.'}</p>
                        </div>
                    </div>
                    
                    <div class="timeline-item ${issue.status === 'in-progress' || issue.status === 'resolved' ? 'completed' : issue.status === 'forwarded' ? 'active' : 'pending'}">
                        <div class="timeline-icon">
                            <i class="fas fa-tools"></i>
                        </div>
                        <div class="timeline-content">
                            <div class="timeline-header">
                                <h4>Work in Progress</h4>
                                <span>${issue.progressDate ? new Date(issue.progressDate).toLocaleDateString() : 'Pending'}</span>
                            </div>
                            <p>${issue.status === 'in-progress' ? 'Work has started on resolving the issue.' : issue.status === 'resolved' ? 'Work completed successfully.' : 'Waiting for authorities to start work.'}</p>
                        </div>
                    </div>
                    
                    <div class="timeline-item ${issue.status === 'resolved' ? 'completed' : 'pending'}">
                        <div class="timeline-icon">
                            <i class="fas fa-check-double"></i>
                        </div>
                        <div class="timeline-content">
                            <div class="timeline-header">
                                <h4>Resolution</h4>
                                <span>${issue.resolveDate ? new Date(issue.resolveDate).toLocaleDateString() : 'Pending'}</span>
                            </div>
                            <p>${issue.status === 'resolved' ? 'Issue has been successfully resolved.' : 'Issue will be marked as resolved once work is completed.'}</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    issuesHTML += '</div>';
    
    issueTrackingContainer.innerHTML = issuesHTML;
}

// Format issue status for display
function formatIssueStatus(status) {
    switch(status) {
        case 'pending': return 'Pending Review';
        case 'forwarded': return 'Forwarded';
        case 'in-progress': return 'In Progress';
        case 'resolved': return 'Resolved';
        case 'rejected': return 'Rejected';
        default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
}
