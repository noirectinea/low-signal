import Image from "next/image";
import Link from "next/link";
import { HomeSelectedPieces } from "@/components/HomeSelectedPieces";
import { MobileHomeHeader } from "@/components/MobileHomeHeader";
import { LogoMark } from "@/components/LogoMark";
import { MobileNavMenu } from "@/components/MobileNavMenu";

const heroImage = "/images/hero/ch1.png";
const collectionImage = "/images/hero/ch3.png";
const lookbookImage = "/images/low-signal/lookbook-coast.jpg";
const garmentOne = "/images/low-signal/products/product-06.jpg";
const garmentTwo = "/images/low-signal/selected-garments-detail.jpg";
const materialStoryImage =
  "/images/low-signal/selected-collection/material-form-original.png";
const journalImages = [
  ["/images/low-signal/journal/fabric-detail.jpg", "Fabric detail"],
  ["/images/low-signal/journal/road-coast.jpg", "Road / cloudy coast"],
  ["/images/low-signal/journal/garment-chair.jpg", "Garment on chair"],
  ["/images/low-signal/journal/hardware-detail.jpg", "Button / label detail"],
  ["/images/low-signal/journal/studio-table.jpg", "Studio table note"],
];

const materialNotes = ["Washed cotton", "Dry wool", "Raw canvas", "Worn nylon"];
const journalRows = [
  ["01", "Field note"],
  ["02", "Material log"],
  ["03", "Coastal light"],
  ["04", "Road note"],
];
const footerLinks = [
  ["Collections", "/collections"],
  ["Lookbook", "/lookbook"],
  ["About", "/about"],
  ["Contact", "#contact"],
  ["Shipping", "#shipping"],
];

export default function Home() {
  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#e4e5df] text-[#111]">
      <MobileHome />
      <div className="hidden md:block">
        <section className="grid w-full overflow-hidden bg-[#e4e5df] md:h-[100svh] md:grid-rows-[65fr_35fr]">
          <HeroPanel />
          <EditorialGrid />
        </section>
        <MaterialForm />
        <HomeSelectedPieces />
        <JournalSection />
        <FinalFooter />
      </div>
    </main>
  );
}

