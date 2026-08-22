import { Link } from "wouter";
import { motion } from "framer-motion";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { tripApi } from "@/api/client";
import { tripCard } from "@/api/viewModels";
import { useAuth } from "@/_core/hooks/useAuth";
import AppShell from "@/components/layout/AppShell";
import PageIntro from "@/components/shared/PageIntro";
import FilterBar from "@/components/shared/FilterBar";
import TripCard from "@/components/trips/TripCard";
const tabs = ["Ongoing", "Upcoming", "Completed"] as const;
export default function MyTripsPage() {
  const { isAuthenticated } = useAuth();
  const [active, setActive] = useState<(typeof tabs)[number]>("Ongoing");
  const tripQuery = useQuery({
    queryKey: ["trips"],
    queryFn: tripApi.list,
    enabled: isAuthenticated,
  });
  const visibleTrips = (tripQuery.data?.items ?? []).filter(trip =>
    active === "Ongoing"
      ? !["completed", "upcoming"].includes(trip.status)
      : trip.status === active.toLowerCase()
  );
  return (
    <AppShell>
      <section className="mx-auto max-w-[1240px] px-5 py-12 lg:px-8">
        <PageIntro
          eyebrow="Your travel journal"
          title={
            <>
              My trips<span className="text-[var(--gold)]">.</span>
            </>
          }
          description="A neat record of the places you are building toward and the stories you have already started."
          action={
            <Link
              href="/trips/new"
              className="rounded-full bg-[var(--navy)] px-5 py-3 text-sm font-extrabold text-white"
            >
              Plan a journey
            </Link>
          }
        />
        <div className="mt-8 flex flex-wrap gap-2 rounded-full border border-[var(--line)] bg-white p-1.5 w-fit">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`relative rounded-full px-4 py-2 text-xs font-extrabold ${active === tab ? "text-white" : "text-[var(--ink-muted)]"}`}
            >
              {active === tab ? (
                <motion.span
                  layoutId="activeTabIndicator"
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  className="absolute inset-0 rounded-full bg-[var(--navy)]"
                />
              ) : null}
              <span className="relative z-10">{tab}</span>
            </button>
          ))}
        </div>
        <div className="mt-5">
          <FilterBar label="Sort your stories" />
        </div>
        {!isAuthenticated ? (
          <div className="mt-7 rounded-[26px] bg-[var(--sand)] p-8">
            <p className="font-serif text-3xl font-bold text-[var(--navy)]">
              Sign in to open your saved travel journal.
            </p>
            <Link
              href="/login"
              className="mt-5 inline-block text-sm font-extrabold text-[var(--navy)]"
            >
              Go to sign in →
            </Link>
          </div>
        ) : tripQuery.isLoading ? (
          <div className="mt-7 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map(key => (
              <div
                key={key}
                className="h-80 animate-pulse rounded-[25px] bg-[var(--sand)]"
              />
            ))}
          </div>
        ) : visibleTrips.length ? (
          <div className="mt-7 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visibleTrips.map(trip => (
              <TripCard key={trip._id} trip={tripCard(trip)} />
            ))}
          </div>
        ) : (
          <div className="mt-7 rounded-[26px] border border-[var(--line)] bg-white p-8">
            <p className="font-serif text-3xl font-bold text-[var(--navy)]">
              No {active.toLowerCase()} trips yet.
            </p>
            <Link
              href="/trips/new"
              className="mt-5 inline-block text-sm font-extrabold text-[var(--navy)]"
            >
              Plan a journey →
            </Link>
          </div>
        )}
      </section>
    </AppShell>
  );
}
