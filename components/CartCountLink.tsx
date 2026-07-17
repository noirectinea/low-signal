"use client";

import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import { cartStorageKey, type CartItem } from "@/data/products";

function subscribeCartStore(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("storage", onStoreChange);
  window.addEventListener("low-signal-cart", onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("low-signal-cart", onStoreChange);
  };
}

function readCartSnapshot() {
  if (typeof window === "undefined") {
    return "[]";
  }

  return window.localStorage.getItem(cartStorageKey) ?? "[]";
}

function getServerCartSnapshot() {
  return "[]";
}

function parseCart(snapshot: string): CartItem[] {
  try {
    return JSON.parse(snapshot) as CartItem[];
  } catch {
    return [];
  }
}

export function CartCountLink({
  className,
  href = "/cart",
  onClick,
}: Readonly<{
  className?: string;
  href?: string;
  onClick?: () => void;
}>) {
  const cartSnapshot = useSyncExternalStore(
    subscribeCartStore,
    readCartSnapshot,
    getServerCartSnapshot,
  );
  const cartItems = useMemo(() => parseCart(cartSnapshot), [cartSnapshot]);
  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  return (
    <Link aria-label={`Cart, ${cartCount} items`} className={className} href={href} onClick={onClick}>
      Cart ({cartCount})
    </Link>
  );
}
