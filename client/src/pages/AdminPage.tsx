import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/api/client";
import { useAuth } from "@/_core/hooks/useAuth";
import AppShell from "@/components/layout/AppShell";
import PageIntro from "@/components/shared/PageIntro";
export default function AdminPage() {
  const { user } = useAuth();
  const query = useQuery({
    queryKey: ["admin", "analytics"],
    queryFn: adminApi.analytics,
    enabled: user?.role === "admin",
  });
  const analytics = query.data;
  const cards = analytics
    ? [
        [String(analytics.totalTrips), "Trips started"],
        [String(analytics.activeUsers), "Active explorers"],
        [
          new Intl.NumberFormat("en-IE", {
            style: "currency",
            currency: "EUR",
            maximumFractionDigits: 0,
          }).format(analytics.averageBudget),
          "Average trip budget",
        ],
      ]
    : [];
  return (
    <AppShell>
      <section className="mx-auto max-w-[1120px] px-5 py-12 lg:px-8">
        <PageIntro
          eyebrow="Admin workspace"
          title={
            <>
              A quiet read on the momentum
              <span className="text-[var(--gold)]">.</span>
            </>
          }
          description="Live, role-protected data for managing World Trotter."
        />
        {user?.role !== "admin" ? (
          <div className="mt-10 rounded-[28px] bg-[var(--sand)] p-8">
            <p className="font-serif text-3xl font-bold text-[var(--navy)]">
              Administrator access is required.
            </p>
            <p className="mt-3 text-sm text-[var(--ink-muted)]">
              Sign in with an administrator account to review real platform
              analytics.
            </p>
          </div>
        ) : query.isLoading ? (
          <div className="mt-10 h-64 animate-pulse rounded-[28px] bg-[var(--sand)]" />
        ) : (
          <>
            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {cards.map(([value, label]) => (
                <div
                  key={label}
                  className="rounded-[24px] bg-[var(--sand)] p-6"
                >
                  <p className="font-serif text-4xl font-bold text-[var(--navy)]">
                    {value}
                  </p>
                  <p className="mt-2 text-sm font-bold text-[var(--ink-muted)]">
                    {label}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-6 rounded-[28px] border border-[var(--line)] bg-white p-7">
              <p className="text-[10px] font-black uppercase tracking-[.18em] text-[var(--gold)]">
                Most planned places
              </p>
              <h2 className="mt-2 font-serif text-3xl font-bold text-[var(--navy)]">
                Destinations attracting the most attention
              </h2>
              <div className="mt-5 h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={
                      analytics?.popularDestinations.map(item => ({
                        name: item._id,
                        plans: item.count,
                      })) ?? []
                    }
                  >
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#6f7c80", fontSize: 12 }}
                    />
                    <YAxis hide />
                    <Tooltip cursor={{ fill: "#f5efe6" }} />
                    <Bar
                      dataKey="plans"
                      fill="#17314a"
                      radius={[9, 9, 0, 0]}
                      isAnimationActive
                      animationDuration={800}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </>
        )}
      </section>
    </AppShell>
  );
}
