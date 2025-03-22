
// Authorities login and management functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the authorities login page
    const authoritiesLoginForm = document.getElementById('authoritiesLoginForm');
    
    if (authoritiesLoginForm) {
        authoritiesLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('authorityEmail').value;
            const password = document.getElementById('authorityPassword').value;
            
            // Validate credentials
            const authorities = [
                { role: 'sarpanch', email: 'sarpanch@gmail.com', password: 'sarpanch' },
                { role: 'uppasarpanch', email: 'uppasarpanch@gmail.com', password: 'uppasarpanch' },
                { role: 'wardmember', email: 'wardmember@gmail.com', password: 'wardmember' }
            ];
            
            const matchedAuthority = authorities.find(auth => 
                auth.email === email && auth.password === password);
            
            if (matchedAuthority) {
                // Store authority info in localStorage
                localStorage.setItem('authorityRole', matchedAuthority.role);
                localStorage.setItem('authorityEmail', email);
                localStorage.setItem('isAuthorityLoggedIn', 'true');
                
                // Show success notification
                showNotification('Login successful. Redirecting to dashboard...', 'success');
                
                // Redirect to dashboard after a short delay
                setTimeout(() => {
                    window.location.href = 'authorities-dashboard.html';
                }, 1500);
            } else {
                // Show error notification
                showNotification('Invalid email or password. Please try again.', 'error');
            }
        });
    }
    
    // Authority dashboard functionality
    const isAuthorityLoggedIn = localStorage.getItem('isAuthorityLoggedIn') === 'true';
    const authorityRole = localStorage.getItem('authorityRole');
    
    // Check if we're on the dashboard page
    const dashboardContainer = document.getElementById('authorityDashboard');
    if (dashboardContainer) {
        if (!isAuthorityLoggedIn) {
            // Redirect to login if not logged in
            window.location.href = 'authorities-login.html';
            return;
        }
        
        // Set authority role in the UI
        const authorityRoleElement = document.getElementById('authorityRole');
        if (authorityRoleElement) {
            authorityRoleElement.textContent = authorityRole.charAt(0).toUpperCase() + authorityRole.slice(1);
        }
        
        // Implement issue workflow based on authority role
        setupIssueWorkflow(authorityRole);
        
        // Implement content posting functionality
        setupContentPosting();
        
        // Setup content type dynamic form fields
        setupDynamicFormFields();
    }
    
    // Check for logout button on any page
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('authorityRole');
            localStorage.removeItem('authorityEmail');
            localStorage.removeItem('isAuthorityLoggedIn');
            window.location.href = 'authorities-login.html';
        });
    }
});

// Setup issue workflow based on authority role
function setupIssueWorkflow(role) {
    const issuesContainer = document.getElementById('issuesContainer');
    if (!issuesContainer) return;
    
    // Get issues from localStorage
    let issues = JSON.parse(localStorage.getItem('villageIssues')) || [];
    
    // Filter issues based on authority role
    switch (role) {
        case 'wardmember':
            // Ward members see new issues for initial review
            issues = issues.filter(issue => issue.status === 'pending' || issue.reviewedBy === 'wardmember');
            break;
        case 'uppasarpanch':
        case 'sarpanch':
            // Upper authorities see issues forwarded by ward members
            issues = issues.filter(issue => 
                issue.status === 'forwarded' || 
                issue.status === 'in-progress' || 
                issue.status === 'resolved');
            break;
    }
    
    // Render issues
    renderIssues(issues, role);
    
    // Add issue action event listeners
    setupIssueActions(role);
}

// Render issues in the dashboard
function renderIssues(issues, role) {
    const issuesContainer = document.getElementById('issuesContainer');
    if (!issuesContainer) return;
    
    if (issues.length === 0) {
        issuesContainer.innerHTML = '<div class="empty-state">No issues to display at this time.</div>';
        return;
    }
    
    let issuesHTML = '';
    issues.forEach(issue => {
        issuesHTML += `
            <div class="issue-card" data-issue-id="${issue.id}">
                <div class="issue-header">
                    <h3>${issue.type}</h3>
                    <span class="issue-status status-${issue.status}">${formatStatus(issue.status)}</span>
                </div>
                <div class="issue-content">
                    <p>${issue.description}</p>
                    <div class="issue-meta">
                        <span><i class="fas fa-map-marker-alt"></i> ${issue.location}</span>
                        <span><i class="fas fa-sort-numeric-up"></i> Ward ${issue.ward}</span>
                        <span><i class="fas fa-calendar-alt"></i> ${new Date(issue.dateReported).toLocaleDateString()}</span>
                    </div>
                </div>
                <div class="issue-actions">
                    ${getActionButtons(issue, role)}
                </div>
            </div>
        `;
    });
    
    issuesContainer.innerHTML = issuesHTML;
}

