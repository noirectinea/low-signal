"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type GalleryImage = {
  alt: string;
  src: string;
};

export function ProductGallery({
  imageFit,
  images,
  objectPosition,
  productName,
}: {
  imageFit: string;
  images: GalleryImage[];
  objectPosition: string;
  productName: string;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const mobileRailRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!zoomed) return;
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setZoomed(false);
      if (event.key === "Tab") {
        event.preventDefault();
        closeButtonRef.current?.focus();
      }
    }

    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.documentElement.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [zoomed]);

  function updateMobileIndex() {
    const rail = mobileRailRef.current;

    if (!rail) return;
    const nextIndex = Math.round(rail.scrollLeft / rail.clientWidth);

    setActiveIndex(Math.max(0, Math.min(images.length - 1, nextIndex)));
  }

  return (
    <div className="mobile-product-gallery relative grid gap-4 lg:grid-cols-[104px_1fr] lg:border-r lg:border-black/16 lg:p-8 xl:grid-cols-[124px_1fr] xl:p-10">
      <div className="hidden grid-cols-1 gap-3 lg:grid">
        {images.map((image, index) => (
          <button
            aria-label={`View image ${index + 1} of ${images.length}`}
            aria-pressed={activeIndex === index}
            className={`relative aspect-[4/5] overflow-hidden border bg-[#d0d0c8] ${
              activeIndex === index ? "border-black/55" : "border-black/12"
            }`}
            key={`${image.src}-${index}`}
            type="button"
            onClick={() => setActiveIndex(index)}
          >
            <Image
              alt=""
              className="object-cover brightness-[0.88] contrast-[1.04] saturate-[0.68]"
              fill
              sizes="124px"
              src={image.src}
            />
          </button>
        ))}
      </div>

      <div className="relative hidden min-h-0 overflow-hidden border border-black/12 bg-[#d0d0c8] lg:block">
        <Image
          alt={images[activeIndex]?.alt ?? productName}
          className={`${imageFit} ${objectPosition} brightness-[0.9] contrast-[1.04] saturate-[0.68]`}
          fill
          priority
          sizes="48vw"
          src={images[activeIndex]?.src ?? images[0].src}
        />
        <GalleryControls
          activeIndex={activeIndex}
          count={images.length}
          onZoom={() => setZoomed(true)}
        />
      </div>

      <div
        aria-label={`${productName} image gallery`}
        className="mobile-product-swipe-gallery flex snap-x snap-mandatory overflow-x-auto lg:hidden"
        ref={mobileRailRef}
        role="region"
        onScroll={updateMobileIndex}
      >
        {images.map((image, index) => (
          <button
            aria-label={`Zoom image ${index + 1} of ${images.length}`}
            className="mobile-product-lead relative min-h-[68vh] w-full shrink-0 snap-center overflow-hidden border-y border-black/12 bg-[#d0d0c8]"
            key={`${image.src}-${index}`}
            type="button"
            onClick={() => {
              setActiveIndex(index);
              setZoomed(true);
            }}
          >
            <Image
              alt={image.alt}
              className={`${imageFit} ${index === 0 ? objectPosition : "object-center"} brightness-[0.9] contrast-[1.04] saturate-[0.7]`}
              fill
              priority={index === 0}
              sizes="100vw"
              src={image.src}
            />
          </button>
        ))}
      </div>

      <div className="pointer-events-none absolute bottom-4 right-4 z-10 flex items-center gap-3 bg-black/68 px-3 py-2 text-[10px] uppercase tracking-[0.12em] text-white lg:hidden">
        <span>{String(activeIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</span>
        <span>Swipe</span>
      </div>

      {zoomed ? (
        <div
          aria-label={`${productName} enlarged image`}
          aria-modal="true"
          className="fixed inset-0 z-[90] grid bg-[#11110f] text-white"
          role="dialog"
        >
          <button
            className="absolute right-5 top-5 z-10 min-h-11 border-b border-white/55 text-[11px] uppercase tracking-[0.14em]"
            ref={closeButtonRef}
            type="button"
            onClick={() => setZoomed(false)}
          >
            Close
          </button>
          <div className="relative m-5 mt-20">
            <Image
              alt={images[activeIndex]?.alt ?? productName}
              className="object-contain"
              fill
              sizes="100vw"
              src={images[activeIndex]?.src ?? images[0].src}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

function GalleryControls({
  activeIndex,
  count,
  onZoom,
}: {
  activeIndex: number;
  count: number;
  onZoom: () => void;
}) {
  return (
    <div className="absolute inset-x-4 bottom-4 flex items-center justify-between gap-5 text-[9px] uppercase tracking-[0.14em] text-white">
      <span className="bg-black/60 px-3 py-2">
        {String(activeIndex + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
      </span>
      <button
        className="min-h-11 bg-black/60 px-3"
        type="button"
        onClick={onZoom}
      >
        Zoom
      </button>
    </div>
  );
}
