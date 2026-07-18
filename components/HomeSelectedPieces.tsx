import Image from "next/image";
import Link from "next/link";
import { ProductAddAction } from "@/components/ProductAddAction";
import { type Product, products } from "@/data/products";

const selectedIds = [
  "field-jacket",
  "work-jacket",
  "cotton-shirt",
  "storm-parka",
  "double-face-coat",
  "pleated-pant",
] as const;

const selectedProducts = selectedIds.map((id) => {
  const product = products.find((item) => item.id === id);
  if (!product) throw new Error(`Missing selected product: ${id}`);
  return product;
});

export function HomeSelectedPieces() {
  return (
    <section
      aria-labelledby="selected-garments-title"
      className="selected-garments-section mobile-selected-editorial order-2 scroll-mt-16 border-y border-black/14 bg-[#dedfd9] py-7 text-[#11110f] lg:order-none lg:scroll-mt-24 lg:py-9"
      id="selected-pieces"
    >
      <div className="mx-auto max-w-[1680px] px-4 sm:px-6 lg:px-12">
        <header className="mb-5 grid grid-cols-[1fr_auto] items-end gap-4 border-b border-black/14 pb-4 text-[10px] font-normal uppercase tracking-[0.12em] text-black/58 lg:mb-6 lg:grid-cols-[minmax(190px,0.34fr)_1fr_auto]">
          <h2 className="font-normal" id="selected-garments-title">
            04 / Selected garments
          </h2>
          <p className="hidden lg:block">Selected pieces available online.</p>
          <nav
            aria-label="Selected garment collections"
            className="flex gap-4 lg:gap-6"
          >
            <Link className="border-b border-current/45 pb-1" href="/collections/men">
              Men
            </Link>
            <Link className="border-b border-current/45 pb-1" href="/collections/women">
              Women
            </Link>
          </nav>
        </header>

        <div className="grid gap-6 lg:grid-cols-[minmax(320px,38%)_minmax(0,1fr)]">
          <Link
            aria-label="Shop selected garments"
            className="group relative hidden min-h-[620px] overflow-hidden border border-black/14 bg-[#c8cbc5] lg:block"
            href="/collections"
          >
            <Image
              alt="Black LOW SIGNAL garment arranged on a studio chair"
              className="object-cover object-[54%_50%] brightness-[0.76] contrast-[1.06] saturate-[0.58] transition-transform duration-700 group-hover:scale-[1.012]"
              fill
              sizes="38vw"
              src="/images/low-signal/selected-garments-main.jpg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/64 via-black/7 to-black/6" />
            <div className="absolute inset-x-0 bottom-0 grid gap-3 p-7 text-[#f1f1ea]">
              <p className="text-[22px] font-normal uppercase tracking-[0.07em]">
                Selected garments
              </p>
              <p className="text-[10px] uppercase tracking-[0.12em] text-white/64">
                06 pieces
              </p>
              <span className="mt-3 w-fit border-b border-white/58 pb-1 text-[10px] uppercase tracking-[0.1em]">
                Shop selection →
              </span>
            </div>
          </Link>

          <div className="grid min-w-0 grid-cols-2 gap-x-3 gap-y-7 lg:gap-x-5 lg:gap-y-6">
            {selectedProducts.slice(0, 4).map((product, index) => (
              <SelectedProductCard
                index={index}
                key={product.id}
                product={product}
              />
            ))}
          </div>
        </div>

        <div className="mt-7 flex justify-center border-t border-black/14 pt-5 lg:justify-end">
          <Link
            className="flex min-h-11 items-center border-b border-black/48 text-[10px] font-normal uppercase tracking-[0.11em]"
            href="/collections"
          >
            View all 6 →
          </Link>
        </div>
      </div>
    </section>
  );
}

function SelectedProductCard({
  index,
  product,
}: Readonly<{ index: number; product: Product }>) {
  return (
    <article className="group relative min-w-0 border-b border-white/14 pb-3 lg:border-black/14 lg:pb-4">
      <Link
        aria-label={`Open ${product.name}`}
        className="absolute inset-0 z-10 focus:outline-none focus-visible:ring-1 focus-visible:ring-current"
        href={`/products/${product.slug}`}
      />
      <div className="relative aspect-[4/5] overflow-hidden border border-white/14 bg-[#ccd0c9] lg:aspect-[8/5] lg:border-black/14">
        <span className="absolute left-3 top-3 z-[1] text-[9px] uppercase tracking-[0.12em] text-white/70">
          {String(index + 1).padStart(2, "0")}
        </span>
        <Image
          alt={product.name}
          className={`object-cover brightness-[0.86] contrast-[1.05] saturate-[0.65] transition-transform duration-700 group-hover:scale-[1.015] ${
            product.objectPosition ?? "object-center"
          }`}
          fill
          sizes="(min-width: 1024px) 30vw, 48vw"
          src={product.image}
        />
      </div>
      <div className="grid min-h-[104px] grid-cols-[minmax(0,1fr)_auto] gap-2 pt-3 uppercase lg:min-h-[92px]">
        <div className="min-w-0">
          <h3 className="text-[11px] font-normal tracking-[0.06em] lg:text-[13px]">
            {product.name}
          </h3>
          <p className="mt-2 text-[9px] tracking-[0.08em] text-white/52 lg:text-black/54">
            {product.category}
          </p>
          <p className="mt-2 text-[11px] font-normal">${product.price}</p>
        </div>
        <div className="relative z-20 self-end">
          <div className="lg:hidden">
            <ProductAddAction product={product} tone="dark" />
          </div>
          <div className="hidden lg:block">
            <ProductAddAction product={product} />
          </div>
        </div>
      </div>
    </article>
  );
}
