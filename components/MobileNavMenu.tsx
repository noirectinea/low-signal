"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { CartCountLink } from "./CartCountLink";

const links = [
  ["Shop", "/collections"],
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
        className="min-h-11 px-1 text-[12px] uppercase tracking-[0.12em]"
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
                  className="grid grid-cols-[30px_1fr] items-center py-4 text-[14px] uppercase tracking-[0.14em]"
                  href={href}
                  key={href}
                  ref={index === 0 ? firstLinkRef : undefined}
                  onClick={() => setOpen(false)}
                >
                  <span className="text-[8px] text-black/42">{String(index + 1).padStart(2, "0")}</span>
                  <span>{label}</span>
                </Link>
              ))}
              <CartCountLink
                className="grid grid-cols-[30px_1fr] items-center py-4 pl-[30px] text-[14px] uppercase tracking-[0.14em]"
                onClick={() => setOpen(false)}
              />
            </nav>
            <Link className="mobile-menu-campaign relative min-h-[260px] overflow-hidden border-y border-black/16 text-[#f0eee7]" href="/collections" onClick={() => setOpen(false)}>
              <Image
                alt="LOW SIGNAL Spring 2026 collection"
                className="object-cover object-[50%_42%] brightness-[0.68] contrast-[1.08] saturate-[0.62]"
                fill
                sizes="46vw"
                src="/images/low-signal/products/product-01.jpg"
              />
              <div className="absolute inset-0 bg-black/22" />
              <div className="absolute inset-0 grid content-between p-4 text-[9px] uppercase tracking-[0.14em]">
                <span>01 / 05</span>
                <span className="controlled-display-title text-[28px]">Spring<br />2026</span>
                <span className="w-fit border-b border-white/60 pb-1">Shop →</span>
              </div>
            </Link>
          </div>
          <nav aria-label="Secondary navigation" className="mobile-menu-secondary mt-6 grid grid-cols-2 gap-4 text-[12px] uppercase tracking-[0.12em] text-black/62">
            <Link href="/collections" onClick={() => setOpen(false)}>Search</Link>
            <Link href="/account" onClick={() => setOpen(false)}>Account</Link>
            <a href="https://instagram.com">Instagram</a>
            <a href="mailto:studio@lowsignal.com">Contact</a>
          </nav>
        </div>
      ) : null}
    </div>
  );
}
