
// Content management for various pages
document.addEventListener('DOMContentLoaded', function() {
  // Determine the current page
  const currentPage = window.location.pathname.split('/').pop();
  
  // Load content based on page
  switch (currentPage) {
    case 'events.html':
      loadEvents();
      break;
    case 'budget.html':
      loadBudget();
      break;
    case 'history.html':
      loadHistory();
      break;
    case 'resources.html':
      loadResources();
      break;
    case 'announcements.html':
      loadAnnouncements();
      break;
  }
});

// Load Events Content
function loadEvents() {
  const eventsContainer = document.getElementById('eventsContainer');
  if (!eventsContainer) return;
  
  // Get events from localStorage (posted by authorities)
  const events = getContentByType('events');
  
  // If there are no events, show default content
  if (!events || events.length === 0) {
    const defaultContent = document.getElementById('defaultEventsContent');
    const dynamicContent = document.getElementById('dynamicEventsContent');
    
    if (defaultContent) defaultContent.classList.remove('hidden');
    if (dynamicContent) dynamicContent.classList.add('hidden');
  } else {
    // Show dynamic content with events from authorities
    const defaultContent = document.getElementById('defaultEventsContent');
    const dynamicContent = document.getElementById('dynamicEventsContent');
    
    if (defaultContent) defaultContent.classList.add('hidden');
    if (dynamicContent) {
      dynamicContent.classList.remove('hidden');
      
      // Clear and populate dynamic content
      dynamicContent.innerHTML = '';
      
      // Event cards container
      const eventCardsContainer = document.createElement('div');
      eventCardsContainer.className = 'event-cards';
      
      // Add each event
      events.forEach(event => {
        const eventCard = document.createElement('div');
        eventCard.className = 'event-card';
        
        // Format date
        const eventDate = new Date(event.date);
        const formattedDate = eventDate.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric'
        });
        const formattedTime = eventDate.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        });
        
        eventCard.innerHTML = `
          <div class="event-card-badge">Upcoming Event</div>
          <div class="event-card-content">
            <h3>${event.title}</h3>
            <div class="event-meta">
              <div class="event-meta-item">
                <i class="fas fa-calendar-alt"></i>
                <span>${formattedDate}</span>
              </div>
              <div class="event-meta-item">
                <i class="fas fa-clock"></i>
                <span>${formattedTime}</span>
              </div>
              <div class="event-meta-item">
                <i class="fas fa-map-marker-alt"></i>
                <span>${event.location}</span>
              </div>
            </div>
            <p>${event.description}</p>
            <a href="#" class="event-details-link">Event Details</a>
          </div>
        `;
        
        eventCardsContainer.appendChild(eventCard);
      });
      
      dynamicContent.appendChild(eventCardsContainer);
    }
  }
}

// Load Budget Content
function loadBudget() {
  const budgetContainer = document.getElementById('budgetContainer');
  if (!budgetContainer) return;
  
  // Get budget from localStorage (posted by authorities)
  const budgetItems = getContentByType('budget');
  
  // If there are no budget items, show default content
  if (!budgetItems || budgetItems.length === 0) {
    const defaultContent = document.getElementById('defaultBudgetContent');
    const dynamicContent = document.getElementById('dynamicBudgetContent');
    
    if (defaultContent) defaultContent.classList.remove('hidden');
    if (dynamicContent) dynamicContent.classList.add('hidden');
  } else {
    // Show dynamic content with budget items from authorities
    const defaultContent = document.getElementById('defaultBudgetContent');
    const dynamicContent = document.getElementById('dynamicBudgetContent');
    
    if (defaultContent) defaultContent.classList.add('hidden');
    if (dynamicContent) {
      dynamicContent.classList.remove('hidden');
      
      // Clear and populate dynamic content
      dynamicContent.innerHTML = '';
      
      // Budget section heading
      const heading = document.createElement('h2');
      heading.className = 'text-center mb-6';
      heading.textContent = budgetItems[0].title;
      
      // Fiscal year subheading
      const subheading = document.createElement('p');
      subheading.className = 'text-center mb-8 text-gray-600';
      subheading.textContent = `Fiscal Year: ${budgetItems[0].fiscalYear}`;
      
      dynamicContent.appendChild(heading);
      dynamicContent.appendChild(subheading);
      
      // Budget description
      if (budgetItems[0].description) {
        const description = document.createElement('div');
        description.className = 'budget-description mb-8';
        description.innerHTML = `<p>${budgetItems[0].description}</p>`;
        dynamicContent.appendChild(description);
      }
      
      // Budget allocations container
      const allocationsContainer = document.createElement('div');
      allocationsContainer.className = 'budget-allocations';
      
      // Add each allocation
      if (budgetItems[0].allocations && budgetItems[0].allocations.length > 0) {
        budgetItems[0].allocations.forEach(allocation => {
          const allocationCard = document.createElement('div');
          allocationCard.className = 'budget-card';
          
          // Calculate completion percentage for progress bar
          const progressPercent = allocation.percentage || 0;
          
          allocationCard.innerHTML = `
            <h3>${allocation.category}</h3>
            <div class="budget-card-details">
              <div class="budget-amount">
                <span>Allocated:</span>
                <strong>₹${allocation.amount.toLocaleString()}</strong>
              </div>
              <div class="budget-progress">
                <div class="progress-bar">
                  <div class="progress-fill" style="width: ${progressPercent}%"></div>
                </div>
                <div class="progress-text">Utilization: ${progressPercent}%</div>
              </div>
            </div>
            <a href="#" class="budget-details-link">View Details</a>
          `;
          
          allocationsContainer.appendChild(allocationCard);
        });
      }
      
      dynamicContent.appendChild(allocationsContainer);
    }
  }
}

