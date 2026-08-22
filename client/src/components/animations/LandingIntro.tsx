import { AnimatePresence, motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { Backpack, Building2, Landmark, Mountain, Plane, Ship, Sparkles, Train, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { emblemUrl, fullLogoUrl } from "@/lib/presentationData";

const easeOutExpo = [0.16, 1, 0.3, 1] as const;
const landmarks = [
  { Icon: Landmark, className: "left-1/2 top-[-7%] -translate-x-1/2" }, { Icon: Building2, className: "right-[4%] top-[13%]" }, { Icon: Mountain, className: "right-[-4%] top-[48%] -translate-y-1/2" }, { Icon: Train, className: "bottom-[2%] right-[15%]" }, { Icon: Ship, className: "bottom-[-5%] left-1/2 -translate-x-1/2" }, { Icon: Backpack, className: "bottom-[5%] left-[11%]" }, { Icon: Sparkles, className: "left-[-3%] top-[43%] -translate-y-1/2" },
];
const wordmark = "WORLD TROTTER".split("");

export default function LandingIntro() {
  const reduced = useReducedMotion(); const controls = useAnimationControls(); const [visible, setVisible] = useState(false); const [handoff, setHandoff] = useState({ x: 0, y: 0, scale: 0.18 });
  const navigation = useMemo(() => performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined, []);
  useEffect(() => {
    if (location.pathname !== "/") return; if (navigation?.type === "reload") sessionStorage.removeItem("hasSeenIntro"); if (sessionStorage.getItem("hasSeenIntro")) return;
    const headerMark = document.querySelector<HTMLElement>("[data-world-trotter-header-logo]"); if (headerMark) { const rect = headerMark.getBoundingClientRect(); setHandoff({ x: rect.left + rect.width / 2 - innerWidth / 2, y: rect.top + rect.height / 2 - innerHeight / 2, scale: rect.width / 220 }); }
    setVisible(true); const finish = window.setTimeout(() => { sessionStorage.setItem("hasSeenIntro", "true"); setVisible(false); }, reduced ? 300 : 3200); requestAnimationFrame(() => { controls.start(reduced ? "reduced" : "play"); }); return () => clearTimeout(finish);
  }, [controls, navigation, reduced]);
  const dismiss = () => { sessionStorage.setItem("hasSeenIntro", "true"); setVisible(false); };
  return <AnimatePresence>{visible ? <motion.div variants={{ idle: { opacity: 1 }, play: { opacity: 0, transition: { delay: 2.7, duration: .5 } }, reduced: { opacity: 0, transition: { duration: .3 } } }} initial="idle" animate={controls} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] grid place-items-center bg-[#FAF7F2]" style={{ pointerEvents: visible ? "auto" : "none" }}>
    {!reduced && <button onClick={dismiss} className="absolute right-6 top-6 z-10 flex items-center gap-2 rounded-full border border-[var(--line)] px-4 py-2 text-xs font-bold text-[var(--navy)]"><X size={14}/>Skip intro</button>}
    <motion.div variants={{ idle: { x: 0, y: 0, scale: 1 }, play: { x: handoff.x, y: handoff.y, scale: handoff.scale, transition: { delay: 2.7, duration: .5, ease: easeOutExpo } }, reduced: { x: handoff.x, y: handoff.y, scale: handoff.scale, transition: { duration: .3, ease: easeOutExpo } } }} initial="idle" animate={controls} className="relative w-[220px] text-center" style={{ transformOrigin: "center center" }}>
      <div className="relative mx-auto h-[220px] w-[220px]">
        <motion.img variants={{ idle: { opacity: 0, scale: .6, rotate: -25 }, play: { opacity: 1, scale: 1, rotate: 0, transition: { duration: .9, ease: easeOutExpo } }, reduced: { opacity: 1, scale: 1, rotate: 0, transition: { duration: .2 } } }} initial="idle" animate={controls} src={emblemUrl} alt="World Trotter compass globe" className="h-full w-full rounded-full object-cover"/>
        <svg className="pointer-events-none absolute inset-[-9%] h-[118%] w-[118%]" viewBox="0 0 260 260" aria-hidden="true"><motion.path d="M32 150 C52 55, 182 28, 226 92 C249 127, 208 197, 126 216" fill="none" stroke="#C99233" strokeWidth="3" strokeLinecap="round" variants={{ idle: { pathLength: 0, opacity: 0 }, play: { pathLength: 1, opacity: 1, transition: { delay: .7, duration: .9, ease: "easeOut" } }, reduced: { pathLength: 1, opacity: 0 } }} initial="idle" animate={controls}/></svg>
        <motion.div variants={{ idle: { opacity: 0, x: -90, y: 55, rotate: -35 }, play: { opacity: [0, 1, 1], x: [-90, 18, 92], y: [55, -72, 36], rotate: [-35, 12, 48], transition: { delay: .7, duration: .9, ease: "easeInOut", times: [0, .55, 1] } }, reduced: { opacity: 0 } }} initial="idle" animate={controls} className="absolute left-1/2 top-1/2 z-10 text-[var(--gold)]"><Plane size={28} fill="#FAF7F2"/></motion.div>
        {landmarks.map(({ Icon, className }, index) => <motion.span key={index} variants={{ idle: { opacity: 0, scale: .5 }, play: { opacity: 1, scale: 1, transition: { delay: 1.3 + index * .08, duration: .12, ease: easeOutExpo } }, reduced: { opacity: 0 } }} initial="idle" animate={controls} className={`absolute text-[var(--gold)] ${className}`}><Icon size={20} strokeWidth={1.6}/></motion.span>)}
      </div>
      <div className="mt-6 overflow-hidden"><p aria-label="World Trotter" className="font-serif text-[34px] font-bold tracking-[.05em] text-[var(--navy)]">{wordmark.map((letter, index) => <motion.span key={`${letter}-${index}`} variants={{ idle: { opacity: 0, y: 12 }, play: { opacity: 1, y: 0, transition: { delay: 1.9 + index * .03, duration: .18, ease: easeOutExpo } }, reduced: { opacity: 0 } }} initial="idle" animate={controls} className="inline-block">{letter === " " ? " " : letter}</motion.span>)}</p></div>
      <motion.div variants={{ idle: { scaleX: 0 }, play: { scaleX: 1, transition: { delay: 2.44, duration: .2, ease: easeOutExpo } }, reduced: { scaleX: 0 } }} initial="idle" animate={controls} className="mx-auto mt-2 h-px w-40 bg-[var(--gold)]"/>
      <motion.p variants={{ idle: { opacity: 0, y: 8 }, play: { opacity: 1, y: 0, transition: { delay: 2.59, duration: .18, ease: easeOutExpo } }, reduced: { opacity: 0 } }} initial="idle" animate={controls} className="mt-2 text-[8px] font-black tracking-[.18em] text-[var(--navy)]">EXPLORE THE WORLD WITH US</motion.p>
      <motion.img variants={{ idle: { opacity: 0 }, play: { opacity: 1, transition: { delay: 2.52, duration: .18 } }, reduced: { opacity: 1, transition: { duration: .15 } } }} initial="idle" animate={controls} src={fullLogoUrl} alt="" aria-hidden="true" className="absolute left-1/2 top-[228px] w-[220px] -translate-x-1/2 rounded-xl bg-[#FAF7F2] mix-blend-multiply"/>
    </motion.div>
  </motion.div> : null}</AnimatePresence>;
}
