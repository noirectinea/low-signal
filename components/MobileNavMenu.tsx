"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CartCountLink } from "./CartCountLink";

const links = [
  ["Home", "/"],
  ["Collections", "/collections"],
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
  const pathname = usePathname();
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
          className="mobile-menu-panel fixed inset-x-0 bottom-0 top-16 z-[70] h-[calc(100dvh-4rem)] overflow-hidden border-b border-current bg-[#e4e5df] text-[#121211]"
          id="mobile-site-menu"
          role="dialog"
          onPointerDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <div className="mobile-menu-meta">
            <span>Navigation / 01</span>
            <span>Spring 2026</span>
          </div>

          <div className="mobile-menu-composition">
            <nav aria-label="Mobile navigation" className="mobile-menu-primary">
              {links.map(([label, href], index) => (
                <Link
                  aria-current={pathname === href ? "page" : undefined}
                  className="mobile-menu-primary-link"
                  href={href}
                  key={href}
                  ref={index === 0 ? firstLinkRef : undefined}
                  onClick={() => setOpen(false)}
                >
                  <span className="mobile-menu-index">{String(index + 1).padStart(2, "0")}</span>
                  <span className="mobile-menu-label">{label}</span>
                  <span aria-hidden="true" className="mobile-menu-arrow">→</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="mobile-menu-lower">
            <nav aria-label="Utility navigation" className="mobile-menu-utility">
              <Link href="/search" onClick={() => setOpen(false)}>Search</Link>
              <Link href="/account" onClick={() => setOpen(false)}>Account</Link>
              <CartCountLink onClick={() => setOpen(false)} />
            </nav>
            <nav aria-label="Service navigation" className="mobile-menu-secondary">
              <Link href="/info#shipping" onClick={() => setOpen(false)}>Shipping</Link>
              <Link href="/info#returns" onClick={() => setOpen(false)}>Returns</Link>
              <Link href="/info#contact" onClick={() => setOpen(false)}>Contact</Link>
              <Link href="/info#privacy" onClick={() => setOpen(false)}>Privacy</Link>
              <Link href="/info#terms" onClick={() => setOpen(false)}>Terms</Link>
              <Link href="/info#cookies" onClick={() => setOpen(false)}>Cookies</Link>
              <a
                href="https://www.instagram.com/lowsignal/"
                rel="noreferrer"
                target="_blank"
              >
                Instagram ↗
              </a>
              <Link href="/admin" onClick={() => setOpen(false)}>Admin ↗</Link>
            </nav>
            <div className="mobile-menu-legal">
              <span>© 2026 LOW SIGNAL</span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
