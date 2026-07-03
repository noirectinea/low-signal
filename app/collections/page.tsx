"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

const products = [
  {
    name: "Field Jacket",
    category: "Outerwear",
    price: 280,
    image: "/images/low-signal/products/product-01.jpg",
  },
  {
    name: "Washed Longsleeve",
    category: "Shirts",
    price: 140,
    image: "/images/low-signal/products/product-02.jpg",
  },
  {
    name: "Textured Knit",
    category: "Knitwear",
    price: 160,
    image: "/images/low-signal/products/product-03.jpg",
  },
  {
    name: "Wide Trouser",
    category: "Trousers",
    price: 210,
    image: "/images/low-signal/products/product-04.jpg",
  },
  {
    name: "Work Jacket",
    category: "Jackets",
    price: 260,
    image: "/images/low-signal/products/product-05.jpg",
  },
  {
    name: "Utility Overshirt",
    category: "Shirts",
    price: 190,
    image: "/images/low-signal/products/product-06.jpg",
  },
  {
    name: "Cotton Shirt",
    category: "Shirts",
    price: 170,
    image: "/images/low-signal/products/product-07.jpg",
  },
  {
    name: "Outer Coat",
    category: "Outerwear",
    price: 420,
    image: "/images/low-signal/products/product-08.jpg",
  },
  {
    name: "Long Skirt",
    category: "Trousers",
    price: 180,
    image: "/images/low-signal/products/product-09.jpg",
  },
  {
    name: "Zip Jacket",
    category: "Jackets",
    price: 180,
    image: "/images/low-signal/products/product-10.jpg",
  },
  {
    name: "Taupe Chore Coat",
    category: "Outerwear",
    price: 300,
    image: "/images/low-signal/products/product-11.jpg",
  },
  {
    name: "Layered Set",
    category: "Outerwear",
    price: 360,
    image: "/images/low-signal/products/product-12.jpg",
  },
];

const audienceFilters = [
  ["All garments", "120"],
  ["Men", "48"],
  ["Women", "52"],
  ["Unisex", "20"],
];

const categoryFilters = [
  ["Jackets", "18"],
  ["Shirts", "24"],
  ["Knitwear", "16"],
  ["Outerwear", "22"],
  ["Trousers", "20"],
  ["Shorts", "10"],
  ["Accessories", "10"],
];

const filterableCategories = new Set([
  "Jackets",
  "Shirts",
  "Knitwear",
  "Outerwear",
  "Trousers",
]);

export default function CollectionsPage() {
  const [panelOpen, setPanelOpen] = useState(true);
  const [activeFilter, setActiveFilter] = useState("All garments");

  const visibleProducts = useMemo(() => {
    if (!filterableCategories.has(activeFilter)) {
      return products;
    }

    return products.filter((product) => product.category === activeFilter);
  }, [activeFilter]);

  function chooseFilter(label: string) {
    setActiveFilter(label);
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#c6c2b8] text-[#141311]">
      <AssortmentPanel
        activeFilter={activeFilter}
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        onFilter={chooseFilter}
      />

      {panelOpen && (
        <button
          aria-label="Close filters"
          className="fixed inset-0 z-40 bg-black/10 lg:hidden"
          type="button"
          onClick={() => setPanelOpen(false)}
        />
      )}

      <div
        className={`transition-[padding] duration-500 ${
          panelOpen ? "lg:pl-[392px]" : "lg:pl-0"
        }`}
      >
        <CollectionsNav onCollections={() => setPanelOpen(true)} />
        <ProductGrid
          activeFilter={activeFilter}
          items={visibleProducts}
          onFilters={() => setPanelOpen(true)}
        />
      </div>
    </main>
  );
}

