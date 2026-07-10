import type { Product } from "@/data/products";
import { getProducts } from "@/lib/shop";
import { isSupabaseConfigured, supabaseRest } from "@/lib/supabase";

export async function GET(request: Request) {
  const authError = requireAdmin(request);

  if (authError) {
    return authError;
  }

  return Response.json({
    mode: isSupabaseConfigured ? "supabase" : "local",
    products: await getProducts(),
  });
}

export async function POST(request: Request) {
  const authError = requireAdmin(request);

  if (authError) {
    return authError;
  }

  if (!isSupabaseConfigured) {
    return Response.json(
      { error: "Supabase is not configured for product writes." },
      { status: 501 },
    );
  }

  const product = (await request.json()) as Product;
  const row = await supabaseRest("products", {
    body: mapProductToRow(product),
    method: "POST",
    prefer: "return=representation",
    requireServiceRole: true,
  });

  return Response.json({ product: row });
}

export function requireAdmin(request: Request) {
  const adminToken = process.env.ADMIN_TOKEN;

  if (!adminToken) {
    return Response.json(
      { error: "Admin API token is not configured." },
      { status: 403 },
    );
  }

  if (request.headers.get("x-admin-token") !== adminToken) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  return null;
}

export function mapProductToRow(product: Partial<Product>) {
  return {
    category: product.category,
    color: product.color,
    default_size: product.size,
    description: product.description,
    gender: product.gender,
    id: product.id,
    collection_name: "Spring 2026",
    currency: "USD",
    is_active: true,
    material: product.materials,
    name: product.name,
    object_position: product.objectPosition,
    price: product.price,
    primary_image: product.image,
    slug: product.slug,
    status: "active",
  };
}
