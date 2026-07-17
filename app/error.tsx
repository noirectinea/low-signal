"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("low-signal-error", {
        detail: {
          digest: error.digest,
          message: error.message,
          route: window.location.pathname,
        },
      }),
    );
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center bg-[#e5e6e1] px-5 text-[#121211]">
      <section className="w-full max-w-[760px] border-y border-black/16 py-12">
        <p className="text-[9px] uppercase tracking-[0.18em] text-black/48">
          Error / Request interrupted
        </p>
        <h1 className="controlled-display-title mt-8 text-[48px] uppercase sm:text-[68px]">
          Something went quiet.
        </h1>
        <p className="mt-7 max-w-[440px] text-[10px] uppercase leading-[1.8] tracking-[0.15em] text-black/58">
          This page could not be completed. Your cart remains saved.
        </p>
        <div className="mt-9 flex flex-wrap gap-6 text-[10px] uppercase tracking-[0.14em]">
          <button
            className="min-h-11 border-b border-black/60"
            type="button"
            onClick={reset}
          >
            Try again
          </button>
          <Link className="flex min-h-11 items-center border-b border-black/35" href="/">
            Back home
          </Link>
        </div>
      </section>
    </main>
  );
}
