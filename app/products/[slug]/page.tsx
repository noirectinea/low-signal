import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MobileHomeHeader } from "@/components/MobileHomeHeader";
import {
  getProductBySlug,
  getProductSlugs,
  getRelatedProduct,
} from "@/lib/shop";
import { ProductPurchasePanel } from "./ProductPurchasePanel";

export const dynamicParams = true;

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const slugs = await getProductSlugs();

  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  return {
    title: product ? `${product.name} / LOW SIGNAL` : "Product / LOW SIGNAL",
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const detailImages = product.images?.length ? product.images : [];
  const gallery = [
    {
      alt: product.name,
      src: product.image,
    },
    ...detailImages
      .filter((image) => image.src !== product.image)
      .slice(0, 2)
      .map((image) => ({
        alt: image.alt,
        src: image.src,
      })),
    {
      alt: "LOW SIGNAL fabric detail",
      src: "/images/low-signal/selected-collection/material-detail.png",
    },
    {
      alt: "LOW SIGNAL material detail",
      src: "/images/low-signal/journal/fabric-detail.jpg",
    },
  ].slice(0, 3);
  const relatedProduct = await getRelatedProduct(product);

  return (
    <main className="min-h-screen bg-[#e7e7e1] text-[#141311]">
      <MobileHomeHeader mode="paper" />

      <section className="mobile-product-page grid px-5 pb-28 pt-[92px] lg:min-h-screen lg:grid-cols-[58%_42%] lg:px-0 lg:pb-0 lg:pt-[64px]">
        <div className="mobile-product-gallery grid gap-4 lg:grid-cols-[104px_1fr] lg:border-r lg:border-black/16 lg:p-8 xl:grid-cols-[124px_1fr] xl:p-10">
          <div className="mobile-product-thumbnails order-2 grid grid-cols-3 gap-3 lg:order-1 lg:grid-cols-1">
            {gallery.map((image) => (
              <div
                className="relative aspect-[4/5] overflow-hidden border border-black/12 bg-[#d0d0c8]"
                key={image.src}
              >
                <Image
                  alt={image.alt}
                  src={image.src}
                  fill
                  sizes="(min-width: 1024px) 124px, 30vw"
                  className="object-cover brightness-[0.88] contrast-[1.04] saturate-[0.68]"
                />
              </div>
            ))}
          </div>

          <div className="mobile-product-lead relative order-1 min-h-[68vh] overflow-hidden border border-black/12 bg-[#d0d0c8] lg:order-2 lg:min-h-0">
            <Image
              alt={product.name}
              src={product.image}
              fill
              priority
              sizes="(min-width: 1024px) 48vw, 100vw"
              className={`${getProductImageFit(product)} brightness-[0.9] contrast-[1.04] saturate-[0.68] ${
                product.objectPosition ?? "object-center"
              }`}
            />
            <div className="absolute inset-0 bg-[#171614]/[0.03]" />
            <span className="absolute bottom-4 right-4 bg-black/62 px-3 py-2 text-[12px] uppercase tracking-[0.12em] text-white lg:hidden">01 / {String(gallery.length).padStart(2, "0")}</span>
          </div>
        </div>

        <div className="mobile-product-information flex flex-col justify-between border-black/16 pt-10 lg:border-t-0 lg:bg-[#ddddd6] lg:px-12 lg:py-12 xl:px-16">
          <div>
            <div className="flex items-center justify-between border-b border-black/16 pb-6 text-[9px] uppercase tracking-[0.14em] text-black/64">
              <span>05 - Garment / Spring 2026</span>
              <span>
                {product.gender} / {product.category}
              </span>
            </div>

            <div className="border-b border-black/16 py-10">
              <h1 className="product-display-title max-w-[600px] text-[44px] text-black/94 sm:text-[62px] lg:text-[76px]">
                {product.name}
              </h1>
              <div className="mt-9 grid gap-4 text-[10px] uppercase tracking-[0.18em] sm:grid-cols-[1fr_auto] sm:items-end">
                <span>${product.price}</span>
                <div className="grid gap-2 text-left text-black/62 sm:text-right">
                  <span>{product.color ?? "Washed Black"}</span>
                  <span>{product.materials}</span>
                </div>
              </div>
            </div>

            <div className="border-b border-black/16 py-7">
              <p className="max-w-[460px] text-[10px] uppercase leading-[1.8] tracking-[0.14em] text-black/66">
                {product.description}
              </p>
            </div>

            <ProductPurchasePanel product={product} />

            <div className="divide-y divide-black/16 border-b border-black/16">
              <details className="group py-6 text-[9px] uppercase leading-[1.75] tracking-[0.15em] text-black/58">
                <summary className="flex cursor-pointer list-none items-center justify-between text-black">
                  <span>Details</span>
                  <span className="transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="mt-5 grid max-w-[520px] gap-4">
                  <p>{product.materials}</p>
                  <p>
                    A quiet everyday shape with room for layering and a washed
                    surface that softens through wear.
                  </p>
                </div>
              </details>

              <details className="group py-6 text-[9px] uppercase leading-[1.75] tracking-[0.15em] text-black/58">
                <summary className="flex cursor-pointer list-none items-center justify-between text-black">
                  <span>Shipping & Returns</span>
                  <span className="transition-transform duration-300 group-open:rotate-45">
                    +
                  </span>
                </summary>
                <div className="mt-5 grid max-w-[520px] gap-4">
                  <p>Ships in 2-4 days when available.</p>
                  <p>Returns accepted on unworn pieces within 14 days.</p>
                </div>
              </details>
            </div>
          </div>

          <div className="mt-10 grid gap-5 border-t border-black/16 pt-6 text-[9px] uppercase tracking-[0.18em] sm:grid-cols-[1fr_auto]">
            <Link
              href={`/collections/${product.gender}`}
              className="w-fit border-b border-black/60 pb-1"
            >
              Back to {product.gender} collection
            </Link>
            {relatedProduct && (
              <Link
                href={`/products/${relatedProduct.slug}`}
                className="w-fit border-b border-black/40 pb-1 text-black/54 sm:justify-self-end"
              >
                Related piece / {relatedProduct.name}
              </Link>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function getProductImageFit(product: { category: string }) {
  if (product.category === "Accessories") {
    return "object-contain p-10";
  }

  return "object-cover";
}