function AssortmentPanel({
  activeFilter,
  onClose,
  onFilter,
  open,
}: Readonly<{
  activeFilter: string;
  onClose: () => void;
  onFilter: (label: string) => void;
  open: boolean;
}>) {
  const panelFilters = [audienceFilters, categoryFilters];

  return (
    <aside
      className={`fixed bottom-0 left-0 top-0 z-50 flex w-[86vw] max-w-[392px] flex-col border-r border-black/18 bg-[#ece8df] px-8 py-8 text-[10px] uppercase tracking-[0.16em] text-[#141311] transition-transform duration-500 sm:w-[360px] lg:w-[392px] ${
        open ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-start justify-between">
        <button
          className="text-left transition-opacity duration-300 hover:opacity-55"
          type="button"
          onClick={onClose}
        >
          Close
        </button>
        <button
          aria-label="Close collections panel"
          className="relative size-6"
          type="button"
          onClick={onClose}
        >
          <span className="absolute left-1/2 top-1/2 h-px w-6 -translate-x-1/2 rotate-45 bg-black" />
          <span className="absolute left-1/2 top-1/2 h-px w-6 -translate-x-1/2 -rotate-45 bg-black" />
        </button>
      </div>

      <div className="mt-20">
        <p className="text-[9px] tracking-[0.2em] text-black/58">
          Collections
        </p>
        <h1 className="mt-8 max-w-[280px] font-serif text-[42px] normal-case leading-[0.96] tracking-[-0.04em] text-black sm:text-[50px]">
          Explore the
          <br />
          assortment.
        </h1>
      </div>

      <div className="mt-14 grid gap-12">
        {panelFilters.map((group, groupIndex) => (
          <div key={groupIndex} className="grid gap-0">
            {groupIndex === 1 && (
              <p className="mb-8 text-[9px] tracking-[0.18em] text-black/42">
                Categories
              </p>
            )}
            {group.map(([label, count]) => {
              const isActive = activeFilter === label;

              return (
                <button
                  key={label}
                  className={`flex items-center justify-between border-b border-black/22 py-3 text-left transition-opacity duration-300 hover:opacity-65 ${
                    isActive ? "text-black" : "text-black/62"
                  }`}
                  type="button"
                  onClick={() => onFilter(label)}
                >
                  <span>{label}</span>
                  <span className="text-black/42">{count}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>

      <Link
        href="/"
        className="mt-auto grid grid-cols-[42%_1fr] border border-black/14 bg-[#d8d4ca] text-[8px] leading-[1.55] tracking-[0.12em]"
      >
        <div className="relative min-h-[150px] overflow-hidden">
          <Image
            src="/images/hero/coast-hero.png"
            alt="LOW SIGNAL lookbook coast"
            fill
            sizes="140px"
            className="editorial-image object-cover object-[52%_50%] brightness-[0.72] contrast-[1.05] saturate-[0.78]"
          />
        </div>
        <div className="flex min-h-[150px] flex-col justify-between px-5 py-6">
          <div>
            <p>Spring 2026</p>
            <p className="mt-6 text-black/62">
              A collection built on restraint, quiet structures, and small
              interruptions.
            </p>
          </div>
          <span className="inline-flex items-center gap-5 border-b border-black/55 pb-1">
            View lookbook
            <span aria-hidden="true">-&gt;</span>
          </span>
        </div>
      </Link>
    </aside>
  );
}

function CollectionsNav({
  onCollections,
}: Readonly<{
  onCollections: () => void;
}>) {
  return (
    <nav className="fixed left-0 right-0 top-0 z-30 grid grid-cols-[1fr_auto] items-start gap-6 border-b border-black/20 bg-[#ece8df]/90 px-6 py-6 text-[9px] uppercase tracking-[0.18em] text-[#141311] backdrop-blur-sm md:grid-cols-[1fr_auto_1fr] lg:px-12">
      <Link href="/" className="font-medium">
        Low Signal
      </Link>

      <div className="hidden justify-center gap-12 md:flex">
        <button
          className="border-b border-black pb-2"
          type="button"
          onClick={onCollections}
        >
          Collections
        </button>
        <Link href="/">Lookbook</Link>
        <Link href="/">Journal</Link>
      </div>

      <div className="flex justify-end gap-6">
        <span>Cart (0)</span>
        <button className="text-left" type="button" onClick={onCollections}>
          Menu
        </button>
      </div>
    </nav>
  );
}

function ProductGrid({
  activeFilter,
  items,
  onFilters,
}: Readonly<{
  activeFilter: string;
  items: typeof products;
  onFilters: () => void;
}>) {
  return (
    <section className="bg-[#f0ece4] px-5 pb-12 pt-[104px] lg:px-12 lg:pb-16">
      <div className="mb-10 grid border-b border-black/16 pb-8 lg:grid-cols-[1fr_auto]">
        <div className="max-w-[520px]">
          <div className="flex items-center gap-4 text-[9px] uppercase tracking-[0.2em] text-black/50">
            <span>05</span>
            <span className="h-px w-7 bg-black/28" />
            <span>Garments</span>
            <span>Spring 2026</span>
          </div>
          <h1 className="mt-8 font-serif text-[clamp(3.9rem,8.4vw,8.2rem)] leading-[0.82] tracking-[-0.06em] text-black/92">
            Garment
            <br />
            archive.
          </h1>
        </div>

        <p className="mt-8 max-w-[310px] self-end text-[9px] uppercase leading-[1.7] tracking-[0.18em] text-black/48 lg:mt-0">
          Dark neutral clothing, concrete light, and pieces kept for daily
          repeat.
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-6 border-b border-black/18 pb-5 text-[9px] uppercase tracking-[0.18em] text-black/68 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-5">
          <span>120 Items</span>
          {activeFilter !== "All garments" && (
            <span className="text-black/38">{activeFilter}</span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-7">
          <button
            className="flex items-center gap-3 md:hidden"
            type="button"
            onClick={onFilters}
          >
            <span className="grid gap-[3px]">
              <span className="h-px w-4 bg-black/70" />
              <span className="h-px w-4 bg-black/70" />
              <span className="h-px w-4 bg-black/70" />
            </span>
            Filters
          </button>
          <span>Sort by: Newest</span>
          <span aria-hidden="true">⌄</span>
          <span className="grid grid-cols-2 gap-[3px]">
            <span className="size-[5px] border border-black/70" />
            <span className="size-[5px] border border-black/70" />
            <span className="size-[5px] border border-black/70" />
            <span className="size-[5px] border border-black/70" />
          </span>
          <span className="grid gap-[4px]">
            <span className="h-px w-4 bg-black/40" />
            <span className="h-px w-4 bg-black/40" />
            <span className="h-px w-4 bg-black/40" />
          </span>
          <button
            className="hidden items-center gap-3 transition-opacity duration-300 hover:opacity-55 md:flex"
            type="button"
            onClick={onFilters}
          >
            <span className="grid gap-[3px]">
              <span className="h-px w-4 bg-black/60" />
              <span className="h-px w-4 bg-black/60" />
              <span className="h-px w-4 bg-black/60" />
            </span>
            Filters
          </button>
        </div>
      </div>

      <div className="grid gap-px bg-black/16 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((product, index) => (
          <article
            key={product.name}
            className="bg-[#ebe6dc]"
          >
            <div className="relative aspect-[3/4] overflow-hidden bg-[#d8d3c8]">
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(min-width: 1280px) 21vw, (min-width: 640px) 44vw, 100vw"
                className={`product-image object-cover brightness-[0.86] contrast-[1.05] saturate-[0.76] ${
                  index === 1 || index === 5 || index === 8
                    ? "object-[50%_20%]"
                    : "object-[50%_12%]"
                }`}
              />
              <div className="absolute inset-0 bg-[#171614]/5" />
            </div>

            <div className="grid min-h-[126px] grid-cols-[1fr_auto] gap-5 border-t border-black/14 px-5 py-5 text-[9px] uppercase tracking-[0.15em]">
              <div>
                <h3>{product.name}</h3>
                <p className="mt-3 text-black/42">{product.category}</p>
                <p className="mt-6">${product.price}</p>
              </div>
              <button
                className="self-end text-[24px] leading-none text-black/80 transition-opacity duration-300 hover:opacity-45"
                type="button"
                aria-label={`Add ${product.name} to cart`}
              >
                +
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
