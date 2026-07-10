"use client";

import Image from "next/image";
import { Playfair_Display, Space_Grotesk } from "next/font/google";
import Link from "next/link";
import {
  cartStorageKey,
  type CartItem,
  type Product,
  products,
} from "@/data/products";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-shop-selected",
});

const shopSelectedSerif = Playfair_Display({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  variable: "--font-shop-selected-serif",
});

const selectedPieces = [
  {
    category: "Outerwear",
    image: "/images/low-signal/products/product-01.jpg",
    imageClass: "object-[50%_42%]",
    label: "Field Jacket",
    productId: "field-jacket",
  },
  {
    category: "Knitwear",
    image: "/images/low-signal/selected-collection/material-detail.png",
    imageClass: "object-[50%_50%]",
    label: "Rib Cardigan",
    productId: "rib-cardigan",
  },
  {
    category: "Bottoms",
    image: "/images/low-signal/selected-collection/trousers.jpg",
    imageClass: "object-[50%_54%]",
    label: "Double Pleat Trouser",
    productId: "pleated-pant",
  },
] as const;

const selectedProducts = selectedPieces
  .map((piece) => {
    const product = products.find((item) => item.id === piece.productId);

    return product
      ? {
          ...piece,
          product,
        }
      : null;
  })
  .filter(
    (piece): piece is (typeof selectedPieces)[number] & { product: Product } =>
      Boolean(piece),
  );

function readCartSnapshot() {
  if (typeof window === "undefined") {
    return "[]";
  }

  return window.localStorage.getItem(cartStorageKey) ?? "[]";
}

function parseCart(snapshot: string): CartItem[] {
  try {
    return JSON.parse(snapshot) as CartItem[];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(cartStorageKey, JSON.stringify(items));
  window.dispatchEvent(new Event("low-signal-cart"));
}

export function HomeSelectedPieces() {
  function addToCart(product: Product) {
    const items = parseCart(readCartSnapshot());
    const current = items.find((item) => item.id === product.id);

    const nextItems = current
      ? items.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        )
      : [
          ...items,
          {
            ...product,
            productId: product.id,
            quantity: 1,
            size: product.size,
          },
        ];

    writeCart(nextItems);
  }

  return (
    <section
      id="selected-pieces"
      className={`${spaceGrotesk.variable} ${shopSelectedSerif.variable} shop-selected-section w-full overflow-hidden border-y border-black/14 bg-[#dedfd9] px-5 py-10 text-[#11110f] sm:px-6 lg:px-[5vw] lg:py-14`}
    >
      <div className="mx-auto grid max-w-[1780px] gap-4">
        <div className="grid gap-4 lg:grid-cols-[0.88fr_1.42fr]">
          <ShopIntro />

          <div className="grid gap-4 lg:grid-cols-[0.92fr_1fr] lg:grid-rows-2">
            {selectedProducts.map((piece, index) => (
              <SelectedProductCard
                index={index}
                key={piece.product.id}
                onAdd={addToCart}
                piece={piece}
              />
            ))}
          </div>
        </div>

        <BottomRailStrip />
      </div>
    </section>
  );
}

function ShopIntro() {
  return (
    <div className="flex min-h-[520px] flex-col border border-black/12 bg-[#e7e8e2] px-6 py-7 sm:px-8 lg:min-h-[620px] lg:px-10 lg:py-9">
      <div className="flex items-start justify-between gap-6 border-b border-black/14 pb-6 text-[10px] uppercase leading-[1.5] tracking-[0.22em] text-black/48">
        <span>Shop / Spring 2026</span>
        <span>{String(products.length).padStart(2, "0")} Garments</span>
      </div>

      <div className="my-auto py-10">
        <p className="font-[var(--font-shop-selected)] text-[11px] font-medium uppercase tracking-[0.12em] text-black/50">
          Current rail
        </p>
        <h2 className="mt-9 max-w-[520px] font-[var(--font-shop-selected-serif)] text-[54px] font-normal uppercase leading-[0.88] tracking-[-0.052em] text-black/94 sm:text-[72px] lg:text-[84px] xl:text-[96px]">
          Shop
          <br />
          selected
          <br />
          pieces
        </h2>
        <p className="mt-9 max-w-[390px] text-[12px] uppercase leading-[1.72] tracking-[0.18em] text-black/58">
          Carefully chosen garments and fabric studies from Spring 2026. Built
          for daily repetition in quiet environments.
        </p>
      </div>

      <div className="grid gap-6 border-t border-black/14 pt-6 sm:grid-cols-[1fr_auto] sm:items-end">
        <div className="grid gap-3 text-[10px] uppercase tracking-[0.18em] text-black/46">
          <span>Available online</span>
          <span>Selected for daily repeat</span>
        </div>
        <Link
          className="w-fit border-b border-black/56 pb-[6px] font-[var(--font-shop-selected)] text-[10px] font-medium uppercase tracking-[0.12em] transition-opacity duration-300 hover:opacity-55"
          href="/collections"
        >
          View all garments →
        </Link>
      </div>
    </div>
  );
}

