"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type TouchEvent as ReactTouchEvent,
  type UIEvent,
} from "react";
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
  const router = useRouter();
  const railRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<number | null>(null);
  const pauseAutoplayUntilRef = useRef(0);
  const physicalIndexRef = useRef(selectedProducts.length);
  const interactionRef = useRef({
    focus: false,
    hover: false,
    pointer: false,
  });
  const pointerDragRef = useRef<{
    cardWidth: number;
    pointerId: number;
    startScrollLeft: number;
    startX: number;
    startedOnLast: boolean;
  } | null>(null);
  const touchDragRef = useRef<{
    cardWidth: number;
    startX: number;
    startedOnLast: boolean;
  } | null>(null);
  const suppressClickRef = useRef(false);
  const [isInView, setIsInView] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [collectionPull, setCollectionPull] = useState(0);
  const repeatedProducts = useMemo(
    () =>
      Array.from({ length: 3 }, (_, group) =>
        selectedProducts.map((product, index) => ({
          clone: group !== 1,
          group,
          index,
          product,
        })),
      ).flat(),
    [],
  );

  const scrollToPhysicalIndex = useCallback(
    (physicalIndex: number, behavior: ScrollBehavior) => {
      const rail = railRef.current;
      const cards = rail?.querySelectorAll<HTMLElement>("[data-selected-card]");
      const target = cards?.[physicalIndex];
      if (!rail || !target) return;

      physicalIndexRef.current = physicalIndex;
      if (behavior === "auto") {
        rail.style.scrollBehavior = "auto";
      }
      rail.scrollTo({
        behavior,
        left: target.offsetLeft - rail.offsetLeft,
      });
      if (behavior === "auto") {
        window.requestAnimationFrame(() => {
          rail.style.scrollBehavior = "";
        });
      }
    },
    [],
  );

  useEffect(() => {
    const alignRail = () =>
      scrollToPhysicalIndex(selectedProducts.length, "auto");
    const frame = window.requestAnimationFrame(alignRail);
    window.addEventListener("resize", alignRail);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", alignRail);
    };
  }, [scrollToPhysicalIndex]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.25 },
    );
    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    if (reducedMotion.matches) return;

    let interval: number | undefined;
    const advance = () => {
      if (
        reducedMotion.matches ||
        document.hidden ||
        Object.values(interactionRef.current).some(Boolean) ||
        Date.now() < pauseAutoplayUntilRef.current
      ) {
        return;
      }
      scrollToPhysicalIndex(physicalIndexRef.current + 1, "smooth");
    };
    const firstAdvance = window.setTimeout(() => {
      advance();
      interval = window.setInterval(advance, 3000);
    }, 3000);

    return () => {
      window.clearTimeout(firstAdvance);
      if (interval !== undefined) window.clearInterval(interval);
    };
  }, [isInView, scrollToPhysicalIndex]);

  function pauseAutoplay(delay = 4200) {
    pauseAutoplayUntilRef.current = Date.now() + delay;
  }

  function isDesktopRail() {
    return window.matchMedia("(min-width: 1024px)").matches;
  }

  function getCardWidth(rail: HTMLDivElement) {
    return (
      rail.querySelector<HTMLElement>("[data-selected-card]")?.offsetWidth ??
      rail.clientWidth
    );
  }

  function updateCollectionPull(
    startedOnLast: boolean,
    distance: number,
    cardWidth: number,
  ) {
    if (!startedOnLast || !isDesktopRail()) {
      setCollectionPull(0);
      return;
    }

    setCollectionPull(
      Math.min(1, Math.max(0, distance / (cardWidth * 0.28))),
    );
  }

  function completeCollectionPull(
    startedOnLast: boolean,
    distance: number,
    cardWidth: number,
  ) {
    const shouldOpenCollections =
      isDesktopRail() &&
      startedOnLast &&
      distance >= cardWidth * 0.28;

    setCollectionPull(0);
    interactionRef.current.pointer = false;
    pauseAutoplay();

    if (shouldOpenCollections) {
      router.push("/collections");
    }
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    pauseAutoplay();
    interactionRef.current.pointer = true;

    if (event.pointerType !== "mouse" || event.button !== 0) return;

    pointerDragRef.current = {
      cardWidth: getCardWidth(event.currentTarget),
      pointerId: event.pointerId,
      startScrollLeft: event.currentTarget.scrollLeft,
      startX: event.clientX,
      startedOnLast: activeIndex === selectedProducts.length - 1,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = pointerDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const distance = drag.startX - event.clientX;
    if (Math.abs(distance) > 5) suppressClickRef.current = true;
    event.currentTarget.scrollLeft = drag.startScrollLeft + distance;
    updateCollectionPull(drag.startedOnLast, distance, drag.cardWidth);
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = pointerDragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) {
      interactionRef.current.pointer = false;
      pauseAutoplay();
      return;
    }

    const distance = drag.startX - event.clientX;
    pointerDragRef.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    completeCollectionPull(
      drag.startedOnLast,
      distance,
      drag.cardWidth,
    );
  }

  function handleTouchStart(event: ReactTouchEvent<HTMLDivElement>) {
    pauseAutoplay();
    interactionRef.current.pointer = true;
    const touch = event.touches[0];
    touchDragRef.current = {
      cardWidth: getCardWidth(event.currentTarget),
      startX: touch.clientX,
      startedOnLast: activeIndex === selectedProducts.length - 1,
    };
  }

  function handleTouchMove(event: ReactTouchEvent<HTMLDivElement>) {
    const drag = touchDragRef.current;
    const touch = event.touches[0];
    if (!drag || !touch) return;
    updateCollectionPull(
      drag.startedOnLast,
      drag.startX - touch.clientX,
      drag.cardWidth,
    );
  }

  function handleTouchEnd(event: ReactTouchEvent<HTMLDivElement>) {
    const drag = touchDragRef.current;
    const touch = event.changedTouches[0];
    touchDragRef.current = null;
    if (!drag || !touch) {
      interactionRef.current.pointer = false;
      setCollectionPull(0);
      return;
    }
    completeCollectionPull(
      drag.startedOnLast,
      drag.startX - touch.clientX,
      drag.cardWidth,
    );
  }

  function handleScroll(event: UIEvent<HTMLDivElement>) {
    const rail = event.currentTarget;

    if (frameRef.current !== null) {
      window.cancelAnimationFrame(frameRef.current);
    }

    frameRef.current = window.requestAnimationFrame(() => {
      const cards = Array.from(
        rail.querySelectorAll<HTMLElement>("[data-selected-card]"),
      );
      const physicalIndex = cards.reduce((closest, card, index) => {
        const cardLeft = card.offsetLeft - rail.offsetLeft;
        const closestLeft = cards[closest].offsetLeft - rail.offsetLeft;
        return Math.abs(cardLeft - rail.scrollLeft) <
          Math.abs(closestLeft - rail.scrollLeft)
          ? index
          : closest;
      }, 0);
      const logicalIndex =
        (physicalIndex + selectedProducts.length) % selectedProducts.length;

      physicalIndexRef.current = physicalIndex;
      setActiveIndex(logicalIndex);

      if (
        physicalIndex < selectedProducts.length ||
        physicalIndex >= selectedProducts.length * 2
      ) {
        scrollToPhysicalIndex(
          selectedProducts.length + logicalIndex,
          "auto",
        );
      }
    });
  }

  function moveRail(direction: -1 | 1) {
    pauseAutoplay();
    scrollToPhysicalIndex(physicalIndexRef.current + direction, "smooth");
  }

  return (
    <section
      aria-labelledby="selected-garments-title"
      className="selected-garments-section mobile-selected-editorial order-2 scroll-mt-16 border-y border-black/14 bg-[#dedfd9] py-7 text-[#11110f] lg:order-none lg:scroll-mt-24 lg:py-9"
      id="selected-pieces"
      ref={sectionRef}
    >
      <div className="selected-garments-inner mx-auto max-w-[1680px] px-4 sm:px-6 lg:px-12">
        <header className="selected-garments-header mb-5 grid grid-cols-[1fr_auto] items-end gap-4 border-b border-black/14 pb-4 text-[10px] font-normal uppercase tracking-[0.12em] text-black/58 lg:mb-6 lg:grid-cols-[minmax(190px,0.34fr)_1fr_auto]">
          <h2 className="font-normal" id="selected-garments-title">
            04 / Selected garments
          </h2>
          <p className="hidden lg:block">06 pieces / Spring 2026</p>
          <nav
            aria-label="Selected garment collections"
            className="flex gap-4 lg:gap-6"
          >
            <Link
              className="selected-gender-link"
              href="/collections/men"
            >
              Men
            </Link>
            <Link
              className="selected-gender-link"
              href="/collections/women"
            >
              Women
            </Link>
          </nav>
        </header>

        <div className="selected-garments-layout grid min-w-0 gap-5 lg:grid-cols-[minmax(320px,34%)_minmax(0,1fr)] lg:gap-6">
          <Link
            aria-label="Shop selected garments"
            className="selected-campaign-card group relative min-h-0 overflow-hidden border border-black/14 bg-[#c8cbc5]"
            href="/collections"
          >
            <Image
              alt="Black LOW SIGNAL garment arranged on a studio chair"
              className="selected-campaign-image object-cover object-[54%_50%] brightness-[0.76] contrast-[1.06] saturate-[0.58] transition-transform duration-700 group-hover:scale-[1.012]"
              fill
              sizes="(min-width: 1280px) 22vw, (min-width: 1024px) 34vw, 100vw"
              src="/images/low-signal/selected-garments-main.jpg"
            />
            <div className="selected-campaign-overlay absolute inset-0 bg-gradient-to-t from-black/66 via-black/5 to-black/5" />
            <div className="selected-campaign-copy absolute inset-x-0 bottom-0 grid gap-2 p-5 text-[#f1f1ea] lg:p-7">
              <p className="selected-campaign-title text-[17px] uppercase tracking-[0.07em] lg:text-[22px]">
                Selected garments
              </p>
              <p className="text-[9px] uppercase tracking-[0.12em] text-white/64">
                06 pieces
              </p>
              <span className="selected-rail-link mt-1 w-fit text-[9px] uppercase tracking-[0.1em] lg:mt-3">
                Shop selection →
              </span>
            </div>
          </Link>

          <div className="selected-products-column grid min-w-0 grid-rows-[minmax(0,1fr)_auto]">
            <div
              aria-label="Selected garments carousel"
              className="selected-rail flex min-w-0 snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain scroll-smooth lg:gap-4"
              onBlurCapture={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                  interactionRef.current.focus = false;
                  pauseAutoplay(2600);
                }
              }}
              onClickCapture={(event) => {
                if (suppressClickRef.current) {
                  event.preventDefault();
                  event.stopPropagation();
                  suppressClickRef.current = false;
                }
              }}
              onFocusCapture={() => {
                interactionRef.current.focus = true;
                pauseAutoplay();
              }}
              onDragStart={(event) => event.preventDefault()}
              onPointerCancel={() => {
                pointerDragRef.current = null;
                interactionRef.current.pointer = false;
                setCollectionPull(0);
                pauseAutoplay();
              }}
              onPointerDown={handlePointerDown}
              onPointerEnter={() => {
                interactionRef.current.hover = true;
                pauseAutoplay();
              }}
              onPointerLeave={() => {
                interactionRef.current.hover = false;
                if (!pointerDragRef.current) {
                  interactionRef.current.pointer = false;
                  setCollectionPull(0);
                }
                pauseAutoplay(2600);
              }}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onScroll={handleScroll}
              onTouchEnd={handleTouchEnd}
              onTouchMove={handleTouchMove}
              onTouchStart={handleTouchStart}
              onWheel={() => pauseAutoplay()}
              ref={railRef}
              role="region"
            >
              {repeatedProducts.map(({ clone, group, index, product }) => (
                <SelectedProductCard
                  clone={clone}
                  index={index}
                  key={`${group}-${product.id}`}
                  product={product}
                />
              ))}
            </div>

            <div className="selected-rail-footer mt-4 flex min-h-11 items-center justify-between border-t border-black/14 pt-3 text-[9px] uppercase tracking-[0.12em] text-black/54">
              <span className="selected-rail-index" aria-live="polite">
                {String(activeIndex + 1).padStart(2, "0")} / 06
              </span>
              <div
                aria-hidden="true"
                className="selected-rail-progress lg:hidden"
              >
                <span
                  style={{ width: `${((activeIndex + 1) / 6) * 100}%` }}
                />
              </div>
              <Link
                aria-hidden={activeIndex !== selectedProducts.length - 1}
                className="selected-collections-link hidden lg:inline-flex"
                href="/collections"
                style={{ "--collection-pull": collectionPull } as React.CSSProperties}
                tabIndex={
                  activeIndex === selectedProducts.length - 1 ? 0 : -1
                }
              >
                View all collections →
              </Link>
              <div className="hidden items-center gap-5 lg:flex">
                <button
                  aria-label="Previous selected garment"
                  className="selected-rail-control"
                  onClick={() => moveRail(-1)}
                  type="button"
                >
                  ←
                </button>
                <button
                  aria-label="Next selected garment"
                  className="selected-rail-control"
                  onClick={() => moveRail(1)}
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

