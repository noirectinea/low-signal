"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { MobileHomeHeader } from "@/components/MobileHomeHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  buildOrderPayloadFromCart,
  CheckoutPayloadError,
  createCheckoutIdempotencyKey,
  formatOrderError,
  type OrderResponse,
} from "@/lib/cart-order";
import { clearCart, useCart } from "@/lib/cart-store";
import { trackEcommerce } from "@/lib/analytics";

type CheckoutProfile = {
  default_address?: string | null;
  default_city?: string | null;
  default_country?: string | null;
  default_postal_code?: string | null;
  email: string;
  full_name?: string | null;
  phone?: string | null;
};

const checkoutDraftKey = "low-signal-checkout-draft";

export function CheckoutClient() {
  const router = useRouter();
  const { hydrated, items, subtotal } = useCart();
  const [profile, setProfile] = useState<CheckoutProfile | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">(
    "idle",
  );
  const [idempotencyKey, setIdempotencyKey] = useState(
    createCheckoutIdempotencyKey,
  );
  const [message, setMessage] = useState("");
  const [debugMessage, setDebugMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    let active = true;

    async function loadCheckoutState() {
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

    }

    void loadCheckoutState();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!hydrated || !items.length) return;

    trackEcommerce("begin_checkout", {
      currency: "USD",
      items: items.map((item) => ({
        item_id: item.productId ?? item.id,
        item_name: item.name,
        quantity: item.quantity,
      })),
      value: subtotal,
    });
  }, [hydrated, items, subtotal]);

  useEffect(() => {
    if (!hydrated || !items.length || !formRef.current) return;
    const draft = readCheckoutDraft();
    if (draft) restoreCheckoutDraft(formRef.current, draft);
  }, [hydrated, items.length, profile]);

  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");
    setDebugMessage("");

    const formData = new FormData(event.currentTarget);
    trackEcommerce("add_shipping_info", {
      delivery_method: formData.get("deliveryMethod"),
      value: subtotal,
    });
    trackEcommerce("add_payment_info", {
      payment_method: formData.get("paymentMethod"),
      value: subtotal,
    });
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

    clearCart();
    window.localStorage.removeItem(checkoutDraftKey);
    trackEcommerce("purchase", {
      currency: result.order.currency,
      transaction_id: result.order.order_number,
      value: result.order.total,
    });
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
      <MobileHomeHeader mode="paper" />

      <section className="checkout-shell mx-auto grid max-w-[1260px] gap-7 px-5 pb-12 pt-[82px] lg:grid-cols-[minmax(0,820px)_340px] lg:justify-between lg:gap-12 lg:px-12 lg:pb-16 lg:pt-[92px]">
        <div>
          <p className="text-[10px] uppercase tracking-[0.12em] text-black/58">
            Checkout
          </p>
          <h1 className="controlled-display-title mt-3 text-[36px] uppercase sm:text-[54px] lg:mt-4 lg:text-[58px]">
            Complete order
          </h1>

          {!hydrated ? (
            <div className="mt-8 border-y border-black/16 py-8 text-[9px] uppercase leading-[1.8] tracking-[0.16em] text-black/64">
              Preparing checkout…
            </div>
          ) : items.length ? (
            <>
              <div className="mt-4 lg:hidden">
                <OrderSummary items={items} subtotal={subtotal} />
              </div>
              <form
                className="checkout-form"
                onSubmit={submitOrder}
                onInput={(event) =>
                  saveCheckoutDraft(event.currentTarget)
                }
                ref={formRef}
              >
                {profile ? (
                  <p className="checkout-form-account text-[10px] uppercase leading-[1.5] tracking-[0.08em] text-black/54">
                    Using saved details / {profile.email}
                  </p>
                ) : (
                  <p className="checkout-form-account text-[10px] uppercase leading-[1.5] tracking-[0.08em] text-black/58">
                    <Link className="border-b border-black/50 pb-1 text-black" href="/account/login?next=%2Fcheckout">Sign in</Link>{" "}
                    or continue as guest.
                  </p>
                )}

                <section className="checkout-form-step">
                  <CheckoutStepHeading number="01" title="Contact" />
                  <div className="checkout-field-grid checkout-contact-grid">
                    <CheckoutField
                      autoComplete="email"
                      defaultValue={profile?.email ?? ""}
                      inputMode="email"
                      label="Email"
                      name="email"
                      required
                      spellCheck={false}
                      type="email"
                    />
                    <CheckoutField
                      autoComplete="tel"
                      defaultValue={profile?.phone ?? ""}
                      inputMode="tel"
                      label="Phone"
                      name="phone"
                      type="tel"
                    />
                  </div>
                </section>

                <section className="checkout-form-step">
                  <CheckoutStepHeading number="02" title="Shipping address" />
                  <div className="checkout-field-grid">
                    <CheckoutField
                      autoComplete="given-name"
                      defaultValue={splitName(profile?.full_name).firstName}
                      label="First name"
                      name="firstName"
                      required
                    />
                    <CheckoutField
                      autoComplete="family-name"
                      defaultValue={splitName(profile?.full_name).lastName}
                      label="Last name"
                      name="lastName"
                      required
                    />
                    <CheckoutField
                      autoComplete="street-address"
                      className="checkout-field-wide"
                      defaultValue={profile?.default_address ?? ""}
                      label="Address line 1"
                      name="addressLine1"
                      required
                    />
                    <CheckoutField
                      autoComplete="address-level2"
                      defaultValue={profile?.default_city ?? ""}
                      label="City"
                      name="city"
                      required
                    />
                    <CheckoutField
                      autoComplete="address-level1"
                      label="Region / optional"
                      name="region"
                    />
                    <CheckoutField
                      autoComplete="postal-code"
                      defaultValue={profile?.default_postal_code ?? ""}
                      label="Postal code"
                      name="postalCode"
                      required
                    />
                    <CheckoutField
                      autoComplete="country-name"
                      defaultValue={profile?.default_country ?? ""}
                      label="Country"
                      name="country"
                      required
                    />
                  </div>
                </section>

                <section className="checkout-form-step">
                  <CheckoutStepHeading number="03" title="Delivery method" />
                  <div className="checkout-choice-grid">
                    <CheckoutChoice
                      defaultChecked
                      detail="Tracked / calculated at checkout"
                      label="Standard delivery"
                      name="deliveryMethod"
                      value="standard"
                    />
                    <CheckoutChoice
                      detail="Priority / when available"
                      label="Express delivery"
                      name="deliveryMethod"
                      value="express"
                    />
                  </div>
                </section>

                <section className="checkout-form-step">
                  <CheckoutStepHeading number="04" title="Payment" />
                  <div className="checkout-payment-choice">
                    <CheckoutChoice
                      defaultChecked
                      detail="Order remains pending until payment is confirmed"
                      label="Payment on confirmation"
                      name="paymentMethod"
                      value="confirmation"
                    />
                  </div>

                  <label className="checkout-billing-row">
                    <input
                      className="accent-black"
                      defaultChecked
                      name="billingSameAsShipping"
                      type="checkbox"
                    />
                    <span>Use shipping address for billing</span>
                  </label>
                </section>

                <section className="checkout-form-step">
                  <CheckoutStepHeading number="05" title="Order note / optional" />
                  <CheckoutField
                    autoComplete="off"
                    label="Notes"
                    name="notes"
                  />
                </section>

                <button
                  className="checkout-submit add-to-cart-label w-full border border-black bg-[#171614] px-6 text-[12px] uppercase text-[#ecece5] transition-opacity duration-300 hover:opacity-82 disabled:cursor-not-allowed disabled:opacity-50 sm:w-fit"
                  disabled={status === "loading"}
                  type="submit"
                >
                  {status === "loading" ? "Saving order…" : "Place order →"}
                </button>

                {message ? (
                  <p
                    aria-live="polite"
                    className="text-[13px] uppercase leading-[1.5] tracking-[0.05em] text-black/72"
                  >
                    {message}
                  </p>
                ) : null}
                {debugMessage && process.env.NODE_ENV !== "production" ? (
                  <p className="text-[9px] uppercase leading-[1.7] tracking-[0.16em] text-black/42">
                    {debugMessage}
                  </p>
                ) : null}
              </form>
            </>
          ) : (
            <div className="mt-8 border-y border-black/16 py-8 text-[13px] uppercase leading-[1.5] tracking-[0.05em] text-black/72">
              Your cart is empty.{" "}
              <Link className="border-b border-black/50 pb-1" href="/collections">
                Return to collections
              </Link>
            </div>
          )}
        </div>

        <div className="hidden lg:block">
          <OrderSummary desktop items={items} subtotal={subtotal} />
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

