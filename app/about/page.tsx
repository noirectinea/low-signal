import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { MobileHomeHeader } from "@/components/MobileHomeHeader";
import { SiteFooter } from "@/components/SiteFooter";

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
  description:
    "About LOW SIGNAL: clothing shaped by proportion, tactile materials, relaxed volume, and daily use.",
  openGraph: {
    description:
      "About LOW SIGNAL: clothing shaped by proportion, tactile materials, relaxed volume, and daily use.",
    images: [
      {
        alt: "LOW SIGNAL Spring 2026 coastal campaign",
        height: 630,
        url: "/images/low-signal/og-preview.jpg",
        width: 1200,
      },
    ],
    title: "About / LOW SIGNAL",
    type: "website",
    url: "/about",
  },
  title: "About / LOW SIGNAL",
  twitter: {
    card: "summary_large_image",
    description:
      "Clothing shaped by proportion, tactile materials, relaxed volume, and daily use.",
    images: ["/images/low-signal/og-preview.jpg"],
    title: "About / LOW SIGNAL",
  },
};

const approachBlocks = [
  {
    title: "Daily repeat",
    text: "A compact set of pieces moves easily between work, travel, and ordinary days.",
  },
  {
    title: "Washed black",
    text: "Black, charcoal, stone, and paper tones gain depth as their surfaces soften.",
  },
  {
    title: "Quiet volume",
    text: "Room through the body keeps layers balanced without unnecessary bulk.",
  },
];

const materialLanguage = [
  {
    title: "Dry cotton",
    text: "A crisp hand that creases naturally.",
  },
  {
    title: "Wool texture",
    text: "Matte structure and warmth without weight.",
  },
  {
    title: "Raw canvas",
    text: "Dense plain weave for everyday outer layers.",
  },
  {
    title: "Worn nylon",
    text: "Light protection with a low-shine finish.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#e7e7e1] text-[#11110f]">
      <MobileHomeHeader mode="paper" />

      <section className="mobile-about-hero grid min-h-screen border-b border-black/18 pt-[64px] lg:grid-cols-[42%_58%]">
        <div className="mobile-about-statement flex flex-col justify-between border-b border-black/18 bg-[#eeeee8] px-5 py-10 lg:border-b-0 lg:border-r lg:px-[4vw] lg:py-[7vh]">
          <div>
            <p className="text-[9px] uppercase tracking-[0.18em] text-black/54">
              About / Low Signal
            </p>
            <h1 className="controlled-display-title mt-10 text-[17vw] uppercase text-[#11110f] sm:text-[92px] lg:text-[7vw]">
              MATERIAL
              <br />
              FIRST.
              <br />
              WORN OFTEN.
            </h1>
          </div>

          <p className="about-body-copy mt-12 max-w-[460px] border-t border-black/16 pt-6 uppercase">
            LOW SIGNAL builds a compact wardrobe around proportion, texture,
            and daily use.
          </p>
        </div>

        <div className="mobile-about-system grid bg-[#d9d9d1] lg:grid-cols-[1fr_34%]">
          <div className="mobile-about-principles px-5 py-10 lg:px-10 lg:py-[7vh]">
            <div className="border-b border-black/16 pb-7">
              <p className="about-label uppercase text-black/54">
                Form, texture, use
              </p>
              <p className="about-body-copy mt-8 max-w-[650px] uppercase">
                Relaxed outer layers and straight, wide cuts leave space for
                movement and simple layering.
              </p>
            </div>

            <div className="divide-y divide-black/14 border-b border-black/16">
              {approachBlocks.map((block) => (
                <section
                  className="grid gap-5 py-7 uppercase sm:grid-cols-[150px_1fr]"
                  key={block.title}
                >
                  <h2 className="about-label text-black">{block.title}</h2>
                  <p className="about-body-copy max-w-[520px]">{block.text}</p>
                </section>
              ))}
            </div>

            <div className="mt-8 grid gap-5 text-[9px] uppercase leading-[1.8] tracking-[0.16em] text-black/56 sm:grid-cols-3">
              <p>Muted paper</p>
              <p>Concrete light</p>
              <p>Dry texture</p>
            </div>
          </div>

          <aside className="mobile-about-images grid border-t border-black/16 bg-[#cdcdc5] lg:border-l lg:border-t-0">
            <div className="relative min-h-[360px] border-b border-black/16 bg-[#151413] lg:min-h-0">
              <Image
                alt="LOW SIGNAL garment detail"
                src="/images/low-signal/selected-garments-detail.jpg"
                fill
                sizes="(min-width: 1024px) 20vw, 100vw"
                className="object-cover object-center brightness-[0.82] contrast-[1.05] saturate-[0.68]"
              />
            </div>

            <div className="grid min-h-[220px] grid-cols-[42%_1fr] border-b border-black/16">
              <div className="relative bg-[#151413]">
                <Image
                  alt="LOW SIGNAL material form"
                  src="/images/low-signal/selected-collection/material-form.jpg"
                  fill
                  sizes="(min-width: 1024px) 10vw, 42vw"
                  className="object-cover brightness-[0.84] contrast-[1.04] saturate-[0.7]"
                />
              </div>
              <div className="flex flex-col justify-between px-5 py-6 uppercase text-black/58">
                <p className="about-body-copy">Dry hand / dense weave / low-shine surface.</p>
                <Link
                  href="/lookbook"
                  className="about-label w-fit border-b border-black/50 pb-1 text-black"
                >
                  View lookbook →
                </Link>
              </div>
            </div>

            <div className="px-5 py-6 uppercase text-black/54">
              <p className="about-body-copy">
                Texture, weight, and surface guide each material choice.
              </p>
            </div>
          </aside>
        </div>
      </section>

      <AboutExpansion />
      <SiteFooter />

    </main>
  );
}

