import Image from "next/image";

export function Hero() {
  return (
    <section className="relative min-h-[92svh] w-full overflow-hidden bg-low-black pt-20">
      <div className="mx-auto grid min-h-[calc(92svh-80px)] max-w-[1500px] grid-cols-12 gap-x-4 px-4 pb-8 sm:px-6 lg:px-8">
        <div className="relative col-span-12 mt-8 min-h-[62svh] md:col-span-7 md:col-start-1 md:mt-12 lg:col-span-6">
          <Image
            src="/images/hero/13091_9ef0622c3f-stussy-vol10_7-rtail-big.webp"
            alt="LOW SIGNAL editorial silhouette in a quiet landscape"
            fill
            priority
            sizes="(min-width: 1024px) 48vw, 100vw"
            className="editorial-image object-cover object-[45%_35%]"
          />
          <div className="absolute -right-8 top-10 hidden h-px w-32 bg-low-line md:block" />
          <div className="absolute bottom-6 left-5 max-w-44 text-[10px] uppercase leading-relaxed tracking-[0.18em] text-low-paper/78">
            Independent clothing for people who observe first.
          </div>
        </div>

        <div className="col-span-12 flex flex-col justify-between pt-10 md:col-span-5 md:col-start-8 md:pt-20 lg:col-span-5 lg:col-start-8">
          <div>
            <p className="mb-5 text-[10px] uppercase tracking-[0.22em] text-low-muted">
              Observes. Does not explain.
            </p>
            <h1 className="font-serif text-[clamp(4.8rem,14vw,13rem)] font-medium leading-[0.78] text-low-fog">
              LOW
              <br />
              SIGNAL
            </h1>
          </div>

          <div className="mt-10 grid grid-cols-5 gap-4 border-t border-low-line pt-6 md:mt-0">
            <p className="col-span-5 font-serif text-2xl leading-[1.08] text-low-paper md:col-span-4 md:text-3xl">
              A brand that behaves like a note found between pages.
            </p>
            <p className="col-span-4 col-start-2 mt-10 text-sm leading-6 text-low-muted md:col-span-3 md:col-start-3">
              Not minimal. Not polished. A restrained system of garments,
              pauses, documents, and unresolved images.
            </p>
          </div>
        </div>

        <div className="col-span-10 col-start-2 mt-10 grid grid-cols-2 gap-4 border-y border-low-line py-3 text-[10px] uppercase tracking-[0.16em] text-low-muted md:col-span-8 md:col-start-5">
          <span>No perfect grid</span>
          <span className="text-right">No loud product push</span>
        </div>
      </div>
    </section>
  );
}