function logCheckoutDebug(label: string, value: unknown) {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  console.log(`[checkout] ${label}`, value);
}

function CheckoutField({
  autoComplete,
  className = "",
  defaultValue = "",
  inputMode,
  label,
  name,
  required,
  spellCheck,
  type = "text",
}: Readonly<{
  autoComplete?: string;
  className?: string;
  defaultValue?: string;
  inputMode?: "email" | "numeric" | "search" | "tel" | "text" | "url";
  label: string;
  name: string;
  required?: boolean;
  spellCheck?: boolean;
  type?: string;
}>) {
  const [error, setError] = useState("");
  const errorId = `${name}-error`;

  return (
    <label className={`checkout-field ${className}`}>
      <span>{label}{required ? " *" : ""}</span>
      <input
        aria-describedby={error ? errorId : undefined}
        aria-invalid={Boolean(error)}
        autoComplete={autoComplete}
        className="checkout-input"
        defaultValue={defaultValue}
        inputMode={inputMode}
        name={name}
        onInput={() => setError("")}
        onInvalid={(event) => {
          setError(
            event.currentTarget.validity.valueMissing
              ? `${label} is required.`
              : `Enter a valid ${label.toLowerCase()}.`,
          );
        }}
        required={required}
        spellCheck={spellCheck}
        type={type}
      />
      {error ? (
        <span className="text-[12px] normal-case tracking-normal text-black/76" id={errorId}>
          {error}
        </span>
      ) : null}
    </label>
  );
}

