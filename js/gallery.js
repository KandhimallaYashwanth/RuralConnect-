
// Gallery page functionality
document.addEventListener('DOMContentLoaded', () => {
  // Load gallery items
  loadGalleryItems();
});

// Function to load gallery items
function loadGalleryItems() {
  const galleryContainer = document.getElementById('gallery-container');
  if (!galleryContainer) return;
  
  const galleryItems = JSON.parse(localStorage.getItem('galleryItems') || '[]');
  
  galleryContainer.innerHTML = '';
  
  if (galleryItems.length === 0) {
    galleryContainer.innerHTML = `
      <div class="empty-state">
        <p>No gallery items available at the moment.</p>
      </div>
    `;
    return;
  }
  
  // Create the gallery grid
  const galleryGrid = document.createElement('div');
  galleryGrid.className = 'gallery-grid';
  
  galleryItems.forEach(item => {
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    
    galleryItem.innerHTML = `
      <img src="${item.imageUrl}" alt="${item.title}" class="gallery-image">
      <div class="gallery-caption">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
      </div>
    `;
    
    galleryGrid.appendChild(galleryItem);
  });
  
  galleryContainer.appendChild(galleryGrid);
}
