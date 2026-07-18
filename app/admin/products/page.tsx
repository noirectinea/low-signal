import Image from "next/image";
import Link from "next/link";
import {
  AdminAccessDenied,
  AdminChrome,
  AdminEmpty,
  formatAdminMoney,
} from "../AdminChrome";
import { getAdminAccess, getAdminProducts } from "@/lib/admin";

type AdminProductsPageProps = {
  searchParams: Promise<{
    category?: string;
    collection?: string;
    deleted?: string;
    gender?: string;
    q?: string;
    sort?: string;
    status?: string;
    stock?: string;
  }>;
};

export default async function AdminProductsPage({
  searchParams,
}: AdminProductsPageProps) {
  const access = await getAdminAccess("/admin/products");
  const params = await searchParams;

  if (!access.isAdmin) {
    return <AdminAccessDenied />;
  }

  const allProducts = await getAdminProducts();
  const products = filterProducts(allProducts, params);
  const categories = uniqueValues(allProducts.map((product) => product.category));
  const collections = uniqueValues(
    allProducts.map((product) => product.collection_name),
  );

  return (
    <AdminChrome eyebrow="Admin / Products" title="Catalog management">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-5 text-[9px] uppercase tracking-[0.16em]">
        <form className="grid w-full grid-cols-2 gap-2 sm:flex sm:flex-wrap" action="/admin/products">
          <input
            className="col-span-2 min-h-11 border border-black/16 bg-transparent px-3 py-2 outline-none sm:col-span-1"
            defaultValue={params.q ?? ""}
            name="q"
            placeholder="Search"
          />
          <select
            className="border border-black/16 bg-transparent px-4 py-3"
            defaultValue={params.status ?? ""}
            name="status"
          >
            <option value="">All status</option>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
          <select
            className="min-h-11 border border-black/16 bg-transparent px-3 py-2"
            defaultValue={params.collection ?? ""}
            name="collection"
          >
            <option value="">All collections</option>
            {collections.map((collection) => (
              <option key={collection} value={collection}>{collection}</option>
            ))}
          </select>
          <select
            className="min-h-11 border border-black/16 bg-transparent px-3 py-2"
            defaultValue={params.category ?? ""}
            name="category"
          >
            <option value="">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <select
            className="min-h-11 border border-black/16 bg-transparent px-3 py-2"
            defaultValue={params.stock ?? ""}
            name="stock"
          >
            <option value="">All stock</option>
            <option value="in">In stock</option>
            <option value="low">Low stock</option>
            <option value="out">Out of stock</option>
          </select>
          <select
            className="min-h-11 border border-black/16 bg-transparent px-3 py-2"
            defaultValue={params.sort ?? "name"}
            name="sort"
          >
            <option value="name">Name A–Z</option>
            <option value="price-asc">Price low–high</option>
            <option value="price-desc">Price high–low</option>
            <option value="stock-asc">Stock low–high</option>
          </select>
          <select
            className="border border-black/16 bg-transparent px-4 py-3"
            defaultValue={params.gender ?? ""}
            name="gender"
          >
            <option value="">All gender</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="unisex">Unisex</option>
          </select>
          <button className="min-h-11 bg-black px-5 py-3 text-[#ecece5]" type="submit">
            Filter
          </button>
        </form>
        <Link className="border-b border-black/50 pb-1" href="/admin/products/new">
          New product
        </Link>
      </div>

      {params.deleted ? (
        <p className="mb-5 border border-black/16 bg-[#d9dad4] p-4 text-[9px] uppercase tracking-[0.12em]">
          Product deleted.
        </p>
      ) : null}

      {products.length ? (
        <div className="divide-y divide-black/16 border-t border-black/16 text-[9px] uppercase tracking-[0.16em]">
          {products.map((product) => (
            <Link
              className="grid gap-5 py-5 md:grid-cols-[72px_1.2fr_0.7fr_0.7fr_0.7fr_0.7fr_0.5fr] md:items-center"
              href={`/admin/products/${product.id}`}
              key={product.id}
            >
              <div className="relative h-20 w-16 overflow-hidden bg-black/5">
                {product.primary_image ? (
                  <Image
                    alt={product.name}
                    className="object-cover"
                    fill
                    sizes="64px"
                    src={product.primary_image}
                  />
                ) : null}
              </div>
              <div>
                <p>{product.name}</p>
                <p className="mt-2 text-black/50">{product.slug}</p>
              </div>
              <span>{product.status}</span>
              <span className="text-black/58">{product.category}</span>
              <span className="text-black/58">{product.gender}</span>
              <span>{formatAdminMoney(product.currency, product.price)}</span>
              <span className="md:text-right">{product.total_stock}</span>
            </Link>
          ))}
        </div>
      ) : (
        <AdminEmpty
          action={
            <Link className="border-b border-black/50 pb-1" href="/admin/products/new">
              Create product
            </Link>
          }
        >
          No products match these filters.
        </AdminEmpty>
      )}
    </AdminChrome>
  );
}

function filterProducts(
  products: Awaited<ReturnType<typeof getAdminProducts>>,
  params: {
    category?: string;
    collection?: string;
    gender?: string;
    q?: string;
    sort?: string;
    status?: string;
    stock?: string;
  },
) {
  const query = (params.q ?? "").trim().toLowerCase();

  return products.filter((product) => {
    const matchesQuery = query
      ? [product.name, product.slug, product.category].some((value) =>
          value.toLowerCase().includes(query),
        )
      : true;
    const matchesStatus = params.status
      ? product.status === params.status
      : true;
    const matchesGender = params.gender ? product.gender === params.gender : true;
    const matchesCategory = params.category
      ? product.category === params.category
      : true;
    const matchesCollection = params.collection
      ? product.collection_name === params.collection
      : true;
    const matchesStock =
      params.stock === "low"
        ? product.total_stock > 0 && product.total_stock <= 10
        : params.stock === "out"
          ? product.total_stock === 0
          : params.stock === "in"
            ? product.total_stock > 0
            : true;

    return (
      matchesQuery &&
      matchesStatus &&
      matchesGender &&
      matchesCategory &&
      matchesCollection &&
      matchesStock
    );
  }).sort((first, second) => {
    if (params.sort === "price-asc") return first.price - second.price;
    if (params.sort === "price-desc") return second.price - first.price;
    if (params.sort === "stock-asc") return first.total_stock - second.total_stock;
    return first.name.localeCompare(second.name);
  });
}

function uniqueValues(values: string[]) {
  return Array.from(new Set(values)).sort((first, second) =>
    first.localeCompare(second),
  );
}
