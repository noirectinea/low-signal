import { products } from "@/data/products";
import { isSupabaseServiceConfigured, supabaseRest } from "@/lib/supabase";
import { requireAdmin } from "../products/route";

const seedSizes = ["XS", "S", "M", "L", "XL"] as const;
const testProductIds = ["field-jacket", "washed-longsleeve"] as const;

type SizeRow = {
  id: string;
  label: (typeof seedSizes)[number];
};

type VariantRow = {
  id: string;
  product_id: string;
  size_id: string;
};

type ProductImageRow = {
  id: string;
};

type InventoryRow = {
  stock: number;
  variant_id: string;
};

type SeedTestItems = Record<
  (typeof testProductIds)[number],
  {
    L: {
      stock: number | null;
      variant_id: string | null;
    };
  }
>;

export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const authError = requireAdmin(request);

  if (authError) {
    return authError;
  }

  return seedCatalog();
}

export async function POST(request: Request) {
  const authError = requireAdmin(request);

  if (authError) {
    return authError;
  }

  return seedCatalog();
}

async function seedCatalog() {
  if (!isSupabaseServiceConfigured) {
    return Response.json(
      { error: "Supabase service role env variables are not configured." },
      { status: 500 },
    );
  }

  try {
    const sizeRows = await supabaseRest<SizeRow[]>("sizes?on_conflict=label", {
      body: seedSizes.map((size, index) => ({
        label: size,
        sort_order: (index + 1) * 10,
      })),
      method: "POST",
      prefer: "resolution=merge-duplicates,return=representation",
      requireServiceRole: true,
    });
    const sizesByLabel = new Map(
      (sizeRows ?? []).map((size) => [size.label, size]),
    );
    let inventoryCount = 0;
    let variantCount = 0;

    await supabaseRest("products?on_conflict=id", {
      body: products.map((product, index) => ({
        category: product.category,
        color: product.color,
        collection_name: "Spring 2026",
        currency: "USD",
        default_size: product.size,
        description: product.description,
        gender: product.gender,
        id: product.id,
        is_active: true,
        material: product.materials,
        name: product.name,
        object_position: product.objectPosition,
        price: product.price,
        primary_image: product.image,
        slug: product.slug,
        sort_order: index + 1,
        status: "active",
      })),
      method: "POST",
      prefer: "resolution=merge-duplicates",
      requireServiceRole: true,
    });

    for (const product of products) {
      await upsertProductImage(product);

      const variantRows = (
        await Promise.all(
          seedSizes.map(async (size) => {
            const sizeRow = sizesByLabel.get(size);

            if (!sizeRow) {
              return null;
            }

            return upsertProductVariant(product, sizeRow);
          }),
        )
      ).filter((variant): variant is VariantRow => Boolean(variant));
      await Promise.all(
        variantRows.map((variant) =>
          upsertInventory(
            variant.id,
            getSeedStock(
              seedSizes.find(
                (size) => sizesByLabel.get(size)?.id === variant.size_id,
              ) ?? "M",
              product.size,
            ),
          ),
        ),
      );
      inventoryCount += variantRows.length;
      variantCount += variantRows.length;
    }

    return Response.json({
      ok: true,
      message: "Seed completed",
      inventory: inventoryCount,
      products: products.length,
      test_items: await getSeedTestItems(),
      variants: variantCount,
    });
  } catch (error) {
    return Response.json(
      {
        error:
          error instanceof Error ? error.message : "Could not seed Supabase",
      },
      { status: 500 },
    );
  }
}

