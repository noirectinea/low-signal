import Image from "next/image";
import Link from "next/link";
import { HomeSelectedPieces } from "@/components/HomeSelectedPieces";
import { MaterialForm } from "@/components/MaterialForm";
import { MobileHomeHeader } from "@/components/MobileHomeHeader";
import { SiteFooter } from "@/components/SiteFooter";

const heroImage = "/images/hero/ch1.png";
const collectionImage = "/images/hero/ch3.png";
const lookbookImage = "/images/low-signal/lookbook-coast.jpg";
const lookbookDetailImages = [
  ["/images/low-signal/journal/fabric-detail.jpg", "Fabric detail"],
  ["/images/low-signal/journal/road-coast.jpg", "Road / cloudy coast"],
  ["/images/low-signal/journal/garment-chair.jpg", "Garment on chair"],
  ["/images/low-signal/journal/hardware-detail.jpg", "Button / label detail"],
  ["/images/low-signal/journal/studio-table.jpg", "Studio table note"],
];

const lookbookRows = [
  ["01", "Coastal light"],
  ["02", "Material detail"],
  ["03", "Concrete room"],
  ["04", "Final look"],
];
export default function Home() {
  return (
    <main className="mobile-home-root min-h-screen w-full bg-[#e4e5df] text-[#111]">
      <MobileHomeHeader />
      <section className="order-1 grid w-full bg-[#e4e5df] lg:order-none lg:h-[100svh] lg:grid-rows-[65fr_35fr]">
        <HeroPanel />
        <EditorialGrid />
      </section>
      <HomeSelectedPieces />
      <MaterialForm />
      <LookbookContinuation />
      <SiteFooter />
    </main>
  );
}

function HeroPanel() {
  return (
    <section className="mobile-home-hero relative min-h-[100svh] overflow-hidden border-b border-black/20 bg-[#e4e5df] lg:h-full lg:min-h-0">
      <div className="absolute inset-y-0 left-0 w-[32%] bg-[#e4e5df] lg:w-[29.5vw]" />
      <div className="absolute inset-y-0 left-[32%] right-0 lg:left-[29.5vw]">
        <Image
          src={heroImage}
          alt="LOW SIGNAL editorial portrait in a black coat"
          fill
          priority
          sizes="(min-width: 1024px) 70vw, 68vw"
          className="hero-image hidden object-cover object-[50%_20%] lg:block"
          unoptimized
        />
        <Image
          src="/images/hero/ch1-mobile-2x.png"
          alt="LOW SIGNAL editorial portrait in a black coat"
          fill
          priority
          quality={95}
          sizes="72vw"
          className="mobile-hero-image hero-image object-cover object-center lg:hidden"
        />
        <div className="absolute inset-0 bg-[#d8cfc1]/10 mix-blend-screen" />
        <div className="mobile-hero-title-gradient absolute inset-0 lg:hidden" />
      </div>

      <div className="absolute left-[5.15vw] top-1/2 z-20 hidden w-[210px] -translate-y-1/2 flex-col items-start lg:flex">
        <Kicker number="01" />
        <p className="mt-[26px] max-w-[205px] text-[12px] uppercase leading-[1.52] tracking-[0.19em]">
          Washed black clothing for daily wear.
        </p>
        <div className="mt-[32px] grid gap-3 text-[10px] uppercase tracking-[0.18em]">
          <Link
            className="group inline-flex w-fit items-center gap-3 border-b border-black/70 pb-[6px] transition-opacity duration-300 hover:opacity-55"
            href="/collections"
          >
            <span>Shop Spring 2026</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
          <Link
            className="group inline-flex w-fit items-center gap-3 border-b border-black/45 pb-[6px] transition-opacity duration-300 hover:opacity-55"
            href="/lookbook"
          >
            <span>View Lookbook</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
        <Link className="mt-[22px] inline-flex border-b border-black/28 pb-[5px] text-[8px] uppercase tracking-[0.16em] text-black/52 transition-opacity duration-300 hover:opacity-60" href="/about">
          About the brand
        </Link>
      </div>

      <div className="absolute bottom-[30px] left-[5.15vw] z-20 hidden w-[210px] grid-cols-3 gap-4 border-t border-black/18 pt-4 text-[7px] uppercase leading-[1.45] tracking-[0.16em] text-black/42 lg:grid">
        <span>Daily repeat</span>
        <span>Quiet cut</span>
        <span>Low signal</span>
      </div>

      <p className="mobile-hero-season absolute left-5 top-[104px] z-30 max-w-[112px] text-[9px] uppercase leading-[1.45] tracking-[0.18em] text-black/68 lg:left-auto lg:right-[74px] lg:max-w-[84px] lg:leading-[1.34]">
        <span className="lg:hidden">Spring 2026<br />Washed Black</span>
        <span className="hidden lg:inline">Spring 2026 / Washed Black</span>
      </p>

      <h1
        className="hero-printed-title absolute left-[5%] top-[56%] z-30 text-[clamp(4.8rem,22vw,6.8rem)] uppercase lg:left-[42.2vw] lg:top-[25.8%] lg:text-[13.4vw]"
      >
        LOW
        <br />
        SIGNAL
      </h1>

      <div className="mobile-hero-actions absolute inset-x-5 bottom-5 z-30 grid grid-cols-[29%_1fr] gap-4 border-t border-black/34 pt-3 lg:hidden">
        <p className="min-w-0 text-[10px] uppercase leading-[1.55] tracking-[0.1em] text-black/76">
          <span className="block whitespace-nowrap">Washed black.</span>
          <span className="block whitespace-nowrap">Made for daily wear.</span>
        </p>
        <div className="mobile-hero-cta grid min-w-0 text-[11px] uppercase tracking-[0.08em] text-[#f5f2ed]">
          <Link className="mobile-hero-cta-primary flex min-h-11 items-center whitespace-nowrap border-b border-[#f5f2ed]/78" href="/collections">Shop Spring 2026 →</Link>
          <Link className="mobile-hero-cta-secondary flex min-h-11 w-fit items-center border-b border-[#f5f2ed]/48 text-[#f5f2ed]/82" href="/lookbook">View Lookbook →</Link>
        </div>
      </div>

      <p className="absolute bottom-[34px] right-[232px] z-30 hidden max-w-[245px] text-center text-[9px] uppercase leading-[1.45] tracking-[0.19em] text-[#f5f2ed]/78 lg:block">
        Washed cotton, dense knitwear, black canvas, wide trousers.
      </p>
    </section>
  );
}

