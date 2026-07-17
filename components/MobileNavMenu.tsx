"use client";

import Link from "next/link";
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
          className="absolute left-0 right-0 top-16 z-[70] h-[calc(100svh-4rem)] overflow-y-auto border-b border-current bg-[#e4e5df] p-5 text-[#121211]"
          id="mobile-site-menu"
          role="dialog"
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
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
          <Link className="mt-6 grid min-h-[148px] grid-cols-[1fr_auto] content-between border-y border-black/16 py-5 text-[12px] uppercase leading-[1.45] tracking-[0.14em] text-black" href="/collections" onClick={() => setOpen(false)}>
            <span className="max-w-[180px] text-[26px] leading-[0.92] tracking-[0.02em]">Spring 2026</span>
            <span className="text-[9px] text-black/50">01 / 05</span>
            <span className="col-span-2 w-fit border-b border-black/60 pb-1 text-[10px]">Shop collection →</span>
          </Link>
          <nav aria-label="Secondary navigation" className="mt-6 grid grid-cols-2 gap-4 text-[12px] uppercase tracking-[0.12em] text-black/62">
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
