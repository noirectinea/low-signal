import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MobileHomeHeader } from "@/components/MobileHomeHeader";
import { SiteFooter } from "@/components/SiteFooter";
import {
  getProductBySlug,
  getProductSlugs,
  getRelatedProducts,
} from "@/lib/shop";
import { ProductPurchasePanel } from "./ProductPurchasePanel";
import { ProductGallery } from "./ProductGallery";

export const dynamicParams = true;

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    returnTo?: string;
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

export default async function ProductPage({
  params,
  searchParams,
}: ProductPageProps) {
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
  ].filter(
    (image, index, images) =>
      images.findIndex((candidate) => candidate.src === image.src) === index,
  );
  const relatedProducts = await getRelatedProducts(product, 3);
  const query = await searchParams;
  const fallbackCollection = `/collections/${product.gender}`;
  const returnTo = getSafeReturnTo(query.returnTo, fallbackCollection);
  const genderLabel = product.gender === "women" ? "Women" : "Men";
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

        <div className="mobile-product-information flex flex-col border-black/16 pt-6 lg:border-t-0 lg:bg-[#ddddd6] lg:px-10 lg:py-9 xl:px-14">
          <div>
            <nav aria-label="Product breadcrumb" className="flex items-center justify-between gap-4 border-b border-black/16 pb-3 text-[10px] uppercase tracking-[0.08em] text-black/68">
              <Link className="flex min-h-11 items-center border-b border-black/38" href={returnTo}>
                ← Back to {genderLabel}
              </Link>
              <span className="text-right text-black/48">{product.category}</span>
            </nav>

            <div className="border-b border-black/16 py-6 lg:py-8">
              <h1 className="product-display-title max-w-[600px] text-[38px] text-black/94 sm:text-[54px] lg:text-[62px]">
                {product.name}
              </h1>
              <div className="mt-5 grid gap-3 text-[13px] uppercase tracking-[0.05em] sm:grid-cols-[auto_1fr] sm:items-center">
                <span>${product.price}</span>
                <span className="text-black/58 sm:text-right">
                  {product.materials || product.color || "Washed material"}
                </span>
              </div>
            </div>

            <ProductPurchasePanel product={product} />

            <div className="divide-y divide-black/16 border-b border-black/16">
              <ProductDetail label="Product details">
                <p>{product.description}</p>
                <p>Relaxed everyday shape with room for a light layer.</p>
              </ProductDetail>
              <ProductDetail label="Size guide">
                <p>XS 28–30 / S 30–32 / M 32–34 / L 34–36 / XL 36–38.</p>
                <p>Measure a garment you wear often for the closest comparison.</p>
              </ProductDetail>
              <ProductDetail label="Material & care">
                <p>{product.materials}</p>
                <p>Wash cold and dry naturally. The surface softens through wear.</p>
              </ProductDetail>
              <ProductDetail label="Shipping & returns">
                <p>Ships in 2–4 days when available.</p>
                <p>Returns accepted on unworn pieces within 14 days.</p>
              </ProductDetail>
            </div>
          </div>
        </div>
      </section>

      {relatedProducts.length ? (
        <section className="related-products-section border-t border-black/16 bg-[#deded7] px-4 py-7 sm:px-6 lg:px-12 lg:py-9">
          <div className="mx-auto max-w-[1500px]">
            <div className="flex items-center justify-between border-b border-black/16 pb-4 text-[9px] uppercase tracking-[0.14em] text-black/50">
              <h2 className="font-normal text-black/72">Related products</h2>
              <span>{genderLabel} / Spring 2026</span>
            </div>
            <div className="related-products-rail mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain sm:grid sm:grid-cols-3 lg:gap-5">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  className="related-product-card group min-w-0 shrink-0 snap-start border-b border-black/14 pb-3"
                  href={`/products/${relatedProduct.slug}?returnTo=${encodeURIComponent(
                    returnTo,
                  )}`}
                  key={relatedProduct.id}
                >
                  <div className="related-product-image relative h-[190px] overflow-hidden bg-[#cacbc5] lg:h-[250px]">
                    <Image
                      alt={relatedProduct.name}
                      className={`object-cover brightness-[0.88] contrast-[1.04] saturate-[0.7] transition duration-700 group-hover:scale-[1.015] ${relatedProduct.objectPosition ?? "object-center"}`}
                      fill
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 32vw, 44vw"
                      src={relatedProduct.image}
                    />
                  </div>
                  <div className="mt-3 grid gap-2 uppercase">
                    <h3 className="text-[11px] font-normal tracking-[0.05em] sm:text-[12px]">
                      {relatedProduct.name}
                    </h3>
                    <span className="text-[10px] text-black/64">${relatedProduct.price}</span>
                  </div>
                </Link>
              ))}
            </div>
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

function ProductDetail({
  children,
  label,
}: Readonly<{
  children: React.ReactNode;
  label: string;
}>) {
  return (
    <details className="group py-2 text-[12px] uppercase leading-[1.55] tracking-[0.05em] text-black/68">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between text-[11px] text-black">
        <span>{label}</span>
        <span className="transition-transform duration-300 group-open:rotate-45">+</span>
      </summary>
      <div className="grid max-w-[520px] gap-3 pb-4 pt-2">{children}</div>
    </details>
  );
}

function getSafeReturnTo(value: string | undefined, fallback: string) {
  if (!value?.startsWith("/collections/") || value.startsWith("//")) {
    return fallback;
  }

  return value;
}