function EditorialGrid() {
  return (
    <section className="mobile-home-editorial border-b border-black/20">
      <div className="mobile-editorial-composition lg:hidden">
        <div className="mobile-editorial-index bg-[#e8e9e3]">
          <Link className="mobile-spring-teaser group flex min-h-0 items-center justify-between gap-4 border-y border-black/18 px-4 uppercase" href="/collections">
            <span className="text-[10px] tracking-[0.1em] text-black/48">02</span>
            <span className="text-[12px] tracking-[0.08em]">Spring 2026</span>
            <span className="flex min-h-11 items-center border-b border-black/52 text-[9px] tracking-[0.07em]">
              View collection →
            </span>
          </Link>

          <Link className="mobile-lookbook-teaser group relative block min-h-0 overflow-hidden bg-[#151413] text-[#f2f1ea]" href="/lookbook">
            <Image
              src={lookbookImage}
              alt="LOW SIGNAL lookbook photograph"
              fill
              sizes="100vw"
              className="editorial-image object-cover object-[54%_49%] brightness-[0.61] contrast-[1.08] saturate-[0.56] transition-transform duration-700 group-hover:scale-[1.012]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/72 via-black/18 to-black/5" />
            <div className="absolute inset-0 grid grid-cols-[35%_1fr] p-5 uppercase">
              <div className="flex flex-col justify-between border-r border-white/26 pr-4">
                <span className="text-[9px] tracking-[0.14em] text-white/58">03</span>
                <div className="grid gap-2">
                  <p className="text-[12px] tracking-[0.11em]">Lookbook</p>
                  <p className="text-[9px] tracking-[0.14em] text-white/62">Issue 01</p>
                </div>
              </div>
              <div className="flex items-end justify-end pl-4">
                <span className="flex min-h-11 items-center border-b border-white/58 text-[9px] tracking-[0.09em]">
                  View lookbook →
                </span>
              </div>
            </div>
          </Link>
        </div>
      </div>

      <div className="hidden h-full grid-cols-[32.5vw_24vw_1fr] lg:grid">
        <Link href="/collections" className="group relative grid grid-cols-[47.96%_52.04%] border-r transition-colors duration-300 hover:bg-black/[0.025]">
          <div className="flex h-full flex-col bg-[#e8e9e3] px-[27px] py-[34px]">
            <Kicker number="02" />
            <p className="mt-[24px] text-[10px] uppercase leading-[1.5] tracking-[0.22em]">Spring 2026</p>
            <p className="mt-[18px] max-w-[130px] text-[10px] uppercase leading-[1.55] tracking-[0.2em]">A collection built on restraint, quiet structures, and small interruptions.</p>
            <span className="mt-auto inline-flex w-fit gap-2 border-b border-black/65 pb-[4px] text-[9px] uppercase tracking-[0.16em] transition-opacity duration-300 group-hover:opacity-55">
              View collection
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </span>
          </div>
          <div className="relative h-full overflow-hidden"><Image src={collectionImage} alt="LOW SIGNAL collection preview" fill sizes="17vw" className="editorial-image object-cover object-[50%_18%]" /></div>
          <div className="pointer-events-none absolute bottom-0 right-[35px] top-0 w-px bg-black/20" />
          <div className="pointer-events-none absolute bottom-0 right-[31px] top-0 w-px bg-black/16" />
          <div className="pointer-events-none absolute bottom-0 right-[27px] top-0 w-px bg-black/12" />
        </Link>

        <Link href="/lookbook" className="group flex h-full flex-col border-r bg-[#ebece6] px-[46px] py-[34px] transition-colors duration-300 hover:bg-[#e4e5df]">
          <Kicker number="03" />
          <p className="mt-[23px] text-[10px] uppercase tracking-[0.2em]">Lookbook</p>
          <div className="relative mt-[14px] h-[clamp(92px,12vh,122px)] w-[min(240px,72%)] overflow-hidden"><Image src={lookbookImage} alt="LOW SIGNAL lookbook photograph" fill sizes="200px" className="editorial-image object-cover object-[58%_54%]" /></div>
          <span className="mt-auto inline-flex w-fit gap-2 border-b border-black/65 pb-[4px] text-[9px] uppercase tracking-[0.16em] transition-opacity duration-300 group-hover:opacity-55">
            View lookbook
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </span>
        </Link>

        <Link href="#selected-pieces" className="group relative grid min-h-0 grid-cols-[minmax(170px,34%)_1fr] bg-[#151413] text-[#f5f2ed] transition-colors duration-300 hover:bg-[#1c1b19]">
        <div className="flex h-full min-w-0 flex-col border-r border-[#f5f2ed]/14 px-5 py-9 lg:px-[30px] lg:py-[34px]">
          <span className="text-[10px] uppercase tracking-[0.12em] text-[#f5f2ed]/58">Current edit</span>
          <p className="mt-[24px] max-w-[92px] text-[10px] uppercase leading-[1.62] tracking-[0.2em]">
            Selected garments
          </p>
        </div>
        <div className="flex h-full min-w-0 flex-col justify-between px-[clamp(28px,4vw,62px)] py-[34px]">
          <p className="max-w-[260px] text-[12px] uppercase leading-[1.55] tracking-[0.1em] text-[#f5f2ed]/72">
            A concise edit of outerwear, knitwear, shirts, and trousers available now.
          </p>
          <span className="inline-flex w-fit gap-3 border-b border-[#f5f2ed]/70 pb-[6px] text-[11px] uppercase tracking-[0.16em] transition-opacity duration-300 group-hover:opacity-60">
            Browse the rail
            <span className="transition-transform duration-300 group-hover:translate-x-1">↓</span>
          </span>
        </div>
        </Link>
      </div>
    </section>
  );
}


