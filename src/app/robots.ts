import type { MetadataRoute } from "next";
import { COMPANY } from "@/lib/data/company";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
    sitemap: `${COMPANY.domain}/sitemap.xml`,
  };
}
