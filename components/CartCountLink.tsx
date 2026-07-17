"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-store";

export function CartCountLink({
  className,
  href = "/cart",
  onClick,
}: Readonly<{
  className?: string;
  href?: string;
  onClick?: () => void;
}>) {
  const { count } = useCart();

  return (
    <Link aria-label={`Cart, ${count} items`} className={className} href={href} onClick={onClick}>
      Cart ({count})
    </Link>
  );
}
