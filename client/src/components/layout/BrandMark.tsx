import { emblemUrl } from "@/lib/presentationData";

export default function BrandMark({ size = 40 }: { size?: number }) {
  return <span className="inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#FAF7F2] p-0.5 shadow-[0_8px_18px_rgba(23,49,74,0.13)] ring-1 ring-[rgba(183,149,74,0.32)] transition-transform duration-200 group-hover:scale-105" style={{ width: size, height: size }}><img src={emblemUrl} alt="World Trotter compass globe" className="h-full w-full rounded-full object-cover"/></span>;
}
