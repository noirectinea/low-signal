import Link from "next/link";
import { CartCountLink } from "@/components/CartCountLink";
import { LogoMark } from "@/components/LogoMark";

export default function ProductLoading() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#e7e7e1] text-[#141311]">
      <nav className="fixed left-0 right-0 top-0 z-30 grid min-h-[64px] grid-cols-[1fr_auto] items-start gap-6 border-b border-black/16 bg-[#e3e3dc]/92 px-5 py-5 text-[9px] uppercase tracking-[0.18em] text-[#141311] backdrop-blur-sm md:grid-cols-[1fr_auto_1fr] lg:px-12">
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

      <section className="grid px-5 pb-16 pt-[92px] lg:min-h-screen lg:grid-cols-[58%_42%] lg:px-0 lg:pb-0 lg:pt-[64px]">
        <div className="grid gap-4 lg:grid-cols-[104px_1fr] lg:border-r lg:border-black/16 lg:p-8 xl:grid-cols-[124px_1fr] xl:p-10">
          <div className="order-2 grid grid-cols-3 gap-3 lg:order-1 lg:grid-cols-1">
            {[0, 1, 2].map((item) => (
              <div
                className="aspect-[4/5] border border-black/12 bg-black/[0.04]"
                key={item}
              />
            ))}
          </div>
          <div className="order-1 min-h-[68vh] border border-black/12 bg-black/[0.04] lg:order-2 lg:min-h-0" />
        </div>
        <div className="pt-10 lg:bg-[#ddddd6] lg:px-12 lg:py-12 xl:px-16">
          <div className="border-y border-black/16 py-10 text-[9px] uppercase tracking-[0.16em] text-black/64">
            Loading garment.
          </div>
        </div>
      </section>
    </main>
  );
}
