import { products } from "@/data/products";
import { isSupabaseServiceConfigured, supabaseRest } from "@/lib/supabase";
import { requireAdmin } from "../products/route";

const seedSizes = ["XS", "S", "M", "L", "XL"] as const;
const testProductIds = ["field-jacket", "washed-longsleeve"] as const;

type IdRow = {
  id: string;
};

type ProductRow = {
  id: string;
  name: string;
  status: string;
};

type SizeRow = {
  id: string;
  label: (typeof seedSizes)[number];
};

type VariantRow = {
  id: string;
  product_id: string;
  size_id: string;
  status: string;
};

type InventoryRow = {
  stock: number;
  variant_id: string;
};

type TestItem = {
  stock: number | null;
  variant_id: string | null;
};

export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const authError = requireAdmin(request);

  if (authError) {
    return authError;
  }

  if (!isSupabaseServiceConfigured) {
    return Response.json(
      { error: "Supabase service role env variables are not configured." },
      { status: 500 },
    );
  }

  try {
    const [allProducts, allVariants, allInventory, allImages, sizeRows] =
      await Promise.all([
        supabaseRest<IdRow[]>("products?select=id", {
          requireServiceRole: true,
        }),
        supabaseRest<IdRow[]>("product_variants?select=id", {
          requireServiceRole: true,
        }),
        supabaseRest<InventoryRow[]>("inventory?select=variant_id,stock", {
          requireServiceRole: true,
        }),
        supabaseRest<IdRow[]>("product_images?select=id", {
          requireServiceRole: true,
        }),
        supabaseRest<SizeRow[]>("sizes?select=id,label", {
          requireServiceRole: true,
        }),
      ]);
    const productRows =
      (await supabaseRest<ProductRow[]>(
        `products?select=id,name,status&id=in.(${testProductIds.join(",")})`,
        {
          requireServiceRole: true,
        },
      )) ?? [];
    const lSize = (sizeRows ?? []).find((size) => size.label === "L");
    const testVariants = lSize
      ? ((await supabaseRest<VariantRow[]>(
          `product_variants?select=id,product_id,size_id,status&product_id=in.(${testProductIds.join(
            ",",
          )})&size_id=eq.${lSize.id}`,
          {
            requireServiceRole: true,
          },
        )) ?? [])
      : [];
    const testInventory = testVariants.length
      ? ((await supabaseRest<InventoryRow[]>(
          `inventory?select=variant_id,stock&variant_id=in.(${testVariants
            .map((variant) => variant.id)
            .join(",")})`,
          {
            requireServiceRole: true,
          },
        )) ?? [])
      : [];
    const inventoryByVariantId = new Map(
      testInventory.map((inventory) => [inventory.variant_id, inventory]),
    );
    const testItems = {
      "field-jacket": {
        L: getTestItem("field-jacket", testVariants, inventoryByVariantId),
      },
      "washed-longsleeve": {
        L: getTestItem(
          "washed-longsleeve",
          testVariants,
          inventoryByVariantId,
        ),
      },
    };
    const seededProductIds = new Set(products.map((product) => product.id));
    const presentProductIds = new Set((allProducts ?? []).map((row) => row.id));
    const expectedVariantCount = products.length * seedSizes.length;
    const productRowsById = new Map(productRows.map((row) => [row.id, row]));
    const checks = {
      field_jacket_l_exists: Boolean(testItems["field-jacket"].L.variant_id),
      field_jacket_l_stock_at_least_2:
        (testItems["field-jacket"].L.stock ?? 0) >= 2,
      inventory_exists: (allInventory ?? []).length >= expectedVariantCount,
      product_images_exist: (allImages ?? []).length >= products.length,
      product_variants_exist: (allVariants ?? []).length >= expectedVariantCount,
      products_exist: products.every((product) =>
        presentProductIds.has(product.id),
      ),
      products_status_exists: productRows.every(
        (row) => typeof row.status === "string",
      ),
      sizes_exist: seedSizes.every((label) =>
        (sizeRows ?? []).some((size) => size.label === label),
      ),
      washed_longsleeve_l_exists: Boolean(
        testItems["washed-longsleeve"].L.variant_id,
      ),
      washed_longsleeve_l_stock_at_least_2:
        (testItems["washed-longsleeve"].L.stock ?? 0) >= 2,
    };
    const ok = Object.values(checks).every(Boolean);

    return Response.json({
      ok,
      checks,
      counts: {
        expected_seed_products: products.length,
        expected_seed_variants: expectedVariantCount,
        inventory: allInventory?.length ?? 0,
        product_images: allImages?.length ?? 0,
        products: allProducts?.filter((row) => seededProductIds.has(row.id))
          .length,
        variants: allVariants?.length ?? 0,
      },
      products: {
        "field-jacket": productRowsById.get("field-jacket") ?? null,
        "washed-longsleeve": productRowsById.get("washed-longsleeve") ?? null,
      },
      test_items: testItems,
    });
  } catch (error) {
    return Response.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Could not verify Supabase seed data",
      },
      { status: 500 },
    );
  }
}

function getTestItem(
  productId: (typeof testProductIds)[number],
  variants: VariantRow[],
  inventoryByVariantId: Map<string, InventoryRow>,
): TestItem {
  const variant = variants.find((row) => row.product_id === productId);

  if (!variant) {
    return {
      stock: null,
      variant_id: null,
    };
  }

  return {
    stock: inventoryByVariantId.get(variant.id)?.stock ?? null,
    variant_id: variant.id,
  };
}
