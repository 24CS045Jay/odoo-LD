import { useState } from "react";
import { ArrowRight, Copy, Globe2, Map, List } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useLocation, useRoute } from "wouter";
import { publicApi } from "@/api/client";
import AppShell from "@/components/layout/AppShell";
import ItineraryDayBlock from "@/components/itinerary/ItineraryDayBlock";
import TripMap from "@/components/map/TripMap";
import type { StopData } from "@/components/map/StopMarker";

export default function SharedItineraryPage() {
  const [, params] = useRoute("/shared/:shareToken");
  const [, navigate] = useLocation();
  const token = params?.shareToken ?? "";
  const [viewMode, setViewMode] = useState<"list" | "map">("list");

  const query = useQuery({
    queryKey: ["shared", token],
    queryFn: () => publicApi.getTrip(token),
    enabled: Boolean(token),
  });

  const copy = useMutation({
    mutationFn: () => publicApi.copyTrip(token),
    onSuccess: trip => {
      localStorage.setItem("world-trotter-active-trip", trip._id);
      navigate("/itinerary-builder");
    },
  });

  const trip = query.data?.trip;
  const sections = query.data?.sections ?? [];

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
    theme: section.title || "A day to explore",
    items: section.activities?.map(activity => activity.title) ?? [
      "No activities added yet",
    ],
    cost: new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: trip?.currency ?? "INR",
      maximumFractionDigits: 0,
    }).format(section.budget ?? 0),
  }));

  return (
    <AppShell>
      <section className="mx-auto max-w-[1000px] px-5 py-12 lg:px-8">
        {query.isLoading ? (
          <div className="h-72 animate-pulse rounded-[28px] bg-[var(--sand)]" />
        ) : query.isError || !trip ? (
          <div className="rounded-[28px] bg-[var(--navy)] p-8 text-white">
            <h1 className="font-serif text-5xl font-bold">
              This shared route is unavailable.
            </h1>
            <Link
              href="/community"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--gold)] px-5 py-3 text-sm font-extrabold text-[var(--navy)]"
            >
              Explore the community <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <>
            <div className="rounded-[28px] bg-[var(--navy)] p-8 text-white sm:p-12">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[.2em] text-[var(--gold)]">
                <Globe2 size={14} /> Public route · {trip.destinations[0]?.country ?? "World Trotter"}
              </div>
              <h1 className="mt-5 max-w-2xl font-serif text-5xl font-bold leading-[.93] tracking-[-.055em] sm:text-6xl">
                {trip.title}
                <span className="text-[var(--gold)]">.</span>
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-7 text-white/72">
                {trip.description || "A shared World Trotter route."}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => copy.mutate()}
                  disabled={copy.isPending}
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--gold)] px-5 py-3 text-sm font-extrabold text-[var(--navy)]"
                >
                  <Copy size={16} />
                  {copy.isPending ? "Copying…" : "Copy this route"}
                </button>
                <Link
                  href="/community"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-extrabold text-white"
                >
                  Explore more <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* List / Map view toggle */}
            <div className="mt-8 flex items-center justify-between">
              <h2 className="font-serif text-3xl font-bold text-[var(--navy)]">
                Trip Route & Itinerary
              </h2>
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
            </div>

            {viewMode === "map" ? (
              <div className="mt-6">
                <TripMap
                  stops={stopsData}
                  editable={false}
                  currency={trip.currency ?? "INR"}
                  showSearch={false}
                  showReorder={false}
                  showSummary={true}
                  showNearbyActivities={false}
                />
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {days.map((entry, index) => (
                  <ItineraryDayBlock key={entry.day} entry={entry} index={index} />
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </AppShell>
  );
}