function SelectedProductCard({
  index,
  onAdd,
  piece,
}: Readonly<{
  index: number;
  onAdd: (product: Product) => void;
  piece: (typeof selectedPieces)[number] & { product: Product };
}>) {
  const isPrimary = index === 0;

  return (
    <article
      className={`group relative min-h-[280px] overflow-hidden border border-black/14 bg-[#161614] ${
        isPrimary ? "lg:row-span-2 lg:min-h-[650px]" : "lg:min-h-0"
      }`}
    >
      <Link
        aria-label={`Open ${piece.label}`}
        className="absolute inset-0 z-10 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#f4f0e8]"
        href={`/products/${piece.product.slug}`}
      />
      <Image
        alt={piece.label}
        className={`object-cover brightness-[0.82] contrast-[1.06] saturate-[0.68] transition duration-700 group-hover:brightness-[0.9] ${piece.imageClass}`}
        fill
        sizes={
          isPrimary
            ? "(min-width: 1024px) 31vw, 92vw"
            : "(min-width: 1024px) 34vw, 92vw"
        }
        src={piece.image}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/52 via-black/8 to-black/10" />

      <span className="absolute left-5 top-5 z-20 text-[10px] uppercase tracking-[0.18em] text-[#f4f0e8]/68">
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="absolute inset-x-0 bottom-0 z-20 grid gap-3 px-5 py-5 uppercase text-[#f4f0e8] sm:px-6 sm:py-6">
        <div className="grid grid-cols-[1fr_auto] items-start gap-4">
          <div className="min-w-0">
            <h3 className="font-[var(--font-shop-selected)] text-[12px] font-medium tracking-[0.12em]">
              {piece.label}
            </h3>
            <p className="mt-2 text-[9px] tracking-[0.18em] text-[#f4f0e8]/58">
              {piece.category}
            </p>
          </div>
          <p className="text-[10px] tracking-[0.18em] text-[#f4f0e8]/82">
            ${piece.product.price}
          </p>
        </div>

        <div className="flex items-end justify-between font-[var(--font-shop-selected)] text-[10px] font-medium tracking-[0.12em] text-[#f4f0e8]/72">
          <span className="border-b border-[#f4f0e8]/48 pb-[5px]">
            Shop →
          </span>
          <button
            aria-label={`Add ${piece.label} to cart`}
            className="relative z-30 px-1 font-[var(--font-shop-selected)] text-[22px] font-normal leading-none text-[#f4f0e8]/86 opacity-100 transition-opacity duration-300 hover:opacity-50 md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100"
            type="button"
            onClick={() => onAdd(piece.product)}
          >
            +
          </button>
        </div>
      </div>
    </article>
  );
}

function BottomRailStrip() {
  return (
    <div className="grid gap-6 border border-black/14 bg-[#e4e5df] px-6 py-7 uppercase tracking-[0.18em] text-black/58 sm:grid-cols-[1fr_auto] sm:items-center lg:px-9 lg:py-8">
      <div>
        <p className="font-[var(--font-shop-selected)] text-[11px] font-medium tracking-[0.12em] text-black/76">
          Spring 2026 available online
        </p>
        <p className="mt-3 max-w-[430px] text-[10px] leading-[1.65]">
          Choose a rail and move directly into the current collection.
        </p>
      </div>
      <div className="flex flex-wrap gap-x-8 gap-y-3 font-[var(--font-shop-selected)] text-[10px] font-medium tracking-[0.12em] text-black">
        <Link
          className="border-b border-black/50 pb-[6px] transition-opacity duration-300 hover:opacity-55"
          href="/collections/men"
        >
          Shop men →
        </Link>
        <Link
          className="border-b border-black/50 pb-[6px] transition-opacity duration-300 hover:opacity-55"
          href="/collections/women"
        >
          Shop women →
        </Link>
      </div>
    </div>
  );
}
