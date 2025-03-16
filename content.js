
// Content management functionality
document.addEventListener('DOMContentLoaded', function() {
  const currentPage = window.location.pathname.split('/').pop();
  
  // Initialize page based on current path
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
  
  // Load events content
  function loadEvents() {
    const eventsContainer = document.getElementById('eventsContainer');
    if (!eventsContainer) return;
    
    // Try to load content posted by authorities
    const events = getContentByType('events');
    
    if (events && events.length > 0) {
      // Display events posted by authorities
      let eventsHTML = '<div class="events-grid">';
      
      events.forEach(event => {
        eventsHTML += `
          <div class="event-card">
            <div class="event-date">
              <span class="event-day">${formatEventDate(event.date).day}</span>
              <span class="event-month">${formatEventDate(event.date).month}</span>
            </div>
            <div class="event-details">
              <h3>${event.title}</h3>
              <div class="event-meta">
                <div><i class="fas fa-map-marker-alt"></i> ${event.location}</div>
                <div><i class="fas fa-clock"></i> ${formatEventDate(event.date).time}</div>
              </div>
              <p>${event.description}</p>
            </div>
          </div>
        `;
      });
      
      eventsHTML += '</div>';
      eventsContainer.innerHTML = eventsHTML;
    } else {
      // Show default content
      eventsContainer.innerHTML = `
        <div class="default-content">
          <div class="default-content-icon">
            <i class="fas fa-calendar-alt"></i>
          </div>
          <h2>No Events Posted Yet</h2>
          <p>Village authorities haven't posted any events yet. Check back soon for upcoming gatherings, celebrations and important events in our village.</p>
          
          <div class="default-events">
            <div class="event-card">
              <div class="event-date">
                <span class="event-day">15</span>
                <span class="event-month">Aug</span>
              </div>
              <div class="event-details">
                <h3>Independence Day Celebration</h3>
                <div class="event-meta">
                  <div><i class="fas fa-map-marker-alt"></i> Village Square</div>
                  <div><i class="fas fa-clock"></i> 9:00 AM</div>
                </div>
                <p>Join us for flag hoisting and cultural programs celebrating India's independence.</p>
              </div>
            </div>
            
            <div class="event-card">
              <div class="event-date">
                <span class="event-day">2</span>
                <span class="event-month">Oct</span>
              </div>
              <div class="event-details">
                <h3>Gandhi Jayanti Village Cleanup</h3>
                <div class="event-meta">
                  <div><i class="fas fa-map-marker-alt"></i> Village Main Road</div>
                  <div><i class="fas fa-clock"></i> 7:00 AM</div>
                </div>
                <p>Community cleanup drive to honor Mahatma Gandhi's principles of cleanliness.</p>
              </div>
            </div>
            
            <div class="event-card">
              <div class="event-date">
                <span class="event-day">4</span>
                <span class="event-month">Nov</span>
              </div>
              <div class="event-details">
                <h3>Diwali Community Celebration</h3>
                <div class="event-meta">
                  <div><i class="fas fa-map-marker-alt"></i> Community Hall</div>
                  <div><i class="fas fa-clock"></i> 6:00 PM</div>
                </div>
                <p>Join the village community for Diwali celebrations with rangoli competition and cultural programs.</p>
              </div>
            </div>
          </div>
        </div>
      `;
    }
  }
  
  // Load budget content
  function loadBudget() {
    const budgetContainer = document.getElementById('budgetContainer');
    if (!budgetContainer) return;
    
    // Try to load content posted by authorities
    const budget = getContentByType('budget');
    
    if (budget && budget.length > 0) {
      // Display budget posted by authorities
      const latestBudget = budget[0]; // Assuming the first one is the latest
      
      let budgetHTML = `
        <div class="budget-overview">
          <h2>${latestBudget.title}</h2>
          <p class="budget-period">${latestBudget.fiscalYear}</p>
          <div class="budget-description">${latestBudget.description}</div>
        </div>
      `;
      
      if (latestBudget.allocations && latestBudget.allocations.length > 0) {
        budgetHTML += `
          <div class="budget-allocations">
            <h3>Budget Allocations</h3>
            <div class="budget-table">
              <div class="budget-header">
                <div class="budget-cell">Category</div>
                <div class="budget-cell">Amount (₹)</div>
                <div class="budget-cell">Percentage</div>
              </div>
              ${latestBudget.allocations.map(allocation => `
                <div class="budget-row">
                  <div class="budget-cell">${allocation.category}</div>
                  <div class="budget-cell">₹${numberWithCommas(allocation.amount)}</div>
                  <div class="budget-cell">${allocation.percentage}%</div>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      }
      
      budgetContainer.innerHTML = budgetHTML;
    } else {
      // Show default content
      budgetContainer.innerHTML = `
        <div class="default-content">
          <div class="default-content-icon">
            <i class="fas fa-money-bill-wave"></i>
          </div>
          <h2>Budget Information</h2>
          <p>Village authorities haven't posted detailed budget information yet. Below is a general overview of typical village budget allocations:</p>
          
          <div class="budget-overview">
            <h3>Sample Village Budget Framework</h3>
            <div class="budget-table">
              <div class="budget-header">
                <div class="budget-cell">Category</div>
                <div class="budget-cell">Typical Allocation (%)</div>
                <div class="budget-cell">Purpose</div>
              </div>
              <div class="budget-row">
                <div class="budget-cell">Infrastructure Development</div>
                <div class="budget-cell">30-40%</div>
                <div class="budget-cell">Roads, drainage, common facilities</div>
              </div>
              <div class="budget-row">
                <div class="budget-cell">Water Supply & Management</div>
                <div class="budget-cell">15-20%</div>
                <div class="budget-cell">Drinking water, irrigation, conservation</div>
              </div>
              <div class="budget-row">
                <div class="budget-cell">Health & Sanitation</div>
                <div class="budget-cell">10-15%</div>
                <div class="budget-cell">Health centers, waste management</div>
              </div>
              <div class="budget-row">
                <div class="budget-cell">Education</div>
                <div class="budget-cell">10-15%</div>
                <div class="budget-cell">Schools, skill development</div>
              </div>
              <div class="budget-row">
                <div class="budget-cell">Agriculture & Livelihoods</div>
                <div class="budget-cell">10-15%</div>
                <div class="budget-cell">Farmer support, market linkages</div>
              </div>
              <div class="budget-row">
                <div class="budget-cell">Administration</div>
                <div class="budget-cell">5-10%</div>
                <div class="budget-cell">Panchayat operations, staff</div>
              </div>
              <div class="budget-row">
                <div class="budget-cell">Social Welfare</div>
                <div class="budget-cell">5-10%</div>
                <div class="budget-cell">Support for elderly, disadvantaged</div>
              </div>
              <div class="budget-row">
                <div class="budget-cell">Emergency Fund</div>
                <div class="budget-cell">3-5%</div>
                <div class="budget-cell">Natural disasters, contingencies</div>
              </div>
            </div>
          </div>
          
          <div class="budget-note">
            <p><strong>Note:</strong> This is a general framework. Actual village budget will be posted by authorities soon, with specific allocations based on village needs and available funds.</p>
            <p>For more information on government schemes and funding for village development, visit the <a href="resources.html">Resources</a> section.</p>
          </div>
        </div>
      `;
    }
  }
  
  // Load history content
  function loadHistory() {
    const historyContainer = document.getElementById('historyContainer');
    if (!historyContainer) return;
    
    // Try to load content posted by authorities
    const history = getContentByType('history');
    
    if (history && history.length > 0) {
      // Display history posted by authorities
      let historyHTML = '';
      
      history.forEach(item => {
        historyHTML += `
          <div class="history-section">
            <h2>${item.title}</h2>
            <div class="history-content">
              ${item.content}
            </div>
            ${item.timeline ? `
              <div class="history-timeline">
                <h3>Key Historical Timeline</h3>
                <div class="timeline">
                  ${item.timeline.map(event => `
                    <div class="timeline-item">
                      <div class="timeline-year">${event.year}</div>
                      <div class="timeline-content">
                        <h4>${event.title}</h4>
                        <p>${event.description}</p>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        `;
      });
      
      historyContainer.innerHTML = historyHTML;
    } else {
      // Show default content
      historyContainer.innerHTML = `
        <div class="default-content">
          <div class="default-content-icon">
            <i class="fas fa-book"></i>
          </div>
          <h2>Village History</h2>
          <p>Village authorities haven't posted detailed historical information yet. Below is a general overview of our village heritage:</p>
          
          <div class="history-section">
            <h3>Our Village Heritage</h3>
            <div class="history-content">
              <p>Our village has a rich cultural heritage dating back several centuries. Like many villages in rural India, our community has preserved traditions while adapting to modern challenges.</p>
              
              <p>The village was established during the pre-colonial era and has witnessed various historical phases including the freedom struggle. Many of our elders still recount stories of how our village contributed to India's independence movement.</p>
              
              <p>Traditional occupations in our village have primarily been agriculture, handicrafts, and animal husbandry. Over generations, these practices have evolved while maintaining their cultural significance.</p>
              
              <p>Our village is known for its traditional festivals, folk art forms, and community practices that have been passed down through generations. These cultural elements form a vital part of our village identity.</p>
            </div>
            
            <div class="history-timeline">
              <h3>General Historical Timeline</h3>
              <div class="timeline">
                <div class="timeline-item">
                  <div class="timeline-year">Pre-1800s</div>
                  <div class="timeline-content">
                    <h4>Village Establishment</h4>
                    <p>Foundation of the village settlement and early development of agricultural practices.</p>
                  </div>
                </div>
                
                <div class="timeline-item">
                  <div class="timeline-year">1800-1900</div>
                  <div class="timeline-content">
                    <h4>Colonial Period</h4>
                    <p>Village life during British rule and early resistance movements.</p>
                  </div>
                </div>
                
                <div class="timeline-item">
                  <div class="timeline-year">1900-1947</div>
                  <div class="timeline-content">
                    <h4>Freedom Struggle</h4>
                    <p>Participation in India's independence movement and local freedom fighters.</p>
                  </div>
                </div>
                
                <div class="timeline-item">
                  <div class="timeline-year">1947-1980</div>
                  <div class="timeline-content">
                    <h4>Post-Independence Development</h4>
                    <p>Early development initiatives and establishment of village governance structures.</p>
                  </div>
                </div>
                
                <div class="timeline-item">
                  <div class="timeline-year">1980-2000</div>
                  <div class="timeline-content">
                    <h4>Modernization Period</h4>
                    <p>Introduction of electricity, improved water supply, and educational facilities.</p>
                  </div>
                </div>
                
                <div class="timeline-item">
                  <div class="timeline-year">2000-Present</div>
                  <div class="timeline-content">
                    <h4>Digital Era</h4>
                    <p>Integration of technology, improved connectivity, and new development initiatives.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="history-note">
            <p><strong>Note:</strong> This is a general overview. Detailed historical information specific to our village will be posted by authorities soon.</p>
            <p>If you have historical knowledge, photographs, or documents about our village that you'd like to share, please contact the village authorities.</p>
          </div>
        </div>
      `;
    }
  }
  
  // Load resources content
  function loadResources() {
    const resourcesContainer = document.getElementById('resourcesContainer');
    if (!resourcesContainer) return;
    
    // Try to load content posted by authorities
    const resources = getContentByType('resources');
    
    if (resources && resources.length > 0) {
      // Display resources posted by authorities
      let resourcesHTML = '<div class="resources-grid">';
      
      resources.forEach(resource => {
        resourcesHTML += `
          <div class="resource-card">
            <div class="resource-icon">
              <i class="fas ${getResourceIcon(resource.type)}"></i>
            </div>
            <div class="resource-details">
              <h3>${resource.title}</h3>
              <p>${resource.description}</p>
              ${resource.link ? `
                <a href="${resource.link}" target="_blank" class="resource-link">
                  <i class="fas fa-external-link-alt"></i> View Resource
                </a>
              ` : ''}
            </div>
          </div>
        `;
      });
      
      resourcesHTML += '</div>';
      resourcesContainer.innerHTML = resourcesHTML;
    } else {
      // Show default content
      resourcesContainer.innerHTML = `
        <div class="default-content">
          <div class="default-content-icon">
            <i class="fas fa-folder-open"></i>
          </div>
          <h2>Village Resources</h2>
          <p>Village authorities haven't posted specific resources yet. Below are some general resources that might be useful for village residents:</p>
          
          <div class="resources-categories">
            <div class="resource-category">
              <h3><i class="fas fa-users"></i> Government Schemes</h3>
              <div class="resources-list">
                <div class="resource-item">
                  <h4>MGNREGA (Mahatma Gandhi National Rural Employment Guarantee Act)</h4>
                  <p>Employment scheme that provides 100 days of wage employment to rural households.</p>
                  <a href="https://nrega.nic.in/" target="_blank" class="resource-link">
                    <i class="fas fa-external-link-alt"></i> Official Website
                  </a>
                </div>
                
                <div class="resource-item">
                  <h4>PM Kisan Samman Nidhi</h4>
                  <p>Direct benefit transfer scheme for farmers providing income support.</p>
                  <a href="https://pmkisan.gov.in/" target="_blank" class="resource-link">
                    <i class="fas fa-external-link-alt"></i> Official Website
                  </a>
                </div>
                
                <div class="resource-item">
                  <h4>Pradhan Mantri Awas Yojana - Gramin</h4>
                  <p>Housing scheme for rural areas to provide pucca houses with basic amenities.</p>
                  <a href="https://pmayg.nic.in/" target="_blank" class="resource-link">
                    <i class="fas fa-external-link-alt"></i> Official Website
                  </a>
                </div>
              </div>
            </div>
            
            <div class="resource-category">
              <h3><i class="fas fa-file-alt"></i> Important Documents & Forms</h3>
              <div class="resources-list">
                <div class="resource-item">
                  <h4>Aadhaar Card</h4>
                  <p>Information about applying for and updating Aadhaar cards.</p>
                  <a href="https://uidai.gov.in/" target="_blank" class="resource-link">
                    <i class="fas fa-external-link-alt"></i> UIDAI Official Website
                  </a>
                </div>
                
                <div class="resource-item">
                  <h4>Voter ID Card</h4>
                  <p>Information about voter registration and ID cards.</p>
                  <a href="https://eci.gov.in/" target="_blank" class="resource-link">
                    <i class="fas fa-external-link-alt"></i> Election Commission of India
                  </a>
                </div>
                
                <div class="resource-item">
                  <h4>Caste & Income Certificates</h4>
                  <p>Process for obtaining various certificates required for government schemes.</p>
                  <a href="#" class="resource-link">
                    <i class="fas fa-external-link-alt"></i> State Government Portal
                  </a>
                </div>
              </div>
            </div>
            
            <div class="resource-category">
              <h3><i class="fas fa-hand-holding-medical"></i> Health Resources</h3>
              <div class="resources-list">
                <div class="resource-item">
                  <h4>Ayushman Bharat</h4>
                  <p>Health insurance scheme for economically vulnerable citizens.</p>
                  <a href="https://pmjay.gov.in/" target="_blank" class="resource-link">
                    <i class="fas fa-external-link-alt"></i> Official Website
                  </a>
                </div>
                
                <div class="resource-item">
                  <h4>National Health Mission</h4>
                  <p>Information about various health programs and facilities.</p>
                  <a href="https://nhm.gov.in/" target="_blank" class="resource-link">
                    <i class="fas fa-external-link-alt"></i> Official Website
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div class="resources-note">
            <p><strong>Note:</strong> These are general resources. Village-specific resources and documents will be posted by authorities soon.</p>
          </div>
        </div>
      `;
    }
  }
  
  // Load announcements content
  function loadAnnouncements() {
    const announcementsContainer = document.getElementById('announcementsContainer');
    if (!announcementsContainer) return;
    
    // Try to load content posted by authorities
    const announcements = getContentByType('announcements');
    
    if (announcements && announcements.length > 0) {
      // Display announcements posted by authorities
      let announcementsHTML = '<div class="announcements-list">';
      
      announcements.forEach(announcement => {
        const date = new Date(announcement.date);
        
        announcementsHTML += `
          <div class="announcement-card">
            <div class="announcement-header">
              <h3>${announcement.title}</h3>
              <div class="announcement-meta">
                <span class="announcement-date">
                  <i class="fas fa-calendar-day"></i> ${date.toLocaleDateString()}
                </span>
                <span class="announcement-author">
                  <i class="fas fa-user"></i> ${announcement.author || 'Village Authority'}
                </span>
              </div>
            </div>
            <div class="announcement-content">
              <p>${announcement.content}</p>
            </div>
            ${announcement.important ? `
              <div class="announcement-important">
                <i class="fas fa-exclamation-circle"></i> Important Announcement
              </div>
            ` : ''}
          </div>
        `;
      });
      
      announcementsHTML += '</div>';
      announcementsContainer.innerHTML = announcementsHTML;
    } else {
      // Show default content
      announcementsContainer.innerHTML = `
        <div class="default-content">
          <div class="default-content-icon">
            <i class="fas fa-bullhorn"></i>
          </div>
          <h2>Village Announcements</h2>
          <p>Village authorities haven't posted any announcements yet. This section will be updated with important notices and information for village residents.</p>
          
          <div class="sample-announcements">
            <div class="announcement-card">
              <div class="announcement-header">
                <h3>Welcome to the Village Announcements Page</h3>
                <div class="announcement-meta">
                  <span class="announcement-date">
                    <i class="fas fa-calendar-day"></i> ${new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div class="announcement-content">
                <p>This is where important village announcements will be posted. Check back regularly for updates about village meetings, special events, government programs, and other important information.</p>
              </div>
            </div>
            
            <div class="announcement-card">
              <div class="announcement-header">
                <h3>How Announcements Work</h3>
                <div class="announcement-meta">
                  <span class="announcement-date">
                    <i class="fas fa-calendar-day"></i> ${new Date().toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div class="announcement-content">
                <p>Village authorities will post official announcements here that will be visible to all residents. Important announcements may also be highlighted for special attention.</p>
              </div>
            </div>
          </div>
          
          <div class="announcements-note">
            <p><strong>Note:</strong> This is a demo of how announcements will appear. Real announcements from village authorities will be posted soon.</p>
          </div>
        </div>
      `;
    }
  }
  
  // Helper Functions
  
  // Get content by type from localStorage
  function getContentByType(type) {
    const content = localStorage.getItem(`content_${type}`);
    return content ? JSON.parse(content) : null;
  }
  
  // Format event date
  function formatEventDate(dateString) {
    const date = new Date(dateString);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return {
      day: date.getDate(),
      month: months[date.getMonth()],
      time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }
  
  // Get resource icon based on type
  function getResourceIcon(type) {
    const icons = {
      'document': 'fa-file-alt',
      'form': 'fa-file-signature',
      'scheme': 'fa-handshake',
      'education': 'fa-graduation-cap',
      'health': 'fa-heartbeat',
      'agriculture': 'fa-seedling',
      'link': 'fa-link',
      'video': 'fa-video',
      'other': 'fa-file'
    };
    
    return icons[type] || 'fa-file';
  }
  
  // Format number with commas
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
});
