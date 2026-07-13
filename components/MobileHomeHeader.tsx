"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CartCountLink } from "./CartCountLink";
import { LogoMark } from "./LogoMark";
import { MobileNavMenu } from "./MobileNavMenu";

export function MobileHomeHeader({ mode = "overlay" }: Readonly<{ mode?: "overlay" | "paper" }>) {
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    const update = () => setIsScrolled(window.scrollY > 28);
    update(); window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  const paperMode = mode === "paper" || isScrolled;
  const links = [["Home", "/"], ["Collections", "/collections"], ["Lookbook", "/lookbook"], ["About", "/about"]];
  return <header className={`fixed inset-x-0 top-0 z-50 grid h-16 min-w-0 grid-cols-[1fr_auto] items-center gap-6 border-b px-5 text-[11px] uppercase tracking-[0.14em] transition-[background-color,border-color,color] duration-300 md:grid-cols-[1fr_auto_1fr] lg:px-12 ${paperMode ? "border-black/16 bg-[#dedfd9]/94 text-[#151413] backdrop-blur-md" : "border-white/38 bg-transparent text-white mix-blend-difference lg:border-white/28 lg:bg-gradient-to-b lg:from-black/42 lg:to-transparent lg:mix-blend-normal"}`}>
    <LogoMark className="text-[11px]" />
    <nav aria-label="Primary navigation" className="hidden items-center justify-center gap-10 md:flex">
      {links.map(([label, href]) => <Link className={pathname === href ? "border-b border-current pb-1" : ""} href={href} key={href}>{label}</Link>)}
    </nav>
    <div className="flex min-w-0 items-center justify-end gap-4"><CartCountLink className="flex min-h-11 items-center whitespace-nowrap text-[11px] uppercase tracking-[0.12em]" /><MobileNavMenu /></div>
  </header>;
}
