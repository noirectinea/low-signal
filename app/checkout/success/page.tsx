import Link from "next/link";
import { PublicNavigation } from "@/components/PublicNavigation";
import { getOrderStatusLabel } from "@/lib/availability";

type CheckoutSuccessPageProps = {
  searchParams: Promise<{
    currency?: string;
    order?: string;
    status?: string;
    subtotal?: string;
    total?: string;
  }>;
};

export default async function CheckoutSuccessPage({
  searchParams,
}: CheckoutSuccessPageProps) {
  const params = await searchParams;
  const orderNumber = params.order ?? "Order received";
  const status = params.status ?? "pending";
  const currency = params.currency ?? "USD";
  const total = Number(params.total ?? params.subtotal ?? 0);

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#e5e6e1] text-[#121211]">
      <PublicNavigation />

      <section className="mx-auto grid min-h-screen max-w-[1320px] content-center px-5 py-[104px] lg:px-12">
        <div className="grid gap-10 border-y border-black/16 py-12 lg:grid-cols-[1fr_380px]">
          <div>
            <p className="text-[9px] uppercase tracking-[0.16em] text-black/64">
              Checkout / Order received
            </p>
            <h1 className="controlled-display-title mt-8 max-w-[760px] text-[52px] uppercase sm:text-[74px]">
              Order placed
            </h1>
            <p className="mt-6 text-[11px] uppercase tracking-[0.18em] text-black/72">
              {orderNumber}
            </p>
            <p className="supporting-copy mt-8 max-w-[420px] text-black/62">
              Your order has been saved. You can follow its status from your
              account orders page.
            </p>
          </div>

          <aside className="h-fit border border-black/16 p-6 text-[9px] uppercase tracking-[0.16em]">
            <p className="border-b border-black/16 pb-5 text-black/72">
              Order summary
            </p>
            <div className="grid gap-5 border-b border-black/16 py-6 text-black/58">
              <div className="flex items-center justify-between gap-5">
                <span>Status</span>
                <span className="text-black">{getOrderStatusLabel(status)}</span>
              </div>
              <div className="flex items-center justify-between gap-5">
                <span>Total</span>
                <span className="text-black">
                  {currency} {total}
                </span>
              </div>
            </div>
            <div className="mt-6 grid gap-4">
              <Link
                className="add-to-cart-label flex justify-center bg-black px-5 py-4 text-[#ecece5] transition-opacity duration-300 hover:opacity-80"
                href="/collections"
              >
                Continue shopping →
              </Link>
              <Link
                className="mx-auto w-fit border-b border-black/50 pb-1 text-black/64"
                href="/"
              >
                Back home
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
