/**
 * RouteSummary — Shows trip distance/time stats + "Optimize Route" button.
 * Uses Haversine formula for straight-line distances and heuristic thresholds for travel mode.
 */
import { useState } from "react";
import { Navigation, Clock, Route, Sparkles, ArrowRight } from "lucide-react";
import type { StopData } from "./StopMarker";

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function totalDistance(stops: StopData[]): number {
  let d = 0;
  for (let i = 1; i < stops.length; i++) {
    const a = stops[i - 1], b = stops[i];
    if (a.latitude != null && a.longitude != null && b.latitude != null && b.longitude != null) {
      d += haversineKm(a.latitude, a.longitude, b.latitude, b.longitude);
    }
  }
  return d;
}

function estimateHours(km: number): number {
  if (km < 300) return km / 60; // ~60 km/h by car
  if (km < 800) return km / 100 + 1; // train with buffer
  return km / 700 + 2; // flight with overhead
}

function travelMode(km: number): string {
  if (km < 300) return "🚗 Drive";
  if (km < 800) return "🚆 Train";
  return "✈️ Flight";
}

/** Nearest-neighbor TSP heuristic */
function optimizeOrder(stops: StopData[]): StopData[] {
  const geo = stops.filter(s => s.latitude != null && s.longitude != null);
  if (geo.length < 3) return stops;
  const remaining = [...geo];
  const ordered: StopData[] = [remaining.shift()!];
  while (remaining.length > 0) {
    const last = ordered[ordered.length - 1];
    let bestIdx = 0, bestDist = Infinity;
    for (let i = 0; i < remaining.length; i++) {
      const d = haversineKm(last.latitude!, last.longitude!, remaining[i].latitude!, remaining[i].longitude!);
      if (d < bestDist) { bestDist = d; bestIdx = i; }
    }
    ordered.push(remaining.splice(bestIdx, 1)[0]);
  }
  // Re-add stops without coordinates at their original relative positions
  const noGeo = stops.filter(s => s.latitude == null || s.longitude == null);
  return [...ordered, ...noGeo];
}

interface RouteSummaryProps {
  stops: StopData[];
  onReorder?: (newOrder: string[]) => void;
}

export default function RouteSummary({ stops, onReorder }: RouteSummaryProps) {
  const [showCompare, setShowCompare] = useState(false);
  const geoStops = stops.filter(s => s.latitude != null && s.longitude != null);
  const dist = totalDistance(geoStops);
  const hours = estimateHours(dist);

  const optimized = optimizeOrder(geoStops);
  const optDist = totalDistance(optimized);
  const savings = dist - optDist;

  const segments = geoStops.slice(1).map((stop, i) => {
    const prev = geoStops[i];
    const d = haversineKm(prev.latitude!, prev.longitude!, stop.latitude!, stop.longitude!);
    return { from: prev.city, to: stop.city, km: d, mode: travelMode(d), hours: estimateHours(d) };
  });

  return (
    <div className="space-y-3 rounded-2xl border border-[var(--line)] bg-white p-4">
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[.18em] text-[var(--gold)]">
        <Route size={14} /> Route summary
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-xl bg-[var(--sand)] p-3 text-center">
          <p className="font-serif text-xl font-bold text-[var(--navy)]">{geoStops.length}</p>
          <p className="text-[10px] font-bold text-[var(--ink-muted)]">Stops</p>
        </div>
        <div className="rounded-xl bg-[var(--sand)] p-3 text-center">
          <p className="font-serif text-xl font-bold text-[var(--navy)]">{dist < 10 ? dist.toFixed(1) : Math.round(dist)} km</p>
          <p className="text-[10px] font-bold text-[var(--ink-muted)]">Distance</p>
        </div>
        <div className="rounded-xl bg-[var(--sand)] p-3 text-center">
          <p className="font-serif text-xl font-bold text-[var(--navy)]">{hours < 1 ? `${Math.round(hours * 60)}m` : `${Math.round(hours)}h`}</p>
          <p className="text-[10px] font-bold text-[var(--ink-muted)]">Travel time</p>
        </div>
      </div>
      {segments.length > 0 && (
        <div className="space-y-1.5">
          {segments.map((seg, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-[var(--ink-muted)]">
              <span className="font-bold text-[var(--navy)]">{seg.from}</span>
              <ArrowRight size={10} />
              <span className="font-bold text-[var(--navy)]">{seg.to}</span>
              <span className="ml-auto font-semibold">{Math.round(seg.km)} km · {seg.mode}</span>
            </div>
          ))}
        </div>
      )}
      {onReorder && geoStops.length >= 3 && savings > 5 && (
        <div className="border-t border-[var(--line)] pt-3">
          {!showCompare ? (
            <button
              onClick={() => setShowCompare(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--navy)] px-4 py-2.5 text-xs font-extrabold text-white transition-transform hover:scale-[1.02]"
            >
              <Sparkles size={14} /> Optimize route
            </button>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-[var(--ink-muted)]">Current: {Math.round(dist)} km</span>
                <span className="text-green-600">Optimized: {Math.round(optDist)} km (−{Math.round(savings)} km)</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { onReorder(optimized.map(s => s._id)); setShowCompare(false); }}
                  className="flex-1 rounded-xl bg-[var(--navy)] px-3 py-2 text-xs font-extrabold text-white"
                >
                  Accept
                </button>
                <button
                  onClick={() => setShowCompare(false)}
                  className="flex-1 rounded-xl border border-[var(--line)] px-3 py-2 text-xs font-extrabold text-[var(--navy)]"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export { haversineKm, travelMode, estimateHours };
