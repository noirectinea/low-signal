import Link from "next/link";
import {
  AccountChrome,
  formatAccountDate,
  formatAccountMoney,
} from "../AccountChrome";
import { getCustomerOrders, requireAccountSession } from "@/lib/account";
import { getOrderStatusLabel } from "@/lib/availability";

export default async function AccountOrdersPage() {
  const session = await requireAccountSession("/account/orders");
  const orders = await getCustomerOrders(session.user.id);

  return (
    <AccountChrome eyebrow="Account / Orders" title="Order history">
      {orders.length ? (
        <div className="divide-y divide-black/16 border-t border-black/16 text-[9px] uppercase tracking-[0.16em]">
          {orders.map((order) => (
            <Link
              className="grid gap-4 py-6 md:grid-cols-[1.2fr_1fr_1fr_1fr] md:items-center"
              href={`/account/orders/${order.id}`}
              key={order.id}
            >
              <span>{order.order_number}</span>
              <span className="text-black/58">
                {formatAccountDate(order.created_at)}
              </span>
              <span className="text-black/58">
                {getOrderStatusLabel(order.status)}
              </span>
              <span className="md:text-right">
                {formatAccountMoney(order.currency, order.total)}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="border-y border-black/16 py-10 text-[9px] uppercase leading-[1.8] tracking-[0.16em] text-black/64">
          No orders yet.{" "}
          <Link className="border-b border-black/50 pb-1" href="/collections">
            Return to collections
          </Link>
        </div>
      )}
    </AccountChrome>
  );
}
