"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { MobileHomeHeader } from "@/components/MobileHomeHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  type CartItem,
  type Product,
  type ProductGender,
  type ProductSize,
} from "@/data/products";
import { getAvailabilityState } from "@/lib/availability";
import {
  addProductToCart,
  changeCartQuantity as updateCartQuantity,
  useCart,
} from "@/lib/cart-store";
import { trackEcommerce } from "@/lib/analytics";

const categories = ["Outerwear", "Shirts", "Knitwear", "Trousers"] as const;
const materialOptions = [
  {
    key: "cotton",
    label: "Cotton",
    terms: ["cotton"],
  },
  {
    key: "wool",
    label: "Wool",
    terms: ["wool"],
  },
  {
    key: "canvas",
    label: "Canvas",
    terms: ["canvas"],
  },
  {
    key: "nylon",
    label: "Nylon",
    terms: ["nylon"],
  },
  {
    key: "twill",
    label: "Twill",
    terms: ["twill"],
  },
] as const;
const priceOptions = [
  {
    key: "under-150",
    label: "Under $150",
    max: 149,
    min: 0,
  },
  {
    key: "150-199",
    label: "$150 - $199",
    max: 199,
    min: 150,
  },
  {
    key: "200-plus",
    label: "$200+",
    max: Infinity,
    min: 200,
  },
] as const;
const sizeOrder = ["XS", "S", "M", "L", "XL"] as const;

type Category = (typeof categories)[number];
type MaterialFilter = (typeof materialOptions)[number]["key"];
type PriceFilter = (typeof priceOptions)[number]["key"];
type SortOrder = "newest" | "price-asc" | "price-desc";

type AdvancedFilters = {
  color: string;
  material: MaterialFilter | "all";
  price: PriceFilter | "all";
  size: string;
};

