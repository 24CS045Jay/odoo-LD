/**
 * NearbyActivitiesLayer — Togglable layer showing catalog Activity entries near stops.
 * Reuses existing Activity/City data, rendered spatially instead of as a list.
 */
import L from "leaflet";
import { Marker, Popup } from "react-leaflet";
import { Compass, Plus, Clock, DollarSign } from "lucide-react";

interface NearbyActivity {
  _id: string;
  name: string;
  category?: string;
  cost: number;
  duration?: string;
  city: { _id: string; name: string; country: string; latitude?: number; longitude?: number };
}

const activityIcon = L.divIcon({
  className: "wt-activity-marker",
  html: `<div style="
    background: #b7954a;
    color: white;
    width: 24px; height: 24px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 12px;
    box-shadow: 0 2px 8px rgba(0,0,0,.2);
    border: 2px solid white;
    opacity: 0.85;
  ">⦿</div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -14],
});

interface NearbyActivitiesLayerProps {
  activities: NearbyActivity[];
  onAddToStop?: (activity: NearbyActivity) => void;
}

export default function NearbyActivitiesLayer({ activities, onAddToStop }: NearbyActivitiesLayerProps) {
  // Only render activities whose city has coordinates
  const geoActivities = activities.filter(
    a => a.city?.latitude != null && a.city?.longitude != null
  );

  return (
    <>
      {geoActivities.map(activity => (
        <Marker
          key={activity._id}
          position={[activity.city.latitude!, activity.city.longitude!]}
          icon={activityIcon}
        >
          <Popup className="wt-popup" maxWidth={240}>
            <div className="space-y-2 p-1">
              <div className="flex items-center gap-2">
                <Compass size={14} className="text-[#b7954a]" />
                <p className="text-sm font-bold text-[#17314a]">{activity.name}</p>
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-[#6f7c80]">
                {activity.duration && <span className="flex items-center gap-1"><Clock size={11} /> {activity.duration}</span>}
                <span className="flex items-center gap-1"><DollarSign size={11} /> ₹{activity.cost}</span>
              </div>
              {activity.category && (
                <span className="inline-block rounded-full bg-[#f5efe6] px-2 py-0.5 text-[10px] font-bold uppercase text-[#17314a]">
                  {activity.category}
                </span>
              )}
              <p className="text-xs text-[#6f7c80]">{activity.city.name}, {activity.city.country}</p>
              {onAddToStop && (
                <button
                  onClick={() => onAddToStop(activity)}
                  className="flex w-full items-center justify-center gap-1 rounded-lg bg-[#17314a] px-3 py-1.5 text-xs font-extrabold text-white"
                >
                  <Plus size={12} /> Add to stop
                </button>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}
