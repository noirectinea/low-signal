import Link from "next/link";
import { CartCountLink } from "@/components/CartCountLink";
import { LogoMark } from "@/components/LogoMark";

export default function CollectionsLoading() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#e6e7e2] text-[#121211]">
      <nav className="fixed left-0 right-0 top-0 z-30 grid min-h-[64px] grid-cols-[1fr_auto] items-start gap-6 border-b border-black/14 bg-[#e1e2dd]/94 px-5 py-5 text-[9px] uppercase tracking-[0.18em] text-[#121211] backdrop-blur-sm md:grid-cols-[1fr_auto_1fr] lg:px-12">
        <LogoMark />
        <div className="hidden justify-center gap-14 md:flex">
          <Link href="/">Home</Link>
          <Link href="/collections">Collections</Link>
          <Link href="/lookbook">Lookbook</Link>
          <Link href="/about">About</Link>
        </div>
        <div className="flex justify-end">
          <CartCountLink />
        </div>
      </nav>

      <section className="mx-auto grid min-h-screen max-w-[1320px] content-center px-5 py-[104px] lg:px-12">
        <div className="border-y border-black/16 py-12 text-[9px] uppercase tracking-[0.16em] text-black/64">
          Loading collection.
        </div>
      </section>
    </main>
  );
}
