
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, MessageSquare, ChevronRight, ChevronDown, MapPin, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { notify } from "@/lib/notification";
import { getIssues, Issue, addIssueUpdate, saveIssues } from "@/models/IssueModel";

const IssueTracking = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [comment, setComment] = useState("");
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home if not logged in
    if (!isLoggedIn) {
      notify("Please login to track issues", "warning");
      navigate("/");
      return;
    }

    // Load issues from localStorage
    setIssues(getIssues());
  }, [isLoggedIn, navigate]);

  const handleSelectIssue = (issue: Issue) => {
    setSelectedIssue(issue);
  };

  const handleBackToList = () => {
    setSelectedIssue(null);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedIssue || !comment.trim()) return;
    
    // Add the comment as an update
    const updatedIssue = addIssueUpdate(
      selectedIssue,
      selectedIssue.status,
      comment,
      "You" // In a real app, this would be the user's name
    );
    
    // Update in state and localStorage
    const updatedIssues = issues.map(issue => 
      issue.id === updatedIssue.id ? updatedIssue : issue
    );
    
    setIssues(updatedIssues);
    setSelectedIssue(updatedIssue);
    saveIssues(updatedIssues);
    setComment("");
    
    notify("Comment added successfully", "success");
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case "submitted":
        return "bg-blue-100 text-blue-800";
      case "in-review":
        return "bg-purple-100 text-purple-800";
      case "in-progress":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow py-12 bg-muted">
        <div className="container mx-auto px-4">
          {!selectedIssue ? (
            <>
              <div className="max-w-5xl mx-auto mb-8">
                <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Track Your Issues</h1>
                <p className="text-gray-600 text-center mb-8">
                  Monitor the status of all your reported issues and stay updated with the latest developments.
                </p>
                
                {issues.length === 0 ? (
                  <div className="rural-card bg-white p-8 text-center">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="h-8 w-8 text-gray-400" />
                    </div>
                    <h2 className="text-xl font-bold mb-2">No Issues Reported Yet</h2>
                    <p className="text-gray-600 mb-6">You haven't reported any issues yet. When you do, they'll appear here.</p>
                    <Button 
                      className="bg-rural-terracotta hover:bg-rural-terracotta/90"
                      onClick={() => navigate("/report-issue")}
                    >
                      Report an Issue
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {issues.map((issue) => (
                      <div 
                        key={issue.id}
                        className="rural-card bg-white hover:shadow-md transition-all duration-300 cursor-pointer"
                        onClick={() => handleSelectIssue(issue)}
                      >
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-bold text-lg">{issue.type}</h3>
                              <p className="text-sm text-gray-500">Reference ID: #{issue.id}</p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(issue.status)}`}>
                              {issue.status}
                            </div>
                          </div>
                          <p className="text-gray-700 mb-4 line-clamp-2">{issue.description}</p>
                          <div className="flex flex-wrap justify-between text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{issue.location}, Ward {issue.ward}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{new Date(issue.dateSubmitted).toLocaleString()}</span>
                            </div>
                          </div>
                          <div className="flex justify-end mt-4">
                            <Button 
                              variant="ghost" 
                              className="text-rural-terracotta hover:bg-rural-terracotta/10 flex items-center gap-1"
                            >
                              View Details
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="max-w-4xl mx-auto">
              <button 
                className="flex items-center gap-2 text-rural-terracotta mb-6 hover:underline"
                onClick={handleBackToList}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to All Issues
              </button>
              
              <div className="rural-card bg-white mb-6">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-2xl font-bold mb-1">{selectedIssue.type}</h2>
                      <p className="text-gray-500">Reference ID: #{selectedIssue.id}</p>
                    </div>
                    <div className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusClass(selectedIssue.status)}`}>
                      {selectedIssue.status}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-700 mb-2">Description</h3>
                    <p className="text-gray-800">{selectedIssue.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">Location</h3>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-rural-terracotta" />
                        <span>{selectedIssue.location}, Ward {selectedIssue.ward}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-700 mb-2">Date Submitted</h3>
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-rural-terracotta" />
                        <span>{new Date(selectedIssue.dateSubmitted).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  {selectedIssue.images && selectedIssue.images.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-medium text-gray-700 mb-2">Uploaded Images</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedIssue.images.map((image, index) => (
                          <div key={index} className="w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                            <img src={image} alt={`Issue image ${index + 1}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="rural-card bg-white mb-6">
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <span>Issue Timeline</span>
                    <ChevronDown className="h-4 w-4" />
                  </h3>
                  
                  <div className="space-y-6">
                    {selectedIssue.updates.map((update, index) => (
                      <div key={update.id} className="relative pl-8 border-l-2 border-gray-200">
                        <div className="absolute left-[-8px] top-0 w-4 h-4 rounded-full bg-rural-terracotta"></div>
                        <div className="mb-1">
                          <span className="font-medium">{update.status}</span>
                          <span className="text-sm text-gray-500 ml-2">
                            {new Date(update.date).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{update.comment}</p>
                        <div className="text-sm text-gray-500">by {update.by}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="rural-card bg-white">
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-4">Add a Comment</h3>
                  <form onSubmit={handleAddComment} className="space-y-4">
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rural-terracotta"
                      rows={3}
                      placeholder="Add your comment or question about this issue..."
                      required
                    />
                    <div className="flex justify-end">
                      <Button 
                        type="submit"
                        className="bg-rural-terracotta hover:bg-rural-terracotta/90"
                        disabled={!comment.trim()}
                      >
                        Add Comment
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default IssueTracking;
