"use client";

import { useEffect, useRef, useState } from "react";
import { type Product, type ProductSize } from "@/data/products";
import { trackEcommerce } from "@/lib/analytics";
import { getAvailabilityState } from "@/lib/availability";
import { addProductToCart } from "@/lib/cart-store";

const sizeOrder = ["XS", "S", "M", "L", "XL"] as const;

export function ProductAddAction({
  product,
  tone = "paper",
}: Readonly<{
  product: Product;
  tone?: "dark" | "paper";
}>) {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "added">("idle");
  const resetTimer = useRef<number | null>(null);
  const sizeOptions = getProductSizeOptions(product);
  const isSoldOut =
    getAvailabilityState(
      sizeOptions.reduce((total, option) => total + option.stock, 0),
    ) === "sold_out";

  useEffect(
    () => () => {
      if (resetTimer.current) window.clearTimeout(resetTimer.current);
    },
    [],
  );

  function addSize(size: ProductSize) {
    addProductToCart({ product, size: size.label, sizeOption: size });
    trackEcommerce("add_to_cart", {
      currency: "USD",
      item_id: product.id,
      item_name: product.name,
      size: size.label,
      value: product.price,
    });
    setIsOpen(false);
    setStatus("added");
    if (resetTimer.current) window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setStatus("idle"), 1200);
  }

  const isDark = tone === "dark";

  return (
    <div className="relative">
      <button
        aria-expanded={isOpen}
        aria-label={`Add ${product.name}; choose a size`}
        className={`flex min-h-11 min-w-11 items-center justify-end whitespace-nowrap border-b text-[10px] font-normal uppercase tracking-[0.08em] disabled:opacity-35 ${
          isDark
            ? "border-white/38 text-[#ecece5]"
            : "border-black/36 text-black/72"
        }`}
        disabled={isSoldOut}
        onClick={() => setIsOpen((open) => !open)}
        type="button"
      >
        {isSoldOut ? "Sold out" : status === "added" ? "Added" : "Add +"}
      </button>

      {isOpen && !isSoldOut ? (
        <div
          aria-label={`Choose a size for ${product.name}`}
          className={`absolute bottom-12 right-0 z-40 w-[220px] border p-3 text-[10px] uppercase tracking-[0.07em] shadow-[0_12px_28px_rgb(0_0_0/0.16)] ${
            isDark
              ? "border-white/20 bg-[#201f1c] text-[#ecece5]"
              : "border-black/18 bg-[#e5e6e1] text-black"
          }`}
        >
          <div
            className={`grid grid-cols-5 gap-px ${
              isDark ? "bg-white/18" : "bg-black/14"
            }`}
          >
            {sizeOptions.map((size) => (
              <button
                aria-label={`Add size ${size.label}`}
                className={`min-h-11 min-w-11 disabled:opacity-25 ${
                  isDark ? "bg-[#171614]" : "bg-[#dedfd9]"
                }`}
                disabled={size.stock <= 0}
                key={size.label}
                onClick={() => addSize(size)}
                type="button"
              >
                {size.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function getProductSizeOptions(product: Product): ProductSize[] {
  return product.sizes?.length
    ? product.sizes
    : sizeOrder.map((label) => ({
        label,
        stock: label === product.size ? 9 : 4,
      }));
}
