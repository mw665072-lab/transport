import type { MetadataRoute } from "next";
import { COMPANY } from "@/lib/data/company";
import { SERVICES } from "@/lib/data/services";
import { BLOG_POSTS } from "@/lib/data/blog";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/coverage-area",
    "/equipment",
    "/experience-authority",
    "/freight-quote",
    "/track",
    "/career",
    "/career/apply",
    "/owner-operator",
    "/contact",
    "/blog",
    "/privacy-policy",
    "/terms",
  ];
  // lastModified is omitted where no real content date exists. Stamping the build
  // time would tell crawlers every page changed on every deploy.
  return [
    ...staticRoutes.map((route) => ({
      url: `${COMPANY.domain}${route}`,
      changeFrequency: "monthly" as const,
      priority: route === "" ? 1 : route === "/freight-quote" ? 0.95 : 0.7,
    })),
    ...SERVICES.map((s) => ({
      url: `${COMPANY.domain}/services/${s.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...BLOG_POSTS.map((p) => ({
      url: `${COMPANY.domain}/blog/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
