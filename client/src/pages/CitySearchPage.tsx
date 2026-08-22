// World Trotter visual style: city discovery cards with practical travel context.
import { ArrowRight, MapPin, Search } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { discoveryApi } from "@/api/client";
import { cityCard } from "@/api/viewModels";
import AppShell from "@/components/layout/AppShell";
import PageContainer from "@/components/layout/PageContainer";
import AppImage from "@/components/shared/AppImage";
import PageIntro from "@/components/shared/PageIntro";
import FilterBar from "@/components/shared/FilterBar";
export default function CitySearchPage() {
  const query = useQuery({
    queryKey: ["cities"],
    queryFn: discoveryApi.cities,
  });
  const cities = query.data?.items.map(cityCard) ?? [];
  return (
    <AppShell>
      <section className="desktop-section">
        <PageContainer>
        <PageIntro
          eyebrow="Find the right starting point"
          title={
            <>
              Cities worth saving<span className="text-[var(--gold)]">.</span>
            </>
          }
          description="Browse places by pace, appetite, geography, or just the feeling you want to follow."
        />
        <div className="mt-9 flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-white p-2">
          <Search className="ml-3 text-[var(--gold)]" size={19} />
          <input
            aria-label="Search cities"
            className="flex-1 bg-transparent px-1 py-3 text-sm font-semibold outline-none"
            placeholder="Search a city, country, or mood"
          />
          <button className="rounded-xl bg-[var(--navy)] px-5 py-3 text-sm font-bold text-white">
            Search
          </button>
        </div>
        <div className="mt-7">
          <FilterBar label="Curate your short list" />
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
            Cities could not be loaded. Please try again.
          </p>
        ) : (
          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {cities.map(city => (
              <article
                key={city.name}
                className="group overflow-hidden rounded-[25px] border border-[var(--line)] bg-white"
              >
                <AppImage
                  src={city.image}
                  alt={city.name}
                  className="h-48 w-full object-cover transition duration-500 group-hover:scale-105"
                  containerClassName="h-48 w-full"
                />
                <div className="p-5">
                  <p className="text-[10px] font-black uppercase tracking-[.16em] text-[var(--gold)]">
                    {city.country}
                  </p>
                  <h2 className="mt-2 font-serif text-3xl font-bold text-[var(--navy)]">
                    {city.name}
                  </h2>
                  <p className="mt-2 flex gap-2 text-sm text-[var(--ink-muted)]">
                    <MapPin size={14} className="text-[var(--gold)]" />
                    {city.tag}
                  </p>
                  <div className="mt-5 flex items-center justify-between border-t border-[var(--line)] pt-4 text-xs font-bold">
                    <span className="text-[var(--ink-muted)]">{city.cost}</span>
                    <Link href="/trips/new" className="text-[var(--navy)]">
                      Add to trip{" "}
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
