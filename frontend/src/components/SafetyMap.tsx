import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, AlertTriangle, ShieldCheck, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Incident {
  id: number;
  lat: number;
  lng: number;
  type: "safe" | "warning" | "danger";
  title: string;
  time: string;
  vouches: number;
}

const mockIncidents: Incident[] = [
  { id: 1, lat: -34.0333, lng: 18.5567, type: "safe", title: "Safe Haven – Shoprite Manenberg", time: "Active now", vouches: 12 },
  { id: 2, lat: -34.0380, lng: 18.5620, type: "danger", title: "Mugging reported near train station", time: "15 min ago", vouches: 8 },
  { id: 3, lat: -34.0310, lng: 18.5510, type: "warning", title: "Suspicious activity near school", time: "30 min ago", vouches: 5 },
  { id: 4, lat: -34.0360, lng: 18.5480, type: "safe", title: "Neighbourhood Watch patrol active", time: "Active now", vouches: 20 },
  { id: 5, lat: -34.0290, lng: 18.5590, type: "safe", title: "Safe passage – Main Road", time: "Verified today", vouches: 15 },
  { id: 6, lat: -34.0405, lng: 18.5530, type: "danger", title: "Road blockage, avoid area", time: "45 min ago", vouches: 6 },
];

const typeConfig = {
  safe: { color: "hsl(145, 60%, 40%)", label: "Safe Zone", icon: "🟢" },
  warning: { color: "hsl(36, 90%, 50%)", label: "Caution", icon: "🟡" },
  danger: { color: "hsl(0, 72%, 51%)", label: "Danger", icon: "🔴" },
};

const SafetyMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [filter, setFilter] = useState<"all" | "safe" | "warning" | "danger">("all");
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [-34.034, 18.555],
      zoom: 15,
      zoomControl: false,
    });

    L.control.zoom({ position: "bottomright" }).addTo(map);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const filteredIncidents = filter === "all" ? mockIncidents : mockIncidents.filter((i) => i.type === filter);

    filteredIncidents.forEach((incident) => {
      const config = typeConfig[incident.type];
      const marker = L.circleMarker([incident.lat, incident.lng], {
        radius: 10,
        fillColor: config.color,
        color: config.color,
        weight: 2,
        opacity: 0.9,
        fillOpacity: 0.6,
      }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: 'Inter', sans-serif; min-width: 180px;">
          <div style="font-weight: 600; margin-bottom: 4px;">${config.icon} ${incident.title}</div>
          <div style="font-size: 12px; color: #666; margin-bottom: 4px;">${incident.time}</div>
          <div style="font-size: 12px; color: #666;">✅ ${incident.vouches} vouches</div>
        </div>
      `);

      marker.on("click", () => setSelectedIncident(incident));
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [filter]);

  return (
    <section id="map" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-foreground mb-3">
            Community Safety Map
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Real-time, crowd-sourced safety data from your neighbours. Tap a marker for details.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {(["all", "safe", "warning", "danger"] as const).map((f) => (
            <Button
              key={f}
              size="sm"
              variant={filter === f ? "default" : "outline"}
              onClick={() => {
                setSelectedIncident(null);
                setFilter(f);
              }}
              className="capitalize"
            >
              {f === "all" ? "All Reports" : typeConfig[f].label}
            </Button>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2 rounded-xl overflow-hidden border shadow-lg h-[450px]">
            <div ref={mapRef} className="w-full h-full" />
          </div>

          {/* Feed */}
          <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
            <h3 className="font-heading font-semibold text-foreground text-lg sticky top-0 bg-background pb-2">
              Live Feed
            </h3>
            {mockIncidents
              .filter((i) => filter === "all" || i.type === filter)
              .map((incident) => {
                const config = typeConfig[incident.type];
                return (
                  <motion.button
                    key={incident.id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    onClick={() => setSelectedIncident(incident)}
                    className={`w-full text-left p-4 rounded-lg border transition-all hover:shadow-md ${
                      selectedIncident?.id === incident.id
                        ? "border-primary bg-primary/5"
                        : "bg-card hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ${
                          incident.type === "safe"
                            ? "bg-safe safe-pulse"
                            : incident.type === "danger"
                            ? "bg-danger danger-pulse"
                            : "bg-warning"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-card-foreground text-sm truncate">
                          {incident.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-muted-foreground">{incident.time}</span>
                          <Badge variant="secondary" className="text-xs">
                            ✅ {incident.vouches} vouches
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SafetyMap;
