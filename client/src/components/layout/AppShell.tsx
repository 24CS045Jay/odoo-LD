// World Trotter visual style: shared page frame for the frontend-only travel experience.
import type { ReactNode } from "react";
import Header from "./Header";
import MobileNav from "./MobileNav";
import Footer from "./Footer";

export default function AppShell({ children, footer = true }: { children: ReactNode; footer?: boolean }) {
  return <div className="min-h-screen bg-[var(--canvas)] text-[var(--ink)]"><Header /><main>{children}</main>{footer && <Footer />}<MobileNav /></div>;
}
