"use client";

import { useEffect, useState } from "react";
import { CartCountLink } from "./CartCountLink";
import { LogoMark } from "./LogoMark";
import { MobileNavMenu } from "./MobileNavMenu";

export function MobileHomeHeader({ mode = "hero" }: Readonly<{ mode?: "hero" | "paper" }>) {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const update = () => setIsScrolled(window.scrollY > 28);
    update(); window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  const paperMode = mode === "paper" || isScrolled;
  return <header className={`fixed inset-x-0 top-0 z-50 flex h-16 min-w-0 items-center justify-between px-5 transition-[background-color,border-color,color] duration-300 ${paperMode ? "border-b border-black/16 bg-[#dedfd9]/94 text-[#151413] backdrop-blur-md" : "bg-gradient-to-b from-black/38 to-transparent text-[#f5f2ed]"}`}>
    <LogoMark className="text-[12px]" />
    <div className="flex items-center gap-4"><CartCountLink className="flex min-h-11 items-center text-[12px] uppercase tracking-[0.1em]" /><MobileNavMenu /></div>
  </header>;
}