function MobileHome() {
  return (
    <div className="bg-[#d8d9d3] md:hidden">
      <MobileHomeHeader />
      <main>
        <section className="relative min-h-[100svh] overflow-hidden bg-[#161513] text-[#f5f2ed]">
          <Image alt="LOW SIGNAL editorial portrait in a black coat" className="object-cover object-[52%_24%] brightness-[0.82] contrast-[1.06]" fill priority sizes="100vw" src={heroImage} />
          <div className="absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-black/76 via-black/24 to-transparent" />
          <div className="absolute left-5 top-24 border-l border-white/38 pl-3 text-[11px] uppercase tracking-[0.13em] text-white/78">Spring 2026 / Issue 01</div>
          <div className="absolute inset-x-5 bottom-8"><h1 className="controlled-display-title text-[clamp(5.4rem,24vw,7.3rem)] leading-[0.72] tracking-[-0.055em]">Low<br />Signal</h1><div className="mt-7 flex items-end justify-between gap-5 border-t border-white/38 pt-4"><p className="max-w-[180px] text-[14px] leading-5 text-white/84">Washed black clothing for daily wear.</p><div className="grid justify-items-end gap-4 text-[12px] uppercase tracking-[0.12em]"><Link className="min-h-11 border-b border-white/80 pb-2" href="/collections">Shop Spring 2026 →</Link><Link className="border-b border-white/36 pb-1 text-white/78" href="/lookbook">View Lookbook</Link></div></div></div>
        </section>
        <section className="overflow-hidden bg-[#d8d9d3] py-12" aria-labelledby="mobile-collection-title">
          <p id="mobile-collection-title" className="px-5 text-[11px] uppercase tracking-[0.13em] text-black/58">01 / Spring 2026 / Collections</p>
          <div className="mt-7 grid h-[min(116vw,530px)] grid-cols-[58fr_42fr] gap-px bg-black/24">
            <MobileCollectionCard href="/collections/men" image="/images/low-signal/collections/product-01.jpg" label="Men" number="01" className="h-full" />
            <MobileCollectionCard href="/collections/women" image="/images/low-signal/collections/women-storm-parka-full-body.png" label="Women" number="02" className="mt-[14vw] h-[calc(100%-14vw)]" />
          </div>
        </section>

        <HomeSelectedPieces />

        <section className="border-t border-black/16 px-4 py-10" aria-labelledby="material-mobile-title">
          <div className="relative aspect-[4/3] overflow-hidden bg-[#bfc0b8]">
            <Image alt="Close black washed fabric, rib texture, and shadow" className="object-cover brightness-[0.78]" fill sizes="100vw" src={materialStoryImage} />
          </div>
          <h2 id="material-mobile-title" className="mt-5 text-[26px] uppercase tracking-[-0.02em]">Material &amp; form</h2>
          <p className="mt-3 max-w-[34ch] text-[14px] leading-6 text-black/68">Materials that age quietly, take on character, and hold their shape through repeat wear.</p>
          <div className="mt-5 flex flex-wrap gap-2 text-[12px] uppercase tracking-[0.1em] text-black/66">
            {materialNotes.map((note) => <span className="border border-black/18 px-3 py-2" key={note}>{note}</span>)}
          </div>
          <Link className="mt-6 inline-flex min-h-11 items-center border-b border-black/60 text-[13px] uppercase tracking-[0.12em]" href="/about">Our approach →</Link>
        </section>

        <section className="border-t border-black/16 px-4 py-10" aria-labelledby="lookbook-mobile-title">
          <div className="relative aspect-[4/3] overflow-hidden bg-[#181715]">
            <Image alt="Model standing near the sea in LOW SIGNAL lookbook" className="object-cover brightness-[0.8]" fill sizes="100vw" src={lookbookImage} />
          </div>
          <h2 id="lookbook-mobile-title" className="mt-5 text-[26px] uppercase tracking-[-0.02em]">Lookbook</h2>
          <p className="mt-3 text-[14px] leading-6 text-black/68">Spring layers, coastal light, and garments made for daily repetition.</p>
          <Link className="mt-6 inline-flex min-h-11 items-center border-b border-black/60 text-[13px] uppercase tracking-[0.12em]" href="/lookbook">View Lookbook →</Link>
        </section>
      </main>

      <footer className="border-t border-black/16 px-4 py-8">
        <p className="text-[20px] uppercase tracking-[-0.02em]">Low Signal / Spring 2026</p>
        <nav aria-label="Footer navigation" className="mt-6 grid grid-cols-2 gap-x-5 border-y border-black/16">
          {[["Collections", "/collections"], ["Lookbook", "/lookbook"], ["About", "/about"], ["Contact", "mailto:studio@lowsignal.com"], ["Instagram", "https://instagram.com"], ["Cart", "/cart"]].map(([label, href]) => <Link className="min-h-12 border-b border-black/12 py-4 text-[14px] uppercase tracking-[0.12em]" href={href} key={label}>{label}</Link>)}
        </nav>
      </footer>
    </div>
  );
}

function MobileCollectionCard({ className, href, image, label, number }: Readonly<{ className: string; href: string; image: string; label: string; number: string }>) {
  return <Link className={`group relative block min-h-11 overflow-hidden bg-[#20201d] ${className}`} href={href}>
    <Image alt={`${label} Spring 2026 collection`} className="object-cover brightness-[0.8] contrast-[1.04]" fill sizes="86vw" src={image} />
    <span className="absolute inset-x-3 bottom-3 border-t border-white/42 pt-2 text-[11px] uppercase tracking-[0.08em] text-white"><span>{number} / {label}</span><span className="hidden sm:inline"> / 08 pieces</span><span> →</span></span>
  </Link>;
}

