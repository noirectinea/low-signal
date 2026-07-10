import type { CartItem } from "@/data/products";

export type OrderPayloadItem = {
  product_id: string;
  quantity: number;
  variant_id: string;
};

export type OrderPayload = {
  customer: {
    email: string;
    name: string;
    phone?: string;
  };
  idempotency_key: string;
  items: OrderPayloadItem[];
  notes?: string;
  shipping: {
    address: string;
    city: string;
    country: string;
    postal_code?: string;
  };
};

export type OrderResponse = {
  duplicate?: boolean;
  error?: OrderError;
  ok: boolean;
  order?: {
    currency: string;
    id: string;
    order_number: string;
    status: string;
    subtotal: number;
    total: number;
  };
};

export type OrderError = {
  code: string;
  message: string;
  product_id?: string;
  size?: string;
  variant_id?: string;
};

type ResolvedCartResponse =
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
      error: OrderError;
      ok: false;
    };

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const maxCheckoutQuantity = 20;
const isDevelopment = process.env.NODE_ENV !== "production";

export class CheckoutPayloadError extends Error {
  code: string;
  productId?: string;
  size?: string;
  variantId?: string;

  constructor(error: OrderError) {
    super(error.message);
    this.name = "CheckoutPayloadError";
    this.code = error.code;
    this.productId = error.product_id;
    this.size = error.size;
    this.variantId = error.variant_id;
  }
}

export async function buildOrderPayloadFromCart({
  formData,
  idempotencyKey,
  items,
}: {
  formData: FormData;
  idempotencyKey: string;
  items: CartItem[];
}): Promise<OrderPayload> {
  if (!items.length) {
    throw new CheckoutPayloadError({
      code: "empty_cart",
      message: "Your cart is empty.",
    });
  }

  const customer = buildCustomer(formData);
  const shipping = buildShipping(formData);
  logCheckoutDebug("cart_before_conversion", items);
  const cartItems = items.map(normalizeCartItem);
  logCheckoutDebug("cart_after_normalize", cartItems);
  const invalidQuantityItem = cartItems.find(
    (item) =>
      !Number.isInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > maxCheckoutQuantity,
  );

  if (invalidQuantityItem) {
    throw new CheckoutPayloadError({
      code: "invalid_quantity",
      message: `Quantity must be between 1 and ${maxCheckoutQuantity}.`,
      product_id: invalidQuantityItem.product_id,
      size: invalidQuantityItem.size,
    });
  }

  const resolvedItems = await resolveCartVariants(cartItems);
  const unavailableItem = resolvedItems.find((item) => (item.stock ?? 0) <= 0);

  if (unavailableItem) {
    throw new CheckoutPayloadError({
      code: "insufficient_stock",
      message: "Selected size is sold out.",
      product_id: unavailableItem.product_id,
      size: unavailableItem.size,
      variant_id: unavailableItem.variant_id,
    });
  }

  const overstockItem = resolvedItems.find(
    (item) => item.quantity > (item.stock ?? item.quantity),
  );

  if (overstockItem) {
    throw new CheckoutPayloadError({
      code: "insufficient_stock",
      message: `Only ${overstockItem.stock} available for selected size.`,
      product_id: overstockItem.product_id,
      size: overstockItem.size,
      variant_id: overstockItem.variant_id,
    });
  }

  const payload = {
    customer,
    idempotency_key: idempotencyKey,
    items: resolvedItems.map((item) => ({
      product_id: item.product_id,
      quantity: item.quantity,
      variant_id: item.variant_id,
    })),
    notes: cleanFormValue(formData.get("notes")) || undefined,
    shipping,
  };

  logCheckoutDebug("payload_to_api_orders", payload);

  return payload;
}

