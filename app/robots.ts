import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      allow: "/",
      disallow: ["/admin", "/api"],
      userAgent: "*",
    },
    sitemap: "https://low-signal-nine.vercel.app/sitemap.xml",
  };
}
