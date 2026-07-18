import Link from "next/link";
import {
  AdminAccessDenied,
  AdminChrome,
  AdminEmpty,
  formatAdminDate,
  formatAdminMoney,
} from "../AdminChrome";
import { getOrderStatusLabel } from "@/lib/availability";
import { adminOrderStatuses, getAdminAccess, getAdminOrders } from "@/lib/admin";

type AdminOrdersPageProps = {
  searchParams: Promise<{
    q?: string;
    status?: string;
  }>;
};

export default async function AdminOrdersPage({
  searchParams,
}: AdminOrdersPageProps) {
  const access = await getAdminAccess("/admin/orders");

  if (!access.isAdmin) {
    return <AdminAccessDenied />;
  }

  const params = await searchParams;
  const orders = filterOrders(await getAdminOrders(), params);

  return (
    <AdminChrome eyebrow="Admin / Orders" title="Order management">
      <form
        action="/admin/orders"
        className="mb-6 grid grid-cols-[1fr_auto] gap-2 text-[9px] uppercase tracking-[0.12em] sm:flex sm:flex-wrap"
      >
        <input
          className="col-span-2 min-h-11 border border-black/16 bg-transparent px-3 py-2 outline-none sm:col-span-1"
          defaultValue={params.q ?? ""}
          name="q"
          placeholder="Order/email"
        />
        <select
          className="min-h-11 border border-black/16 bg-transparent px-3 py-2"
          defaultValue={params.status ?? ""}
          name="status"
        >
          <option value="">All status</option>
          {adminOrderStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <button className="min-h-11 bg-black px-5 py-3 text-[#ecece5]" type="submit">
          Filter
        </button>
      </form>

      {orders.length ? (
        <div className="divide-y divide-black/16 border-t border-black/16 text-[9px] uppercase tracking-[0.16em]">
          {orders.map((order) => (
            <Link
              className="grid grid-cols-2 gap-x-4 gap-y-2 py-4 transition-opacity hover:opacity-60 md:grid-cols-[1fr_1.2fr_0.8fr_0.7fr_0.7fr_0.7fr] md:items-center"
              href={`/admin/orders/${order.id}`}
              key={order.id}
            >
              <span>{order.order_number}</span>
              <span className="text-black/58">
                {order.customer_email ?? "guest"}
              </span>
              <span>{formatAdminDate(order.created_at)}</span>
              <span>{getOrderStatusLabel(order.status)}</span>
              <span>{order.item_count ?? 0} items</span>
              <span className="md:text-right">
                {formatAdminMoney(order.currency, order.total)}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <AdminEmpty>No orders match these filters.</AdminEmpty>
      )}
    </AdminChrome>
  );
}

function filterOrders(
  orders: Awaited<ReturnType<typeof getAdminOrders>>,
  params: {
    q?: string;
    status?: string;
  },
) {
  const query = (params.q ?? "").trim().toLowerCase();

  return orders.filter((order) => {
    const matchesQuery = query
      ? [
          order.order_number,
          order.customer_email ?? "",
          order.customer_name ?? "",
        ].some((value) => value.toLowerCase().includes(query))
      : true;
    const matchesStatus = params.status ? order.status === params.status : true;

    return matchesQuery && matchesStatus;
  });
}
