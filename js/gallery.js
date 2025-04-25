
// Gallery page functionality
document.addEventListener('DOMContentLoaded', () => {
  // Update login/logout button
  updateLoginStatusUI();
  
  // Initialize gallery functionality
  initGallery();
  
  // Load dynamic gallery items
  loadDynamicGalleryItems();
  
  // Listen for storage events to update content in real-time
  window.addEventListener('storage', (event) => {
    if (event.key === 'galleryItems') {
      loadDynamicGalleryItems(); // Refresh when gallery data changes
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

// Function to initialize gallery functionality
function initGallery() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('gallery-lightbox');
  const lightboxImage = document.getElementById('lightbox-image');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDescription = document.getElementById('lightbox-description');
  const lightboxClose = document.querySelector('.lightbox-close');
  const nextButton = document.querySelector('.lightbox-nav-btn.next');
  const prevButton = document.querySelector('.lightbox-nav-btn.prev');
  
  let currentItemIndex = 0;
  let filteredItems = [...galleryItems];
  
  // Filter functionality
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      // Add active class to clicked button
      button.classList.add('active');
      
      const filter = button.getAttribute('data-filter');
      
      // Show/hide gallery items based on filter
      galleryItems.forEach(item => {
        if (filter === 'all' || item.getAttribute('data-category') === filter) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
      
      // Update filtered items array for lightbox navigation
      filteredItems = [...galleryItems].filter(item => {
        return filter === 'all' || item.getAttribute('data-category') === filter;
      });
    });
  });
  
  // Lightbox functionality
  galleryItems.forEach((item, index) => {
    const image = item.querySelector('.gallery-image img');
    const title = item.querySelector('.gallery-caption h4').textContent;
    const description = item.querySelector('.gallery-caption p').textContent;
    
    item.addEventListener('click', () => {
      lightboxImage.src = image.src;
      lightboxTitle.textContent = title;
      lightboxDescription.textContent = description;
      lightbox.style.display = 'flex';
      
      // Set current item index for navigation
      currentItemIndex = filteredItems.indexOf(item);
    });
  });
  
  // Close lightbox
  lightboxClose.addEventListener('click', () => {
    lightbox.style.display = 'none';
  });
  
  // Close lightbox when clicking outside
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      lightbox.style.display = 'none';
    }
  });
  
  // Next button functionality
  nextButton.addEventListener('click', (e) => {
    e.stopPropagation();
    if (filteredItems.length <= 1) return;
    
    currentItemIndex = (currentItemIndex + 1) % filteredItems.length;
    const nextItem = filteredItems[currentItemIndex];
    
    const image = nextItem.querySelector('.gallery-image img');
    const title = nextItem.querySelector('.gallery-caption h4').textContent;
    const description = nextItem.querySelector('.gallery-caption p').textContent;
    
    lightboxImage.src = image.src;
    lightboxTitle.textContent = title;
    lightboxDescription.textContent = description;
  });
  
  // Previous button functionality
  prevButton.addEventListener('click', (e) => {
    e.stopPropagation();
    if (filteredItems.length <= 1) return;
    
    currentItemIndex = (currentItemIndex - 1 + filteredItems.length) % filteredItems.length;
    const prevItem = filteredItems[currentItemIndex];
    
    const image = prevItem.querySelector('.gallery-image img');
    const title = prevItem.querySelector('.gallery-caption h4').textContent;
    const description = prevItem.querySelector('.gallery-caption p').textContent;
    
    lightboxImage.src = image.src;
    lightboxTitle.textContent = title;
    lightboxDescription.textContent = description;
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (lightbox.style.display !== 'flex') return;
    
    if (e.key === 'Escape') {
      lightbox.style.display = 'none';
    } else if (e.key === 'ArrowRight') {
      nextButton.click();
    } else if (e.key === 'ArrowLeft') {
      prevButton.click();
    }
  });
}

// Function to load dynamic gallery items
function loadDynamicGalleryItems() {
  const galleryContainer = document.getElementById('gallery-container');
  if (!galleryContainer) return;
  
  // Get gallery items from localStorage
  const galleryItems = JSON.parse(localStorage.getItem('galleryItems') || '[]');
  
  // If no items, return without doing anything
  if (galleryItems.length === 0) return;
  
  // Remove existing dynamic gallery items if any
  document.querySelectorAll('.gallery-item.dynamic').forEach(item => {
    item.remove();
  });
  
  // Add each gallery item to the container
  galleryItems.forEach(item => {
    // Create gallery item
    const galleryItem = document.createElement('div');
    galleryItem.className = 'gallery-item dynamic';
    galleryItem.setAttribute('data-category', item.category || 'other');
    
    galleryItem.innerHTML = `
      <div class="gallery-image">
        <img src="${item.image}" alt="${item.title}">
        <div class="gallery-overlay">
          <div class="gallery-info">
            <h4>${item.title}</h4>
            <p>${item.subtitle || ''}</p>
          </div>
        </div>
      </div>
      <div class="gallery-caption">
        <h4>${item.title}</h4>
        <p>${item.description || ''}</p>
      </div>
    `;
    
    galleryContainer.appendChild(galleryItem);
  });
  
  // Reinitialize gallery after adding new items
  initGallery();
}
