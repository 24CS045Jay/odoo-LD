// World Trotter — cinematic entry animation. No image dependencies, pure motion.
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

// Floating destination pills
const destinations = [
  { label: "Jaipur, India", delay: 0.6, x: -160, y: -90 },
  { label: "Leh, Ladakh", delay: 0.75, x: 150, y: -70 },
  { label: "Udaipur", delay: 0.9, x: -180, y: 30 },
  { label: "Kerala Backwaters", delay: 1.05, x: 140, y: 50 },
  { label: "Hampi", delay: 1.2, x: -80, y: 110 },
  { label: "Golden Temple", delay: 1.35, x: 100, y: 100 },
];

// Animated compass SVG paths
function CompassRose({ progress }: { progress: number }) {
  return (
    <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" aria-hidden>
      {/* Outer ring */}
      <motion.circle
        cx="100" cy="100" r="88"
        fill="none" stroke="var(--gold)" strokeWidth="1"
        strokeDasharray="553"
        strokeDashoffset={553 - 553 * progress}
        strokeLinecap="round"
        opacity={0.4}
      />
      {/* Inner ring */}
      <motion.circle
        cx="100" cy="100" r="68"
        fill="none" stroke="var(--gold)" strokeWidth="0.5"
        strokeDasharray="427"
        strokeDashoffset={427 - 427 * progress}
        opacity={0.25}
      />
      {/* Cardinal tick marks */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const r1 = 76, r2 = angle % 90 === 0 ? 68 : 72;
        return (
          <motion.line
            key={angle}
            x1={100 + r1 * Math.sin(rad)} y1={100 - r1 * Math.cos(rad)}
            x2={100 + r2 * Math.sin(rad)} y2={100 - r2 * Math.cos(rad)}
            stroke="var(--gold)" strokeWidth={angle % 90 === 0 ? 1.5 : 0.75}
            opacity={progress > 0.5 ? progress : 0}
          />
        );
      })}
      {/* Compass needle — N */}
      <motion.polygon
        points="100,22 95,100 100,92 105,100"
        fill="var(--navy)"
        opacity={progress > 0.7 ? 1 : 0}
      />
      {/* Compass needle — S */}
      <motion.polygon
        points="100,178 95,100 100,108 105,100"
        fill="var(--gold)"
        opacity={progress > 0.7 ? 1 : 0}
      />
      {/* Center dot */}
      <motion.circle
        cx="100" cy="100" r="4"
        fill="var(--navy)"
        opacity={progress > 0.7 ? 1 : 0}
      />
    </svg>
  );
}

