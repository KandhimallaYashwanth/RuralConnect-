
// Issue model in plain JavaScript

/**
 * Creates a new issue
 * @param {string} type - The type of issue
 * @param {string} description - Description of the issue
 * @param {string} location - Location of the issue
 * @param {string} ward - Ward where the issue is located
 * @param {string[]} [images] - Optional images of the issue
 * @param {string} [userId] - Optional ID of the user reporting the issue
 * @returns {Object} The created issue object
 */
export const createIssue = (
  type,
  description,
  location,
  ward,
  images,
  userId
) => {
  return {
    id: `ISSUE-${Date.now().toString(36)}`,
    type,
    description,
    location,
    ward,
    status: "submitted",
    dateSubmitted: new Date().toISOString(),
    images: images || [],
    escalationLevel: 1, // Start at Ward Member level
    assignedTo: "wardmember", // Initially assigned to Ward Member
    reportedBy: userId, // User who reported the issue
    updates: [
      {
        id: `UPDATE-${Date.now().toString(36)}`,
        date: new Date().toISOString(),
        status: "Submitted to Ward Member",
        comment: "Issue has been submitted successfully and is awaiting review by the Ward Member.",
        by: "System"
      }
    ]
  };
};

/**
 * Retrieves issues from localStorage
 * @returns {Array} Array of issues
 */
export const getIssues = () => {
  const issuesJson = localStorage.getItem("issues");
  return issuesJson ? JSON.parse(issuesJson) : [];
};

/**
 * Saves issues to localStorage
 * @param {Array} issues - Array of issues to save
 */
export const saveIssues = (issues) => {
  localStorage.setItem("issues", JSON.stringify(issues));
};

/**
 * Adds an update to an issue
 * @param {Object} issue - The issue to update
 * @param {string} status - New status
 * @param {string} comment - Comment for the update
 * @param {string} by - Who made the update
 * @returns {Object} The updated issue
 */
export const addIssueUpdate = (
  issue,
  status,
  comment,
  by
) => {
  const updatedIssue = { ...issue };
  updatedIssue.status = status;
  updatedIssue.updates.push({
    id: `UPDATE-${Date.now().toString(36)}`,
    date: new Date().toISOString(),
    status,
    comment,
    by
  });
  return updatedIssue;
};

/**
 * Forwards an issue to the next level of authority
 * @param {Object} issue - The issue to escalate
 * @param {string} comment - Reason for escalation
 * @param {string} by - Who escalated the issue
 * @returns {Object} The updated issue
 */
export const escalateIssue = (
  issue,
  comment,
  by
) => {
  const updatedIssue = { ...issue };
  
  // Update escalation level
  if (updatedIssue.escalationLevel === 1) {
    // Ward Member forwarding to both Uppasarpanch and Sarpanch
    updatedIssue.escalationLevel = 2;
    updatedIssue.assignedTo = "uppasarpanch";
    updatedIssue.status = "in-review";
  }
  
  // Add update
  updatedIssue.updates.push({
    id: `UPDATE-${Date.now().toString(36)}`,
    date: new Date().toISOString(),
    status: "Forwarded to Authorities",
    comment,
    by
  });
  
  return updatedIssue;
};

/**
 * Rejects an issue
 * @param {Object} issue - The issue to reject
 * @param {string} reason - Reason for rejection
 * @param {string} by - Who rejected the issue
 * @returns {Object} The updated issue
 */
export const rejectIssue = (
  issue,
  reason,
  by
) => {
  const updatedIssue = { ...issue };
  
  updatedIssue.status = "rejected";
  updatedIssue.updates.push({
    id: `UPDATE-${Date.now().toString(36)}`,
    date: new Date().toISOString(),
    status: "Rejected",
    comment: reason,
    by
  });
  
  return updatedIssue;
};

/**
 * Resolves an issue
 * @param {Object} issue - The issue to resolve
 * @param {string} resolution - Resolution details
 * @param {string} by - Who resolved the issue
 * @returns {Object} The updated issue
 */
export const resolveIssue = (
  issue,
  resolution,
  by
) => {
  const updatedIssue = { ...issue };
  
  updatedIssue.status = "resolved";
  updatedIssue.updates.push({
    id: `UPDATE-${Date.now().toString(36)}`,
    date: new Date().toISOString(),
    status: "Resolved",
    comment: resolution,
    by
  });
  
  return updatedIssue;
};

