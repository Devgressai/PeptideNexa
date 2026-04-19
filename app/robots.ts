import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/utils";

export default function robots(): MetadataRoute.Robots {
  const isProd = process.env.NODE_ENV === "production";
  return {
    rules: isProd
      ? [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api"] }]
      : [{ userAgent: "*", disallow: "/" }],
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
