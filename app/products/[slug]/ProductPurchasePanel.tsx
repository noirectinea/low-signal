"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  type Product,
  type ProductSize,
} from "@/data/products";
import { getAvailabilityLabel } from "@/lib/availability";
import { addProductToCart, readCart } from "@/lib/cart-store";
import { trackEcommerce } from "@/lib/analytics";

const sizes = ["XS", "S", "M", "L", "XL"] as const;

export function ProductPurchasePanel({
  product,
}: Readonly<{
  product: Product;
}>) {
  const sizeOptions: ProductSize[] =
    product.sizes?.length
      ? product.sizes
      : sizes.map((label) => ({
          label,
          stock: label === product.size ? 9 : 4,
        }));
  const [selectedSize, setSelectedSize] = useState("");
  const [added, setAdded] = useState(false);
  const [message, setMessage] = useState("");
  const selectedStock =
    sizeOptions.find((size) => size.label === selectedSize)?.stock ?? 0;
  const selectedSizeOption = sizeOptions.find(
    (size) => size.label === selectedSize,
  );
  const totalStock =
    product.stock ??
    sizeOptions.reduce((total, size) => total + size.stock, 0);

  useEffect(() => {
    trackEcommerce("view_item", {
      currency: "USD",
      item_id: product.id,
      item_name: product.name,
      value: product.price,
    });
  }, [product.id, product.name, product.price]);

  function addToCart() {
    if (!selectedSize) {
      setMessage("Choose a size before adding this piece.");
      return;
    }

    if (selectedStock <= 0) {
      setMessage("Selected size is unavailable.");
      return;
    }

    const currentItem = readCart().find(
      (item) => item.id === `${product.id}-${selectedSize.toLowerCase()}`,
    );

    if (currentItem && currentItem.quantity >= selectedStock) {
      setMessage(`Only ${selectedStock} available in this size.`);
      return;
    }

    addProductToCart({
      product,
      size: selectedSize,
      sizeOption: selectedSizeOption,
    });
    trackEcommerce("add_to_cart", {
      currency: "USD",
      item_id: product.id,
      item_name: product.name,
      size: selectedSize,
      value: product.price,
    });
    setAdded(true);
    setMessage("");
  }

  return (
    <div className="border-y border-black/16 py-7">
      <div className="flex items-center justify-between gap-4 text-[13px] uppercase tracking-[0.06em] text-black/72">
        <span>Size</span>
        <span>
          {selectedSize
            ? `Selected: ${selectedSize} / ${getAvailabilityLabel(selectedStock)}`
            : "Choose your size"}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-5 gap-px bg-black/16">
        {sizeOptions.map((size) => (
          <button
            aria-pressed={selectedSize === size.label}
            className={`px-4 py-4 text-[12px] uppercase tracking-[0.14em] transition-colors duration-300 ${
              selectedSize === size.label
                ? "bg-[#171614] text-[#ecece5]"
                : "bg-[#d9d9d1] text-black/62 hover:bg-[#cfcfc7] hover:text-black"
            } disabled:cursor-not-allowed disabled:bg-[#c9c9c1] disabled:text-black/28`}
            disabled={size.stock <= 0}
            key={size.label}
            type="button"
            onClick={() => {
              setSelectedSize(size.label);
              setAdded(false);
              setMessage(
                size.stock <= 0 ? "Selected size is unavailable." : "",
              );
            }}
          >
            {size.label}
          </button>
        ))}
      </div>

      <div className={`mobile-purchase-bar mt-6 grid grid-cols-[auto_1fr] items-center gap-4 ${selectedSize ? "mobile-purchase-bar-active" : ""}`}>
        <div className="hidden text-[10px] uppercase leading-[1.55] tracking-[0.12em] lg:block">
          <span>${product.price}</span>
          <span className="ml-4 text-black/48">{selectedSize || "Select size"}</span>
        </div>
        <div className="grid text-[11px] uppercase leading-[1.35] tracking-[0.05em] lg:hidden">
          <span className="max-w-[110px] truncate font-medium">{product.name}</span>
          <span>${product.price} / {selectedSize || "Select size"}</span>
        </div>
        <button
          className="add-to-cart-label flex min-h-14 w-full items-center justify-center gap-4 bg-[#171614] px-5 py-4 text-[11px] uppercase text-[#ecece5] transition-opacity duration-300 hover:opacity-82 disabled:cursor-not-allowed disabled:opacity-55"
          disabled={Boolean(selectedSize) && selectedStock <= 0}
          type="button"
          onClick={addToCart}
        >
          {!selectedSize
            ? "Select a size"
            : selectedStock <= 0
            ? "Sold out"
            : added
              ? "Added to cart"
              : "Add to cart"}
          <span aria-hidden="true">-&gt;</span>
        </button>
      </div>
      <p className="mt-4 border-t border-black/12 pt-4 text-[13px] uppercase tracking-[0.06em] text-black/72">
        {totalStock > 0
          ? `${getAvailabilityLabel(selectedSize ? selectedStock : totalStock)} / ships in 2-4 days`
          : "Currently unavailable"}
      </p>
      {message ? (
        <p aria-live="polite" className="mt-3 text-[13px] uppercase leading-[1.5] tracking-[0.05em] text-black/76">
          {message}
        </p>
      ) : null}
      {selectedSize && selectedStock > 0 && selectedStock <= 3 ? (
        <p className="mt-3 text-[12px] uppercase tracking-[0.14em] text-black/72">
          Low stock — only {selectedStock} left in {selectedSize}.
        </p>
      ) : null}
      {added ? (
        <div aria-live="polite" className="mt-4 grid gap-3 border-t border-black/12 pt-4 text-[12px] uppercase tracking-[0.14em]">
          <p>Added to your cart.</p>
          <div className="flex flex-wrap gap-5">
            <Link className="border-b border-black/60 pb-1" href="/cart">View cart →</Link>
            <Link className="border-b border-black/36 pb-1 text-black/62" href={`/collections/${product.gender}`}>Continue shopping</Link>
          </div>
        </div>
      ) : null}
      <details className="mt-5 border-t border-black/12 pt-4 text-[13px] uppercase leading-[1.55] tracking-[0.06em] text-black/72">
        <summary className="flex min-h-11 cursor-pointer items-center text-[12px] text-black">Size guide</summary>
        <p className="mt-3 max-w-[500px]">XS 28–30 / S 30–32 / M 32–34 / L 34–36 / XL 36–38. Measure a garment you wear most often for the closest comparison.</p>
      </details>
      <div className="mt-4 text-[13px] uppercase leading-[1.55] tracking-[0.06em] text-black/72">
        <p className="text-[12px] text-black">Fit details</p>
        <p className="mt-2">Model is 186 cm / wearing M. Relaxed fit with room for a layer; choose your usual size, or size down for a closer line.</p>
      </div>
    </div>
  );
}
