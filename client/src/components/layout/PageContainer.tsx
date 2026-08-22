import type { ReactNode } from "react";

type PageContainerProps = {
  children: ReactNode;
  className?: string;
  wide?: boolean;
};

export default function PageContainer({ children, className = "", wide = false }: PageContainerProps) {
  return <div className={`mx-auto w-full ${wide ? "max-w-[1600px]" : "max-w-[1440px]"} px-4 sm:px-6 lg:px-10 2xl:px-12 ${className}`}>{children}</div>;
}
