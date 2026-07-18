"use client";

import Image from "next/image";
import Link from "next/link";
import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { MobileHomeHeader } from "@/components/MobileHomeHeader";
import { SiteFooter } from "@/components/SiteFooter";
import type { Product } from "@/data/products";
import { trackEcommerce } from "@/lib/analytics";

export function SearchClient({
  initialQuery,
  products,
}: {
  initialQuery: string;
  products: Product[];
}) {
  const [query, setQuery] = useState(initialQuery);
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = deferredQuery.trim().toLowerCase();
  const loading = query !== deferredQuery;
  const results = useMemo(
    () => searchProducts(products, normalizedQuery),
    [normalizedQuery, products],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const url = new URL(window.location.href);

      if (query.trim()) url.searchParams.set("q", query.trim());
      else url.searchParams.delete("q");

      window.history.replaceState({}, "", url);
    }, 180);

    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!normalizedQuery) return;
    const timer = window.setTimeout(() => {
      trackEcommerce("search", {
        result_count: results.length,
        search_term: normalizedQuery,
      });
    }, 350);

    return () => window.clearTimeout(timer);
  }, [normalizedQuery, results.length]);

  useEffect(() => {
    const onPopState = () => {
      setQuery(new URL(window.location.href).searchParams.get("q") ?? "");
    };

    window.addEventListener("popstate", onPopState);

    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return (
    <main className="min-h-screen bg-[#e5e6e1] text-[#121211]">
      <MobileHomeHeader mode="paper" />

      <section className="mx-auto max-w-[1600px] px-5 pb-20 pt-[96px] sm:px-6 lg:px-12 lg:pt-[112px]">
        <header className="grid gap-8 border-b border-black/16 pb-8 lg:grid-cols-[1fr_1.2fr] lg:items-end">
          <div>
            <p className="text-[9px] uppercase tracking-[0.18em] text-black/50">
              Search / Garment index
            </p>
            <h1 className="controlled-display-title mt-7 text-[54px] uppercase sm:text-[76px] lg:text-[92px]">
              Find a piece
            </h1>
          </div>

          <label className="grid gap-3 border-y border-black/18 py-5 text-[12px] uppercase tracking-[0.06em] text-black/68">
            <span>Product, category, material, or color</span>
            <span className="grid grid-cols-[1fr_auto] items-center gap-5">
              <input
                autoComplete="off"
                autoFocus
                className="min-w-0 bg-transparent py-2 text-[18px] uppercase tracking-[0.04em] text-black outline-none placeholder:text-black/46"
                name="q"
                placeholder="Search garments..."
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              {query ? (
                <button
                  className="min-h-11 border-b border-black/50 text-[12px] text-black"
                  type="button"
                  onClick={() => setQuery("")}
                >
                  Clear
                </button>
              ) : null}
            </span>
          </label>
        </header>

        <div
          aria-live="polite"
          className="grid min-h-14 grid-cols-[auto_1fr] items-center gap-6 border-b border-black/14 py-3 text-[11px] uppercase tracking-[0.06em] text-black/68 sm:text-[12px]"
        >
          <span className="whitespace-nowrap">
            {normalizedQuery
              ? `${String(results.length).padStart(2, "0")} results`
              : `${String(results.length).padStart(2, "0")} / All garments`}
          </span>
          <span className="text-right leading-[1.45] text-black/52">
            {loading ? "Searching..." : "Name / Type / Material / Color"}
          </span>
        </div>

        {!normalizedQuery ? (
          <div className="grid gap-6 border-b border-black/16 py-8 text-[10px] uppercase tracking-[0.14em] sm:grid-cols-[160px_1fr]">
            <span className="text-black/48">Suggestions</span>
            <div className="flex flex-wrap gap-x-7 gap-y-4">
              {["Jacket", "Knitwear", "Washed Black", "Cotton", "Trouser"].map(
                (suggestion) => (
                  <button
                    className="min-h-11 border-b border-black/45"
                    key={suggestion}
                    type="button"
                    onClick={() => setQuery(suggestion)}
                  >
                    {suggestion}
                  </button>
                ),
              )}
            </div>
          </div>
        ) : null}

        {normalizedQuery && !results.length ? (
          <div className="grid min-h-[360px] place-items-center border-b border-black/16 text-center">
            <div>
              <p className="text-[12px] uppercase tracking-[0.14em]">
                No garments found
              </p>
              <p className="mt-5 max-w-[340px] text-[9px] uppercase leading-[1.7] tracking-[0.15em] text-black/50">
                Try a product name, category, material, or color.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-10 py-8 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-5">
            {results.map((product, index) => (
              <Link
                className={`group grid min-w-0 border-b border-black/14 pb-4 ${
                  index % 4 === 1 ? "mt-5 lg:mt-8" : ""
                }`}
                href={`/products/${product.slug}`}
                key={product.id}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[#d1d2cc]">
                  <Image
                    alt={product.name}
                    className={`object-cover brightness-[0.88] contrast-[1.04] saturate-[0.7] transition duration-700 group-hover:scale-[1.015] ${product.objectPosition ?? "object-center"}`}
                    fill
                    loading={index === 0 ? "eager" : "lazy"}
                    sizes="(min-width: 1024px) 24vw, 48vw"
                    src={product.image}
                  />
                </div>
                <div className="mt-4 grid grid-cols-[1fr_auto] gap-3 uppercase tracking-[0.04em]">
                  <div>
                    <h2 className="text-[14px] font-medium">{product.name}</h2>
                    <p className="mt-2 text-[11px] text-black/64">
                      {product.category} / {product.color}
                    </p>
                  </div>
                  <span className="text-[14px] font-medium">${product.price}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
      <SiteFooter />
    </main>
  );
}

function searchProducts(products: Product[], query: string) {
  if (!query) return products;

  const terms = query.split(/\s+/).filter(Boolean);

  return products
    .map((product) => {
      const fields = [
        { value: product.name, weight: 100 },
        { value: product.category, weight: 60 },
        { value: product.materials, weight: 30 },
        { value: product.color, weight: 25 },
        { value: product.keywords?.join(" "), weight: 20 },
      ];
      let score = 0;

      for (const term of terms) {
        const termScore = fields.reduce((best, field) => {
          const value = field.value?.toLowerCase() ?? "";

          if (value === term) return Math.max(best, field.weight + 30);
          if (value.startsWith(term)) return Math.max(best, field.weight + 15);
          if (value.includes(term)) return Math.max(best, field.weight);

          return best;
        }, 0);

        if (!termScore) return null;
        score += termScore;
      }

      return { product, score };
    })
    .filter(
      (entry): entry is { product: Product; score: number } => entry !== null,
    )
    .sort(
      (first, second) =>
        second.score - first.score ||
        first.product.name.localeCompare(second.product.name),
    )
    .map((entry) => entry.product);
}
