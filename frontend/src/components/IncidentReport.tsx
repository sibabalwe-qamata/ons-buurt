import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, MapPin, Camera, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

const incidentTypes = [
  { value: "theft", label: "Theft / Mugging", emoji: "🚨" },
  { value: "suspicious", label: "Suspicious Activity", emoji: "👁️" },
  { value: "road", label: "Road Hazard", emoji: "🚧" },
  { value: "safe", label: "Safe Zone Report", emoji: "🟢" },
];

const IncidentReport = () => {
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType) return;
    setIsSubmitting(true);
    try {
      await api.incidents.create({
        type: selectedType as "theft" | "suspicious" | "road" | "safe",
        location,
        description: description || undefined,
      });
      toast({
        title: "Report Submitted ✅",
        description: "Your report has been shared with the community for verification.",
      });
      setSelectedType("");
      setDescription("");
      setLocation("");
    } catch (err) {
      toast({
        title: "Submission failed",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="report" className="py-16 bg-card">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/10 border border-destructive/20 mb-4">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <span className="text-sm font-medium text-destructive">Report an Incident</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-4">
              See Something?{" "}
              <span className="text-gradient">Say Something.</span>
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Your report helps keep the community safe. Every submission goes through our
              <strong className="text-foreground"> Vouch system</strong> — community members
              verify reports to ensure accuracy and prevent false information.
            </p>
            <div className="space-y-4">
              {[
                { step: "1", text: "Choose the type of incident" },
                { step: "2", text: "Describe what happened and pin your location" },
                { step: "3", text: "Community members vouch to verify your report" },
              ].map((item) => (
                <div key={item.step} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-primary-foreground shrink-0">
                    {item.step}
                  </div>
                  <span className="text-foreground">{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-background border rounded-xl p-6 shadow-lg space-y-5"
          >
            <div>
              <Label className="text-sm font-medium mb-2 block">Incident Type</Label>
              <div className="grid grid-cols-2 gap-2">
                {incidentTypes.map((type) => (
                  <button
                    type="button"
                    key={type.value}
                    onClick={() => setSelectedType(type.value)}
                    className={`p-3 rounded-lg border text-left text-sm font-medium transition-all ${
                      selectedType === type.value
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    <span className="text-lg mr-2">{type.emoji}</span>
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="location" className="text-sm font-medium mb-2 block">
                Location
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="location"
                  placeholder="e.g., Corner of Main & 5th, Manenberg"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium mb-2 block">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Briefly describe what happened..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="flex-1" disabled={!selectedType || isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Submit Report
              </Button>
              <Button type="button" variant="outline" size="icon">
                <Camera className="w-4 h-4" />
              </Button>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default IncidentReport;