function SelectedProductCard({
  clone,
  index,
  product,
}: Readonly<{ clone: boolean; index: number; product: Product }>) {
  return (
    <article
      aria-hidden={clone || undefined}
      className="mobile-selected-card group relative min-w-0 shrink-0 snap-start border-b border-black/14 pb-3 lg:pb-4"
      data-selected-card
    >
      <Link
        aria-label={`Open ${product.name}`}
        className="absolute inset-0 z-10 focus:outline-none focus-visible:ring-1 focus-visible:ring-current"
        href={`/products/${product.slug}`}
        tabIndex={clone ? -1 : undefined}
      />
      <div className="relative aspect-[4/5] overflow-hidden border border-black/14 bg-[#ccd0c9]">
        <span className="absolute left-3 top-3 z-[1] text-[9px] uppercase tracking-[0.12em] text-white/70">
          {String(index + 1).padStart(2, "0")}
        </span>
        <Image
          alt={clone ? "" : product.name}
          className={`object-cover brightness-[0.86] contrast-[1.05] saturate-[0.65] transition-transform duration-700 group-hover:scale-[1.015] ${
            product.objectPosition ?? "object-center"
          }`}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 23vw, 78vw"
          src={product.image}
        />
      </div>
      <div className="mobile-selected-product-info grid min-h-[96px] grid-cols-[minmax(0,1fr)_auto] gap-2 pt-3 uppercase">
        <div className="min-w-0">
          <h3 className="selected-product-title font-medium">
            {product.name}
          </h3>
          <p className="selected-product-category mt-2 text-black/54">
            {product.category}
          </p>
          <p className="selected-product-price mt-2 font-normal">
            ${product.price}
          </p>
        </div>
        <span className="selected-product-cta self-end border-b border-black/36 pb-1">
          View product →
        </span>
      </div>
    </article>
  );
}
