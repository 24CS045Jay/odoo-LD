import { emblemUrl } from "@/lib/presentationData";

export default function BrandMark({ size = 40 }: { size?: number }) {
  return <span className="inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#FAF7F2] gold-ring" style={{ width: size, height: size }}><img src={emblemUrl} alt="World Trotter compass globe" className="h-full w-full object-cover"/></span>;
}
