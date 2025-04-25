
// History page functionality
document.addEventListener('DOMContentLoaded', () => {
  // Update login/logout button
  updateLoginStatusUI();
  
  // Load any dynamic history items
  loadDynamicHistoryItems();
  
  // Listen for storage events to update content in real-time
  window.addEventListener('storage', (event) => {
    if (event.key === 'historyItems') {
      loadDynamicHistoryItems(); // Refresh when history data changes
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

// Function to load dynamic history items
function loadDynamicHistoryItems() {
  const dynamicHistoryContainer = document.getElementById('dynamic-history-items');
  if (!dynamicHistoryContainer) return;
  
  // Get history items from localStorage
  const historyItems = JSON.parse(localStorage.getItem('historyItems') || '[]');
  
  // Clear container first
  dynamicHistoryContainer.innerHTML = '';
  
  // If no items, return without doing anything
  if (historyItems.length === 0) return;
  
  // Sort items by year (oldest first)
  historyItems.sort((a, b) => a.year - b.year);
  
  // Add each history item to the container
  historyItems.forEach(item => {
    // Create new timeline item
    const timelineItem = document.createElement('div');
    timelineItem.className = 'timeline-item';
    timelineItem.innerHTML = `
      <div class="timeline-year">${item.year}</div>
      <div class="timeline-content">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
      </div>
    `;
    
    dynamicHistoryContainer.appendChild(timelineItem);
  });
}
