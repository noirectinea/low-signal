import Image from "next/image";
import Link from "next/link";
import { PublicFooter } from "@/components/PublicFooter";
import { PublicNavigation } from "@/components/PublicNavigation";

const chapters = [
  {
    number: "01",
    title: "The label",
    body: [
      "LOW SIGNAL began with the idea that clothing does not need to announce itself to be remembered.",
      "We make outer layers, compact knitwear, wide trousers, and shirts designed to return to throughout the week.",
    ],
  },
  {
    number: "02",
    title: "Material",
    body: [
      "Washed cotton, dry wool, worn nylon, and muted hardware.",
      "Surfaces change slowly through friction, weather, movement, and repeated wear. Creases and softened edges are part of the garment, not defects to hide.",
    ],
  },
  {
    number: "03",
    title: "Form",
    body: [
      "Roomy without becoming theatrical.",
      "The silhouette stays relaxed, practical, and slightly removed from the body, allowing fabric and movement to shape it over time.",
    ],
  },
  {
    number: "04",
    title: "Approach",
    body: [
      "Small collections. Limited repetition. No seasonal noise.",
      "Each release is built as a connected rail, with pieces sharing weight, proportion, color, and purpose.",
    ],
  },
] as const;

export const metadata = {
  title: "About / LOW SIGNAL",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#e7e7e1] text-[#11110f]">
      <PublicNavigation />

      <section className="grid min-h-[92svh] border-b border-black/16 pt-16 lg:grid-cols-[44%_56%]">
        <div className="flex flex-col justify-between border-b border-black/16 px-5 py-12 lg:border-b-0 lg:border-r lg:px-[4vw] lg:py-[8vh]">
          <div>
            <p className="micro-label text-black/62">About / LOW SIGNAL</p>
            <h1 className="controlled-display-title mt-10 text-[16vw] text-black/94 sm:text-[84px] lg:text-[6.4vw]">
              OBSERVES.
              <br />
              DOES NOT
              <br />
              EXPLAIN.
            </h1>
          </div>

          <p className="supporting-copy mt-14 max-w-[470px] border-t border-black/16 pt-6 text-black/68">
            LOW SIGNAL creates clothing for daily repetition, built around
            washed fabrics, restrained volume, and forms that become more
            personal with wear.
          </p>
        </div>

        <div className="relative min-h-[66svh] bg-[#151413] lg:min-h-0">
          <Image
            alt="LOW SIGNAL model wearing a washed black outer layer"
            className="object-cover object-[50%_43%] brightness-[0.78] contrast-[1.05] saturate-[0.66]"
            fill
            priority
            sizes="(min-width: 1024px) 56vw, 100vw"
            src="/images/low-signal/lookbook-campaign/concrete-male-look.png"
          />
          <div className="absolute inset-x-5 bottom-5 flex justify-between gap-6 text-[10px] font-medium uppercase tracking-[0.12em] text-[#f4f0e8]/76 lg:inset-x-8 lg:bottom-8">
            <span>Spring 2026 / Frame 05</span>
            <span>Concrete room</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1680px] px-5 py-16 lg:px-12 lg:py-24">
        <div className="grid gap-16 lg:grid-cols-[0.72fr_1.28fr] lg:gap-24">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <p className="micro-label text-black/62">Index / 01–04</p>
            <p className="mt-8 max-w-[290px] font-[var(--font-display-archival)] text-[25px] italic leading-[1.25] text-black/72">
              Made for people who observe first.
            </p>
          </aside>

          <div className="border-t border-black/16">
            {chapters.map((chapter) => (
              <section
                className="grid gap-8 border-b border-black/16 py-10 sm:grid-cols-[96px_180px_1fr] lg:py-14"
                key={chapter.number}
              >
                <p className="micro-label text-black/52">{chapter.number}</p>
                <h2 className="text-[13px] font-medium uppercase tracking-[0.1em]">
                  {chapter.title}
                </h2>
                <div className="grid max-w-[610px] gap-5">
                  {chapter.body.map((paragraph) => (
                    <p
                      className="supporting-copy text-[15px] text-black/68"
                      key={paragraph}
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </section>

      <section className="grid border-y border-black/16 bg-[#d8d9d2] lg:grid-cols-[1.2fr_0.8fr]">
        <div className="relative min-h-[62svh] overflow-hidden border-b border-black/16 bg-[#151413] lg:border-b-0 lg:border-r">
          <Image
            alt="LOW SIGNAL black garments moving beside coastal concrete"
            className="object-cover brightness-[0.76] contrast-[1.06] saturate-[0.62]"
            fill
            sizes="(min-width: 1024px) 60vw, 100vw"
            src="/images/low-signal/lookbook-campaign/coastal-movement.png"
          />
          <p className="micro-label absolute bottom-6 left-6 text-[#f4f0e8]/76">
            Field Jacket / Washed cotton canvas
          </p>
        </div>

        <div className="grid grid-rows-[1fr_auto]">
          <div className="relative min-h-[360px] overflow-hidden border-b border-black/16 bg-[#151413]">
            <Image
              alt="Close view of washed black rib knit and garment hardware"
              className="object-cover brightness-[0.82] contrast-[1.07] saturate-[0.64]"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              src="/images/low-signal/selected-collection/material-detail.png"
            />
            <p className="micro-label absolute bottom-6 left-6 text-[#f4f0e8]/76">
              Material note / Rib knit / Matte finish
            </p>
          </div>

          <div className="px-6 py-10 lg:px-10 lg:py-12">
            <p className="supporting-copy max-w-[420px] text-black/66">
              The collection is made to be handled, layered, washed, and worn
              into a personal rhythm.
            </p>
            <Link className="text-link mt-8 inline-flex text-[10px] font-medium uppercase tracking-[0.1em]" href="/collections">
              Explore Spring 2026 →
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
