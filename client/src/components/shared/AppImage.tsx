import { useState, type ImgHTMLAttributes } from "react";
import { DEFAULT_IMAGE } from "@/lib/imageRegistry";

type AppImageProps = Omit<ImgHTMLAttributes<HTMLImageElement>, "src"> & {
  src: string;
  fallbackSrc?: string;
  containerClassName?: string;
};

export default function AppImage({
  src,
  alt,
  fallbackSrc = DEFAULT_IMAGE,
  className = "",
  containerClassName = "",
  onLoad,
  onError,
  ...props
}: AppImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [activeSrc, setActiveSrc] = useState(src);

  return (
    <span className={`relative block overflow-hidden bg-[var(--sand)] ${containerClassName}`}>
      {!loaded && <span aria-hidden="true" className="absolute inset-0 animate-pulse bg-[linear-gradient(110deg,transparent_10%,rgba(255,255,255,0.58)_40%,transparent_70%)]" />}
      <img
        {...props}
        src={activeSrc}
        alt={alt}
        loading={props.loading ?? "lazy"}
        onLoad={(event) => {
          setLoaded(true);
          onLoad?.(event);
        }}
        onError={(event) => {
          if (activeSrc !== fallbackSrc) {
            setActiveSrc(fallbackSrc);
            return;
          }
          setLoaded(true);
          onError?.(event);
        }}
        className={`relative h-full w-full object-cover transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"} ${className}`}
      />
    </span>
  );
}
