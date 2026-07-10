import Link from "next/link";
import {
  AdminAccessDenied,
  AdminChrome,
  AdminEmpty,
} from "../../AdminChrome";
import { ProductForm } from "../../ProductForm";
import { getAdminAccess, getAdminProduct, getSizes } from "@/lib/admin";

type EditProductPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
    saved?: string;
  }>;
};

export default async function EditProductPage({
  params,
  searchParams,
}: EditProductPageProps) {
  const { id } = await params;
  const access = await getAdminAccess(`/admin/products/${id}`);

  if (!access.isAdmin) {
    return <AdminAccessDenied />;
  }

  const [product, sizes, query] = await Promise.all([
    getAdminProduct(id),
    getSizes(),
    searchParams,
  ]);

  if (!product) {
    return (
      <AdminChrome eyebrow="Admin / Products" title="Product not found">
        <AdminEmpty
          action={
            <Link className="border-b border-black/50 pb-1" href="/admin/products">
              Back to products
            </Link>
          }
        >
          This product does not exist.
        </AdminEmpty>
      </AdminChrome>
    );
  }

  return (
    <AdminChrome eyebrow="Admin / Products" title={product.name}>
      <ProductForm
        error={query.error}
        product={product}
        saved={query.saved}
        sizes={sizes}
      />
    </AdminChrome>
  );
}
