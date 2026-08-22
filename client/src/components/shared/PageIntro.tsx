// World Trotter visual style: editorial page heading with restrained antique-gold wayfinding.
import type { ReactNode } from "react";
export default function PageIntro({ eyebrow, title, description, action }: { eyebrow: string; title: ReactNode; description?: string; action?: ReactNode }) {
  return <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"><div><p className="text-[12px] font-extrabold uppercase tracking-[0.2em] text-[var(--gold)]">{eyebrow}</p><h1 className="mt-3 max-w-3xl font-serif text-5xl font-bold leading-[0.96] tracking-[-0.055em] text-[var(--navy)] sm:text-[3.75rem]">{title}</h1>{description && <p className="mt-5 max-w-2xl text-[16px] leading-[1.8] text-[var(--ink-muted)]">{description}</p>}</div>{action}</div>;
}
