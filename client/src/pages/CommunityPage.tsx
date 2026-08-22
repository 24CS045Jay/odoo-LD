import { ArrowRight, Bookmark, Heart } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { communityApi } from "@/api/client";
import { heroUrl } from "@/lib/presentationData";
import AppShell from "@/components/layout/AppShell";
import PageContainer from "@/components/layout/PageContainer";
import AppImage from "@/components/shared/AppImage";
import PageIntro from "@/components/shared/PageIntro";
import FilterBar from "@/components/shared/FilterBar";
export default function CommunityPage() {
  const queryClient = useQueryClient();
  const postsQuery = useQuery({
    queryKey: ["community"],
    queryFn: communityApi.list,
  });
  const like = useMutation({
    mutationFn: communityApi.like,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["community"] }),
  });
  return (
    <AppShell>
      <section className="desktop-section">
        <PageContainer>
        <PageIntro
          eyebrow="Routes from fellow travelers"
          title={
            <>
              Borrow a little wonder
              <span className="text-[var(--gold)]">.</span>
            </>
          }
          description="A collection of public journeys shared by real travelers to spark ideas, not tell you how to travel."
        />
        <div className="mt-9">
          <FilterBar label="Find your kind of route" />
        </div>
        {postsQuery.isLoading ? (
          <div className="mt-7 grid gap-6 lg:grid-cols-2 2xl:grid-cols-3">
            <div className="h-96 animate-pulse rounded-[28px] bg-[var(--sand)]" />
            <div className="h-96 animate-pulse rounded-[28px] bg-[var(--sand)]" />
          </div>
        ) : postsQuery.data?.items.length ? (
          <div className="mt-7 grid gap-6 lg:grid-cols-2 2xl:grid-cols-3">
            {postsQuery.data.items.map((post, index) => (
              <article
                key={post._id}
                className={
                  index === 0
                    ? "overflow-hidden rounded-[28px] bg-[var(--navy)] text-white"
                    : "overflow-hidden rounded-[28px] border border-[var(--line)] bg-white"
                }
              >
                <AppImage
                  src={post.images?.[0] || heroUrl}
                  alt={post.title}
                  className="h-64 w-full object-cover opacity-90"
                  containerClassName="h-64 w-full"
                />
                <div className="p-7">
                  <p className="text-[10px] font-black uppercase tracking-[.18em] text-[var(--gold)]">
                    {post.destination || "A shared journey"}
                    {post.country ? ` · ${post.country}` : ""}
                  </p>
                  <h2
                    className={`mt-3 font-serif text-4xl font-bold ${index === 0 ? "" : "text-[var(--navy)]"}`}
                  >
                    {post.title}
                  </h2>
                  <p
                    className={`mt-3 text-sm leading-6 ${index === 0 ? "text-white/70" : "text-[var(--ink-muted)]"}`}
                  >
                    {post.content}
                  </p>
                  <div className="mt-6 flex items-center justify-between">
                    <button
                      onClick={() => like.mutate(post._id)}
                      className={`flex items-center gap-2 text-xs font-bold ${index === 0 ? "text-white/65" : "text-[var(--ink-muted)]"}`}
                    >
                      <Heart size={14} /> {post.likesCount} likes
                    </button>
                    <Link
                      href="/shared/mediterranean"
                      className={
                        index === 0
                          ? "inline-flex items-center gap-2 rounded-full bg-[var(--gold)] px-4 py-2.5 text-sm font-extrabold text-[var(--navy)]"
                          : "inline-flex items-center gap-2 text-sm font-extrabold text-[var(--navy)]"
                      }
                    >
                      <Bookmark size={15} />
                      Open journey <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-7 rounded-[28px] border border-[var(--line)] bg-white p-8">
            <p className="font-serif text-3xl font-bold text-[var(--navy)]">
              The community is waiting for its first shared route.
            </p>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[var(--ink-muted)]">
              Posts, comments, and likes are never fabricated here. Sign in,
              build an itinerary, and share a real travel story when you are
              ready.
            </p>
            <Link
              href="/trips/new"
              className="mt-5 inline-flex items-center gap-2 text-sm font-extrabold text-[var(--navy)]"
            >
              Plan a journey <ArrowRight size={15} />
            </Link>
          </div>
        )}
        </PageContainer>
      </section>
    </AppShell>
  );
}