function AboutExpansion() {
  return (
    <section className="mobile-about-expansion border-b border-black/18 bg-[#deded7] px-5 py-12 lg:px-12 lg:py-16">
      <div className="mx-auto grid max-w-[1560px] gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="mobile-about-uniform grid gap-4 lg:col-span-2 lg:grid-cols-[0.75fr_1fr]">
          <div className="relative min-h-[420px] overflow-hidden border border-black/14 bg-[#151413]">
            <Image
              alt="LOW SIGNAL model in washed black clothing"
              src="/images/low-signal/products/product-06.jpg"
              fill
              sizes="(min-width: 1024px) 30vw, 90vw"
              className="object-cover object-[50%_43%] brightness-[0.8] contrast-[1.06] saturate-[0.66]"
            />
          </div>

          <div className="grid border-y border-black/16">
            <section className="border-b border-black/14 py-7 uppercase">
              <p className="about-label text-black">B. Daily use</p>
              <p className="about-body-copy mt-7 max-w-[560px]">
                Jackets, shirts, knitwear, and trousers combine without a fixed
                look, leaving room to adjust the layers.
              </p>
            </section>

            <section className="py-7">
              <p className="about-label uppercase text-black/54">
                C. Material language
              </p>
              <div className="mt-6 grid gap-px bg-black/12 sm:grid-cols-2">
                {materialLanguage.map((item) => (
                  <div
                    className="bg-[#deded7] px-5 py-5 uppercase"
                    key={item.title}
                  >
                    <h3 className="about-label text-black">{item.title}</h3>
                    <p className="about-body-copy mt-5">{item.text}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <div className="grid gap-4 lg:col-span-2 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="border-y border-black/16 py-7 uppercase">
            <p className="about-label text-black">D. Wear notes</p>
            <p className="about-body-copy mt-7 max-w-[700px]">
              Creases, fading, and softened edges become part of the garment
              surface through use.
            </p>
            <div className="mt-8 grid gap-px bg-black/12 sm:grid-cols-3">
              {["Build in layers", "Let texture change", "Return to each piece"].map((detail) => (
                <span
                  className="about-label bg-[#deded7] px-4 py-4 text-black/60"
                  key={detail}
                >
                  {detail}
                </span>
              ))}
            </div>
          </section>

          <Link
            href="/collections"
            className="group grid min-h-[260px] overflow-hidden border border-black/14 bg-[#151413] text-[#f4f0e8]"
          >
            <div className="relative min-h-[260px]">
              <Image
                alt="LOW SIGNAL coastal lookbook figure"
                src="/images/low-signal/lookbook-coast.jpg"
                fill
                sizes="(min-width: 1024px) 34vw, 90vw"
                className="object-cover object-[58%_54%] brightness-[0.72] contrast-[1.06] saturate-[0.66] transition duration-700 group-hover:brightness-[0.82]"
              />
              <div className="absolute inset-0 bg-black/22" />
              <div className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-6 text-[9px] uppercase tracking-[0.16em] text-[#f4f0e8]/78">
                <span>Spring 2026 / current selection</span>
                <span className="border-b border-[#f4f0e8]/55 pb-[5px]">
                  Shop current selection →
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
