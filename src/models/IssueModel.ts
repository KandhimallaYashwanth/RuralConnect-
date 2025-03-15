
export interface Issue {
  id: string;
  type: string;
  description: string;
  location: string;
  ward: string;
  status: "submitted" | "in-review" | "in-progress" | "resolved" | "closed" | "rejected";
  dateSubmitted: string;
  images?: string[];
  updates: IssueUpdate[];
  escalationLevel?: number; // 1 = Ward Member, 2 = Uppasarpanch, 3 = Sarpanch
  assignedTo?: string; // wardmember, uppasarpanch, sarpanch
  reportedBy?: string; // user ID who reported the issue
}

export interface IssueUpdate {
  id: string;
  date: string;
  status: string;
  comment: string;
  by: string;
}

// Function to create a new issue
export const createIssue = (
  type: string,
  description: string,
  location: string,
  ward: string,
  images?: string[],
  userId?: string
): Issue => {
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

// Function to retrieve issues from localStorage
export const getIssues = (): Issue[] => {
  const issuesJson = localStorage.getItem("issues");
  return issuesJson ? JSON.parse(issuesJson) : [];
};

// Function to save issues to localStorage
export const saveIssues = (issues: Issue[]): void => {
  localStorage.setItem("issues", JSON.stringify(issues));
};

// Function to add an update to an issue
export const addIssueUpdate = (
  issue: Issue,
  status: string,
  comment: string,
  by: string
): Issue => {
  const updatedIssue = { ...issue };
  updatedIssue.status = status as any;
  updatedIssue.updates.push({
    id: `UPDATE-${Date.now().toString(36)}`,
    date: new Date().toISOString(),
    status,
    comment,
    by
  });
  return updatedIssue;
};

// Function to forward an issue to the next level of authority
export const escalateIssue = (
  issue: Issue,
  comment: string,
  by: string
): Issue => {
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

// Function to reject an issue
export const rejectIssue = (
  issue: Issue,
  reason: string,
  by: string
): Issue => {
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

// Function to resolve an issue
export const resolveIssue = (
  issue: Issue,
  resolution: string,
  by: string
): Issue => {
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
