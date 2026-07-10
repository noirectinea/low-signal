import "server-only";

import { redirect } from "next/navigation";
import {
  getAccountSession,
  type AccountSession,
  type SupabaseAuthUser,
} from "@/lib/account";
import { isSupabaseServiceConfigured, supabaseRest } from "@/lib/supabase";

export const adminOrderStatuses = [
  "pending",
  "paid_demo",
  "processing",
  "packed",
  "shipped",
  "delivered",
  "cancelled",
  "refunded_demo",
] as const;

export const productStatuses = ["draft", "active", "archived"] as const;
export const productGenders = ["men", "women", "unisex"] as const;

export type AdminAccess =
  | {
      isAdmin: true;
      session: AccountSession;
    }
  | {
      isAdmin: false;
      session: AccountSession;
    };

export type AdminProduct = {
  category: string;
  collection_name: string;
  color?: string | null;
  currency: string;
  description: string;
  gender: string;
  id: string;
  images: AdminProductImage[];
  material?: string | null;
  name: string;
  price: number;
  primary_image?: string | null;
  slug: string;
  status: string;
  total_stock: number;
  variants: AdminVariant[];
};

export type AdminVariant = {
  color?: string | null;
  id: string;
  material?: string | null;
  product_id: string;
  size_id: string;
  size_label: string;
  status: string;
  stock: number;
};

export type AdminProductImage = {
  alt?: string | null;
  id: string;
  image_url: string;
  is_public: boolean;
  product_id: string;
  sort_order: number;
};

export type AdminOrder = {
  created_at: string;
  currency: string;
  customer_email?: string | null;
  customer_name?: string | null;
  id: string;
  item_count?: number;
  order_items?: AdminOrderItem[];
  order_number: string;
  phone?: string | null;
  shipping_address?: string | null;
  shipping_city?: string | null;
  shipping_country?: string | null;
  shipping_postal_code?: string | null;
  status: string;
  subtotal: number;
  total: number;
};

export type AdminOrderItem = {
  color_snapshot?: string | null;
  currency_snapshot: string;
  id: string;
  line_total_snapshot?: number | null;
  product_id: string;
  product_name_snapshot?: string | null;
  quantity: number;
  size_snapshot?: string | null;
  unit_price_snapshot?: number | null;
};

type ProductRow = Omit<
  AdminProduct,
  "images" | "total_stock" | "variants"
>;
type SizeRow = {
  id: string;
  label: string;
  sort_order: number;
};
type VariantRow = {
  color?: string | null;
  id: string;
  material?: string | null;
  product_id: string;
  size_id: string;
  status: string;
};
type InventoryRow = {
  reserved?: number;
  stock: number;
  variant_id: string;
};

export async function getAdminAccess(next = "/admin"): Promise<AdminAccess> {
  const session = await getAccountSession();

  if (!session) {
    redirect(`/account/login?next=${encodeURIComponent(next)}`);
  }

  return {
    isAdmin: await isAdminUser(session.user),
    session,
  };
}

export async function isAdminUser(user: SupabaseAuthUser) {
  if (hasAdminRole(user)) {
    return true;
  }

  if (!isSupabaseServiceConfigured) {
    return false;
  }

  const rows =
    (await supabaseRest<Array<{ user_id: string }>>(
      `admin_users?select=user_id&user_id=eq.${user.id}`,
      {
        requireServiceRole: true,
      },
    )) ?? [];

  return rows.length > 0;
}

export async function getAdminOverview() {
  const [products, orders] = await Promise.all([
    getAdminProducts(),
    getAdminOrders(),
  ]);
  const lowStockVariants = products.flatMap((product) =>
    product.variants.filter((variant) => variant.stock <= 2),
  );

  return {
    activeProducts: products.filter((product) => product.status === "active")
      .length,
    lowStockVariants: lowStockVariants.length,
    pendingOrders: orders.filter((order) => order.status === "pending").length,
    products: products.length,
    recentOrders: orders.slice(0, 6),
    totalOrders: orders.length,
  };
}

