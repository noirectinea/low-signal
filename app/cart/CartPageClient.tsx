"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MobileHomeHeader } from "@/components/MobileHomeHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { type CartItem } from "@/data/products";
import { getAvailabilityLabel } from "@/lib/availability";
import {
  changeCartQuantity,
  removeCartItem,
  restoreCartItem,
  useCart,
} from "@/lib/cart-store";
import { trackEcommerce } from "@/lib/analytics";

type CartAvailability = Record<
  string,
  {
    message?: string;
    stock: number;
  }
>;

export function CartPageClient() {
  const { hydrated, items, subtotal } = useCart();
  const [availability, setAvailability] = useState<CartAvailability>({});
  const [availabilityStatus, setAvailabilityStatus] = useState<
    "idle" | "loading" | "error"
  >("idle");
  const [removedItem, setRemovedItem] = useState<CartItem | null>(null);
  const hasBlockingWarnings = items.some((item) => availability[item.id]?.message);

  useEffect(() => {
    if (!items.length) {
      return;
    }

    const controller = new AbortController();
    let timedOut = false;
    const timeoutId = window.setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, 2_500);

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
          setAvailabilityStatus("error");
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
        setAvailabilityStatus("idle");
      } catch (error) {
        if (timedOut || (error as Error).name !== "AbortError") {
          setAvailability({});
          setAvailabilityStatus("error");
        }
      } finally {
        window.clearTimeout(timeoutId);
      }
    }

    void resolveAvailability();

    return () => {
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [items]);

  function changeQuantity(id: string, delta: number) {
    const item = items.find((current) => current.id === id);
    const maxStock = availability[id]?.stock ?? item?.stock ?? 20;

    changeCartQuantity(id, delta, maxStock);
  }

  function removeItem(id: string) {
    const removed = removeCartItem(id) ?? null;

    setRemovedItem(removed);
    if (removed) {
      trackEcommerce("remove_from_cart", {
        item_id: removed.productId ?? removed.id,
        item_name: removed.name,
        quantity: removed.quantity,
        value: removed.price * removed.quantity,
      });
    }
  }

  return (
    <main className="min-h-screen bg-[#e7e7e1] text-[#141311]">
      <MobileHomeHeader mode="paper" />

      <section className="px-5 pb-16 pt-[92px] lg:px-12 lg:pt-[104px]">
        <div className="mx-auto max-w-[1500px]">
          <div className="grid border-b border-black/16 pb-7 lg:grid-cols-[1fr_auto] lg:pb-8">
            <div>
              <p className="text-[12px] uppercase tracking-[0.14em] text-black/50">
                Cart / Current rail
              </p>
              <h1 className="controlled-display-title mt-7 text-[20.5vw] uppercase text-black/92 sm:text-[76px] lg:text-[96px]">
                Your cart
              </h1>
            </div>
            <p className="mt-8 max-w-[330px] self-end text-[10px] uppercase leading-[1.7] tracking-[0.18em] text-black/50 lg:mt-0">
              Review selected garments, adjust quantities, then continue to
              secure checkout.
            </p>
          </div>

          {!hydrated ? (
            <div
              aria-live="polite"
              className="grid min-h-[320px] place-items-center border-b border-black/16 py-16 text-[11px] uppercase tracking-[0.14em] text-black/50"
            >
              Loading your cart.
            </div>
          ) : items.length > 0 ? (
            <div className="grid gap-9 pt-8 lg:grid-cols-[1fr_360px] lg:pt-10 xl:grid-cols-[1fr_420px]">
              <div className="order-2 border-t border-black/16 lg:order-none">
                {items.map((item) => (
                  <CartLine
                    availability={availability[item.id]}
                    availabilityStatus={availabilityStatus}
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

          {removedItem ? (
            <div
              aria-live="polite"
              className="fixed inset-x-4 bottom-4 z-40 flex min-h-14 items-center justify-between gap-5 border border-black/18 bg-[#171614] px-5 text-[11px] uppercase tracking-[0.14em] text-[#ecece5] sm:left-auto sm:right-5 sm:w-[360px]"
            >
              <span>{removedItem.name} removed.</span>
              <button
                className="min-h-11 border-b border-white/55"
                type="button"
                onClick={() => {
                  restoreCartItem(removedItem);
                  setRemovedItem(null);
                }}
              >
                Undo
              </button>
            </div>
          ) : null}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

function CartLine({
  availability,
  availabilityStatus,
  item,
  onQuantity,
  onRemove,
}: Readonly<{
  availability?: CartAvailability[string];
  availabilityStatus: "idle" | "loading" | "error";
  item: CartItem;
  onQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
}>) {
  const stock = availability?.stock ?? item.stock;
  const plusDisabled = typeof stock === "number" && item.quantity >= stock;

  return (
    <article className="grid grid-cols-[38%_1fr] gap-x-5 gap-y-5 border-b border-black/16 py-7 text-[13px] uppercase leading-[1.45] tracking-[0.06em] sm:grid-cols-[132px_1fr_auto] lg:grid-cols-[160px_1fr_auto]">
      <div className="relative aspect-[4/5] overflow-hidden border border-black/12 bg-[#d8d3c8]">
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

      <div className="grid min-w-0 gap-5 sm:grid-cols-[1fr_auto] sm:gap-6">
        <div>
          <h2 className="max-w-[240px] text-[15px] font-medium tracking-[0.03em] text-black">{item.name}</h2>
          <div className="mt-4 grid gap-2 text-[12px] text-black/68 sm:mt-5">
            <p>{item.color ?? "Black"} / Size {item.size ?? "M"}</p>
            {availabilityStatus === "loading" ? <p>Checking stock…</p> : null}
            {availabilityStatus === "error" ? <p>Stock will be verified at checkout.</p> : null}
            {availabilityStatus === "idle" && typeof stock === "number" ? (
              <p>{getAvailabilityLabel(stock)}</p>
            ) : null}
          </div>
          {availability?.message ? (
            <p className="mt-5 max-w-[240px] text-black/72">
              {availability.message}
            </p>
          ) : null}
          <button
            className="mt-3 flex min-h-11 items-center border-b border-black/50 text-[12px] text-black/68 sm:mt-6"
            type="button"
            onClick={() => onRemove(item.id)}
          >
            Remove
          </button>
        </div>

        <div className="flex items-center gap-3 border-t border-black/12 pt-4 text-[15px] sm:border-t-0 sm:pt-0 sm:justify-end">
          <button
            className="min-h-11 min-w-11"
            type="button"
            onClick={() => onQuantity(item.id, -1)}
            aria-label={`Remove one ${item.name}`}
          >
            -
          </button>
          <span className="min-w-6 text-center font-medium">{item.quantity}</span>
          <button
            className={`min-h-11 min-w-11 ${plusDisabled ? "text-black/24" : ""}`}
            type="button"
            onClick={() => onQuantity(item.id, 1)}
            aria-label={`Add one ${item.name}`}
            disabled={plusDisabled}
          >
            +
          </button>
        </div>
      </div>

      <p className="col-span-2 border-t border-black/12 pt-4 text-right text-[15px] font-medium sm:col-span-1 sm:border-t-0 sm:pt-0">${item.price * item.quantity}</p>
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
    <aside className="order-first h-fit border-y border-black/16 bg-[#dedfd9] py-6 text-[13px] uppercase tracking-[0.06em] sm:border sm:p-6 lg:order-none lg:sticky lg:top-[96px]">
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
      <div className="flex items-center justify-between py-6 text-[16px] font-medium text-black">
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
          <span aria-hidden="true">→</span>
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
