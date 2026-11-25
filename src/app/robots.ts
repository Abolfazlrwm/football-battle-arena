import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // The design-system reference page is a dev tool, not a product
        // surface — the page itself also carries noindex metadata.
        disallow: ["/design-system"],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