export async function getAdminProducts() {
  const [productRows, imageRows, variantRows, inventoryRows, sizeRows] =
    await Promise.all([
      supabaseRest<ProductRow[]>(
        "products?select=id,slug,name,description,category,gender,collection_name,price,currency,status,color,material,primary_image&order=sort_order.asc",
        { requireServiceRole: true },
      ),
      supabaseRest<AdminProductImage[]>(
        "product_images?select=id,product_id,image_url,alt,is_public,sort_order&order=sort_order.asc",
        { requireServiceRole: true },
      ),
      supabaseRest<VariantRow[]>(
        "product_variants?select=id,product_id,size_id,status,color,material",
        { requireServiceRole: true },
      ),
      supabaseRest<InventoryRow[]>("inventory?select=variant_id,stock,reserved", {
        requireServiceRole: true,
      }),
      getSizes(),
    ]);
  const sizesById = new Map((sizeRows ?? []).map((size) => [size.id, size]));
  const inventoryByVariantId = new Map(
    (inventoryRows ?? []).map((row) => [row.variant_id, row]),
  );
  const variantsByProductId = new Map<string, AdminVariant[]>();
  const imagesByProductId = new Map<string, AdminProductImage[]>();

  for (const image of imageRows ?? []) {
    imagesByProductId.set(image.product_id, [
      ...(imagesByProductId.get(image.product_id) ?? []),
      image,
    ]);
  }

  for (const variant of variantRows ?? []) {
    const size = sizesById.get(variant.size_id);
    const inventory = inventoryByVariantId.get(variant.id);
    const adminVariant = {
      ...variant,
      size_label: size?.label ?? "Size",
      stock: inventory?.stock ?? 0,
    };

    variantsByProductId.set(variant.product_id, [
      ...(variantsByProductId.get(variant.product_id) ?? []),
      adminVariant,
    ]);
  }

  return (productRows ?? []).map((product) => {
    const variants = variantsByProductId.get(product.id) ?? [];
    const images = imagesByProductId.get(product.id) ?? [];

    return {
      ...product,
      images,
      total_stock: variants.reduce((total, variant) => total + variant.stock, 0),
      variants,
    };
  });
}

export async function getAdminProduct(id: string) {
  const products = await getAdminProducts();

  return products.find((product) => product.id === id) ?? null;
}

export async function getSizes() {
  return (
    (await supabaseRest<SizeRow[]>("sizes?select=id,label,sort_order&order=sort_order.asc", {
      requireServiceRole: true,
    })) ?? []
  );
}

export async function getAdminOrders() {
  const orders =
    (await supabaseRest<AdminOrder[]>(
      "orders?select=id,order_number,customer_email,customer_name,status,total,subtotal,currency,created_at,order_items(id,quantity)&order=created_at.desc",
      {
        requireServiceRole: true,
      },
    )) ?? [];

  return orders.map((order) => ({
    ...order,
    item_count: (order.order_items ?? []).reduce(
      (total, item) => total + item.quantity,
      0,
    ),
  }));
}

export async function getAdminOrder(id: string) {
  const rows =
    (await supabaseRest<AdminOrder[]>(
      `orders?select=id,order_number,customer_email,customer_name,phone,shipping_country,shipping_city,shipping_address,shipping_postal_code,status,subtotal,total,currency,created_at,order_items(*)&id=eq.${id}`,
      {
        requireServiceRole: true,
      },
    )) ?? [];

  return rows[0] ?? null;
}

export async function saveProductFromForm(formData: FormData, existingId?: string) {
  const product = parseProductForm(formData, existingId);
  const existing = existingId ? await getAdminProduct(existingId) : null;

  if (!existingId) {
    const duplicate =
      (await supabaseRest<Array<{ id: string; slug: string }>>(
        `products?select=id,slug&or=(id.eq.${product.id},slug.eq.${product.slug})`,
        {
          requireServiceRole: true,
        },
      )) ?? [];

    if (duplicate.length) {
      throw new Error("Product slug must be unique.");
    }
  }

  const productBody = {
    category: product.category,
    collection_name: product.collection_name,
    color: product.color,
    currency: product.currency,
    description: product.description,
    gender: product.gender,
    id: product.id,
    is_active: product.status === "active",
    material: product.material,
    name: product.name,
    price: product.price,
    primary_image: product.images[0] ?? null,
    slug: product.slug,
    status: product.status,
    updated_at: new Date().toISOString(),
  };

  if (existing) {
    await supabaseRest(`products?id=eq.${existing.id}`, {
      body: productBody,
      method: "PATCH",
      requireServiceRole: true,
    });
  } else {
    await supabaseRest("products", {
      body: {
        ...productBody,
        sort_order: 999,
      },
      method: "POST",
      requireServiceRole: true,
    });
  }

  await replaceProductImages(product.id, product.name, product.images);
  await upsertProductVariants(product.id, product.color, product.material, formData);

  return product.id;
}

export async function updateOrderStatus(orderId: string, status: string) {
  if (!adminOrderStatuses.includes(status as (typeof adminOrderStatuses)[number])) {
    throw new Error("Invalid order status.");
  }

  await supabaseRest(`orders?id=eq.${orderId}`, {
    body: {
      status,
      updated_at: new Date().toISOString(),
    },
    method: "PATCH",
    requireServiceRole: true,
  });
}

