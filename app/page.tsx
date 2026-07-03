import Image from "next/image";
import Link from "next/link";
import { Libre_Caslon_Display } from "next/font/google";

const display = Libre_Caslon_Display({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const heroImage = "/images/hero/ch1.png";
const collectionImage = "/images/hero/ch3.png";
const lookbookImage = "/images/low-signal/lookbook-coast.jpg";
const garmentOne = "/images/low-signal/selected-garments-main.jpg";
const garmentTwo = "/images/low-signal/selected-garments-detail.jpg";
const materialImage = "/images/hero/coast-hero3.png";
const journalImage = "/images/hero/ch6.png";
const selectedPieces = [
  {
    name: "Field Jacket",
    category: "Outerwear",
    price: "$180",
    image: "/images/low-signal/products/product-01.jpg",
  },
  {
    name: "Washed Longsleeve",
    category: "Tops",
    price: "$90",
    image: "/images/low-signal/products/product-02.jpg",
  },
  {
    name: "Wide Trouser",
    category: "Bottoms",
    price: "$140",
    image: "/images/low-signal/products/product-04.jpg",
  },
];

const materialNotes = ["Washed cotton", "Dry wool", "Raw canvas", "Worn nylon"];
const editorialNotes = [
  ["Cut when needed", "Small runs / Issue 01"],
  ["Worn until quiet", "Repeated wear / Current rail"],
  ["Room to move", "Archive fit / Low Signal"],
];
const journalRows = [
  ["01", "Field note"],
  ["02", "Material log"],
  ["03", "Coastal light"],
  ["04", "Road note"],
];
const archiveLinks = [
  "Collections",
  "Lookbook",
  "Journal",
  "Contact",
  "Shipping",
  "Instagram",
];

export default function Home() {
  return (
    <main className="min-h-screen w-screen overflow-x-hidden bg-[#f5f2ed] text-[#111]">
      <section className="grid w-screen overflow-hidden bg-[#f5f2ed] md:h-[100svh] md:grid-rows-[65fr_35fr]">
        <HeroPanel />
        <EditorialGrid />
      </section>
      <MaterialForm />
      <SelectedPieces />
      <JournalSection />
      <FinalFooter />
    </main>
  );
}

function HeroPanel() {
  return (
    <section className="relative min-h-[620px] overflow-hidden border-b border-black/20 bg-[#f5f2ed] md:h-full md:min-h-0">
      <div className="absolute inset-y-0 left-0 w-[29.5vw] bg-[#f5f2ed]" />
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

      <header className="absolute left-[18px] right-[18px] top-[16px] z-30 flex h-[32px] items-start text-[8px] uppercase tracking-[0.16em]">
        <Link href="/" className="relative -top-[3px] w-[18.1vw] font-medium leading-[0.95]">
          Low
          <br />
          Signal
        </Link>
        <nav className="hidden gap-[38px] md:flex">
          <Link href="/collections">Collections</Link>
          <a href="#lookbook">Lookbook</a>
          <Link href="/about">About</Link>
        </nav>
        <div className="ml-auto flex items-start gap-[24px]">
          <span>2026 / Issue 01</span>
          <span className="-mt-1 grid size-[26px] place-items-center border border-black/40 text-[10px]">
            ♧
          </span>
        </div>
      </header>

      <div className="absolute left-[5.15vw] top-[57%] z-20 hidden md:block">
        <Kicker number="01" />
        <p className="mt-[28px] max-w-[205px] text-[12px] uppercase leading-[1.46] tracking-[0.19em]">
          Independent clothing for people who observe first.
        </p>
        <div className="mt-[30px] grid max-w-[205px] gap-3 border-y border-black/18 py-4 text-[8px] uppercase leading-[1.45] tracking-[0.17em] text-black/48">
          <span>Spring 2026 / Issue 01</span>
          <span>Garment index</span>
        </div>
        <Link className="mt-[44px] inline-flex border-b border-black pb-[5px] text-[8px] uppercase tracking-[0.16em]" href="/about">
          About the brand
        </Link>
      </div>

      <div className="absolute bottom-[30px] left-[5.15vw] z-20 hidden w-[210px] grid-cols-3 gap-4 border-t border-black/18 pt-4 text-[7px] uppercase leading-[1.45] tracking-[0.16em] text-black/42 md:grid">
        <span>Daily repeat</span>
        <span>Quiet cut</span>
        <span>Low signal</span>
      </div>

      <p className="absolute right-[74px] top-[104px] z-30 max-w-[74px] text-[9px] uppercase leading-[1.34] tracking-[0.18em] text-black/68">
        Observes. Does not explain.
      </p>

      <h1
        className={`${display.className} absolute left-[42.7vw] top-[28.8%] z-30 text-[13.1vw] leading-[0.75] tracking-[-0.047em] text-[#f3eee7]/82 mix-blend-screen [text-shadow:0_2px_18px_rgba(17,17,17,0.32)]`}
      >
        LOW
        <br />
        SIGNAL
      </h1>

      <p className="absolute bottom-[34px] right-[232px] z-30 hidden max-w-[245px] text-center text-[9px] uppercase leading-[1.45] tracking-[0.19em] text-[#f5f2ed]/78 md:block">
        A brand that behaves like a note found between pages.
      </p>
    </section>
  );
}

function EditorialGrid() {
  return (
    <section className="grid border-b border-black/20 md:h-full md:grid-cols-[32.5vw_24vw_1fr]">
      <Link
        href="/collections"
        className="relative grid border-b border-black/20 md:grid-cols-[47.96%_52.04%] md:border-b-0 md:border-r"
      >
        <div className="flex h-full flex-col bg-[#ece8df] px-[27px] py-[34px]">
          <Kicker number="02" />
          <p className="mt-[24px] text-[10px] uppercase leading-[1.5] tracking-[0.22em]">
            Spring 2026
          </p>
          <p className="mt-[18px] max-w-[130px] text-[10px] uppercase leading-[1.55] tracking-[0.2em]">
            A collection built on restraint, quiet structures, and small
            interruptions.
          </p>
          <span className="mt-auto inline-flex w-fit border-b border-black pb-[4px] text-[8px] uppercase tracking-[0.16em]">
            View collection
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

      <a
        id="lookbook"
        href="#"
        className="flex h-full flex-col border-b border-black/20 bg-[#eeeae2] px-[46px] py-[34px] md:border-b-0 md:border-r"
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
        <span className="mt-auto inline-flex w-[76px] border-b border-black pb-[4px] text-[8px] uppercase tracking-[0.16em]">
          View lookbook
        </span>
      </a>

      <section className="relative grid min-h-[320px] bg-[#151413] text-[#f5f2ed] md:min-h-0 md:grid-cols-[30%_44%_26%]">
        <div className="flex h-full flex-col px-[30px] py-[34px]">
          <Kicker number="04" light />
          <p className="mt-[24px] max-w-[92px] text-[10px] uppercase leading-[1.62] tracking-[0.2em]">
            Selected garments
          </p>
          <Link
            href="/collections"
            className="mt-auto inline-flex w-[42px] border-b border-[#f5f2ed]/70 pb-[4px] text-[8px] uppercase tracking-[0.16em]"
          >
            Explore
          </Link>
        </div>
        <div className="flex h-full flex-col justify-center px-[30px] pb-[28px] md:px-0 md:py-[26px]">
          <div className="relative h-[150px] w-full overflow-hidden border border-[#f5f2ed]/10 bg-[#211f1c] md:h-[clamp(148px,18vh,196px)] md:w-[84%]">
            <Image
              src={garmentOne}
              alt="LOW SIGNAL garment study"
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
            Knit study / 02
          </p>
        </div>
        <div className="pointer-events-none absolute bottom-[31px] left-[30%] hidden h-px w-[10%] bg-[#f5f2ed]/12 md:block" />
      </section>
    </section>
  );
}

function MaterialForm() {
  return (
    <section className="grid min-h-[88svh] w-screen border-t border-black/20 bg-[#d7d4ca] md:grid-cols-[41.5vw_1fr]">
      <div className="relative min-h-[64svh] border-r border-black/20 bg-[#cbc8bf] md:min-h-0">
        <div className="px-[8.5vw] py-[76px] md:px-0 md:py-0">
          <div className="md:absolute md:left-[8.5vw] md:top-[22%] md:max-w-[310px]">
          <Kicker number="05" />
          <h2 className="mt-[42px] text-[11px] uppercase leading-[1.45] tracking-[0.22em]">
            Material & Form
          </h2>
          <p className="mt-[34px] text-[18px] uppercase leading-[1.42] tracking-[0.18em]">
            We work with materials
            <br />
            that age quietly and
            <br />
            take on character
            <br />
            over time.
          </p>
          <div className="mt-[40px] grid max-w-[240px] border-y border-black/18 text-[8px] uppercase tracking-[0.17em] text-black/54">
            {materialNotes.map((item) => (
              <div
                key={item}
                className="flex justify-between border-b border-black/12 py-3 last:border-b-0"
              >
                <span>{item}</span>
                <span className="text-black/34">01</span>
              </div>
            ))}
          </div>
          <a
            className="mt-[42px] inline-flex border-b border-black pb-[5px] text-[8px] uppercase tracking-[0.16em]"
            href="/about"
          >
            Our approach
          </a>
          </div>
        </div>
      </div>

      <div className="relative min-h-[64svh] overflow-hidden p-[7vw] md:min-h-0 md:p-[4.2vw]">
        <div className="relative h-full min-h-[54svh] overflow-hidden border border-black/16 bg-[#c8c4ba]">
          <Image
            src={materialImage}
            alt="Folded dark garment on a concrete surface"
            fill
            sizes="50vw"
            className="editorial-image object-cover object-center brightness-[1.04] contrast-[1.04]"
          />
          <div className="absolute inset-0 bg-[#d8cfc1]/5 mix-blend-screen" />
          <div className="absolute inset-0 bg-black/8" />
          <p className="absolute bottom-5 left-5 text-[8px] uppercase tracking-[0.18em] text-[#f5f2ed]/66">
            Crop note / handled fabric
          </p>
        </div>
      </div>
    </section>
  );
}

function SelectedPieces() {
  return (
    <section className="grid min-h-[92svh] w-screen border-t border-black/20 bg-[#cbc8bf] lg:grid-cols-[32.5vw_1fr]">
      <div className="border-b border-black/20 bg-[#ece8df] px-[7vw] py-[72px] lg:border-b-0 lg:border-r lg:px-[6vw] lg:py-[12vh]">
        <Kicker number="06" />
        <h2 className="mt-[42px] text-[11px] uppercase leading-[1.45] tracking-[0.22em]">
          Selected Pieces
        </h2>
        <div className="mt-[26px] grid max-w-[230px] grid-cols-3 border-y border-black/18 py-3 text-[7px] uppercase leading-[1.5] tracking-[0.16em] text-black/42">
          <span>Current rail</span>
          <span>Three pieces</span>
          <span>Issue 01</span>
        </div>
        <p className="mt-[46px] max-w-[330px] text-[29px] uppercase leading-[1.04] tracking-[0.13em] md:text-[38px] lg:text-[2.7vw]">
          Garments with
          <br />
          room to disappear.
        </p>
        <p className="mt-[34px] max-w-[292px] text-[11px] uppercase leading-[1.72] tracking-[0.18em] text-black/52">
          Built for repeated wear.
          <br />
          Plain until you notice the cut.
        </p>
        <p className="mt-[24px] max-w-[245px] text-[9px] uppercase leading-[1.7] tracking-[0.16em] text-black/42">
          A short rail for colder light, long walks, and the same door every
          morning.
        </p>
        <Link
          href="/collections"
          className="mt-[56px] inline-flex border-b border-black pb-[5px] text-[8px] uppercase tracking-[0.16em]"
        >
          Shop collection
        </Link>
      </div>

      <div className="flex min-w-0 flex-col">
        <div className="flex items-center justify-between border-b border-black/20 bg-[#d2cec4] px-[7vw] py-5 lg:px-[3vw]">
          <span className="text-[8px] uppercase tracking-[0.18em] text-black/45">
            Three pieces / Current rail
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="grid size-7 place-items-center rounded-full border border-black/20 text-[12px] leading-none text-black/55 transition-colors duration-300 hover:border-black/45 hover:text-black"
              aria-label="Previous selected piece"
            >
              ←
            </button>
            <button
              type="button"
              className="grid size-7 place-items-center rounded-full border border-black/20 text-[12px] leading-none text-black/55 transition-colors duration-300 hover:border-black/45 hover:text-black"
              aria-label="Next selected piece"
            >
              →
            </button>
            <Link
              href="/collections"
              className="ml-2 border-b border-black/70 pb-[4px] text-[8px] uppercase tracking-[0.16em]"
            >
              View all
            </Link>
          </div>
        </div>

        <div className="grid auto-cols-[78vw] grid-flow-col gap-px overflow-x-auto border-b border-black/18 bg-black/14 p-px lg:auto-cols-auto lg:grid-flow-row lg:grid-cols-3 lg:overflow-visible">
          {selectedPieces.map((product, index) => (
            <Link
              href="/collections"
              key={product.name}
              className="group flex min-w-0 flex-col bg-[#d2cec4]"
            >
              <div className="px-4 pt-4 lg:px-[1.45vw] lg:pt-[1.45vw]">
                <figure className="relative aspect-[4/5] overflow-hidden bg-[#d8d4ca]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  sizes="(min-width: 1024px) 20vw, 78vw"
                  className={`product-image object-cover brightness-[0.84] contrast-[1.05] saturate-[0.76] transition duration-500 group-hover:brightness-[0.9] ${
                    index === 1 ? "object-[50%_18%]" : "object-[50%_12%]"
                  }`}
                />
                <div className="absolute inset-0 bg-[#151413]/5" />
                <span className="absolute left-4 top-4 text-[8px] uppercase tracking-[0.16em] text-[#f5f2ed]/72">
                  {String(index + 1).padStart(2, "0")}
                </span>
                </figure>
              </div>

              <div className="flex flex-1 flex-col px-4 pb-7 pt-5 lg:px-[1.45vw] lg:pb-[4.8vh]">
                <div className="grid grid-cols-[1fr_auto] gap-6 text-[9px] uppercase tracking-[0.14em]">
                  <div>
                    <h3>{product.name}</h3>
                    <p className="mt-3 text-black/45">{product.category}</p>
                  </div>
                  <p>{product.price}</p>
                </div>
                <div className="mt-7 h-px w-10 bg-black/28" />
                <div className="mt-4 text-[8px] uppercase tracking-[0.16em] text-black/38">
                  {index === 0 ? "Rail note / outer layer" : index === 1 ? "Sleeve study / daily repeat" : "Cut note / archive fit"}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="border-b border-black/18 bg-[#c4c0b6] px-[7vw] py-7 text-[8px] uppercase tracking-[0.16em] lg:px-[3vw]">
          <div className="grid gap-5 border-y border-black/16 py-5 md:grid-cols-3">
            {editorialNotes.map(([title, text], index) => (
              <div
                key={title}
                className={`border-black/14 md:border-r md:pr-6 ${
                  index === 2 ? "md:border-r-0" : ""
                }`}
              >
                <p className="text-[9px] tracking-[0.2em]">{title}</p>
                <p className="mt-3 leading-[1.5] tracking-[0.12em] text-black/45">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function JournalSection() {
  return (
    <section className="w-screen overflow-hidden border-t border-black/18 bg-[#cbc8bf] px-[6vw] py-[64px] text-[#111] md:px-[4.5vw] md:py-[7vh]">
      <div className="grid gap-10 lg:grid-cols-[31vw_1fr]">
        <aside className="flex min-h-[58svh] max-w-[390px] flex-col">
          <Kicker number="07" />
          <h2 className="mt-[34px] text-[11px] uppercase leading-[1.45] tracking-[0.22em]">
            Journal
          </h2>
          <p className="mt-[40px] text-[24px] uppercase leading-[1.18] tracking-[0.15em] md:text-[30px]">
            Notes kept
            <br />
            between weather
            <br />
            and cloth.
          </p>
          <p className="mt-[26px] max-w-[330px] text-[10px] uppercase leading-[1.72] tracking-[0.16em] text-black/48">
            A record of surfaces, repeated wear, road light, and things seen
            before the room gets loud.
          </p>

          <div className="mt-auto border-y border-black/18 py-5 text-[8px] uppercase leading-[1.65] tracking-[0.17em] text-black/48">
            <p className="text-black/68">Current entry</p>
            <p className="mt-4">Road note / 01</p>
            <p className="mt-4 max-w-[275px]">
              Coastal light, washed wool, empty roads.
            </p>
          </div>
        </aside>

        <div className="min-w-0">
          <div className="relative h-[38svh] min-h-[280px] overflow-hidden border border-black/15 bg-[#bdb8ae] md:h-[46svh]">
            <Image
              src={journalImage}
              alt="Open book, dark fabric, and cup on a quiet surface"
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
            <div className="grid gap-4 sm:grid-cols-3">
              {[
                [garmentTwo, "Fabric / button detail"],
                [lookbookImage, "Grey coast / road light"],
                [garmentOne, "Zipper / garment detail"],
              ].map(([src, label], index) => (
                <div key={label} className={index === 1 ? "sm:mt-7" : ""}>
                  <div className="relative h-[112px] overflow-hidden border border-black/14 bg-[#151413]">
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
                  <p className="mt-3 text-[7px] uppercase tracking-[0.17em] text-black/40">
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <div className="border-y border-black/18 py-4 text-[8px] uppercase leading-[1.55] tracking-[0.16em] text-black/50 lg:mt-7">
              <p className="text-black/70">Field note</p>
              <p className="mt-2">Coastal light</p>
              <p className="mt-5 text-black/70">Location</p>
              <p className="mt-2">Northern coast</p>
              <p className="mt-5 text-black/70">Condition</p>
              <p className="mt-2">Wind / Overcast</p>
            </div>
          </div>

          <div className="mt-8 border-t border-black/20 text-[8px] uppercase tracking-[0.17em] text-black/58">
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
    <footer className="grid min-h-[34svh] w-screen border-t border-black/20 bg-[#c8c4ba] text-[8px] uppercase tracking-[0.16em] md:grid-cols-[22vw_1fr_18vw]">
      <div className="border-b border-black/18 px-[7vw] py-[38px] md:border-b-0 md:border-r md:px-[3vw]">
        <Kicker number="08" />
        <h2 className="mt-[30px] text-[11px] uppercase tracking-[0.22em]">
          Archive index
        </h2>
      </div>

      <div className="flex flex-col justify-between border-b border-black/18 px-[7vw] py-[38px] md:border-b-0 md:border-r md:px-[4vw]">
        <p className="max-w-[620px] text-[15px] leading-[1.45] tracking-[0.18em] md:text-[19px]">
          Low Signal exists for quiet garments,
          daily repeat, and people who observe first.
        </p>
        <div className="mt-[38px] flex flex-wrap gap-x-8 gap-y-3 border-t border-black/18 pt-5">
          {archiveLinks.map((link) => (
            <a
              key={link}
              href={link === "Collections" ? "/collections" : "#"}
              className="border-b border-black/20 pb-2 transition-opacity duration-300 hover:opacity-55"
            >
              {link}
            </a>
          ))}
        </div>
      </div>

      <div className="px-[7vw] py-[38px] md:px-[2vw]">
        <div className="relative h-[108px] overflow-hidden border border-black/16 bg-[#151413] md:h-[126px]">
          <Image
            src={garmentTwo}
            alt="LOW SIGNAL fabric detail"
            fill
            sizes="28vw"
            className="editorial-image object-cover object-center brightness-[0.86] contrast-[1.04]"
          />
        </div>
        <p className="mt-4 text-black/46">Fabric detail / closing page</p>
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
