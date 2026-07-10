import {
  isSupabaseServiceConfigured,
  supabaseRest,
} from "@/lib/supabase";
import { getAccountSession, linkOrderToCustomer } from "@/lib/account";

type CheckoutItemInput = {
  // products.id is the stable text product identifier used by the catalog.
  // In the current seed data it matches the slug, but this field is not a slug lookup.
  product_id: string;
  quantity: number;
  // product_variants.id is always a UUID and must belong to product_id.
  variant_id: string;
};

type CheckoutPayload = {
  customer: {
    email: string;
    name: string;
    phone?: string;
  };
  idempotency_key: string;
  items: CheckoutItemInput[];
  notes?: string;
  shipping: {
    address: string;
    city: string;
    country: string;
    postal_code?: string;
  };
};

type OrderRpcSuccess = {
  duplicate: boolean;
  ok: true;
  order: {
    currency: string;
    id: string;
    order_number: string;
    status: string;
    subtotal: number;
    total: number;
  };
};

type OrderRpcError = {
  error: {
    code: OrderErrorCode;
    message: string;
    product_id?: string;
    variant_id?: string;
  };
  ok: false;
};

type OrderRpcResponse = OrderRpcSuccess | OrderRpcError;

type OrderErrorCode =
  | "database_error"
  | "duplicate_submit"
  | "empty_cart"
  | "idempotency_key_conflict"
  | "insufficient_stock"
  | "invalid_quantity"
  | "product_inactive"
  | "product_not_found"
  | "unauthorized"
  | "validation_error"
  | "variant_inactive"
  | "variant_not_found";

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const maxCheckoutQuantity = 20;
const isDevelopment = process.env.NODE_ENV !== "production";

export async function POST(request: Request) {
  const session = await getAccountSession();

  if (!session) {
    return orderError("unauthorized", "Please log in to place an order.", 401);
  }

  let rawPayload: unknown;

  try {
    rawPayload = await request.json();
  } catch {
    return orderError("validation_error", "Request body must be valid JSON.", 400);
  }

  const validation = validateCheckoutPayload(rawPayload);

  if (!validation.ok) {
    logOrderDebug("validation_failed", validation);

    return orderError(validation.code, validation.message, 400);
  }

  if (!isSupabaseServiceConfigured) {
    return orderError(
      "database_error",
      "Supabase service role is not configured on the server.",
      500,
    );
  }

  try {
    logOrderDebug("payload_to_rpc", validation.payload);

    const rpcResult = await supabaseRest<OrderRpcResponse>(
      "rpc/create_order_from_checkout",
      {
        body: {
          p_payload: validation.payload,
        },
        method: "POST",
        requireServiceRole: true,
      },
    );

    logOrderDebug("rpc_response", rpcResult);

    if (!rpcResult) {
      return orderError("database_error", "Order RPC returned no response.", 500);
    }

    if (!rpcResult.ok) {
      logOrderDebug("rpc_error", rpcResult.error);

      return Response.json(
        buildOrderErrorBody(rpcResult.error),
        { status: statusForOrderError(rpcResult.error.code) },
      );
    }

    await linkOrderToCustomer({
      checkoutCustomer: validation.payload.customer,
      orderId: rpcResult.order.id,
      shipping: validation.payload.shipping,
      user: session.user,
    });
    logOrderDebug("linked_order_to_customer", {
      orderId: rpcResult.order.id,
      userId: session.user.id,
    });

    return Response.json({
      duplicate: rpcResult.duplicate,
      ok: true,
      order: rpcResult.order,
    });
  } catch (error) {
    logOrderDebug("rpc_exception", {
      message: error instanceof Error ? error.message : "Unknown error",
    });

    return orderError(
      "database_error",
      error instanceof Error ? error.message : "Could not create order.",
      500,
    );
  }
}

