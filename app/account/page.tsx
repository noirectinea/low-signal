import Link from "next/link";
import {
  formatAccountDate,
  formatAccountMoney,
  AccountChrome,
} from "./AccountChrome";
import { logoutAction } from "./actions";
import { getCustomerOrders, requireAccountSession } from "@/lib/account";

export default async function AccountPage() {
  const session = await requireAccountSession("/account");
  const recentOrders = await getCustomerOrders(session.user.id, 3);
  const displayName =
    session.profile.full_name || session.user.email || "Customer";

  return (
    <AccountChrome eyebrow="Account / Overview" title={displayName}>
      <div className="grid gap-10 lg:grid-cols-[1fr_420px]">
        <div className="grid gap-5 text-[9px] uppercase tracking-[0.16em]">
          <p className="text-black/58">{session.profile.email}</p>
          <div className="grid gap-4 border-t border-black/16 pt-6 sm:grid-cols-2">
            <Link
              className="border border-black/16 p-5 transition-colors hover:border-black/42"
              href="/account/orders"
            >
              View orders
            </Link>
            <Link
              className="border border-black/16 p-5 transition-colors hover:border-black/42"
              href="/account/settings"
            >
              Delivery settings
            </Link>
            <form action={logoutAction}>
              <button
                className="min-h-11 w-full border border-black/16 p-5 text-left transition-colors hover:border-black/42"
                type="submit"
              >
                Log out
              </button>
            </form>
          </div>
        </div>

        <aside className="border border-black/16 p-6 text-[9px] uppercase tracking-[0.16em]">
          <p className="border-b border-black/16 pb-5 text-black/72">
            Recent orders
          </p>
          {recentOrders.length ? (
            <div className="divide-y divide-black/12">
              {recentOrders.map((order) => (
                <Link
                  className="grid gap-2 py-5"
                  href={`/account/orders/${order.id}`}
                  key={order.id}
                >
                  <span>{order.order_number}</span>
                  <span className="text-black/54">
                    {formatAccountDate(order.created_at)} / {order.status} /{" "}
                    {formatAccountMoney(order.currency, order.total)}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="py-6 leading-[1.7] text-black/54">
              No orders connected to this account yet.
            </p>
          )}
        </aside>
      </div>
    </AccountChrome>
  );
}
