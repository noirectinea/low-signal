import {
  AdminAccessDenied,
  AdminChrome,
} from "../../AdminChrome";
import { ProductForm } from "../../ProductForm";
import { getAdminAccess, getSizes } from "@/lib/admin";

type NewProductPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function NewProductPage({
  searchParams,
}: NewProductPageProps) {
  const access = await getAdminAccess("/admin/products/new");

  if (!access.isAdmin) {
    return <AdminAccessDenied />;
  }

  const [sizes, params] = await Promise.all([getSizes(), searchParams]);

  return (
    <AdminChrome eyebrow="Admin / Products" title="New product">
      <ProductForm error={params.error} sizes={sizes} />
    </AdminChrome>
  );
}
