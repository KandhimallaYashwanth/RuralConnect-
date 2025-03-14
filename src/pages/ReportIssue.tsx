
import { useState, useEffect } from "react";
import { Camera, MapPin, MessageSquare, Upload, ChevronRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { notify } from "@/lib/notification";
import { useNavigate } from "react-router-dom";
import { createIssue, getIssues, saveIssues, Issue } from "@/models/IssueModel";

const ReportIssue = () => {
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [ward, setWard] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [submittedIssue, setSubmittedIssue] = useState<Issue | null>(null);
  const { isLoggedIn, currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home if not logged in
    if (!isLoggedIn) {
      notify("Please login to report an issue", "warning");
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setImages([...images, ...fileArray]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLoggedIn) {
      notify("Please login to report an issue", "warning");
      return;
    }
    
    // Create a new issue
    const newIssue = createIssue(
      issueType,
      description,
      location,
      ward,
      images.map(img => URL.createObjectURL(img))
    );
    
    // Save it to local storage
    const existingIssues = getIssues();
    existingIssues.push(newIssue);
    saveIssues(existingIssues);
    
    // Update state to show tracking information
    setSubmittedIssue(newIssue);
    setSubmitted(true);
    
    // Show success notification
    notify("Issue reported successfully! You can now track its status.", "success");
  };

  const handleViewAllIssues = () => {
    navigate("/issue-tracking");
  };

  const issueTypes = [
    "Road Condition",
    "Water Supply",
    "Electricity",
    "Sanitation",
    "Public Property Damage",
    "Agriculture Related",
    "Healthcare",
    "Education",
    "Other"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow py-12 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8 text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Report an Issue</h1>
              <p className="text-gray-600">
                Report local issues in your area to bring them to the attention of the authorities.
                Track the status of your reported issues in real-time.
              </p>
            </div>
            
            {!submitted ? (
              <div className="rural-card bg-white">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Issue Type</label>
                    <select
                      value={issueType}
                      onChange={(e) => setIssueType(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rural-terracotta"
                      required
                    >
                      <option value="">Select Issue Type</option>
                      {issueTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <div className="flex items-start gap-2">
                      <MessageSquare className="h-5 w-5 text-rural-terracotta mt-3" />
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rural-terracotta"
                        rows={4}
                        placeholder="Describe the issue in detail..."
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Ward Number</label>
                      <input
                        type="text"
                        value={ward}
                        onChange={(e) => setWard(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rural-terracotta"
                        placeholder="Enter your ward number"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Location</label>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-rural-terracotta" />
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-rural-terracotta"
                          placeholder="Enter location or use current location"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Upload Images/Videos</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                      <div className="flex flex-col items-center">
                        <Camera className="h-10 w-10 text-rural-terracotta mb-2" />
                        <p className="text-gray-600 mb-4">Drag & drop files here or click to browse</p>
                        <input
                          type="file"
                          multiple
                          accept="image/*,video/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="file-upload"
                        />
                        <label
                          htmlFor="file-upload"
                          className="btn-rural btn-primary flex items-center gap-2 cursor-pointer bg-rural-terracotta text-white px-4 py-2 rounded-md hover:bg-rural-terracotta/90"
                        >
                          <Upload className="h-4 w-4" />
                          <span>Upload Files</span>
                        </label>
                      </div>
                      
                      {images.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm font-medium">{images.length} file(s) selected</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {images.map((image, index) => (
                              <div key={index} className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center text-xs">
                                {image.name.substring(0, 10)}...
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-end pt-4">
                    <Button type="submit" className="bg-rural-terracotta hover:bg-rural-terracotta/90 flex items-center gap-2">
                      <span>Submit Issue</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="rural-card bg-white">
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 text-xl">✓</span>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Issue Submitted Successfully!</h2>
                      <p className="text-gray-600">Your issue has been registered with the following details:</p>
                    </div>
                  </div>
                  
                  {submittedIssue && (
                    <div className="border border-gray-200 rounded-md p-4 mb-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-lg">{submittedIssue.type}</h3>
                          <p className="text-sm text-gray-500">Reference ID: #{submittedIssue.id}</p>
                        </div>
                        <div className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {submittedIssue.status}
                        </div>
                      </div>
                      <div className="space-y-3">
                        <p className="text-gray-700">{submittedIssue.description}</p>
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{submittedIssue.location}, Ward {submittedIssue.ward}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{new Date(submittedIssue.dateSubmitted).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-rural-terracotta/10 rounded-md p-4 mb-6">
                    <h3 className="font-medium mb-2">What happens next?</h3>
                    <ol className="list-decimal ml-5 space-y-2">
                      <li>Your issue has been submitted to the local authorities</li>
                      <li>It will be reviewed by the Ward Member within 48 hours</li>
                      <li>You'll receive updates as your issue progresses</li>
                      <li>You can track the status of your issue any time</li>
                    </ol>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 justify-center mt-6">
                    <Button
                      className="bg-rural-terracotta hover:bg-rural-terracotta/90 flex items-center gap-2"
                      onClick={handleViewAllIssues}
                    >
                      Track Your Issues
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      className="border-rural-terracotta text-rural-terracotta"
                      onClick={() => {
                        setSubmitted(false);
                        setSubmittedIssue(null);
                        setIssueType("");
                        setDescription("");
                        setLocation("");
                        setWard("");
                        setImages([]);
                      }}
                    >
                      Report Another Issue
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ReportIssue;
