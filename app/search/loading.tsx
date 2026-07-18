import { MobileHomeHeader } from "@/components/MobileHomeHeader";

export default function SearchLoading() {
  return (
    <main
      aria-busy="true"
      aria-live="polite"
      className="min-h-screen bg-[#e5e6e1] text-[#121211]"
    >
      <MobileHomeHeader mode="paper" />
      <section className="mx-auto max-w-[1600px] px-5 pb-20 pt-[96px] sm:px-6 lg:px-12 lg:pt-[112px]">
        <header className="grid gap-8 border-b border-black/16 pb-8 lg:grid-cols-[1fr_1.2fr] lg:items-end">
          <div>
            <div className="h-2 w-28 animate-pulse bg-black/10" />
            <div className="mt-7 h-12 w-[min(78vw,430px)] animate-pulse bg-black/[0.055] lg:h-20" />
          </div>
          <div className="grid gap-3 border-y border-black/18 py-5">
            <div className="h-3 w-56 animate-pulse bg-black/10" />
            <div className="h-11 w-full animate-pulse bg-black/[0.045]" />
          </div>
        </header>
        <div className="grid grid-cols-2 gap-3 py-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
          {[0, 1, 2, 3].map((item) => (
            <div className="grid gap-4" key={item}>
              <div className="aspect-[4/5] animate-pulse bg-black/[0.055]" />
              <div className="h-3 w-2/3 animate-pulse bg-black/10" />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
