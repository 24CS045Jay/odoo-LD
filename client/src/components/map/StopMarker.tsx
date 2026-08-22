/**
 * StopMarker — Numbered, color-coded Leaflet marker for trip sections.
 * Colors match section type (travel, hotel, activity, sightseeing, food, transportation).
 */
import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import { Calendar, DollarSign, Edit3, MapPin, Trash2, Eye } from "lucide-react";

const TYPE_COLORS: Record<string, string> = {
  travel: "#4a90d9",
  hotel: "#8b5cf6",
  activity: "#f59e0b",
  sightseeing: "#b7954a",
  food: "#ef4444",
  transportation: "#06b6d4",
  custom: "#17314a",
};

function createNumberedIcon(number: number, type: string) {
  const color = TYPE_COLORS[type] || TYPE_COLORS.custom;
  return L.divIcon({
    className: "wt-stop-marker",
    html: `<div style="
      background: ${color};
      color: white;
      width: 32px; height: 32px;
      border-radius: 50% 50% 50% 0;
      transform: rotate(-45deg);
      display: flex; align-items: center; justify-content: center;
      font-weight: 800; font-size: 13px;
      box-shadow: 0 3px 12px rgba(0,0,0,.25);
      border: 2.5px solid white;
    "><span style="transform: rotate(45deg)">${number}</span></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -34],
  });
}

export interface StopData {
  _id: string;
  city: string;
  title?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  latitude?: number;
  longitude?: number;
  orderIndex: number;
}

interface StopMarkerProps {
  stop: StopData;
  index: number;
  editable?: boolean;
  currency?: string;
  onEdit?: (stop: StopData) => void;
  onDelete?: (stop: StopData) => void;
  onViewActivities?: (stop: StopData) => void;
}

export default function StopMarker({ stop, index, editable, currency = "INR", onEdit, onDelete, onViewActivities }: StopMarkerProps) {
  if (stop.latitude == null || stop.longitude == null) return null;
  const icon = createNumberedIcon(index + 1, stop.type || "custom");
  const fmt = (date?: string) =>
    date ? new Date(date).toLocaleDateString("en-GB", { day: "2-digit", month: "short" }) : "—";
  const budget = new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 0 }).format(stop.budget ?? 0);

  return (
    <Marker position={[stop.latitude, stop.longitude]} icon={icon}>
      <Popup className="wt-popup" maxWidth={280} minWidth={220}>
        <div className="space-y-2 p-1">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-extrabold text-white" style={{ background: TYPE_COLORS[stop.type || "custom"] }}>
              {index + 1}
            </span>
            <div>
              <p className="text-sm font-bold text-[#17314a]">{stop.title || stop.city}</p>
              <p className="text-xs text-[#6f7c80]">{stop.city}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-[#6f7c80]">
            <span className="flex items-center gap-1"><Calendar size={12} /> {fmt(stop.startDate)} – {fmt(stop.endDate)}</span>
            <span className="flex items-center gap-1"><DollarSign size={12} /> {budget}</span>
          </div>
          <span className="inline-block rounded-full bg-[#f5efe6] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#17314a]">
            {stop.type || "custom"}
          </span>
          {editable && (
            <div className="flex gap-1 border-t border-[#e5dbce] pt-2">
              <button onClick={() => onEdit?.(stop)} className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-bold text-[#17314a] hover:bg-[#f5efe6]">
                <Edit3 size={13} /> Edit
              </button>
              <button onClick={() => onViewActivities?.(stop)} className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-bold text-[#17314a] hover:bg-[#f5efe6]">
                <Eye size={13} /> Activities
              </button>
              <button onClick={() => onDelete?.(stop)} className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50">
                <Trash2 size={13} /> Delete
              </button>
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  );
}

export { TYPE_COLORS };
