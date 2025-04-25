
// Budget page functionality
document.addEventListener('DOMContentLoaded', () => {
  // Update login/logout button
  updateLoginStatusUI();

  // Load budget items when page loads
  loadBudgetItems();

  // Listen for storage events to update content in real-time
  window.addEventListener('storage', (event) => {
    if (event.key === 'budgetItems') {
      loadBudgetItems(); // Refresh when budget data changes
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

// Function to load budget items
function loadBudgetItems() {
  const budgetCardsContainer = document.getElementById('budget-cards-container');
  if (!budgetCardsContainer) return;
  
  // Get budget items from localStorage
  const budgetItems = JSON.parse(localStorage.getItem('budgetItems') || '[]');
  
  // Clear container first
  budgetCardsContainer.innerHTML = '';
  
  if (budgetItems.length === 0) {
    // Show message if no items
    budgetCardsContainer.innerHTML = `
      <div class="no-data-message">
        <i class="fas fa-info-circle"></i>
        <p>No budget items available at the moment.</p>
      </div>
    `;
    return;
  }
  
  // Add each budget item to the container
  budgetItems.forEach(item => {
    // Calculate progress percentage
    const progress = (item.spent / item.allocation) * 100;
    
    // Create icon based on category
    let categoryIconClass = '';
    let categoryColor = '';
    
    switch (item.category) {
      case 'infrastructure':
        categoryIconClass = 'fas fa-road';
        categoryColor = 'category-infrastructure';
        break;
      case 'education':
        categoryIconClass = 'fas fa-school';
        categoryColor = 'category-education';
        break;
      case 'health':
        categoryIconClass = 'fas fa-heartbeat';
        categoryColor = 'category-health';
        break;
      case 'agriculture':
        categoryIconClass = 'fas fa-leaf';
        categoryColor = 'category-agriculture';
        break;
      case 'water':
        categoryIconClass = 'fas fa-tint';
        categoryColor = 'category-water';
        break;
      case 'sanitation':
        categoryIconClass = 'fas fa-recycle';
        categoryColor = 'category-sanitation';
        break;
      default:
        categoryIconClass = 'fas fa-folder';
        categoryColor = 'category-other';
    }
    
    // Format date
    const date = new Date(item.date || Date.now());
    const formattedDate = date.toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    
    // Create projects list HTML if projects exist
    const projectsHtml = item.projects && item.projects.length > 0 ? `
      <div class="budget-projects">
        <h5>Projects:</h5>
        <ul class="project-list">
          ${item.projects.map(project => `<li><i class="fas fa-check-circle"></i> ${project}</li>`).join('')}
        </ul>
      </div>
    ` : '';
    
    // Create and append the budget card
    const budgetCard = document.createElement('div');
    budgetCard.className = `budget-card ${categoryColor}`;
    budgetCard.innerHTML = `
      <div class="budget-card-header">
        <div class="category-icon">
          <i class="${categoryIconClass}"></i>
        </div>
        <h4>${item.title}</h4>
      </div>
      
      <div class="budget-card-body">
        <div class="budget-amount">
          <div class="allocation">
            <span class="amount-label">Allocation:</span>
            <span class="amount-value">₹ ${item.allocation.toLocaleString()}</span>
          </div>
          <div class="spent">
            <span class="amount-label">Spent:</span>
            <span class="amount-value">₹ ${item.spent.toLocaleString()}</span>
          </div>
        </div>
        
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress" style="width: ${progress}%"></div>
          </div>
          <div class="progress-text">${Math.round(progress)}% Utilized</div>
        </div>
        
        <p class="budget-description">${item.description}</p>
        
        ${projectsHtml}
      </div>
      
      <div class="budget-card-footer">
        <div class="budget-meta">
          <span><i class="fas fa-user"></i> Posted by: ${item.postedBy || 'Admin'}</span>
          <span><i class="fas fa-calendar"></i> ${formattedDate}</span>
        </div>
      </div>
    `;
    
    budgetCardsContainer.appendChild(budgetCard);
  });
}
