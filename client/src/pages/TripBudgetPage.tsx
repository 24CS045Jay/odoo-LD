import { ArrowRight, CircleDollarSign } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Link } from "wouter";
import { tripApi } from "@/api/client";
import AppShell from "@/components/layout/AppShell";
import PageIntro from "@/components/shared/PageIntro";
import BudgetSummary from "@/components/itinerary/BudgetSummary";
const colors = ["#17314a", "#c99233", "#d6a565", "#98b2b4", "#c97861"];
export default function TripBudgetPage() {
  const tripId = localStorage.getItem("world-trotter-active-trip");
  const tripQuery = useQuery({
    queryKey: ["trip", tripId],
    queryFn: () => tripApi.get(tripId!),
    enabled: Boolean(tripId),
  });
  const budgetQuery = useQuery({
    queryKey: ["budget", tripId],
    queryFn: () => tripApi.budget(tripId!),
    enabled: Boolean(tripId),
  });
  const budget = budgetQuery.data;
  const chartData = Object.entries(budget?.categoryBreakdown ?? {}).map(
    ([label, value]) => ({
      label: label[0].toUpperCase() + label.slice(1),
      value,
    })
  );
  const money = (value: number) =>
    new Intl.NumberFormat("en-IE", {
      style: "currency",
      currency: tripQuery.data?.trip.currency ?? "EUR",
      maximumFractionDigits: 0,
    }).format(value);
  return (
    <AppShell>
      <section className="mx-auto max-w-[1120px] px-5 py-12 lg:px-8">
        <PageIntro
          eyebrow="Stay comfortable with the numbers"
          title={
            <>
              Budget, without the busywork
              <span className="text-[var(--gold)]">.</span>
            </>
          }
          description="A clear read on where your travel money is going, so the good decisions stay easy."
          action={
            <Link
              href="/itinerary-view"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-white px-5 py-3 text-sm font-extrabold text-[var(--navy)]"
            >
              Back to route <ArrowRight size={15} />
            </Link>
          }
        />
        {!tripId ? (
          <div className="mt-10 rounded-[26px] bg-[var(--sand)] p-8">
            <p className="font-serif text-3xl font-bold text-[var(--navy)]">
              Choose a trip to see its budget.
            </p>
            <Link
              href="/trips"
              className="mt-4 inline-block text-sm font-extrabold text-[var(--navy)]"
            >
              My trips →
            </Link>
          </div>
        ) : (
          <>
            <div className="mt-10 grid gap-7 lg:grid-cols-[.85fr_1.15fr]">
              <BudgetSummary
                budget={budget}
                currency={tripQuery.data?.trip.currency}
              />
              <div className="rounded-[26px] border border-[var(--line)] bg-white p-6">
                <p className="text-[10px] font-black uppercase tracking-[.18em] text-[var(--gold)]">
                  Estimated spend
                </p>
                <h2 className="mt-2 font-serif text-3xl font-bold text-[var(--navy)]">
                  What the route is asking for
                </h2>
                <div className="mt-5 h-64">
                  {budgetQuery.isLoading ? (
                    <div className="h-full animate-pulse rounded-2xl bg-[var(--sand)]" />
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <XAxis
                          dataKey="label"
                          tickLine={false}
                          axisLine={false}
                          tick={{ fill: "#6f7c80", fontSize: 11 }}
                        />
                        <YAxis hide />
                        <Tooltip cursor={{ fill: "#f5efe6" }} />
                        <Bar
                          dataKey="value"
                          radius={[8, 8, 0, 0]}
                          isAnimationActive
                          animationDuration={800}
                        >
                          {chartData.map((item, index) => (
                            <Cell
                              key={item.label}
                              fill={colors[index % colors.length]}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-7 rounded-[26px] border border-[var(--line)] bg-white p-6">
              <div className="grid items-center gap-5 md:grid-cols-[.55fr_1fr]">
                <div className="h-44">
                  {chartData.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={chartData}
                          dataKey="value"
                          innerRadius={44}
                          outerRadius={70}
                          paddingAngle={4}
                          isAnimationActive
                          animationDuration={800}
                        >
                          {chartData.map((item, index) => (
                            <Cell
                              key={item.label}
                              fill={colors[index % colors.length]}
                            />
                          ))}
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                  ) : null}
                </div>
                <div>
                  <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[.18em] text-[var(--gold)]">
                    <CircleDollarSign size={14} />A gentle check-in
                  </p>
                  <h2 className="mt-2 font-serif text-3xl font-bold text-[var(--navy)]">
                    {budget?.status === "over_budget"
                      ? "Time to reshape the numbers."
                      : "You still have room for a beautiful detour."}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-[var(--ink-muted)]">
                    {budget
                      ? `${money(budget.remaining)} remains from your current ${money(budget.totalBudget)} budget.`
                      : "Budget calculations will update once this trip has saved expenses and activities."}
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </AppShell>
  );
}
