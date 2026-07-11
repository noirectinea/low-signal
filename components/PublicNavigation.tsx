"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CartCountLink } from "./CartCountLink";
import { LogoMark } from "./LogoMark";

const links = [
  ["Home", "/"],
  ["Collections", "/collections"],
  ["Lookbook", "/lookbook"],
  ["About", "/about"],
] as const;

function isActivePath(pathname: string, href: string) {
  if (href === "/collections" && pathname.startsWith("/products/")) {
    return true;
  }

  return href === "/" ? pathname === href : pathname.startsWith(href);
}

export function PublicNavigation() {
  const pathname = usePathname();

  return (
    <nav className="public-nav fixed inset-x-0 top-0 z-40 grid min-h-16 grid-cols-[1fr_auto_1fr] items-center border-b border-black/14 bg-[#e3e4de]/94 px-5 text-[10px] font-medium uppercase tracking-[0.1em] text-[#141311] backdrop-blur-sm lg:px-12">
      <LogoMark />

      <div className="hidden items-center justify-center gap-10 md:flex lg:gap-14">
        {links.map(([label, href]) => {
          const active = isActivePath(pathname, href);

          return (
            <Link
              aria-current={active ? "page" : undefined}
              className={`public-nav-link ${active ? "is-active" : ""}`}
              href={href}
              key={href}
            >
              {label}
            </Link>
          );
        })}
      </div>

      <details className="group/menu relative justify-self-center md:hidden">
        <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 px-2">
          <span>Menu</span>
          <span aria-hidden="true" className="group-open/menu:hidden">+</span>
          <span aria-hidden="true" className="hidden group-open/menu:inline">−</span>
        </summary>
        <div className="absolute left-1/2 top-[47px] grid w-[180px] -translate-x-1/2 border border-black/16 bg-[#e3e4de] px-5 py-3 shadow-none">
          {links.map(([label, href]) => {
            const active = isActivePath(pathname, href);

            return (
              <Link
                aria-current={active ? "page" : undefined}
                className={`border-b border-black/12 py-4 last:border-b-0 ${
                  active ? "text-black" : "text-black/62"
                }`}
                href={href}
                key={href}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </details>

      <CartCountLink className="public-nav-link justify-self-end" />
    </nav>
  );
}
