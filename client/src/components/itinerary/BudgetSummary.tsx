import { WalletCards } from "lucide-react";
import type { ApiBudget } from "@/api/client";

const colors = ["var(--gold)", "#e7b26b", "#97afb1", "#d98961", "#b8c9bc"];
export default function BudgetSummary({ budget, currency = "EUR" }: { budget?: ApiBudget; currency?: string }) {
  const entries = budget ? Object.entries(budget.categoryBreakdown).map(([label, value], index) => ({ label: label[0].toUpperCase() + label.slice(1), value, color: colors[index] })) : [];
  const total = budget?.estimatedSpend ?? 0;
  const money = (value: number) => new Intl.NumberFormat("en-IE", { style: "currency", currency, maximumFractionDigits: 0 }).format(value);
  return <aside className="rounded-[26px] bg-[var(--navy)] p-6 text-white"><div className="flex items-center gap-3"><span className="rounded-2xl bg-white/10 p-3 text-[var(--gold)]"><WalletCards size={20}/></span><div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/60">Budget compass</p><p className="mt-1 font-serif text-2xl font-bold">{money(total)}</p></div></div>{entries.length ? <div className="mt-7 space-y-4">{entries.map(item => <div key={item.label}><div className="mb-2 flex justify-between text-xs font-bold text-white/75"><span>{item.label}</span><span>{money(item.value)}</span></div><div className="h-2 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full" style={{ width: `${total ? Math.round((item.value / total) * 100) : 0}%`, background: item.color }}/></div></div>)}</div> : <p className="mt-7 rounded-2xl border border-white/10 bg-white/5 p-3 text-xs leading-5 text-white/70">No expenses are saved yet. Add trip costs as the route takes shape.</p>}<p className="mt-7 rounded-2xl border border-white/10 bg-white/5 p-3 text-xs leading-5 text-white/70">{budget ? `${money(budget.remaining)} remains from your ${money(budget.totalBudget)} trip limit.` : "A server-calculated budget will appear here once a trip is active."}</p></aside>;
}
