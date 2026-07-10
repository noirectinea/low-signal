import Image from "next/image";
import { Cormorant_Garamond } from "next/font/google";
import Link from "next/link";
import { CartCountLink } from "@/components/CartCountLink";
import { LogoMark } from "@/components/LogoMark";
import { getProductsByGender, type ProductGender } from "@/data/products";

const collectionsDisplay = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

const entryCards: Array<{
  gender: ProductGender;
  imagePriority?: boolean;
  label: string;
}> = [
  {
    gender: "men",
    imagePriority: true,
    label: "MEN",
  },
  {
    gender: "women",
    label: "WOMEN",
  },
];

export const metadata = {
  title: "Spring 2026 Collections / LOW SIGNAL",
};

export default function CollectionsPage() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-[#e6e7e2] text-[#121211]">
      <CollectionsNav />

      <section className="mx-auto grid min-h-screen w-full max-w-[1680px] px-5 pb-16 pt-[96px] sm:px-6 lg:grid-cols-[minmax(320px,480px)_1fr] lg:gap-14 lg:px-12 lg:pb-20 lg:pt-[112px] xl:gap-20 xl:px-14">
        <header className="border-b border-black/16 pb-10 lg:border-b-0 lg:pb-0">
          <p className="text-[9px] uppercase tracking-[0.22em] text-black/48">
            05 — Collection / LOW SIGNAL
          </p>

          <h1 className={`${collectionsDisplay.className} mt-8 max-w-[560px] text-[62px] font-semibold uppercase leading-[0.86] tracking-[-0.03em] text-black/94 sm:text-[82px] lg:text-[94px] xl:text-[106px]`}>
            <span>SPRING</span>{" "}
            <span className="inline-block scale-[0.94] tracking-[-0.012em] [font-feature-settings:'tnum']">
              2026
            </span>
          </h1>

          <p className="mt-8 max-w-[430px] text-[11px] uppercase leading-[1.82] tracking-[0.17em] text-black/60">
            Dark neutral clothing, cut for daily repeat. Washed fabrics, quiet
            volume, and pieces that move with you.
          </p>

          <div className="mt-10 flex items-center gap-4 border-y border-black/16 py-5 text-[9px] uppercase tracking-[0.18em] text-black/54">
            <span className="h-px w-8 bg-black/30" />
            <span>Choose a shop rail</span>
          </div>
        </header>

        <div className="grid content-end gap-5 pt-7 sm:grid-cols-2 lg:pt-0">
          {entryCards.map((card) => (
            <CollectionEntryCard
              gender={card.gender}
              key={card.gender}
              label={card.label}
              priority={card.imagePriority}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

function CollectionsNav() {
  return (
    <nav className="fixed left-0 right-0 top-0 z-30 grid min-h-[64px] grid-cols-[1fr_auto] items-start gap-6 border-b border-black/14 bg-[#e1e2dd]/94 px-5 py-5 text-[9px] uppercase tracking-[0.18em] text-[#121211] backdrop-blur-sm md:grid-cols-[1fr_auto_1fr] lg:px-12">
      <LogoMark />

      <div className="hidden justify-center gap-14 md:flex">
        <Link href="/">Home</Link>
        <Link className="border-b border-black pb-2" href="/collections">
          Collections
        </Link>
        <Link href="/lookbook">Lookbook</Link>
        <Link href="/about">About</Link>
      </div>

      <div className="flex justify-end">
        <CartCountLink />
      </div>
    </nav>
  );
}

function CollectionEntryCard({
  gender,
  label,
  priority = false,
}: Readonly<{
  gender: ProductGender;
  label: string;
  priority?: boolean;
}>) {
  const products = getProductsByGender(gender);
  const leadImage =
    gender === "men"
      ? {
          className: "object-[50%_43%]",
          src: "/images/low-signal/products/product-01.jpg",
        }
      : {
          className: "object-[50%_47%]",
          src: "/images/low-signal/products/product-07.jpg",
        };

  return (
    <article className="group border-y border-black/18 py-4 sm:border-b sm:border-t-0 sm:pt-0">
      <Link
        className="block focus:outline-none focus-visible:ring-1 focus-visible:ring-black"
        href={`/collections/${gender}`}
      >
        <div className="relative aspect-[4/5] overflow-hidden border border-black/12 bg-[#d1d3cd]">
          <Image
            alt={`${label} Spring 2026 category`}
            className={`editorial-image object-cover brightness-[0.82] contrast-[1.06] saturate-[0.66] transition duration-700 group-hover:brightness-[0.9] ${leadImage.className}`}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 34vw, (min-width: 640px) 45vw, 92vw"
            src={leadImage.src}
          />
          <span className="absolute left-4 top-4 text-[9px] uppercase tracking-[0.18em] text-[#f2f3ee]/90 mix-blend-difference">
            {String(products.length).padStart(2, "0")} items
          </span>
        </div>

        <div className="grid grid-cols-[1fr_auto] items-end gap-4 border-b border-black/14 pb-5 pt-5 uppercase">
          <div>
            <h2 className="font-serif text-[44px] uppercase leading-[0.88] tracking-[-0.05em] text-black/94 sm:text-[54px] lg:text-[62px]">
              {label}
            </h2>
            <p className="mt-4 text-[9px] tracking-[0.18em] text-black/50">
              {String(products.length).padStart(2, "0")} products / Spring 2026
            </p>
          </div>

          <span className="mb-1 border-b border-black/58 pb-1 text-[9px] tracking-[0.18em] text-black transition-opacity duration-300 group-hover:opacity-55">
            SHOP {label} →
          </span>
        </div>
      </Link>
    </article>
  );
}
