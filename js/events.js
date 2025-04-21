
// Events page functionality
document.addEventListener('DOMContentLoaded', () => {
  // Load events when page loads
  loadEvents();
});

// Function to load events
function loadEvents() {
  const eventsContainer = document.getElementById('events-container');
  if (!eventsContainer) return;
  
  // Get events from localStorage
  const events = JSON.parse(localStorage.getItem('eventItems') || '[]');
  
  // Clear container first
  eventsContainer.innerHTML = '';
  
  // Show default events if none in storage
  if (events.length === 0) {
    // Sample events for demo
    const defaultEvents = [
      {
        title: "Village Council Meeting",
        date: "2023-06-24",
        time: "10:00",
        location: "Panchayat Bhavan, Ward 3",
        description: "Monthly council meeting to discuss village development projects and address public concerns."
      },
      {
        title: "Health Camp & Vaccination Drive",
        date: "2023-06-30",
        time: "09:00",
        location: "Primary Health Center",
        description: "Free health check-ups and vaccination for children below 5 years. Services include general health, eye check-up, and dental examination."
      },
      {
        title: "Agricultural Workshop",
        date: "2023-07-05",
        time: "11:00",
        location: "Community Hall",
        description: "Learn about sustainable farming practices, organic pest control, and government subsidy schemes for farmers."
      }
    ];
    
    renderEvents(defaultEvents, eventsContainer);
    return;
  }
  
  // Sort events by date (upcoming first)
  events.sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Render events
  renderEvents(events, eventsContainer);
}

// Function to render events
function renderEvents(events, container) {
  events.forEach(event => {
    // Format date nicely
    const eventDate = new Date(event.date);
    const formattedDate = eventDate.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    
    // Create event card
    const eventCard = document.createElement('div');
    eventCard.className = 'event-card';
    eventCard.innerHTML = `
      <div class="event-header">
        <span>Upcoming Event</span>
        <h3>${event.title}</h3>
      </div>
      
      <div class="event-details">
        <div class="event-detail">
          <i class="fas fa-calendar-alt"></i>
          <span>${formattedDate}</span>
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
          <i class="fas fa-info-circle"></i>
          <span>${event.description}</span>
        </div>
      </div>
      
      <button class="btn btn-outline-accent">Event Details</button>
    `;
    
    container.appendChild(eventCard);
  });
}
