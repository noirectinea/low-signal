"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import { PublicFooter } from "@/components/PublicFooter";
import { PublicNavigation } from "@/components/PublicNavigation";
import {
  cartStorageKey,
  type CartItem,
  type Product,
  type ProductGender,
  type ProductSize,
} from "@/data/products";
import { getAvailabilityState } from "@/lib/availability";

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

type AdvancedFilters = {
  color: string;
  material: MaterialFilter | "all";
  price: PriceFilter | "all";
  size: string;
};

function readCartSnapshot() {
  if (typeof window === "undefined") {
    return "[]";
  }

  return window.localStorage.getItem(cartStorageKey) ?? "[]";
}

function subscribeCartStore(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("storage", onStoreChange);
  window.addEventListener("low-signal-cart", onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("low-signal-cart", onStoreChange);
  };
}

function parseCart(snapshot: string): CartItem[] {
  try {
    return JSON.parse(snapshot) as CartItem[];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(cartStorageKey, JSON.stringify(items));
  window.dispatchEvent(new Event("storage"));
  window.dispatchEvent(new Event("low-signal-cart"));
}

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
  const cartSnapshot = useSyncExternalStore(
    subscribeCartStore,
    readCartSnapshot,
    () => "[]",
  );
  const cartItems = useMemo(() => parseCart(cartSnapshot), [cartSnapshot]);
  const genderLabel = gender.toUpperCase();
  const allLabel = `All ${gender}`;
  const collectionNote =
    gender === "men"
      ? "Dark outerwear, knit layers, wide trousers, and daily uniforms."
      : "Soft structure, washed layers, quiet volume, and daily uniforms.";
  const advancedFilterCount = Object.values(advancedFilters).filter(
    (value) => value !== "all",
  ).length;
  const visibleProducts = useMemo(() => {
    const categoryProducts =
      activeCategory === "all"
        ? products
        : products.filter((product) => product.category === activeCategory);

    return categoryProducts.filter((product) => {
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

      return true;
    });
  }, [activeCategory, advancedFilters, products]);

  function clearAdvancedFilters() {
    setAdvancedFilters({
      color: "all",
      material: "all",
      price: "all",
      size: "all",
    });
  }

  function addToCart(product: Product, size: string) {
    const items = parseCart(readCartSnapshot());
    const cartItemId = getCartItemId(product, size);
    const selectedSize = getProductSizeOptions(product).find(
      (option) => option.label === size,
    );
    const selectedStock = selectedSize?.stock ?? 1;
    const current = items.find((item) => item.id === cartItemId);

    const nextItems = current
      ? items.map((item) =>
          item.id === cartItemId
            ? {
                ...item,
                quantity: Math.min(item.quantity + 1, selectedStock),
              }
            : item,
        )
      : [
          ...items,
          {
            ...product,
            id: cartItemId,
            productId: product.id,
            quantity: 1,
            size,
            variantId: selectedSize?.variantId ?? selectedSize?.id,
          },
        ];

    writeCart(nextItems);
  }

  function changeCartQuantity(product: Product, size: string, delta: number) {
    const items = parseCart(readCartSnapshot());
    const cartItemId = getCartItemId(product, size);
    const selectedStock =
      getProductSizeOptions(product).find((option) => option.label === size)
        ?.stock ?? 1;

    writeCart(
      items
        .map((item) =>
          item.id === cartItemId
            ? {
                ...item,
                quantity: Math.min(
                  Math.max(0, item.quantity + delta),
                  selectedStock,
                ),
              }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#e5e6e1] text-[#121211]">
      <PublicNavigation />

      <section className="mx-auto max-w-[1760px] px-4 pb-16 pt-[86px] sm:px-6 lg:px-10 lg:pt-[94px] xl:px-14">
        <header
          className={`grid gap-7 border-b border-black/16 lg:grid-cols-[1fr_minmax(300px,470px)] lg:items-end ${
            gender === "women" ? "pb-4" : "pb-5"
          }`}
        >
          <div>
            <CollectionBreadcrumb gender={gender} genderLabel={genderLabel} />
            <h1 className="fashion-rail-title mt-4 max-w-[480px] text-[46px] text-black/94 sm:text-[62px] lg:text-[76px] xl:text-[84px]">
              {genderLabel}
            </h1>
            <p className="micro-label mt-3 text-black/58">
              Spring 2026 / {String(products.length).padStart(2, "0")} pieces
            </p>
          </div>

          <p className="supporting-copy max-w-[470px] text-black/64 lg:justify-self-end">
            {collectionNote}
          </p>
        </header>

        <MobileFilters
          activeCategory={activeCategory}
          advancedFilterCount={advancedFilterCount}
          advancedFilters={advancedFilters}
          allLabel={allLabel}
          clearAdvancedFilters={clearAdvancedFilters}
          products={products}
          setAdvancedFilters={setAdvancedFilters}
          setActiveCategory={setActiveCategory}
        />

        <div className={gender === "women" ? "pt-5" : "pt-8"}>
          <ProductGrid
            onAdd={addToCart}
            onQuantity={changeCartQuantity}
            products={visibleProducts}
            cartItems={cartItems}
            title={genderLabel}
            gender={gender}
          />
        </div>
      </section>
      <PublicFooter />
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

function MobileFilters({
  activeCategory,
  advancedFilterCount,
  advancedFilters,
  allLabel,
  clearAdvancedFilters,
  products,
  setAdvancedFilters,
  setActiveCategory,
}: Readonly<{
  activeCategory: Category | "all";
  advancedFilterCount: number;
  advancedFilters: AdvancedFilters;
  allLabel: string;
  clearAdvancedFilters: () => void;
  products: Product[];
  setAdvancedFilters: (filters: AdvancedFilters) => void;
  setActiveCategory: (category: Category | "all") => void;
}>) {
  return (
    <details className="group/filters border-b border-black/16 py-5 text-[10px] font-medium uppercase tracking-[0.12em]">
      <summary className="flex cursor-pointer list-none items-center justify-between text-black/62">
        <span>
          Filters
          {advancedFilterCount > 0 ? ` / ${advancedFilterCount}` : ""}
        </span>
        <span className="text-[13px] leading-none group-open/filters:hidden">+</span>
        <span className="hidden text-[13px] leading-none group-open/filters:inline">−</span>
      </summary>
      <div className="mt-6 grid gap-7 lg:grid-cols-[minmax(220px,0.7fr)_1.3fr]">
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
    </details>
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
  const visibleFilters = filters.filter((filter) => filter.count > 0);

  return (
    <div className="text-[9px] uppercase tracking-[0.18em]">
      <div className="mb-5 flex items-center justify-between text-black/52">
        <span>Filters —</span>
        <span>{String(products.length).padStart(2, "0")} total</span>
      </div>

      <div className="divide-y divide-black/12 border-y border-black/12 transition-colors duration-300 hover:border-black/18">
        {visibleFilters.map((filter) => (
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
    <details className="group/advanced mt-7 border-y border-black/12 text-[8px] uppercase tracking-[0.16em] transition-colors duration-300 hover:border-black/18">
      <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-black/58 transition-all duration-300 hover:px-2 hover:text-black">
        <span>
          More filters
          {filterCount > 0 ? ` / ${filterCount}` : ""}
        </span>
        <span className="text-[12px] leading-none group-open/advanced:hidden">+</span>
        <span className="hidden text-[12px] leading-none group-open/advanced:inline">−</span>
      </summary>

      <div className="border-t border-black/12">
        {filterCount > 0 ? (
          <button
            className="my-4 border-b border-black/40 pb-1 text-black/62 transition-opacity duration-300 hover:opacity-55"
            type="button"
            onClick={clearFilters}
          >
            Clear filters
          </button>
        ) : null}

        <div className="divide-y divide-black/12">
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
    </details>
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
    <details className="group/option">
      <summary className="flex cursor-pointer list-none items-center justify-between py-4 text-black/58 transition-all duration-300 hover:bg-black/[0.02] hover:px-2 hover:text-black">
        <span>
          {label}
          {activeLabel ? ` — ${activeLabel}` : ""}
        </span>
        <span className="text-[12px] leading-none group-open/option:hidden">+</span>
        <span className="hidden text-[12px] leading-none group-open/option:inline">−</span>
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
  gender,
  onAdd,
  onQuantity,
  products,
  title,
}: Readonly<{
  cartItems: CartItem[];
  gender: ProductGender;
  onAdd: (product: Product, size: string) => void;
  onQuantity: (product: Product, size: string, delta: number) => void;
  products: Product[];
  title: string;
}>) {
  return (
    <section aria-label={`${title} product grid`}>
      <CampaignRail gender={gender} />

      {products.length > 0 ? (
        <div
          className={`grid grid-cols-2 gap-x-3 sm:gap-x-5 md:grid-cols-3 lg:grid-cols-4 ${
            gender === "women" ? "gap-y-12 sm:gap-y-14" : "gap-y-9 sm:gap-y-10"
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
        <div className="border-y border-black/14 py-12 text-[9px] uppercase leading-[1.8] tracking-[0.18em] text-black/52">
          No garments match the selected filters.
        </div>
      )}
    </section>
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
      className={`relative overflow-hidden border-y border-black/14 bg-[#d3d5cf] ${
        gender === "women"
          ? "mb-8 h-[178px] sm:h-[212px] lg:h-[212px] xl:h-[238px]"
          : "mb-6 h-[160px] sm:h-[190px] lg:h-[180px] xl:h-[206px]"
      }`}
    >
      <Image
        alt="Spring 2026 rail garment details"
        className="object-cover brightness-[0.76] contrast-[1.05] saturate-[0.55]"
        fill
        sizes="(min-width: 1024px) 72vw, 100vw"
        src={railImage}
      />
      <div className="absolute inset-0 bg-black/18" />
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
  }

  return (
    <article
      className="quiet-reveal group relative min-w-0 border-b border-black/14 pb-4"
      style={{ animationDelay: `${Math.min(index, 10) * 45}ms` }}
    >
      <Link
        aria-label={`Open ${product.name}`}
        className="absolute inset-0 z-10 focus:outline-none focus-visible:ring-1 focus-visible:ring-black"
        href={`/products/${product.slug}`}
      />

      <div className="relative aspect-[4/5] overflow-hidden border border-black/10 bg-[#d1d3cd]">
        <Image
          alt={product.name}
          className={`product-image object-cover brightness-[0.86] contrast-[1.06] saturate-[0.62] transition-[filter,transform] ease-out group-hover:scale-[1.03] group-hover:brightness-[0.78] ${
            isWomen ? "duration-500" : "duration-700"
          } ${
            product.objectPosition ?? "object-center"
          }`}
          fill
          priority={index < 2}
          sizes="(min-width: 1280px) 18vw, (min-width: 1024px) 17vw, (min-width: 768px) 25vw, 48vw"
          src={product.image}
        />
        <div className="absolute inset-0 bg-black/0 transition duration-500 group-hover:bg-black/12" />
        <span className="absolute left-3 top-3 text-[8px] uppercase tracking-[0.18em] text-[#eceee8]/84 mix-blend-difference">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="absolute bottom-3 left-3 translate-y-2 border-b border-[#eceee8]/60 pb-1 text-[8px] uppercase tracking-[0.18em] text-[#eceee8]/0 transition duration-500 group-hover:translate-y-0 group-hover:text-[#eceee8]/86">
          View →
        </span>
      </div>

      {isSizePickerOpen && !cartItem ? (
        <div className="absolute bottom-[62px] right-0 z-30 w-full max-w-[220px] border border-black/18 bg-[#e5e6e1]/96 p-3 text-[8px] uppercase tracking-[0.14em] text-black shadow-none backdrop-blur-sm sm:bottom-[68px]">
          <div className="mb-3 flex items-center justify-between border-b border-black/14 pb-2 text-black/64">
            <span>Select size</span>
            <button
              aria-label={`Close size selector for ${product.name}`}
              className="text-black/58"
              type="button"
              onClick={() => setIsSizePickerOpen(false)}
            >
              x
            </button>
          </div>
          <div className="grid grid-cols-5 gap-px bg-black/14">
            {sizeOptions.map((size) => (
              <button
                className="bg-[#dedfd9] px-2 py-3 text-black/70 transition-colors duration-300 hover:bg-[#cfd0ca] hover:text-black disabled:cursor-not-allowed disabled:text-black/26"
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
                className="px-1 transition-opacity duration-300 hover:opacity-55"
                type="button"
                onClick={() => onQuantity(product, activeSize, -1)}
              >
                -
              </button>
              <span className="min-w-3 text-center">{cartItem.quantity}</span>
              <button
                aria-label={`Add one ${product.name}`}
                className="px-1 transition-opacity duration-300 hover:opacity-55 disabled:cursor-not-allowed disabled:opacity-30"
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
            aria-label={`Choose size for ${product.name}`}
            className={`relative z-20 self-end border-b border-black/18 px-1 pb-1 text-[18px] leading-none text-black/70 transition duration-300 ease-out hover:border-black/60 hover:text-black group-hover:text-black ${
              isWomen ? "group-hover:rotate-45" : ""
            } disabled:cursor-not-allowed disabled:opacity-30`}
            disabled={isSoldOut}
            type="button"
            onClick={() => setIsSizePickerOpen((isOpen) => !isOpen)}
          >
            {isSoldOut ? "—" : "+"}
          </button>
        )}
      </div>
    </article>
  );
}
