import {
  isSupabaseServiceConfigured,
  supabaseRest,
} from "@/lib/supabase";

type ResolveCartItemInput = {
  product_id: string;
  size: string;
  variant_id?: string;
};

type ProductRow = {
  id: string;
  status: "active" | "archived" | "draft";
};

type SizeRow = {
  id: string;
  label: string;
};

type VariantRow = {
  id: string;
  product_id: string;
  size_id: string;
  status: "active" | "archived" | "draft";
};

type InventoryRow = {
  stock: number;
  variant_id: string;
};

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const isDevelopment = process.env.NODE_ENV !== "production";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return resolveError("validation_error", "Request body must be valid JSON.");
  }

  if (!isRecord(body) || !Array.isArray(body.items) || body.items.length === 0) {
    return resolveError("empty_cart", "Cart is empty.");
  }

  const items = body.items.map(normalizeItem);
  logResolveDebug("items_to_resolve", items);
  const invalidItem = items.find((item) => !item.product_id || !item.size);

  if (invalidItem) {
    return resolveError(
      "validation_error",
      "Every cart item must include product_id and size.",
    );
  }

  if (!isSupabaseServiceConfigured) {
    return resolveError(
      "database_error",
      "Supabase service role is not configured on the server.",
      500,
    );
  }

  const productIds = [...new Set(items.map((item) => item.product_id))];
  const sizeLabels = [...new Set(items.map((item) => item.size))];

  try {
    const [products, sizes, variants] = await Promise.all([
      supabaseRest<ProductRow[]>(
        `products?select=id,status&id=${postgrestIn(productIds)}`,
        { requireServiceRole: true },
      ),
      supabaseRest<SizeRow[]>(
        `sizes?select=id,label&label=${postgrestIn(sizeLabels)}`,
        { requireServiceRole: true },
      ),
      supabaseRest<VariantRow[]>(
        `product_variants?select=id,product_id,size_id,status&product_id=${postgrestIn(
          productIds,
        )}`,
        { requireServiceRole: true },
      ),
    ]);
    logResolveDebug("supabase_rows", {
      products,
      sizes,
      variants,
    });
    const productsById = new Map((products ?? []).map((row) => [row.id, row]));
    const sizesByLabel = new Map((sizes ?? []).map((row) => [row.label, row]));
    const variantsById = new Map((variants ?? []).map((row) => [row.id, row]));
    const variantsByProductAndSize = new Map(
      (variants ?? []).map((row) => [
        `${row.product_id}:${row.size_id}`,
        row,
      ]),
    );

    const variantIds = (variants ?? []).map((variant) => variant.id);
    const inventoryRows = variantIds.length
      ? ((await supabaseRest<InventoryRow[]>(
          `inventory?select=variant_id,stock&variant_id=${postgrestIn(
            variantIds,
          )}`,
          { requireServiceRole: true },
        )) ?? [])
      : [];
    const inventoryByVariantId = new Map(
      inventoryRows.map((inventory) => [inventory.variant_id, inventory]),
    );

    const resolved = [];

    for (const item of items) {
      const product = productsById.get(item.product_id);

      if (!product) {
        return resolveError(
          "product_not_found",
          "Product was not found.",
          400,
          item,
        );
      }

      if (product.status !== "active") {
        return resolveError(
          "product_inactive",
          "Product is not active.",
          400,
          item,
        );
      }

      const size = sizesByLabel.get(item.size);

      if (!size) {
        return resolveError(
          "variant_not_found",
          "Selected size is not available.",
          400,
          item,
        );
      }

      const directVariant = item.variant_id
        ? variantsById.get(item.variant_id)
        : undefined;
      const variant =
        directVariant?.product_id === item.product_id
          ? directVariant
          : variantsByProductAndSize.get(`${item.product_id}:${size.id}`);

      if (!variant || variant.product_id !== item.product_id) {
        return resolveError(
          "variant_not_found",
          "Variant was not found for selected product and size.",
          400,
          item,
        );
      }

      if (variant.size_id !== size.id) {
        return resolveError(
          "variant_not_found",
          "Variant does not match selected size.",
          400,
          item,
        );
      }

      if (variant.status !== "active") {
        return resolveError(
          "variant_inactive",
          "Variant is not active.",
          400,
          item,
        );
      }

      resolved.push({
        product_id: item.product_id,
        quantity: item.quantity,
        size: item.size,
        stock: inventoryByVariantId.get(variant.id)?.stock ?? 0,
        variant_id: variant.id,
      });
    }

    const responseBody = {
      items: resolved,
      ok: true,
    };

    logResolveDebug("resolved_items", responseBody);

    return Response.json(responseBody);
  } catch (error) {
    logResolveDebug("resolve_exception", {
      message: error instanceof Error ? error.message : "Unknown error",
    });

    return resolveError(
      "database_error",
      error instanceof Error ? error.message : "Could not resolve cart.",
      500,
    );
  }
}

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function normalizeItem(value: unknown): ResolveCartItemInput & {
  quantity: number;
} {
  const item = isRecord(value) ? value : {};
  const quantity = Number(item.quantity);
  const variantId = cleanString(item.variant_id);

  return {
    product_id: cleanString(item.product_id),
    quantity: Number.isInteger(quantity) && quantity > 0 ? quantity : 1,
    size: cleanString(item.size).toUpperCase(),
    variant_id: uuidPattern.test(variantId) ? variantId : undefined,
  };
}

function postgrestIn(values: string[]) {
  const quotedValues = values
    .map((value) => `"${value.replaceAll('"', '\\"')}"`)
    .join(",");

  return encodeURIComponent(`in.(${quotedValues})`);
}

function resolveError(
  code: string,
  message: string,
  status = 400,
  item?: ResolveCartItemInput,
) {
  const body = {
    debug: isDevelopment
      ? {
          backendCode: code,
          backendMessage: message,
          product_id: item?.product_id,
          size: item?.size,
          variant_id: item?.variant_id,
        }
      : undefined,
    error: {
      code,
      message,
      product_id: item?.product_id,
      size: item?.size,
      variant_id: item?.variant_id,
    },
      ok: false,
  };

  logResolveDebug("resolve_error", body);

  return Response.json(body, { status });
}

function logResolveDebug(label: string, value: unknown) {
  if (!isDevelopment) {
    return;
  }

  console.log(`[checkout:/api/cart/resolve] ${label}`, value);
}
