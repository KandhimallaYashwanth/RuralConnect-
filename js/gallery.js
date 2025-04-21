
// Gallery page functionality
document.addEventListener('DOMContentLoaded', () => {
  // Load gallery items when page loads
  loadGalleryItems();
});

// Function to load gallery items
function loadGalleryItems() {
  const galleryContainer = document.getElementById('gallery-container');
  if (!galleryContainer) return;
  
  // Get gallery items from localStorage
  const galleryItems = JSON.parse(localStorage.getItem('galleryItems') || '[]');
  
  // Clear container
  galleryContainer.innerHTML = '';
  
  // Add default images if no items in storage
  if (galleryItems.length === 0) {
    const defaultGallery = [
      {
        title: "Traditional Harvest Festival",
        description: "Farmers celebrating harvest season with traditional songs and dances.",
        image: "https://images.unsplash.com/photo-1472396961693-142e6e269027",
        category: "festivals"
      },
      {
        title: "Rural Landscape",
        description: "A beautiful landscape showcasing the natural beauty of our village.",
        image: "https://images.unsplash.com/photo-1433086966358-54859d0ed716",
        category: "landscape"
      },
      {
        title: "Village Forest",
        description: "The dense forest area that surrounds our village, home to diverse flora and fauna.",
        image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9",
        category: "landscape"
      },
      {
        title: "Morning at the Village",
        description: "Early morning sunshine through the trees in our peaceful village.",
        image: "https://images.unsplash.com/photo-1518495973542-4542c06a5843",
        category: "landscape"
      },
      {
        title: "Mountain View",
        description: "The majestic mountains visible from our village during clear days.",
        image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
        category: "landscape"
      },
      {
        title: "Farming Community",
        description: "Local farmers working together during the planting season.",
        image: "https://images.unsplash.com/photo-1517022812141-23620dba5c23",
        category: "agriculture"
      }
    ];
    
    renderGalleryItems(defaultGallery, galleryContainer);
    return;
  }
  
  // Render gallery items
  renderGalleryItems(galleryItems, galleryContainer);
}

// Function to render gallery items
function renderGalleryItems(items, container) {
  items.forEach(item => {
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item';
    
    // Use the item's image URL or a default one
    const imageUrl = item.image.startsWith('http') ? item.image : `images/gallery/${item.image}`;
    
    galleryItem.innerHTML = `
      <img src="${imageUrl}" alt="${item.title}" class="gallery-image">
      <div class="gallery-caption">
        <h3>${item.title}</h3>
        <p>${item.description}</p>
      </div>
    `;
    
    container.appendChild(galleryItem);
  });
}
