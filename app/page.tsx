import Image from "next/image";
import Link from "next/link";
import { HomeSelectedPieces } from "@/components/HomeSelectedPieces";
import { MobileHomeHeader } from "@/components/MobileHomeHeader";

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
    <main className="flex min-h-screen w-full flex-col bg-[#e4e5df] text-[#111]">
      <MobileHomeHeader />
      <section className="order-1 grid w-full bg-[#e4e5df] lg:order-none lg:h-[100svh] lg:grid-rows-[65fr_35fr]">
        <HeroPanel />
        <EditorialGrid />
      </section>
      <MaterialForm />
      <HomeSelectedPieces />
      <JournalSection />
      <FinalFooter />
    </main>
  );
}

function HeroPanel() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden border-b border-black/20 bg-[#e4e5df] lg:h-full lg:min-h-0">
      <div className="absolute inset-y-0 left-0 w-[32%] bg-[#e4e5df] lg:w-[29.5vw]" />
      <div className="absolute inset-y-0 left-[32%] right-0 lg:left-[29.5vw]">
        <Image
          src={heroImage}
          alt="LOW SIGNAL editorial portrait in a black coat"
          fill
          priority
          sizes="(min-width: 1024px) 70vw, 68vw"
          className="hero-image object-cover object-[54%_24%] min-[390px]:object-[52%_23%] min-[430px]:object-[50%_22%] lg:object-[50%_20%]"
        />
        <div className="absolute inset-0 bg-[#d8cfc1]/10 mix-blend-screen" />
      </div>

      <div className="absolute left-5 right-5 top-[84px] z-20 h-px bg-black/30 lg:left-[18px] lg:right-auto lg:top-[48px] lg:w-[46.35vw] lg:bg-black/40" />
      <div className="absolute left-[75.15vw] right-[18px] top-[48px] z-20 hidden h-px bg-black/40 lg:block" />

      <div className="absolute left-[5.15vw] top-1/2 z-20 hidden w-[210px] -translate-y-1/2 flex-col items-start lg:flex">
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

      <div className="absolute bottom-[30px] left-[5.15vw] z-20 hidden w-[210px] grid-cols-3 gap-4 border-t border-black/18 pt-4 text-[7px] uppercase leading-[1.45] tracking-[0.16em] text-black/42 lg:grid">
        <span>Daily repeat</span>
        <span>Quiet cut</span>
        <span>Low signal</span>
      </div>

      <p className="absolute left-5 top-[104px] z-30 max-w-[104px] text-[9px] uppercase leading-[1.45] tracking-[0.18em] text-black/68 lg:left-auto lg:right-[74px] lg:max-w-[74px] lg:leading-[1.34]">
        Spring 2026 / Washed black.
      </p>

      <h1
        className="hero-printed-title absolute left-[5%] top-[56%] z-30 text-[clamp(4.8rem,22vw,6.8rem)] uppercase lg:left-[42.2vw] lg:top-[25.8%] lg:text-[13.4vw]"
      >
        LOW
        <br />
        SIGNAL
      </h1>

      <div className="absolute inset-x-5 bottom-6 z-30 grid grid-cols-[32%_1fr] gap-5 border-t border-black/34 pt-4 lg:hidden">
        <p className="min-w-0 text-[9px] uppercase leading-[1.65] tracking-[0.12em] text-black/72">Washed black clothing for daily wear.</p>
        <div className="grid min-w-0 gap-3 text-[10px] uppercase tracking-[0.12em] text-[#f5f2ed]/82">
          <Link className="whitespace-nowrap border-b border-[#f5f2ed]/62 pb-2" href="/collections">Shop Spring 2026 →</Link>
          <Link className="w-fit border-b border-[#f5f2ed]/38 pb-1 text-[#f5f2ed]/68" href="/lookbook">View Lookbook</Link>
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
    <section className="border-b border-black/20">
      <div className="lg:hidden">
        <div className="bg-[#e8e9e3] px-5 py-7">
          <Kicker number="02" />
          <div className="mt-5 flex items-end justify-between border-t border-black/28 pt-4 text-[9px] uppercase tracking-[0.16em]">
            <span>Spring 2026</span>
            <Link className="border-b border-black/60 pb-1" href="/collections">View collection →</Link>
          </div>
        </div>
        <div className="grid min-h-[68svh] grid-cols-[56%_44%] border-t border-black/18">
          <Link className="group relative min-w-0 overflow-hidden border-r border-black/18 bg-[#c9cac4]" href="/collections">
            <Image
              src={collectionImage}
              alt="LOW SIGNAL collection preview"
              fill
              sizes="56vw"
              className="editorial-image object-cover object-[50%_18%] transition-transform duration-700 group-hover:scale-[1.012]"
            />
          </Link>
          <Link className="group grid min-w-0 grid-rows-[1fr_auto] bg-[#ebece6]" href="/lookbook">
            <div className="relative min-h-0 overflow-hidden">
              <Image
                src={lookbookImage}
                alt="LOW SIGNAL lookbook photograph"
                fill
                sizes="44vw"
                className="editorial-image object-cover object-[58%_54%] transition-transform duration-700 group-hover:scale-[1.012]"
              />
            </div>
            <div className="px-4 py-6 text-[9px] uppercase tracking-[0.16em]">
              <div className="flex items-center gap-3"><span>03</span><span className="h-px flex-1 bg-black/26" /></div>
              <p className="mt-4">Lookbook</p>
              <span className="mt-5 inline-flex border-b border-black/60 pb-1">View lookbook →</span>
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

        <Link href="#selected-pieces" className="group relative grid min-h-0 grid-cols-[30%_44%_26%] bg-[#151413] text-[#f5f2ed] transition-colors duration-300 hover:bg-[#1c1b19]">
        <div className="flex h-full min-w-0 flex-col px-5 py-9 lg:px-[30px] lg:py-[34px]">
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
        <div className="flex h-full min-w-0 flex-col justify-center py-8 pr-5 lg:px-0 lg:py-[26px]">
          <div className="relative h-[44svh] w-full overflow-hidden border border-[#f5f2ed]/10 bg-[#211f1c] lg:h-[clamp(148px,18vh,196px)] lg:w-[84%]">
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
        <div className="hidden h-full flex-col justify-end px-[30px] pb-[34px] lg:flex lg:pl-0 lg:pr-[28px] lg:pt-[26px]">
          <div className="relative h-[104px] w-full overflow-hidden border border-[#f5f2ed]/10 bg-[#211f1c] lg:h-[clamp(104px,14vh,152px)]">
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
        <div className="pointer-events-none absolute bottom-[31px] left-[30%] hidden h-px w-[10%] bg-[#f5f2ed]/12 lg:block" />
        </Link>
      </div>
    </section>
  );
}

