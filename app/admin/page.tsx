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
      <div className="grid gap-7 lg:grid-cols-[1fr_420px]">
        <div className="grid grid-cols-2 gap-3 text-[9px] uppercase tracking-[0.1em]">
          <Metric label="Total products" value={overview.products} />
          <Metric label="Active products" value={overview.activeProducts} />
          <Metric label="Low stock variants" value={overview.lowStockVariants} />
          <Metric label="Total orders" value={overview.totalOrders} />
          <div className="col-span-2 mt-2 grid grid-cols-3 gap-px bg-black/14">
            <QuickAction href="/admin/products/new" label="Create product" />
            <QuickAction href="/admin/orders" label="View orders" />
            <QuickAction href="/admin/products?stock=low" label="Low stock" />
          </div>
        </div>

        <aside className="border border-black/16 p-4 text-[9px] uppercase tracking-[0.1em] lg:p-5">
          <p className="flex items-center justify-between border-b border-black/16 pb-4 text-black/72">
            <span>Recent orders</span>
            <span>{overview.pendingOrders} pending</span>
          </p>
          {overview.recentOrders.length ? (
            <div className="divide-y divide-black/12">
              {overview.recentOrders.map((order) => (
                <Link
                  className="grid grid-cols-[1fr_auto] gap-2 py-4 transition-opacity hover:opacity-60"
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
    <div className="min-h-[112px] border border-black/16 p-4">
      <p className="text-black/54">{label}</p>
      <p className="mt-5 font-serif text-[34px] leading-none lg:text-[40px]">{value}</p>
    </div>
  );
}

function QuickAction({ href, label }: Readonly<{ href: string; label: string }>) {
  return (
    <Link
      className="flex min-h-14 items-center justify-center bg-[#e5e6e1] px-2 text-center transition-colors hover:bg-[#d6d7d1]"
      href={href}
    >
      {label} →
    </Link>
  );
}
