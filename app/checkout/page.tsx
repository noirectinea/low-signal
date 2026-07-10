import { requireAccountSession } from "@/lib/account";
import { CheckoutClient } from "./CheckoutClient";

export default async function CheckoutPage() {
  await requireAccountSession("/checkout");

  return <CheckoutClient />;
}
