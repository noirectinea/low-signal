"use client";

import { useState } from "react";
import {
  cartStorageKey,
  type CartItem,
  type Product,
  type ProductSize,
} from "@/data/products";
import { getAvailabilityLabel } from "@/lib/availability";

const sizes = ["XS", "S", "M", "L", "XL"] as const;

function readCart(): CartItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedCart = window.localStorage.getItem(cartStorageKey);
    return storedCart ? (JSON.parse(storedCart) as CartItem[]) : [];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  window.localStorage.setItem(cartStorageKey, JSON.stringify(items));
  window.dispatchEvent(new Event("storage"));
  window.dispatchEvent(new Event("low-signal-cart"));
}

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
  const firstAvailableSize =
    sizeOptions.find((size) => size.stock > 0)?.label ??
    sizeOptions[0]?.label ??
    "M";
  const [selectedSize, setSelectedSize] = useState(firstAvailableSize);
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

  function addToCart() {
    if (selectedStock <= 0) {
      setMessage("Selected size is unavailable.");
      return;
    }

    const cartItemId = `${product.id}-${selectedSize.toLowerCase()}`;
    const cartItems = readCart();
    const currentItem = cartItems.find((item) => item.id === cartItemId);

    if (currentItem && currentItem.quantity >= selectedStock) {
      setMessage(`Only ${selectedStock} available in this size.`);
      return;
    }

    const nextItems = currentItem
      ? cartItems.map((item) =>
          item.id === cartItemId
            ? {
                ...item,
                quantity: Math.min(item.quantity + 1, selectedStock || 1),
              }
            : item,
        )
      : [
          ...cartItems,
          {
            ...product,
            id: cartItemId,
            productId: product.id,
            size: selectedSize,
            variantId: selectedSizeOption?.variantId ?? selectedSizeOption?.id,
            quantity: 1,
          },
        ];

    writeCart(nextItems);
    setAdded(true);
    setMessage("");
  }

  return (
    <div className="border-y border-black/16 py-7">
      <div className="flex items-center justify-between text-[9px] uppercase tracking-[0.14em] text-black/64">
        <span>Size</span>
        <span>
          Selected: {selectedSize} /{" "}
          {getAvailabilityLabel(selectedStock)}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-5 gap-px bg-black/16">
        {sizeOptions.map((size) => (
          <button
            className={`px-4 py-4 text-[9px] uppercase tracking-[0.16em] transition-colors duration-300 ${
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

      <button
        className="add-to-cart-label mt-6 flex w-full items-center justify-center gap-4 bg-[#171614] px-6 py-5 text-[9px] uppercase text-[#ecece5] transition-opacity duration-300 hover:opacity-82 disabled:cursor-not-allowed disabled:opacity-45"
        disabled={selectedStock <= 0}
        type="button"
        onClick={addToCart}
      >
        {selectedStock <= 0
          ? "Sold out"
          : added
            ? "Added to cart"
            : "Add to cart"}
        <span aria-hidden="true">→</span>
      </button>
      <p className="mt-4 border-t border-black/12 pt-4 text-[9px] uppercase tracking-[0.14em] text-black/62">
        {totalStock > 0
          ? `${getAvailabilityLabel(selectedStock)} / ships in 2-4 days`
          : "Currently unavailable"}
      </p>
      {message ? (
        <p className="mt-3 text-[9px] uppercase leading-[1.7] tracking-[0.14em] text-black/64">
          {message}
        </p>
      ) : null}
    </div>
  );
}
