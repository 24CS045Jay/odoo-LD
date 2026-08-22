/**
 * MapProvider — Leaflet + OpenStreetMap wrapper.
 * All Leaflet-specific code is isolated here so the map library can be swapped
 * for Google Maps or Mapbox later by changing only this file.
 */
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import type { LatLngBoundsExpression, Map as LeafletMap } from "leaflet";
import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

interface MapProviderProps {
  center?: [number, number];
  zoom?: number;
  bounds?: LatLngBoundsExpression;
  className?: string;
  children?: React.ReactNode;
  onMapReady?: (map: LeafletMap) => void;
}

function FitBounds({ bounds }: { bounds?: LatLngBoundsExpression }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) map.fitBounds(bounds, { padding: [48, 48], maxZoom: 14 });
  }, [map, bounds]);
  return null;
}

function MapReadyHook({ onReady }: { onReady?: (map: LeafletMap) => void }) {
  const map = useMap();
  const called = useRef(false);
  useEffect(() => {
    if (onReady && !called.current) {
      called.current = true;
      onReady(map);
    }
  }, [map, onReady]);
  return null;
}

export default function MapProvider({
  center = [20.5937, 78.9629], // India center as default
  zoom = 5,
  bounds,
  className = "",
  children,
  onMapReady,
}: MapProviderProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom
      className={`h-full w-full rounded-2xl ${className}`}
      style={{ minHeight: 360 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds bounds={bounds} />
      <MapReadyHook onReady={onMapReady} />
      {children}
    </MapContainer>
  );
}

export type { LeafletMap };
