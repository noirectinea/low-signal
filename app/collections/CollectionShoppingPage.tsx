"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { MobileHomeHeader } from "@/components/MobileHomeHeader";
import { ProductAddAction } from "@/components/ProductAddAction";
import { SiteFooter } from "@/components/SiteFooter";
import {
  type Product,
  type ProductGender,
  type ProductSize,
} from "@/data/products";
import { trackEcommerce } from "@/lib/analytics";

const categories = ["Outerwear", "Shirts", "Knitwear", "Trousers"] as const;
const materialOptions = [
  { key: "cotton", label: "Cotton", terms: ["cotton"] },
  { key: "wool", label: "Wool", terms: ["wool"] },
  { key: "canvas", label: "Canvas", terms: ["canvas"] },
  { key: "nylon", label: "Nylon", terms: ["nylon"] },
  { key: "twill", label: "Twill", terms: ["twill"] },
] as const;
const priceOptions = [
  { key: "under-150", label: "Under $150", max: 149, min: 0 },
  { key: "150-199", label: "$150 – $199", max: 199, min: 150 },
  { key: "200-plus", label: "$200+", max: Infinity, min: 200 },
] as const;
const sizeOrder = ["XS", "S", "M", "L", "XL"] as const;
const viewStorageKey = "low-signal-catalog-view";

type Category = (typeof categories)[number];
type MaterialFilter = (typeof materialOptions)[number]["key"];
type PriceFilter = (typeof priceOptions)[number]["key"];
type SortOrder = "newest" | "popular" | "price-asc" | "price-desc";
type ViewMode = "grid" | "list";

type AdvancedFilters = {
  color: string;
  material: MaterialFilter | "all";
  price: PriceFilter | "all";
  size: string;
};

const emptyFilters: AdvancedFilters = {
  color: "all",
  material: "all",
  price: "all",
  size: "all",
};