// Load History Content
function loadHistory() {
  const historyContainer = document.getElementById('historyContainer');
  if (!historyContainer) return;
  
  // Get history content from localStorage (posted by authorities)
  const historyItems = getContentByType('history');
  
  // If there is no history content, show default content
  if (!historyItems || historyItems.length === 0) {
    const defaultContent = document.getElementById('defaultHistoryContent');
    const dynamicContent = document.getElementById('dynamicHistoryContent');
    
    if (defaultContent) defaultContent.classList.remove('hidden');
    if (dynamicContent) dynamicContent.classList.add('hidden');
  } else {
    // Show dynamic content with history from authorities
    const defaultContent = document.getElementById('defaultHistoryContent');
    const dynamicContent = document.getElementById('dynamicHistoryContent');
    
    if (defaultContent) defaultContent.classList.add('hidden');
    if (dynamicContent) {
      dynamicContent.classList.remove('hidden');
      
      // Clear and populate dynamic content
      dynamicContent.innerHTML = '';
      
      // History content section
      const historyContent = document.createElement('div');
      historyContent.className = 'history-content mb-8';
      
      // Add title
      const heading = document.createElement('h2');
      heading.className = 'mb-4';
      heading.textContent = historyItems[0].title;
      historyContent.appendChild(heading);
      
      // Add main content
      const content = document.createElement('div');
      content.className = 'history-text';
      content.innerHTML = historyItems[0].content.replace(/\n/g, '<br>');
      historyContent.appendChild(content);
      
      dynamicContent.appendChild(historyContent);
      
      // Add timeline if available
      if (historyItems[0].timeline && historyItems[0].timeline.length > 0) {
        const timelineSection = document.createElement('div');
        timelineSection.className = 'history-timeline-section mt-12';
        
        const timelineHeading = document.createElement('h3');
        timelineHeading.className = 'text-center mb-8';
        timelineHeading.textContent = 'Historical Timeline';
        timelineSection.appendChild(timelineHeading);
        
        const timeline = document.createElement('div');
        timeline.className = 'history-timeline';
        
        historyItems[0].timeline.forEach((event, index) => {
          const timelineItem = document.createElement('div');
          timelineItem.className = `timeline-item ${index % 2 === 0 ? 'left' : 'right'}`;
          
          timelineItem.innerHTML = `
            <div class="timeline-content">
              <div class="timeline-year">${event.year}</div>
              <h4>${event.title}</h4>
              <p>${event.description}</p>
            </div>
          `;
          
          timeline.appendChild(timelineItem);
        });
        
        timelineSection.appendChild(timeline);
        dynamicContent.appendChild(timelineSection);
      }
    }
  }
}