// Dashed orbit ring that spins
function OrbitRing({ radius, duration, opacity = 0.3 }: { radius: number; duration: number; opacity?: number }) {
  return (
    <motion.div
      className="absolute inset-0 m-auto rounded-full border border-dashed border-[var(--gold)]"
      style={{ width: radius * 2, height: radius * 2, top: `calc(50% - ${radius}px)`, left: `calc(50% - ${radius}px)` }}
      animate={{ rotate: 360 }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
      initial={{ opacity: 0 }}
    />
  );
}

export default function LandingIntro() {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState(0); // 0=hidden, 1=building, 2=hold, 3=exit

  useEffect(() => {
    if (location.pathname !== "/") return;
    if (reduced) return;
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    if (nav?.type === "reload") sessionStorage.removeItem("wt-intro");
    if (sessionStorage.getItem("wt-intro")) return;

    setVisible(true);
    setPhase(1);

    const t1 = setTimeout(() => setPhase(2), 2000);   // hold
    const t2 = setTimeout(() => setPhase(3), 3000);   // exit
    const t3 = setTimeout(() => {
      sessionStorage.setItem("wt-intro", "1");
      setVisible(false);
    }, 3600);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [reduced]);

  const dismiss = () => {
    sessionStorage.setItem("wt-intro", "1");
    setPhase(3);
    setTimeout(() => setVisible(false), 600);
  };

  const compassProgress = phase >= 1 ? 1 : 0;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.55, ease: ease } }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ background: "var(--canvas)" }}
        >
          {/* Skip button */}
          <button
            onClick={dismiss}
            className="absolute right-6 top-6 z-20 flex items-center gap-2 rounded-full border border-[var(--line)] bg-white/80 px-4 py-2 text-[12px] font-bold text-[var(--navy)] backdrop-blur-sm transition hover:border-[var(--gold)]"
          >
            <X size={13} /> Skip
          </button>

          {/* Background map grid — fades in */}
          <motion.div
            className="map-grid absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 1 ? 0.6 : 0 }}
            transition={{ duration: 1.2, ease: ease }}
          />

          {/* Radial glow behind compass */}
          <motion.div
            className="absolute rounded-full"
            style={{ width: 420, height: 420, background: "radial-gradient(circle, rgba(183,149,74,0.12) 0%, transparent 70%)" }}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: phase >= 1 ? 1 : 0.4, opacity: phase >= 1 ? 1 : 0 }}
            transition={{ duration: 1.4, ease: ease }}
          />

          {/* Orbit rings */}
          <motion.div
            className="absolute"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 1 ? 1 : 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <OrbitRing radius={148} duration={18} opacity={0.2} />
            <OrbitRing radius={110} duration={12} opacity={0.15} />
          </motion.div>

          {/* Central compass */}
          <motion.div
            className="relative flex h-[200px] w-[200px] items-center justify-center"
            initial={{ scale: 0.5, opacity: 0, rotate: -180 }}
            animate={{ scale: phase >= 1 ? 1 : 0.5, opacity: phase >= 1 ? 1 : 0, rotate: 0 }}
            transition={{ duration: 1.1, ease: ease }}
          >
            <CompassRose progress={compassProgress} />
            {/* Globe emoji center */}
            <motion.div
              className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--sand)] text-[2rem] gold-ring shadow-lg"
              initial={{ scale: 0 }}
              animate={{ scale: phase >= 1 ? 1 : 0 }}
              transition={{ delay: 0.5, duration: 0.7, ease: ease }}
            >
              🌍
            </motion.div>
          </motion.div>

          {/* Destination pills floating around */}
          {destinations.map((d, i) => (
            <motion.div
              key={d.label}
              className="absolute flex items-center gap-1.5 rounded-full border border-[var(--line)] bg-white/90 px-3 py-1.5 text-[12px] font-semibold text-[var(--navy)] shadow-sm backdrop-blur-sm"
              style={{ top: "50%", left: "50%", translateX: "-50%", translateY: "-50%" }}
              initial={{ opacity: 0, x: 0, y: 0, scale: 0.6 }}
              animate={phase >= 1 ? {
                opacity: [0, 1, 1, 0.8],
                x: d.x,
                y: d.y,
                scale: 1,
                transition: { delay: d.delay, duration: 0.7, ease: ease }
              } : { opacity: 0 }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--gold)]" />
              {d.label}
            </motion.div>
          ))}

          {/* Word mark — letter by letter */}
          <motion.div
            className="absolute bottom-[22%] flex flex-col items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 1 ? 1 : 0 }}
            transition={{ delay: 1.5, duration: 0.4 }}
          >
            <div className="flex items-center gap-0.5 overflow-hidden">
              {"WORLD TROTTER".split("").map((ch, i) => (
                <motion.span
                  key={i}
                  className={`font-serif text-[2rem] font-bold tracking-[.04em] text-[var(--navy)] ${ch === " " ? "w-3" : ""}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : 20 }}
                  transition={{ delay: 1.5 + i * 0.04, duration: 0.35, ease: ease }}
                >
                  {ch}
                </motion.span>
              ))}
            </div>

            {/* Gold divider line */}
            <motion.div
              className="h-px bg-[var(--gold)]"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: phase >= 1 ? 1 : 0 }}
              transition={{ delay: 2.1, duration: 0.4, ease: ease }}
              style={{ width: 180, transformOrigin: "center" }}
            />

            {/* Tagline */}
            <motion.p
              className="text-[10px] font-extrabold uppercase tracking-[.22em] text-[var(--ink-muted)]"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: phase >= 1 ? 1 : 0, y: phase >= 1 ? 0 : 6 }}
              transition={{ delay: 2.25, duration: 0.3, ease: ease }}
            >
              Explore the World with Us
            </motion.p>
          </motion.div>

          {/* Plane flying across */}
          <motion.div
            className="absolute text-[var(--gold)]"
            style={{ top: "38%", fontSize: 24 }}
            initial={{ x: "-60vw", y: 20, opacity: 0 }}
            animate={phase >= 1 ? {
              x: ["−60vw", "0vw", "60vw"],
              y: [20, -10, -30],
              opacity: [0, 1, 1, 0],
              transition: { delay: 0.4, duration: 1.6, ease: "easeInOut" }
            } : {}}
          >
            ✈️
          </motion.div>

          {/* Exit — everything slides + fades */}
          <motion.div
            className="absolute inset-0 bg-[var(--canvas)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase >= 3 ? 1 : 0 }}
            transition={{ duration: 0.55, ease: ease }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
