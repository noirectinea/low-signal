import type { Metadata } from "next";
import { getProducts } from "@/lib/shop";
import { SearchClient } from "./SearchClient";

export const metadata: Metadata = {
  description:
    "Search LOW SIGNAL garments by name, category, material, and color.",
  title: "Search / LOW SIGNAL",
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const [{ q = "" }, products] = await Promise.all([
    searchParams,
    getProducts(),
  ]);

  return <SearchClient initialQuery={q} products={products} />;
}