async function upsertProductImage(product: (typeof products)[number]) {
  const existingRows =
    (await supabaseRest<ProductImageRow[]>(
      `product_images?select=id&product_id=eq.${encodeURIComponent(
        product.id,
      )}&image_url=eq.${encodeURIComponent(product.image)}`,
      {
        requireServiceRole: true,
      },
    )) ?? [];
  const body = {
    alt: product.name,
    image_url: product.image,
    is_public: true,
    product_id: product.id,
    sort_order: 0,
  };
  const existingId = existingRows[0]?.id;

  if (existingId) {
    await supabaseRest(`product_images?id=eq.${existingId}`, {
      body,
      method: "PATCH",
      requireServiceRole: true,
    });
    return;
  }

  await supabaseRest("product_images", {
    body,
    method: "POST",
    requireServiceRole: true,
  });
}

async function upsertProductVariant(
  product: (typeof products)[number],
  size: SizeRow,
) {
  const existingRows =
    (await supabaseRest<VariantRow[]>(
      `product_variants?select=id,product_id,size_id&product_id=eq.${encodeURIComponent(
        product.id,
      )}&size_id=eq.${size.id}`,
      {
        requireServiceRole: true,
      },
    )) ?? [];
  const body = {
    color: product.color,
    material: product.materials,
    product_id: product.id,
    size_id: size.id,
    status: "active",
  };
  const existing = existingRows[0];

  if (existing) {
    await supabaseRest(`product_variants?id=eq.${existing.id}`, {
      body,
      method: "PATCH",
      requireServiceRole: true,
    });
    return existing;
  }

  const insertedRows = await supabaseRest<VariantRow[]>("product_variants", {
    body: [body],
    method: "POST",
    prefer: "return=representation",
    requireServiceRole: true,
  });

  return insertedRows?.[0] ?? null;
}

async function upsertInventory(variantId: string, stock: number) {
  const existingRows =
    (await supabaseRest<InventoryRow[]>(
      `inventory?select=variant_id,stock&variant_id=eq.${variantId}`,
      {
        requireServiceRole: true,
      },
    )) ?? [];
  const body = {
    reserved: 0,
    stock,
    variant_id: variantId,
  };

  if (existingRows[0]) {
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

export async function getSeedTestItems(): Promise<SeedTestItems> {
  const empty = createEmptyTestItems();
  const lSizeRows = await supabaseRest<SizeRow[]>(
    "sizes?select=id,label&label=eq.L",
    {
      requireServiceRole: true,
    },
  );
  const lSize = lSizeRows?.[0];

  if (!lSize) {
    return empty;
  }

  const variantRows =
    (await supabaseRest<VariantRow[]>(
      `product_variants?select=id,product_id,size_id&product_id=in.(${testProductIds.join(
        ",",
      )})&size_id=eq.${lSize.id}`,
      {
        requireServiceRole: true,
      },
    )) ?? [];
  const inventories = variantRows.length
    ? ((await supabaseRest<InventoryRow[]>(
        `inventory?select=variant_id,stock&variant_id=in.(${variantRows
          .map((variant) => variant.id)
          .join(",")})`,
        {
          requireServiceRole: true,
        },
      )) ?? [])
    : [];
  const inventoryByVariantId = new Map(
    inventories.map((inventory) => [inventory.variant_id, inventory]),
  );

  for (const productId of testProductIds) {
    const variant = variantRows.find((row) => row.product_id === productId);

    if (variant) {
      empty[productId].L = {
        stock: inventoryByVariantId.get(variant.id)?.stock ?? null,
        variant_id: variant.id,
      };
    }
  }

  return empty;
}

function createEmptyTestItems(): SeedTestItems {
  return {
    "field-jacket": {
      L: {
        stock: null,
        variant_id: null,
      },
    },
    "washed-longsleeve": {
      L: {
        stock: null,
        variant_id: null,
      },
    },
  };
}

function getSeedStock(size: (typeof seedSizes)[number], defaultSize?: string) {
  const baseStock: Record<(typeof seedSizes)[number], number> = {
    L: 6,
    M: 8,
    S: 5,
    XL: 2,
    XS: 3,
  };

  return size === defaultSize ? baseStock[size] + 4 : baseStock[size];
}
