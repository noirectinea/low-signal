import { requireAccountSession } from "@/lib/account";
import { CartPageClient } from "./CartPageClient";

export default async function CartPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{
    guest?: string;
  }>;
}>) {
  const { guest } = await searchParams;

  if (guest !== "1") {
    await requireAccountSession("/cart");
  }

  return <CartPageClient />;
}