function validateCheckoutPayload(rawPayload: unknown):
  | {
      ok: true;
      payload: CheckoutPayload;
    }
  | {
      code: OrderErrorCode;
      message: string;
      ok: false;
    } {
  if (!isRecord(rawPayload)) {
    return {
      code: "validation_error",
      message: "Request body must be an object.",
      ok: false,
    };
  }

  const idempotencyKey = cleanString(rawPayload.idempotency_key);

  if (!idempotencyKey) {
    return {
      code: "duplicate_submit",
      message: "idempotency_key is required.",
      ok: false,
    };
  }

  if (!Array.isArray(rawPayload.items) || rawPayload.items.length === 0) {
    return {
      code: "empty_cart",
      message: "Cart is empty.",
      ok: false,
    };
  }

  const items: CheckoutItemInput[] = [];

  for (const item of rawPayload.items) {
    if (!isRecord(item)) {
      return {
        code: "product_not_found",
        message: "Every item must be an object.",
        ok: false,
      };
    }

    const productId = cleanString(item.product_id);
    const variantId = cleanString(item.variant_id);
    const quantity = Number(item.quantity);

    if (!productId) {
      return {
        code: "product_not_found",
        message: "Every item must include product_id.",
        ok: false,
      };
    }

    if (!variantId || !uuidPattern.test(variantId)) {
      return {
        code: "variant_not_found",
        message: "Every item must include a valid variant_id.",
        ok: false,
      };
    }

    if (
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > maxCheckoutQuantity
    ) {
      return {
        code: "invalid_quantity",
        message: `Every item quantity must be a positive integer no greater than ${maxCheckoutQuantity}.`,
        ok: false,
      };
    }

    items.push({
      product_id: productId,
      quantity,
      variant_id: variantId,
    });
  }

  const customer = isRecord(rawPayload.customer) ? rawPayload.customer : {};
  const shipping = isRecord(rawPayload.shipping) ? rawPayload.shipping : {};
  const email = cleanString(customer.email).toLowerCase();
  const name = cleanString(customer.name);
  const address = cleanString(shipping.address);
  const city = cleanString(shipping.city);
  const country = cleanString(shipping.country);

  if (!emailPattern.test(email)) {
    return {
        code: "validation_error",
      message: "A valid customer email is required.",
      ok: false,
    };
  }

  if (!name || !address || !city || !country) {
    return {
      code: "validation_error",
      message: "Customer name and shipping country, city, and address are required.",
      ok: false,
    };
  }

  return {
    ok: true,
    payload: {
      customer: {
        email,
        name,
        phone: cleanString(customer.phone) || undefined,
      },
      idempotency_key: idempotencyKey,
      items,
      notes: cleanString(rawPayload.notes) || undefined,
      shipping: {
        address,
        city,
        country,
        postal_code: cleanString(shipping.postal_code) || undefined,
      },
    },
  };
}

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function orderError(
  code: OrderErrorCode,
  message: string,
  status = statusForOrderError(code),
) {
  return Response.json(
    buildOrderErrorBody({
      code,
      message,
    }),
    { status },
  );
}

function buildOrderErrorBody(error: {
  code: OrderErrorCode;
  message: string;
  product_id?: string;
  variant_id?: string;
}) {
  const productionMessage =
    error.code === "database_error"
      ? "The order could not be saved right now. Please try again."
      : error.message;

  return {
    debug: isDevelopment
      ? {
          backendCode: error.code,
          backendMessage: error.message,
          product_id: error.product_id,
          variant_id: error.variant_id,
        }
      : undefined,
    error: {
      code: error.code,
      message: isDevelopment ? error.message : productionMessage,
      product_id: error.product_id,
      variant_id: error.variant_id,
    },
    ok: false,
  };
}

function logOrderDebug(label: string, value: unknown) {
  if (!isDevelopment) {
    return;
  }

  console.log(`[checkout:/api/orders] ${label}`, value);
}

function statusForOrderError(code: OrderErrorCode) {
  if (code === "database_error") {
    return 500;
  }

  if (code === "unauthorized") {
    return 401;
  }

  if (code === "duplicate_submit") {
    return 409;
  }

  if (code === "idempotency_key_conflict") {
    return 409;
  }

  if (code === "insufficient_stock") {
    return 409;
  }

  return 400;
}
