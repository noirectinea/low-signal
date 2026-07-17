import type { Metadata } from "next";
import { CartPageClient } from "./CartPageClient";

export const metadata: Metadata = {
  description: "Review LOW SIGNAL garments, sizes, quantities, and order subtotal.",
  title: "Cart / LOW SIGNAL",
};

export default function CartPage() {
  return <CartPageClient />;
}
