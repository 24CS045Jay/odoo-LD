// World Trotter visual style: beige editorial shell with navy-and-gold navigation.
import { Bell, Compass, Menu, Search } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
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
  const shouldReduceMotion = useReducedMotion();
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--line)] bg-[color:var(--canvas)]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1320px] items-center justify-between px-4 sm:h-[82px] sm:px-6 lg:h-[88px] lg:px-8">
        <Link href="/" className="group flex items-center gap-2.5 sm:gap-3.5" aria-label="World Trotter home">
          <span data-world-trotter-header-logo className="rounded-full focus-within:outline focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-[var(--gold)]"><BrandMark size={48} /></span>
          <span className="flex flex-col leading-none">
            <span className="font-serif text-[clamp(1.55rem,2.1vw,2.2rem)] font-bold tracking-[-0.065em] text-[var(--navy)] drop-shadow-[0_1px_0_rgba(255,255,255,0.9)]">World <span className="text-[var(--gold)]">Trotter</span></span>
            <span className="mt-1 hidden text-[8px] font-extrabold uppercase tracking-[0.2em] text-[var(--navy-soft)] sm:block">Curated travel planning</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 xl:flex" aria-label="Primary navigation">
          {navigation.map(([label, href], index) => {
            const active = location === href || (href === "/trips" && location.startsWith("/trips/"));
            return <motion.div key={href} initial={shouldReduceMotion ? false : { opacity: 0, y: -7 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.28, delay: shouldReduceMotion ? 0 : index * 0.05, ease: [0.23, 1, 0.32, 1] }} whileHover={shouldReduceMotion ? undefined : { y: -2 }} whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}>
              <Link href={href} className={`relative block rounded-full px-4 py-2 text-[11px] font-extrabold tracking-[0.055em] outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--canvas)] ${active ? "text-[var(--navy)]" : "text-[var(--ink-muted)] hover:bg-[var(--sand)] hover:text-[var(--navy)]"}`}>
                {label}
                {active && <motion.span layoutId="headerActiveNavigation" className="absolute inset-x-3 -bottom-2 h-0.5 rounded-full bg-[var(--gold)]" transition={{ type: "spring", stiffness: 420, damping: 32 }} />}
              </Link>
            </motion.div>;
          })}
        </nav>
        <div className="flex items-center gap-2">
          <motion.button whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.04 }} whileTap={{ scale: 0.96 }} aria-label="Search destinations" className="hidden h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] text-[var(--navy)] outline-none hover:border-[var(--gold)] hover:bg-[var(--sand)] focus-visible:ring-2 focus-visible:ring-[var(--gold)] md:flex"><Search size={18} /></motion.button>
          <motion.button whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.04 }} whileTap={{ scale: 0.96 }} aria-label="Travel notifications" className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] text-[var(--navy)] outline-none hover:border-[var(--gold)] hover:bg-[var(--sand)] focus-visible:ring-2 focus-visible:ring-[var(--gold)]"><Bell size={18} /><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[var(--gold)]" /></motion.button>
          <Link href="/profile" className="hidden h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--sand)] text-xs font-black text-[var(--navy)] outline-none hover:border-[var(--gold)] hover:bg-[var(--navy)] hover:text-[var(--canvas)] focus-visible:ring-2 focus-visible:ring-[var(--gold)] sm:flex">AM</Link>
          <motion.button whileTap={{ scale: 0.96 }} aria-label="Open travel navigation" className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] text-[var(--navy)] outline-none hover:border-[var(--gold)] hover:bg-[var(--sand)] focus-visible:ring-2 focus-visible:ring-[var(--gold)] xl:hidden"><Menu size={18} /></motion.button>
        </div>
      </div>
      <div className="route-ribbon hidden items-center justify-center gap-3 overflow-hidden border-t border-[var(--line)] px-8 py-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[var(--ink-muted)] lg:flex">
        <Compass size={12} className="text-[var(--gold)]" />
        <span>Plan your journey</span>
        <span className="route-line" />
        <span>Build your itinerary</span>
        <span className="route-line" />
        <span className="text-[var(--gold)]">Travel your story</span>
      </div>
    </header>
  );
}
