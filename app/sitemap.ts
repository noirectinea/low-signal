import type { MetadataRoute } from "next";
import { getProductSlugs } from "@/lib/shop";

const base = "https://low-signal-nine.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const productSlugs = await getProductSlugs();
  const routes = [
    "",
    "/collections",
    "/collections/men",
    "/collections/women",
    "/lookbook",
    "/about",
    "/search",
    "/contact",
    "/shipping",
    "/returns",
    "/faq",
    "/size-guide",
    "/privacy",
    "/terms",
    "/cookies",
    "/order-tracking",
  ];

  return [
    ...routes.map((route) => ({
      changeFrequency: "weekly" as const,
      lastModified: new Date(),
      priority: route === "" ? 1 : 0.7,
      url: `${base}${route}`,
    })),
    ...productSlugs.map((slug) => ({
      changeFrequency: "weekly" as const,
      lastModified: new Date(),
      priority: 0.8,
      url: `${base}/products/${slug}`,
    })),
  ];
}
