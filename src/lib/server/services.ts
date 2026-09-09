import "server-only";
import {
  listServices,
  getServiceBySlug,
  listServiceItems,
  type ServiceItem,
  type ServiceRow,
} from "@/lib/server/db";
import { SERVICES as SEED_SERVICES, type Service } from "@/lib/data/services";

/**
 * Services are edited in the admin panel. The typed file in lib/data stays as the
 * seed and as the fallback: if the table is empty (fresh install, or the database
 * is unavailable) the site still renders the original five services rather than an
 * empty menu.
 */
function toService(row: ServiceRow): Service & {
  navLabel: string;
  navDescription: string;
} {
  return {
    slug: row.slug,
    name: row.name,
    short: row.short,
    image: row.image,
    body: row.body,
    turnaround: row.turnaround,
    typicalLoads: row.typical_loads
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean),
    navLabel: row.nav_label || row.name,
    navDescription: row.nav_description,
  };
}

export type PublicService = ReturnType<typeof toService>;

const seedAsPublic = (): PublicService[] =>
  SEED_SERVICES.map((s) => ({ ...s, navLabel: s.name, navDescription: s.short }));

export async function getServices(): Promise<PublicService[]> {
  try {
    const rows = await listServices();
    if (rows.length === 0) return seedAsPublic();
    return rows.map(toService);
  } catch (cause) {
    console.error("[services] falling back to the seeded list", cause);
    return seedAsPublic();
  }
}

export async function getService(slug: string): Promise<PublicService | null> {
  try {
    const row = await getServiceBySlug(slug);
    if (row) return row.status === "published" ? toService(row) : null;
    if ((await listServices()).length > 0) return null;
  } catch (cause) {
    console.error("[services] falling back to the seeded list", cause);
  }
  const seed = SEED_SERVICES.find((s) => s.slug === slug);
  return seed ? { ...seed, navLabel: seed.name, navDescription: seed.short } : null;
}

/** Gallery entries for a service, empty when the service has none. */
export async function getServiceItems(slug: string): Promise<ServiceItem[]> {
  try {
    const row = await getServiceBySlug(slug);
    return row ? await listServiceItems(row.id) : [];
  } catch (cause) {
    console.error("[services] could not load gallery items", cause);
    return [];
  }
}
