"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MobileHomeHeader } from "@/components/MobileHomeHeader";
import { cartStorageKey, type CartItem } from "@/data/products";
import { getAvailabilityLabel } from "@/lib/availability";

type CartAvailability = Record<
  string,
  {
    message?: string;
    stock: number;
  }
>;

export function CartPageClient() {
  const [items, setItems] = useState<CartItem[]>(readCart);
  const [availability, setAvailability] = useState<CartAvailability>({});
  const [availabilityStatus, setAvailabilityStatus] = useState<
    "idle" | "loading"
  >("idle");
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const hasBlockingWarnings = items.some((item) => availability[item.id]?.message);

  useEffect(() => {
    writeCart(items);
  }, [items]);

  useEffect(() => {
    if (!items.length) {
      return;
    }

    const controller = new AbortController();

    async function resolveAvailability() {
      setAvailabilityStatus("loading");

      try {
        const response = await fetch("/api/cart/resolve", {
          body: JSON.stringify({
            items: items.map((item) => ({
              product_id: baseProductId(item),
              quantity: item.quantity,
              size: item.size ?? sizeFromCartItemId(item.id),
              variant_id: item.variantId,
            })),
          }),
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          signal: controller.signal,
        });
        const result = (await response.json()) as
          | {
              items: Array<{
                product_id: string;
                quantity: number;
                size?: string;
                stock?: number;
                variant_id: string;
              }>;
              ok: true;
            }
          | {
              ok: false;
            };

        if (!response.ok || !result.ok) {
          setAvailability({});
          return;
        }

        setAvailability(
          items.reduce<CartAvailability>((nextAvailability, item, index) => {
            const resolved = result.items[index];
            const stock = resolved?.stock ?? item.stock ?? 0;
            const message =
              stock <= 0
                ? "This size is sold out."
                : item.quantity > stock
                  ? `Only ${stock} available.`
                  : undefined;

            nextAvailability[item.id] = {
              message,
              stock,
            };

            return nextAvailability;
          }, {}),
        );
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setAvailability({});
        }
      } finally {
        if (!controller.signal.aborted) {
          setAvailabilityStatus("idle");
        }
      }
    }

    void resolveAvailability();

    return () => controller.abort();
  }, [items]);

  function changeQuantity(id: string, delta: number) {
    setItems((currentItems) =>
      currentItems
        .map((item) => {
          if (item.id !== id) {
            return item;
          }

          const maxStock = availability[id]?.stock ?? item.stock ?? 20;

          return {
            ...item,
            quantity: Math.min(Math.max(0, item.quantity + delta), maxStock),
          };
        })
        .filter((item) => item.quantity > 0),
    );
  }

  function removeItem(id: string) {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
  }

  return (
    <main className="min-h-screen bg-[#f0ece4] text-[#141311]">
      <MobileHomeHeader mode="paper" />

      <section className="px-5 pb-16 pt-[104px] lg:px-12">
        <div className="mx-auto max-w-[1500px]">
          <div className="grid border-b border-black/16 pb-8 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="text-[12px] uppercase tracking-[0.14em] text-black/50">
                Cart / Current rail
              </p>
              <h1 className="controlled-display-title mt-8 text-[56px] uppercase text-black/92 sm:text-[76px] lg:text-[96px]">
                Your cart
              </h1>
            </div>
            <p className="mt-8 max-w-[330px] self-end text-[10px] uppercase leading-[1.7] tracking-[0.18em] text-black/50 lg:mt-0">
              Review selected garments, adjust quantities, then continue to
              secure checkout.
            </p>
          </div>

          {items.length > 0 ? (
            <div className="grid gap-10 pt-10 lg:grid-cols-[1fr_360px] xl:grid-cols-[1fr_420px]">
              <div className="border-t border-black/16">
                {items.map((item) => (
                  <CartLine
                    availability={availability[item.id]}
                    isChecking={availabilityStatus === "loading"}
                    item={item}
                    key={item.id}
                    onQuantity={changeQuantity}
                    onRemove={removeItem}
                  />
                ))}
              </div>

              <OrderSummary
                hasBlockingWarnings={hasBlockingWarnings}
                isChecking={availabilityStatus === "loading"}
                subtotal={subtotal}
              />
            </div>
          ) : (
            <div className="grid min-h-[420px] place-items-center border-b border-black/16 py-16 text-center">
              <div>
                <p className="text-[12px] uppercase tracking-[0.14em] text-black/50">
                  Cart is empty
                </p>
                <Link
                  href="/collections"
                  className="mt-8 inline-flex border-b border-black/60 pb-[5px] text-[12px] uppercase tracking-[0.14em]"
                >
                  View collection →
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

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
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(cartStorageKey, JSON.stringify(items));
  window.dispatchEvent(new Event("low-signal-cart"));
}

function CartLine({
  availability,
  isChecking,
  item,
  onQuantity,
  onRemove,
}: Readonly<{
  availability?: CartAvailability[string];
  isChecking: boolean;
  item: CartItem;
  onQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}>) {
  const stock = availability?.stock ?? item.stock;
  const plusDisabled = typeof stock === "number" && item.quantity >= stock;

  return (
    <article className="grid gap-6 border-b border-black/16 py-7 text-[12px] uppercase leading-[1.55] tracking-[0.14em] sm:grid-cols-[132px_1fr_auto] lg:grid-cols-[160px_1fr_auto]">
      <div className="relative aspect-[4/5] overflow-hidden bg-[#d8d3c8]">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(min-width: 1024px) 160px, 132px"
          className={`product-image object-cover brightness-[0.9] contrast-[1.04] saturate-[0.74] ${
            item.objectPosition ?? "object-center"
          }`}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-[1fr_auto]">
        <div>
          <h2 className="max-w-[240px] text-[12px] text-black">{item.name}</h2>
          <div className="mt-5 grid gap-1 text-black/50">
            <p>Category: {item.category}</p>
            <p>Color: {item.color ?? "Black"}</p>
            {item.materials ? <p>Material: {item.materials}</p> : null}
            <p>Size: {item.size ?? "M"}</p>
            <p>
              Availability:{" "}
              {typeof stock === "number" && !isChecking
                ? getAvailabilityLabel(stock)
                : "Checking"}
            </p>
          </div>
          {availability?.message ? (
            <p className="mt-5 max-w-[240px] text-black/72">
              {availability.message}
            </p>
          ) : null}
          <button
            className="mt-6 border-b border-black/40 pb-1 text-black/54"
            type="button"
            onClick={() => onRemove(item.id)}
          >
            Remove
          </button>
        </div>

        <div className="flex items-start gap-6 sm:justify-end">
          <button
            type="button"
            onClick={() => onQuantity(item.id, -1)}
            aria-label={`Remove one ${item.name}`}
          >
            -
          </button>
          <span>{item.quantity}</span>
          <button
            type="button"
            onClick={() => onQuantity(item.id, 1)}
            aria-label={`Add one ${item.name}`}
            disabled={plusDisabled}
            className={plusDisabled ? "text-black/24" : undefined}
          >
            +
          </button>
        </div>
      </div>

      <p className="text-left sm:text-right">${item.price * item.quantity}</p>
    </article>
  );
}

function OrderSummary({
  hasBlockingWarnings,
  isChecking,
  subtotal,
}: Readonly<{
  hasBlockingWarnings: boolean;
  isChecking: boolean;
  subtotal: number;
}>) {
  return (
    <aside className="h-fit border border-black/16 bg-[#ebe6dc] p-6 text-[12px] uppercase tracking-[0.14em] lg:sticky lg:top-[96px]">
      <p className="border-b border-black/16 pb-5 text-black/58">
        Order summary
      </p>
      <div className="grid gap-5 border-b border-black/16 py-6 text-black/58">
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span className="text-black">${subtotal}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Shipping</span>
          <span>Calculated at checkout</span>
        </div>
      </div>
      <div className="flex items-center justify-between py-6 text-black">
        <span>Total</span>
        <span>${subtotal}</span>
      </div>
      {hasBlockingWarnings ? (
        <p className="flex w-full items-center justify-center bg-[#171614] px-5 py-5 text-center text-[#f4f0e8]/80">
          Update unavailable items before checkout
        </p>
      ) : (
        <Link
          className={`flex w-full items-center justify-center gap-4 bg-[#171614] px-5 py-5 text-[#f4f0e8] transition-opacity duration-300 hover:opacity-80 ${
            isChecking ? "pointer-events-none opacity-60" : ""
          }`}
          href="/checkout"
        >
          {isChecking ? "Checking stock" : "Proceed to checkout"}
          <span aria-hidden="true">-&gt;</span>
        </Link>
      )}
      <Link
        href="/collections"
        className="mx-auto mt-6 flex w-fit border-b border-black/60 pb-1"
      >
        Continue shopping
      </Link>
    </aside>
  );
}

function baseProductId(cartItem: CartItem) {
  return cartItem.productId ?? cartItem.id.replace(/-(xs|s|m|l|xl)$/i, "");
}

function sizeFromCartItemId(cartItemId: string) {
  return cartItemId.match(/-(xs|s|m|l|xl)$/i)?.[1]?.toUpperCase() ?? "";
}
