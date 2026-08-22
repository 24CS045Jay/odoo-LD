// World Trotter trip creation now persists the opening route directly to MongoDB.
import { ArrowRight, CalendarDays, Compass, MapPin } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { ApiClientError, tripApi } from "@/api/client";
import AppShell from "@/components/layout/AppShell";
import PageIntro from "@/components/shared/PageIntro";
const fieldClass =
  "w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3.5 text-sm font-semibold text-[var(--navy)] outline-none focus:border-[var(--gold)]";
export default function CreateTripPage() {
  const [, navigate] = useLocation();
  const [form, setForm] = useState({
    title: "",
    city: "",
    mood: "Slow and cultural",
    startDate: "",
    endDate: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const set =
    (field: keyof typeof form) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) =>
      setForm(current => ({ ...current, [field]: event.target.value }));
  const create = async (event: React.FormEvent) => {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const [city, country] = form.city.split(",").map(value => value.trim());
      const trip = await tripApi.create({
        title: form.title,
        description: `${form.mood}. ${form.description}`.trim(),
        destinations: [{ city, country }],
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
        status: "planning",
        budget: 0,
        currency: "EUR",
      });
      localStorage.setItem("world-trotter-active-trip", trip._id);
      navigate("/itinerary-builder");
    } catch (cause) {
      setError(
        cause instanceof ApiClientError
          ? cause.message
          : "Your journey could not be saved."
      );
    } finally {
      setPending(false);
    }
  };
  return (
    <AppShell>
      <section className="mx-auto max-w-[1120px] px-5 py-12 lg:px-8">
        <PageIntro
          eyebrow="Step 01 · gather the essentials"
          title={
            <>
              Let’s give this journey a shape
              <span className="text-[var(--gold)]">.</span>
            </>
          }
          description="A few simple decisions are enough to begin. The rest can unfold as you go."
        />
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_330px]">
          <form
            onSubmit={create}
            className="rounded-[28px] border border-[var(--line)] bg-white p-6 sm:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="sm:col-span-2">
                <span className="mb-2 block text-[10px] font-black uppercase tracking-[.16em] text-[var(--gold)]">
                  Trip name
                </span>
                <input
                  required
                  value={form.title}
                  onChange={set("title")}
                  className={fieldClass}
                  placeholder="A little Mediterranean escape"
                />
              </label>
              <label>
                <span className="mb-2 block text-[10px] font-black uppercase tracking-[.16em] text-[var(--gold)]">
                  First stop
                </span>
                <div className="relative">
                  <MapPin
                    className="absolute left-4 top-3.5 text-[var(--gold)]"
                    size={17}
                  />
                  <input
                    required
                    value={form.city}
                    onChange={set("city")}
                    placeholder="Lisbon, Portugal"
                    className={`${fieldClass} pl-10`}
                  />
                </div>
              </label>
              <label>
                <span className="mb-2 block text-[10px] font-black uppercase tracking-[.16em] text-[var(--gold)]">
                  Travel mood
                </span>
                <select
                  value={form.mood}
                  onChange={set("mood")}
                  className={fieldClass}
                >
                  <option>Slow and cultural</option>
                  <option>Food-forward</option>
                  <option>Big outdoors</option>
                  <option>Free-form wandering</option>
                </select>
              </label>
              <label>
                <span className="mb-2 block text-[10px] font-black uppercase tracking-[.16em] text-[var(--gold)]">
                  Start date
                </span>
                <div className="relative">
                  <CalendarDays
                    className="absolute left-4 top-3.5 text-[var(--gold)]"
                    size={17}
                  />
                  <input
                    required
                    type="date"
                    value={form.startDate}
                    onChange={set("startDate")}
                    className={`${fieldClass} pl-10`}
                  />
                </div>
              </label>
              <label>
                <span className="mb-2 block text-[10px] font-black uppercase tracking-[.16em] text-[var(--gold)]">
                  End date
                </span>
                <div className="relative">
                  <CalendarDays
                    className="absolute left-4 top-3.5 text-[var(--gold)]"
                    size={17}
                  />
                  <input
                    required
                    type="date"
                    value={form.endDate}
                    onChange={set("endDate")}
                    className={`${fieldClass} pl-10`}
                  />
                </div>
              </label>
              <label className="sm:col-span-2">
                <span className="mb-2 block text-[10px] font-black uppercase tracking-[.16em] text-[var(--gold)]">
                  A note to your future self
                </span>
                <textarea
                  value={form.description}
                  onChange={set("description")}
                  className={`${fieldClass} min-h-28 resize-none`}
                  placeholder="Good coffee, generous afternoons, and enough room to get a little lost."
                />
              </label>
            </div>
            {error && (
              <p className="mt-4 text-sm font-semibold text-red-700">{error}</p>
            )}
            <button
              disabled={pending}
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-[var(--navy)] px-6 py-3.5 text-sm font-extrabold text-white disabled:opacity-60"
            >
              {pending ? (
                "Saving your route…"
              ) : (
                <>
                  Build the itinerary <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
          <aside className="map-grid rounded-[28px] border border-[var(--sand-dark)] bg-[var(--sand)] p-7">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--canvas)] text-[var(--gold)]">
              <Compass size={22} />
            </span>
            <h2 className="mt-7 font-serif text-3xl font-bold text-[var(--navy)]">
              There is no wrong first draft.
            </h2>
            <p className="mt-3 text-sm leading-6 text-[var(--ink-muted)]">
              You can adjust dates, add stops, and reshape your budget any time
              you return to this route.
            </p>
            <div className="mt-8 border-t border-[var(--sand-dark)] pt-5 text-sm font-semibold leading-7 text-[var(--ink-muted)]">
              1. Start with a place
              <br />
              2. Let the days breathe
              <br />
              3. Save the good ideas
            </div>
          </aside>
        </div>
      </section>
    </AppShell>
  );
}
