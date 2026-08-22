import { ArrowLeft, ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AppShell from "@/components/layout/AppShell";
import PageIntro from "@/components/shared/PageIntro";
import { tripApi } from "@/api/client";

export default function CalendarPage() {
  const [view, setView] = useState(() => new Date());
  const { data: events = [], isLoading } = useQuery({ queryKey: ["calendar", view.getFullYear(), view.getMonth()], queryFn: () => tripApi.calendar(view.getMonth() + 1, view.getFullYear()) });
  const days = Array.from({ length: new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate() }, (_, index) => index + 1);
  const lead = (new Date(view.getFullYear(), view.getMonth(), 1).getDay() + 6) % 7;
  const title = view.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
  const eventOn = (day: number) => events.some(event => { if (!event.startDate || !event.endDate) return false; const current = new Date(view.getFullYear(), view.getMonth(), day).getTime(); return current >= new Date(event.startDate).setHours(0, 0, 0, 0) && current <= new Date(event.endDate).setHours(23, 59, 59, 999); });
  const next = events[0];
  const move = (amount: number) => setView(current => new Date(current.getFullYear(), current.getMonth() + amount, 1));
  return (
    <AppShell><section className="mx-auto max-w-[1120px] px-5 py-12 lg:px-8">
      <PageIntro eyebrow="See the shape of your year" title={<>Travel calendar<span className="text-[var(--gold)]">.</span></>} description="Every saved travel day and good little promise in one quiet view."/>
      <div className="mt-10 grid gap-7 lg:grid-cols-[1.25fr_.75fr]">
        <article className="rounded-[28px] border border-[var(--line)] bg-white p-6">
          <div className="flex items-center justify-between"><h2 className="font-serif text-3xl font-bold text-[var(--navy)]">{title}</h2><div className="flex gap-2"><button onClick={() => move(-1)} className="rounded-full border border-[var(--line)] p-2 text-[var(--navy)]"><ArrowLeft size={16}/></button><button onClick={() => move(1)} className="rounded-full border border-[var(--line)] p-2 text-[var(--navy)]"><ArrowRight size={16}/></button></div></div>
          <div className="mt-7 grid grid-cols-7 gap-2 text-center text-[10px] font-black uppercase tracking-[.14em] text-[var(--ink-muted)]">{"MTWTFSS".split("").map((letter, index) => <span key={`${letter}-${index}`}>{letter}</span>)}</div>
          <div className="mt-3 grid grid-cols-7 gap-2">{Array.from({ length: lead }, (_, index) => <span key={`blank-${index}`}/>)}{days.map(day => <div key={day} className={`relative flex aspect-square items-center justify-center rounded-xl text-sm font-bold ${eventOn(day) ? "bg-[var(--navy)] text-white shadow-md" : "text-[var(--ink-muted)] hover:bg-[var(--sand)]"}`}>{day}{eventOn(day) ? <span className="absolute bottom-1 h-1 w-1 rounded-full bg-[var(--gold)]"/> : null}</div>)}</div>
        </article>
        <aside className="rounded-[28px] bg-[var(--sand)] p-7"><CalendarDays className="text-[var(--gold)]"/><p className="mt-5 text-[10px] font-black uppercase tracking-[.18em] text-[var(--gold)]">Next up</p>{isLoading ? <div className="mt-4 h-32 animate-pulse rounded-2xl bg-white/60"/> : next ? <div><h2 className="mt-2 font-serif text-3xl font-bold text-[var(--navy)]">{next.title}</h2><p className="mt-2 text-sm text-[var(--ink-muted)]">{next.startDate ? new Date(next.startDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : "Dates to be decided"}</p><div className="my-7 h-px bg-[var(--sand-dark)]"/><div className="space-y-4 text-sm font-semibold text-[var(--ink-muted)]"><p className="flex gap-3"><MapPin size={16} className="text-[var(--gold)]"/>Saved in your World Trotter journal</p><p className="flex gap-3"><span className="text-[var(--gold)]">✦</span>{next.status} trip</p></div></div> : <p className="mt-3 text-sm leading-6 text-[var(--ink-muted)]">No saved trip touches this month yet. Create a route and its dates will appear here.</p>}</aside>
      </div>
    </section></AppShell>
  );
}
