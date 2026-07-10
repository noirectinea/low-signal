import Link from "next/link";
import {
  AccountChrome,
  formatAccountDate,
  formatAccountMoney,
  StatusTimeline,
} from "../../AccountChrome";
import { getCustomerOrder, requireAccountSession } from "@/lib/account";
import { getOrderStatusLabel } from "@/lib/availability";

type AccountOrderDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AccountOrderDetailPage({
  params,
}: AccountOrderDetailPageProps) {
  const { id } = await params;
  const session = await requireAccountSession(`/account/orders/${id}`);
  const order = await getCustomerOrder(session.user.id, id);

  if (!order) {
    return (
      <AccountChrome eyebrow="Account / Orders" title="Order not found">
        <div className="border-y border-black/16 py-10 text-[9px] uppercase leading-[1.8] tracking-[0.16em] text-black/64">
          This order is not available for the current account.{" "}
          <Link className="border-b border-black/50 pb-1" href="/account/orders">
            Back to orders
          </Link>
        </div>
      </AccountChrome>
    );
  }

  return (
    <AccountChrome eyebrow="Account / Order" title={order.order_number}>
      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="grid gap-4 border-y border-black/16 py-6 text-[9px] uppercase tracking-[0.16em] md:grid-cols-3">
            <p>
              <span className="block text-black/50">Date</span>
              <span>{formatAccountDate(order.created_at)}</span>
            </p>
            <p>
              <span className="block text-black/50">Status</span>
              <span>{getOrderStatusLabel(order.status)}</span>
            </p>
            <p>
              <span className="block text-black/50">Total</span>
              <span>{formatAccountMoney(order.currency, order.total)}</span>
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
                  {formatAccountMoney(
                    item.currency_snapshot,
                    item.unit_price_snapshot ?? 0,
                  )}
                </p>
                <p className="md:text-right">
                  {formatAccountMoney(
                    item.currency_snapshot,
                    item.line_total_snapshot ?? 0,
                  )}
                </p>
              </div>
            ))}
          </div>
        </div>

        <aside className="grid h-fit gap-8 border border-black/16 p-6 text-[9px] uppercase tracking-[0.16em]">
          <div>
            <p className="border-b border-black/16 pb-5 text-black/72">
              Delivery
            </p>
            <div className="grid gap-3 pt-5 leading-[1.7] text-black/58">
              <p>{order.customer_name}</p>
              <p>{order.shipping_address}</p>
              <p>
                {[order.shipping_city, order.shipping_postal_code]
                  .filter(Boolean)
                  .join(" ")}
              </p>
              <p>{order.shipping_country}</p>
            </div>
          </div>

          <div>
            <p className="border-b border-black/16 pb-5 text-black/72">
              Status timeline
            </p>
            <div className="pt-5">
              <StatusTimeline status={order.status} />
            </div>
          </div>
        </aside>
      </div>
    </AccountChrome>
  );
}