function LookbookContinuation() {
  return (
    <section id="lookbook-continuation" className="mobile-journal order-4 w-full overflow-hidden border-t border-black/18 bg-[#d4d5cf] px-5 py-9 text-[#111] lg:order-none lg:px-[4.5vw] lg:py-[5vh]">
      <div className="grid gap-6 lg:grid-cols-[28vw_1fr] lg:gap-9">
        <aside className="mobile-journal-intro grid max-w-[360px] grid-cols-[auto_1fr] gap-x-8 lg:flex lg:flex-col">
          <Kicker number="06" />
          <h2 className="text-[11px] uppercase leading-[1.45] tracking-[0.22em] lg:mt-[34px]">
            Lookbook
          </h2>
          <p className="col-span-2 mt-6 text-[22px] uppercase leading-[1.18] tracking-[0.15em] lg:text-[26px] lg:mt-[32px]">
            Coastal light
            <br />
            between weather
            <br />
            and cloth.
          </p>
          <p className="mt-[22px] hidden max-w-[330px] text-[10px] uppercase leading-[1.72] tracking-[0.16em] text-black/52 lg:block">
            Campaign frames, material details, and quiet movement from Issue
            01.
          </p>
          <Link
            href="/lookbook"
            className="col-span-2 mt-5 hidden w-fit border-b border-black/55 pb-[6px] text-[9px] uppercase tracking-[0.18em] transition-opacity duration-300 hover:opacity-55 lg:mt-[28px] lg:inline-flex"
          >
            View lookbook →
          </Link>

          <div className="mt-9 hidden border-y border-black/18 py-4 text-[9px] uppercase leading-[1.65] tracking-[0.17em] text-black/50 lg:block">
            <p className="text-black/68">Lookbook / Issue 01</p>
            <p className="mt-4">Coastal light / 01</p>
            <p className="mt-4 max-w-[275px]">
              Coastal light, washed wool, empty roads.
            </p>
          </div>
        </aside>

        <div className="mobile-journal-composition grid min-w-0 grid-cols-[64%_36%] lg:block">
          <div className="mobile-journal-lead relative h-[60svh] min-h-[400px] overflow-hidden border border-black/15 bg-[#bdc0b9] lg:h-[34svh] lg:min-h-[230px]">
            <Image
              src={lookbookImage}
              alt="Man standing near the sea in a LOW SIGNAL editorial photograph"
              fill
              sizes="62vw"
              className="editorial-image object-cover object-center brightness-[0.9] contrast-[1.05] saturate-[0.82]"
            />
            <div className="absolute inset-0 bg-[#171614]/10" />
            <div className="absolute left-5 top-5 grid gap-2 text-[8px] uppercase tracking-[0.18em] text-[#f5f2ed]/68">
              <span>Road note / 01</span>
              <span>Field note / coastal light</span>
            </div>
            <Link href="/lookbook" className="absolute bottom-5 left-5 border-b border-white/70 pb-2 text-[9px] uppercase tracking-[0.18em] text-white lg:hidden">View lookbook →</Link>
          </div>

          <div className="mobile-journal-details grid gap-6 border-l border-black/15 pl-3 lg:mt-6 lg:grid-cols-[1fr_170px] lg:border-l-0 lg:pl-0">
            <div className="mobile-journal-thumbs grid grid-rows-2 gap-3 lg:grid-cols-5 lg:grid-rows-none lg:gap-4">
              {lookbookDetailImages.map(([src, label], index) => (
                <div key={label} className={`${index > 1 ? "hidden lg:block" : ""} ${index === 1 ? "lg:mt-7" : ""}`}>
                  <div className="relative h-full min-h-[190px] overflow-hidden border border-black/14 bg-[#151413] lg:h-[92px] lg:min-h-0">
                    <Image
                      src={src}
                      alt={label}
                      fill
                      sizes="20vw"
                      className={`editorial-image object-cover brightness-[0.82] contrast-[1.05] saturate-[0.78] ${
                        index === 1 ? "object-[48%_48%]" : "object-center"
                      }`}
                    />
                  </div>
                  <p className="mt-3 hidden text-[8px] uppercase tracking-[0.17em] text-black/42 lg:block">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <div className="hidden border-y border-black/18 py-4 text-[9px] uppercase leading-[1.55] tracking-[0.16em] text-black/52 lg:mt-7 lg:block">
              <p className="text-black/70">Field note</p>
              <p className="mt-2">Coastal light</p>
              <p className="mt-5 text-black/70">Location</p>
              <p className="mt-2">Northern coast</p>
              <p className="mt-5 text-black/70">Condition</p>
              <p className="mt-2">Wind / Overcast</p>
            </div>
          </div>

          <div className="mt-7 hidden border-t border-black/20 text-[9px] uppercase tracking-[0.17em] text-black/58 lg:block">
            {lookbookRows.map(([number, label]) => (
              <Link
                key={number}
                href="/lookbook"
                className="grid grid-cols-[42px_1fr_auto] border-b border-black/16 py-4 transition-opacity duration-300 hover:opacity-55"
              >
                <span>{number}</span>
                <span>{label}</span>
                <span>View -&gt;</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Kicker({
  number,
  light = false,
}: Readonly<{
  number: string;
  light?: boolean;
}>) {
  return (
    <div
      className={`flex items-center gap-4 text-[10px] uppercase tracking-[0.16em] ${
        light ? "text-[#f5f2ed]/72" : "text-black/65"
      }`}
    >
      <span>{number}</span>
      <span className={`h-px w-[18px] ${light ? "bg-[#f5f2ed]/35" : "bg-black/35"}`} />
    </div>
  );
}
