import type { MetadataRoute } from "next";
import { COMPANY } from "@/lib/data/company";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${COMPANY.domain}/sitemap.xml`,
  };
}
