
import { ArrowRight, MessageSquare, Calendar, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <div className="relative min-h-[70vh] flex items-center bg-gradient-to-b from-white to-muted overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/rural-pattern.svg')] opacity-10"></div>
      
      <div className="container mx-auto px-4 z-10">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="lg:w-1/2 space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-rural-terracotta leading-tight">
              Connecting Rural <span className="text-rural-leaf">India</span> Digitally
            </h1>
            <p className="text-lg md:text-xl text-gray-700 max-w-xl">
              A platform designed to bridge the gap between rural communities and authorities, 
              empowering villages with digital tools for better governance and communication.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button className="bg-rural-terracotta hover:bg-rural-terracotta/90 text-white font-medium px-6 py-3 rounded-md flex items-center gap-2" onClick={() => window.location.href = '/report-issue.html'}>
                Report an Issue
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="border-rural-leaf text-rural-leaf hover:bg-rural-leaf/10 font-medium px-6 py-3 rounded-md" onClick={() => {
                const resourcesSection = document.querySelector('.resources-preview');
                if (resourcesSection) resourcesSection.scrollIntoView({ behavior: 'smooth' });
              }}>
                Explore Resources
              </Button>
            </div>
          </div>
          
          <div className="lg:w-1/2 flex justify-center">
            <img 
              src="/images/rural-hero.svg" 
              alt="Rural India Illustration" 
              className="w-full max-w-lg animate-float"
            />
          </div>
        </div>

        <div className="flex justify-center mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl">
            <div className="rural-card flex flex-col items-center text-center p-6">
              <div className="w-14 h-14 rounded-full bg-rural-terracotta/10 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-rural-terracotta" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Report Issues</h3>
              <p className="text-gray-600">Report local problems and track their resolution status in real-time.</p>
            </div>
            
            <div className="rural-card flex flex-col items-center text-center p-6">
              <div className="w-14 h-14 rounded-full bg-rural-mustard/10 flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-rural-earth" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Community Events</h3>
              <p className="text-gray-600">Stay updated with upcoming village events and important gatherings.</p>
            </div>
            
            <div className="rural-card flex flex-col items-center text-center p-6">
              <div className="w-14 h-14 rounded-full bg-rural-leaf/10 flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6 text-rural-leaf" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Budget Transparency</h3>
              <p className="text-gray-600">View how public funds are allocated and utilized for village development.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
