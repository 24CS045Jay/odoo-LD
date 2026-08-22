import { ArrowRight, Compass, MapPin, Search } from "lucide-react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import AppShell from "@/components/layout/AppShell";
import PageContainer from "@/components/layout/PageContainer";
import LandingIntro from "@/components/animations/LandingIntro";
import AppImage from "@/components/shared/AppImage";
import TripCard from "@/components/trips/TripCard";
import { heroUrl, regions, trips } from "@/lib/presentationData";
export default function Home() {
  const [, navigate] = useLocation();
  return (
    <AppShell>
      <LandingIntro />
      <section className="pb-12 pt-8 lg:pt-12">
        <PageContainer>
        <div className="relative min-h-[460px] overflow-hidden rounded-[32px] bg-[var(--navy)] shadow-xl shadow-[rgba(23,49,74,.16)] lg:min-h-[560px] xl:min-h-[620px]">
          <AppImage
            src={heroUrl}
            alt="Rajasthan fort in warm afternoon light"
            className="h-full w-full object-cover opacity-70"
            containerClassName="absolute inset-0"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[rgba(23,49,74,.96)] via-[rgba(23,49,74,.63)] to-[rgba(23,49,74,.08)]" />
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.42 }}
            className="relative flex min-h-[460px] max-w-2xl flex-col justify-center p-8 text-white sm:p-14 lg:min-h-[560px] lg:max-w-3xl lg:p-16 xl:min-h-[620px] xl:max-w-4xl xl:p-20"
          >
            <p className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[.23em] text-[var(--gold)]">
              <span className="h-px w-9 bg-[var(--gold)]" />
              India, then the world
            </p>
            <h1 className="mt-6 font-serif text-[clamp(3.7rem,8vw,6.7rem)] font-bold leading-[.86] tracking-[-.065em]">
              A good story starts with a place
              <span className="text-[var(--gold)]">.</span>
            </h1>
            <p className="mt-7 max-w-md text-[15px] leading-7 text-white/78">
              Bring your scattered ideas, save the moments that matter, and make
              room for the unexpected.
            </p>
            <form
              onSubmit={event => {
                event.preventDefault();
                navigate("/cities");
              }}
              className="mt-9 flex max-w-xl items-center gap-3 rounded-2xl bg-[var(--canvas)] p-2 shadow-2xl"
            >
              <Search size={20} className="ml-3 text-[var(--gold)]" />
              <input
                aria-label="Search Indian destinations and activities"
                placeholder="Search places, states, activities..."
                className="min-w-0 flex-1 bg-transparent px-1 py-3 text-sm font-semibold text-[var(--navy)] outline-none"
              />
              <button className="rounded-xl bg-[var(--navy)] px-5 py-3 text-sm font-extrabold text-white">
                Explore
              </button>
            </form>
          </motion.div>
          <div className="absolute bottom-7 right-7 hidden rounded-2xl border border-white/15 bg-[rgba(255,253,249,.12)] px-4 py-3 text-white backdrop-blur-sm md:block">
            <p className="text-[9px] font-black uppercase tracking-[.18em] text-white/60">
              At the horizon
            </p>
            <p className="mt-1 flex items-center gap-2 text-sm font-bold">
              <MapPin size={14} className="text-[var(--gold)]" />
              Forts, hills, and slow waters
            </p>
          </div>
        </div>
        </PageContainer>
      </section>
      <section className="desktop-section">
        <PageContainer>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[.2em] text-[var(--gold)]">
              Choose a direction
            </p>
            <h2 className="mt-3 font-serif text-4xl font-bold tracking-[-.05em] text-[var(--navy)] sm:text-5xl xl:text-6xl">
              India keeps a different time in every region
              <span className="text-[var(--gold)]">.</span>
            </h2>
          </div>
          <Link
            href="/cities"
            className="inline-flex items-center gap-2 text-sm font-extrabold text-[var(--navy)]"
          >
            See all destinations <ArrowRight size={16} />
          </Link>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {regions.map((region, index) => (
            <motion.article
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{
                y: -6,
                scale: 1.02,
                boxShadow: "0 12px 24px rgba(0,0,0,0.12)",
              }}
              viewport={{ once: true }}
              transition={{
                delay: index * 0.06,
                duration: 0.25,
                ease: "easeOut",
              }}
              key={region.name}
              className="overflow-hidden rounded-[25px] border border-[var(--line)] bg-white"
            >
              <div className="relative h-52 overflow-hidden">
                <motion.div
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="h-full w-full object-cover"
                >
                  <AppImage src={region.image} alt={region.name} containerClassName="h-full w-full" />
                </motion.div>
                <span className="absolute left-4 top-4 rounded-full bg-[color:var(--canvas)]/95 px-3 py-1.5 text-[10px] font-black uppercase tracking-[.14em] text-[var(--navy)]">
                  {region.mood}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-serif text-2xl font-bold text-[var(--navy)]">
                  {region.name}
                </h3>
                <p className="mt-2 text-sm text-[var(--ink-muted)]">
                  {region.places}
                </p>
                <div className="mt-5 flex items-center justify-between border-t border-[var(--line)] pt-4 text-xs font-bold">
                  <span className="text-[var(--ink-muted)]">{region.cost}</span>
                  <Link href="/cities" className="text-[var(--navy)]">
                    {region.routes} routes{" "}
                    <ArrowRight className="ml-1 inline" size={14} />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
        </PageContainer>
      </section>
      <section className="pb-16 pt-8">
        <PageContainer>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[.2em] text-[var(--gold)]">
              A travel journal in progress
            </p>
            <h2 className="mt-3 font-serif text-4xl font-bold tracking-[-.05em] text-[var(--navy)] sm:text-5xl xl:text-6xl">
              Keep the good ideas moving
              <span className="text-[var(--gold)]">.</span>
            </h2>
          </div>
          <Link href="/trips" className="text-sm font-extrabold text-[var(--navy)]">
            Open my trips <ArrowRight className="ml-1 inline" size={15} />
          </Link>
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-[1.3fr_.7fr]">
          <TripCard trip={trips[0]} />
          <Link
            href="/trips/new"
            className="group map-grid flex min-h-[310px] flex-col justify-between rounded-[26px] border border-[var(--sand-dark)] bg-[var(--sand)] p-7"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--canvas)] text-[var(--gold)] shadow-sm">
              <Compass size={22} />
            </span>
            <div>
              <h3 className="font-serif text-3xl font-bold text-[var(--navy)]">
                Start with a feeling.
              </h3>
              <p className="mt-3 max-w-sm text-sm leading-6 text-[var(--ink-muted)]">
                Turn a passing thought into the first page of your next journey.
              </p>
              <span className="mt-7 inline-flex items-center gap-2 text-sm font-extrabold text-[var(--navy)]">
                Plan a journey <ArrowRight size={16} />
              </span>
            </div>
          </Link>
        </div>
        </PageContainer>
      </section>
    </AppShell>
  );
}