// Get appropriate action buttons based on issue status and authority role
function getActionButtons(issue, role) {
    if (role === 'wardmember' && issue.status === 'pending') {
        return `
            <button class="btn btn-success action-btn" data-action="forward" data-issue-id="${issue.id}">
                <i class="fas fa-check"></i> Forward
            </button>
            <button class="btn btn-danger action-btn" data-action="reject" data-issue-id="${issue.id}">
                <i class="fas fa-times"></i> Reject
            </button>
        `;
    } else if ((role === 'uppasarpanch' || role === 'sarpanch') && issue.status === 'forwarded') {
        return `
            <button class="btn btn-primary action-btn" data-action="progress" data-issue-id="${issue.id}">
                <i class="fas fa-tools"></i> Mark In Progress
            </button>
        `;
    } else if ((role === 'uppasarpanch' || role === 'sarpanch') && issue.status === 'in-progress') {
        return `
            <button class="btn btn-success action-btn" data-action="resolve" data-issue-id="${issue.id}">
                <i class="fas fa-check-circle"></i> Mark Resolved
            </button>
        `;
    } else {
        return `
            <button class="btn btn-secondary action-btn" data-action="view" data-issue-id="${issue.id}">
                <i class="fas fa-eye"></i> View Details
            </button>
        `;
    }
}

// Setup event listeners for issue action buttons
function setupIssueActions(role) {
    document.addEventListener('click', function(e) {
        if (!e.target.matches('.action-btn') && !e.target.closest('.action-btn')) return;
        
        const button = e.target.matches('.action-btn') ? e.target : e.target.closest('.action-btn');
        const action = button.dataset.action;
        const issueId = button.dataset.issueId;
        
        let issues = JSON.parse(localStorage.getItem('villageIssues')) || [];
        const issueIndex = issues.findIndex(issue => issue.id === issueId);
        
        if (issueIndex === -1) return;
        
        switch (action) {
            case 'forward':
                issues[issueIndex].status = 'forwarded';
                issues[issueIndex].reviewedBy = 'wardmember';
                issues[issueIndex].reviewDate = new Date().toISOString();
                showNotification('Issue forwarded to Sarpanch and Uppasarpanch', 'success');
                break;
            case 'reject':
                issues[issueIndex].status = 'rejected';
                issues[issueIndex].reviewedBy = 'wardmember';
                issues[issueIndex].reviewDate = new Date().toISOString();
                showNotification('Issue rejected', 'info');
                break;
            case 'progress':
                issues[issueIndex].status = 'in-progress';
                issues[issueIndex].assignedTo = role;
                issues[issueIndex].progressDate = new Date().toISOString();
                showNotification('Issue marked as in progress', 'success');
                break;
            case 'resolve':
                issues[issueIndex].status = 'resolved';
                issues[issueIndex].resolvedBy = role;
                issues[issueIndex].resolveDate = new Date().toISOString();
                showNotification('Issue marked as resolved', 'success');
                break;
            case 'view':
                // Show issue details modal - implementation would go here
                return;
        }
        
        // Save updated issues
        localStorage.setItem('villageIssues', JSON.stringify(issues));
        
        // Refresh the dashboard after a short delay
        setTimeout(() => {
            setupIssueWorkflow(role);
        }, 1000);
    });
}

