import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { MapPin, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { formatDistanceToNow } from "date-fns";
import { api, type IncidentApi } from "@/lib/api";

const CAPE_FLATS_CENTER = { lat: -34.034, lng: 18.555 };

function toMapIncident(i: IncidentApi) {
  const lat = i.lat != null ? Number(i.lat) : CAPE_FLATS_CENTER.lat;
  const lng = i.lng != null ? Number(i.lng) : CAPE_FLATS_CENTER.lng;
  return {
    id: i.id,
    lat,
    lng,
    type: i.map_type as "safe" | "warning" | "danger",
    title: i.title,
    time: formatDistanceToNow(new Date(i.created_at), { addSuffix: true }),
    vouches: i.vouches_count,
  };
}

const typeConfig = {
  safe: { color: "hsl(145, 60%, 40%)", label: "Safe Zone", icon: "🟢" },
  warning: { color: "hsl(36, 90%, 50%)", label: "Caution", icon: "🟡" },
  danger: { color: "hsl(0, 72%, 51%)", label: "Danger", icon: "🔴" },
};

const SafetyMap = () => {
  const queryClient = useQueryClient();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [filter, setFilter] = useState<"all" | "safe" | "warning" | "danger">("all");
  const [selectedIncident, setSelectedIncident] = useState<ReturnType<typeof toMapIncident> | null>(null);

  const { data: incidents = [] } = useQuery({
    queryKey: ["incidents", filter],
    queryFn: () => api.incidents.list(filter === "all" ? undefined : filter),
  });

  const vouchMutation = useMutation({
    mutationFn: (id: string) => api.incidents.vouch(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["incidents"] }),
  });

  const mapIncidents = incidents.map(toMapIncident);
  const filteredIncidents = filter === "all" ? mapIncidents : mapIncidents.filter((i) => i.type === filter);
  const markersRef = useRef<L.CircleMarker[]>([]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [CAPE_FLATS_CENTER.lat, CAPE_FLATS_CENTER.lng],
      zoom: 15,
      zoomControl: false,
    });

    L.control.zoom({ position: "bottomright" }).addTo(map);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      markersRef.current = [];
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

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
      markersRef.current.push(marker);
    });
  }, [filteredIncidents]);

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
            {filteredIncidents.map((incident) => {
                const config = typeConfig[incident.type];
                const isVouching = vouchMutation.isPending && vouchMutation.variables === incident.id;
                return (
                  <motion.div
                    key={incident.id}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className={`w-full text-left p-4 rounded-lg border transition-all hover:shadow-md cursor-pointer ${
                      selectedIncident?.id === incident.id
                        ? "border-primary bg-primary/5"
                        : "bg-card hover:border-primary/30"
                    }`}
                    onClick={() => setSelectedIncident(incident)}
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
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className="text-xs text-muted-foreground">{incident.time}</span>
                          <Badge variant="secondary" className="text-xs">
                            ✅ {incident.vouches} vouches
                          </Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              vouchMutation.mutate(incident.id);
                            }}
                            disabled={isVouching}
                          >
                            {isVouching ? "..." : "Vouch"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SafetyMap;
