import Image from "next/image";
import Link from "next/link";
import { Libre_Caslon_Display } from "next/font/google";

const display = Libre_Caslon_Display({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const lookbookImages = [
  "/images/low-signal/products/product-01.jpg",
  "/images/low-signal/products/product-02.jpg",
  "/images/low-signal/products/product-03.jpg",
  "/images/low-signal/products/product-04.jpg",
  "/images/low-signal/products/product-05.jpg",
  "/images/low-signal/products/product-06.jpg",
  "/images/low-signal/products/product-07.jpg",
  "/images/low-signal/products/product-08.jpg",
  "/images/low-signal/products/product-09.jpg",
  "/images/low-signal/products/product-10.jpg",
  "/images/low-signal/products/product-11.jpg",
  "/images/low-signal/products/product-12.jpg",
];

const approach = [
  [
    "Material first",
    "We choose fabrics for how they wear, not how they look new.",
  ],
  ["Daily repeat", "Designed for routine, movement, and real conditions."],
  [
    "Small runs",
    "Produced in small quantities and only when it makes sense.",
  ],
  ["Long relationships", "The best garments are the ones you keep."],
];

const footerLinks = [
  ["Collections", "/collections"],
  ["Lookbook", "/#lookbook"],
  ["About", "/about"],
  ["Contact", "#"],
  ["Shipping", "#"],
  ["Instagram", "#"],
];

export default function AboutPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#c9c6bd] text-[#11110f]">
      <header className="grid border-b border-black/20 px-5 py-5 text-[8px] uppercase tracking-[0.18em] md:grid-cols-[1fr_auto_1fr] md:px-8">
        <Link href="/" className="font-medium leading-[0.95]">
          Low
          <br />
          Signal
        </Link>
        <nav className="mt-5 flex gap-8 md:mt-0">
          <Link href="/collections">Collections</Link>
          <Link href="/#lookbook">Lookbook</Link>
          <Link className="border-b border-black pb-1" href="/about">
            About
          </Link>
        </nav>
        <div className="mt-5 text-left md:mt-0 md:text-right">2026 / Issue 01</div>
      </header>

      <section className="grid min-h-[calc(100svh-102px)] border-b border-black/20 lg:grid-cols-[34vw_26vw_1fr]">
        <AboutColumn />
        <LookbookColumn />
        <LookGrid />
      </section>

      <footer className="flex flex-wrap items-center justify-between gap-5 border-t border-black/20 px-5 py-5 text-[8px] uppercase tracking-[0.17em] md:px-8">
        <span>Low Signal / About</span>
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

function AboutColumn() {
  return (
    <section className="border-b border-black/20 px-6 py-8 lg:border-b-0 lg:border-r lg:px-[4vw] lg:py-[7vh]">
      <p className="text-[9px] uppercase tracking-[0.22em] text-black/55">
        About
      </p>
      <h1
        className={`${display.className} mt-10 text-[18vw] leading-[0.82] tracking-[-0.055em] text-[#11110f] sm:text-[88px] lg:text-[7vw]`}
      >
        OBSERVES.
        <br />
        DOES NOT
        <br />
        EXPLAIN.
      </h1>

      <div className="mt-10 max-w-[560px] space-y-5 text-[10px] uppercase leading-[1.72] tracking-[0.15em] text-black/64">
        <p>
          Low Signal is an independent clothing label built around quiet
          presence, repeated wear, and garments that do not ask to be noticed.
        </p>
        <p>
          We design clothes for people who move through the day without
          performing for it. Each piece is cut for routine, weather, long walks,
          and small interruptions.
        </p>
        <p>
          The brand works with materials that age quietly: washed cotton, dry
          wool, raw canvas, worn nylon.
        </p>
        <p>
          Nothing is designed to shout. The pieces are made to disappear into a
          life, then return through texture, creases, wear, and memory.
        </p>
        <p className="text-black/78">No logos. No noise. Just clothes, people, and the places between.</p>
      </div>

      <div className="relative mt-10 h-[155px] overflow-hidden border border-black/15 bg-[#bdb8ae] md:h-[190px]">
        <Image
          src="/images/low-signal/selected-garments-detail.jpg"
          alt="Black garment fabric detail on a muted studio surface"
          fill
          sizes="34vw"
          className="object-cover object-center brightness-[0.84] contrast-[1.04] saturate-[0.78]"
        />
      </div>

      <div className="mt-10 border-t border-black/18 pt-6">
        <p className="text-[9px] uppercase tracking-[0.22em]">Our approach</p>
        <div className="mt-5 grid gap-0 border-t border-black/14">
          {approach.map(([title, text]) => (
            <div
              key={title}
              className="grid gap-3 border-b border-black/14 py-4 text-[8px] uppercase leading-[1.55] tracking-[0.15em] sm:grid-cols-[145px_1fr]"
            >
              <p className="text-black/82">{title}</p>
              <p className="text-black/48">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function LookbookColumn() {
  return (
    <section className="border-b border-black/20 bg-[#bebab1] px-6 py-8 lg:border-b-0 lg:border-r lg:px-[3vw] lg:py-[7vh]">
      <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.18em] text-black/62">
        <span>Lookbook</span>
        <span className="h-px w-7 bg-black/35" />
        <span>01</span>
      </div>
      <p className="mt-10 text-[10px] uppercase tracking-[0.22em]">
        Spring 2026
      </p>

      <div className="relative mt-8 h-[46svh] min-h-[390px] overflow-hidden border border-black/15 bg-[#151413]">
        <Image
          src="/images/hero/ch3.png"
          alt="LOW SIGNAL Spring 2026 lookbook model"
          fill
          sizes="28vw"
          className="object-cover object-[50%_22%] brightness-[0.76] contrast-[1.08] saturate-[0.72]"
        />
      </div>

      <div className="relative mt-5 h-[124px] overflow-hidden border border-black/14 bg-[#151413]">
        <Image
          src="/images/low-signal/lookbook-coast.jpg"
          alt="Muted coast lookbook image"
          fill
          sizes="26vw"
          className="object-cover object-[55%_52%] brightness-[0.82] contrast-[1.05] saturate-[0.72]"
        />
      </div>

      <div className="mt-8 space-y-5 border-y border-black/16 py-6 text-[10px] uppercase leading-[1.72] tracking-[0.17em] text-black/62">
        <p>
          A collection built on restraint, quiet structures, and small
          interruptions.
        </p>
        <p>
          Each look is a study in proportion, fabric, and movement.
        </p>
        <p>Photographed on location.</p>
      </div>
    </section>
  );
}

function LookGrid() {
  return (
    <section className="bg-[#c4c1b8] px-5 py-8 lg:px-[2.5vw] lg:py-[7vh]">
      <div className="mb-8 flex items-center justify-between border-b border-black/18 pb-5 text-[8px] uppercase tracking-[0.18em]">
        <span>Lookbook grid</span>
        <span>12 looks</span>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-7 sm:grid-cols-3 xl:grid-cols-4">
        {lookbookImages.map((src, index) => (
          <figure key={src} className={index % 3 === 1 ? "pt-5" : ""}>
            <div className="relative aspect-[3/4] overflow-hidden border border-black/14 bg-[#b8b4aa]">
              <Image
                src={src}
                alt={`LOW SIGNAL look ${String(index + 1).padStart(2, "0")}`}
                fill
                sizes="(min-width: 1280px) 12vw, (min-width: 640px) 24vw, 42vw"
                className="object-cover object-center brightness-[0.86] contrast-[1.04] saturate-[0.76]"
              />
            </div>
            <figcaption className="mt-3 flex justify-between border-t border-black/14 pt-2 text-[8px] uppercase tracking-[0.18em] text-black/48">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <span>Spring 2026</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