export function CollectionShoppingPage({
  gender,
  products,
}: Readonly<{
  gender: ProductGender;
  products: Product[];
}>) {
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all");
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({
    color: "all",
    material: "all",
    price: "all",
    size: "all",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [mobilePanel, setMobilePanel] = useState<"filters" | "sort" | null>(null);
  const [urlStateReady, setUrlStateReady] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const { items: cartItems } = useCart();
  const genderLabel = gender.toUpperCase();
  const allLabel = `All ${gender}`;
  const collectionNote =
    gender === "men"
      ? "Dark outerwear, knit layers, wide trousers, and daily uniforms."
      : "Soft structure, washed layers, quiet volume, and daily uniforms.";
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const advancedFilterCount = Object.values(advancedFilters).filter(
    (value) => value !== "all",
  ).length;
  const totalFilterCount =
    advancedFilterCount + (activeCategory === "all" ? 0 : 1);
  const activeFilterLabels = [
    activeCategory !== "all" ? activeCategory : null,
    advancedFilters.size !== "all" ? `Size ${advancedFilters.size}` : null,
    advancedFilters.color !== "all" ? advancedFilters.color : null,
    advancedFilters.material !== "all"
      ? materialOptions.find((option) => option.key === advancedFilters.material)?.label
      : null,
    advancedFilters.price !== "all"
      ? priceOptions.find((option) => option.key === advancedFilters.price)?.label
      : null,
  ].filter((label): label is string => Boolean(label));
  const visibleProducts = useMemo(() => {
    const categoryProducts =
      activeCategory === "all"
        ? products
        : products.filter((product) => product.category === activeCategory);

    const filtered = categoryProducts.filter((product) => {
      if (
        advancedFilters.size !== "all" &&
        product.size !== advancedFilters.size
      ) {
        return false;
      }

      if (
        advancedFilters.color !== "all" &&
        product.color !== advancedFilters.color
      ) {
        return false;
      }

      if (
        advancedFilters.material !== "all" &&
        !productMatchesMaterial(product, advancedFilters.material)
      ) {
        return false;
      }

      if (
        advancedFilters.price !== "all" &&
        !productMatchesPrice(product, advancedFilters.price)
      ) {
        return false;
      }

      if (!normalizedSearchQuery) {
        return true;
      }

      const searchableText = [
        product.name,
        product.category,
        product.color,
        product.materials,
        product.description,
        String(product.price),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchableText.includes(normalizedSearchQuery);
    });

    return [...filtered].sort((first, second) => {
      if (sortOrder === "price-asc") return first.price - second.price;
      if (sortOrder === "price-desc") return second.price - first.price;
      return 0;
    });
  }, [activeCategory, advancedFilters, normalizedSearchQuery, products, sortOrder]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const category = params.get("type");
      const material = params.get("material");
      const price = params.get("price");
      const sort = params.get("sort");

      if (category === "all" || categories.includes(category as Category)) {
        setActiveCategory(category as Category | "all");
      }
      setAdvancedFilters({
        color: params.get("color") || "all",
        material:
          materialOptions.some((option) => option.key === material)
            ? (material as MaterialFilter)
            : "all",
        price:
          priceOptions.some((option) => option.key === price)
            ? (price as PriceFilter)
            : "all",
        size: params.get("size") || "all",
      });
      setSearchQuery(params.get("q") || "");
      if (sort === "price-asc" || sort === "price-desc" || sort === "newest") {
        setSortOrder(sort);
      }
      setUrlStateReady(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!urlStateReady) return;
    const params = new URLSearchParams();
    if (activeCategory !== "all") params.set("type", activeCategory);
    if (advancedFilters.size !== "all") params.set("size", advancedFilters.size);
    if (advancedFilters.color !== "all") params.set("color", advancedFilters.color);
    if (advancedFilters.material !== "all") params.set("material", advancedFilters.material);
    if (advancedFilters.price !== "all") params.set("price", advancedFilters.price);
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (sortOrder !== "newest") params.set("sort", sortOrder);
    const query = params.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${query ? `?${query}` : ""}`);
  }, [activeCategory, advancedFilters, searchQuery, sortOrder, urlStateReady]);

  useEffect(() => {
    if (!mobilePanel) return;
    const previousOverflow = document.documentElement.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;
    document.documentElement.style.overflow = "hidden";
    const handleKeyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobilePanel(null);
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          "button:not([disabled]), input:not([disabled]), a[href]",
        ),
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handleKeyboard);
    window.requestAnimationFrame(() => {
      panelRef.current?.querySelector<HTMLElement>("button")?.focus();
    });

    return () => {
      document.documentElement.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyboard);
      previousFocus?.focus();
    };
  }, [mobilePanel]);

  function clearAdvancedFilters() {
    setAdvancedFilters({
      color: "all",
      material: "all",
      price: "all",
      size: "all",
    });
  }

  function clearAllFilters() {
    setActiveCategory("all");
    clearAdvancedFilters();
    setSearchQuery("");
  }

  function addToCart(product: Product, size: string) {
    const selectedSize = getProductSizeOptions(product).find(
      (option) => option.label === size,
    );

    addProductToCart({
      product,
      size,
      sizeOption: selectedSize,
    });
    trackEcommerce("add_to_cart", {
      currency: "USD",
      item_id: product.id,
      item_name: product.name,
      size,
      value: product.price,
    });
  }

  function changeCartQuantity(product: Product, size: string, delta: number) {
    const cartItemId = getCartItemId(product, size);
    const selectedStock =
      getProductSizeOptions(product).find((option) => option.label === size)
        ?.stock ?? 1;

    updateCartQuantity(cartItemId, delta, selectedStock);
  }

  return (
    <main className="min-h-screen bg-[#e5e6e1] text-[#121211]">
      <MobileHomeHeader mode="paper" />

      <section className={`mobile-catalog-shell mobile-catalog-${gender} mx-auto max-w-[1760px] px-4 pb-16 pt-[86px] sm:px-6 lg:px-10 lg:pt-[94px] xl:px-14`}>
        <header
          className={`mobile-catalog-header grid gap-6 border-b border-black/16 lg:grid-cols-[1fr_minmax(320px,560px)] lg:items-end ${
            gender === "women" ? "pb-4" : "pb-5"
          }`}
        >
          <div>
            <CollectionBreadcrumb gender={gender} genderLabel={genderLabel} />
            <h1 className="fashion-rail-title mt-5 max-w-[480px] text-[25vw] text-black/94 sm:text-[62px] lg:text-[76px] xl:text-[84px]">
              {genderLabel}
            </h1>
            <p className="mt-3 text-[10px] uppercase tracking-[0.18em] text-black/50">
              Spring 2026 / {String(products.length).padStart(2, "0")} pieces
            </p>
          </div>

          <div className="grid gap-4 border-t border-black/12 pt-5 lg:border-t-0 lg:pt-0">
            <ProductSearch
              resultCount={visibleProducts.length}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />

            <div className="grid gap-4 text-[9px] uppercase tracking-[0.18em] text-black/56 sm:grid-cols-[auto_auto_auto] sm:items-center lg:justify-end">
              <span>
                {String(visibleProducts.length).padStart(2, "0")} Items
              </span>
              <span>Newest first</span>
              <ViewIcons />
            </div>
          </div>
        </header>

        <div className="lg:hidden">
          <FilterIntro gender={gender} note={collectionNote} />
          <div className="mobile-filter-bar sticky top-[64px] z-20 -mx-4 border-y border-black/16 bg-[#e5e6e1]/95 px-4 backdrop-blur-sm sm:-mx-6 sm:px-6">
            <button
              className="flex min-h-13 items-center justify-between pr-4 text-[12px] uppercase tracking-[0.14em]"
              type="button"
              onClick={() => setMobilePanel("filters")}
            >
              <span>Filters{totalFilterCount > 0 ? ` / ${totalFilterCount}` : ""}</span>
              <span>+</span>
            </button>
            <button
              className="flex min-h-13 items-center justify-between pl-4 text-[12px] uppercase tracking-[0.14em]"
              type="button"
              onClick={() => setMobilePanel("sort")}
            >
              <span>Sort / {sortOrder === "newest" ? "Newest" : sortOrder === "price-asc" ? "Price low" : "Price high"}</span>
              <span>+</span>
            </button>
          </div>
          {totalFilterCount > 0 ? (
            <div className="mobile-active-filters border-b border-black/14 py-3 text-[9px] uppercase tracking-[0.15em] text-black/58">
              <div className="flex items-center justify-between gap-4">
                <span>{String(visibleProducts.length).padStart(2, "0")} pieces</span>
                <button className="flex min-h-11 items-center border-b border-black/44 text-black" type="button" onClick={clearAllFilters}>Clear all</button>
              </div>
              <div aria-label="Selected filters" className="flex flex-wrap gap-2 pb-1">
                {activeFilterLabels.map((label) => (
                  <span className="border border-black/20 px-3 py-2 text-black/72" key={label}>
                    {label}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {mobilePanel ? (
            <MobileCatalogPanel
              activeCategory={activeCategory}
              advancedFilterCount={advancedFilterCount}
              advancedFilters={advancedFilters}
              allLabel={allLabel}
              clearAdvancedFilters={clearAdvancedFilters}
              onClose={() => setMobilePanel(null)}
              panel={mobilePanel}
              products={products}
              resultCount={visibleProducts.length}
              setAdvancedFilters={setAdvancedFilters}
              setActiveCategory={setActiveCategory}
              setSortOrder={setSortOrder}
              sortOrder={sortOrder}
              panelRef={panelRef}
            />
          ) : null}
        </div>

        <div
          className={`grid gap-8 lg:grid-cols-[220px_1fr] lg:gap-12 xl:grid-cols-[260px_1fr] xl:gap-16 ${
            gender === "women" ? "pt-5 lg:pt-5" : "pt-8"
          }`}
        >
          <aside className="hidden lg:block">
            <div className="sticky top-[104px]">
              <FilterIntro gender={gender} note={collectionNote} />
              <CategoryFilters
                activeCategory={activeCategory}
                allLabel={allLabel}
                products={products}
                setActiveCategory={setActiveCategory}
              />

              <AdvancedFilterPanel
                activeFilters={advancedFilters}
                clearFilters={clearAdvancedFilters}
                filterCount={advancedFilterCount}
                products={products}
                setActiveFilters={setAdvancedFilters}
              />
              {(advancedFilterCount > 0 || activeCategory !== "all" || searchQuery) ? (
                <button className="mt-5 border-b border-black/50 pb-1 text-[12px] uppercase tracking-[0.14em]" type="button" onClick={clearAllFilters}>Clear all</button>
              ) : null}
            </div>
          </aside>

          <ProductGrid
            collectionNote={collectionNote}
            genderLabel={genderLabel}
            onAdd={addToCart}
            onQuantity={changeCartQuantity}
            products={visibleProducts}
            cartItems={cartItems}
            searchQuery={searchQuery}
            title={genderLabel}
            totalProductCount={products.length}
            gender={gender}
            onClearAll={clearAllFilters}
          />
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}

function productMatchesMaterial(product: Product, material: MaterialFilter) {
  const option = materialOptions.find((item) => item.key === material);
  const text = product.materials.toLowerCase();

  return option?.terms.some((term) => text.includes(term)) ?? false;
}

function productMatchesPrice(product: Product, price: PriceFilter) {
  const option = priceOptions.find((item) => item.key === price);

  return option
    ? product.price >= option.min && product.price <= option.max
    : false;
}

function uniqueValues(values: Array<string | undefined>) {
  return Array.from(
    new Set(values.filter((value): value is string => Boolean(value))),
  ).sort((a, b) => a.localeCompare(b));
}

function sortSizes(sizes: string[]) {
  return sizes.sort((a, b) => {
    const firstIndex = sizeOrder.indexOf(a as (typeof sizeOrder)[number]);
    const secondIndex = sizeOrder.indexOf(b as (typeof sizeOrder)[number]);

    if (firstIndex === -1 || secondIndex === -1) {
      return a.localeCompare(b);
    }

    return firstIndex - secondIndex;
  });
}

function getProductSizeOptions(product: Product): ProductSize[] {
  return product.sizes?.length
    ? product.sizes
    : sizeOrder.map((label) => ({
        label,
        stock: label === product.size ? 9 : 4,
      }));
}

function getCartItemId(product: Product, size: string) {
  return `${product.id}-${size.toLowerCase()}`;
}

function ProductSearch({
  resultCount,
  searchQuery,
  setSearchQuery,
}: Readonly<{
  resultCount: number;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}>) {
  return (
    <div className="border-y border-black/14 py-3 text-[9px] uppercase tracking-[0.16em] transition-colors duration-300 focus-within:border-black/28">
      <label className="grid gap-2" htmlFor="collection-search">
        <span className="flex items-center justify-between text-black/52">
          <span>Search</span>
          <span>{String(resultCount).padStart(2, "0")} found</span>
        </span>

        <span className="grid grid-cols-[1fr_auto] items-center gap-3 border-b border-transparent transition-colors duration-300 focus-within:border-black/28">
          <input
            autoComplete="off"
            className="min-w-0 bg-transparent py-2 text-[16px] uppercase tracking-[0.12em] text-black outline-none placeholder:text-black/42 lg:py-1.5 lg:text-[11px] lg:tracking-[0.16em]"
            id="collection-search"
            placeholder="PRODUCT NAME..."
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
          {searchQuery ? (
            <button
              className="border-b border-black/40 pb-1 text-black/58 transition-opacity duration-300 hover:opacity-55"
              type="button"
              onClick={() => setSearchQuery("")}
            >
              Clear
            </button>
          ) : (
          <span className="text-black/50">Type</span>
          )}
        </span>
      </label>
    </div>
  );
}

function FilterIntro({
  gender,
  note,
}: Readonly<{
  gender: ProductGender;
  note: string;
}>) {
  return (
    <div className="mobile-filter-intro mb-6 border-y border-black/14 py-5 text-[9px] uppercase leading-[1.7] tracking-[0.18em] text-black/52 lg:mb-7">
      <p className="text-black/78">Spring 2026 {gender}</p>
      <p className="mt-4 max-w-[230px] text-black/50">{note}</p>
    </div>
  );
}

function CollectionBreadcrumb({
  gender,
  genderLabel,
}: Readonly<{
  gender: ProductGender;
  genderLabel: string;
}>) {
  const items = [
    {
      href: "/collections",
      label: "COLLECTIONS",
    },
    {
      href: "/collections",
      label: "SPRING 2026",
    },
    {
      href: `/collections/${gender}`,
      label: genderLabel,
    },
  ];

  return (
    <nav
      aria-label="Collection path"
      className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[9px] uppercase tracking-[0.2em] text-black/54"
    >
      {items.map((item, index) => (
        <span className="flex items-center gap-3" key={`${item.label}-${index}`}>
          {index > 0 ? <span className="h-px w-6 bg-black/24" /> : null}
          <Link
            className={`border-b pb-[5px] transition-opacity duration-300 hover:opacity-55 ${
              index === items.length - 1
                ? "border-black/50 text-black"
                : "border-black/18"
            }`}
            href={item.href}
          >
            {item.label}
          </Link>
        </span>
      ))}
    </nav>
  );
}

function MobileCatalogPanel({
  activeCategory,
  advancedFilterCount,
  advancedFilters,
  allLabel,
  clearAdvancedFilters,
  onClose,
  panel,
  products,
  resultCount,
  setAdvancedFilters,
  setActiveCategory,
  setSortOrder,
  sortOrder,
  panelRef,
}: Readonly<{
  activeCategory: Category | "all";
  advancedFilterCount: number;
  advancedFilters: AdvancedFilters;
  allLabel: string;
  clearAdvancedFilters: () => void;
  onClose: () => void;
  panel: "filters" | "sort";
  products: Product[];
  resultCount: number;
  setAdvancedFilters: (filters: AdvancedFilters) => void;
  setActiveCategory: (category: Category | "all") => void;
  setSortOrder: (value: SortOrder) => void;
  sortOrder: SortOrder;
  panelRef: React.RefObject<HTMLDivElement | null>;
}>) {
  return (
    <>
    <button
      aria-label="Close collection panel"
      className="fixed inset-0 z-[39] cursor-default bg-black/40"
      type="button"
      onClick={onClose}
    />
    <div ref={panelRef} aria-label={panel === "filters" ? "Collection filters" : "Collection sorting"} aria-modal="true" className="mobile-catalog-panel fixed inset-x-0 bottom-0 z-40 grid max-h-[calc(100svh-72px)] grid-rows-[auto_1fr_auto] border-t border-black/24 bg-[#e5e6e1] text-[#121211] shadow-[0_-20px_60px_rgba(0,0,0,0.16)]" role="dialog">
      <div className="flex min-h-14 items-center justify-between border-b border-black/16 px-5 text-[12px] uppercase tracking-[0.14em]">
        <span>{panel === "filters" ? `Filters${advancedFilterCount > 0 ? ` / ${advancedFilterCount}` : ""}` : "Sort garments"}</span>
        <button className="min-h-11 px-2" type="button" onClick={onClose}>Close</button>
      </div>
      <div className="overflow-y-auto px-5 py-6">
        {panel === "filters" ? (
          <div className="grid gap-7">
            <CategoryFilters
              activeCategory={activeCategory}
              allLabel={allLabel}
              products={products}
              setActiveCategory={setActiveCategory}
            />
            <AdvancedFilterPanel
              activeFilters={advancedFilters}
              clearFilters={clearAdvancedFilters}
              filterCount={advancedFilterCount}
              products={products}
              setActiveFilters={setAdvancedFilters}
            />
          </div>
        ) : (
          <div className="divide-y divide-black/14 border-y border-black/14 text-[12px] uppercase tracking-[0.14em]">
            {(["newest", "price-asc", "price-desc"] as const).map((value) => (
              <button className={`flex min-h-14 w-full items-center justify-between text-left ${sortOrder === value ? "text-black" : "text-black/50"}`} key={value} type="button" onClick={() => {
                setSortOrder(value);
                onClose();
              }}>
                <span>{value === "newest" ? "Newest first" : value === "price-asc" ? "Price: low to high" : "Price: high to low"}</span>
                <span>{sortOrder === value ? "●" : "○"}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="border-t border-black/16 bg-[#dedfd9] p-4">
        {panel === "filters" ? (
          <button className="flex min-h-14 w-full items-center justify-center bg-[#171614] px-5 text-[12px] uppercase tracking-[0.14em] text-[#ecece5]" type="button" onClick={() => {
            trackEcommerce("filter", {
              active_filters: advancedFilterCount,
              result_count: resultCount,
            });
            onClose();
          }}>
            Show {String(resultCount).padStart(2, "0")} pieces →
          </button>
        ) : null}
      </div>
    </div>
    </>
  );
}

function CategoryFilters({
  activeCategory,
  allLabel,
  products,
  setActiveCategory,
}: Readonly<{
  activeCategory: Category | "all";
  allLabel: string;
  products: Product[];
  setActiveCategory: (category: Category | "all") => void;
}>) {
  const filters: Array<{
    count: number;
    key: Category | "all";
    label: string;
  }> = [
    {
      count: products.length,
      key: "all",
      label: allLabel,
    },
    ...categories.map((category) => ({
      count: products.filter((product) => product.category === category)
        .length,
      key: category,
      label: category,
    })),
  ];

  return (
    <div className="text-[9px] uppercase tracking-[0.18em]">
      <div className="mb-5 flex items-center justify-between text-black/52">
        <span>Filters —</span>
        <span>{String(products.length).padStart(2, "0")} total</span>
      </div>

      <div className="divide-y divide-black/12 border-y border-black/12 transition-colors duration-300 hover:border-black/18">
        {filters.map((filter) => (
          <button
            className={`flex w-full items-center justify-between py-4 text-left transition-all duration-300 hover:bg-black/[0.025] hover:px-2 hover:opacity-70 ${
              activeCategory === filter.key
                ? "bg-black/[0.025] px-2 text-black"
                : "text-black/48"
            }`}
            key={filter.key}
            type="button"
            onClick={() => setActiveCategory(filter.key)}
          >
            <span>{filter.label}</span>
            <span>{String(filter.count).padStart(2, "0")}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function AdvancedFilterPanel({
  activeFilters,
  clearFilters,
  filterCount,
  products,
  setActiveFilters,
}: Readonly<{
  activeFilters: AdvancedFilters;
  clearFilters: () => void;
  filterCount: number;
  products: Product[];
  setActiveFilters: (filters: AdvancedFilters) => void;
}>) {
  const sizeOptions = sortSizes(
    uniqueValues(products.map((product) => product.size)),
  );
  const colorOptions = uniqueValues(products.map((product) => product.color));

  function updateFilter<Key extends keyof AdvancedFilters>(
    key: Key,
    value: AdvancedFilters[Key],
  ) {
    setActiveFilters({
      ...activeFilters,
      [key]: activeFilters[key] === value ? "all" : value,
    });
  }

  return (
    <div className="mt-7 border-y border-black/12 text-[8px] uppercase tracking-[0.16em] transition-colors duration-300 hover:border-black/18">
      <div className="flex min-h-12 items-center justify-between border-b border-black/12 text-black/58">
        <span>
          Refine selection
          {filterCount > 0 ? ` / ${filterCount}` : ""}
        </span>
        {filterCount > 0 ? (
          <button
            className="relative z-10 border-b border-black/40 pb-1 text-black/62 transition-opacity duration-300 hover:opacity-55"
            type="button"
            onClick={(event) => {
              event.preventDefault();
              clearFilters();
            }}
          >
            Clear
          </button>
        ) : (
          <span>Size / Color / Material / Price</span>
        )}
      </div>

      <div className="divide-y divide-black/12 border-t border-black/12">
        <OptionDisclosure
          activeValue={activeFilters.size}
          label="Size"
          options={sizeOptions.map((size) => ({
            count: products.filter((product) => product.size === size).length,
            key: size,
            label: size,
          }))}
          onSelect={(value) => updateFilter("size", value)}
        />
        <OptionDisclosure
          activeValue={activeFilters.color}
          label="Color"
          options={colorOptions.map((color) => ({
            count: products.filter((product) => product.color === color).length,
            key: color,
            label: color,
          }))}
          onSelect={(value) => updateFilter("color", value)}
        />
        <OptionDisclosure
          activeValue={activeFilters.material}
          label="Material"
          options={materialOptions.map((material) => ({
            count: products.filter((product) =>
              productMatchesMaterial(product, material.key),
            ).length,
            key: material.key,
            label: material.label,
          }))}
          onSelect={(value) => updateFilter("material", value)}
        />
        <OptionDisclosure
          activeValue={activeFilters.price}
          label="Price"
          options={priceOptions.map((price) => ({
            count: products.filter((product) =>
              productMatchesPrice(product, price.key),
            ).length,
            key: price.key,
            label: price.label,
          }))}
          onSelect={(value) => updateFilter("price", value)}
        />
      </div>
    </div>
  );
}

function OptionDisclosure<Value extends string>({
  activeValue,
  label,
  onSelect,
  options,
}: Readonly<{
  activeValue: Value | "all";
  label: string;
  onSelect: (value: Value) => void;
  options: Array<{
    count: number;
    key: Value;
    label: string;
  }>;
}>) {
  const activeLabel = options.find((option) => option.key === activeValue)
    ?.label;
  const visibleOptions = options.filter((option) => option.count > 0);

  return (
    <details className="group">
      <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-black/58 transition-all duration-300 hover:bg-black/[0.02] hover:px-2 hover:text-black">
        <span>
          {label}
          {activeLabel ? ` — ${activeLabel}` : ""}
        </span>
        <span className="text-[12px] leading-none transition-transform duration-300 group-open:rotate-45">
          +
        </span>
      </summary>
      <div className="grid pb-4">
        {visibleOptions.map((option) => (
          <button
            className={`flex items-center justify-between py-2 text-left transition-all duration-300 hover:px-2 hover:opacity-65 ${
              activeValue === option.key
                ? "px-2 text-black"
                : "text-black/46"
            }`}
            key={option.key}
            type="button"
            onClick={() => onSelect(option.key)}
          >
            <span>{option.label}</span>
            <span>{String(option.count).padStart(2, "0")}</span>
          </button>
        ))}
      </div>
    </details>
  );
}

function ProductGrid({
  cartItems,
  collectionNote,
  gender,
  genderLabel,
  onAdd,
  onQuantity,
  products,
  searchQuery,
  title,
  totalProductCount,
  onClearAll,
}: Readonly<{
  cartItems: CartItem[];
  collectionNote: string;
  gender: ProductGender;
  genderLabel: string;
  onAdd: (product: Product, size: string) => void;
  onQuantity: (product: Product, size: string, delta: number) => void;
  products: Product[];
  searchQuery: string;
  title: string;
  totalProductCount: number;
  onClearAll: () => void;
}>) {
  return (
    <section className="mobile-product-section" aria-label={`${title} product grid`}>
      <CollectionRailHeader
        gender={gender}
        genderLabel={genderLabel}
        note={collectionNote}
        productCount={totalProductCount}
      />
      <CampaignRail gender={gender} />

      {products.length > 0 ? (
        <div
          className={`mobile-product-grid grid grid-cols-12 gap-x-3 sm:grid-cols-2 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4 ${
            gender === "women" ? "gap-y-12 sm:gap-y-14" : "gap-y-10 sm:gap-y-10"
          }`}
        >
          {products.map((product, index) => (
              <ProductCard
                index={index}
              isWomen={gender === "women"}
              cartItems={cartItems}
              key={product.id}
              onAdd={onAdd}
              onQuantity={onQuantity}
              product={product}
            />
          ))}
        </div>
      ) : (
        <div className="border-y border-black/14 py-12 text-[12px] uppercase leading-[1.8] tracking-[0.14em] text-black/60">
          <p>No garments found
          {searchQuery.trim() ? ` for "${searchQuery.trim()}".` : "."}
          </p>
          <button className="mt-5 border-b border-black/50 pb-1 text-black" type="button" onClick={onClearAll}>Clear filters and search</button>
        </div>
      )}
    </section>
  );
}

function CollectionRailHeader({
  gender,
  genderLabel,
  note,
  productCount,
}: Readonly<{
  gender: ProductGender;
  genderLabel: string;
  note: string;
  productCount: number;
}>) {
  const isWomen = gender === "women";

  return (
    <div
      className={`mobile-collection-rail-header grid gap-3 border-b border-black/14 text-[9px] uppercase tracking-[0.18em] sm:grid-cols-[1fr_auto] sm:items-end ${
        isWomen ? "mb-3 pb-3" : "mb-4 pb-4"
      }`}
    >
      <div>
        <p
          className={
            isWomen
              ? "text-[10px] tracking-[0.2em] text-black/68"
              : "text-[18px] tracking-[0.08em] text-black sm:text-[22px]"
          }
        >
          {genderLabel}
        </p>
        <p className="mt-2 text-black/54">
          Spring 2026 / {String(productCount).padStart(2, "0")} pieces
        </p>
      </div>
      <p className="max-w-[360px] leading-[1.65] text-black/52 sm:text-right">
        {note}
      </p>
    </div>
  );
}

function CampaignRail({
  gender,
}: Readonly<{
  gender: ProductGender;
}>) {
  const railImage =
    gender === "women"
      ? "/images/low-signal/collections/spring-2026-women-rail.png"
      : "/images/low-signal/collections/spring-2026-rail.png";

  return (
    <div
      className={`mobile-campaign-rail relative overflow-hidden border-y border-black/14 bg-[#d3d5cf] ${
        gender === "women"
          ? "mb-8 h-[52svh] max-h-[360px] min-h-[238px] sm:h-[212px] lg:h-[212px] xl:h-[238px]"
          : "mb-7 h-[46svh] max-h-[330px] min-h-[218px] sm:h-[190px] lg:h-[180px] xl:h-[206px]"
      }`}
    >
      <Image
        alt="Spring 2026 rail garment details"
        className="object-cover brightness-[0.76] contrast-[1.05] saturate-[0.55]"
        fill
        priority
        sizes="(min-width: 1024px) 72vw, 100vw"
        src={railImage}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/42 via-black/10 to-black/16" />
      <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-4 text-[8px] uppercase tracking-[0.18em] text-[#eceee8]/82 sm:inset-x-5">
        <span>Spring 2026 rail</span>
        <span>Available online</span>
      </div>
    </div>
  );
}

function ProductCard({
  cartItems,
  index,
  isWomen,
  onAdd,
  onQuantity,
  product,
}: Readonly<{
  cartItems: CartItem[];
  index: number;
  isWomen: boolean;
  onAdd: (product: Product, size: string) => void;
  onQuantity: (product: Product, size: string, delta: number) => void;
  product: Product;
}>) {
  const sizeOptions = getProductSizeOptions(product);
  const firstAvailableSize =
    product.size ??
    sizeOptions.find((option) => option.stock > 0)?.label ??
    sizeOptions[0]?.label ??
    "M";
  const [isSizePickerOpen, setIsSizePickerOpen] = useState(false);
  const [showAddedToast, setShowAddedToast] = useState(false);
  const [selectedSize, setSelectedSize] = useState(firstAvailableSize);
  const productCartItems = cartItems.filter((item) =>
    item.id.startsWith(`${product.id}-`),
  );
  const cartItem =
    cartItems.find(
      (item) => item.id === getCartItemId(product, selectedSize),
    ) ?? productCartItems[0];
  const activeSize = cartItem?.size ?? selectedSize;
  const selectedStock =
    sizeOptions.find((option) => option.label === activeSize)?.stock ?? 0;
  const totalStock = sizeOptions.reduce((total, size) => total + size.stock, 0);
  const isSoldOut = getAvailabilityState(totalStock) === "sold_out";

  function addSelectedSize(size: string) {
    setSelectedSize(size);
    onAdd(product, size);
    setIsSizePickerOpen(false);
    setShowAddedToast(true);
  }

  return (
    <article
      className={`mobile-product-card quiet-reveal group relative min-w-0 border-b border-black/14 pb-4 sm:col-span-1 sm:col-start-auto ${
        index % 4 === 0
          ? "col-span-8"
          : index % 4 === 1
            ? "col-span-8 col-start-5"
            : index % 4 === 2
              ? "col-span-7"
              : "col-span-9 col-start-4"
      }`}
      style={{ animationDelay: `${Math.min(index, 10) * 45}ms` }}
    >
      <Link
        aria-label={`Open ${product.name}`}
        className="absolute inset-0 z-10 focus:outline-none focus-visible:ring-1 focus-visible:ring-black"
        href={`/products/${product.slug}`}
      />

      <div
        className={`relative overflow-hidden border border-black/10 bg-[#d1d3cd] ${
          index % 4 === 2 ? "aspect-[5/6]" : index % 4 === 3 ? "aspect-[4/5]" : "aspect-[3/4]"
        } sm:aspect-[4/5]`}
      >
        <Image
          alt={product.name}
          className={`product-image object-cover brightness-[0.86] contrast-[1.06] saturate-[0.62] transition-[filter,transform] ease-out group-hover:scale-[1.03] group-hover:brightness-[0.78] ${
            isWomen ? "duration-500" : "duration-700"
          } ${
            product.objectPosition ?? "object-center"
          }`}
          fill
          priority={index < 2}
          sizes="(min-width: 1280px) 18vw, (min-width: 1024px) 17vw, (min-width: 768px) 25vw, 74vw"
          src={product.image}
        />
        <div className="absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/12" />
        <span className="absolute left-3 top-3 text-[8px] uppercase tracking-[0.18em] text-[#eceee8]/84 mix-blend-difference">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="absolute bottom-3 left-3 translate-y-2 border-b border-[#eceee8]/60 pb-1 text-[8px] uppercase tracking-[0.18em] text-[#eceee8]/0 transition duration-500 group-hover:translate-y-0 group-hover:text-[#eceee8]/86">
          Open product →
        </span>
      </div>

      {isSizePickerOpen && !cartItem ? (
        <div className="mobile-size-picker absolute bottom-[62px] right-0 z-30 w-full max-w-[220px] border border-black/18 bg-[#e5e6e1]/96 p-3 text-[9px] uppercase tracking-[0.14em] text-black shadow-none backdrop-blur-sm sm:bottom-[68px]">
          <div className="mb-3 flex items-center justify-between border-b border-black/14 pb-2 text-black/64">
            <span>Select size</span>
            <button
              aria-label={`Close size selector for ${product.name}`}
              className="min-h-11 min-w-11 text-black/58"
              type="button"
              onClick={() => setIsSizePickerOpen(false)}
            >
              x
            </button>
          </div>
          <div className="grid grid-cols-5 gap-px bg-black/14">
            {sizeOptions.map((size) => (
              <button
                className="min-h-11 bg-[#dedfd9] px-2 py-3 text-black/70 transition-colors duration-300 hover:bg-[#cfd0ca] hover:text-black disabled:cursor-not-allowed disabled:text-black/26"
                disabled={size.stock <= 0}
                key={size.label}
                type="button"
                onClick={() => addSelectedSize(size.label)}
              >
                {size.label}
              </button>
            ))}
          </div>
          <p className="mt-3 text-black/52">
            {selectedStock > 0 ? "Tap size to add" : "Select available size"}
          </p>
        </div>
      ) : null}

      <div className="grid grid-cols-[1fr_auto] gap-3 pt-4 text-[9px] uppercase tracking-[0.16em]">
        <div className="min-w-0">
          <h2
            className={`truncate text-[12px] tracking-[0.09em] text-black transition-transform duration-300 ease-out ${
              isWomen ? "group-hover:-translate-y-0.5" : ""
            }`}
          >
            {product.name}
          </h2>
          <p className="mt-2 text-black/46">{product.category}</p>
          <p className="mt-3 text-[12px] tracking-[0.08em] text-black/92">
            ${product.price}
          </p>
        </div>

        {cartItem ? (
          <div className="relative z-20 self-end">
            <div className="flex items-center gap-3 border-b border-black/22 pb-1 text-[10px] text-black/76">
              <button
                aria-label={`Remove one ${product.name}`}
                className="min-h-11 min-w-11 px-1 transition-opacity duration-300 hover:opacity-55"
                type="button"
                onClick={() => onQuantity(product, activeSize, -1)}
              >
                -
              </button>
              <span className="min-w-3 text-center">{cartItem.quantity}</span>
              <button
                aria-label={`Add one ${product.name}`}
                className="min-h-11 min-w-11 px-1 transition-opacity duration-300 hover:opacity-55 disabled:cursor-not-allowed disabled:opacity-30"
                disabled={cartItem.quantity >= selectedStock}
                type="button"
                onClick={() => onQuantity(product, activeSize, 1)}
              >
                +
              </button>
            </div>
            <p className="mt-2 text-right text-[7px] tracking-[0.12em] text-black/48">
              {activeSize}
            </p>
          </div>
        ) : (
          <button
            aria-label={`Quick add ${product.name}; choose a size`}
            className="relative z-20 flex min-h-11 self-end items-center justify-center whitespace-nowrap border-b border-black/24 px-1 text-[8px] uppercase tracking-[0.11em] text-black/70 transition duration-300 ease-out hover:border-black/60 hover:text-black disabled:cursor-not-allowed disabled:opacity-30"
            disabled={isSoldOut}
            type="button"
            onClick={() => setIsSizePickerOpen((isOpen) => !isOpen)}
          >
            {isSoldOut ? "Sold out" : "Quick add +"}
          </button>
        )}
      </div>

      {showAddedToast ? (
        <div
          aria-live="polite"
          className="fixed inset-x-4 bottom-4 z-[80] grid gap-4 border border-white/12 bg-[#171614] p-5 text-[9px] uppercase tracking-[0.14em] text-[#ecece5] sm:left-auto sm:right-5 sm:w-[380px]"
        >
          <p>{product.name} / {selectedSize} added to cart.</p>
          <div className="flex items-center justify-between gap-5">
            <Link className="relative z-20 flex min-h-11 items-center border-b border-white/55" href="/cart">
              View cart
            </Link>
            <button
              className="relative z-20 min-h-11 border-b border-white/28 text-white/68"
              type="button"
              onClick={() => setShowAddedToast(false)}
            >
              Continue shopping
            </button>
          </div>
        </div>
      ) : null}
    </article>
  );
}

function ViewIcons() {
  return (
    <span className="hidden items-center gap-4 text-black/58 lg:flex">
      <span className="grid grid-cols-2 gap-[3px]" aria-label="Grid view">
        <span className="size-[5px] border border-black/62" />
        <span className="size-[5px] border border-black/62" />
        <span className="size-[5px] border border-black/62" />
        <span className="size-[5px] border border-black/62" />
      </span>
      <span className="grid gap-[3px]" aria-label="List view">
        <span className="h-[5px] w-[15px] border border-black/42" />
        <span className="h-[5px] w-[15px] border border-black/42" />
      </span>
    </span>
  );
}
