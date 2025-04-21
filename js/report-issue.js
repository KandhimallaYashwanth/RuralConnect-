
// Report Issue page functionality
document.addEventListener('DOMContentLoaded', () => {
  const reportForm = document.getElementById('report-issue-form');
  const fileUpload = document.querySelector('.file-upload');
  const fileInput = document.getElementById('file-input');
  const filePreview = document.querySelector('.file-preview');

  // File upload handling
  if (fileUpload && fileInput) {
    fileUpload.addEventListener('click', () => {
      fileInput.click();
    });

    fileInput.addEventListener('change', () => {
      if (fileInput.files.length > 0 && filePreview) {
        filePreview.innerHTML = ''; // Clear previous previews

        Array.from(fileInput.files).forEach(file => {
          if (file.type.startsWith('image/')) {
            const thumbnail = document.createElement('div');
            thumbnail.className = 'file-thumbnail';

            // Create image element for preview
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            thumbnail.appendChild(img);

            // Add remove button
            const removeBtn = document.createElement('div');
            removeBtn.className = 'file-remove';
            removeBtn.innerHTML = '&times;';
            removeBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              thumbnail.remove();
              // Note: We can't actually remove items from a FileList,
              // this just removes the preview
            });

            thumbnail.appendChild(removeBtn);
            filePreview.appendChild(thumbnail);
          }
        });
      }
    });
  }

  // Handle form submission
  if (reportForm) {
    reportForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Check if user is logged in
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      if (!isLoggedIn) {
        notify('Please log in to report an issue', 'warning');
        
        // Store current page and redirect to login
        sessionStorage.setItem('redirectFrom', window.location.href);
        setTimeout(() => {
          window.location.href = 'login.html';
        }, 1500);
        return;
      }

      // Get form data
      const title = document.getElementById('issue-title').value;
      const category = document.getElementById('issue-category').value;
      const location = document.getElementById('issue-location').value;
      const description = document.getElementById('issue-description').value;

      // Validate form
      if (!title || !category || !location || !description) {
        notify('Please fill in all fields', 'error');
        return;
      }

      // Create new issue object
      const newIssue = {
        id: `#${category.substring(0, 3).toUpperCase()}-${Date.now()}`,
        title: title,
        category: category,
        location: location,
        description: description,
        status: 'reported',
        reportedBy: localStorage.getItem('userPhone') || 'Anonymous',
        reportedAt: new Date().toISOString(),
        timeline: [
          {
            status: 'reported',
            date: new Date().toISOString(),
            message: 'Issue reported successfully'
          }
        ]
      };

      // Save to localStorage
      const userIssues = JSON.parse(localStorage.getItem('userIssues') || '[]');
      userIssues.push(newIssue);
      localStorage.setItem('userIssues', JSON.stringify(userIssues));

      // Add to pending issues for authorities
      const pendingIssues = JSON.parse(localStorage.getItem('pendingIssues') || '[]');
      pendingIssues.push(newIssue);
      localStorage.setItem('pendingIssues', JSON.stringify(pendingIssues));

      // Show success message
      notify('Issue reported successfully! Authorities have been notified.', 'success');

      // Reset form
      reportForm.reset();
      if (filePreview) {
        filePreview.innerHTML = '';
      }

      // Redirect to homepage after a delay
      setTimeout(() => {
        window.location.href = 'index.html';
      }, 2000);
    });
  }
});
