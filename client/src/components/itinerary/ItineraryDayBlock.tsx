// World Trotter visual style: calm, time-ordered itinerary journal entry.
import { Clock3, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import type { itineraryDays } from "@/lib/presentationData";

type Day = (typeof itineraryDays)[number];
export default function ItineraryDayBlock({ entry, index }: { entry: Day; index: number }) {
  return <motion.article initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06, duration: 0.28 }} className="grid gap-5 rounded-[24px] border border-[var(--line)] bg-white p-5 md:grid-cols-[112px_1fr_auto]"><div><p className="text-[10px] font-black uppercase tracking-[0.17em] text-[var(--gold)]">{entry.day}</p><p className="mt-1 font-serif text-xl font-bold text-[var(--navy)]">{entry.date}</p></div><div><p className="flex items-center gap-2 text-sm font-bold text-[var(--navy)]"><MapPin size={15} className="text-[var(--gold)]"/>{entry.city}</p><h3 className="mt-2 font-serif text-2xl font-bold text-[var(--navy)]">{entry.theme}</h3><div className="mt-3 flex flex-wrap gap-2">{entry.items.map(item => <span key={item} className="rounded-full bg-[var(--sand)] px-3 py-1.5 text-xs font-semibold text-[var(--ink-muted)]">{item}</span>)}</div></div><p className="flex items-start gap-1 text-sm font-bold text-[var(--navy)]"><Clock3 size={15} className="mt-0.5 text-[var(--gold)]"/>{entry.cost}</p></motion.article>;
}