function HeroPanel() {
  return (
    <section className="relative min-h-[620px] overflow-hidden border-b border-black/20 bg-[#e4e5df] md:h-full md:min-h-0">
      <div className="absolute inset-y-0 left-0 w-[29.5vw] bg-[#e4e5df]" />
      <div className="absolute inset-y-0 left-[29.5vw] right-0">
        <Image
          src={heroImage}
          alt="LOW SIGNAL editorial portrait in a black coat"
          fill
          priority
          sizes="70vw"
          className="hero-image object-cover object-[50%_20%]"
        />
        <div className="absolute inset-0 bg-[#d8cfc1]/10 mix-blend-screen" />
      </div>

      <div className="absolute left-[18px] top-[48px] z-20 h-px w-[46.35vw] bg-black/40" />
      <div className="absolute left-[75.15vw] right-[18px] top-[48px] z-20 h-px bg-black/40" />

      <header className="absolute left-[18px] right-[18px] top-[16px] z-30 flex h-[32px] items-start text-[12px] uppercase tracking-[0.16em]">
        <LogoMark className="relative -top-[3px] w-[18.1vw]" />
        <nav className="hidden gap-[38px] md:flex">
          <Link href="/">Home</Link>
          <Link href="/collections">Collections</Link>
          <Link href="/lookbook">Lookbook</Link>
          <Link href="/about">About</Link>
        </nav>
        <div className="ml-auto flex items-start gap-[24px]">
          <span>2026 / Issue 01</span>
          <Link aria-label="Open cart" className="-mt-1 border border-black/40 px-3 py-1 text-[12px]" href="/cart">Cart</Link>
          <MobileNavMenu />
        </div>
      </header>

      <div className="absolute left-[5.15vw] top-1/2 z-20 hidden w-[210px] -translate-y-1/2 flex-col items-start md:flex">
        <Kicker number="01" />
        <p className="mt-[26px] max-w-[205px] text-[12px] uppercase leading-[1.52] tracking-[0.19em]">
          Washed black clothing for daily wear.
        </p>
        <div className="mt-[26px] grid w-full gap-[10px] border-y border-black/18 py-[14px] text-[8px] uppercase leading-[1.5] tracking-[0.17em] text-black/48">
          <span>Spring 2026 / Issue 01</span>
          <span>Garment index</span>
        </div>
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

      <div className="absolute bottom-[30px] left-[5.15vw] z-20 hidden w-[210px] grid-cols-3 gap-4 border-t border-black/18 pt-4 text-[7px] uppercase leading-[1.45] tracking-[0.16em] text-black/42 md:grid">
        <span>Daily repeat</span>
        <span>Quiet cut</span>
        <span>Low signal</span>
      </div>

      <p className="absolute right-[74px] top-[104px] z-30 max-w-[74px] text-[9px] uppercase leading-[1.34] tracking-[0.18em] text-black/68">
        Spring 2026 / Washed black.
      </p>

      <h1
        className="hero-printed-title absolute left-[42.2vw] top-[25.8%] z-30 text-[13.4vw] uppercase sm:text-[13vw]"
      >
        LOW
        <br />
        SIGNAL
      </h1>

      <div className="absolute bottom-8 left-5 z-30 grid gap-3 md:hidden">
        <Link className="border-b border-black/70 pb-2 text-[13px] uppercase tracking-[0.14em]" href="/collections">
          Shop Spring 2026 →
        </Link>
        <Link className="w-fit border-b border-black/35 pb-1 text-[12px] uppercase tracking-[0.14em] text-black/66" href="/lookbook">
          Lookbook
        </Link>
      </div>

      <p className="absolute bottom-[34px] right-[232px] z-30 hidden max-w-[245px] text-center text-[9px] uppercase leading-[1.45] tracking-[0.19em] text-[#f5f2ed]/78 md:block">
        Washed cotton, dense knitwear, black canvas, wide trousers.
      </p>
    </section>
  );
}

