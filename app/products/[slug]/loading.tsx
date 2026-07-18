import { MobileHomeHeader } from "@/components/MobileHomeHeader";

export default function ProductLoading() {
  return (
    <main
      aria-busy="true"
      aria-live="polite"
      className="min-h-screen overflow-x-hidden bg-[#e7e7e1] text-[#141311]"
    >
      <MobileHomeHeader mode="paper" />

      <section className="mobile-product-page grid pb-16 pt-[64px] lg:min-h-screen lg:grid-cols-[58%_42%] lg:pb-0">
        <div className="mobile-product-gallery grid gap-4 lg:grid-cols-[104px_1fr] lg:border-r lg:border-black/16 lg:p-8 xl:grid-cols-[124px_1fr] xl:p-10">
          <div className="order-2 mx-5 grid grid-cols-3 gap-3 lg:order-1 lg:mx-0 lg:grid-cols-1">
            {[0, 1, 2].map((item) => (
              <div
                className="aspect-[4/5] animate-pulse border border-black/12 bg-black/[0.045]"
                key={item}
              />
            ))}
          </div>
          <div className="mobile-product-lead order-1 min-h-[62svh] animate-pulse border-y border-black/12 bg-black/[0.045] lg:order-2 lg:min-h-0 lg:border" />
        </div>

        <div className="mobile-product-information px-5 pt-7 lg:bg-[#ddddd6] lg:px-10 lg:py-9 xl:px-14">
          <div className="border-b border-black/16 pb-4">
            <div className="h-11 w-32 animate-pulse bg-black/[0.045]" />
          </div>
          <div className="border-b border-black/16 py-7">
            <div className="h-10 w-[min(78%,360px)] animate-pulse bg-black/[0.055]" />
            <div className="mt-5 h-3 w-28 animate-pulse bg-black/10" />
          </div>
          <div className="grid gap-4 border-b border-black/16 py-6">
            <div className="h-3 w-24 animate-pulse bg-black/10" />
            <div className="grid grid-cols-5 gap-px">
              {[0, 1, 2, 3, 4].map((item) => (
                <div className="h-11 animate-pulse bg-black/[0.045]" key={item} />
              ))}
            </div>
            <div className="h-14 animate-pulse bg-black/[0.065]" />
          </div>
          <div className="divide-y divide-black/14 border-b border-black/16">
            {["Product details", "Size guide", "Material & care"].map((label) => (
              <div
                className="flex min-h-12 items-center justify-between text-[10px] uppercase tracking-[0.1em] text-black/48"
                key={label}
              >
                <span>{label}</span>
                <span>+</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
