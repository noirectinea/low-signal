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
    gender?: string;
    q?: string;
    status?: string;
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

  const products = filterProducts(await getAdminProducts(), params);

  return (
    <AdminChrome eyebrow="Admin / Products" title="Catalog management">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-5 text-[9px] uppercase tracking-[0.16em]">
        <form className="flex flex-wrap gap-3" action="/admin/products">
          <input
            className="border border-black/16 bg-transparent px-4 py-3 outline-none"
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
            className="border border-black/16 bg-transparent px-4 py-3"
            defaultValue={params.gender ?? ""}
            name="gender"
          >
            <option value="">All gender</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="unisex">Unisex</option>
          </select>
          <button className="bg-black px-5 py-3 text-[#ecece5]" type="submit">
            Filter
          </button>
        </form>
        <Link className="border-b border-black/50 pb-1" href="/admin/products/new">
          New product
        </Link>
      </div>

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
    gender?: string;
    q?: string;
    status?: string;
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

    return matchesQuery && matchesStatus && matchesGender;
  });
}
