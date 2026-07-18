import { MobileHomeHeader } from "@/components/MobileHomeHeader";

export default function CollectionsLoading() {
  return (
    <main
      aria-busy="true"
      aria-live="polite"
      className="min-h-screen overflow-x-hidden bg-[#e6e7e2] text-[#121211]"
    >
      <MobileHomeHeader mode="paper" />

      <section className="mx-auto max-w-[1680px] px-4 pb-14 pt-[88px] sm:px-6 lg:px-12 lg:pt-[104px]">
        <div className="border-b border-black/16 pb-5">
          <div className="h-2 w-40 animate-pulse bg-black/10" />
          <div className="mt-5 h-14 w-52 animate-pulse bg-black/[0.055] lg:h-20" />
        </div>

        <div className="my-5 h-[150px] animate-pulse border-y border-black/12 bg-black/[0.045] lg:h-[205px]" />

        <div className="grid min-h-12 grid-cols-2 gap-px border-y border-black/14 bg-black/10 sm:grid-cols-4">
          {[0, 1, 2, 3].map((item) => (
            <div className="bg-[#e6e7e2] p-4" key={item}>
              <div className="h-2 w-20 animate-pulse bg-black/10" />
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-5">
          {[0, 1, 2, 3].map((item) => (
            <div className="grid gap-3" key={item}>
              <div className="aspect-[4/5] animate-pulse bg-black/[0.055]" />
              <div className="h-3 w-2/3 animate-pulse bg-black/10" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