// Setup content posting functionality
function setupContentPosting() {
    const contentForm = document.getElementById('contentPostingForm');
    if (!contentForm) return;
    
    contentForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const contentType = document.getElementById('contentType').value;
        const contentTitle = document.getElementById('contentTitle').value;
        const contentDescription = document.getElementById('contentDescription').value;
        
        // Validate form
        if (!contentType || !contentTitle || !contentDescription) {
            showNotification('Please fill all required fields', 'warning');
            return;
        }
        
        // Additional fields based on content type
        let additionalData = {};
        
        switch(contentType) {
            case 'budget':
                const allocated = document.getElementById('budgetAllocated').value;
                const expenditure = document.getElementById('budgetExpenditure').value;
                const completion = document.getElementById('budgetCompletion').value;
                
                // Validate budget-specific fields
                if (!allocated || !expenditure || !completion) {
                    showNotification('Please fill all budget-related fields', 'warning');
                    return;
                }
                
                additionalData = {
                    allocated: parseFloat(allocated),
                    expenditure: parseFloat(expenditure),
                    completion: completion
                };
                break;
            case 'event':
                const date = document.getElementById('eventDate').value;
                const time = document.getElementById('eventTime').value;
                const location = document.getElementById('eventLocation').value;
                const attendees = document.getElementById('eventAttendees').value;
                
                // Validate event-specific fields
                if (!date || !time || !location) {
                    showNotification('Please fill all event-related fields', 'warning');
                    return;
                }
                
                additionalData = {
                    date: date,
                    time: time,
                    location: location,
                    attendees: attendees || '0'
                };
                break;
            case 'resource':
                const resourceType = document.getElementById('resourceType').value;
                const resourceLink = document.getElementById('resourceLink').value;
                
                // Validate resource-specific fields
                if (!resourceType || !resourceLink) {
                    showNotification('Please fill all resource-related fields', 'warning');
                    return;
                }
                
                additionalData = {
                    resourceType: resourceType,
                    resourceLink: resourceLink
                };
                break;
            case 'history':
                // No additional fields for history
                break;
            case 'announcement':
                // No additional fields for announcements
                additionalData = {
                    postedDate: new Date().toISOString()
                };
                break;
        }
        
        // Create content object
        const newContent = {
            id: Date.now().toString(),
            type: contentType,
            title: contentTitle,
            description: contentDescription,
            postedBy: localStorage.getItem('authorityRole'),
            postedDate: new Date().toISOString(),
            ...additionalData
        };
        
        // Get existing content
        let villageContent = JSON.parse(localStorage.getItem('villageContent')) || [];
        
        // Add new content
        villageContent.push(newContent);
        
        // Save to localStorage
        localStorage.setItem('villageContent', JSON.stringify(villageContent));
        
        // Show success notification
        const typeName = contentType.charAt(0).toUpperCase() + contentType.slice(1);
        showNotification(`${typeName} content posted successfully!`, 'success');
        
        // Reset form
        contentForm.reset();
        
        // Reset dynamic fields
        const allDynamicFields = document.querySelectorAll('.dynamic-fields');
        allDynamicFields.forEach(field => field.classList.add('hidden'));
    });
}

// Setup dynamic form fields based on content type
function setupDynamicFormFields() {
    const contentTypeSelect = document.getElementById('contentType');
    if (!contentTypeSelect) return;
    
    const handleContentTypeChange = () => {
        const selectedType = contentTypeSelect.value;
        
        // Hide all dynamic field groups
        const allDynamicFields = document.querySelectorAll('.dynamic-fields');
        allDynamicFields.forEach(field => field.classList.add('hidden'));
        
        // Show the selected type fields
        const selectedFields = document.getElementById(`${selectedType}Fields`);
        if (selectedFields) {
            selectedFields.classList.remove('hidden');
        }
    };
    
    // Initial setup
    handleContentTypeChange();
    
    // Add change event listener
    contentTypeSelect.addEventListener('change', handleContentTypeChange);
}

// Helper function to show notifications
function showNotification(message, type = 'info') {
    if (window.notify) {
        window.notify(message, type);
    } else {
        alert(message);
    }
}

// Helper function to format status for display
function formatStatus(status) {
    switch(status) {
        case 'pending': return 'Pending Review';
        case 'forwarded': return 'Forwarded';
        case 'in-progress': return 'In Progress';
        case 'resolved': return 'Resolved';
        case 'rejected': return 'Rejected';
        default: return status.charAt(0).toUpperCase() + status.slice(1);
    }
}
