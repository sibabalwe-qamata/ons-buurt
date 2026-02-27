import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SafetyMap from "@/components/SafetyMap";
import IncidentReport from "@/components/IncidentReport";
import WalkingBuddy from "@/components/WalkingBuddy";
import Footer from "@/components/Footer";

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
