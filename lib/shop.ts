import {
  products as fallbackProducts,
  type Product,
  type ProductGender,
  type ProductImage,
  type ProductSize,
} from "@/data/products";
import { isSupabaseConfigured, supabaseRest } from "@/lib/supabase";

type ProductRow = {
  id: string;
  slug: string;
  name: string;
  category: string;
  gender: ProductGender;
  price: number;
  description: string | null;
  material: string | null;
  color: string | null;
  default_size: string | null;
  object_position: string | null;
  primary_image: string;
  is_active: boolean;
  sort_order: number;
  product_images?: ProductImageRow[];
  product_sizes?: ProductSizeRow[];
  product_variants?: ProductVariantRow[];
};

type ProductImageRow = {
  alt: string | null;
  id: string;
  image_url: string;
  sort_order: number;
};

type ProductSizeRow = {
  id: string;
  label: string;
  stock: number;
};

type ProductVariantRow = {
  id: string;
  inventory?: ProductInventoryRow | ProductInventoryRow[] | null;
  sizes?: {
    label: string;
  } | null;
  status: "active" | "archived" | "draft";
};

type ProductInventoryRow = {
  stock: number;
};

const productSelect =
  "id,slug,name,category,gender,price,description,material,color,default_size,object_position,primary_image,is_active,sort_order,product_images(id,image_url,alt,sort_order),product_variants(id,status,sizes(label),inventory(stock))";

export async function getProducts() {
  if (!isSupabaseConfigured) {
    return withFallbackStock(fallbackProducts);
  }

  try {
    const rows = await supabaseRest<ProductRow[]>(
      `products?select=${productSelect}&is_active=eq.true&order=sort_order.asc`,
    );

    return rows?.length ? rows.map(mapProductRow) : withFallbackStock(fallbackProducts);
  } catch {
    return withFallbackStock(fallbackProducts);
  }
}

export async function getProductsByGender(gender: ProductGender) {
  const products = await getProducts();

  return products.filter((product) => product.gender === gender);
}

export async function getProductBySlug(slug: string) {
  if (!isSupabaseConfigured) {
    return withFallbackStock(fallbackProducts).find(
      (product) => product.slug === slug,
    );
  }

  try {
    const rows = await supabaseRest<ProductRow[]>(
      `products?select=${productSelect}&slug=eq.${encodeURIComponent(
        slug,
      )}&is_active=eq.true&limit=1`,
    );

    return rows?.[0] ? mapProductRow(rows[0]) : getFallbackProductBySlug(slug);
  } catch {
    return getFallbackProductBySlug(slug);
  }
}

export async function getProductSlugs() {
  const products = await getProducts();

  return products.map((product) => product.slug);
}

export async function getRelatedProduct(product: Product) {
  return (await getRelatedProducts(product, 1))[0];
}

export async function getRelatedProducts(product: Product, limit = 3) {
  const products = (await getProducts()).filter(
    (item) => item.id !== product.id,
  );
  const ranked = [
    ...products.filter(
      (item) =>
        item.gender === product.gender && item.category === product.category,
    ),
    ...products.filter(
      (item) =>
        item.gender === product.gender && item.category !== product.category,
    ),
    ...products.filter((item) => item.gender !== product.gender),
  ];

  return ranked
    .filter(
      (item, index, items) =>
        items.findIndex((candidate) => candidate.id === item.id) === index,
    )
    .slice(0, limit);
}

function getFallbackProductBySlug(slug: string) {
  return withFallbackStock(fallbackProducts).find(
    (product) => product.slug === slug,
  );
}

function mapProductRow(row: ProductRow): Product {
  const images = mapProductImages(row);
  const sizes = mapProductSizes(row);

  return {
    category: row.category,
    color: row.color ?? undefined,
    description: row.description ?? "",
    gender: row.gender,
    id: row.id,
    image: row.primary_image,
    images,
    materials: row.material ?? "",
    name: row.name,
    objectPosition: row.object_position ?? undefined,
    price: row.price,
    size: row.default_size ?? sizes.find((size) => size.stock > 0)?.label,
    sizes,
    slug: row.slug,
    stock: sizes.reduce((total, size) => total + size.stock, 0),
  };
}

function mapProductImages(row: ProductRow): ProductImage[] {
  const images = [...(row.product_images ?? [])].sort(
    (first, second) => first.sort_order - second.sort_order,
  );

  if (!images.length) {
    return [
      {
        alt: row.name,
        src: row.primary_image,
        sortOrder: 0,
      },
    ];
  }

  return images.map((image) => ({
    alt: image.alt ?? row.name,
    id: image.id,
    sortOrder: image.sort_order,
    src: image.image_url,
  }));
}

function mapProductSizes(row: ProductRow): ProductSize[] {
  const variantSizes = [...(row.product_variants ?? [])]
    .filter((variant) => variant.status === "active" && variant.sizes?.label)
    .map((variant) => ({
      id: variant.id,
      label: variant.sizes?.label ?? "M",
      stock: getVariantStock(variant.inventory),
      variantId: variant.id,
    }));

  if (variantSizes.length) {
    return variantSizes.sort(compareProductSizes);
  }

  return [...(row.product_sizes ?? [])]
    .sort(compareProductSizes)
    .map((size) => ({
      id: size.id,
      label: size.label,
      stock: size.stock,
    }));
}

function compareProductSizes(first: { label: string }, second: { label: string }) {
  const sizeOrder = ["XS", "S", "M", "L", "XL"];

  return (
    (sizeOrder.indexOf(first.label) === -1
      ? Number.MAX_SAFE_INTEGER
      : sizeOrder.indexOf(first.label)) -
    (sizeOrder.indexOf(second.label) === -1
      ? Number.MAX_SAFE_INTEGER
      : sizeOrder.indexOf(second.label))
  );
}

function getVariantStock(
  inventory: ProductInventoryRow | ProductInventoryRow[] | null | undefined,
) {
  if (Array.isArray(inventory)) {
    return inventory[0]?.stock ?? 0;
  }

  return inventory?.stock ?? 0;
}

function withFallbackStock(products: Product[]): Product[] {
  return products.map((product) => ({
    ...product,
    images: product.images ?? [
      {
        alt: product.name,
        src: product.image,
        sortOrder: 0,
      },
    ],
    sizes:
      product.sizes ??
      ["XS", "S", "M", "L", "XL"].map((label) => ({
        label,
        stock: label === product.size ? 9 : 4,
      })),
    stock: product.stock ?? 25,
  }));
}