function CheckoutStepHeading({
  number,
  title,
}: {
  number: string;
  title: string;
}) {
  return (
    <div className="checkout-step-heading">
      <span className="text-black/42">{number}</span>
      <h2>{title}</h2>
    </div>
  );
}

function CheckoutChoice({
  defaultChecked = false,
  detail,
  label,
  name,
  value,
}: {
  defaultChecked?: boolean;
  detail: string;
  label: string;
  name: string;
  value: string;
}) {
  return (
    <label className="checkout-choice">
      <input
        className="mt-1 accent-black"
        defaultChecked={defaultChecked}
        name={name}
        required
        type="radio"
        value={value}
      />
      <span className="grid gap-2 text-[13px] uppercase tracking-[0.06em]">
        <span>{label}</span>
        <span className="text-[12px] leading-[1.45] tracking-[0.03em] text-black/68">{detail}</span>
      </span>
    </label>
  );
}

function OrderSummary({
  desktop = false,
  items,
  subtotal,
}: Readonly<{
  desktop?: boolean;
  items: ReturnType<typeof useCart>["items"];
  subtotal: number;
}>) {
  return (
    <details
      className="h-fit border border-black/16 p-4 text-[11px] uppercase tracking-[0.05em] lg:sticky lg:top-[96px] lg:p-5"
      open={desktop}
    >
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between border-b border-black/16 text-black/76">
        <span>Order summary / {items.length} pieces</span>
        <span>{desktop ? `$${subtotal}` : "+"}</span>
      </summary>
      <div className="divide-y divide-black/12">
        {items.map((item) => (
          <div className="grid gap-1 py-3" key={item.id}>
            <div className="flex items-center justify-between gap-5">
              <span>{item.name}</span>
              <span>× {item.quantity}</span>
            </div>
            <p className="text-[10px] text-black/58">Size {item.size ?? "M"}</p>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t border-black/16 pt-4 text-[15px] text-black">
        <span>Total</span>
        <span>${subtotal}</span>
      </div>
    </details>
  );
}

type CheckoutDraft = Record<
  string,
  {
    checked?: boolean;
    value: string;
  }
>;

function saveCheckoutDraft(form: HTMLFormElement) {
  const draft = Array.from(
    form.elements,
  ).reduce<CheckoutDraft>((values, element) => {
    if (
      !(element instanceof HTMLInputElement) &&
      !(element instanceof HTMLSelectElement) &&
      !(element instanceof HTMLTextAreaElement)
    ) {
      return values;
    }
    if (!element.name) return values;
    values[element.name] = {
      checked:
        element instanceof HTMLInputElement
          ? element.checked
          : undefined,
      value: element.value,
    };
    return values;
  }, {});

  window.localStorage.setItem(checkoutDraftKey, JSON.stringify(draft));
}

function readCheckoutDraft(): CheckoutDraft | null {
  try {
    return JSON.parse(
      window.localStorage.getItem(checkoutDraftKey) ?? "null",
    ) as CheckoutDraft | null;
  } catch {
    return null;
  }
}

function restoreCheckoutDraft(form: HTMLFormElement, draft: CheckoutDraft) {
  for (const [name, saved] of Object.entries(draft)) {
    const elements = Array.from(
      form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
        `[name="${CSS.escape(name)}"]`,
      ),
    );
    for (const element of elements) {
      if (
        element instanceof HTMLInputElement &&
        (element.type === "radio" || element.type === "checkbox")
      ) {
        element.checked =
          element.type === "radio"
            ? element.value === saved.value && Boolean(saved.checked)
            : Boolean(saved.checked);
      } else {
        element.value = saved.value;
      }
    }
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
