
import NavBar from "@/components/NavBar";
import HeroSection from "@/components/HeroSection";
import FeatureSection from "@/components/FeatureSection";
import IssueTrackingDemo from "@/components/IssueTrackingDemo";
import EventsPreview from "@/components/EventsPreview";
import ResourcesPreview from "@/components/ResourcesPreview";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow">
        <HeroSection />
        <FeatureSection />
        <IssueTrackingDemo />
        <EventsPreview />
        <ResourcesPreview />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
