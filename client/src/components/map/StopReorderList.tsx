/**
 * StopReorderList — Compact drag-handle list docked beside/under the map.
 * Updates marker numbering and route line as the user drags.
 */
import { useState, useCallback } from "react";
import { GripVertical, MapPin } from "lucide-react";
import type { StopData } from "./StopMarker";
import { TYPE_COLORS } from "./StopMarker";

interface StopReorderListProps {
  stops: StopData[];
  onReorder: (newOrder: string[]) => void;
}

export default function StopReorderList({ stops, onReorder }: StopReorderListProps) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  const handleDragStart = useCallback((i: number) => setDragIndex(i), []);
  const handleDragOver = useCallback((e: React.DragEvent, i: number) => {
    e.preventDefault();
    setOverIndex(i);
  }, []);
  const handleDrop = useCallback((targetIndex: number) => {
    if (dragIndex === null || dragIndex === targetIndex) {
      setDragIndex(null);
      setOverIndex(null);
      return;
    }
    const reordered = [...stops];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(targetIndex, 0, moved);
    onReorder(reordered.map(s => s._id));
    setDragIndex(null);
    setOverIndex(null);
  }, [dragIndex, stops, onReorder]);

  if (stops.length === 0) return null;

  return (
    <div className="space-y-1">
      <p className="text-[10px] font-black uppercase tracking-[.18em] text-[var(--gold)]">
        Stop order
      </p>
      <div className="space-y-1">
        {stops.map((stop, i) => (
          <div
            key={stop._id}
            draggable
            onDragStart={() => handleDragStart(i)}
            onDragOver={e => handleDragOver(e, i)}
            onDrop={() => handleDrop(i)}
            onDragEnd={() => { setDragIndex(null); setOverIndex(null); }}
            className={`flex cursor-grab items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-colors active:cursor-grabbing ${
              dragIndex === i ? "opacity-40" : overIndex === i ? "bg-[var(--gold)]/10" : "hover:bg-[var(--sand)]"
            }`}
          >
            <GripVertical size={12} className="shrink-0 text-[var(--ink-muted)]" />
            <span
              className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-extrabold text-white"
              style={{ background: TYPE_COLORS[stop.type || "custom"] }}
            >
              {i + 1}
            </span>
            <span className="min-w-0 flex-1 truncate font-bold text-[var(--navy)]">
              {stop.title || stop.city}
            </span>
            <MapPin size={11} className="shrink-0 text-[var(--ink-muted)]" />
          </div>
        ))}
      </div>
    </div>
  );
}
