
import { Check, MessageSquare, Calendar, DollarSign, BookOpen, FolderOpen, FileText } from "lucide-react";

const FeatureSection = () => {
  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Empowering Rural Communities</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our platform provides a comprehensive suite of tools designed specifically for rural communities 
            to enhance governance, transparency, and citizen participation.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Issue Reporting Feature */}
          <div className="rural-card">
            <div className="section-heading">
              <MessageSquare className="h-6 w-6 text-rural-terracotta" />
              <h3 className="text-xl font-semibold">Issue Reporting</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-rural-leaf mt-0.5" />
                <p>Report local issues with pictures and location</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-rural-leaf mt-0.5" />
                <p>Track status from submission to resolution</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-rural-leaf mt-0.5" />
                <p>Transparent workflow through village authorities</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-rural-leaf mt-0.5" />
                <p>Provide feedback on issue resolution</p>
              </div>
            </div>
          </div>
          
          {/* Events Feature */}
          <div className="rural-card">
            <div className="section-heading">
              <Calendar className="h-6 w-6 text-rural-terracotta" />
              <h3 className="text-xl font-semibold">Community Events</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-rural-leaf mt-0.5" />
                <p>Upcoming village meetings and gatherings</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-rural-leaf mt-0.5" />
                <p>Government program announcements</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-rural-leaf mt-0.5" />
                <p>Local festivals and cultural celebrations</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-rural-leaf mt-0.5" />
                <p>Historical archive of past events</p>
              </div>
            </div>
          </div>
          
          {/* Budget Feature */}
          <div className="rural-card">
            <div className="section-heading">
              <DollarSign className="h-6 w-6 text-rural-terracotta" />
              <h3 className="text-xl font-semibold">Budget Transparency</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-rural-leaf mt-0.5" />
                <p>View allocation of public funds</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-rural-leaf mt-0.5" />
                <p>Track expenditure on development projects</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-rural-leaf mt-0.5" />
                <p>Financial reports and documentation</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-rural-leaf mt-0.5" />
                <p>Promote accountability in fund utilization</p>
              </div>
            </div>
          </div>
          
          {/* History Feature */}
          <div className="rural-card">
            <div className="section-heading">
              <BookOpen className="h-6 w-6 text-rural-terracotta" />
              <h3 className="text-xl font-semibold">Village History</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-rural-leaf mt-0.5" />
                <p>Explore the cultural heritage of the village</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-rural-leaf mt-0.5" />
                <p>Historical timeline of important events</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-rural-leaf mt-0.5" />
                <p>Notable personalities and achievements</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-rural-leaf mt-0.5" />
                <p>Preservation of local traditions and knowledge</p>
              </div>
            </div>
          </div>
          
          {/* Resources Feature */}
          <div className="rural-card">
            <div className="section-heading">
              <FolderOpen className="h-6 w-6 text-rural-terracotta" />
              <h3 className="text-xl font-semibold">Resource Repository</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-rural-leaf mt-0.5" />
                <p>Access government scheme information</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-rural-leaf mt-0.5" />
                <p>Download important documents and forms</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-rural-leaf mt-0.5" />
                <p>Educational materials and guidelines</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-rural-leaf mt-0.5" />
                <p>Helpful links to government services</p>
              </div>
            </div>
          </div>
          
          {/* Ad Section Feature */}
          <div className="rural-card">
            <div className="section-heading">
              <FileText className="h-6 w-6 text-rural-terracotta" />
              <h3 className="text-xl font-semibold">Announcements</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-rural-leaf mt-0.5" />
                <p>Local business advertisements</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-rural-leaf mt-0.5" />
                <p>Government initiative announcements</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-rural-leaf mt-0.5" />
                <p>Community program notifications</p>
              </div>
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-rural-leaf mt-0.5" />
                <p>Job opportunities and skill development</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureSection;
