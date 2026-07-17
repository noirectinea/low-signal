import Image from "next/image";
import Link from "next/link";
import { MobileHomeHeader } from "@/components/MobileHomeHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { getProductsByGender, type ProductGender } from "@/data/products";

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

const categoryPreviews = [
  {
    href: "/search?q=Outerwear",
    image: "/images/low-signal/selected-collection/outer-layer.jpg",
    label: "Outerwear",
    note: "Washed shells, field layers, and quiet protection.",
  },
  {
    href: "/search?q=Knitwear",
    image: "/images/low-signal/selected-collection/knitwear.jpg",
    label: "Knitwear",
    note: "Rib texture, soft wool, and pieces built for repeat wear.",
  },
  {
    href: "/search?q=Trousers",
    image: "/images/low-signal/selected-collection/trousers.jpg",
    label: "Trousers",
    note: "Relaxed volume, dry cloth, and a low break over the shoe.",
  },
];

export const metadata = {
  title: "Spring 2026 Collections / LOW SIGNAL",
};

export default function CollectionsPage() {
  return (
    <main className="min-h-screen bg-[#e6e7e2] text-[#121211]">
      <MobileHomeHeader mode="paper" />

      <section className="mobile-collections-hero mx-auto grid min-h-[88svh] w-full max-w-[1680px] px-5 pb-12 pt-[96px] sm:px-6 lg:grid-cols-[minmax(320px,480px)_1fr] lg:gap-14 lg:px-12 lg:pb-14 lg:pt-[112px] xl:gap-20 xl:px-14">
        <header className="mobile-collections-intro border-b border-black/16 pb-10 lg:border-b-0 lg:pb-0">
          <p className="text-[9px] uppercase tracking-[0.22em] text-black/48">
            05 — Collection / LOW SIGNAL
          </p>

          <h1 className="controlled-display-title mt-8 max-w-[600px] text-[58px] text-black/94 sm:text-[76px] lg:text-[88px] xl:text-[98px]">
            <span className="block">SPRING</span>
            <span className="mt-1 block text-black/90 [font-feature-settings:'tnum']">
              2026
            </span>
          </h1>

          <p className="mt-8 max-w-[430px] text-[11px] uppercase leading-[1.82] tracking-[0.17em] text-black/60">
            Dark neutral clothing, cut for daily repeat. Washed fabrics, quiet
            volume, and pieces that move with you.
          </p>

          <div className="mt-10 flex items-center gap-4 border-y border-black/16 py-5 text-[9px] uppercase tracking-[0.18em] text-black/54">
            <span className="h-px w-8 bg-black/30" />
            <span>Spring 2026 is divided into two rails.</span>
          </div>
        </header>

        <div className="mobile-collection-entries grid content-end gap-5 pt-7 sm:grid-cols-2 lg:pt-0">
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
      <section className="mobile-collection-notes mx-auto grid max-w-[1680px] gap-6 border-t border-black/16 px-5 py-10 sm:px-6 lg:grid-cols-[minmax(280px,420px)_1fr] lg:px-12 lg:py-12 xl:px-14">
        <div className="grid content-between gap-8 border-b border-black/14 pb-7 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-10">
          <div>
            <p className="text-[9px] uppercase tracking-[0.18em] text-black/54">
              Collection notes
            </p>
            <p className="mt-6 max-w-[360px] text-[11px] uppercase leading-[1.78] tracking-[0.15em] text-black/64">
              Spring 2026 is built around dark neutrals, concrete light, and
              garments that sit close to daily routine.
            </p>
          </div>

          <div className="flex flex-wrap gap-x-7 gap-y-3 text-[9px] uppercase tracking-[0.16em]">
            <Link className="border-b border-black/60 pb-[5px]" href="/collections/men">
              Shop men →
            </Link>
            <Link className="border-b border-black/60 pb-[5px]" href="/collections/women">
              Shop women →
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {categoryPreviews.map((preview) => (
            <Link
              className="group grid gap-4 border-b border-black/14 pb-4"
              href={preview.href}
              key={preview.label}
            >
              <div className="relative aspect-[5/4] overflow-hidden border border-black/12 bg-[#d1d3cd]">
                <Image
                  alt={`${preview.label} preview`}
                  className="object-cover brightness-[0.84] contrast-[1.05] saturate-[0.62] transition duration-700 group-hover:scale-[1.03] group-hover:brightness-[0.9]"
                  fill
                  sizes="(min-width: 1024px) 22vw, 90vw"
                  src={preview.image}
                />
              </div>
              <div className="grid gap-3 text-[9px] uppercase leading-[1.7] tracking-[0.16em]">
                <p className="text-black">{preview.label}</p>
                <p className="text-black/58">{preview.note}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
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
    <article className={`mobile-collection-entry mobile-collection-entry-${gender} quiet-reveal group border-y border-black/18 py-4 sm:border-b sm:border-t-0 sm:pt-0`}>
      <Link
        className="block focus:outline-none focus-visible:ring-1 focus-visible:ring-black"
        href={`/collections/${gender}`}
      >
        <div className="relative aspect-[4/5] overflow-hidden border border-black/12 bg-[#d1d3cd]">
          <Image
            alt={`${label} Spring 2026 category`}
            className={`editorial-image object-cover brightness-[0.82] contrast-[1.06] saturate-[0.66] transition duration-700 group-hover:scale-[1.03] group-hover:brightness-[0.9] ${leadImage.className}`}
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
            <h2 className="fashion-rail-title text-[42px] text-black/94 sm:text-[50px] lg:text-[58px]">
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
