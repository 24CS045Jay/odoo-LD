// World Trotter visual style: experience cards designed for an easy itinerary shortlist.
import { ArrowRight, Clock3, Search, Tag } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { discoveryApi } from "@/api/client";
import { activityCard } from "@/api/viewModels";
import AppShell from "@/components/layout/AppShell";
import PageContainer from "@/components/layout/PageContainer";
import AppImage from "@/components/shared/AppImage";
import PageIntro from "@/components/shared/PageIntro";
import FilterBar from "@/components/shared/FilterBar";
export default function ActivitySearchPage() {
  const query = useQuery({
    queryKey: ["activities"],
    queryFn: discoveryApi.activities,
  });
  const activities = query.data?.items.map(activityCard) ?? [];
  return (
    <AppShell>
      <section className="desktop-section">
        <PageContainer>
        <PageIntro
          eyebrow="Make the days memorable"
          title={
            <>
              A few good things to do
              <span className="text-[var(--gold)]">.</span>
            </>
          }
          description="Save the experiences that make a place feel like more than a list of sights."
        />
        <div className="mt-9 flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-white p-2">
          <Search className="ml-3 text-[var(--gold)]" size={19} />
          <input
            aria-label="Search activities"
            className="flex-1 bg-transparent px-1 py-3 text-sm font-semibold outline-none"
            placeholder="Search food, art, nature, local rituals..."
          />
          <button className="rounded-xl bg-[var(--navy)] px-5 py-3 text-sm font-bold text-white">
            Search
          </button>
        </div>
        <div className="mt-7">
          <FilterBar label="Choose your pace" />
        </div>
        {query.isLoading ? (
          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {[1, 2, 3].map(key => (
              <div
                key={key}
                className="h-80 animate-pulse rounded-[25px] bg-[var(--sand)]"
              />
            ))}
          </div>
        ) : query.isError ? (
          <p className="mt-7 rounded-2xl bg-red-50 p-5 text-sm font-semibold text-red-700">
            Activities could not be loaded. Please try again.
          </p>
        ) : (
          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {activities.map(activity => (
              <article
                key={activity.title}
                className="group overflow-hidden rounded-[25px] border border-[var(--line)] bg-white"
              >
                <AppImage
                  src={activity.image}
                  alt={activity.title}
                  className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
                  containerClassName="h-48 w-full"
                />
                <div className="p-5">
                  <p className="text-[10px] font-black uppercase tracking-[.16em] text-[var(--gold)]">
                    {activity.city}
                  </p>
                  <h2 className="mt-2 font-serif text-2xl font-bold text-[var(--navy)]">
                    {activity.title}
                  </h2>
                  <div className="mt-3 flex gap-3 text-xs font-bold text-[var(--ink-muted)]">
                    <span className="flex items-center gap-1">
                      <Tag size={13} className="text-[var(--gold)]" />
                      {activity.type}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock3 size={13} className="text-[var(--gold)]" />
                      {activity.duration}
                    </span>
                  </div>
                  <div className="mt-5 flex items-center justify-between border-t border-[var(--line)] pt-4 text-xs font-bold">
                    <span className="text-[var(--ink-muted)]">
                      {activity.cost}
                    </span>
                    <Link
                      href="/itinerary-builder"
                      className="text-[var(--navy)]"
                    >
                      Add to route{" "}
                      <ArrowRight className="ml-1 inline" size={14} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
        </PageContainer>
      </section>
    </AppShell>
  );
}
