
// Profile page functionality
document.addEventListener('DOMContentLoaded', function() {
  // DOM elements
  const profileForm = document.getElementById('profileForm');
  const profileFormContainer = document.getElementById('profileFormContainer');
  const profileViewContainer = document.getElementById('profileViewContainer');
  const editProfileBtn = document.getElementById('editProfileBtn');
  
  // Profile form fields
  const fullNameInput = document.getElementById('fullName');
  const phoneNumberInput = document.getElementById('phoneNumber');
  const emailInput = document.getElementById('email');
  const addressInput = document.getElementById('address');
  const villageInput = document.getElementById('village');
  const wardNumberInput = document.getElementById('wardNumber');
  
  // Profile view fields
  const profileName = document.getElementById('profileName');
  const profilePhone = document.getElementById('profilePhone');
  const profileEmail = document.getElementById('profileEmail');
  const profileAddress = document.getElementById('profileAddress');
  const profileVillage = document.getElementById('profileVillage');
  const profileWardNumber = document.getElementById('profileWardNumber');
  
  // Initialize the profile page
  initProfilePage();
  
  // Event listeners
  if (profileForm) {
    profileForm.addEventListener('submit', function(e) {
      e.preventDefault();
      saveProfile();
    });
  }
  
  if (editProfileBtn) {
    editProfileBtn.addEventListener('click', function() {
      showProfileForm();
    });
  }
  
  // Initialize profile page
  function initProfilePage() {
    // Check if user is logged in
    if (!appState.isLoggedIn) {
      // Redirect to login if not logged in
      showLoginPrompt();
      return;
    }
    
    // Check if profile exists
    const profile = getProfile();
    
    if (profile) {
      // Display profile
      displayProfile(profile);
    } else {
      // Show profile form for first-time users
      showProfileForm();
    }
  }
  
  // Show login prompt
  function showLoginPrompt() {
    profileFormContainer.innerHTML = `
      <div class="login-required-message">
        <div class="login-icon">
          <i class="fas fa-user-lock"></i>
        </div>
        <h2>Login Required</h2>
        <p>Please login to view and manage your profile.</p>
        
        <button id="loginToViewProfileBtn" class="btn btn-primary">
          Login to Continue
          <i class="fas fa-sign-in-alt"></i>
        </button>
      </div>
    `;
    
    const loginToViewProfileBtn = document.getElementById('loginToViewProfileBtn');
    if (loginToViewProfileBtn) {
      loginToViewProfileBtn.addEventListener('click', function() {
        appState.redirectAfterLogin = 'profile.html';
        localStorage.setItem('redirectAfterLogin', appState.redirectAfterLogin);
        showLoginModal();
      });
    }
  }
  
  // Get profile from localStorage
  function getProfile() {
    if (!appState.currentUser) return null;
    
    const profileKey = `profile_${appState.currentUser.id}`;
    const savedProfile = localStorage.getItem(profileKey);
    
    return savedProfile ? JSON.parse(savedProfile) : null;
  }
  
  // Save profile to localStorage
  function saveProfile() {
    if (!appState.currentUser) return;
    
    const profile = {
      fullName: fullNameInput.value,
      phoneNumber: phoneNumberInput.value,
      email: emailInput.value,
      address: addressInput.value,
      village: villageInput.value,
      wardNumber: wardNumberInput.value,
      lastUpdated: new Date().toISOString()
    };
    
    const profileKey = `profile_${appState.currentUser.id}`;
    localStorage.setItem(profileKey, JSON.stringify(profile));
    
    // Update current user name
    appState.currentUser.name = profile.fullName;
    localStorage.setItem('currentUser', JSON.stringify(appState.currentUser));
    
    // Display the profile
    displayProfile(profile);
    
    showNotification('Profile saved successfully!', 'success');
  }
  
  // Display profile
  function displayProfile(profile) {
    // Hide form, show profile view
    profileFormContainer.classList.add('hidden');
    profileViewContainer.classList.remove('hidden');
    
    // Populate profile view
    profileName.textContent = profile.fullName || '';
    profilePhone.textContent = profile.phoneNumber || '';
    profileEmail.textContent = profile.email || '';
    profileAddress.textContent = profile.address || '';
    profileVillage.textContent = profile.village || '';
    profileWardNumber.textContent = profile.wardNumber || '';
  }
  
  // Show profile form
  function showProfileForm() {
    // Hide profile view, show form
    profileViewContainer.classList.add('hidden');
    profileFormContainer.classList.remove('hidden');
    
    // Populate form with existing data if available
    const profile = getProfile();
    
    if (profile) {
      fullNameInput.value = profile.fullName || '';
      phoneNumberInput.value = profile.phoneNumber || '';
      emailInput.value = profile.email || '';
      addressInput.value = profile.address || '';
      villageInput.value = profile.village || '';
      wardNumberInput.value = profile.wardNumber || '';
    }
  }
});
