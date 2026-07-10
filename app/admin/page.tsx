import Link from "next/link";
import {
  AdminAccessDenied,
  AdminChrome,
  formatAdminDate,
  formatAdminMoney,
} from "./AdminChrome";
import { getAdminAccess, getAdminOverview } from "@/lib/admin";

type AdminPageProps = {
  searchParams: Promise<{
    denied?: string;
  }>;
};

export default async function AdminPage({ searchParams }: AdminPageProps) {
  const access = await getAdminAccess("/admin");
  const params = await searchParams;

  if (!access.isAdmin || params.denied) {
    return <AdminAccessDenied />;
  }

  const overview = await getAdminOverview();

  return (
    <AdminChrome title="Commerce desk">
      <div className="grid gap-10 lg:grid-cols-[1fr_460px]">
        <div className="grid gap-4 text-[9px] uppercase tracking-[0.16em] sm:grid-cols-2">
          <Metric label="Total products" value={overview.products} />
          <Metric label="Active products" value={overview.activeProducts} />
          <Metric label="Low stock variants" value={overview.lowStockVariants} />
          <Metric label="Total orders" value={overview.totalOrders} />
          <Metric label="Pending orders" value={overview.pendingOrders} />
          <Link
            className="border border-black/16 p-5 transition-colors hover:border-black/42"
            href="/admin/products/new"
          >
            Create product -&gt;
          </Link>
        </div>

        <aside className="border border-black/16 p-6 text-[9px] uppercase tracking-[0.16em]">
          <p className="border-b border-black/16 pb-5 text-black/72">
            Recent orders
          </p>
          {overview.recentOrders.length ? (
            <div className="divide-y divide-black/12">
              {overview.recentOrders.map((order) => (
                <Link
                  className="grid gap-2 py-5"
                  href={`/admin/orders/${order.id}`}
                  key={order.id}
                >
                  <span>{order.order_number}</span>
                  <span className="text-black/54">
                    {formatAdminDate(order.created_at)} / {order.status} /{" "}
                    {formatAdminMoney(order.currency, order.total)}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="py-6 leading-[1.7] text-black/54">No orders yet.</p>
          )}
        </aside>
      </div>
    </AdminChrome>
  );
}

function Metric({
  label,
  value,
}: Readonly<{
  label: string;
  value: number;
}>) {
  return (
    <div className="border border-black/16 p-5">
      <p className="text-black/54">{label}</p>
      <p className="mt-8 font-serif text-[46px] leading-none">{value}</p>
    </div>
  );
}
