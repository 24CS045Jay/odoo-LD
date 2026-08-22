// World Trotter visual style: navy-and-gold compass globe with a dependable vector fallback.
import { Compass, Globe2 } from "lucide-react";
import { logoUrl } from "@/lib/presentationData";

export default function BrandMark({ size = 40 }: { size?: number }) {
  return <span className="relative inline-flex shrink-0 items-center justify-center rounded-full bg-[var(--sand)] text-[var(--navy)] gold-ring" style={{ width: size, height: size }}>
    <Globe2 size={Math.round(size * 0.58)} strokeWidth={1.65}/><Compass className="absolute text-[var(--gold)]" size={Math.round(size * 0.36)} strokeWidth={2}/>
    <img src={logoUrl} alt="" aria-hidden="true" onError={event => { event.currentTarget.style.display = "none"; }} className="absolute inset-0 h-full w-full rounded-full object-contain"/>
  </span>;
}
