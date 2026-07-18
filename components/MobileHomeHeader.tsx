"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CartCountLink } from "./CartCountLink";
import { AccountHeaderLink } from "./AccountHeaderLink";
import { LogoMark } from "./LogoMark";
import { MobileNavMenu } from "./MobileNavMenu";

export function MobileHomeHeader({ mode = "overlay" }: Readonly<{ mode?: "overlay" | "paper" }>) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    const update = () => {
      const hero = document.querySelector<HTMLElement>(".mobile-home-hero");
      const heroBottom = hero
        ? hero.offsetTop + hero.offsetHeight
        : window.innerHeight;
      setIsScrolled(window.scrollY + 64 >= heroBottom);
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update);
    };
  }, [pathname]);
  const paperMode = mode === "paper" || isScrolled || isMenuOpen;
  const links = [["Home", "/"], ["Collections", "/collections"], ["Lookbook", "/lookbook"], ["About", "/about"]];
  const isActive = (href: string) =>
    href === "/"
      ? pathname === "/"
      : pathname === href ||
        pathname.startsWith(`${href}/`) ||
        (href === "/collections" && pathname.startsWith("/products/"));
  return <header className={`mobile-site-header fixed inset-x-0 top-0 z-50 grid h-16 min-w-0 grid-cols-[1fr_auto] items-center gap-6 border-b px-5 text-[11px] uppercase tracking-[0.14em] transition-[background-color,border-color,color] duration-300 lg:grid-cols-[1fr_auto_1fr] lg:px-12 ${paperMode ? "border-black/16 bg-[#dedfd9] text-[#151413]" : "border-white/38 bg-transparent text-white mix-blend-difference lg:border-white/28 lg:bg-gradient-to-b lg:from-black/42 lg:to-transparent lg:mix-blend-normal"}`}>
    <div className="mobile-header-logo flex min-h-11 w-fit items-center lg:hidden">
      <LogoMark className="text-[11px]" />
    </div>
    <div className="hidden lg:block">
      <LogoMark className="text-[11px]" />
    </div>
    <nav aria-label="Primary navigation" className="hidden items-center justify-center gap-8 xl:gap-10 lg:flex">
      {links.map(([label, href]) => <Link aria-current={isActive(href) ? "page" : undefined} className={isActive(href) ? "border-b border-current pb-1" : ""} href={href} key={href}>{label}</Link>)}
    </nav>
    <div className="mobile-header-actions flex min-w-0 items-center justify-end gap-3 lg:gap-4">
      <Link aria-label="Search products" className="mobile-header-search flex min-h-11 items-center text-[9px] tracking-[0.1em] lg:text-[11px] lg:tracking-[0.12em]" href="/search">Search</Link>
      <AccountHeaderLink className="flex min-h-11 items-center whitespace-nowrap text-[11px] tracking-[0.06em] lg:text-[11px] lg:tracking-[0.12em]" compact />
      <CartCountLink className="mobile-header-action flex min-h-11 items-center whitespace-nowrap text-[11px] uppercase tracking-[0.06em] lg:hidden" />
      <CartCountLink className="hidden min-h-11 items-center whitespace-nowrap text-[11px] uppercase tracking-[0.12em] lg:flex" />
      <MobileNavMenu onOpenChange={setIsMenuOpen} />
    </div>
  </header>;
}
