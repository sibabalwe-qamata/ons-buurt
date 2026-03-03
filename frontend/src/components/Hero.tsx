import { motion } from "framer-motion";
import { MapPin, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroBg from "@/assets/hero-bg.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Cape Flats community at golden hour"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/40" />
      </div>

      <div className="container mx-auto px-4 relative z-10 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/20 border border-primary/30 mb-6">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Community-Powered Safety
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-bold text-background leading-tight mb-6">
            Walk Safe.{" "}
            <span className="text-gradient">Walk Together.</span>
          </h1>

          <p className="text-lg text-background/80 mb-8 max-w-lg leading-relaxed">
            Ons Buurt empowers Cape Flats communities to crowd-source safe
            zones, report incidents in real-time, and find Walking Buddies so
            no one has to walk alone.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button size="lg" className="text-base px-8" asChild>
              <a href="#map">
                <MapPin className="w-5 h-5 mr-2" />
                View Safety Map
              </a>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-base px-8 border-background/30 text-background hover:bg-background/10"
              asChild
            >
              <a href="#buddy">
                <Users className="w-5 h-5 mr-2" />
                Find a Walking Buddy
              </a>
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex gap-8 mt-12"
          >
            {[
              { value: "24/7", label: "Real-Time Updates" },
              { value: "100+", label: "Safe Zones Mapped" },
              { value: "500+", label: "Community Members" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-heading font-bold text-primary">
                  {stat.value}
                </div>
                <div className="text-sm text-background/60">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
