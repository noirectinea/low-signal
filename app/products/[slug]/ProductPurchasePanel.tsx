"use client";

import { useEffect, useState } from "react";
import {
  type Product,
  type ProductSize,
} from "@/data/products";
import { getAvailabilityLabel } from "@/lib/availability";
import {
  addProductToCart,
  changeCartQuantity,
  readCart,
  useCart,
} from "@/lib/cart-store";
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
  const [message, setMessage] = useState("");
  const { items } = useCart();
  const selectedStock =
    sizeOptions.find((size) => size.label === selectedSize)?.stock ?? 0;
  const selectedSizeOption = sizeOptions.find(
    (size) => size.label === selectedSize,
  );
  const cartItem = selectedSize
    ? items.find(
        (item) => item.id === `${product.id}-${selectedSize.toLowerCase()}`,
      )
    : undefined;

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
    setMessage("");
  }

  return (
    <div className="border-b border-black/16 py-5">
      <div className="flex items-center justify-between gap-4 text-[12px] uppercase tracking-[0.06em] text-black/68">
        <span>Size</span>
        <span>
          {selectedSize
            ? `Selected: ${selectedSize} / ${getAvailabilityLabel(selectedStock)}`
            : "Choose your size"}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-5 gap-px bg-black/16">
        {sizeOptions.map((size) => (
          <button
            aria-pressed={selectedSize === size.label}
            className={`min-h-11 px-2 py-3 text-[11px] uppercase tracking-[0.12em] transition-colors duration-300 ${
              selectedSize === size.label
                ? "bg-[#171614] text-[#ecece5]"
                : "bg-[#d9d9d1] text-black/62 hover:bg-[#cfcfc7] hover:text-black"
            } disabled:cursor-not-allowed disabled:bg-[#c9c9c1] disabled:text-black/28`}
            disabled={size.stock <= 0}
            key={size.label}
            type="button"
            onClick={() => {
              setSelectedSize(size.label);
              setMessage(
                size.stock <= 0 ? "Selected size is unavailable." : "",
              );
            }}
          >
            {size.label}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {cartItem ? (
          <div
            aria-label={`${product.name} quantity`}
            className="grid min-h-14 grid-cols-[56px_1fr_56px] border border-black bg-[#171614] text-[#ecece5]"
          >
            <button
              aria-label={`Remove one ${product.name}`}
              className="min-h-11 border-r border-white/18 text-[18px]"
              onClick={() =>
                changeCartQuantity(cartItem.id, -1, selectedStock)
              }
              type="button"
            >
              −
            </button>
            <span className="grid place-items-center text-[12px]">
              {cartItem.quantity}
            </span>
            <button
              aria-label={`Add one ${product.name}`}
              className="min-h-11 border-l border-white/18 text-[18px] disabled:opacity-35"
              disabled={cartItem.quantity >= selectedStock}
              onClick={() =>
                changeCartQuantity(cartItem.id, 1, selectedStock)
              }
              type="button"
            >
              +
            </button>
          </div>
        ) : (
          <button
            className="add-to-cart-label flex min-h-14 w-full items-center justify-center bg-[#171614] px-5 py-4 text-[11px] uppercase text-[#ecece5] transition-opacity duration-300 hover:opacity-82 disabled:cursor-not-allowed disabled:opacity-55"
            disabled={Boolean(selectedSize) && selectedStock <= 0}
            type="button"
            onClick={addToCart}
          >
            {!selectedSize
              ? "Select a size"
              : selectedStock <= 0
                ? "Sold out"
                : "Add to cart"}
          </button>
        )}
      </div>
      {message ? (
        <p aria-live="polite" className="mt-3 text-[12px] uppercase leading-[1.5] tracking-[0.05em] text-black/76">
          {message}
        </p>
      ) : null}
      {selectedSize && selectedStock > 0 && selectedStock <= 3 ? (
        <p className="mt-3 text-[12px] uppercase tracking-[0.14em] text-black/72">
          Low stock — only {selectedStock} left in {selectedSize}.
        </p>
      ) : null}
    </div>
  );
}
