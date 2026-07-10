import { requireAccountSession } from "@/lib/account";
import { CartPageClient } from "./CartPageClient";

export default async function CartPage() {
  await requireAccountSession("/cart");

  return <CartPageClient />;
}
