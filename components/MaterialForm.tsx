"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const materials = [
  {
    caption: "Softens through wash while holding a quiet, dry structure.",
    href: "/collections/men?material=cotton",
    image: "/images/low-signal/lookbook-campaign/material-hardware-label.png",
    name: "Washed cotton",
    position: "object-[50%_50%]",
  },
  {
    caption: "Dense warmth with a matte surface and restrained drape.",
    href: "/collections/women?material=wool",
    image: "/images/low-signal/lookbook-campaign/material-rib-knit.png",
    name: "Dry wool",
    position: "object-[50%_48%]",
  },
  {
    caption: "Firm utility cloth that records wear without losing shape.",
    href: "/collections/men?material=canvas",
    image: "/images/low-signal/selected-collection/material-form-original.png",
    name: "Raw canvas",
    position: "object-[50%_52%]",
  },
  {
    caption: "Light protection with a softened finish and low sheen.",
    href: "/collections/women?material=nylon",
    image: "/images/low-signal/selected-collection/material-detail.png",
    name: "Worn nylon",
    position: "object-[50%_48%]",
  },
] as const;

export function MaterialForm() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeMaterial = materials[activeIndex];

  return (
    <section
      aria-labelledby="material-form-title"
      className="mobile-material-story material-form-section order-3 border-t border-black/20 bg-[#d6d7d1] lg:order-none"
    >
      <div className="mx-auto grid max-w-[1680px] lg:grid-cols-[38%_62%]">
        <div className="mobile-material-copy border-b border-black/18 px-5 py-8 lg:border-b-0 lg:border-r lg:px-[5vw] lg:py-12">
          <p className="text-[9px] uppercase tracking-[0.16em] text-black/54">
            05 / Material & Form
          </p>
          <h2
            className="editorial-section-title mt-5 max-w-[420px] lg:mt-8"
            id="material-form-title"
          >
            Materials that age quietly and take on character over time.
          </h2>

          <div
            aria-label="Material selection"
            className="material-selector mt-6 grid grid-cols-2 border-y border-black/18 lg:mt-9 lg:block"
          >
            {materials.map((material, index) => (
              <button
                aria-pressed={activeIndex === index}
                className="material-selector-row group flex min-h-12 w-full items-center justify-between border-b border-black/12 px-2 text-left text-[10px] font-normal uppercase tracking-[0.07em] odd:border-r lg:px-0 lg:text-[11px] lg:odd:border-r-0 lg:last:border-b-0"
                key={material.name}
                onClick={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                onMouseEnter={() => setActiveIndex(index)}
                type="button"
              >
                <span
                  className={
                    activeIndex === index ? "text-black" : "text-black/52"
                  }
                >
                  {material.name}
                </span>
                <span
                  aria-hidden="true"
                  className={`h-px transition-[width,background-color] duration-300 ${
                    activeIndex === index
                      ? "w-12 bg-black/70"
                      : "w-7 bg-black/20 group-hover:w-10"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="mobile-material-image-column grid content-center px-5 py-5 lg:px-[5vw] lg:py-10">
          <div className="grid gap-4">
            <div className="mobile-material-image relative aspect-[16/9] min-h-0 overflow-hidden border border-black/14 bg-[#bfc0b8] lg:aspect-[2/1]">
              <Image
                alt={`${activeMaterial.name} material detail`}
                className={`editorial-image object-cover brightness-[0.78] contrast-[1.06] saturate-[0.62] transition-opacity duration-300 ${activeMaterial.position}`}
                fill
                key={activeMaterial.image}
                sizes="(min-width: 1024px) 54vw, 100vw"
                src={activeMaterial.image}
              />
              <div className="absolute inset-0 bg-[#11110f]/8" />
            </div>

            <div className="grid gap-4 border-t border-black/16 pt-4 lg:grid-cols-[1fr_auto] lg:items-start">
              <p className="editorial-body max-w-[420px]">
                {activeMaterial.caption}
              </p>
              <Link
                className="home-editorial-cta flex min-h-11 w-fit items-center border-b border-black/50 text-black"
                href={activeMaterial.href}
              >
                View garments →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
