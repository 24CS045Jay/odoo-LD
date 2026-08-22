import { Compass, MapPin, Pencil } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import AppShell from "@/components/layout/AppShell";
import AppImage from "@/components/shared/AppImage";
import PageIntro from "@/components/shared/PageIntro";
export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const name =
    user?.name ||
    `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() ||
    "World Trotter";
  const initials = name
    .split(" ")
    .map(part => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <AppShell>
      <section className="mx-auto max-w-[820px] px-5 py-12 lg:px-8">
        <PageIntro
          eyebrow="Your travel portrait"
          title={
            <>
              A few things about you
              <span className="text-[var(--gold)]">.</span>
            </>
          }
          description="Your profile and travel preferences are linked to your World Trotter account."
        />
        {!isAuthenticated ? (
          <div className="mt-10 rounded-[28px] bg-[var(--sand)] p-8">
            <p className="font-serif text-3xl font-bold text-[var(--navy)]">
              Sign in to see your travel portrait.
            </p>
            <Link
              href="/login"
              className="mt-4 inline-block text-sm font-extrabold text-[var(--navy)]"
            >
              Go to sign in →
            </Link>
          </div>
        ) : (
          <article className="mt-10 rounded-[28px] border border-[var(--line)] bg-white p-7">
            <div className="flex flex-wrap items-center gap-5 border-b border-[var(--line)] pb-7">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-[var(--sand)] font-serif text-3xl font-bold text-[var(--navy)] gold-ring">
                {user?.avatarUrl ? (
                  <AppImage
                    src={user.avatarUrl}
                    alt={`${name} avatar`}
                    className="h-full w-full object-cover"
                    containerClassName="h-full w-full"
                  />
                ) : (
                  initials
                )}
              </div>
              <div>
                <h2 className="font-serif text-3xl font-bold text-[var(--navy)]">
                  {name}
                </h2>
                <p className="mt-1 text-sm text-[var(--ink-muted)]">
                  {user?.email} · World Trotter member
                </p>
              </div>
              <button className="ml-auto inline-flex items-center gap-2 rounded-full border border-[var(--line)] px-4 py-2.5 text-sm font-extrabold text-[var(--navy)]">
                <Pencil size={14} />
                Edit profile
              </button>
            </div>
            <div className="grid gap-5 pt-7 sm:grid-cols-2">
              <div className="rounded-2xl bg-[var(--sand)] p-5">
                <MapPin className="text-[var(--gold)]" size={18} />
                <p className="mt-5 text-[10px] font-black uppercase tracking-[.16em] text-[var(--gold)]">
                  Home base
                </p>
                <p className="mt-2 text-lg font-bold text-[var(--navy)]">
                  {[user?.city, user?.country].filter(Boolean).join(", ") ||
                    "Add your home base"}
                </p>
              </div>
              <div className="rounded-2xl bg-[var(--sand)] p-5">
                <Compass className="text-[var(--gold)]" size={18} />
                <p className="mt-5 text-[10px] font-black uppercase tracking-[.16em] text-[var(--gold)]">
                  Travel instinct
                </p>
                <p className="mt-2 text-lg font-bold text-[var(--navy)]">
                  {user?.bio || "Slow, local, and curious"}
                </p>
              </div>
            </div>
          </article>
        )}
      </section>
    </AppShell>
  );
}
