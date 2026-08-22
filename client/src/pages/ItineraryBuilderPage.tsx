import { useState } from "react";
import { ArrowRight, Plus, Route, Map, List, Edit3, Trash2, Calendar, DollarSign, X } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { tripApi, discoveryApi, type ApiSection } from "@/api/client";
import AppShell from "@/components/layout/AppShell";
import PageIntro from "@/components/shared/PageIntro";
import ItineraryDayBlock from "@/components/itinerary/ItineraryDayBlock";
import TripMap from "@/components/map/TripMap";
import type { StopData } from "@/components/map/StopMarker";

export default function ItineraryBuilderPage() {
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();
  const tripId = localStorage.getItem("world-trotter-active-trip");

  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [editingSection, setEditingSection] = useState<ApiSection | null>(null);
  const [editingForm, setEditingForm] = useState<{
    city: string;
    title: string;
    type: string;
    startDate: string;
    endDate: string;
    budget: number;
    latitude?: number;
    longitude?: number;
  }>({
    city: "",
    title: "",
    type: "sightseeing",
    startDate: "",
    endDate: "",
    budget: 0,
  });

  const tripQuery = useQuery({
    queryKey: ["trip", tripId],
    queryFn: () => tripApi.get(tripId!),
    enabled: Boolean(tripId),
  });

  const activitiesQuery = useQuery({
    queryKey: ["discovery", "activities"],
    queryFn: () => discoveryApi.activities(),
  });

  const addDay = useMutation({
    mutationFn: (custom?: Partial<ApiSection>) =>
      tripApi.createSection(tripId!, {
        city: custom?.city || "A new stop",
        title: custom?.title || "A day with room to wander",
        type: custom?.type || "sightseeing",
        latitude: custom?.latitude,
        longitude: custom?.longitude,
        orderIndex: tripQuery.data?.sections.length ?? 0,
      }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["trip", tripId] }),
  });

  const updateSectionMutation = useMutation({
    mutationFn: ({ sectionId, data }: { sectionId: string; data: Partial<ApiSection> }) =>
      tripApi.updateSection(tripId!, sectionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trip", tripId] });
      setEditingSection(null);
    },
  });

  const deleteSectionMutation = useMutation({
    mutationFn: (sectionId: string) =>
      tripApi.deleteSection(tripId!, sectionId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["trip", tripId] }),
  });

  const reorderSectionsMutation = useMutation({
    mutationFn: (sectionIds: string[]) =>
      tripApi.reorderSections(tripId!, sectionIds),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["trip", tripId] }),
  });

  if (!tripId) {
    return (
      <AppShell>
        <section className="mx-auto max-w-[900px] px-5 py-16">
          <PageIntro
            eyebrow="Step 02 · shape the days"
            title={
              <>
                Choose a trip to begin
                <span className="text-[var(--gold)]">.</span>
              </>
            }
            description="Create a trip first, then you can add days and real itinerary details here."
            action={
              <Link
                href="/trips/new"
                className="rounded-full bg-[var(--navy)] px-5 py-3 text-sm font-extrabold text-white"
              >
                Create a trip
              </Link>
            }
          />
        </section>
      </AppShell>
    );
  }

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

  const entries = sections.map((section, index) => ({
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

  const handleOpenEdit = (stop: StopData | ApiSection) => {
    const raw = sections.find(s => s._id === stop._id) || (stop as ApiSection);
    setEditingSection(raw);
    setEditingForm({
      city: raw.city || "",
      title: raw.title || "",
      type: raw.type || "sightseeing",
      startDate: raw.startDate ? raw.startDate.slice(0, 10) : "",
      endDate: raw.endDate ? raw.endDate.slice(0, 10) : "",
      budget: raw.budget ?? 0,
      latitude: raw.latitude,
      longitude: raw.longitude,
    });
  };

  return (
    <AppShell>
      <section className="mx-auto max-w-[1120px] px-5 py-12 lg:px-8">
        <PageIntro
          eyebrow="Step 02 · shape the days"
          title={
            <>
              Build a rhythm you want to remember
              <span className="text-[var(--gold)]">.</span>
            </>
          }
          description="Your itinerary days are stored with this trip. Add, edit, reorder on the map, and revisit them whenever the route changes."
          action={
            <div className="flex flex-wrap items-center gap-3">
              {/* View Toggle */}
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

              <button
                onClick={() => addDay.mutate(undefined)}
                disabled={addDay.isPending}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white px-5 py-3 text-sm font-extrabold text-[var(--navy)] disabled:opacity-60"
              >
                <Plus size={16} />
                {addDay.isPending ? "Saving day…" : "Add a day"}
              </button>
            </div>
          }
        />

        {/* View content */}
        {viewMode === "map" ? (
          <div className="mt-8">
            <TripMap
              stops={stopsData}
              editable={true}
              currency={trip?.currency ?? "INR"}
              showSearch={true}
              showReorder={true}
              showSummary={true}
              showNearbyActivities={true}
              nearbyActivities={activitiesQuery.data?.items ?? []}
              onAddStop={place => {
                addDay.mutate({
                  city: place.name,
                  title: `${place.name} stop`,
                  latitude: place.latitude,
                  longitude: place.longitude,
                  type: "sightseeing",
                });
              }}
              onEditStop={stop => handleOpenEdit(stop)}
              onDeleteStop={stop => {
                if (window.confirm(`Delete stop "${stop.title || stop.city}"?`)) {
                  deleteSectionMutation.mutate(stop._id);
                }
              }}
              onViewActivities={() => navigate("/activities")}
              onReorder={newOrder => reorderSectionsMutation.mutate(newOrder)}
            />
          </div>
        ) : (
          <div className="mt-10 grid gap-7 lg:grid-cols-[1fr_300px]">
            <div className="space-y-4">
              {tripQuery.isLoading ? (
                <div className="h-72 animate-pulse rounded-[26px] bg-[var(--sand)]" />
              ) : entries.length ? (
                <AnimatePresence initial={false}>
                  {entries.map((entry, index) => {
                    const sec = sections[index];
                    return (
                      <motion.div
                        layout
                        key={sec?._id ?? entry.day}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="group relative overflow-hidden"
                      >
                        <ItineraryDayBlock entry={entry} index={index} />
                        {sec && (
                          <div className="absolute right-4 top-4 flex gap-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                            <button
                              onClick={() => handleOpenEdit(sec)}
                              className="rounded-full bg-white/90 p-2 text-[var(--navy)] shadow-sm backdrop-blur hover:bg-white"
                              title="Edit stop"
                            >
                              <Edit3 size={14} />
                            </button>
                            <button
                              onClick={() => {
                                if (window.confirm(`Delete "${sec.title || sec.city}"?`)) {
                                  deleteSectionMutation.mutate(sec._id);
                                }
                              }}
                              className="rounded-full bg-white/90 p-2 text-red-600 shadow-sm backdrop-blur hover:bg-white"
                              title="Delete stop"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              ) : (
                <div className="rounded-[26px] border border-[var(--line)] bg-white p-7">
                  <p className="font-serif text-3xl font-bold text-[var(--navy)]">
                    Give this route its first day.
                  </p>
                  <p className="mt-2 text-sm text-[var(--ink-muted)]">
                    Use “Add a day” or switch to “Map View” to search and place stops.
                  </p>
                </div>
              )}
            </div>
            <aside className="self-start rounded-[26px] bg-[var(--navy)] p-6 text-white">
              <Route className="text-[var(--gold)]" />
              <p className="mt-5 text-[10px] font-black uppercase tracking-[.18em] text-white/60">
                Route at a glance
              </p>
              <h2 className="mt-2 font-serif text-3xl font-bold">
                {trip?.title ?? "Your route"}
              </h2>
              <p className="mt-3 text-sm leading-6 text-white/70">
                {trip?.destinations
                  .map(destination => destination.city)
                  .join(" · ") || "Choose your next stop"}{" "}
                · {entries.length} saved days.
              </p>
              <button
                onClick={() => navigate("/itinerary-view")}
                className="mt-7 inline-flex items-center gap-2 rounded-full bg-[var(--gold)] px-5 py-3 text-sm font-extrabold text-[var(--navy)]"
              >
                Review the itinerary <ArrowRight size={16} />
              </button>
            </aside>
          </div>
        )}

        {/* Edit Stop Modal */}
        {editingSection && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-3xl border border-[var(--line)] bg-white p-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-4">
                <h3 className="font-serif text-2xl font-bold text-[var(--navy)]">
                  Edit Itinerary Stop
                </h3>
                <button
                  onClick={() => setEditingSection(null)}
                  className="rounded-full p-2 text-[var(--ink-muted)] hover:bg-[var(--sand)]"
                >
                  <X size={18} />
                </button>
              </div>

              <form
                onSubmit={e => {
                  e.preventDefault();
                  updateSectionMutation.mutate({
                    sectionId: editingSection._id,
                    data: {
                      city: editingForm.city,
                      title: editingForm.title,
                      type: editingForm.type,
                      startDate: editingForm.startDate ? new Date(editingForm.startDate).toISOString() : undefined,
                      endDate: editingForm.endDate ? new Date(editingForm.endDate).toISOString() : undefined,
                      budget: Number(editingForm.budget) || 0,
                      latitude: editingForm.latitude,
                      longitude: editingForm.longitude,
                    },
                  });
                }}
                className="mt-4 space-y-4"
              >
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)]">
                    City / Location
                  </label>
                  <input
                    value={editingForm.city}
                    onChange={e => setEditingForm({ ...editingForm, city: e.target.value })}
                    required
                    className="mt-1 w-full rounded-xl border border-[var(--line)] px-3 py-2 text-sm font-semibold text-[var(--navy)] outline-none focus:border-[var(--gold)]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)]">
                    Stop Title / Theme
                  </label>
                  <input
                    value={editingForm.title}
                    onChange={e => setEditingForm({ ...editingForm, title: e.target.value })}
                    placeholder="e.g. Amber Fort & heritage walk"
                    className="mt-1 w-full rounded-xl border border-[var(--line)] px-3 py-2 text-sm font-semibold text-[var(--navy)] outline-none focus:border-[var(--gold)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)]">
                      Stop Type
                    </label>
                    <select
                      value={editingForm.type}
                      onChange={e => setEditingForm({ ...editingForm, type: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-[var(--line)] px-3 py-2 text-sm font-semibold text-[var(--navy)] outline-none focus:border-[var(--gold)]"
                    >
                      <option value="sightseeing">Sightseeing</option>
                      <option value="travel">Travel</option>
                      <option value="hotel">Hotel</option>
                      <option value="activity">Activity</option>
                      <option value="food">Food</option>
                      <option value="transportation">Transportation</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)]">
                      Budget (₹)
                    </label>
                    <input
                      type="number"
                      value={editingForm.budget}
                      onChange={e => setEditingForm({ ...editingForm, budget: Number(e.target.value) })}
                      min={0}
                      className="mt-1 w-full rounded-xl border border-[var(--line)] px-3 py-2 text-sm font-semibold text-[var(--navy)] outline-none focus:border-[var(--gold)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)]">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={editingForm.startDate}
                      onChange={e => setEditingForm({ ...editingForm, startDate: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-[var(--line)] px-3 py-2 text-sm font-semibold text-[var(--navy)] outline-none focus:border-[var(--gold)]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)]">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={editingForm.endDate}
                      onChange={e => setEditingForm({ ...editingForm, endDate: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-[var(--line)] px-3 py-2 text-sm font-semibold text-[var(--navy)] outline-none focus:border-[var(--gold)]"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditingSection(null)}
                    className="rounded-xl border border-[var(--line)] px-4 py-2 text-sm font-bold text-[var(--navy)]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updateSectionMutation.isPending}
                    className="rounded-xl bg-[var(--navy)] px-5 py-2 text-sm font-extrabold text-white disabled:opacity-60"
                  >
                    {updateSectionMutation.isPending ? "Saving…" : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </AppShell>
  );
}