// Load Resources Content
function loadResources() {
  const resourcesContainer = document.getElementById('resourcesContainer');
  if (!resourcesContainer) return;
  
  // Get resources from localStorage (posted by authorities)
  const resources = getContentByType('resources');
  
  // If there are no resources, show default content
  if (!resources || resources.length === 0) {
    const defaultContent = document.getElementById('defaultResourcesContent');
    const dynamicContent = document.getElementById('dynamicResourcesContent');
    
    if (defaultContent) defaultContent.classList.remove('hidden');
    if (dynamicContent) dynamicContent.classList.add('hidden');
  } else {
    // Show dynamic content with resources from authorities
    const defaultContent = document.getElementById('defaultResourcesContent');
    const dynamicContent = document.getElementById('dynamicResourcesContent');
    
    if (defaultContent) defaultContent.classList.add('hidden');
    if (dynamicContent) {
      dynamicContent.classList.remove('hidden');
      
      // Clear and populate dynamic content
      dynamicContent.innerHTML = '';
      
      // Resource cards container
      const resourceCards = document.createElement('div');
      resourceCards.className = 'resource-cards';
      
      // Add each resource
      resources.forEach(resource => {
        const resourceCard = document.createElement('div');
        resourceCard.className = 'resource-card';
        
        // Get icon based on resource type
        let icon = 'file-alt';
        switch (resource.type) {
          case 'document': icon = 'file-pdf'; break;
          case 'form': icon = 'file-alt'; break;
          case 'scheme': icon = 'hands-helping'; break;
          case 'education': icon = 'graduation-cap'; break;
          case 'health': icon = 'heartbeat'; break;
          case 'agriculture': icon = 'seedling'; break;
          case 'link': icon = 'link'; break;
          case 'video': icon = 'video'; break;
          default: icon = 'file-alt';
        }
        
        resourceCard.innerHTML = `
          <div class="resource-card-icon">
            <i class="fas fa-${icon}"></i>
          </div>
          <div class="resource-card-content">
            <h3>${resource.title}</h3>
            <p class="resource-type">${resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}</p>
            <p class="resource-description">${resource.description}</p>
            ${resource.link ? `<a href="${resource.link}" class="resource-link" target="_blank">Download</a>` : ''}
          </div>
        `;
        
        resourceCards.appendChild(resourceCard);
      });
      
      dynamicContent.appendChild(resourceCards);
    }
  }
}

// Load Announcements Content
function loadAnnouncements() {
  const announcementsContainer = document.getElementById('announcementsContainer');
  if (!announcementsContainer) return;
  
  // Get announcements from localStorage (posted by authorities)
  const announcements = getContentByType('announcements');
  
  // If there are no announcements, show default content
  if (!announcements || announcements.length === 0) {
    const defaultContent = document.getElementById('defaultAnnouncementsContent');
    const dynamicContent = document.getElementById('dynamicAnnouncementsContent');
    
    if (defaultContent) defaultContent.classList.remove('hidden');
    if (dynamicContent) dynamicContent.classList.add('hidden');
  } else {
    // Show dynamic content with announcements from authorities
    const defaultContent = document.getElementById('defaultAnnouncementsContent');
    const dynamicContent = document.getElementById('dynamicAnnouncementsContent');
    
    if (defaultContent) defaultContent.classList.add('hidden');
    if (dynamicContent) {
      dynamicContent.classList.remove('hidden');
      
      // Clear and populate dynamic content
      dynamicContent.innerHTML = '';
      
      // Announcements list
      const announcementsList = document.createElement('div');
      announcementsList.className = 'announcements-list';
      
      // Add each announcement
      announcements.forEach(announcement => {
        const announcementItem = document.createElement('div');
        announcementItem.className = `announcement-item ${announcement.important ? 'important' : ''}`;
        
        // Format date
        const announcementDate = new Date(announcement.date);
        const formattedDate = announcementDate.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric'
        });
        
        announcementItem.innerHTML = `
          <div class="announcement-header">
            <h3>${announcement.title}</h3>
            ${announcement.important ? '<span class="important-badge">Important</span>' : ''}
          </div>
          <div class="announcement-content">${announcement.content}</div>
          <div class="announcement-meta">
            <div class="announcement-date">
              <i class="fas fa-calendar-day"></i>
              <span>${formattedDate}</span>
            </div>
            ${announcement.author ? `
              <div class="announcement-author">
                <i class="fas fa-user"></i>
                <span>${announcement.author}</span>
              </div>
            ` : ''}
          </div>
        `;
        
        announcementsList.appendChild(announcementItem);
      });
      
      dynamicContent.appendChild(announcementsList);
    }
  }
}

// Helper function to get content by type from localStorage
function getContentByType(type) {
  const content = localStorage.getItem(`content_${type}`);
  return content ? JSON.parse(content) : null;
}
