// World Trotter visual style: one-time animated compass arrival that respects reduced motion.
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import BrandMark from "@/components/layout/BrandMark";

export default function LandingIntro() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (reduced || sessionStorage.getItem("world-trotter-intro")) return;
    setVisible(true);
    const timer = window.setTimeout(() => { sessionStorage.setItem("world-trotter-intro", "seen"); setVisible(false); }, 2600);
    return () => window.clearTimeout(timer);
  }, [reduced]);
  const dismiss = () => { sessionStorage.setItem("world-trotter-intro", "seen"); setVisible(false); };
  return <AnimatePresence>{visible && <motion.div initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }} className="fixed inset-0 z-[100] grid place-items-center bg-[var(--canvas)]"><button onClick={dismiss} className="absolute right-6 top-6 flex items-center gap-2 rounded-full border border-[var(--line)] px-4 py-2 text-xs font-bold text-[var(--navy)]"><X size={14}/> Skip intro</button><div className="text-center"><motion.div initial={{ scale: 0.82, rotate: -180, opacity: 0 }} animate={{ scale: 1, rotate: 0, opacity: 1 }} transition={{ duration: 0.9, ease: [0.23, 1, 0.32, 1] }} className="relative mx-auto flex h-28 w-28 items-center justify-center"><motion.span animate={{ rotate: 360 }} transition={{ duration: 1.2, ease: "linear" }} className="absolute inset-[-14px] rounded-full border border-dashed border-[var(--gold)]"/><BrandMark size={112}/></motion.div><motion.p initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6, duration: 0.4 }} className="mt-8 font-serif text-5xl font-bold tracking-[-0.06em] text-[var(--navy)]">World <span className="text-[var(--gold)]">Trotter</span></motion.p><motion.p initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.85, duration: 0.35 }} className="mt-3 text-xs font-black uppercase tracking-[0.23em] text-[var(--ink-muted)]">Explore the World with Us</motion.p></div></motion.div>}</AnimatePresence>;
}
