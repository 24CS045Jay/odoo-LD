// World Trotter visual style: reusable route filters with understated ivory controls.
import { Filter, SlidersHorizontal } from "lucide-react";

export default function FilterBar({ label = "Find your route" }: { label?: string }) {
  return <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--gold)]">{label}</p><div className="flex flex-wrap gap-2"><button className="flex items-center gap-2 rounded-full border border-[var(--line)] bg-white px-4 py-2.5 text-xs font-bold text-[var(--navy)] transition hover:border-[var(--gold)]"><SlidersHorizontal size={14}/> Group by</button><button className="flex items-center gap-2 rounded-full border border-[var(--line)] bg-white px-4 py-2.5 text-xs font-bold text-[var(--navy)] transition hover:border-[var(--gold)]"><Filter size={14}/> Filter</button><button className="rounded-full border border-[var(--line)] bg-white px-4 py-2.5 text-xs font-bold text-[var(--navy)] transition hover:border-[var(--gold)]">Sort by</button></div></div>;
}
