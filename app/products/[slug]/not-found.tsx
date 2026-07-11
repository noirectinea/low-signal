import Link from "next/link";
import { PublicNavigation } from "@/components/PublicNavigation";

export default function ProductNotFound() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#e5e6e1] text-[#121211]">
      <PublicNavigation />

      <section className="mx-auto grid min-h-screen max-w-[1320px] content-center px-5 py-[104px] lg:px-12">
        <div className="border-y border-black/16 py-12">
          <p className="text-[9px] uppercase tracking-[0.16em] text-black/64">
            Product / Not found
          </p>
          <h1 className="controlled-display-title mt-8 max-w-[760px] text-[52px] uppercase sm:text-[74px]">
            Piece unavailable
          </h1>
          <Link
            className="mt-8 inline-flex border-b border-black/60 pb-1 text-[9px] uppercase tracking-[0.16em]"
            href="/collections"
          >
            Return to collections →
          </Link>
        </div>
      </section>
    </main>
  );
}
