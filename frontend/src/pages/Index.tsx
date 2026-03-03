import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import IncidentReport from "@/components/IncidentReport";
import Navbar from "@/components/Navbar";
import SafetyMap from "@/components/SafetyMap";
import WalkingBuddy from "@/components/WalkingBuddy";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <SafetyMap />
      <IncidentReport />
      <WalkingBuddy />
      <Footer />
    </div>
  );
};

export default Index;
