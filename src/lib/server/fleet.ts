import "server-only";
import { listEquipment, getEquipmentBySlug, listCoverage } from "@/lib/server/db";
import type { EquipmentRow } from "@/lib/data/records";
import { EQUIPMENT as SEED_EQUIPMENT } from "@/lib/data/equipment";
import { COVERAGE as SEED_COVERAGE } from "@/lib/data/coverage";

/**
 * Fleet and coverage are edited in the admin panel. The typed files stay as the
 * seed and as the fallback, so a fresh install or an unreachable database still
 * renders the fleet rather than an empty page.
 */
export type PublicEquipment = {
  slug: string;
  name: string;
  image: string;
  description: string;
  body: string;
  specs: { label: string; value: string }[];
  typicalUses: string[];
};

/** Specs are stored one "Label: value" pair per line. */
function parseSpecs(raw: string): { label: string; value: string }[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const at = line.indexOf(":");
      return at === -1
        ? { label: line, value: "" }
        : { label: line.slice(0, at).trim(), value: line.slice(at + 1).trim() };
    });
}

const lines = (raw: string) =>
  raw
    .split("\n")
    .map((l) => l.replace(/^[-*•]\s*/, "").trim())
    .filter(Boolean);

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function toPublic(row: EquipmentRow): PublicEquipment {
  return {
    slug: row.slug,
    name: row.name,
    image: row.image,
    description: row.description,
    body: row.body,
    specs: parseSpecs(row.specs),
    typicalUses: lines(row.typical_uses),
  };
}

const seedEquipment = (): PublicEquipment[] =>
  SEED_EQUIPMENT.map((e) => ({
    slug: slugify(e.name),
    name: e.name,
    image: e.image,
    description: e.description,
    body: "",
    specs: e.specs.map((s) => ({ ...s })),
    typicalUses: [],
  }));

export async function getEquipment(): Promise<PublicEquipment[]> {
  try {
    const rows = await listEquipment();
    if (rows.length === 0) return seedEquipment();
    return rows.map(toPublic);
  } catch (cause) {
    console.error("[fleet] falling back to the seeded equipment", cause);
    return seedEquipment();
  }
}

export async function getEquipmentItem(slug: string): Promise<PublicEquipment | null> {
  try {
    const row = await getEquipmentBySlug(slug);
    if (row) return row.status === "published" ? toPublic(row) : null;
    if ((await listEquipment()).length > 0) return null;
  } catch (cause) {
    console.error("[fleet] falling back to the seeded equipment", cause);
  }
  return seedEquipment().find((e) => e.slug === slug) ?? null;
}

export type PublicCoverage = { states: string[]; lanes: string[] };

export async function getCoverage(): Promise<PublicCoverage> {
  try {
    const rows = await listCoverage();
    if (rows.length === 0) {
      return { states: [...SEED_COVERAGE.states], lanes: [...SEED_COVERAGE.lanes] };
    }
    const states = rows.filter((r) => r.kind === "state").map((r) => r.label);
    const lanes = rows.filter((r) => r.kind === "lane").map((r) => r.label);
    // Copy reads "across <states>", so an empty state list would leave a gap in
    // the sentence. Fall back per kind rather than only when the table is empty.
    return {
      states: states.length > 0 ? states : [...SEED_COVERAGE.states],
      lanes,
    };
  } catch (cause) {
    console.error("[fleet] falling back to the seeded coverage", cause);
    return { states: [...SEED_COVERAGE.states], lanes: [...SEED_COVERAGE.lanes] };
  }
}
