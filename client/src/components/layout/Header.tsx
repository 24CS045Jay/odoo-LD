// World Trotter visual style: beige editorial shell with navy-and-gold navigation.
import { Bell, Compass, Menu, Search } from "lucide-react";
import { Link, useLocation } from "wouter";
import BrandMark from "./BrandMark";

const navigation = [
  ["Dashboard", "/dashboard"],
  ["My trips", "/trips"],
  ["Plan", "/trips/new"],
  ["Calendar", "/calendar"],
  ["Community", "/community"],
] as const;

export default function Header() {
  const [location] = useLocation();
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[color:var(--canvas)]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[74px] max-w-[1240px] items-center justify-between px-5 lg:px-8">
        <Link href="/" className="flex items-center gap-3" aria-label="World Trotter home">
          <BrandMark size={40} />
          <span className="font-serif text-[23px] font-bold tracking-[-0.05em] text-[var(--navy)]">World <span className="text-[var(--gold)]">Trotter</span></span>
        </Link>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Primary navigation">
          {navigation.map(([label, href]) => {
            const active = location === href || (href === "/trips" && location.startsWith("/trips/"));
            return <Link key={href} href={href} className={`relative py-7 text-[12px] font-extrabold tracking-[0.04em] ${active ? "text-[var(--navy)]" : "text-[var(--ink-muted)] hover:text-[var(--navy)]"}`}>
              {label}{active && <span className="absolute bottom-0 left-0 h-0.5 w-full bg-[var(--gold)]" />}
            </Link>;
          })}
        </nav>
        <div className="flex items-center gap-2">
          <button aria-label="Search destinations" className="hidden rounded-full border border-[var(--line)] p-2.5 text-[var(--navy)] transition hover:border-[var(--gold)] hover:bg-[var(--sand)] md:block"><Search size={17} /></button>
          <button aria-label="Travel notifications" className="relative rounded-full border border-[var(--line)] p-2.5 text-[var(--navy)] transition hover:border-[var(--gold)] hover:bg-[var(--sand)]"><Bell size={17} /><span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-[var(--gold)]" /></button>
          <Link href="/profile" className="hidden h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--sand)] text-xs font-black text-[var(--navy)] sm:flex">AM</Link>
          <button aria-label="Open travel navigation" className="rounded-full border border-[var(--line)] p-2.5 text-[var(--navy)] lg:hidden"><Menu size={17} /></button>
        </div>
      </div>
      <div className="route-ribbon hidden items-center gap-3 overflow-hidden border-t border-[var(--line)] px-8 py-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[var(--ink-muted)] lg:flex">
        <Compass size={12} className="text-[var(--gold)]" /><span>38° 43′ N · Lisbon</span><span className="route-line"/><span>41° 09′ N · Porto</span><span className="route-line"/><span className="text-[var(--gold)]">Follow the good light</span>
      </div>
    </header>
  );
}