function EditorialGrid() {
  return (
    <section className="grid border-b border-black/20 md:h-full md:grid-cols-[32.5vw_24vw_1fr]">
      <Link
        href="/collections"
        className="group relative grid border-b border-black/20 transition-colors duration-300 hover:bg-black/[0.025] md:grid-cols-[47.96%_52.04%] md:border-b-0 md:border-r"
      >
        <div className="flex h-full flex-col bg-[#e8e9e3] px-[27px] py-[34px]">
          <Kicker number="02" />
          <p className="mt-[24px] text-[10px] uppercase leading-[1.5] tracking-[0.22em]">
            Spring 2026
          </p>
          <p className="mt-[18px] max-w-[130px] text-[10px] uppercase leading-[1.55] tracking-[0.2em]">
            A collection built on restraint, quiet structures, and small
            interruptions.
          </p>
          <span className="mt-auto inline-flex w-fit gap-2 border-b border-black/65 pb-[4px] text-[9px] uppercase tracking-[0.16em] transition-opacity duration-300 group-hover:opacity-55">
            View collection
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </span>
        </div>
        <div className="relative h-[260px] overflow-hidden md:h-full">
          <Image
            src={collectionImage}
            alt="LOW SIGNAL collection preview"
            fill
            sizes="17vw"
            className="editorial-image object-cover object-[50%_18%]"
          />
        </div>
        <div className="pointer-events-none absolute bottom-0 right-[35px] top-0 hidden w-px bg-black/20 md:block" />
        <div className="pointer-events-none absolute bottom-0 right-[31px] top-0 hidden w-px bg-black/16 md:block" />
        <div className="pointer-events-none absolute bottom-0 right-[27px] top-0 hidden w-px bg-black/12 md:block" />
      </Link>

      <Link
        href="/lookbook"
        className="group flex h-full flex-col border-b border-black/20 bg-[#ebece6] px-[46px] py-[34px] transition-colors duration-300 hover:bg-[#e4e5df] md:border-b-0 md:border-r"
      >
        <Kicker number="03" />
        <p className="mt-[23px] text-[10px] uppercase tracking-[0.2em]">
          Lookbook
        </p>
        <div className="relative mt-[14px] h-[96px] w-[200px] overflow-hidden md:h-[clamp(92px,12vh,122px)] md:w-[min(240px,72%)]">
          <Image
            src={lookbookImage}
            alt="LOW SIGNAL lookbook photograph"
            fill
            sizes="200px"
            className="editorial-image object-cover object-[58%_54%]"
          />
        </div>
        <span className="mt-auto inline-flex w-fit gap-2 border-b border-black/65 pb-[4px] text-[9px] uppercase tracking-[0.16em] transition-opacity duration-300 group-hover:opacity-55">
          View lookbook
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            →
          </span>
        </span>
      </Link>

      <Link
        href="#selected-pieces"
        className="group relative grid min-h-[320px] bg-[#151413] text-[#f5f2ed] transition-colors duration-300 hover:bg-[#1c1b19] md:min-h-0 md:grid-cols-[30%_44%_26%]"
      >
        <div className="flex h-full flex-col px-[30px] py-[34px]">
          <Kicker number="04" light />
          <p className="mt-[24px] max-w-[92px] text-[10px] uppercase leading-[1.62] tracking-[0.2em]">
            Selected garments
          </p>
          <span className="mt-auto inline-flex w-fit gap-2 border-b border-[#f5f2ed]/70 pb-[4px] text-[9px] uppercase tracking-[0.16em] transition-opacity duration-300 group-hover:opacity-60">
            Shop selected
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </span>
        </div>
        <div className="flex h-full flex-col justify-center px-[30px] pb-[28px] md:px-0 md:py-[26px]">
          <div className="relative h-[150px] w-full overflow-hidden border border-[#f5f2ed]/10 bg-[#211f1c] md:h-[clamp(148px,18vh,196px)] md:w-[84%]">
            <Image
              src={garmentOne}
              alt="LOW SIGNAL outer layer detail"
              fill
              sizes="24vw"
              className="editorial-image object-cover object-center"
            />
          </div>
          <p className="mt-3 text-[7px] uppercase tracking-[0.18em] text-[#f5f2ed]/42">
            Outer layer / 01
          </p>
        </div>
        <div className="flex h-full flex-col justify-end px-[30px] pb-[34px] md:pl-0 md:pr-[28px] md:pt-[26px]">
          <div className="relative h-[104px] w-full overflow-hidden border border-[#f5f2ed]/10 bg-[#211f1c] md:h-[clamp(104px,14vh,152px)]">
            <Image
              src={garmentTwo}
              alt="LOW SIGNAL black knit garment"
              fill
              sizes="16vw"
              className="editorial-image object-cover object-center"
            />
          </div>
          <p className="mt-3 text-[7px] uppercase tracking-[0.18em] text-[#f5f2ed]/42">
            Knit texture / 02
          </p>
        </div>
        <div className="pointer-events-none absolute bottom-[31px] left-[30%] hidden h-px w-[10%] bg-[#f5f2ed]/12 md:block" />
      </Link>
    </section>
  );
}

