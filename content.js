
// Content management for public pages
document.addEventListener('DOMContentLoaded', function() {
    // Check which page we're on
    const isBudgetPage = document.querySelector('body').classList.contains('budget-page') || 
                           window.location.pathname.includes('budget.html');
    const isEventsPage = document.querySelector('body').classList.contains('events-page') || 
                           window.location.pathname.includes('events.html');
    const isResourcesPage = document.querySelector('body').classList.contains('resources-page') || 
                           window.location.pathname.includes('resources.html');
    const isHistoryPage = document.querySelector('body').classList.contains('history-page') || 
                           window.location.pathname.includes('history.html');
    const isAnnouncementsPage = document.querySelector('body').classList.contains('announcements-page') || 
                           window.location.pathname.includes('announcements.html');
    
    // Get all village content from localStorage
    const villageContent = JSON.parse(localStorage.getItem('villageContent')) || [];
    
    // Handle budget page
    if (isBudgetPage) {
        const budgetContainer = document.getElementById('budgetContainer');
        if (!budgetContainer) return;
        
        const budgetItems = villageContent.filter(item => item.type === 'budget');
        
        if (budgetItems.length > 0) {
            // Hide default content if we have actual content
            const defaultContent = document.getElementById('defaultBudgetContent');
            if (defaultContent) {
                defaultContent.classList.add('hidden');
            }
            
            // Show dynamic content
            const dynamicContent = document.getElementById('dynamicBudgetContent');
            if (dynamicContent) {
                dynamicContent.classList.remove('hidden');
                
                let budgetHTML = '<div class="budget-cards">';
                budgetItems.forEach(budget => {
                    const utilized = Math.round((budget.expenditure / budget.allocated) * 100);
                    
                    budgetHTML += `
                        <div class="budget-card">
                            <h3>${budget.title}</h3>
                            <div class="budget-details">
                                <div class="budget-item">
                                    <span class="label">Allocated:</span>
                                    <span class="value">₹${formatNumber(budget.allocated)}</span>
                                </div>
                                <div class="budget-item">
                                    <span class="label">Expenditure:</span>
                                    <span class="value">₹${formatNumber(budget.expenditure)}</span>
                                </div>
                                <div class="budget-item">
                                    <span class="label">Utilization:</span>
                                    <span class="value">${utilized}%</span>
                                </div>
                                <div class="budget-progress">
                                    <div class="progress-bar" style="width: ${utilized}%"></div>
                                </div>
                                <div class="budget-item">
                                    <span class="label">Completion:</span>
                                    <span class="value">${budget.completion}</span>
                                </div>
                            </div>
                            <p class="budget-description">${budget.description}</p>
                            <button class="btn btn-outline budget-details-btn">View Details</button>
                        </div>
                    `;
                });
                budgetHTML += '</div>';
                
                dynamicContent.innerHTML = budgetHTML;
            }
        }
    }
    
    // Handle events page
    if (isEventsPage) {
        const eventsContainer = document.getElementById('eventsContainer');
        if (!eventsContainer) return;
        
        const eventItems = villageContent.filter(item => item.type === 'event');
        
        if (eventItems.length > 0) {
            // Hide default content if we have actual content
            const defaultContent = document.getElementById('defaultEventsContent');
            if (defaultContent) {
                defaultContent.classList.add('hidden');
            }
            
            // Show dynamic content
            const dynamicContent = document.getElementById('dynamicEventsContent');
            if (dynamicContent) {
                dynamicContent.classList.remove('hidden');
                
                let eventsHTML = '<div class="event-cards">';
                eventItems.forEach(event => {
                    const eventDate = new Date(event.date);
                    const formattedDate = eventDate.toLocaleDateString('en-IN', { 
                        day: 'numeric', 
                        month: 'long', 
                        year: 'numeric' 
                    });
                    
                    eventsHTML += `
                        <div class="event-card">
                            <div class="event-header">
                                <span class="event-date">${formattedDate}</span>
                                <h3>${event.title}</h3>
                            </div>
                            <div class="event-content">
                                <p>${event.description}</p>
                                <div class="event-details">
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
                                        <span>${event.attendees} Attendees</span>
                                    </div>
                                </div>
                            </div>
                            <button class="btn btn-primary">Event Details</button>
                        </div>
                    `;
                });
                eventsHTML += '</div>';
                
                dynamicContent.innerHTML = eventsHTML;
            }
        }
    }
    
    // Handle resources page
    if (isResourcesPage) {
        const resourcesContainer = document.getElementById('resourcesContainer');
        if (!resourcesContainer) return;
        
        const resourceItems = villageContent.filter(item => item.type === 'resource');
        
        if (resourceItems.length > 0) {
            // Hide default content if we have actual content
            const defaultContent = document.getElementById('defaultResourcesContent');
            if (defaultContent) {
                defaultContent.classList.add('hidden');
            }
            
            // Show dynamic content
            const dynamicContent = document.getElementById('dynamicResourcesContent');
            if (dynamicContent) {
                dynamicContent.classList.remove('hidden');
                
                let resourcesHTML = '<div class="resource-cards">';
                resourceItems.forEach(resource => {
                    resourcesHTML += `
                        <div class="resource-card">
                            <div class="resource-card-icon">
                                <i class="fas fa-file-alt"></i>
                            </div>
                            <div class="resource-card-content">
                                <h3>${resource.title}</h3>
                                <p class="resource-type">${resource.resourceType}</p>
                                <a href="${resource.resourceLink}" class="resource-link">Download</a>
                            </div>
                        </div>
                    `;
                });
                resourcesHTML += '</div>';
                
                dynamicContent.innerHTML = resourcesHTML;
            }
        }
    }
    
    // Handle history page
    if (isHistoryPage) {
        const historyContainer = document.getElementById('historyContainer');
        if (!historyContainer) return;
        
        const historyItems = villageContent.filter(item => item.type === 'history');
        
        if (historyItems.length > 0) {
            // Hide default content if we have actual content
            const defaultContent = document.getElementById('defaultHistoryContent');
            if (defaultContent) {
                defaultContent.classList.add('hidden');
            }
            
            // Show dynamic content
            const dynamicContent = document.getElementById('dynamicHistoryContent');
            if (dynamicContent) {
                dynamicContent.classList.remove('hidden');
                
                let historyHTML = '<div class="history-articles">';
                historyItems.forEach(history => {
                    historyHTML += `
                        <article class="history-article">
                            <h3>${history.title}</h3>
                            <div class="history-content">
                                <p>${history.description}</p>
                            </div>
                        </article>
                    `;
                });
                historyHTML += '</div>';
                
                dynamicContent.innerHTML = historyHTML;
            }
        }
    }
    
    // Handle announcements page
    if (isAnnouncementsPage) {
        const announcementsContainer = document.getElementById('announcementsContainer');
        if (!announcementsContainer) return;
        
        const announcementItems = villageContent.filter(item => item.type === 'announcement');
        
        if (announcementItems.length > 0) {
            // Hide default content if we have actual content
            const defaultContent = document.getElementById('defaultAnnouncementsContent');
            if (defaultContent) {
                defaultContent.classList.add('hidden');
            }
            
            // Show dynamic content
            const dynamicContent = document.getElementById('dynamicAnnouncementsContent');
            if (dynamicContent) {
                dynamicContent.classList.remove('hidden');
                
                let announcementsHTML = '<div class="announcement-cards">';
                announcementItems.forEach(announcement => {
                    const postedDate = new Date(announcement.postedDate);
                    const formattedDate = postedDate.toLocaleDateString('en-IN', { 
                        day: 'numeric', 
                        month: 'short', 
                        year: 'numeric' 
                    });
                    
                    announcementsHTML += `
                        <div class="announcement-card">
                            <div class="announcement-header">
                                <h3>${announcement.title}</h3>
                                <span class="announcement-date">${formattedDate}</span>
                            </div>
                            <div class="announcement-content">
                                <p>${announcement.description}</p>
                            </div>
                        </div>
                    `;
                });
                announcementsHTML += '</div>';
                
                dynamicContent.innerHTML = announcementsHTML;
            }
        }
    }
});

// Helper function to format numbers with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
