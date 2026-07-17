import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MobileHomeHeader } from "@/components/MobileHomeHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  getProductBySlug,
  getProductSlugs,
  getRelatedProduct,
} from "@/lib/shop";
import { ProductPurchasePanel } from "./ProductPurchasePanel";
import { ProductGallery } from "./ProductGallery";

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
    alternates: product
      ? { canonical: `/products/${product.slug}` }
      : undefined,
    description: product?.description ?? "LOW SIGNAL garment.",
    openGraph: product
      ? {
          description: product.description,
          images: [{ alt: product.name, url: product.image }],
          title: `${product.name} / LOW SIGNAL`,
          type: "website" as const,
          url: `/products/${product.slug}`,
        }
      : undefined,
    title: product ? `${product.name} / LOW SIGNAL` : "Product / LOW SIGNAL",
    twitter: product
      ? {
          card: "summary_large_image" as const,
          description: product.description,
          images: [product.image],
          title: `${product.name} / LOW SIGNAL`,
        }
      : undefined,
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
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      brand: {
        "@type": "Brand",
        name: "LOW SIGNAL",
      },
      color: product.color,
      description: product.description,
      image: gallery.map((image) => image.src),
      material: product.materials,
      name: product.name,
      offers: {
        "@type": "Offer",
        availability:
          (product.stock ?? 0) > 0
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        price: product.price,
        priceCurrency: "USD",
        url: `https://low-signal-nine.vercel.app/products/${product.slug}`,
      },
      sku: product.id,
      url: `https://low-signal-nine.vercel.app/products/${product.slug}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          item: "https://low-signal-nine.vercel.app/collections",
          name: "Collections",
          position: 1,
        },
        {
          "@type": "ListItem",
          item: `https://low-signal-nine.vercel.app/collections/${product.gender}`,
          name: product.gender,
          position: 2,
        },
        {
          "@type": "ListItem",
          item: `https://low-signal-nine.vercel.app/products/${product.slug}`,
          name: product.name,
          position: 3,
        },
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-[#e7e7e1] text-[#141311]">
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replaceAll("<", "\\u003c"),
        }}
        type="application/ld+json"
      />
      <MobileHomeHeader mode="paper" />

      <section className="mobile-product-page grid px-5 pb-28 pt-[92px] lg:min-h-screen lg:grid-cols-[58%_42%] lg:px-0 lg:pb-0 lg:pt-[64px]">
        <ProductGallery
          imageFit={getProductImageFit(product)}
          images={gallery}
          objectPosition={product.objectPosition ?? "object-center"}
          productName={product.name}
        />

        <div className="mobile-product-information flex flex-col justify-between border-black/16 pt-10 lg:border-t-0 lg:bg-[#ddddd6] lg:px-12 lg:py-12 xl:px-16">
          <div>
            <nav aria-label="Product breadcrumb" className="flex items-center justify-between border-b border-black/16 pb-6 text-[9px] uppercase tracking-[0.14em] text-black/64">
              <Link className="border-b border-black/30 pb-1" href="/collections">
                Collections / Spring 2026
              </Link>
              <Link className="border-b border-black/30 pb-1" href={`/collections/${product.gender}`}>
                {product.gender} / {product.category}
              </Link>
            </nav>

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

      {relatedProduct ? (
        <section className="border-t border-black/16 bg-[#deded7] px-5 py-12 sm:px-6 lg:px-12 lg:py-16">
          <div className="mx-auto max-w-[1500px]">
            <div className="flex items-center justify-between border-b border-black/16 pb-5 text-[9px] uppercase tracking-[0.16em] text-black/50">
              <span>Related product</span>
              <span>Same rail / {relatedProduct.category}</span>
            </div>
            <Link
              className="group mt-6 grid gap-5 sm:grid-cols-[minmax(260px,440px)_1fr] sm:items-end"
              href={`/products/${relatedProduct.slug}`}
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[#cacbc5]">
                <Image
                  alt={relatedProduct.name}
                  className={`object-cover brightness-[0.88] contrast-[1.04] saturate-[0.7] transition duration-700 group-hover:scale-[1.015] ${relatedProduct.objectPosition ?? "object-center"}`}
                  fill
                  sizes="(min-width: 640px) 440px, 100vw"
                  src={relatedProduct.image}
                />
              </div>
              <div className="border-y border-black/16 py-7 uppercase">
                <h2 className="controlled-display-title text-[44px] sm:text-[62px]">
                  {relatedProduct.name}
                </h2>
                <div className="mt-7 flex items-center justify-between gap-5 text-[10px] tracking-[0.16em]">
                  <span>${relatedProduct.price}</span>
                  <span className="border-b border-black/55 pb-2">View product →</span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      ) : null}
      <SiteFooter />
    </main>
  );
}

function getProductImageFit(product: { category: string }) {
  if (product.category === "Accessories") {
    return "object-contain p-10";
  }

  return "object-cover";
}
