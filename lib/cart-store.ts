"use client";

import { useMemo, useSyncExternalStore } from "react";
import {
  cartStorageKey,
  type CartItem,
  type Product,
  type ProductSize,
} from "@/data/products";

const cartEvent = "low-signal-cart";
const emptySnapshot = "[]";

function subscribe(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(cartEvent, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(cartEvent, onStoreChange);
  };
}

function getSnapshot() {
  return window.localStorage.getItem(cartStorageKey) ?? emptySnapshot;
}

function getServerSnapshot() {
  return emptySnapshot;
}

export function parseCart(snapshot: string): CartItem[] {
  try {
    const value = JSON.parse(snapshot) as unknown;

    return Array.isArray(value) ? (value as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function readCart() {
  if (typeof window === "undefined") return [];

  return parseCart(getSnapshot());
}

export function writeCart(items: CartItem[]) {
  if (typeof window === "undefined") return;

  window.localStorage.setItem(cartStorageKey, JSON.stringify(items));
  window.dispatchEvent(new Event(cartEvent));
}

export function clearCart() {
  if (typeof window === "undefined") return;

  window.localStorage.removeItem(cartStorageKey);
  window.dispatchEvent(new Event(cartEvent));
}

export function addProductToCart({
  product,
  size,
  sizeOption,
}: {
  product: Product;
  size: string;
  sizeOption?: ProductSize;
}) {
  const items = readCart();
  const itemId = `${product.id}-${size.toLowerCase()}`;
  const current = items.find((item) => item.id === itemId);
  const stock = sizeOption?.stock ?? product.stock ?? 1;
  const nextItems = current
    ? items.map((item) =>
        item.id === itemId
          ? { ...item, quantity: Math.min(item.quantity + 1, stock) }
          : item,
      )
    : [
        ...items,
        {
          ...product,
          id: itemId,
          productId: product.id,
          quantity: 1,
          size,
          variantId: sizeOption?.variantId ?? sizeOption?.id,
        },
      ];

  writeCart(nextItems);

  return nextItems;
}

export function changeCartQuantity(id: string, delta: number, maxStock = 20) {
  const nextItems = readCart()
    .map((item) =>
      item.id === id
        ? {
            ...item,
            quantity: Math.min(
              Math.max(0, item.quantity + delta),
              maxStock,
            ),
          }
        : item,
    )
    .filter((item) => item.quantity > 0);

  writeCart(nextItems);

  return nextItems;
}

export function removeCartItem(id: string) {
  const items = readCart();
  const removed = items.find((item) => item.id === id);

  writeCart(items.filter((item) => item.id !== id));

  return removed;
}

export function restoreCartItem(item: CartItem) {
  const items = readCart();

  if (!items.some((current) => current.id === item.id)) {
    writeCart([...items, item]);
  }
}

export function useCart() {
  const snapshot = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  return useMemo(() => {
    const items = parseCart(snapshot);

    return {
      count: items.reduce((total, item) => total + item.quantity, 0),
      hydrated,
      items,
      subtotal: items.reduce(
        (total, item) => total + item.price * item.quantity,
        0,
      ),
    };
  }, [hydrated, snapshot]);
}
