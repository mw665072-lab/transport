import type { MetadataRoute } from "next";
import { COMPANY } from "@/lib/data/company";
import { getServices } from "@/lib/server/services";
import { getPosts } from "@/lib/server/site-data";
import { getEquipment } from "@/lib/server/fleet";

/**
 * Services, equipment, and articles come from the database, so the sitemap is
 * generated per request rather than frozen at build time. Hiding a service in
 * the admin panel removes it here as well as from the site.
 */
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, posts, equipment] = await Promise.all([
    getServices(),
    getPosts(),
    getEquipment(),
  ]);
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
    ...services.map((s) => ({
      url: `${COMPANY.domain}/services/${s.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...equipment.map((e) => ({
      url: `${COMPANY.domain}/equipment/${e.slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...posts.map((p) => ({
      url: `${COMPANY.domain}/blog/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