function MaterialForm() {
  return (
    <section className="grid min-h-[76svh] w-full border-t border-black/20 bg-[#d6d7d1] md:grid-cols-[38vw_1fr]">
      <div className="relative min-h-[64svh] border-r border-black/18 bg-[#d4d5cf] md:min-h-0">
        <div className="px-[8.5vw] py-[76px] md:px-0 md:py-0">
          <div className="md:absolute md:left-[8.5vw] md:top-[22%] md:max-w-[310px]">
            <Kicker number="05" />
            <h2 className="mt-[42px] text-[11px] uppercase leading-[1.45] tracking-[0.22em]">
              Material & Form
            </h2>
            <p className="mt-[34px] text-[18px] uppercase leading-[1.48] tracking-[0.16em] md:text-[20px]">
              We work with materials
              <br />
              that age quietly and
              <br />
              take on character
              <br />
              over time.
            </p>
            <div className="mt-[40px] grid max-w-[260px] border-y border-black/18 text-[9px] uppercase tracking-[0.17em] text-black/56">
              {materialNotes.map((item) => (
                <div
                  key={item}
                  className="flex justify-between border-b border-black/12 py-3 last:border-b-0"
                >
                  <span>{item}</span>
                  <span className="h-px w-8 self-center bg-black/20" />
                </div>
              ))}
            </div>
            <a
              className="mt-[42px] inline-flex border-b border-black pb-[5px] text-[9px] uppercase tracking-[0.16em]"
              href="/about"
            >
              Our approach
            </a>
          </div>
        </div>
      </div>

      <div className="relative min-h-[64svh] bg-[#d6d7d1] px-5 py-10 md:min-h-0 md:px-[5vw] md:py-[7vh]">
        <div className="grid h-full content-center gap-5">
          <div className="relative aspect-[16/11] w-full overflow-hidden border border-black/14 bg-[#bfc0b8] md:ml-[3vw] md:w-[88%]">
            <Image
              src={materialStoryImage}
              alt="Close black washed fabric, rib texture, and shadow"
              fill
              sizes="(min-width: 1024px) 44vw, 92vw"
              className="editorial-image object-cover object-[50%_48%] brightness-[0.72] contrast-[1.08] saturate-[0.62]"
            />
            <div className="absolute inset-0 bg-[#11110f]/10" />
          </div>

          <div className="grid gap-2 border-t border-black/16 pt-4 text-[8px] uppercase leading-[1.6] tracking-[0.18em] text-black/48 md:ml-[3vw] md:w-[88%] md:grid-cols-[1fr_auto] md:items-start">
            <span>Material note / 01</span>
            <span className="md:text-right">Washed black / texture / time</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function JournalSection() {
  return (
    <section id="journal" className="w-full overflow-hidden border-t border-black/18 bg-[#d4d5cf] px-[6vw] py-12 text-[#111] md:px-[4.5vw] md:py-[5vh]">
      <div className="grid gap-9 lg:grid-cols-[28vw_1fr]">
        <aside className="flex max-w-[360px] flex-col">
          <Kicker number="07" />
          <h2 className="mt-[34px] text-[11px] uppercase leading-[1.45] tracking-[0.22em]">
            Journal
          </h2>
          <p className="mt-[32px] text-[22px] uppercase leading-[1.18] tracking-[0.15em] md:text-[26px]">
            Notes kept
            <br />
            between weather
            <br />
            and cloth.
          </p>
          <p className="mt-[22px] max-w-[330px] text-[10px] uppercase leading-[1.72] tracking-[0.16em] text-black/52">
            Garments, road light, studio notes, and fabric details from the
            current season.
          </p>
          <a
            href="#journal"
            className="mt-[28px] inline-flex w-fit border-b border-black/55 pb-[6px] text-[9px] uppercase tracking-[0.18em] transition-opacity duration-300 hover:opacity-55"
          >
            Read journal →
          </a>

          <div className="mt-9 border-y border-black/18 py-4 text-[9px] uppercase leading-[1.65] tracking-[0.17em] text-black/50">
            <p className="text-black/68">Current entry</p>
            <p className="mt-4">Road note / 01</p>
            <p className="mt-4 max-w-[275px]">
              Coastal light, washed wool, empty roads.
            </p>
          </div>
        </aside>

        <div className="min-w-0">
          <div className="relative h-[30svh] min-h-[230px] overflow-hidden border border-black/15 bg-[#bdc0b9] md:h-[34svh]">
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
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_170px]">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {journalImages.map(([src, label], index) => (
                <div key={label} className={index === 1 ? "sm:mt-7" : ""}>
                  <div className="relative h-[92px] overflow-hidden border border-black/14 bg-[#151413]">
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
                  <p className="mt-3 text-[8px] uppercase tracking-[0.17em] text-black/42">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-y border-black/18 py-4 text-[9px] uppercase leading-[1.55] tracking-[0.16em] text-black/52 lg:mt-7">
              <p className="text-black/70">Field note</p>
              <p className="mt-2">Coastal light</p>
              <p className="mt-5 text-black/70">Location</p>
              <p className="mt-2">Northern coast</p>
              <p className="mt-5 text-black/70">Condition</p>
              <p className="mt-2">Wind / Overcast</p>
            </div>
          </div>

          <div className="mt-7 border-t border-black/20 text-[9px] uppercase tracking-[0.17em] text-black/58">
            {journalRows.map(([number, label]) => (
              <a
                key={number}
                href="#journal"
                className="grid grid-cols-[42px_1fr_auto] border-b border-black/16 py-4 transition-opacity duration-300 hover:opacity-55"
              >
                <span>{number}</span>
                <span>{label}</span>
                <span>Read -&gt;</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FinalFooter() {
  return (
    <footer className="grid w-full border-t border-black/20 bg-[#d8d9d3] text-[9px] uppercase tracking-[0.16em] md:grid-cols-[24vw_1fr_18vw]">
      <div className="border-b border-black/18 px-[7vw] py-[28px] md:border-b-0 md:border-r md:px-[3vw] md:py-[30px]">
        <Kicker number="08" />
        <h2 className="mt-[22px] text-[11px] uppercase tracking-[0.18em]">
          Spring 2026
        </h2>
        <p className="mt-6 max-w-[190px] text-[20px] leading-[1.05] tracking-[0.12em]">
          Available now
        </p>
        <Link
          href="/collections"
          className="mt-6 inline-flex w-fit border-b border-black/55 pb-[6px] text-[9px] tracking-[0.15em] transition-opacity duration-300 hover:opacity-55"
        >
          Shop collection →
        </Link>
      </div>

      <div className="flex flex-col justify-between border-b border-black/18 px-[7vw] py-[28px] md:border-b-0 md:border-r md:px-[4vw] md:py-[30px]">
        <p className="max-w-[620px] text-[15px] leading-[1.45] tracking-[0.15em] md:text-[18px]">
          Low Signal works with washed cotton, dense knitwear, black canvas,
          and garments made for repeat wear.
        </p>
        <div className="mt-[28px] flex flex-wrap gap-x-8 gap-y-3 border-t border-black/18 pt-4">
          {footerLinks.map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="border-b border-black/20 pb-2 transition-opacity duration-300 hover:opacity-55"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      <div className="px-[7vw] py-[28px] md:px-[2vw] md:py-[30px]">
        <div className="relative h-[92px] overflow-hidden border border-black/16 bg-[#d1ccc2] md:h-[108px]">
          <Image
            src={garmentTwo}
            alt="LOW SIGNAL fabric detail"
            fill
            sizes="28vw"
            className="editorial-image object-cover object-center brightness-[0.86] contrast-[1.04]"
          />
        </div>
        <p className="mt-3 text-black/56">Fabric detail / closing page</p>
      </div>
    </footer>
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
