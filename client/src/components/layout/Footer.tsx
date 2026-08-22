import { Link } from "wouter";
import { fullLogoUrl } from "@/lib/presentationData";
import AppImage from "@/components/shared/AppImage";
import PageContainer from "./PageContainer";
export default function Footer() {
  return (
    <footer className="border-t border-[var(--line)] bg-[var(--sand)] pb-24 pt-12 lg:pb-12">
      <PageContainer className="grid gap-8 lg:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <div className="inline-flex rounded-2xl bg-[#FAF7F2] p-2">
            <AppImage
              src={fullLogoUrl}
              alt="World Trotter — Explore the World with Us"
              className="h-auto w-52 mix-blend-multiply"
              containerClassName="h-auto w-52"
            />
          </div>
          <p className="mt-4 max-w-xs text-sm leading-6 text-[var(--ink-muted)]">
            Thoughtful tools for the places you have already imagined.
          </p>
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--gold)]">
            Plan
          </p>
          <div className="mt-4 flex flex-col items-start gap-2 text-sm font-semibold text-[var(--ink-muted)]">
            <Link href="/trips/new">Start a journey</Link>
            <Link href="/itinerary-builder">Build an itinerary</Link>
            <Link href="/budget">See a budget</Link>
          </div>
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[var(--gold)]">
            Discover
          </p>
          <div className="mt-4 flex flex-col items-start gap-2 text-sm font-semibold text-[var(--ink-muted)]">
            <Link href="/cities">Find cities</Link>
            <Link href="/activities">Find experiences</Link>
            <Link href="/community">Community routes</Link>
          </div>
        </div>
      </PageContainer>
    </footer>
  );
}
