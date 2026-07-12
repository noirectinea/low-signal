"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { CartCountLink } from "./CartCountLink";

const links = [
  ["Home", "/"],
  ["Collections", "/collections"],
  ["Lookbook", "/lookbook"],
  ["About", "/about"],
] as const;

export function MobileNavMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (!open) return;
    firstLinkRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
      if (event.key !== "Tab" || !menuRef.current) return;
      const focusable = Array.from(menuRef.current.querySelectorAll<HTMLElement>("a, button"));
      const first = focusable[0];
      const last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }

    function onPointerDown(event: PointerEvent) {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div className="lg:hidden" ref={menuRef}>
      <button
        aria-controls="mobile-site-menu"
        aria-expanded={open}
        className="min-h-10 border border-current px-3 text-[12px] uppercase tracking-[0.14em]"
        type="button"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? "Close" : "Menu"}
      </button>
      {open ? (
        <div
          aria-label="Site menu"
          aria-modal="true"
          className="absolute left-0 right-0 top-full border-b border-current bg-[#e4e5df] p-5 text-[#121211] shadow-[0_14px_30px_rgb(0_0_0_/_0.12)]"
          id="mobile-site-menu"
          role="dialog"
        >
          <nav aria-label="Mobile navigation" className="grid divide-y divide-black/16 border-y border-black/16">
            {links.map(([label, href], index) => (
              <Link
                className="py-4 text-[14px] uppercase tracking-[0.14em]"
                href={href}
                key={href}
                ref={index === 0 ? firstLinkRef : undefined}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            ))}
            <CartCountLink
              className="py-4 text-[14px] uppercase tracking-[0.14em]"
              onClick={() => setOpen(false)}
            />
          </nav>
        </div>
      ) : null}
    </div>
  );
}
