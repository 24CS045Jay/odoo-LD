import { useState } from "react";
import { ArrowRight, Share2, Map, List } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { tripApi } from "@/api/client";
import AppShell from "@/components/layout/AppShell";
import PageIntro from "@/components/shared/PageIntro";
import ItineraryDayBlock from "@/components/itinerary/ItineraryDayBlock";
import BudgetSummary from "@/components/itinerary/BudgetSummary";
import TripMap from "@/components/map/TripMap";
import type { StopData } from "@/components/map/StopMarker";

export default function ItineraryViewPage() {
  const tripId = localStorage.getItem("world-trotter-active-trip");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  const tripQuery = useQuery({
    queryKey: ["trip", tripId],
    queryFn: () => tripApi.get(tripId!),
    enabled: Boolean(tripId),
  });

  const budgetQuery = useQuery({
    queryKey: ["budget", tripId],
    queryFn: () => tripApi.budget(tripId!),
    enabled: Boolean(tripId),
  });

  const trip = tripQuery.data?.trip;
  const sections = tripQuery.data?.sections ?? [];

  const stopsData: StopData[] = sections.map((section, index) => ({
    _id: section._id,
    city: section.city,
    title: section.title,
    type: section.type || "sightseeing",
    startDate: section.startDate,
    endDate: section.endDate,
    budget: section.budget,
    latitude: section.latitude,
    longitude: section.longitude,
    orderIndex: section.orderIndex ?? index,
  }));

  const days = sections.map((section, index) => ({
    day: `Day ${String(index + 1).padStart(2, "0")}`,
    date: section.startDate
      ? new Date(section.startDate).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
        })
      : "Date to choose",
    city: section.city,
    theme: section.title || "A day with room to wander",
    items: section.activities?.map(activity => activity.title) ?? [
      "No activities saved yet",
    ],
    cost: new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: trip?.currency ?? "INR",
      maximumFractionDigits: 0,
    }).format(section.budget ?? 0),
  }));

  if (!tripId) {
    return (
      <AppShell>
        <section className="mx-auto max-w-[900px] px-5 py-16">
          <PageIntro
            eyebrow="Step 03 · read the full route"
            title={
              <>
                There is no active trip
                <span className="text-[var(--gold)]">.</span>
              </>
            }
            description="Open or create a trip before reviewing the itinerary."
            action={
              <Link
                href="/trips"
                className="rounded-full bg-[var(--navy)] px-5 py-3 text-sm font-extrabold text-white"
              >
                My trips
              </Link>
            }
          />
        </section>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <section className="mx-auto max-w-[1120px] px-5 py-12 lg:px-8">
        <PageIntro
          eyebrow="Step 03 · read the full route"
          title={
            <>
              {trip?.title ?? "Loading your itinerary"}
              <span className="text-[var(--gold)]">.</span>
            </>
          }
          description={
            trip?.destinations
              .map(destination => destination.city)
              .join(" · ") || "Your saved route"
          }
          action={
            <div className="flex flex-wrap items-center gap-2">
              {/* List / Map view toggle */}
              <div className="flex rounded-full border border-[var(--line)] bg-white p-1 shadow-sm">
                <button
                  onClick={() => setViewMode("list")}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
                    viewMode === "list"
                      ? "bg-[var(--navy)] text-white"
                      : "text-[var(--ink-muted)] hover:text-[var(--navy)]"
                  }`}
                >
                  <List size={14} /> List View
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
                    viewMode === "map"
                      ? "bg-[var(--navy)] text-white"
                      : "text-[var(--ink-muted)] hover:text-[var(--navy)]"
                  }`}
                >
                  <Map size={14} /> Map View
                </button>
              </div>

              <Link
                href="/budget"
                className="rounded-full border border-[var(--line)] bg-white px-4 py-3 text-sm font-extrabold text-[var(--navy)]"
              >
                Budget
              </Link>
              <Link
                href="/shared/mediterranean"
                className="inline-flex items-center gap-2 rounded-full bg-[var(--navy)] px-4 py-3 text-sm font-extrabold text-white"
              >
                <Share2 size={15} />
                Share
              </Link>
            </div>
          }
        />

        {viewMode === "map" ? (
          <div className="mt-8">
            <TripMap
              stops={stopsData}
              editable={false}
              currency={trip?.currency ?? "INR"}
              showSearch={false}
              showReorder={false}
              showSummary={true}
              showNearbyActivities={false}
            />
          </div>
        ) : (
          <div className="mt-10 grid gap-7 lg:grid-cols-[1fr_300px]">
            <div className="space-y-4">
              {tripQuery.isLoading ? (
                <div className="h-72 animate-pulse rounded-[26px] bg-[var(--sand)]" />
              ) : days.length ? (
                days.map((entry, index) => (
                  <ItineraryDayBlock
                    key={entry.day}
                    entry={entry}
                    index={index}
                  />
                ))
              ) : (
                <div className="rounded-[26px] border border-[var(--line)] bg-white p-7">
                  <p className="font-serif text-3xl font-bold text-[var(--navy)]">
                    The route is still open.
                  </p>
                  <Link
                    href="/itinerary-builder"
                    className="mt-4 inline-block text-sm font-extrabold text-[var(--navy)]"
                  >
                    Add itinerary days →
                  </Link>
                </div>
              )}
            </div>
            <BudgetSummary budget={budgetQuery.data} currency={trip?.currency} />
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <Link
            href="/calendar"
            className="inline-flex items-center gap-2 text-sm font-extrabold text-[var(--navy)]"
          >
            See this route on the calendar <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </AppShell>
  );
}
