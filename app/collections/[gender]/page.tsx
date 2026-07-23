import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ProductGender } from "@/data/products";
import { getProductsByGender } from "@/lib/shop";
import { CollectionShoppingPage } from "../CollectionShoppingPage";

export const dynamicParams = false;

type CollectionGenderPageProps = {
  params: Promise<{
    gender: string;
  }>;
};

const genders: ProductGender[] = ["men", "women"];

export function generateStaticParams() {
  return genders.map((gender) => ({
    gender,
  }));
}

export async function generateMetadata({
  params,
}: CollectionGenderPageProps): Promise<Metadata> {
  const { gender } = await params;

  if (!isProductGender(gender)) {
    return {
      title: "Collections / LOW SIGNAL",
    };
  }

  const label = gender === "women" ? "Women" : "Men";
  const title = `Spring 2026 ${label} / LOW SIGNAL`;
  const description = `Shop LOW SIGNAL Spring 2026 ${label.toLowerCase()}'s outerwear, shirts, knitwear, and trousers.`;

  return {
    alternates: { canonical: `/collections/${gender}` },
    description,
    openGraph: {
      description,
      images: [
        {
          alt: `LOW SIGNAL Spring 2026 ${label}`,
          height: 630,
          url: "/images/low-signal/og-preview.jpg",
          width: 1200,
        },
      ],
      title,
      type: "website",
      url: `/collections/${gender}`,
    },
    title,
    twitter: {
      card: "summary_large_image",
      description,
      images: ["/images/low-signal/og-preview.jpg"],
      title,
    },
  };
}

export default async function CollectionGenderPage({
  params,
}: CollectionGenderPageProps) {
  const { gender } = await params;

  if (!isProductGender(gender)) {
    notFound();
  }
  const products = await getProductsByGender(gender);

  return <CollectionShoppingPage gender={gender} products={products} />;
}

function isProductGender(value: string): value is ProductGender {
  return genders.includes(value as ProductGender);
}
