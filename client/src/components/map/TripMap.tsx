/**
 * TripMap — Main interactive map for viewing and managing trip stops.
 * Integrates MapProvider, StopMarkers, route polyline, search, reorder, and summary.
 */
import { lazy, Suspense, useState, useMemo, useCallback } from "react";
import { Polyline } from "react-leaflet";
import type { LatLngTuple } from "leaflet";
import MapProvider from "./MapProvider";
import StopMarker, { type StopData } from "./StopMarker";
import MapSearchBox from "./MapSearchBox";
import StopReorderList from "./StopReorderList";
import RouteSummary, { haversineKm, travelMode } from "./RouteSummary";
import { Layers, X } from "lucide-react";

interface TripMapProps {
  stops: StopData[];
  editable?: boolean;
  currency?: string;
  showSearch?: boolean;
  showReorder?: boolean;
  showSummary?: boolean;
  showNearbyActivities?: boolean;
  nearbyActivities?: any[];
  onAddStop?: (place: { name: string; latitude: number; longitude: number }) => void;
  onEditStop?: (stop: StopData) => void;
  onDeleteStop?: (stop: StopData) => void;
  onViewActivities?: (stop: StopData) => void;
  onReorder?: (newOrder: string[]) => void;
  onAddActivityToStop?: (activity: any) => void;
  className?: string;
}

// Lazy-load NearbyActivitiesLayer to avoid loading it when not toggled on
const NearbyActivitiesLayer = lazy(() => import("./NearbyActivitiesLayer"));

export default function TripMap({
  stops,
  editable = false,
  currency = "INR",
  showSearch = false,
  showReorder = false,
  showSummary = false,
  showNearbyActivities = false,
  nearbyActivities = [],
  onAddStop,
  onEditStop,
  onDeleteStop,
  onViewActivities,
  onReorder,
  onAddActivityToStop,
  className = "",
}: TripMapProps) {
  const [activitiesVisible, setActivitiesVisible] = useState(false);

  // Compute bounds from stops with coordinates
  const geoStops = useMemo(
    () => stops.filter(s => s.latitude != null && s.longitude != null),
    [stops]
  );

  const bounds = useMemo(() => {
    if (geoStops.length === 0) return undefined;
    if (geoStops.length === 1) return undefined; // single point → use center + zoom instead
    return geoStops.map(s => [s.latitude!, s.longitude!] as LatLngTuple);
  }, [geoStops]);

  const center = useMemo<[number, number]>(() => {
    if (geoStops.length === 0) return [20.5937, 78.9629]; // India
    if (geoStops.length === 1) return [geoStops[0].latitude!, geoStops[0].longitude!];
    const lat = geoStops.reduce((s, g) => s + g.latitude!, 0) / geoStops.length;
    const lng = geoStops.reduce((s, g) => s + g.longitude!, 0) / geoStops.length;
    return [lat, lng];
  }, [geoStops]);

  const zoom = geoStops.length <= 1 ? 10 : undefined;

  // Route polyline positions
  const routePositions = useMemo<LatLngTuple[]>(
    () => geoStops.map(s => [s.latitude!, s.longitude!] as LatLngTuple),
    [geoStops]
  );

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Search box */}
      {showSearch && editable && onAddStop && (
        <MapSearchBox onAddStop={onAddStop} />
      )}

      <div className="grid gap-3 lg:grid-cols-[1fr_240px]">
        {/* Map container */}
        <div className="relative overflow-hidden rounded-2xl border border-[var(--line)] shadow-sm" style={{ minHeight: 420 }}>
          {geoStops.length === 0 ? (
            <div className="flex h-full min-h-[420px] flex-col items-center justify-center bg-[var(--sand)] p-8 text-center">
              <div className="h-28 w-28 rounded-full bg-[var(--canvas)] p-6">
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" className="h-full w-full">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <p className="mt-5 font-serif text-2xl font-bold text-[var(--navy)]">Add your first stop</p>
              <p className="mt-2 max-w-xs text-sm text-[var(--ink-muted)]">
                Search for a city or place above to see it on the map.
              </p>
            </div>
          ) : (
            <MapProvider center={center} zoom={zoom} bounds={bounds}>
              {/* Numbered stop markers */}
              {geoStops.map((stop, i) => (
                <StopMarker
                  key={stop._id}
                  stop={stop}
                  index={i}
                  editable={editable}
                  currency={currency}
                  onEdit={onEditStop}
                  onDelete={onDeleteStop}
                  onViewActivities={onViewActivities}
                />
              ))}

              {/* Route polyline — dashed gold line */}
              {routePositions.length >= 2 && (
                <Polyline
                  positions={routePositions}
                  pathOptions={{
                    color: "#b7954a",
                    weight: 3,
                    opacity: 0.7,
                    dashArray: "10 8",
                    lineCap: "round",
                    lineJoin: "round",
                  }}
                />
              )}

              {/* Nearby activities */}
              {showNearbyActivities && activitiesVisible && (
                <Suspense fallback={null}>
                  <NearbyActivitiesLayer
                    activities={nearbyActivities}
                    onAddToStop={onAddActivityToStop}
                  />
                </Suspense>
              )}
            </MapProvider>
          )}

          {/* Activities layer toggle */}
          {showNearbyActivities && geoStops.length > 0 && (
            <button
              onClick={() => setActivitiesVisible(v => !v)}
              className={`absolute right-3 top-3 z-[500] flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-extrabold shadow-md transition-colors ${
                activitiesVisible
                  ? "border-[var(--gold)] bg-[var(--gold)] text-white"
                  : "border-white bg-white text-[var(--navy)]"
              }`}
            >
              {activitiesVisible ? <X size={13} /> : <Layers size={13} />}
              {activitiesVisible ? "Hide activities" : "Nearby activities"}
            </button>
          )}
        </div>

        {/* Sidebar: reorder list + route summary */}
        {(showReorder || showSummary) && (
          <div className="space-y-3">
            {showReorder && editable && onReorder && (
              <div className="rounded-2xl border border-[var(--line)] bg-white p-3">
                <StopReorderList stops={stops} onReorder={onReorder} />
              </div>
            )}
            {showSummary && <RouteSummary stops={stops} onReorder={editable ? onReorder : undefined} />}
          </div>
        )}
      </div>
    </div>
  );
}
