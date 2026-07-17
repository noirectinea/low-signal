"use client";

export type EcommerceEvent =
  | "add_payment_info"
  | "add_shipping_info"
  | "add_to_cart"
  | "begin_checkout"
  | "filter"
  | "purchase"
  | "remove_from_cart"
  | "search"
  | "select_item"
  | "view_item";

export function trackEcommerce(
  event: EcommerceEvent,
  detail: Record<string, unknown> = {},
) {
  if (typeof window === "undefined") return;

  const payload = {
    event,
    timestamp: Date.now(),
    ...detail,
  };
  const analyticsWindow = window as Window & {
    dataLayer?: Array<Record<string, unknown>>;
  };

  analyticsWindow.dataLayer ??= [];
  analyticsWindow.dataLayer.push(payload);
  window.dispatchEvent(
    new CustomEvent("low-signal-analytics", { detail: payload }),
  );
}
