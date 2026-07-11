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

type CardFormat = "vertical" | "wide";

type ProductRailItem = {
  format: CardFormat;
  kind: "product";
  product: Product;
};

type DividerRailItem = {
  kind: "divider";
};

type RailItem = ProductRailItem | DividerRailItem;

const productsById = new Map(products.map((product) => [product.id, product]));

function productItem(id: string, format: CardFormat): ProductRailItem {
  const product = productsById.get(id);

  if (!product) {
    throw new Error(`Missing selected product: ${id}`);
  }

  return { format, kind: "product", product };
}

const railItems: RailItem[] = [
  productItem("field-jacket", "vertical"),
  productItem("rib-cardigan", "wide"),
  productItem("washed-longsleeve", "vertical"),
  productItem("storm-parka", "vertical"),
  { kind: "divider" },
  productItem("pleated-pant", "wide"),
  productItem("double-face-coat", "vertical"),
  productItem("cotton-crewneck", "vertical"),
  productItem("drawstring-trouser", "wide"),
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
      className="selected-garments-section border-y border-black/14 bg-[#dedfd9] py-10 text-[#11110f] sm:py-12 lg:py-16"
      id="selected-pieces"
    >
      <div className="mx-auto grid max-w-[1680px] gap-9 px-5 sm:px-6 lg:grid-cols-[minmax(230px,24%)_minmax(0,1fr)] lg:gap-10 lg:px-12">
        <header className="flex flex-col justify-between lg:min-h-[590px] lg:border-r lg:border-black/14 lg:pr-9">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.13em] text-black/62">
              04 / Shop
            </p>
            <h2
              className="mt-5 max-w-[280px] font-[var(--font-archivo)] text-[38px] font-medium uppercase leading-[0.92] tracking-[-0.02em] text-black/94 sm:text-[48px] lg:text-[54px]"
              id="selected-garments-title"
            >
              Selected garments
            </h2>
            <p className="mt-7 max-w-[280px] text-[14px] leading-[1.55] text-black/68">
              Outer layers, knitwear and relaxed tailoring from Spring 2026.
            </p>
            <nav className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-[10px] font-medium uppercase tracking-[0.12em]" aria-label="Selected garment collections">
              <Link className="selected-rail-link" href="/collections/men">
                Shop men →
              </Link>
              <Link className="selected-rail-link" href="/collections/women">
                Shop women →
              </Link>
            </nav>
          </div>

          <p className="mt-10 text-[10px] font-medium uppercase tracking-[0.13em] text-black/50 lg:mt-0">
            08 selected pieces
          </p>
        </header>

        <div className="min-w-0">
          <div className="mb-4 flex justify-end text-[10px] font-medium uppercase tracking-[0.13em] text-black/54">
            Drag / Scroll →
          </div>
          <div
            aria-label="Selected garments. Use left and right arrow keys to browse."
            className="selected-rail flex snap-x snap-proximity gap-4 overflow-x-auto overscroll-x-contain pb-3 pr-8 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-5 sm:pr-12 lg:gap-6 lg:pr-20 [&::-webkit-scrollbar]:hidden"
            onKeyDown={handleKeyDown}
            onPointerCancel={finishPointerDrag}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={finishPointerDrag}
            onScroll={updateNavigation}
            ref={railRef}
            tabIndex={0}
          >
            {railItems.map((item, index) =>
              item.kind === "divider" ? (
                <CollectionDivider key="season-divider" />
              ) : (
                <ProductCard
                  index={index + 1}
                  item={item}
                  key={item.product.id}
                  onClick={preventClickAfterDrag}
                />
              ),
            )}
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

function ProductCard({
  index,
  item,
  onClick,
}: Readonly<{
  index: number;
  item: ProductRailItem;
  onClick: (event: MouseEvent<HTMLAnchorElement>) => void;
}>) {
  const { format, product } = item;
  const wide = format === "wide";

  return (
    <Link
      aria-label={`View piece ${product.name}`}
      className={`selected-catalog-card group shrink-0 snap-start ${
        wide
          ? "w-[86vw] sm:w-[62vw] lg:w-[38vw]"
          : "w-[84vw] sm:w-[52vw] lg:w-[31vw]"
      }`}
      href={`/products/${product.slug}`}
      onClick={onClick}
    >
      <div className={`relative overflow-hidden border border-black/14 bg-[#ccd0c9] ${wide ? "aspect-[5/4]" : "aspect-[3/4]"}`}>
        <Image
          alt={product.name}
          className={`object-cover brightness-[0.88] contrast-[1.05] saturate-[0.68] transition-transform duration-700 group-hover:scale-[1.015] ${
            product.objectPosition ?? "object-center"
          }`}
          fill
          sizes={wide ? "(min-width: 1024px) 38vw, 86vw" : "(min-width: 1024px) 31vw, 84vw"}
          src={product.image}
        />
      </div>

      <div className="border-b border-black/16 py-4 sm:py-5">
        <span className="text-[10px] font-medium uppercase tracking-[0.12em] text-black/50">
          {String(index).padStart(2, "0")}
        </span>
        <div className="mt-3 grid grid-cols-[1fr_auto] items-baseline gap-4">
          <h3 className="text-[15px] font-medium uppercase tracking-[0.05em] text-black sm:text-[17px]">
            {product.name}
          </h3>
          <span className="text-[14px] text-black/82">${product.price}</span>
        </div>
        <p className="mt-2 text-[10px] font-medium uppercase tracking-[0.12em] text-black/54">
          {product.category}
        </p>
        <span className="selected-rail-link mt-5 inline-flex text-[10px] font-medium uppercase tracking-[0.12em]">
          View piece →
        </span>
      </div>
    </Link>
  );
}

function CollectionDivider() {
  return (
    <Link
      aria-label="View the full Spring 2026 collection"
      className="selected-catalog-divider group relative flex aspect-[5/4] w-[86vw] shrink-0 snap-start overflow-hidden border border-black/14 bg-[#151413] text-[#eceee8] sm:w-[62vw] lg:w-[38vw]"
      href="/collections"
    >
      <Image
        alt="Spring 2026 campaign garment detail"
        className="object-cover brightness-[0.55] contrast-[1.08] saturate-[0.56] transition-transform duration-700 group-hover:scale-[1.015]"
        fill
        sizes="(min-width: 1024px) 38vw, 86vw"
        src="/images/low-signal/collections/spring-2026-rail.png"
      />
      <div className="relative z-10 flex min-h-full w-full flex-col justify-between p-5 sm:p-6">
        <span className="text-[10px] font-medium uppercase tracking-[0.13em] text-[#eceee8]/76">
          Spring 2026
        </span>
        <div>
          <h3 className="font-[var(--font-archivo)] text-[34px] font-medium uppercase leading-[0.92] tracking-[-0.02em] sm:text-[46px]">
            Men / women
          </h3>
          <p className="mt-4 text-[10px] font-medium uppercase tracking-[0.12em] text-[#eceee8]/78">
            16 garments
          </p>
          <span className="selected-rail-link mt-6 inline-flex border-[#eceee8]/48 text-[10px] font-medium uppercase tracking-[0.12em]">
            View full collection →
          </span>
        </div>
      </div>
    </Link>
  );
}
