import { notFound } from "next/navigation";
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

export async function generateMetadata({ params }: CollectionGenderPageProps) {
  const { gender } = await params;

  if (!isProductGender(gender)) {
    return {
      title: "Collections / LOW SIGNAL",
    };
  }

  return {
    title: `Spring 2026 ${gender.toUpperCase()} / LOW SIGNAL`,
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
