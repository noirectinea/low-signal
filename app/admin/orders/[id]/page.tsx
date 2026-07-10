import Link from "next/link";
import {
  AdminAccessDenied,
  AdminChrome,
  AdminEmpty,
  formatAdminDate,
  formatAdminMoney,
} from "../../AdminChrome";
import { AdminSubmitButton } from "../../AdminFormButtons";
import { updateOrderStatusAction } from "../../actions";
import { getOrderStatusLabel } from "@/lib/availability";
import { adminOrderStatuses, getAdminAccess, getAdminOrder } from "@/lib/admin";

type AdminOrderDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
  searchParams: Promise<{
    error?: string;
    saved?: string;
  }>;
};

export default async function AdminOrderDetailPage({
  params,
  searchParams,
}: AdminOrderDetailPageProps) {
  const { id } = await params;
  const access = await getAdminAccess(`/admin/orders/${id}`);

  if (!access.isAdmin) {
    return <AdminAccessDenied />;
  }

  const [order, query] = await Promise.all([getAdminOrder(id), searchParams]);

  if (!order) {
    return (
      <AdminChrome eyebrow="Admin / Orders" title="Order not found">
        <AdminEmpty
          action={
            <Link className="border-b border-black/50 pb-1" href="/admin/orders">
              Back to orders
            </Link>
          }
        >
          This order does not exist.
        </AdminEmpty>
      </AdminChrome>
    );
  }

  return (
    <AdminChrome eyebrow="Admin / Orders" title={order.order_number}>
      <div className="grid gap-10 lg:grid-cols-[1fr_420px]">
        <div>
          <div className="grid gap-4 border-y border-black/16 py-6 text-[9px] uppercase tracking-[0.16em] md:grid-cols-4">
            <p>
              <span className="block text-black/50">Date</span>
              <span>{formatAdminDate(order.created_at)}</span>
            </p>
            <p>
              <span className="block text-black/50">Status</span>
              <span>{getOrderStatusLabel(order.status)}</span>
            </p>
            <p>
              <span className="block text-black/50">Customer</span>
              <span>{order.customer_email ?? "guest"}</span>
            </p>
            <p>
              <span className="block text-black/50">Total</span>
              <span>{formatAdminMoney(order.currency, order.total)}</span>
            </p>
          </div>

          <div className="divide-y divide-black/12 text-[9px] uppercase tracking-[0.16em]">
            {(order.order_items ?? []).map((item) => (
              <div
                className="grid gap-4 py-6 md:grid-cols-[1.4fr_0.7fr_0.7fr_0.7fr]"
                key={item.id}
              >
                <div>
                  <p>{item.product_name_snapshot ?? item.product_id}</p>
                  <p className="mt-2 text-black/52">
                    {item.size_snapshot ?? "Size"} /{" "}
                    {item.color_snapshot ?? "Color"}
                  </p>
                </div>
                <p>Qty {item.quantity}</p>
                <p>
                  {formatAdminMoney(
                    item.currency_snapshot,
                    item.unit_price_snapshot ?? 0,
                  )}
                </p>
                <p className="md:text-right">
                  {formatAdminMoney(
                    item.currency_snapshot,
                    item.line_total_snapshot ?? 0,
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>

        <aside className="grid h-fit gap-8 border border-black/16 p-6 text-[9px] uppercase tracking-[0.16em]">
          <form action={updateOrderStatusAction}>
            <input name="order_id" type="hidden" value={order.id} />
            <label className="grid gap-3 border-b border-black/16 pb-3 text-black/64">
              <span>Order status</span>
              <select
                className="bg-transparent py-1 text-[12px] uppercase tracking-[0.12em] text-black outline-none"
                defaultValue={order.status}
                name="status"
              >
                {adminOrderStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
            {query.saved ? (
              <p className="mt-5 leading-[1.7] text-black/58">
                Order status saved.
              </p>
            ) : null}
            {query.error ? (
              <p className="mt-5 leading-[1.7] text-black/58">{query.error}</p>
            ) : null}
            <AdminSubmitButton
              className="mt-6 w-full bg-black px-5 py-4 text-[#ecece5]"
              pendingLabel="Updating..."
            >
              Update status -&gt;
            </AdminSubmitButton>
          </form>

          <div>
            <p className="border-b border-black/16 pb-5 text-black/72">
              Shipping
            </p>
            <div className="grid gap-3 pt-5 leading-[1.7] text-black/58">
              <p>{order.customer_name}</p>
              <p>{order.phone}</p>
              <p>{order.shipping_address}</p>
              <p>
                {[order.shipping_city, order.shipping_postal_code]
                  .filter(Boolean)
                  .join(" ")}
              </p>
              <p>{order.shipping_country}</p>
            </div>
          </div>
        </aside>
      </div>
    </AdminChrome>
  );
}
