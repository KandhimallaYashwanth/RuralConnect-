
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { notify } from "@/lib/notification";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const ReportIssue = () => {
  const [issueTitle, setIssueTitle] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("infrastructure");
  const [photo, setPhoto] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setPhoto(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!issueTitle || !issueDescription || !location) {
      notify("Please fill in all required fields", "error");
      return;
    }
    
    // In a real app, this would be an API call
    notify("Issue reported successfully!", "success");
    
    // Reset form
    setIssueTitle("");
    setIssueDescription("");
    setLocation("");
    setCategory("infrastructure");
    setPhoto(null);
    setPreviewUrl(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow py-12 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto bg-white rounded-lg p-6 shadow">
            <h1 className="text-3xl font-bold text-rural-terracotta mb-6">Report an Issue</h1>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Issue Title <span className="text-red-500">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={issueTitle}
                  onChange={(e) => setIssueTitle(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="infrastructure">Infrastructure</option>
                  <option value="water">Water Supply</option>
                  <option value="sanitation">Sanitation</option>
                  <option value="electricity">Electricity</option>
                  <option value="health">Health Services</option>
                  <option value="education">Education</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="location" className="text-sm font-medium">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  id="location"
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Street, Ward, Landmark, etc."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="description"
                  className="w-full p-2 border border-gray-300 rounded-md h-32"
                  value={issueDescription}
                  onChange={(e) => setIssueDescription(e.target.value)}
                  required
                ></textarea>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="photo" className="text-sm font-medium">
                  Add Photo (Optional)
                </label>
                <input
                  id="photo"
                  type="file"
                  accept="image/*"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  onChange={handlePhotoChange}
                />
                {previewUrl && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 mb-1">Preview:</p>
                    <img 
                      src={previewUrl} 
                      alt="Issue preview" 
                      className="max-h-40 rounded-md" 
                    />
                  </div>
                )}
              </div>
              
              <Button 
                type="submit"
                className="bg-rural-terracotta hover:bg-rural-terracotta/90 w-full py-2"
              >
                Submit Issue Report
              </Button>
            </form>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ReportIssue;
