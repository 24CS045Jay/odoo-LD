// World Trotter visual style: destination-led trip listing with local presentation states.
import { Link } from "wouter";
import AppShell from "@/components/layout/AppShell";
import PageIntro from "@/components/shared/PageIntro";
import FilterBar from "@/components/shared/FilterBar";
import TripCard from "@/components/trips/TripCard";
import { trips } from "@/lib/presentationData";
export default function MyTripsPage() { return <AppShell><section className="mx-auto max-w-[1240px] px-5 py-12 lg:px-8"><PageIntro eyebrow="Your travel journal" title={<>My trips<span className="text-[var(--gold)]">.</span></>} description="A neat record of the places you are building toward and the stories you have already started." action={<Link href="/trips/new" className="rounded-full bg-[var(--navy)] px-5 py-3 text-sm font-extrabold text-white">Plan a journey</Link>}/><div className="mt-10"><FilterBar label="Sort your stories"/></div><div className="mt-7 grid gap-6 md:grid-cols-2 xl:grid-cols-3">{trips.map(trip => <TripCard key={trip.id} trip={trip}/>)}</div></section></AppShell>; }
