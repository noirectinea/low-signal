"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AccountHeaderLink } from "./AccountHeaderLink";

const links = [
  ["Shop all", "/collections"],
  ["Men", "/collections/men"],
  ["Women", "/collections/women"],
  ["Lookbook", "/lookbook"],
  ["About", "/about"],
] as const;

export function MobileNavMenu({
  onOpenChange,
}: Readonly<{
  onOpenChange?: (open: boolean) => void;
}>) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("menu") === "open") {
      const timer = window.setTimeout(() => setOpen(true), 0);

      return () => window.clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    onOpenChange?.(open);
  }, [onOpenChange, open]);

  useEffect(() => {
    if (!open) return;
    firstLinkRef.current?.focus();
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
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
      document.documentElement.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div className="lg:hidden" ref={menuRef}>
      <button
        aria-controls="mobile-site-menu"
        aria-expanded={open}
        className="mobile-menu-trigger min-h-11 px-1 text-[12px] uppercase tracking-[0.12em]"
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
      >
        {open ? "Close" : "Menu"}
      </button>
      {open ? (
        <div
          aria-label="Site menu"
          aria-modal="true"
          className="mobile-menu-panel absolute left-0 right-0 top-16 z-[70] h-[calc(100svh-4rem)] overflow-y-auto border-b border-current bg-[#e4e5df] p-5 text-[#121211]"
          id="mobile-site-menu"
          role="dialog"
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div className="mobile-menu-composition">
            <nav aria-label="Mobile navigation" className="mobile-menu-primary grid divide-y divide-black/16 border-y border-black/16">
              {links.map(([label, href], index) => (
                <Link
                  className="grid min-h-14 grid-cols-[36px_1fr_auto] items-center px-4 text-[13px] uppercase tracking-[0.14em]"
                  href={href}
                  key={href}
                  ref={index === 0 ? firstLinkRef : undefined}
                  onClick={() => setOpen(false)}
                >
                  <span className="text-[8px] text-black/42">{String(index + 1).padStart(2, "0")}</span>
                  <span>{label}</span>
                  <span aria-hidden="true" className="text-[10px] text-black/44">→</span>
                </Link>
              ))}
            </nav>
          </div>
          <nav aria-label="Secondary navigation" className="mobile-menu-secondary grid grid-cols-2 text-[11px] uppercase tracking-[0.12em] text-black/62">
            <Link className="flex min-h-11 items-center" href="/search" onClick={() => setOpen(false)}>Search</Link>
            <AccountHeaderLink className="flex min-h-11 items-center" />
            <Link className="flex min-h-11 items-center" href="/account/orders" onClick={() => setOpen(false)}>Orders</Link>
            <Link className="flex min-h-11 items-center" href="/shipping" onClick={() => setOpen(false)}>Shipping & Returns</Link>
            <Link className="flex min-h-11 items-center" href="/contact" onClick={() => setOpen(false)}>Contact</Link>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
