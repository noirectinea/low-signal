import Image from "next/image";
import Link from "next/link";
import { LogoMark } from "@/components/LogoMark";

const descriptionBlocks = [
  {
    title: "Brand idea",
    text: "LOW SIGNAL is a fictional independent clothing label built around quiet presence, daily repeat, and garments that do not ask to be noticed.",
  },
  {
    title: "Material & form",
    text: "The clothing mood is washed black fabric, dry cotton, wool texture, concrete light, and shapes that sit close to routine rather than performance.",
  },
  {
    title: "Site concept",
    text: "This website works as a full editorial ecommerce concept: collections, product pages, cart, checkout flow, lookbook, and brand story.",
  },
  {
    title: "Digital system",
    text: "The visual system is based on muted paper, concrete white, washed fabric tone, thin borders, quiet typography, and restrained product interaction.",
  },
];

const materialLanguage = [
  {
    title: "Washed black",
    text: "Garments sit between black and charcoal, softened by wear, wash, and shadow.",
  },
  {
    title: "Concrete light",
    text: "Cold daylight, dry rooms, and pale surfaces keep the product language quiet.",
  },
  {
    title: "Quiet volume",
    text: "Shapes are roomy without spectacle: coats, knit layers, and trousers with room to move.",
  },
  {
    title: "Daily repeat",
    text: "The system is built for pieces that can be worn often without becoming loud.",
  },
];

const projectDetails = [
  "Frontend direction",
  "Ecommerce flow",
  "Responsive layout",
  "Cart system",
  "Product pages",
  "Visual direction",
];

const footerLinks = [
  ["Collections", "/collections"],
  ["Lookbook", "/lookbook"],
  ["Contact", "#"],
  ["Instagram", "#"],
];

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#e7e7e1] text-[#11110f]">
      <AboutNav />

      <section className="grid min-h-screen border-b border-black/18 pt-[64px] lg:grid-cols-[42%_58%]">
        <div className="flex flex-col justify-between border-b border-black/18 bg-[#eeeee8] px-5 py-10 lg:border-b-0 lg:border-r lg:px-[4vw] lg:py-[7vh]">
          <div>
            <p className="text-[9px] uppercase tracking-[0.22em] text-black/48">
              About / Project note
            </p>
            <h1
              className="mt-10 font-serif text-[17vw] uppercase leading-[0.8] tracking-[-0.055em] text-[#11110f] sm:text-[92px] lg:text-[7vw]"
            >
              OBSERVES.
              <br />
              DOES NOT
              <br />
              EXPLAIN.
            </h1>
          </div>

          <p className="mt-12 max-w-[460px] border-t border-black/16 pt-6 text-[11px] uppercase leading-[1.76] tracking-[0.17em] text-black/60">
            A quiet fashion system for garments, images, and commerce. Built to
            feel editorial first, functional second, and never loud.
          </p>
        </div>

        <div className="grid bg-[#d9d9d1] lg:grid-cols-[1fr_34%]">
          <div className="px-5 py-10 lg:px-10 lg:py-[7vh]">
            <div className="border-b border-black/16 pb-7">
              <p className="text-[9px] uppercase tracking-[0.22em] text-black/45">
                LOW SIGNAL / System description
              </p>
              <p className="mt-8 max-w-[640px] text-[13px] uppercase leading-[1.75] tracking-[0.18em] text-black/70">
                LOW SIGNAL is an editorial ecommerce study for an independent
                clothing label: part catalog, part lookbook, part restrained
                brand archive.
              </p>
            </div>

            <div className="divide-y divide-black/14 border-b border-black/16">
              {descriptionBlocks.map((block) => (
                <section
                  className="grid gap-5 py-7 text-[9px] uppercase leading-[1.75] tracking-[0.16em] sm:grid-cols-[150px_1fr]"
                  key={block.title}
                >
                  <h2 className="text-black">{block.title}</h2>
                  <p className="max-w-[520px] text-black/54">{block.text}</p>
                </section>
              ))}
            </div>

            <div className="mt-8 grid gap-5 text-[9px] uppercase leading-[1.8] tracking-[0.18em] text-black/46 sm:grid-cols-3">
              <p>Muted paper</p>
              <p>Concrete light</p>
              <p>Washed black fabric</p>
            </div>
          </div>

          <aside className="grid border-t border-black/16 bg-[#cdcdc5] lg:border-l lg:border-t-0">
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
              <div className="flex flex-col justify-between px-5 py-6 text-[9px] uppercase leading-[1.75] tracking-[0.17em] text-black/52">
                <p>Material note / washed black / dry hand / low signal.</p>
                <Link href="/lookbook" className="w-fit border-b border-black/50 pb-1 text-black">
                  View lookbook -&gt;
                </Link>
              </div>
            </div>

            <div className="px-5 py-6 text-[9px] uppercase leading-[1.8] tracking-[0.18em] text-black/44">
              <p>Designed as a complete storefront direction: shop, cart, product detail, lookbook, and brand story.</p>
            </div>
          </aside>
        </div>
      </section>

      <AboutExpansion />

      <footer className="flex flex-wrap items-center justify-between gap-5 border-t border-black/18 bg-[#deded7] px-5 py-5 text-[9px] uppercase tracking-[0.18em] md:px-8">
        <span>LOW SIGNAL / BRAND SYSTEM</span>
        <nav className="flex flex-wrap gap-x-7 gap-y-3">
          {footerLinks.map(([label, href]) => (
            <Link key={label} href={href}>
              {label}
            </Link>
          ))}
        </nav>
      </footer>
    </main>
  );
}

