import type { Metadata } from "next";
import { CheckoutClient } from "./CheckoutClient";

export const metadata: Metadata = {
  description: "Complete a secure guest or account order with LOW SIGNAL.",
  robots: { index: false, follow: false },
  title: "Checkout / LOW SIGNAL",
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
