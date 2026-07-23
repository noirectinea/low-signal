"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
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
  const railRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef = useRef<number | null>(null);
  const pauseAutoplayUntilRef = useRef(0);
  const physicalIndexRef = useRef(selectedProducts.length);
  const [isMobile, setIsMobile] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
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
    const mobileQuery = window.matchMedia("(max-width: 767.98px)");
    const updateMode = () => setIsMobile(mobileQuery.matches);

    updateMode();
    mobileQuery.addEventListener("change", updateMode);

    return () => mobileQuery.removeEventListener("change", updateMode);
  }, []);

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
    if (!isMobile || !isInView) return;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    if (reducedMotion.matches) return;

    let interval: number | undefined;
    const advance = () => {
      if (
        reducedMotion.matches ||
        document.hidden ||
        Date.now() < pauseAutoplayUntilRef.current
      ) {
        return;
      }
      scrollToPhysicalIndex(physicalIndexRef.current + 1, "smooth");
    };
    const firstAdvance = window.setTimeout(() => {
      advance();
      interval = window.setInterval(advance, 3800);
    }, 4500);

    return () => {
      window.clearTimeout(firstAdvance);
      if (interval !== undefined) window.clearInterval(interval);
    };
  }, [isInView, isMobile, scrollToPhysicalIndex]);

  function pauseAutoplay() {
    pauseAutoplayUntilRef.current = Date.now() + 9000;
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
              sizes="(min-width: 1024px) 34vw, 100vw"
              src="/images/low-signal/selected-garments-main.jpg"
            />
            <div className="selected-campaign-overlay absolute inset-0 bg-gradient-to-t from-black/66 via-black/5 to-black/5" />
            <div className="selected-campaign-copy absolute inset-x-0 bottom-0 grid gap-2 p-5 text-[#f1f1ea] lg:p-7">
              <p className="text-[17px] font-normal uppercase tracking-[0.07em] lg:text-[22px]">
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
              onPointerDown={pauseAutoplay}
              onScroll={handleScroll}
              onTouchStart={pauseAutoplay}
              onWheel={pauseAutoplay}
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
          sizes="(min-width: 1024px) 23vw, 78vw"
          src={product.image}
        />
      </div>
      <div className="mobile-selected-product-info grid min-h-[96px] grid-cols-[minmax(0,1fr)_auto] gap-2 pt-3 uppercase">
        <div className="min-w-0">
          <h3 className="text-[11px] font-normal tracking-[0.06em] lg:text-[12px]">
            {product.name}
          </h3>
          <p className="mt-2 text-[9px] tracking-[0.08em] text-black/54">
            {product.category}
          </p>
          <p className="mt-2 text-[10px] font-normal">${product.price}</p>
        </div>
        <span className="selected-product-cta self-end border-b border-black/36 pb-1 text-[9px] tracking-[0.06em]">
          View product →
        </span>
      </div>
    </article>
  );
}
