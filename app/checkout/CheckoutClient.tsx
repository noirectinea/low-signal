"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { LogoMark } from "@/components/LogoMark";
import { cartStorageKey, type CartItem } from "@/data/products";
import {
  buildOrderPayloadFromCart,
  CheckoutPayloadError,
  createCheckoutIdempotencyKey,
  formatOrderError,
  type OrderResponse,
} from "@/lib/cart-order";

type CheckoutProfile = {
  default_address?: string | null;
  default_city?: string | null;
  default_country?: string | null;
  default_postal_code?: string | null;
  email: string;
  full_name?: string | null;
  phone?: string | null;
};

export function CheckoutClient() {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [items, setItems] = useState<CartItem[]>([]);
  const [profile, setProfile] = useState<CheckoutProfile | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">(
    "idle",
  );
  const [idempotencyKey, setIdempotencyKey] = useState(
    createCheckoutIdempotencyKey,
  );
  const [message, setMessage] = useState("");
  const [debugMessage, setDebugMessage] = useState("");

  useEffect(() => {
    let active = true;

    async function loadCheckoutState() {
      const storedItems = readCart();

      try {
        const response = await fetch("/api/account/me");
        const result = (await response.json()) as {
          authenticated?: boolean;
          profile?: CheckoutProfile;
        };

        if (active && result.authenticated && result.profile) {
          setProfile(result.profile);
        }
      } catch {
        if (active) {
          setProfile(null);
        }
      }

      if (active) {
        setItems(storedItems);
        setHydrated(true);
      }
    }

    void loadCheckoutState();

    return () => {
      active = false;
    };
  }, []);

  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    setDebugMessage("");

    const formData = new FormData(event.currentTarget);
    let payload;

    try {
      payload = await buildOrderPayloadFromCart({
        formData,
        idempotencyKey,
        items,
      });
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof CheckoutPayloadError
          ? formatOrderError({
              code: error.code,
              message: error.message,
              product_id: error.productId,
              size: error.size,
              variant_id: error.variantId,
            })
          : "Could not prepare checkout.",
      );
      setDebugMessage(
        error instanceof CheckoutPayloadError
          ? `${error.code}: ${error.message}`
          : "",
      );
      return;
    }

    logCheckoutDebug("payload_to_api_orders", payload);

    let response: Response;
    let result: OrderResponse;

    try {
      response = await fetch("/api/orders", {
        body: JSON.stringify(payload),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
      result = (await response.json()) as OrderResponse;
      logCheckoutDebug("api_orders_response", {
        ok: response.ok,
        result,
        status: response.status,
      });
    } catch {
      setStatus("error");
      setMessage("The order could not be saved right now. Please try again.");
      setDebugMessage("network_error: Could not reach /api/orders.");
      return;
    }

    if (!response.ok || !result.ok || !result.order) {
      setStatus("error");
      setMessage(formatOrderError(result.error));
      setDebugMessage(
        result.error
          ? `${result.error.code}: ${result.error.message}`
          : "unknown_error: /api/orders returned no error body.",
      );

      if (result.error?.code === "idempotency_key_conflict") {
        setIdempotencyKey(createCheckoutIdempotencyKey());
      }

      return;
    }

    window.localStorage.removeItem(cartStorageKey);
    window.dispatchEvent(new Event("low-signal-cart"));
    setItems([]);
    setIdempotencyKey(createCheckoutIdempotencyKey());

    const params = new URLSearchParams({
      currency: result.order.currency,
      order: result.order.order_number,
      status: result.order.status,
      subtotal: String(result.order.subtotal),
      total: String(result.order.total),
    });

    router.push(`/checkout/success?${params.toString()}`);
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#e5e6e1] text-[#121211]">
      <CheckoutNav />

      <section className="mx-auto grid max-w-[1320px] gap-10 px-5 pb-16 pt-[104px] lg:grid-cols-[1fr_380px] lg:px-12">
        <div>
          <p className="text-[9px] uppercase tracking-[0.16em] text-black/64">
            Checkout / Spring 2026
          </p>
          <h1 className="controlled-display-title mt-8 text-[52px] uppercase sm:text-[74px]">
            Complete order
          </h1>

          {!hydrated ? (
            <div className="mt-10 border-y border-black/16 py-10 text-[9px] uppercase leading-[1.8] tracking-[0.16em] text-black/64">
              Preparing checkout.
            </div>
          ) : items.length ? (
            <form
              className="mt-10 grid gap-7 border-t border-black/16 pt-8"
              onSubmit={submitOrder}
            >
              {profile ? (
                <p className="text-[9px] uppercase leading-[1.7] tracking-[0.16em] text-black/54">
                  Account details loaded for {profile.email}.
                </p>
              ) : null}
              <CheckoutField
                defaultValue={profile?.email ?? ""}
                label="Email"
                name="email"
                required
                type="email"
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <CheckoutField
                  defaultValue={splitName(profile?.full_name).firstName}
                  label="First name"
                  name="firstName"
                />
                <CheckoutField
                  defaultValue={splitName(profile?.full_name).lastName}
                  label="Last name"
                  name="lastName"
                />
              </div>
              <CheckoutField
                defaultValue={profile?.phone ?? ""}
                label="Phone"
                name="phone"
              />
              <CheckoutField
                defaultValue={profile?.full_name ?? ""}
                label="Shipping name"
                name="shippingName"
              />
              <CheckoutField
                defaultValue={profile?.default_address ?? ""}
                label="Address line 1"
                name="addressLine1"
                required
              />
              <CheckoutField label="Address line 2" name="addressLine2" />
              <div className="grid gap-5 sm:grid-cols-2">
                <CheckoutField
                  defaultValue={profile?.default_city ?? ""}
                  label="City"
                  name="city"
                  required
                />
                <CheckoutField label="Region" name="region" />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <CheckoutField
                  defaultValue={profile?.default_postal_code ?? ""}
                  label="Postal code"
                  name="postalCode"
                />
                <CheckoutField
                  defaultValue={profile?.default_country ?? ""}
                  label="Country"
                  name="country"
                  required
                />
              </div>
              <CheckoutField label="Notes" name="notes" />

              <button
                className="add-to-cart-label mt-3 w-full border border-black bg-[#171614] px-6 py-5 text-[9px] uppercase text-[#ecece5] transition-opacity duration-300 hover:opacity-82 disabled:cursor-not-allowed disabled:opacity-50 sm:w-fit"
                disabled={status === "loading"}
                type="submit"
              >
                {status === "loading" ? "Saving order..." : "Place order ->"}
              </button>

              {message ? (
                <p className="text-[9px] uppercase tracking-[0.16em] text-black/64">
                  {message}
                </p>
              ) : null}
              {debugMessage && process.env.NODE_ENV !== "production" ? (
                <p className="text-[9px] uppercase leading-[1.7] tracking-[0.16em] text-black/42">
                  {debugMessage}
                </p>
              ) : null}
            </form>
          ) : (
            <div className="mt-10 border-y border-black/16 py-10 text-[9px] uppercase leading-[1.8] tracking-[0.16em] text-black/64">
              Your cart is empty.{" "}
              <Link className="border-b border-black/50 pb-1" href="/collections">
                Return to collections
              </Link>
            </div>
          )}
        </div>

        <aside className="h-fit border border-black/16 p-6 text-[9px] uppercase tracking-[0.16em] lg:sticky lg:top-[96px]">
          <p className="border-b border-black/16 pb-5 text-black/72">
            Order summary
          </p>
          <div className="divide-y divide-black/12">
            {items.map((item) => (
              <div className="grid gap-2 py-5" key={item.id}>
                <div className="flex items-center justify-between gap-5">
                  <span>{item.name}</span>
                  <span>Qty {item.quantity}</span>
                </div>
                <p className="text-black/58">
                  {item.size ?? "M"} / verified at order
                </p>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between border-t border-black/16 pt-5 text-black">
            <span>Total</span>
            <span>Verified after order</span>
          </div>
        </aside>
      </section>
    </main>
  );
}

function logCheckoutDebug(label: string, value: unknown) {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  console.log(`[checkout] ${label}`, value);
}

function CheckoutNav() {
  return (
    <nav className="fixed left-0 right-0 top-0 z-30 grid min-h-[64px] grid-cols-[1fr_auto] items-start gap-6 border-b border-black/16 bg-[#e3e3dc]/92 px-5 py-5 text-[9px] uppercase tracking-[0.16em] text-[#141311] backdrop-blur-sm md:grid-cols-[1fr_auto_1fr] lg:px-12">
      <LogoMark />

      <div className="hidden justify-center gap-14 md:flex">
        <Link href="/">Home</Link>
        <Link href="/collections">Collections</Link>
        <Link href="/lookbook">Lookbook</Link>
        <Link href="/about">About</Link>
      </div>

      <div className="flex justify-end">
        <Link href="/cart">Cart</Link>
      </div>
    </nav>
  );
}

function CheckoutField({
  defaultValue = "",
  label,
  name,
  required,
  type = "text",
}: Readonly<{
  defaultValue?: string;
  label: string;
  name: string;
  required?: boolean;
  type?: string;
}>) {
  return (
    <label className="grid gap-3 border-b border-black/16 pb-3 text-[9px] uppercase tracking-[0.16em] text-black/64 focus-within:border-black/42">
      <span>{label}</span>
      <input
        className="bg-transparent py-1 text-[12px] uppercase tracking-[0.12em] text-black outline-none placeholder:text-black/42"
        defaultValue={defaultValue}
        name={name}
        required={required}
        type={type}
      />
    </label>
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

function splitName(value?: string | null) {
  const parts = (value ?? "").trim().split(/\s+/).filter(Boolean);
  const [firstName = "", ...rest] = parts;

  return {
    firstName,
    lastName: rest.join(" "),
  };
}
