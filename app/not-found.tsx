import Link from "next/link";
import { MobileHomeHeader } from "@/components/MobileHomeHeader";
import { SiteFooter } from "@/components/SiteFooter";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#e5e6e1] text-[#121211]">
      <MobileHomeHeader mode="paper" />
      <section className="mx-auto grid min-h-[72svh] max-w-[1500px] content-center px-5 pb-16 pt-[104px] sm:px-6 lg:px-12">
        <div className="border-y border-black/16 py-10">
          <p className="text-[9px] uppercase tracking-[0.18em] text-black/48">
            404 / Signal not found
          </p>
          <h1 className="controlled-display-title mt-8 max-w-[900px] text-[54px] uppercase sm:text-[78px] lg:text-[96px]">
            This page went quiet.
          </h1>
          <p className="mt-7 max-w-[460px] text-[10px] uppercase leading-[1.8] tracking-[0.15em] text-black/58">
            The route may have moved. Your cart remains saved.
          </p>
          <div className="mt-9 flex flex-wrap gap-6 text-[10px] uppercase tracking-[0.14em]">
            <Link className="flex min-h-11 items-center border-b border-black/60" href="/collections">
              View collections →
            </Link>
            <Link className="flex min-h-11 items-center border-b border-black/35" href="/">
              Back home
            </Link>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