function AboutExpansion() {
  return (
    <section className="border-b border-black/18 bg-[#deded7] px-5 py-12 lg:px-12 lg:py-16">
      <div className="mx-auto grid max-w-[1560px] gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="border-y border-black/16 py-7">
          <p className="text-[9px] uppercase tracking-[0.22em] text-black/46">
            A. Brand system
          </p>
          <h2 className="mt-8 max-w-[560px] font-serif text-[50px] uppercase leading-[0.82] tracking-[-0.055em] text-black/94 sm:text-[70px] lg:text-[86px]">
            Quiet clothing,
            <br />
            built to sell.
          </h2>
          <p className="mt-9 max-w-[540px] text-[11px] uppercase leading-[1.82] tracking-[0.17em] text-black/60">
            LOW SIGNAL is a fictional independent clothing label with a quiet
            presence: washed black garments, daily repeat, no loud logos, and
            product decisions that stay close to routine.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[0.75fr_1fr]">
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
            <section className="border-b border-black/14 py-7 text-[9px] uppercase leading-[1.8] tracking-[0.17em]">
              <p className="text-black">B. Digital ecommerce concept</p>
              <p className="mt-7 max-w-[560px] text-black/54">
                The site works as a full ecommerce concept: collection entry,
                gender rails, product listing pages, product detail pages,
                cart, checkout direction, lookbook, and brand story.
              </p>
            </section>

            <section className="py-7">
              <p className="text-[9px] uppercase tracking-[0.22em] text-black/46">
                C. Material language
              </p>
              <div className="mt-6 grid gap-px bg-black/12 sm:grid-cols-2">
                {materialLanguage.map((item) => (
                  <div
                    className="bg-[#deded7] px-5 py-5 text-[9px] uppercase leading-[1.75] tracking-[0.16em]"
                    key={item.title}
                  >
                    <h3 className="text-black">{item.title}</h3>
                    <p className="mt-5 text-black/50">{item.text}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <div className="grid gap-4 lg:col-span-2 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="border-y border-black/16 py-7 text-[9px] uppercase leading-[1.8] tracking-[0.17em]">
            <p className="text-black">D. Project details</p>
            <p className="mt-7 max-w-[700px] text-black/54">
              A portfolio ecommerce system for a fashion label: structured
              product shopping, cart behavior, responsive catalog layouts, and
              visual direction that stays cold, minimal, and commercial.
            </p>
            <div className="mt-8 grid gap-px bg-black/12 sm:grid-cols-3">
              {projectDetails.map((detail) => (
                <span
                  className="bg-[#deded7] px-4 py-4 text-black/56"
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
              <div className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-6 text-[9px] uppercase tracking-[0.18em] text-[#f4f0e8]/78">
                <span>Spring 2026 / shop system</span>
                <span className="border-b border-[#f4f0e8]/55 pb-[5px]">
                  Enter collection →
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

function AboutNav() {
  return (
    <nav className="fixed left-0 right-0 top-0 z-30 grid min-h-[64px] grid-cols-[1fr_auto] items-start gap-6 border-b border-black/16 bg-[#e3e3dc]/92 px-5 py-5 text-[9px] uppercase tracking-[0.18em] text-[#141311] backdrop-blur-sm md:grid-cols-[1fr_auto_1fr] lg:px-12">
      <LogoMark />

      <div className="hidden justify-center gap-14 md:flex">
        <Link href="/">Home</Link>
        <Link href="/collections">Collections</Link>
        <Link href="/lookbook">Lookbook</Link>
        <Link className="border-b border-black pb-2" href="/about">
          About
        </Link>
      </div>

      <div className="flex justify-end">
        <Link href="/cart">Cart</Link>
      </div>
    </nav>
  );
}