function hasAdminRole(user: SupabaseAuthUser) {
  const roles = [
    user.app_metadata?.role,
    ...(user.app_metadata?.roles ?? []),
    user.user_metadata?.role,
    ...(user.user_metadata?.roles ?? []),
  ];

  return roles.includes("admin");
}

function parseProductForm(formData: FormData, existingId?: string) {
  const name = cleanFormValue(formData.get("name"));
  const slug = slugify(cleanFormValue(formData.get("slug")) || name);
  const price = Number(cleanFormValue(formData.get("price")));
  const status = cleanFormValue(formData.get("status")) || "draft";
  const gender = cleanFormValue(formData.get("gender")) || "unisex";
  const images = cleanFormValue(formData.get("images"))
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (!name || !slug) {
    throw new Error("Product name and slug are required.");
  }

  if (!Number.isInteger(price) || price < 0) {
    throw new Error("Product price must be a non-negative integer.");
  }

  if (!productStatuses.includes(status as (typeof productStatuses)[number])) {
    throw new Error("Invalid product status.");
  }

  if (!productGenders.includes(gender as (typeof productGenders)[number])) {
    throw new Error("Invalid product gender.");
  }

  return {
    category: cleanFormValue(formData.get("category")) || "Unsorted",
    collection_name:
      cleanFormValue(formData.get("collection_name")) || "Spring 2026",
    color: cleanFormValue(formData.get("color")) || null,
    currency: cleanFormValue(formData.get("currency")) || "USD",
    description: cleanFormValue(formData.get("description")),
    gender,
    id: existingId ?? slug,
    images,
    material: cleanFormValue(formData.get("material")) || null,
    name,
    price,
    slug,
    status,
  };
}

async function replaceProductImages(
  productId: string,
  productName: string,
  imageUrls: string[],
) {
  await supabaseRest(`product_images?product_id=eq.${productId}`, {
    method: "DELETE",
    requireServiceRole: true,
  });

  if (!imageUrls.length) {
    return;
  }

  await supabaseRest("product_images", {
    body: imageUrls.map((imageUrl, index) => ({
      alt: productName,
      image_url: imageUrl,
      is_public: true,
      product_id: productId,
      sort_order: index,
    })),
    method: "POST",
    requireServiceRole: true,
  });
}

async function upsertProductVariants(
  productId: string,
  color: string | null,
  material: string | null,
  formData: FormData,
) {
  const sizes = await getSizes();
  const existing =
    (await supabaseRest<VariantRow[]>(
      `product_variants?select=id,product_id,size_id,status,color,material&product_id=eq.${productId}`,
      {
        requireServiceRole: true,
      },
    )) ?? [];
  const existingBySizeId = new Map(existing.map((row) => [row.size_id, row]));

  for (const size of sizes) {
    const stockValue = Number(
      cleanFormValue(formData.get(`stock_${size.id}`)) || "0",
    );
    const status =
      cleanFormValue(formData.get(`variant_status_${size.id}`)) || "active";

    if (!Number.isInteger(stockValue) || stockValue < 0) {
      throw new Error(`Stock for ${size.label} must be non-negative.`);
    }

    if (!productStatuses.includes(status as (typeof productStatuses)[number])) {
      throw new Error(`Invalid variant status for ${size.label}.`);
    }

    const variant = existingBySizeId.get(size.id);
    const body = {
      color,
      material,
      product_id: productId,
      size_id: size.id,
      status,
      updated_at: new Date().toISOString(),
    };
    let variantId = variant?.id;

    if (variantId) {
      await supabaseRest(`product_variants?id=eq.${variantId}`, {
        body,
        method: "PATCH",
        requireServiceRole: true,
      });
    } else {
      const inserted = await supabaseRest<VariantRow[]>("product_variants", {
        body,
        method: "POST",
        prefer: "return=representation",
        requireServiceRole: true,
      });
      variantId = inserted?.[0]?.id;
    }

    if (variantId) {
      await upsertInventory(variantId, stockValue);
    }
  }
}

async function upsertInventory(variantId: string, stock: number) {
  const existing =
    (await supabaseRest<InventoryRow[]>(
      `inventory?select=variant_id,stock&variant_id=eq.${variantId}`,
      {
        requireServiceRole: true,
      },
    )) ?? [];
  const body = {
    reserved: 0,
    stock,
    updated_at: new Date().toISOString(),
    variant_id: variantId,
  };

  if (existing[0]) {
    await supabaseRest(`inventory?variant_id=eq.${variantId}`, {
      body,
      method: "PATCH",
      requireServiceRole: true,
    });
    return;
  }

  await supabaseRest("inventory", {
    body,
    method: "POST",
    requireServiceRole: true,
  });
}

function cleanFormValue(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
