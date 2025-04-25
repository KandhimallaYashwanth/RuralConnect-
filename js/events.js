
// Events page functionality
document.addEventListener('DOMContentLoaded', () => {
  // Update login/logout button
  updateLoginStatusUI();
  
  // Load events when page loads
  loadEvents();
  
  // Listen for storage events to update content in real-time
  window.addEventListener('storage', (event) => {
    if (event.key === 'events') {
      loadEvents(); // Refresh when events data changes
    }
  });
});

// Function to update login/logout button
function updateLoginStatusUI() {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const loginStatusBtn = document.getElementById('login-status-btn');
  
  if (loginStatusBtn) {
    if (isLoggedIn) {
      loginStatusBtn.textContent = 'Logout';
      loginStatusBtn.classList.remove('login-btn');
      loginStatusBtn.classList.add('logout-btn');
      
      loginStatusBtn.onclick = function() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userType');
        localStorage.removeItem('authorityRole');
        alert('You have been logged out.');
        window.location.reload();
      };
    } else {
      loginStatusBtn.textContent = 'Login';
      loginStatusBtn.classList.add('login-btn');
      loginStatusBtn.classList.remove('logout-btn');
      
      loginStatusBtn.onclick = function() {
        sessionStorage.setItem('redirectFrom', window.location.href);
        window.location.href = 'login.html';
      };
    }
  }
}

// Function to load events
function loadEvents() {
  const upcomingEventsContainer = document.getElementById('upcoming-events-container');
  const pastEventsContainer = document.getElementById('past-events-container');
  
  if (!upcomingEventsContainer || !pastEventsContainer) return;
  
  // Get events from localStorage
  const events = JSON.parse(localStorage.getItem('events') || '[]');
  
  // Current date for comparison
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0); // Reset time part for accurate date comparison
  
  // Separate events into upcoming and past
  const upcomingEvents = events
    .filter(event => new Date(event.date) >= currentDate)
    .sort((a, b) => new Date(a.date) - new Date(b.date)); // Ascending for upcoming
    
  const pastEvents = events
    .filter(event => new Date(event.date) < currentDate)
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // Descending for past
  
  // Clear containers
  upcomingEventsContainer.innerHTML = '';
  pastEventsContainer.innerHTML = '';
  
  // Display upcoming events
  if (upcomingEvents.length === 0) {
    upcomingEventsContainer.innerHTML = `
      <div class="no-data-message">
        <i class="fas fa-info-circle"></i>
        <p>No upcoming events scheduled at the moment.</p>
      </div>
    `;
  } else {
    // Create timeline for upcoming events
    upcomingEvents.forEach((event, index) => {
      const eventDate = new Date(event.date);
      
      // Format date
      const formattedDate = eventDate.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
      
      // Format time
      const formattedTime = event.time || '10:00 AM';
      
      // Calculate days remaining
      const daysRemaining = Math.ceil((eventDate - currentDate) / (1000 * 60 * 60 * 24));
      let timeLabel = '';
      
      if (daysRemaining === 0) {
        timeLabel = '<span class="time-today">Today</span>';
      } else if (daysRemaining === 1) {
        timeLabel = '<span class="time-tomorrow">Tomorrow</span>';
      } else {
        timeLabel = `<span class="time-future">In ${daysRemaining} days</span>`;
      }
      
      // Tags HTML
      const tagsHtml = event.tags && event.tags.length > 0
        ? `<div class="event-tags">${event.tags.map(tag => `<span class="event-tag">${tag}</span>`).join('')}</div>`
        : '';
        
      // Create event card
      const eventCard = document.createElement('div');
      eventCard.className = 'timeline-event';
      eventCard.innerHTML = `
        <div class="timeline-date">
          <div class="date-circle">
            <span class="date-month">${eventDate.toLocaleDateString('en-US', { month: 'short' })}</span>
            <span class="date-day">${eventDate.getDate()}</span>
          </div>
          ${timeLabel}
        </div>
        <div class="timeline-content">
          <div class="event-card">
            <div class="event-header">
              <h4>${event.title}</h4>
              <span class="event-badge upcoming-badge">Upcoming</span>
            </div>
            
            ${event.image ? `
              <div class="event-image">
                <img src="${event.image}" alt="${event.title}">
              </div>
            ` : ''}
            
            <div class="event-body">
              <p>${event.description}</p>
              
              <div class="event-details">
                <div class="event-detail">
                  <i class="fas fa-calendar"></i>
                  <span>${formattedDate}</span>
                </div>
                <div class="event-detail">
                  <i class="fas fa-clock"></i>
                  <span>${formattedTime}</span>
                </div>
                <div class="event-detail">
                  <i class="fas fa-map-marker-alt"></i>
                  <span>${event.location || 'Village Hall'}</span>
                </div>
                ${event.organizer ? `
                  <div class="event-detail">
                    <i class="fas fa-user"></i>
                    <span>By: ${event.organizer}</span>
                  </div>
                ` : ''}
              </div>
              
              ${tagsHtml}
            </div>
            
            <div class="event-footer">
              <button class="btn-outline-accent btn-sm">
                <i class="fas fa-calendar-plus"></i> Add to Calendar
              </button>
            </div>
          </div>
        </div>
      `;
      
      upcomingEventsContainer.appendChild(eventCard);
      
      // Add connector line except for the last element
      if (index < upcomingEvents.length - 1) {
        const connector = document.createElement('div');
        connector.className = 'timeline-connector';
        upcomingEventsContainer.appendChild(connector);
      }
    });
  }
  
  // Display past events
  if (pastEvents.length === 0) {
    pastEventsContainer.innerHTML = `
      <div class="no-data-message">
        <i class="fas fa-info-circle"></i>
        <p>No past events to display.</p>
      </div>
    `;
  } else {
    pastEvents.forEach(event => {
      const eventDate = new Date(event.date);
      
      // Format date
      const formattedDate = eventDate.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      });
      
      // Tags HTML
      const tagsHtml = event.tags && event.tags.length > 0
        ? `<div class="event-tags">${event.tags.map(tag => `<span class="event-tag">${tag}</span>`).join('')}</div>`
        : '';
        
      // Create event card
      const eventCard = document.createElement('div');
      eventCard.className = 'event-card past-event';
      
      eventCard.innerHTML = `
        <div class="event-header">
          <h4>${event.title}</h4>
          <span class="event-badge past-badge">Past</span>
        </div>
        
        ${event.image ? `
          <div class="event-image grayscale">
            <img src="${event.image}" alt="${event.title}">
          </div>
        ` : ''}
        
        <div class="event-body">
          <p>${event.description}</p>
          
          <div class="event-details">
            <div class="event-detail">
              <i class="fas fa-calendar"></i>
              <span>${formattedDate}</span>
            </div>
            <div class="event-detail">
              <i class="fas fa-map-marker-alt"></i>
              <span>${event.location || 'Village Hall'}</span>
            </div>
            ${event.organizer ? `
              <div class="event-detail">
                <i class="fas fa-user"></i>
                <span>By: ${event.organizer}</span>
              </div>
            ` : ''}
          </div>
          
          ${tagsHtml}
        </div>
        
        <div class="event-footer">
          ${event.hasGallery ? `
            <button class="btn-outline-accent btn-sm">
              <i class="fas fa-images"></i> View Gallery
            </button>
          ` : ''}
        </div>
      `;
      
      pastEventsContainer.appendChild(eventCard);
    });
  }
}