function MaterialForm() {
  return (
    <section className="order-3 grid min-h-[72svh] w-full grid-cols-[46%_54%] border-t border-black/20 bg-[#d6d7d1] lg:order-none lg:min-h-[76svh] lg:grid-cols-[38vw_1fr]">
      <div className="relative border-r border-black/18 bg-[#d4d5cf] lg:min-h-0">
        <div className="h-full px-5 py-9 lg:h-auto lg:px-0 lg:py-0">
          <div className="lg:absolute lg:left-[8.5vw] lg:top-[22%] lg:max-w-[310px]">
            <Kicker number="05" />
            <h2 className="mt-6 text-[11px] uppercase leading-[1.45] tracking-[0.22em] lg:mt-[42px]">
              Material & Form
            </h2>
            <p className="mt-6 text-[16px] uppercase leading-[1.42] tracking-[0.14em] lg:mt-[34px] lg:text-[20px]">
              We work with materials
              <br />
              that age quietly and
              <br />
              take on character
              <br />
              over time.
            </p>
            <div className="mt-7 hidden max-w-[260px] grid-cols-2 border-y border-black/18 text-[8px] uppercase tracking-[0.15em] text-black/56 lg:mt-[40px] lg:grid lg:grid-cols-1 lg:text-[9px]">
              {materialNotes.map((item) => (
                <div
                  key={item}
                  className="flex min-w-0 justify-between border-b border-black/12 py-2.5 odd:pr-3 even:border-l even:pl-3 lg:py-3 lg:odd:pr-0 lg:even:border-l-0 lg:even:pl-0 lg:last:border-b-0"
                >
                  <span>{item}</span>
                  <span className="h-px w-8 self-center bg-black/20" />
                </div>
              ))}
            </div>
            <a
              className="mt-7 inline-flex border-b border-black pb-[5px] text-[9px] uppercase tracking-[0.16em] lg:mt-[42px]"
              href="/about"
            >
              Our approach
            </a>
          </div>
        </div>
      </div>

      <div className="relative min-h-0 bg-[#d6d7d1] lg:px-[5vw] lg:py-[7vh]">
        <div className="grid h-full content-center gap-5">
          <div className="relative h-full min-h-[72svh] w-full overflow-hidden border-l border-black/14 bg-[#bfc0b8] lg:ml-[3vw] lg:min-h-0 lg:aspect-[16/11] lg:h-auto lg:w-[88%] lg:border">
            <Image
              src={materialStoryImage}
              alt="Close black washed fabric, rib texture, and shadow"
              fill
              sizes="(min-width: 1024px) 44vw, 92vw"
              className="editorial-image object-cover object-[50%_48%] brightness-[0.72] contrast-[1.08] saturate-[0.62]"
            />
            <div className="absolute inset-0 bg-[#11110f]/10" />
          </div>

          <div className="hidden gap-2 border-t border-black/16 pt-4 text-[8px] uppercase leading-[1.6] tracking-[0.18em] text-black/48 lg:ml-[3vw] lg:grid lg:w-[88%] lg:grid-cols-[1fr_auto] lg:items-start">
            <span>Material note / 01</span>
            <span className="lg:text-right">Washed black / texture / time</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function JournalSection() {
  return (
    <section id="journal" className="order-4 w-full overflow-hidden border-t border-black/18 bg-[#d4d5cf] px-5 py-9 text-[#111] lg:order-none lg:px-[4.5vw] lg:py-[5vh]">
      <div className="grid gap-6 lg:grid-cols-[28vw_1fr] lg:gap-9">
        <aside className="grid max-w-[360px] grid-cols-[auto_1fr] gap-x-8 lg:flex lg:flex-col">
          <Kicker number="07" />
          <h2 className="text-[11px] uppercase leading-[1.45] tracking-[0.22em] lg:mt-[34px]">
            Journal
          </h2>
          <p className="col-span-2 mt-6 text-[22px] uppercase leading-[1.18] tracking-[0.15em] lg:text-[26px] lg:mt-[32px]">
            Notes kept
            <br />
            between weather
            <br />
            and cloth.
          </p>
          <p className="mt-[22px] hidden max-w-[330px] text-[10px] uppercase leading-[1.72] tracking-[0.16em] text-black/52 lg:block">
            Garments, road light, studio notes, and fabric details from the
            current season.
          </p>
          <a
            href="#journal"
            className="col-span-2 mt-5 hidden w-fit border-b border-black/55 pb-[6px] text-[9px] uppercase tracking-[0.18em] transition-opacity duration-300 hover:opacity-55 lg:mt-[28px] lg:inline-flex"
          >
            Read journal →
          </a>

          <div className="mt-9 hidden border-y border-black/18 py-4 text-[9px] uppercase leading-[1.65] tracking-[0.17em] text-black/50 lg:block">
            <p className="text-black/68">Current entry</p>
            <p className="mt-4">Road note / 01</p>
            <p className="mt-4 max-w-[275px]">
              Coastal light, washed wool, empty roads.
            </p>
          </div>
        </aside>

        <div className="grid min-w-0 grid-cols-[64%_36%] lg:block">
          <div className="relative h-[60svh] min-h-[400px] overflow-hidden border border-black/15 bg-[#bdc0b9] lg:h-[34svh] lg:min-h-[230px]">
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
            <a href="#journal" className="absolute bottom-5 left-5 border-b border-white/70 pb-2 text-[9px] uppercase tracking-[0.18em] text-white lg:hidden">Read journal →</a>
          </div>

          <div className="grid gap-6 border-l border-black/15 pl-3 lg:mt-6 lg:grid-cols-[1fr_170px] lg:border-l-0 lg:pl-0">
            <div className="grid grid-rows-2 gap-3 lg:grid-cols-5 lg:grid-rows-none lg:gap-4">
              {journalImages.map(([src, label], index) => (
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
    <footer className="order-5 grid w-full border-t border-black/20 bg-[#d8d9d3] text-[9px] uppercase tracking-[0.16em] lg:order-none lg:grid-cols-[24vw_1fr_18vw]">
      <div className="border-b border-black/18 px-5 py-6 lg:border-b-0 lg:border-r lg:px-[3vw] lg:py-[30px]">
        <div className="hidden lg:block"><Kicker number="08" /></div>
        <h2 className="mt-4 text-[11px] uppercase tracking-[0.18em] lg:mt-[22px]">
          Spring 2026
        </h2>
        <p className="mt-4 hidden max-w-[190px] text-[15px] leading-[1.1] tracking-[0.12em] lg:mt-6 lg:block lg:text-[20px]">
          Available now
        </p>
        <Link
          href="/collections"
          className="mt-5 hidden w-fit border-b border-black/55 pb-[6px] text-[8px] tracking-[0.15em] transition-opacity duration-300 hover:opacity-55 lg:mt-6 lg:inline-flex lg:text-[9px]"
        >
          Shop collection →
        </Link>
      </div>

      <div className="flex min-w-0 flex-col justify-between px-5 pb-7 pt-5 lg:border-r lg:px-[4vw] lg:py-[30px]">
        <p className="hidden max-w-[620px] text-[11px] leading-[1.55] tracking-[0.12em] lg:block lg:text-[18px]">
          Low Signal works with washed cotton, dense knitwear, black canvas,
          and garments made for repeat wear.
        </p>
        <div className="flex flex-wrap gap-x-5 gap-y-3 text-[8px] lg:mt-[28px] lg:gap-x-8 lg:border-t lg:border-black/18 lg:pt-4 lg:text-[9px]">
          {footerLinks.map(([label, href], index) => (
            <Link
              key={label}
              href={href}
              className={`${index === footerLinks.length - 1 ? "hidden lg:inline-flex" : "inline-flex"} border-b border-black/20 pb-2 transition-opacity duration-300 hover:opacity-55`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>

      <div className="hidden px-[7vw] py-[28px] lg:block lg:px-[2vw] lg:py-[30px]">
        <div className="relative h-[92px] overflow-hidden border border-black/16 bg-[#d1ccc2] lg:h-[108px]">
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
