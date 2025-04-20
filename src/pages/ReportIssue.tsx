
import { useState } from "react";
import { Camera, MapPin, MessageSquare, Upload, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const ReportIssue = () => {
  const [issueType, setIssueType] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [ward, setWard] = useState("");
  const [images, setImages] = useState<File[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setImages([...images, ...fileArray]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log({ issueType, description, location, ward, images });
    alert("Issue reported successfully!");
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
                        className="btn-rural btn-primary flex items-center gap-2 cursor-pointer"
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
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ReportIssue;