export function createCheckoutIdempotencyKey() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `checkout_${crypto.randomUUID()}`;
  }

  return `checkout_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

export function formatOrderError(error?: OrderError) {
  if (!error) {
    return "Could not place order.";
  }

  const itemHint = error.product_id
    ? ` (${error.product_id}${error.size ? ` / ${error.size}` : ""})`
    : "";

  switch (error.code) {
    case "empty_cart":
      return "Your cart is empty.";
    case "idempotency_key_conflict":
      return "This checkout attempt changed after it was submitted. Please try placing the order again.";
    case "insufficient_stock":
      return `One item no longer has enough stock${itemHint}. Adjust the quantity and try again.`;
    case "invalid_quantity":
      return "Quantity must be between 1 and 20.";
    case "unauthorized":
      return "Please log in to place an order.";
    case "product_inactive":
      return `One product is no longer available${itemHint}.`;
    case "validation_error":
      return error.message;
    case "variant_inactive":
      return `The selected size is no longer available${itemHint}.`;
    case "variant_not_found":
      return `We could not match one selected size to current inventory${itemHint}.`;
    case "database_error":
      return "The order could not be saved right now. Please try again.";
    default:
      return error.message || "Could not place order.";
  }
}

function baseProductId(cartItem: CartItem) {
  if (cartItem.productId) {
    return cartItem.productId;
  }

  return cartItem.id.replace(/-(xs|s|m|l|xl)$/i, "");
}

function buildCustomer(formData: FormData): OrderPayload["customer"] {
  const email = cleanFormValue(formData.get("email")).toLowerCase();
  const firstName = cleanFormValue(formData.get("firstName"));
  const lastName = cleanFormValue(formData.get("lastName"));
  const shippingName = cleanFormValue(formData.get("shippingName"));
  const name = shippingName || [firstName, lastName].filter(Boolean).join(" ");

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new CheckoutPayloadError({
      code: "validation_error",
      message: "Enter a valid email address.",
    });
  }

  if (!name) {
    throw new CheckoutPayloadError({
      code: "validation_error",
      message: "Enter a name for the order.",
    });
  }

  return {
    email,
    name,
    phone: cleanFormValue(formData.get("phone")) || undefined,
  };
}

function buildShipping(formData: FormData): OrderPayload["shipping"] {
  const addressLine1 = cleanFormValue(formData.get("addressLine1"));
  const addressLine2 = cleanFormValue(formData.get("addressLine2"));
  const city = cleanFormValue(formData.get("city"));
  const country = cleanFormValue(formData.get("country"));

  if (!addressLine1 || !city || !country) {
    throw new CheckoutPayloadError({
      code: "validation_error",
      message: "Enter shipping address, city, and country.",
    });
  }

  return {
    address: [addressLine1, addressLine2].filter(Boolean).join(", "),
    city,
    country,
    postal_code: cleanFormValue(formData.get("postalCode")) || undefined,
  };
}

function cleanFormValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeCartItem(cartItem: CartItem) {
  const productId = baseProductId(cartItem);
  const size = (cartItem.size ?? sizeFromCartItemId(cartItem.id)).toUpperCase();
  const variantId = cartItem.variantId?.trim();

  return {
    product_id: productId,
    quantity: Number(cartItem.quantity),
    size,
    variant_id: variantId && uuidPattern.test(variantId) ? variantId : undefined,
  };
}

async function resolveCartVariants(
  items: Array<{
    product_id: string;
    quantity: number;
    size: string;
    variant_id?: string;
  }>,
) {
  const response = await fetch("/api/cart/resolve", {
    body: JSON.stringify({
      items,
    }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });
  const result = (await response.json()) as ResolvedCartResponse;
  logCheckoutDebug("api_cart_resolve_response", {
    ok: response.ok,
    result,
    status: response.status,
  });

  if (!response.ok || !result.ok) {
    throw new CheckoutPayloadError(
      result.ok
        ? {
            code: "database_error",
            message: "Could not resolve cart inventory.",
          }
        : result.error,
    );
  }

  return result.items.map((item) => ({
    product_id: item.product_id,
    quantity: item.quantity,
    size: item.size,
    stock: item.stock,
    variant_id: item.variant_id,
  }));
}

function sizeFromCartItemId(cartItemId: string) {
  return cartItemId.match(/-(xs|s|m|l|xl)$/i)?.[1] ?? "";
}

function logCheckoutDebug(label: string, value: unknown) {
  if (!isDevelopment) {
    return;
  }

  console.log(`[checkout] ${label}`, value);
}
