
import { FileText, Download, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { notify } from "@/lib/notification";

const ResourcesPreview = () => {
  const navigate = useNavigate();
  
  const resources = [
    {
      id: 1,
      title: "MGNREGA Job Card Application",
      category: "Employment Scheme",
      downloadCount: 125,
      fileType: "PDF"
    },
    {
      id: 2,
      title: "PM Kisan Yojana Guidelines",
      category: "Agricultural Support",
      downloadCount: 93,
      fileType: "PDF"
    },
    {
      id: 3,
      title: "Drinking Water Supply Scheme",
      category: "Infrastructure",
      downloadCount: 78,
      fileType: "DOC"
    },
    {
      id: 4,
      title: "Village Development Fund Application",
      category: "Development",
      downloadCount: 56,
      fileType: "PDF"
    }
  ];

  const handleDownload = (resource) => {
    notify(`Downloading ${resource.title} (${resource.fileType})`, "info");
    // In a real app, this would trigger an actual file download
    setTimeout(() => {
      notify(`${resource.title} downloaded successfully`, "success");
    }, 1500);
  };

  const handleBrowseAll = () => {
    notify("Navigating to all resources", "info");
    navigate("/resources");
  };

  return (
    <div className="py-20 bg-muted resources-preview">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Useful Resources</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Access important documents, government schemes, and helpful resources for rural development and welfare.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {resources.map((resource) => (
            <div key={resource.id} className="rural-card flex items-start gap-4 transition-all duration-300 hover:shadow-md">
              <div className="w-12 h-12 rounded-lg bg-rural-mustard/10 flex items-center justify-center flex-shrink-0">
                <FileText className="h-6 w-6 text-rural-earth" />
              </div>
              
              <div className="flex-grow">
                <h3 className="font-semibold">{resource.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{resource.category}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Downloaded {resource.downloadCount} times • {resource.fileType}
                  </span>
                  <button 
                    className="flex items-center gap-1 text-rural-leaf hover:text-rural-leaf/80 transition-colors"
                    onClick={() => handleDownload(resource)}
                  >
                    <Download className="h-4 w-4" />
                    <span className="text-sm">Download</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button 
            className="bg-rural-terracotta hover:bg-rural-terracotta/90 inline-flex items-center gap-2 transition-all duration-300 transform hover:scale-105"
            onClick={handleBrowseAll}
          >
            Browse All Resources
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResourcesPreview;
