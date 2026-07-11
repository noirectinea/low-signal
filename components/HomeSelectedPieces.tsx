"use client";

import Image from "next/image";
import Link from "next/link";
import {
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  useRef,
  useState,
} from "react";
import { type Product, products } from "@/data/products";

type ProductRailItem = {
  kind: "product";
  product: Product;
  ratio: "portrait" | "wide";
};

type CampaignRailItem = {
  alt: string;
  href: string;
  image: string;
  kind: "campaign";
  label: string;
  position?: string;
  ratio: "portrait" | "wide";
};

type RailItem = CampaignRailItem | ProductRailItem;

const productsById = new Map(products.map((product) => [product.id, product]));

function productItem(id: string, ratio: ProductRailItem["ratio"] = "portrait"): ProductRailItem {
  const product = productsById.get(id);

  if (!product) {
    throw new Error(`Missing selected product: ${id}`);
  }

  return { kind: "product", product, ratio };
}

const railItems: RailItem[] = [
  {
    alt: "LOW SIGNAL men's Spring 2026 campaign",
    href: "/collections/men",
    image: "/images/low-signal/collections/spring-2026-rail.png",
    kind: "campaign",
    label: "Men's Spring 2026",
    position: "object-[50%_50%]",
    ratio: "wide",
  },
  productItem("field-jacket", "portrait"),
  productItem("washed-longsleeve", "wide"),
  {
    alt: "LOW SIGNAL women's Spring 2026 campaign",
    href: "/collections/women",
    image: "/images/low-signal/collections/spring-2026-women-rail.png",
    kind: "campaign",
    label: "Women's Spring 2026",
    position: "object-[50%_50%]",
    ratio: "wide",
  },
  productItem("rib-cardigan", "portrait"),
  productItem("pleated-pant", "wide"),
];

