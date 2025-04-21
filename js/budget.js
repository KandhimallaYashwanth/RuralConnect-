
// Budget page functionality
document.addEventListener('DOMContentLoaded', () => {
  // Load budget items when page loads
  loadBudgetItems();
});

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
      <div class="allocation-item" style="grid-column: 1 / -1; text-align: center;">
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
    switch (item.category) {
      case 'infrastructure':
        categoryIconClass = 'fas fa-road infrastructure';
        break;
      case 'education':
        categoryIconClass = 'fas fa-school education';
        break;
      case 'health':
        categoryIconClass = 'fas fa-heartbeat health';
        break;
      case 'agriculture':
        categoryIconClass = 'fas fa-leaf agriculture';
        break;
      case 'water':
        categoryIconClass = 'fas fa-tint infrastructure';
        break;
      default:
        categoryIconClass = 'fas fa-folder infrastructure';
    }
    
    // Create projects list HTML if projects exist
    const projectsHtml = item.projects && item.projects.length > 0 ? `
      <ul class="project-list">
        ${item.projects.map(project => `<li>${project}</li>`).join('')}
      </ul>
    ` : '';
    
    // Create and append the budget card
    const budgetCard = document.createElement('div');
    budgetCard.className = 'allocation-item';
    budgetCard.innerHTML = `
      <div class="category-icon ${item.category}">
        <i class="${categoryIconClass}"></i>
      </div>
      <div class="allocation-details">
        <h4>${item.title}</h4>
        <div class="allocation-bar">
          <div class="allocation-progress" style="width: ${progress}%"></div>
        </div>
        <div class="allocation-info">
          <span>Budget: ₹${item.allocation.toLocaleString()}</span>
          <span>Spent: ₹${item.spent.toLocaleString()} (${Math.round(progress)}%)</span>
        </div>
        <p>${item.description}</p>
        ${projectsHtml}
      </div>
    `;
    
    budgetCardsContainer.appendChild(budgetCard);
  });
}
