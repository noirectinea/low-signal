import { PublicNavigation } from "@/components/PublicNavigation";

export default function ProductLoading() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#e7e7e1] text-[#141311]">
      <PublicNavigation />

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
          <div aria-label="Loading garment details" className="grid gap-6 border-y border-black/16 py-10">
            <div className="h-12 w-3/4 animate-pulse bg-black/[0.045]" />
            <div className="h-3 w-1/3 animate-pulse bg-black/[0.045]" />
            <div className="h-24 w-full animate-pulse bg-black/[0.045]" />
          </div>
        </div>
      </section>
    </main>
  );
}
