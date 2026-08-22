// World Trotter visual style: day-by-day route readout paired with practical budget context.
import { ArrowRight, Share2 } from "lucide-react";
import { Link } from "wouter";
import AppShell from "@/components/layout/AppShell";
import PageIntro from "@/components/shared/PageIntro";
import ItineraryDayBlock from "@/components/itinerary/ItineraryDayBlock";
import BudgetSummary from "@/components/itinerary/BudgetSummary";
import { itineraryDays } from "@/lib/presentationData";
export default function ItineraryViewPage() { return <AppShell><section className="mx-auto max-w-[1120px] px-5 py-12 lg:px-8"><PageIntro eyebrow="Step 03 · read the full route" title={<>A little Mediterranean escape<span className="text-[var(--gold)]">.</span></>} description="Lisbon · Porto · Lagos · 18–28 September 2026" action={<div className="flex gap-2"><Link href="/budget" className="rounded-full border border-[var(--line)] bg-white px-4 py-3 text-sm font-extrabold text-[var(--navy)]">Budget</Link><Link href="/shared/mediterranean" className="inline-flex items-center gap-2 rounded-full bg-[var(--navy)] px-4 py-3 text-sm font-extrabold text-white"><Share2 size={15}/>Share</Link></div>}/><div className="mt-10 grid gap-7 lg:grid-cols-[1fr_300px]"><div className="space-y-4">{itineraryDays.map((entry, index) => <ItineraryDayBlock key={entry.day} entry={entry} index={index}/>)}</div><BudgetSummary/></div><div className="mt-8 flex justify-end"><Link href="/calendar" className="inline-flex items-center gap-2 text-sm font-extrabold text-[var(--navy)]">See this route on the calendar <ArrowRight size={16}/></Link></div></section></AppShell>; }
