// World Trotter visual style: illustrated journal-card pattern for trip summaries.
import { ArrowRight, CalendarDays, MapPin, WalletCards } from "lucide-react";
import { Link } from "wouter";
import type { trips } from "@/lib/presentationData";

type Trip = (typeof trips)[number];
export default function TripCard({ trip }: { trip: Trip }) {
  return <article className="group overflow-hidden rounded-[26px] border border-[var(--line)] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[rgba(23,49,74,0.12)]"><div className="relative h-52 overflow-hidden"><img src={trip.image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105"/><span className="absolute left-4 top-4 rounded-full bg-[color:var(--canvas)]/95 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-[var(--navy)]">{trip.status}</span></div><div className="p-5"><p className="text-[10px] font-black uppercase tracking-[0.16em] text-[var(--gold)]">{trip.dates}</p><h3 className="mt-2 font-serif text-2xl font-bold text-[var(--navy)]">{trip.title}</h3><p className="mt-2 flex items-center gap-2 text-sm text-[var(--ink-muted)]"><MapPin size={14} className="text-[var(--gold)]"/>{trip.places}</p><div className="mt-5 flex flex-wrap gap-2 border-t border-[var(--line)] pt-4 text-xs font-bold text-[var(--ink-muted)]"><span className="flex items-center gap-1.5"><CalendarDays size={14} className="text-[var(--gold)]"/>{trip.duration}</span><span className="flex items-center gap-1.5"><WalletCards size={14} className="text-[var(--gold)]"/>{trip.budget}</span><Link href="/itinerary-view" className="ml-auto inline-flex items-center gap-1 text-[var(--navy)]">Open <ArrowRight size={14}/></Link></div></div></article>;
}
