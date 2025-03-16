
export interface Issue {
  id: string;
  type: string;
  description: string;
  location: string;
  ward: string;
  status: "submitted" | "in-review" | "in-progress" | "resolved" | "closed";
  dateSubmitted: string;
  images?: string[];
  updates: IssueUpdate[];
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
  images?: string[]
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
    updates: [
      {
        id: `UPDATE-${Date.now().toString(36)}`,
        date: new Date().toISOString(),
        status: "submitted",
        comment: "Issue has been submitted successfully.",
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
