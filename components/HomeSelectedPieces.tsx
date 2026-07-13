"use client";

import Image from "next/image";
import Link from "next/link";
import {
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { type Product, products } from "@/data/products";

type ProductRailItem = {
  product: Product;
};

const productsById = new Map(products.map((product) => [product.id, product]));

function productItem(id: string): ProductRailItem {
  const product = productsById.get(id);

  if (!product) {
    throw new Error(`Missing selected product: ${id}`);
  }

  return { product };
}

const railItems: ProductRailItem[] = [
  productItem("field-jacket"),
  productItem("work-jacket"),
  productItem("cotton-shirt"),
  productItem("storm-parka"),
  productItem("double-face-coat"),
  productItem("pleated-pant"),
];

export function HomeSelectedPieces() {
  const railRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, moved: false, startScroll: 0, startX: 0 });
  const suppressClickUntil = useRef(0);
  const autoTimer = useRef<number | null>(null);
  const autoTransitionTimer = useRef<number | null>(null);
  const isAutoScrolling = useRef(false);
  const scheduleAutoAdvanceRef = useRef<(delay?: number) => void>(() => undefined);
  const [progress, setProgress] = useState(0);
  const [activeIndex, setActiveIndex] = useState(1);

  const clearAutoTimer = useCallback(() => {
    if (autoTimer.current) {
      window.clearTimeout(autoTimer.current);
      autoTimer.current = null;
    }
  }, []);

  const getRailCards = useCallback(() => {
    const rail = railRef.current;

    return rail
      ? Array.from(rail.querySelectorAll<HTMLElement>("[data-rail-index]"))
      : [];
  }, []);

  const updateNavigation = useCallback(() => {
    const rail = railRef.current;

    if (!rail) {
      return;
    }

    const maxScroll = rail.scrollWidth - rail.clientWidth;
    const nextProgress = maxScroll > 0 ? rail.scrollLeft / maxScroll : 0;
    const cards = getRailCards();
    const closestCard = cards.reduce<HTMLElement | null>((closest, card) => {
      if (!closest) {
        return card;
      }

      return Math.abs(card.offsetLeft - rail.scrollLeft) <
        Math.abs(closest.offsetLeft - rail.scrollLeft)
        ? card
        : closest;
    }, null);

    setProgress(nextProgress);
    setActiveIndex(Number(closestCard?.dataset.railIndex ?? 0) + 1);
  }, [getRailCards]);

  const scrollRail = useCallback((direction: -1 | 1) => {
    const rail = railRef.current;

    if (!rail) {
      return;
    }

    const cards = getRailCards();
    const currentIndex = cards.findIndex(
      (card) => Math.abs(card.offsetLeft - rail.scrollLeft) < card.offsetWidth / 2,
    );
    const nextIndex = Math.max(0, Math.min(cards.length - 1, currentIndex + direction));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    rail.scrollTo({
      behavior: reducedMotion ? "auto" : "smooth",
      left: cards[nextIndex]?.offsetLeft ?? 0,
    });
  }, [getRailCards]);

  const scheduleAutoAdvance = useCallback((delay = 7000) => {
    clearAutoTimer();

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    autoTimer.current = window.setTimeout(() => {
      const rail = railRef.current;
      const cards = getRailCards();

      if (!rail || cards.length === 0) {
        return;
      }

      const currentIndex = cards.findIndex(
        (card) => Math.abs(card.offsetLeft - rail.scrollLeft) < card.offsetWidth / 2,
      );
      const nextIndex = currentIndex >= railItems.length - 1 ? railItems.length : currentIndex + 1;

      isAutoScrolling.current = true;
      rail.scrollTo({ behavior: "smooth", left: cards[nextIndex]?.offsetLeft ?? 0 });

      if (autoTransitionTimer.current) {
        window.clearTimeout(autoTransitionTimer.current);
      }

      autoTransitionTimer.current = window.setTimeout(() => {
        if (nextIndex === railItems.length) {
          rail.scrollTo({ behavior: "auto", left: 0 });
          updateNavigation();
        }

        isAutoScrolling.current = false;
        scheduleAutoAdvanceRef.current(4000);
      }, 700);
    }, delay);
  }, [clearAutoTimer, getRailCards, updateNavigation]);

  const pauseAutoAdvance = useCallback(() => {
    clearAutoTimer();
  }, [clearAutoTimer]);

  useEffect(() => {
    scheduleAutoAdvanceRef.current = scheduleAutoAdvance;
  }, [scheduleAutoAdvance]);

  useEffect(() => {
    scheduleAutoAdvance(4000);

    return () => {
      clearAutoTimer();
      if (autoTransitionTimer.current) {
        window.clearTimeout(autoTransitionTimer.current);
      }
    };
  }, [clearAutoTimer, scheduleAutoAdvance]);

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    pauseAutoAdvance();

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
    scheduleAutoAdvance();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      pauseAutoAdvance();
      scrollRail(-1);
      scheduleAutoAdvance();
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      pauseAutoAdvance();
      scrollRail(1);
      scheduleAutoAdvance();
    }
  }

  function handleScroll() {
    updateNavigation();

    if (!isAutoScrolling.current && !drag.current.active) {
      scheduleAutoAdvance();
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
      className="selected-garments-section order-2 border-y border-black/14 bg-[#dedfd9] py-6 text-[#11110f] sm:py-7 lg:order-none lg:py-9"
      id="selected-pieces"
    >
      <div className="mx-auto max-w-[1680px] px-5 sm:px-6 lg:px-12">
        <header className="mb-3 grid grid-cols-[1fr_auto] items-start gap-3 border-b border-black/14 pb-3 text-[10px] font-medium uppercase tracking-[0.13em] text-black/58 lg:mb-6 lg:grid-cols-[minmax(190px,0.34fr)_1fr_auto] lg:items-center lg:pb-4">
          <h2 className="text-[10px] font-medium uppercase tracking-[0.13em]" id="selected-garments-title">
            04 / Selected garments
          </h2>
          <p className="hidden text-black/52 lg:block">Selected pieces available online.</p>
          <nav
            aria-label="Selected garment collections"
            className="flex flex-wrap justify-end gap-x-4 gap-y-2 lg:gap-x-6"
          >
            <Link className="selected-rail-link" href="/collections/men">
              Shop men →
            </Link>
            <Link className="selected-rail-link" href="/collections/women">
              Shop women →
            </Link>
          </nav>
        </header>

        <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(300px,36%)_minmax(0,1fr)] lg:gap-6">
          <aside className="selected-static-frame hidden lg:block">
            <Link
              aria-label="Open men's Spring 2026 collection"
              className="group block"
              href="/collections/men"
              onClick={preventClickAfterDrag}
            >
              <div className="relative h-[63vh] min-h-[400px] max-h-[675px] overflow-hidden border border-black/14 bg-[#c8cbc5] lg:h-[65vh]">
                <Image
                  alt="LOW SIGNAL men's Spring 2026 campaign"
                  className="object-cover object-[48%_52%] brightness-[0.82] contrast-[1.06] saturate-[0.62] transition-transform duration-700 group-hover:scale-[1.012]"
                  fill
                  sizes="(min-width: 1024px) 36vw, 100vw"
                  src="/images/low-signal/selected-collection/material-form-original.png"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/42 via-black/16 to-transparent p-5 text-[#f1f1ea] sm:p-6">
                  <p className="font-[var(--font-archivo)] text-[38px] font-medium uppercase leading-[0.9] tracking-[-0.02em] text-white/90 sm:text-[48px] lg:text-[58px]">
                    SPRING 2026
                  </p>
                </div>
              </div>
            </Link>
          </aside>

          <div className="min-w-0">
            <p className="mb-2 text-[9px] uppercase tracking-[0.12em] text-black/56 lg:hidden">
              Swipe to browse selected pieces →
            </p>
            <div
              aria-label="Selected garments. Use left and right arrow keys to browse."
              className="selected-rail flex min-w-0 max-w-full snap-x snap-proximity gap-[14px] overflow-x-auto overscroll-x-contain pb-2 pr-5 [-ms-overflow-style:none] [scrollbar-width:none] sm:pr-6 lg:pr-[40vw] [&::-webkit-scrollbar]:hidden"
              onBlurCapture={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                  scheduleAutoAdvance();
                }
              }}
              onFocusCapture={pauseAutoAdvance}
              onKeyDown={handleKeyDown}
              onMouseEnter={pauseAutoAdvance}
              onMouseLeave={() => scheduleAutoAdvance()}
              onPointerCancel={finishPointerDrag}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={finishPointerDrag}
              onScroll={handleScroll}
              ref={railRef}
              tabIndex={0}
            >
              <CampaignRailCard />
              {railItems.map((item, index) => (
                <RailCard
                  index={index + 1}
                  item={item}
                  key={item.product.id}
                  onClick={preventClickAfterDrag}
                />
              ))}
              <RailCard ariaHidden index={1} item={railItems[0]} key="loop-start" />
            </div>

            <div className="mt-5 grid grid-cols-[auto_1fr_auto] items-center gap-4 text-[10px] font-medium uppercase tracking-[0.12em] text-black/56">
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
                  onClick={() => {
                    pauseAutoAdvance();
                    scrollRail(-1);
                    scheduleAutoAdvance();
                  }}
                  type="button"
                >
                  ←
                </button>
                <button
                  aria-label="Next selected garment"
                  className="selected-rail-control"
                  onClick={() => {
                    pauseAutoAdvance();
                    scrollRail(1);
                    scheduleAutoAdvance();
                  }}
                  type="button"
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CampaignRailCard() {
  return (
    <Link
      aria-label="Open men's Spring 2026 collection"
      className="group w-[36vw] shrink-0 snap-start sm:w-[22vw] lg:hidden"
      href="/collections/men"
    >
      <div className="relative h-[48svh] min-h-[300px] max-h-[480px] overflow-hidden border border-black/14 bg-[#c8cbc5]">
        <Image
          alt="LOW SIGNAL men's Spring 2026 campaign"
          className="object-cover object-[48%_52%] brightness-[0.82] contrast-[1.06] saturate-[0.62] transition-transform duration-700 group-hover:scale-[1.012]"
          fill
          sizes="(min-width: 640px) 22vw, 36vw"
          src="/images/low-signal/selected-collection/material-form-original.png"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/42 via-black/16 to-transparent p-5 text-[#f1f1ea]">
          <p className="font-[var(--font-archivo)] text-[20px] font-medium uppercase leading-[0.92] tracking-[-0.02em] text-white/90 sm:text-[26px]">
            SPRING<br />2026
          </p>
        </div>
      </div>
      <div className="grid min-h-[58px] content-start border-b border-black/16 py-3 text-[9px] font-medium uppercase tracking-[0.12em]">
        <span className="selected-rail-link w-fit whitespace-nowrap">Shop collection ↗</span>
      </div>
    </Link>
  );
}

function RailCard({
  index,
  item,
  onClick,
  ariaHidden = false,
}: Readonly<{
  index: number;
  item: ProductRailItem;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  ariaHidden?: boolean;
}>) {
  const { product } = item;

  if (ariaHidden) {
    return (
      <div
        aria-hidden="true"
        className="selected-campaign-card pointer-events-none w-[68vw] shrink-0 snap-start sm:w-[40vw] lg:w-[25vw]"
        data-rail-index="0"
      >
        <div className="relative h-[48svh] min-h-[300px] max-h-[480px] overflow-hidden border border-black/14 bg-[#ccd0c9] lg:h-[55vh] lg:min-h-[360px] lg:max-h-[680px]">
          <Image
            alt=""
            className={`object-cover brightness-[0.88] contrast-[1.05] saturate-[0.68] ${product.objectPosition ?? "object-center"}`}
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 40vw, 68vw"
            src={product.image}
          />
        </div>
        <div className="hidden min-h-[104px] grid-rows-[auto_1fr_auto] border-b border-black/16 py-4 lg:grid">
          <div className="grid grid-cols-[1fr_auto] items-baseline gap-4">
            <span className="text-[15px] font-medium uppercase tracking-[0.04em] text-black sm:text-[16px]">
              {product.name}
            </span>
            <span className="text-[14px] font-medium text-black/84">${product.price}</span>
          </div>
          <span className="mt-2 text-[12px] leading-[1.35] text-black/56">
            {getProductCaption(product)}
          </span>
          <span className="mt-4 text-[10px] font-medium uppercase tracking-[0.12em]">
            <span className="selected-rail-link whitespace-nowrap">View product ↗</span>
          </span>
        </div>
      </div>
    );
  }

  return (
    <Link
      aria-label={`View piece ${product.name}`}
      className="selected-campaign-card group w-[68vw] shrink-0 snap-start sm:w-[40vw] lg:w-[25vw]"
      data-rail-index={index - 1}
      href={`/products/${product.slug}`}
      onClick={onClick}
    >
      <div className="relative h-[48svh] min-h-[300px] max-h-[480px] overflow-hidden border border-black/14 bg-[#ccd0c9] lg:h-[55vh] lg:min-h-[360px] lg:max-h-[680px]">
        <span className="absolute left-4 top-4 z-10 text-[9px] font-medium uppercase tracking-[0.13em] text-white/70">
          {String(index).padStart(2, "0")}
        </span>
        <Image
          alt={product.name}
          className={`object-cover brightness-[0.88] contrast-[1.05] saturate-[0.68] transition-transform duration-700 group-hover:scale-[1.015] ${
            product.objectPosition ?? "object-center"
          }`}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 40vw, 68vw"
          src={product.image}
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/62 via-black/18 to-transparent p-4 pt-16 text-white lg:hidden">
          <div className="grid grid-cols-[1fr_auto] items-end gap-3">
            <h3 className="text-[11px] font-medium uppercase tracking-[0.12em]">{product.name}</h3>
            <span className="text-[11px] font-medium">${product.price}</span>
          </div>
          <span className="mt-3 inline-block h-px w-8 bg-white/58" />
        </div>
      </div>

      <div className="hidden min-h-[104px] grid-rows-[auto_1fr_auto] border-b border-black/16 py-4 lg:grid">
        <div className="grid grid-cols-[1fr_auto] items-baseline gap-4">
          <h3 className="text-[15px] font-medium uppercase tracking-[0.04em] text-black sm:text-[16px]">
            {product.name}
          </h3>
          <span className="text-[14px] font-medium text-black/84">${product.price}</span>
        </div>
        <p className="mt-2 text-[12px] leading-[1.35] text-black/56">
          {getProductCaption(product)}
        </p>
        <div className="mt-4 text-[10px] font-medium uppercase tracking-[0.12em]">
          <span className="selected-rail-link whitespace-nowrap">View product ↗</span>
        </div>
      </div>
    </Link>
  );
}

function getProductCaption(product: Product) {
  if (product.category === "Outerwear") {
    return "Washed cotton outerwear";
  }

  if (product.category === "Shirts") {
    return "Washed cotton shirting";
  }

  if (product.category === "Knitwear") {
    return "Cotton wool knitwear";
  }

  return "Soft tailored trouser";
}
