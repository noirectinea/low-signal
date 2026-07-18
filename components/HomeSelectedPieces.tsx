"use client";

import Image from "next/image";
import Link from "next/link";
import {
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
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
const cloneCount = 3;
const loopRailItems = [
  ...railItems.slice(-cloneCount),
  ...railItems,
  ...railItems.slice(0, cloneCount),
];

export function HomeSelectedPieces() {
  const railRef = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, moved: false, startScroll: 0, startX: 0 });
  const suppressClickUntil = useRef(0);
  const autoTimer = useRef<number | null>(null);
  const normalizeTimer = useRef<number | null>(null);
  const scheduleAutoAdvanceRef = useRef<(delay?: number) => void>(() => undefined);
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
      ? Array.from(rail.querySelectorAll<HTMLElement>("[data-rail-position]"))
      : [];
  }, []);

  const getClosestPosition = useCallback(() => {
    const rail = railRef.current;

    if (!rail) {
      return cloneCount;
    }

    const cards = getRailCards();
    const closestCard = cards.reduce<HTMLElement | null>((closest, card) => {
      if (!closest) {
        return card;
      }

      const cardLeft =
        card.getBoundingClientRect().left -
        rail.getBoundingClientRect().left +
        rail.scrollLeft;
      const closestLeft =
        closest.getBoundingClientRect().left -
        rail.getBoundingClientRect().left +
        rail.scrollLeft;

      return Math.abs(cardLeft - rail.scrollLeft) <
        Math.abs(closestLeft - rail.scrollLeft)
        ? card
        : closest;
    }, null);

    return Number(closestCard?.dataset.railPosition ?? cloneCount);
  }, [getRailCards]);

  const updateNavigation = useCallback(() => {
    const position = getClosestPosition();
    const logicalIndex =
      ((position - cloneCount) % railItems.length + railItems.length) %
      railItems.length;

    setActiveIndex(logicalIndex + 1);
  }, [getClosestPosition]);

  const normalizeLoop = useCallback(() => {
    const rail = railRef.current;

    if (!rail) {
      return;
    }

    const cards = getRailCards();
    const position = getClosestPosition();
    const normalizedPosition =
      position < cloneCount
        ? position + railItems.length
        : position >= cloneCount + railItems.length
          ? position - railItems.length
          : position;

    if (normalizedPosition !== position) {
      const normalizedCard = cards[normalizedPosition];
      const normalizedLeft = normalizedCard
        ? normalizedCard.getBoundingClientRect().left -
          rail.getBoundingClientRect().left +
          rail.scrollLeft
        : 0;
      rail.scrollTo({
        behavior: "auto",
        left: normalizedLeft,
      });
    }

    updateNavigation();
  }, [getClosestPosition, getRailCards, updateNavigation]);

  const scrollRail = useCallback((direction: -1 | 1) => {
    const rail = railRef.current;

    if (!rail) {
      return;
    }

    const cards = getRailCards();
    const currentPosition = getClosestPosition();
    const nextPosition = Math.max(
      0,
      Math.min(cards.length - 1, currentPosition + direction),
    );
    const nextCard = cards[nextPosition];
    const nextLeft = nextCard
      ? nextCard.getBoundingClientRect().left -
        rail.getBoundingClientRect().left +
        rail.scrollLeft
      : 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    rail.scrollTo({
      behavior: reducedMotion ? "auto" : "smooth",
      left: nextLeft,
    });
  }, [getClosestPosition, getRailCards]);

  const scheduleAutoAdvance = useCallback((delay = 7000) => {
    clearAutoTimer();

    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(max-width: 1023.98px)").matches
    ) {
      return;
    }

    autoTimer.current = window.setTimeout(() => {
      const rail = railRef.current;
      const cards = getRailCards();

      if (!rail || cards.length === 0) {
        return;
      }

      scrollRail(1);
      scheduleAutoAdvanceRef.current(4000);
    }, delay);
  }, [clearAutoTimer, getRailCards, scrollRail]);

  const pauseAutoAdvance = useCallback(() => {
    clearAutoTimer();
  }, [clearAutoTimer]);

  useEffect(() => {
    scheduleAutoAdvanceRef.current = scheduleAutoAdvance;
  }, [scheduleAutoAdvance]);

  useLayoutEffect(() => {
    const rail = railRef.current;
    const cards = getRailCards();

    if (!rail || cards.length === 0) {
      return;
    }

    const initialCard = cards[cloneCount];
    const initialLeft = initialCard
      ? initialCard.getBoundingClientRect().left -
        rail.getBoundingClientRect().left +
        rail.scrollLeft
      : 0;

    rail.scrollTo({
      behavior: "auto",
      left: initialLeft,
    });
    updateNavigation();
  }, [getRailCards, updateNavigation]);

  useEffect(() => {
    scheduleAutoAdvance(4000);

    return () => {
      clearAutoTimer();
      if (normalizeTimer.current) {
        window.clearTimeout(normalizeTimer.current);
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

    if (normalizeTimer.current) {
      window.clearTimeout(normalizeTimer.current);
    }

    normalizeTimer.current = window.setTimeout(normalizeLoop, 180);
  }

  function preventClickAfterDrag(event: MouseEvent<HTMLAnchorElement>) {
    if (Date.now() < suppressClickUntil.current) {
      event.preventDefault();
    }
  }

  return (
    <section
      aria-labelledby="selected-garments-title"
      className="selected-garments-section mobile-selected-editorial order-2 border-y border-black/14 bg-[#dedfd9] py-6 text-[#11110f] sm:py-7 lg:order-none lg:py-9"
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

        <div className="grid min-w-0 gap-5 lg:grid-cols-[minmax(300px,34%)_minmax(0,1fr)] lg:gap-6">
          <aside className="selected-static-frame">
            <Link
              aria-label="Shop selected garments"
              className="group block"
              href="/collections"
              onClick={preventClickAfterDrag}
            >
              <div className="relative h-[42svh] min-h-[320px] max-h-[420px] overflow-hidden border border-black/14 bg-[#c8cbc5] lg:h-[58vh] lg:min-h-[440px] lg:max-h-[620px]">
                <Image
                  alt="Black LOW SIGNAL garment arranged on a studio chair"
                  className="object-cover object-[54%_50%] brightness-[0.76] contrast-[1.06] saturate-[0.58] transition-transform duration-700 group-hover:scale-[1.012]"
                  fill
                  sizes="(min-width: 1024px) 34vw, 100vw"
                  src="/images/low-signal/selected-garments-main.jpg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/56 via-black/8 to-black/8" />
                <div className="absolute inset-x-0 bottom-0 grid gap-3 p-5 text-[#f1f1ea] sm:p-6">
                  <p className="text-[18px] font-normal uppercase tracking-[0.08em]">
                    Selected garments
                  </p>
                  <p className="text-[10px] uppercase tracking-[0.12em] text-white/62">
                    06 pieces
                  </p>
                  <span className="mt-2 w-fit border-b border-white/58 pb-1 text-[10px] uppercase tracking-[0.1em]">
                    Shop the selection →
                  </span>
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
              className="selected-rail flex min-w-0 max-w-full snap-x snap-mandatory gap-[14px] overflow-x-auto overscroll-x-contain pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
              {loopRailItems.map((item, position) => {
                const logicalIndex =
                  ((position - cloneCount) % railItems.length +
                    railItems.length) %
                  railItems.length;
                const isClone =
                  position < cloneCount ||
                  position >= cloneCount + railItems.length;

                return (
                <RailCard
                  ariaHidden={isClone}
                  index={logicalIndex + 1}
                  item={item}
                  key={`${item.product.id}-${position}`}
                  onClick={preventClickAfterDrag}
                  position={position}
                />
                );
              })}
            </div>

            <div className="mt-5 grid grid-cols-[auto_1fr_auto] items-center gap-4 text-[10px] font-medium uppercase tracking-[0.12em] text-black/56">
              <span data-testid="selected-counter">
                {String(activeIndex).padStart(2, "0")} / {String(railItems.length).padStart(2, "0")}
              </span>
              <div aria-hidden="true" className="h-px bg-black/18">
                <div
                  className="h-px bg-black/58 transition-[width] duration-200"
                  style={{ width: `${(activeIndex / railItems.length) * 100}%` }}
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

function RailCard({
  index,
  item,
  onClick,
  ariaHidden = false,
  position,
}: Readonly<{
  index: number;
  item: ProductRailItem;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  ariaHidden?: boolean;
  position: number;
}>) {
  const { product } = item;

  return (
    <Link
      aria-hidden={ariaHidden || undefined}
      aria-label={`View piece ${product.name}`}
      className="selected-campaign-card mobile-selected-card group w-[68vw] shrink-0 snap-start sm:w-[40vw] lg:w-[clamp(240px,18vw,310px)]"
      data-rail-position={position}
      href={`/products/${product.slug}`}
      onClick={onClick}
      tabIndex={ariaHidden ? -1 : 0}
    >
      <div className="relative h-[48svh] min-h-[300px] max-h-[480px] overflow-hidden border border-black/14 bg-[#ccd0c9] lg:h-[46vh] lg:min-h-[350px] lg:max-h-[500px]">
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
      </div>

      <div className="mobile-selected-product-info grid min-h-[78px] grid-cols-[1fr_auto] content-center gap-x-4 border-b border-white/14 py-3 text-[#ecece5] lg:hidden">
        <div>
          <h3 className="text-[12px] font-medium uppercase tracking-[0.1em]">{product.name}</h3>
          <p className="mt-2 text-[9px] uppercase tracking-[0.13em] text-white/48">{product.category}</p>
        </div>
        <div className="grid justify-items-end">
          <span className="text-[12px] font-medium">${product.price}</span>
          <span className="mt-2 border-b border-white/48 pb-1 text-[9px] uppercase tracking-[0.12em]">View product →</span>
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
