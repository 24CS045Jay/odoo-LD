// World Trotter visual style: compact travel tabs for one-handed mobile navigation.
import { CalendarDays, Compass, Home, Map, Users } from "lucide-react";
import { Link, useLocation } from "wouter";

const items = [
  ["Home", "/", Home], ["Trips", "/trips", Map], ["Plan", "/trips/new", Compass], ["Calendar", "/calendar", CalendarDays], ["Community", "/community", Users],
] as const;

export default function MobileNav() {
  const [location] = useLocation();
  return <nav className="fixed inset-x-3 bottom-3 z-50 flex items-center justify-between rounded-2xl border border-[var(--line)] bg-[color:var(--canvas)]/95 px-2 py-2 shadow-xl shadow-[rgba(23,49,74,0.12)] backdrop-blur-xl lg:hidden" aria-label="Mobile navigation">
    {items.map(([label, href, Icon]) => {
      const active = location === href || (href === "/trips" && location.startsWith("/trips/"));
      return <Link key={href} href={href} className={`flex min-w-12 flex-col items-center gap-1 rounded-xl px-2 py-1.5 text-[9px] font-extrabold ${active ? "bg-[var(--sand)] text-[var(--navy)]" : "text-[var(--ink-muted)]"}`}><Icon size={16} className={active ? "text-[var(--gold)]" : ""}/>{label}</Link>;
    })}
  </nav>;
}
