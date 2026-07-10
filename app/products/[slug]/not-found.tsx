import Link from "next/link";
import { LogoMark } from "@/components/LogoMark";

export default function ProductNotFound() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#e5e6e1] text-[#121211]">
      <nav className="fixed left-0 right-0 top-0 z-30 grid min-h-[64px] grid-cols-[1fr_auto] items-start gap-6 border-b border-black/16 bg-[#e3e3dc]/92 px-5 py-5 text-[9px] uppercase tracking-[0.18em] text-[#141311] backdrop-blur-sm md:grid-cols-[1fr_auto_1fr] lg:px-12">
        <LogoMark />
        <div className="hidden justify-center gap-14 md:flex">
          <Link href="/">Home</Link>
          <Link href="/collections">Collections</Link>
          <Link href="/lookbook">Lookbook</Link>
          <Link href="/about">About</Link>
        </div>
        <div className="flex justify-end">
          <Link href="/cart">Cart</Link>
        </div>
      </nav>

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
            Return to collections -&gt;
          </Link>
        </div>
      </section>
    </main>
  );
}