export function CollectionShoppingPage({
  gender,
  products,
}: Readonly<{
  gender: ProductGender;
  products: Product[];
}>) {
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all");
  const [advancedFilters, setAdvancedFilters] =
    useState<AdvancedFilters>(emptyFilters);
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [urlStateReady, setUrlStateReady] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const genderLabel = gender.toUpperCase();
  const filterCount = Object.values(advancedFilters).filter(
    (value) => value !== "all",
  ).length;

  const visibleProducts = useMemo(() => {
    const filtered = products
      .map((product, originalIndex) => ({ originalIndex, product }))
      .filter(({ product }) => {
        if (
          activeCategory !== "all" &&
          product.category !== activeCategory
        ) {
          return false;
        }
        if (
          advancedFilters.size !== "all" &&
          !getProductSizeOptions(product).some(
            (size) =>
              size.label === advancedFilters.size && size.stock > 0,
          )
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
        return true;
      });

    filtered.sort((first, second) => {
      if (sortOrder === "price-asc") {
        return first.product.price - second.product.price;
      }
      if (sortOrder === "price-desc") {
        return second.product.price - first.product.price;
      }
      if (sortOrder === "popular") {
        const stockDifference =
          getTotalStock(second.product) - getTotalStock(first.product);
        return stockDifference || second.product.price - first.product.price;
      }
      return first.originalIndex - second.originalIndex;
    });

    return filtered.map(({ product }) => product);
  }, [activeCategory, advancedFilters, products, sortOrder]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const category = params.get("type");
      const material = params.get("material");
      const price = params.get("price");
      const sort = params.get("sort");
      const storedView = window.localStorage.getItem(viewStorageKey);

      if (category === "all" || categories.includes(category as Category)) {
        setActiveCategory(category as Category | "all");
      }
      setAdvancedFilters({
        color: params.get("color") || "all",
        material: materialOptions.some((option) => option.key === material)
          ? (material as MaterialFilter)
          : "all",
        price: priceOptions.some((option) => option.key === price)
          ? (price as PriceFilter)
          : "all",
        size: params.get("size") || "all",
      });
      if (
        sort === "popular" ||
        sort === "price-asc" ||
        sort === "price-desc" ||
        sort === "newest"
      ) {
        setSortOrder(sort);
      }
      if (storedView === "grid" || storedView === "list") {
        setViewMode(storedView);
      }
      setUrlStateReady(true);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!urlStateReady) {
      return;
    }
    const params = new URLSearchParams();
    if (activeCategory !== "all") params.set("type", activeCategory);
    if (advancedFilters.size !== "all") params.set("size", advancedFilters.size);
    if (advancedFilters.color !== "all") params.set("color", advancedFilters.color);
    if (advancedFilters.material !== "all") {
      params.set("material", advancedFilters.material);
    }
    if (advancedFilters.price !== "all") params.set("price", advancedFilters.price);
    if (sortOrder !== "newest") params.set("sort", sortOrder);
    const query = params.toString();
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${query ? `?${query}` : ""}`,
    );
  }, [activeCategory, advancedFilters, sortOrder, urlStateReady]);

  useEffect(() => {
    if (!isFilterOpen) {
      return;
    }
    const previousOverflow = document.documentElement.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;
    document.documentElement.style.overflow = "hidden";
    const handleKeyboard = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsFilterOpen(false);
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
  }, [isFilterOpen]);

  function chooseView(nextView: ViewMode) {
    setViewMode(nextView);
    window.localStorage.setItem(viewStorageKey, nextView);
  }

  return (
    <main className="min-h-screen bg-[#e5e6e1] text-[#121211]">
      <MobileHomeHeader mode="paper" />

      <section className="mobile-catalog-shell mx-auto max-w-[1760px] px-4 pb-14 pt-[82px] sm:px-6 lg:px-10 lg:pt-[90px] xl:px-14">
        <header className="mobile-catalog-header border-b border-black/16 pb-5">
          <CollectionBreadcrumb gender={gender} genderLabel={genderLabel} />
          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="fashion-rail-title text-[25vw] text-black/94 sm:text-[66px] lg:text-[82px] xl:text-[92px]">
                {genderLabel}
              </h1>
              <p className="mt-3 text-[10px] uppercase tracking-[0.14em] text-black/52">
                Spring 2026
              </p>
            </div>
          </div>
        </header>

        <CampaignRail gender={gender} />

        <CatalogToolbar
          activeCategory={activeCategory}
          filterCount={filterCount}
          onCategory={setActiveCategory}
          onFilters={() => setIsFilterOpen(true)}
          onSort={setSortOrder}
          onView={chooseView}
          productCount={visibleProducts.length}
          ready={urlStateReady}
          sortOrder={sortOrder}
          viewMode={viewMode}
        />

        {filterCount > 0 ? (
          <ActiveFilters
            filters={advancedFilters}
            onClear={() => setAdvancedFilters(emptyFilters)}
            resultCount={visibleProducts.length}
          />
        ) : null}

        <ProductCollection
          gender={gender}
          onClear={() => {
            setActiveCategory("all");
            setAdvancedFilters(emptyFilters);
          }}
          products={visibleProducts}
          viewMode={viewMode}
        />
      </section>

      {isFilterOpen ? (
        <FilterPanel
          activeFilters={advancedFilters}
          onChange={setAdvancedFilters}
          onClear={() => setAdvancedFilters(emptyFilters)}
          onClose={() => setIsFilterOpen(false)}
          panelRef={panelRef}
          products={products}
          resultCount={visibleProducts.length}
        />
      ) : null}

      <SiteFooter />
    </main>
  );
}

function CatalogToolbar({
  activeCategory,
  filterCount,
  onCategory,
  onFilters,
  onSort,
  onView,
  productCount,
  ready,
  sortOrder,
  viewMode,
}: Readonly<{
  activeCategory: Category | "all";
  filterCount: number;
  onCategory: (value: Category | "all") => void;
  onFilters: () => void;
  onSort: (value: SortOrder) => void;
  onView: (value: ViewMode) => void;
  productCount: number;
  ready: boolean;
  sortOrder: SortOrder;
  viewMode: ViewMode;
}>) {
  return (
    <div className="catalog-toolbar sticky top-[64px] z-30 -mx-4 grid grid-cols-2 border-y border-black/18 bg-[#e5e6e1]/96 px-4 backdrop-blur-sm sm:-mx-6 sm:grid-cols-[auto_auto_1fr_1fr_auto] sm:px-6 lg:static lg:mx-0 lg:px-0">
      <p className="flex min-h-12 items-center border-b border-black/12 text-[11px] uppercase tracking-[0.09em] sm:border-b-0 sm:pr-5">
        {String(productCount).padStart(2, "0")} pieces
      </p>
      <button
        className="flex min-h-12 items-center justify-between border-b border-l border-black/12 px-4 text-[11px] uppercase tracking-[0.09em] sm:border-b-0"
        disabled={!ready}
        onClick={onFilters}
        type="button"
      >
        <span>Filters{filterCount ? ` / ${filterCount}` : ""}</span>
        <span aria-hidden="true">+</span>
      </button>
      <label className="toolbar-select flex min-h-12 items-center border-black/12 sm:border-l">
        <span className="sr-only">Sort products</span>
        <select
          aria-label="Sort products"
          className="h-full w-full appearance-none bg-transparent px-0 pr-5 text-[11px] uppercase tracking-[0.07em] outline-none sm:px-4"
          disabled={!ready}
          onChange={(event) => onSort(event.target.value as SortOrder)}
          value={sortOrder}
        >
          <option value="newest">Sort: Newest</option>
          <option value="popular">Sort: Popular</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </label>
      <label className="toolbar-select flex min-h-12 items-center border-l border-black/12 pl-4 sm:pl-0">
        <span className="sr-only">Collection category</span>
        <select
          aria-label="Collection category"
          className="h-full w-full appearance-none bg-transparent pr-5 text-[11px] uppercase tracking-[0.07em] outline-none sm:px-4"
          disabled={!ready}
          onChange={(event) =>
            onCategory(event.target.value as Category | "all")
          }
          value={activeCategory}
        >
          <option value="all">Collection: All</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>
      <div
        aria-label="Product view"
        className="col-span-2 flex min-h-11 items-center justify-end gap-4 border-t border-black/12 sm:col-span-1 sm:min-h-12 sm:border-l sm:border-t-0 sm:pl-5"
        role="group"
      >
        <button
          aria-label="Grid view"
          aria-pressed={viewMode === "grid"}
          className={viewMode === "grid" ? "text-black" : "text-black/35"}
          disabled={!ready}
          onClick={() => onView("grid")}
          type="button"
        >
          <GridIcon />
        </button>
        <button
          aria-label="List view"
          aria-pressed={viewMode === "list"}
          className={viewMode === "list" ? "text-black" : "text-black/35"}
          disabled={!ready}
          onClick={() => onView("list")}
          type="button"
        >
          <ListIcon />
        </button>
      </div>
    </div>
  );
}

function CampaignRail({ gender }: Readonly<{ gender: ProductGender }>) {
  const railImage =
    gender === "women"
      ? "/images/low-signal/collections/spring-2026-women-rail.png"
      : "/images/low-signal/collections/spring-2026-rail.png";

  return (
    <div className="mobile-campaign-rail relative my-5 h-[150px] overflow-hidden border-y border-black/14 bg-[#d3d5cf] sm:h-[180px] lg:my-6 lg:h-[205px] xl:h-[225px]">
      <Image
        alt={`${gender} Spring 2026 editorial garment rail`}
        className="object-cover brightness-[0.76] contrast-[1.05] saturate-[0.55]"
        fill
        priority
        sizes="(min-width: 1024px) 94vw, 100vw"
        src={railImage}
      />
      <div className="absolute inset-0 bg-black/8" />
    </div>
  );
}

function ActiveFilters({
  filters,
  onClear,
  resultCount,
}: Readonly<{
  filters: AdvancedFilters;
  onClear: () => void;
  resultCount: number;
}>) {
  const labels = [
    filters.size !== "all" ? `Size ${filters.size}` : null,
    filters.color !== "all" ? filters.color : null,
    filters.material !== "all"
      ? materialOptions.find((item) => item.key === filters.material)?.label
      : null,
    filters.price !== "all"
      ? priceOptions.find((item) => item.key === filters.price)?.label
      : null,
  ].filter((label): label is string => Boolean(label));

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-black/14 py-3 text-[9px] uppercase tracking-[0.08em]">
      {labels.map((label) => (
        <span className="border-r border-black/20 pr-3 text-black/60" key={label}>
          {label}
        </span>
      ))}
      <span className="ml-auto text-black/48">
        {String(resultCount).padStart(2, "0")} found
      </span>
      <button className="border-b border-black/42 pb-1" onClick={onClear} type="button">
        Clear all
      </button>
    </div>
  );
}

function FilterPanel({
  activeFilters,
  onChange,
  onClear,
  onClose,
  panelRef,
  products,
  resultCount,
}: Readonly<{
  activeFilters: AdvancedFilters;
  onChange: (filters: AdvancedFilters) => void;
  onClear: () => void;
  onClose: () => void;
  panelRef: React.RefObject<HTMLDivElement | null>;
  products: Product[];
  resultCount: number;
}>) {
  const sizes = sortSizes(
    uniqueValues(
      products.flatMap((product) =>
        getProductSizeOptions(product).map((size) => size.label),
      ),
    ),
  );
  const colors = uniqueValues(products.map((product) => product.color));

  function update<Key extends keyof AdvancedFilters>(
    key: Key,
    value: AdvancedFilters[Key],
  ) {
    onChange({
      ...activeFilters,
      [key]: activeFilters[key] === value ? "all" : value,
    });
  }

  return (
    <>
      <button
        aria-label="Close filters"
        className="fixed inset-0 z-40 cursor-default bg-black/38"
        onClick={onClose}
        type="button"
      />
      <div
        aria-label="Collection filters"
        aria-modal="true"
        className="catalog-filter-panel fixed inset-x-0 bottom-0 z-50 grid max-h-[calc(100svh-64px)] grid-rows-[auto_1fr_auto] border-t border-black/24 bg-[#e5e6e1] sm:left-auto sm:right-0 sm:top-0 sm:h-svh sm:w-[min(440px,88vw)] sm:max-h-none sm:border-l sm:border-t-0"
        ref={panelRef}
        role="dialog"
      >
        <div className="flex min-h-14 items-center justify-between border-b border-black/16 px-5 text-[12px] uppercase tracking-[0.08em]">
          <span>{String(resultCount).padStart(2, "0")} pieces</span>
          <button className="min-h-11 border-b border-black/38" onClick={onClose} type="button">
            Close
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-3">
          <FilterGroup
            activeValue={activeFilters.size}
            label="Size"
            onSelect={(value) => update("size", value)}
            options={sizes.map((size) => ({ key: size, label: size }))}
          />
          <FilterGroup
            activeValue={activeFilters.color}
            label="Color"
            onSelect={(value) => update("color", value)}
            options={colors.map((color) => ({ key: color, label: color }))}
          />
          <FilterGroup
            activeValue={activeFilters.material}
            label="Material"
            onSelect={(value) => update("material", value)}
            options={materialOptions.map((material) => ({
              key: material.key,
              label: material.label,
            }))}
          />
          <FilterGroup
            activeValue={activeFilters.price}
            label="Price"
            onSelect={(value) => update("price", value)}
            options={priceOptions.map((price) => ({
              key: price.key,
              label: price.label,
            }))}
          />
        </div>

        <div className="grid grid-cols-[auto_1fr] gap-5 border-t border-black/16 bg-[#dedfd9] p-4 text-[11px] uppercase tracking-[0.08em]">
          <button className="min-h-12 border-b border-black/38" onClick={onClear} type="button">
            Clear all
          </button>
          <button
            className="min-h-12 bg-[#171614] px-5 text-[#ecece5]"
            onClick={() => {
              trackEcommerce("filter", { result_count: resultCount });
              onClose();
            }}
            type="button"
          >
            View {String(resultCount).padStart(2, "0")} pieces →
          </button>
        </div>
      </div>
    </>
  );
}

function FilterGroup<Value extends string>({
  activeValue,
  label,
  onSelect,
  options,
}: Readonly<{
  activeValue: Value | "all";
  label: string;
  onSelect: (value: Value) => void;
  options: Array<{ key: Value; label: string }>;
}>) {
  return (
    <fieldset className="border-b border-black/14 py-5">
      <legend className="mb-4 text-[10px] uppercase tracking-[0.1em] text-black/52">
        {label}
      </legend>
      <div className="flex flex-wrap gap-x-5 gap-y-2">
        {options.map((option) => (
          <button
            aria-pressed={activeValue === option.key}
            className={`min-h-10 border-b text-[11px] uppercase tracking-[0.07em] ${
              activeValue === option.key
                ? "border-black text-black"
                : "border-black/16 text-black/48"
            }`}
            key={option.key}
            onClick={() => onSelect(option.key)}
            type="button"
          >
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function ProductCollection({
  gender,
  onClear,
  products,
  viewMode,
}: Readonly<{
  gender: ProductGender;
  onClear: () => void;
  products: Product[];
  viewMode: ViewMode;
}>) {
  if (products.length === 0) {
    return (
      <div className="border-b border-black/14 py-14 text-[11px] uppercase tracking-[0.1em] text-black/58">
        <p>No garments found.</p>
        <button className="mt-5 border-b border-black/50 pb-1 text-black" onClick={onClear} type="button">
          Clear all
        </button>
      </div>
    );
  }

  return (
    <section
      aria-label={`${gender} products`}
      className={
        viewMode === "grid"
          ? "catalog-products grid grid-cols-2 gap-x-3 gap-y-9 pt-6 md:grid-cols-3 md:gap-x-5 xl:grid-cols-4 xl:gap-x-6"
          : "catalog-products catalog-list-view border-b border-black/14"
      }
    >
      {products.map((product, index) => (
        <ProductCard
          index={index}
          key={product.id}
          product={product}
          viewMode={viewMode}
        />
      ))}
    </section>
  );
}

function ProductCard({
  index,
  product,
  viewMode,
}: Readonly<{
  index: number;
  product: Product;
  viewMode: ViewMode;
}>) {
  const isList = viewMode === "list";

  return (
    <article
      className={`quiet-reveal group relative border-black/14 ${
        isList
          ? "grid min-h-[132px] grid-cols-[96px_minmax(0,1fr)_auto] items-center gap-4 border-t py-4 sm:grid-cols-[130px_minmax(0,1fr)_auto] sm:gap-7"
          : "min-w-0 border-b pb-4"
      }`}
      style={{ animationDelay: `${Math.min(index, 10) * 35}ms` }}
    >
      <Link
        aria-label={`Open ${product.name}`}
        className="absolute inset-0 z-10 focus:outline-none focus-visible:ring-1 focus-visible:ring-black"
        href={`/products/${product.slug}`}
      />

      <div
        className={`relative overflow-hidden border border-black/10 bg-[#d1d3cd] ${
          isList ? "aspect-[4/5] w-full" : "aspect-[4/5]"
        }`}
      >
        <Image
          alt={product.name}
          className={`product-image object-cover brightness-[0.86] contrast-[1.06] saturate-[0.62] transition-[filter,transform] duration-500 group-hover:scale-[1.025] group-hover:brightness-[0.79] ${
            product.objectPosition ?? "object-center"
          }`}
          fill
          priority={index < 2}
          sizes={
            isList
              ? "130px"
              : "(min-width: 1280px) 23vw, (min-width: 768px) 31vw, 48vw"
          }
          src={product.image}
        />
      </div>

      <div
        className={
          isList
            ? "min-w-0 uppercase"
            : "grid grid-cols-[1fr_auto] gap-3 pt-4 uppercase"
        }
      >
        <h2 className="text-[12px] font-normal tracking-[0.04em] text-black sm:text-[13px]">
          {product.name}
        </h2>
        <p className="mt-2 text-[9px] tracking-[0.08em] text-black/54 sm:text-[10px]">
          {product.category}
        </p>
        <p
          className={`text-[12px] font-normal tracking-[0.02em] text-black ${
            isList ? "mt-3" : "mt-3"
          }`}
        >
          ${product.price}
        </p>
      </div>

      <div
        className={`relative z-20 ${
          isList ? "self-center" : "absolute bottom-4 right-0"
        }`}
      >
        <ProductAddAction product={product} />
      </div>
    </article>
  );
}

function CollectionBreadcrumb({
  gender,
  genderLabel,
}: Readonly<{
  gender: ProductGender;
  genderLabel: string;
}>) {
  return (
    <nav
      aria-label="Collection path"
      className="flex items-center gap-3 text-[9px] uppercase tracking-[0.1em] text-black/58"
    >
      <Link className="border-b border-black/18 pb-1" href="/collections">
        Collections
      </Link>
      <span className="h-px w-5 bg-black/22" />
      <Link className="border-b border-black/46 pb-1 text-black" href={`/collections/${gender}`}>
        {genderLabel}
      </Link>
    </nav>
  );
}

function GridIcon() {
  return (
    <span aria-hidden="true" className="grid h-4 w-4 grid-cols-2 gap-[2px]">
      <span className="border border-current" />
      <span className="border border-current" />
      <span className="border border-current" />
      <span className="border border-current" />
    </span>
  );
}

function ListIcon() {
  return (
    <span aria-hidden="true" className="grid h-4 w-4 content-center gap-[3px]">
      <span className="h-px bg-current" />
      <span className="h-px bg-current" />
      <span className="h-px bg-current" />
    </span>
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
  ).sort((first, second) => first.localeCompare(second));
}

function sortSizes(sizes: string[]) {
  return sizes.sort((first, second) => {
    const firstIndex = sizeOrder.indexOf(first as (typeof sizeOrder)[number]);
    const secondIndex = sizeOrder.indexOf(second as (typeof sizeOrder)[number]);
    if (firstIndex === -1 || secondIndex === -1) {
      return first.localeCompare(second);
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

function getTotalStock(product: Product) {
  return getProductSizeOptions(product).reduce(
    (total, size) => total + size.stock,
    0,
  );
}
