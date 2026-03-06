import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { AlertTriangle, Camera, Loader2, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

const incidentTypes = [
  { value: "theft", label: "Theft / Mugging", emoji: "🚨" },
  { value: "suspicious", label: "Suspicious Activity", emoji: "👁️" },
  { value: "road", label: "Road Hazard", emoji: "🚧" },
  { value: "safe", label: "Safe Zone Report", emoji: "🟢" },
];

const NOMINATIM_HEADERS = {
  "Accept-Language": "en",
  "User-Agent": "OnsBuurt/1.0 (Community Safety App; Cape Flats)",
};

function hasLocalContext(query: string): boolean {
  const lower = query.toLowerCase();
  return (
    lower.includes("south africa") ||
    lower.includes("cape town") ||
    lower.includes("cape flats") ||
    lower.includes(", za") ||
    /\d{4,5}/.test(query)
  );
}

type GeocodeResult = { lat: number; lng: number; displayName: string };

async function geocodeWithQuery(
  query: string,
  limit: number
): Promise<GeocodeResult[]> {
  const params = new URLSearchParams({
    format: "json",
    q: query,
    limit: String(limit),
    countrycodes: "za",
  });
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?${params}`,
    { headers: NOMINATIM_HEADERS }
  );
  if (!res.ok) return [];
  const data = await res.json();
  if (!Array.isArray(data)) return [];
  return data.slice(0, limit).map((d: { lat: string; lon: string; display_name: string }) => ({
    lat: parseFloat(d.lat),
    lng: parseFloat(d.lon),
    displayName: d.display_name || "",
  }));
}

function delay(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function geocodeAddress(address: string): Promise<GeocodeResult[]> {
  const trimmed = address.trim();
  if (!trimmed) return [];
  try {
    let results = await geocodeWithQuery(trimmed, 3);
    if (results.length === 0 && !hasLocalContext(trimmed)) {
      await delay(1100);
      results = await geocodeWithQuery(`${trimmed}, Cape Town, South Africa`, 3);
    }
    if (results.length === 0 && !hasLocalContext(trimmed)) {
      await delay(1100);
      results = await geocodeWithQuery(`${trimmed}, Cape Flats, South Africa`, 3);
    }
    return results;
  } catch {
    return [];
  }
}

const IncidentReport = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [lat, setLat] = useState<number | undefined>();
  const [lng, setLng] = useState<number | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationOptions, setLocationOptions] = useState<GeocodeResult[] | null>(null);

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      toast({ title: "Not supported", description: "Geolocation is not supported by your browser.", variant: "destructive" });
      return;
    }
    setIsGettingLocation(true);
    setLocationOptions(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
        setIsGettingLocation(false);
        toast({ title: "Location captured", description: "Your coordinates have been set." });
      },
      () => {
        setIsGettingLocation(false);
        toast({ title: "Location unavailable", description: "Could not get your position. Try entering an address.", variant: "destructive" });
      }
    );
  };

  const submitWithCoords = async (finalLat: number, finalLng: number) => {
    await api.incidents.create({
      type: selectedType as "theft" | "suspicious" | "road" | "safe",
      location,
      description: description || undefined,
      lat: finalLat,
      lng: finalLng,
    });
    queryClient.invalidateQueries({ queryKey: ["incidents"] });
    toast({
      title: "Report Submitted ✅",
      description: "Your report has been shared with the community for verification.",
    });
    setSelectedType("");
    setDescription("");
    setLocation("");
    setLat(undefined);
    setLng(undefined);
    setLocationOptions(null);
  };

  const handleSelectLocationOption = async (opt: GeocodeResult) => {
    setLocationOptions(null);
    setLat(opt.lat);
    setLng(opt.lng);
    setIsSubmitting(true);
    try {
      await submitWithCoords(opt.lat, opt.lng);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType) return;
    setIsSubmitting(true);
    setLocationOptions(null);
    try {
      let finalLat = lat;
      let finalLng = lng;
      if ((finalLat == null || finalLng == null) && location.trim()) {
        const results = await geocodeAddress(location);
        if (results.length === 0) {
          toast({
            title: "Invalid address format",
            description: "Could not find coordinates for this address. Please enter a valid address or use your device location.",
            variant: "destructive",
          });
          setIsSubmitting(false);
          return;
        }
        if (results.length === 1) {
          finalLat = results[0].lat;
          finalLng = results[0].lng;
        } else {
          setLocationOptions(results.slice(0, 3));
          setIsSubmitting(false);
          return;
        }
      }
      if (finalLat == null || finalLng == null) {
        toast({
          title: "Invalid address format",
          description: "Please enter a valid address or use your device location so the incident appears on the map.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }
      await submitWithCoords(finalLat, finalLng);
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
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="location"
                    placeholder="e.g., Shoprite Manenberg, Cape Town or street address"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleUseMyLocation}
                  disabled={isGettingLocation}
                >
                  {isGettingLocation ? <Loader2 className="w-4 h-4 animate-spin" /> : <MapPin className="w-4 h-4" />}
                  {isGettingLocation ? "" : "Use my location"}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Include place name and area (e.g. &quot;Manenberg&quot;) for better map placement, or use your device location.
              </p>
              {locationOptions && locationOptions.length > 0 && (
                <div className="mt-3 p-3 rounded-lg border bg-muted/30 space-y-2">
                  <p className="text-sm font-medium text-foreground">Select the correct location:</p>
                  {locationOptions.map((opt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectLocationOption(opt)}
                      className="w-full text-left p-2 rounded border bg-background hover:bg-primary/10 hover:border-primary/40 text-sm transition-colors"
                    >
                      {opt.displayName}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setLocationOptions(null)}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Cancel
                  </button>
                </div>
              )}
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
              <Button
                type="submit"
                className="flex-1"
                disabled={!selectedType || isSubmitting || locationOptions != null}
              >
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
