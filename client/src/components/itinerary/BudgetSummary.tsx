// World Trotter visual style: compact financial overview using navy, sand, and antique gold.
import { budgetData } from "@/lib/presentationData";
import { WalletCards } from "lucide-react";

export default function BudgetSummary() {
  const total = budgetData.reduce((sum, item) => sum + item.value, 0);
  return <aside className="rounded-[26px] bg-[var(--navy)] p-6 text-white"><div className="flex items-center gap-3"><span className="rounded-2xl bg-white/10 p-3 text-[var(--gold)]"><WalletCards size={20}/></span><div><p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/60">Budget compass</p><p className="mt-1 font-serif text-2xl font-bold">€{total.toLocaleString()}</p></div></div><div className="mt-7 space-y-4">{budgetData.map(item => <div key={item.label}><div className="mb-2 flex justify-between text-xs font-bold text-white/75"><span>{item.label}</span><span>€{item.value}</span></div><div className="h-2 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full" style={{ width: `${Math.round((item.value / total) * 100)}%`, background: item.color }}/></div></div>)}</div><p className="mt-7 rounded-2xl border border-white/10 bg-white/5 p-3 text-xs leading-5 text-white/70">You are comfortably within your €2,050 trip limit.</p></aside>;
}
