import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, CalendarDays, MapPin, ExternalLink, X, Compass, DollarSign, Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import AppShell from "@/components/layout/AppShell";
import PageIntro from "@/components/shared/PageIntro";
import { tripApi, type ApiCalendarEvent } from "@/api/client";

interface ExtendedCalendarEvent extends ApiCalendarEvent {
  _id?: string;
  budget?: number;
  currency?: string;
  destinations?: { city: string; country?: string; image?: string }[];
}

export default function CalendarPage() {
  const [, navigate] = useLocation();
  const [view, setView] = useState(() => new Date());
  const [direction, setDirection] = useState(1);
  const [selectedDayEvents, setSelectedDayEvents] = useState<{ day: number; events: ExtendedCalendarEvent[] } | null>(null);

  const { data: events = [], isLoading } = useQuery<ExtendedCalendarEvent[]>({
    queryKey: ["calendar", view.getFullYear(), view.getMonth()],
    queryFn: () => tripApi.calendar(view.getMonth() + 1, view.getFullYear()) as Promise<ExtendedCalendarEvent[]>,
  });

  const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, index) => index + 1);
  const lead = (new Date(view.getFullYear(), view.getMonth(), 1).getDay() + 6) % 7;
  const title = view.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === view.getFullYear() && today.getMonth() === view.getMonth();
  const todayDate = isCurrentMonth ? today.getDate() : -1;

  const getEventsForDay = (day: number): ExtendedCalendarEvent[] => {
    const current = new Date(view.getFullYear(), view.getMonth(), day).getTime();
    return events.filter(event => {
      if (!event.startDate || !event.endDate) return false;
      const start = new Date(event.startDate).setHours(0, 0, 0, 0);
      const end = new Date(event.endDate).setHours(23, 59, 59, 999);
      return current >= start && current <= end;
    });
  };

  const move = (amount: number) => {
    setDirection(amount);
    setView(current => new Date(current.getFullYear(), current.getMonth() + amount, 1));
    setSelectedDayEvents(null);
  };

  const next = events[0];

  return (
    <AppShell>
      <section className="mx-auto max-w-[1120px] px-5 py-12 lg:px-8">
        <PageIntro
          eyebrow="See the shape of your year"
          title={
            <>
              Visual Travel Calendar<span className="text-[var(--gold)]">.</span>
            </>
          }
          description="Every saved journey, visual itinerary, and upcoming stop in a mosaic calendar."
        />

        <div className="mt-10 grid gap-7 lg:grid-cols-[1.35fr_.65fr]">
          <article className="rounded-[28px] border border-[var(--line)] bg-white p-6 sm:p-7">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-3xl font-bold text-[var(--navy)]">
                {title}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => move(-1)}
                  aria-label="Previous month"
                  className="rounded-full border border-[var(--line)] p-2 text-[var(--navy)] hover:bg-[var(--sand)]"
                >
                  <ArrowLeft size={16} />
                </button>
                <button
                  onClick={() => move(1)}
                  aria-label="Next month"
                  className="rounded-full border border-[var(--line)] p-2 text-[var(--navy)] hover:bg-[var(--sand)]"
                >
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>

            <div className="mt-7 grid grid-cols-7 gap-2 text-center text-[10px] font-black uppercase tracking-[.14em] text-[var(--ink-muted)]">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(d => (
                <span key={d}>{d}</span>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${view.getFullYear()}-${view.getMonth()}`}
                initial={{ x: direction * 40, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: direction * -40, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="mt-3 grid grid-cols-7 gap-2"
              >
                {Array.from({ length: lead }, (_, index) => (
                  <div key={`blank-${index}`} className="aspect-square min-h-[56px] rounded-xl bg-transparent sm:min-h-[72px]" />
                ))}

                {days.map(day => {
                  const dayEvents = getEventsForDay(day);
                  const isToday = day === todayDate;
                  const isSelected = selectedDayEvents?.day === day;
                  const primaryEvent = dayEvents[0];

                  const cellAriaLabel = `Day ${day}, ${title}${
                    dayEvents.length > 0
                      ? `. Trips: ${dayEvents.map(e => e.title).join(", ")}`
                      : ""
                  }`;

                  return (
                    <button
                      key={day}
                      onClick={() => {
                        if (dayEvents.length > 0) {
                          setSelectedDayEvents({ day, events: dayEvents });
                        } else {
                          setSelectedDayEvents(null);
                        }
                      }}
                      aria-label={cellAriaLabel}
                      className={`group relative flex aspect-square min-h-[56px] flex-col justify-between overflow-hidden rounded-2xl p-1.5 text-left transition-all sm:min-h-[72px] sm:p-2 ${
                        isToday ? "ring-2 ring-[var(--gold)] ring-offset-2" : ""
                      } ${isSelected ? "ring-2 ring-[var(--navy)]" : ""} ${
                        dayEvents.length === 0
                          ? "bg-[var(--canvas)] text-[var(--ink)] hover:bg-[var(--sand)]"
                          : "text-white shadow-sm"
                      }`}
                    >
                      {/* Background image / placeholder for cells with trips */}
                      {dayEvents.length === 1 && (
                        <>
                          {primaryEvent.coverImageUrl ? (
                            <img
                              src={primaryEvent.coverImageUrl}
                              alt=""
                              loading="lazy"
                              className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-[var(--navy)] to-[var(--navy-soft)]" />
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                        </>
                      )}

                      {/* Multi-trip stacked cluster */}
                      {dayEvents.length > 1 && (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-br from-[var(--navy)] via-[var(--navy-soft)] to-[var(--sand-dark)]" />
                          <div className="absolute inset-0 bg-black/40" />
                          <div className="absolute inset-x-1.5 bottom-1.5 flex -space-x-2">
                            {dayEvents.slice(0, 3).map((e, idx) => (
                              <div
                                key={idx}
                                className="h-5 w-5 overflow-hidden rounded-full border border-white bg-[var(--gold)] shadow-sm sm:h-6 sm:w-6"
                              >
                                {e.coverImageUrl ? (
                                  <img
                                    src={e.coverImageUrl}
                                    alt=""
                                    loading="lazy"
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <span className="flex h-full w-full items-center justify-center text-[9px] font-bold text-white">
                                    {e.title.slice(0, 1)}
                                  </span>
                                )}
                              </div>
                            ))}
                            {dayEvents.length > 3 && (
                              <div className="flex h-5 w-5 items-center justify-center rounded-full border border-white bg-[var(--navy)] text-[8px] font-black text-white sm:h-6 sm:w-6 sm:text-[9px]">
                                +{dayEvents.length - 3}
                              </div>
                            )}
                          </div>
                        </>
                      )}

                      {/* Day Number Badge */}
                      <span
                        className={`relative z-10 flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-extrabold sm:h-6 sm:w-6 sm:text-xs ${
                          dayEvents.length > 0
                            ? "bg-black/40 text-white backdrop-blur-xs"
                            : isToday
                              ? "bg-[var(--gold)] text-white"
                              : "text-[var(--ink)]"
                        }`}
                      >
                        {day}
                      </span>

                      {/* Single trip title */}
                      {dayEvents.length === 1 && (
                        <p className="relative z-10 hidden truncate text-[10px] font-extrabold leading-tight text-white/95 drop-shadow sm:block">
                          {primaryEvent.title}
                        </p>
                      )}
                    </button>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </article>

          {/* Sidebar / Popover Card */}
          <aside className="space-y-4">
            {selectedDayEvents ? (
              <div className="rounded-[28px] border border-[var(--gold)] bg-white p-6 shadow-md">
                <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[.18em] text-[var(--gold)]">
                      Day {selectedDayEvents.day} {title}
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-[var(--navy)]">
                      {selectedDayEvents.events.length} {selectedDayEvents.events.length === 1 ? "Trip" : "Trips"} Planned
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedDayEvents(null)}
                    className="rounded-full p-1.5 text-[var(--ink-muted)] hover:bg-[var(--sand)]"
                  >
                    <X size={16} />
                  </button>
                </div>

                <div className="mt-4 space-y-4">
                  {selectedDayEvents.events.map(event => {
                    const id = event.id || event._id;
                    return (
                      <div
                        key={id}
                        className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--canvas)] p-3 transition-colors hover:border-[var(--gold)]"
                      >
                        {event.coverImageUrl && (
                          <div className="mb-3 h-28 overflow-hidden rounded-xl bg-[var(--sand)]">
                            <img
                              src={event.coverImageUrl}
                              alt={event.title}
                              loading="lazy"
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                        <h4 className="font-serif text-lg font-bold text-[var(--navy)]">
                          {event.title}
                        </h4>
                        <div className="mt-2 space-y-1 text-xs text-[var(--ink-muted)]">
                          <p className="flex items-center gap-1.5">
                            <CalendarIcon size={13} className="text-[var(--gold)]" />
                            {new Date(event.startDate!).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                            })}{" "}
                            –{" "}
                            {new Date(event.endDate!).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                            })}
                          </p>
                          {event.budget != null && (
                            <p className="flex items-center gap-1.5 font-bold text-[var(--navy)]">
                              <DollarSign size={13} className="text-[var(--gold)]" />
                              Budget: ₹{event.budget.toLocaleString()}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => {
                            if (id) {
                              localStorage.setItem("world-trotter-active-trip", id);
                              navigate("/itinerary-view");
                            }
                          }}
                          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[var(--navy)] px-3 py-2 text-xs font-extrabold text-white transition-transform hover:scale-[1.02]"
                        >
                          View Itinerary <ExternalLink size={13} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="rounded-[28px] bg-[var(--sand)] p-7">
                <CalendarDays className="text-[var(--gold)]" />
                <p className="mt-5 text-[10px] font-black uppercase tracking-[.18em] text-[var(--gold)]">
                  Next up in your journey
                </p>
                {isLoading ? (
                  <div className="mt-4 h-32 animate-pulse rounded-2xl bg-white/60" />
                ) : next ? (
                  <div>
                    {next.coverImageUrl && (
                      <div className="mt-3 h-32 overflow-hidden rounded-2xl">
                        <img
                          src={next.coverImageUrl}
                          alt={next.title}
                          loading="lazy"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <h2 className="mt-3 font-serif text-3xl font-bold text-[var(--navy)]">
                      {next.title}
                    </h2>
                    <p className="mt-2 text-sm text-[var(--ink-muted)]">
                      {next.startDate
                        ? new Date(next.startDate).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "Dates to be decided"}
                    </p>
                    <div className="my-6 h-px bg-[var(--sand-dark)]" />
                    <div className="space-y-3 text-sm font-semibold text-[var(--ink-muted)]">
                      <p className="flex items-center gap-3">
                        <MapPin size={16} className="text-[var(--gold)]" />
                        Saved in your World Trotter journal
                      </p>
                      <p className="flex items-center gap-3">
                        <span className="text-[var(--gold)]">✦</span>
                        {next.status} status
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        const id = next.id || next._id;
                        if (id) {
                          localStorage.setItem("world-trotter-active-trip", id);
                          navigate("/itinerary-view");
                        }
                      }}
                      className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[var(--navy)] px-4 py-2.5 text-xs font-extrabold text-white"
                    >
                      Open Itinerary <ArrowRight size={14} />
                    </button>
                  </div>
                ) : (
                  <p className="mt-3 text-sm leading-6 text-[var(--ink-muted)]">
                    No saved trip touches this month yet. Tap any date above or create a route to see it here.
                  </p>
                )}
              </div>
            )}
          </aside>
        </div>
      </section>
    </AppShell>
  );
}