export function HomeSelectedPieces() {
  const railRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, moved: false, startScroll: 0, startX: 0 });
  const suppressClickUntil = useRef(0);
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(1);

  function updateNavigation() {
    const rail = railRef.current;

    if (!rail) {
      return;
    }

    const maxScroll = rail.scrollWidth - rail.clientWidth;
    const nextProgress = maxScroll > 0 ? rail.scrollLeft / maxScroll : 0;
    setProgress(nextProgress);
    setActiveIndex(
      Math.min(railItems.length, Math.round(nextProgress * (railItems.length - 1)) + 1),
    );
  }

  function scrollRail(direction: -1 | 1) {
    const rail = railRef.current;

    if (!rail) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    rail.scrollBy({
      behavior: reducedMotion ? "auto" : "smooth",
      left: direction * Math.min(rail.clientWidth * 0.78, 620),
    });
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") {
      return;
    }

    const rail = railRef.current;

    if (!rail) {
      return;
    }

    drag.current = {
      active: true,
      moved: false,
      startScroll: rail.scrollLeft,
      startX: event.clientX,
    };
    rail.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    const rail = railRef.current;

    if (!rail || !drag.current.active) {
      return;
    }

    const distance = event.clientX - drag.current.startX;

    if (Math.abs(distance) > 3) {
      drag.current.moved = true;
    }

    rail.scrollLeft = drag.current.startScroll - distance;
  }

  function finishPointerDrag(event: PointerEvent<HTMLDivElement>) {
    const rail = railRef.current;

    if (rail?.hasPointerCapture(event.pointerId)) {
      rail.releasePointerCapture(event.pointerId);
    }

    if (drag.current.moved) {
      suppressClickUntil.current = Date.now() + 120;
    }

    drag.current.active = false;
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollRail(-1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollRail(1);
    }
  }

  function preventClickAfterDrag(event: MouseEvent<HTMLAnchorElement>) {
    if (Date.now() < suppressClickUntil.current) {
      event.preventDefault();
    }
  }

  return (
    <section
      aria-labelledby="selected-garments-title"
      className="selected-garments-section border-y border-black/14 bg-[#dedfd9] py-9 text-[#11110f] sm:py-10 lg:py-12"
      id="selected-pieces"
    >
      <div className="mx-auto max-w-[1680px] px-5 sm:px-6 lg:px-12">
        <header className="mb-6 grid gap-5 border-b border-black/14 pb-5 md:grid-cols-[minmax(220px,0.34fr)_minmax(280px,0.42fr)_auto] md:items-end lg:mb-7 lg:pb-6">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.13em] text-black/56">
              04 / Shop
            </p>
            <h2
              className="mt-3 font-[var(--font-archivo)] text-[30px] font-medium uppercase leading-[0.92] tracking-[-0.02em] text-black/94 sm:text-[38px] lg:text-[44px]"
              id="selected-garments-title"
            >
              Selected garments
            </h2>
          </div>
          <p className="max-w-[420px] text-[13px] leading-[1.5] text-black/64">
            A short edit of Spring 2026 pieces, framed as campaign images rather than a full catalogue.
          </p>
          <nav
            aria-label="Selected garment collections"
            className="flex flex-wrap gap-x-6 gap-y-3 text-[10px] font-medium uppercase tracking-[0.12em] md:justify-end"
          >
            <Link className="selected-rail-link" href="/collections/men">
              Shop men →
            </Link>
            <Link className="selected-rail-link" href="/collections/women">
              Shop women →
            </Link>
          </nav>
        </header>

        <div className="min-w-0">
          <div
            aria-label="Selected garments. Use left and right arrow keys to browse."
            className="selected-rail flex snap-x snap-proximity gap-4 overflow-x-auto overscroll-x-contain pb-2 pr-[12vw] [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-5 sm:pr-[18vw] lg:gap-6 lg:pr-[22vw] [&::-webkit-scrollbar]:hidden"
            onKeyDown={handleKeyDown}
            onPointerCancel={finishPointerDrag}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={finishPointerDrag}
            onScroll={updateNavigation}
            ref={railRef}
            tabIndex={0}
          >
            {railItems.map((item, index) => (
              <RailCard
                index={index + 1}
                item={item}
                key={item.kind === "product" ? item.product.id : item.label}
                onClick={preventClickAfterDrag}
              />
            ))}
          </div>

          <div className="mt-6 grid grid-cols-[auto_1fr_auto] items-center gap-4 text-[10px] font-medium uppercase tracking-[0.12em] text-black/56">
            <span>
              {String(activeIndex).padStart(2, "0")} / {String(railItems.length).padStart(2, "0")}
            </span>
            <div aria-hidden="true" className="h-px bg-black/18">
              <div
                className="h-px bg-black/58 transition-[width] duration-200"
                style={{ width: `${Math.max(8, progress * 100)}%` }}
              />
            </div>
            <div className="flex gap-5 text-[15px] leading-none text-black">
              <button
                aria-label="Previous selected garment"
                className="selected-rail-control"
                onClick={() => scrollRail(-1)}
                type="button"
              >
                ←
              </button>
              <button
                aria-label="Next selected garment"
                className="selected-rail-control"
                onClick={() => scrollRail(1)}
                type="button"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RailCard({
  index,
  item,
  onClick,
}: Readonly<{
  index: number;
  item: RailItem;
  onClick: (event: MouseEvent<HTMLAnchorElement>) => void;
}>) {
  if (item.kind === "campaign") {
    return <CampaignCard index={index} item={item} onClick={onClick} />;
  }

  const { product } = item;
  const isWide = item.ratio === "wide";

  return (
    <Link
      aria-label={`View piece ${product.name}`}
      className={`selected-campaign-card group shrink-0 snap-start ${
        isWide ? "w-[86vw] sm:w-[64vw] lg:w-[46vw]" : "w-[78vw] sm:w-[48vw] lg:w-[34vw]"
      }`}
      href={`/products/${product.slug}`}
      onClick={onClick}
    >
      <div
        className={`relative overflow-hidden border border-black/14 bg-[#ccd0c9] ${
          isWide ? "h-[56vh] min-h-[390px] max-h-[660px]" : "h-[62vh] min-h-[430px] max-h-[700px]"
        }`}
      >
        <Image
          alt={product.name}
          className={`object-cover brightness-[0.88] contrast-[1.05] saturate-[0.68] transition-transform duration-700 group-hover:scale-[1.015] ${
            product.objectPosition ?? "object-center"
          }`}
          fill
          sizes={
            isWide
              ? "(min-width: 1024px) 46vw, (min-width: 640px) 64vw, 86vw"
              : "(min-width: 1024px) 34vw, (min-width: 640px) 48vw, 78vw"
          }
          src={product.image}
        />
      </div>

      <div className="grid grid-cols-[1fr_auto] items-start gap-4 border-b border-black/16 py-4 sm:py-5">
        <div className="mt-3 grid grid-cols-[1fr_auto] items-baseline gap-4">
          <h3 className="text-[15px] font-medium uppercase tracking-[0.05em] text-black sm:text-[17px]">
            {product.name}
          </h3>
          <span className="text-[14px] text-black/82">${product.price}</span>
        </div>
        <span className="selected-rail-link mt-3 whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.12em]">
          View piece ↗
        </span>
      </div>
    </Link>
  );
}

function CampaignCard({
  index,
  item,
  onClick,
}: Readonly<{
  index: number;
  item: CampaignRailItem;
  onClick: (event: MouseEvent<HTMLAnchorElement>) => void;
}>) {
  return (
    <Link
      aria-label={`Open ${item.label}`}
      className="selected-campaign-card group relative shrink-0 snap-start w-[88vw] sm:w-[66vw] lg:w-[47vw]"
      href={item.href}
      onClick={onClick}
    >
      <div className="relative h-[56vh] min-h-[390px] max-h-[660px] overflow-hidden border border-black/14 bg-[#c8cbc5]">
        <Image
          alt={item.alt}
          className={`object-cover brightness-[0.78] contrast-[1.07] saturate-[0.6] transition-transform duration-700 group-hover:scale-[1.015] ${
            item.position ?? "object-center"
          }`}
          fill
          sizes="(min-width: 1024px) 47vw, (min-width: 640px) 66vw, 88vw"
          src={item.image}
        />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 p-5 text-[#f1f1ea] sm:p-6">
          <div>
            <span className="text-[10px] font-medium uppercase tracking-[0.13em] text-white/62">
              {String(index).padStart(2, "0")}
            </span>
            <h3 className="mt-3 font-[var(--font-archivo)] text-[30px] font-medium uppercase leading-[0.92] tracking-[-0.02em] sm:text-[38px] lg:text-[44px]">
              {item.label}
            </h3>
          </div>
          <span className="hidden text-[10px] font-medium uppercase tracking-[0.12em] text-white/78 sm:block">
            View collection ↗
          </span>
        </div>
      </div>
    </Link>
  );
}
