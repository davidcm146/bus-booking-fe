import type { MetadataRoute } from "next";

/** Routes that should never be indexed by search engines. */
export const NOINDEX_ROUTES = [
  "/checkout",
  "/bookings",
  "/confirmation",
  "/trips",
  "/operator",
] as const;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [...NOINDEX_ROUTES],
      },
    ],
    sitemap: "/sitemap.xml",
  };
}
