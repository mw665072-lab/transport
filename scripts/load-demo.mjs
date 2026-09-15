/**
 * Resolves the active demo profile for the seed / migration scripts, mirroring
 * how src/lib/data/demos.ts resolves it for the app.
 *
 * The demo is chosen by DEMO (or NEXT_PUBLIC_DEMO), e.g.
 *
 *   DEMO=acme node scripts/seed-services.mjs
 *
 * and defaults to "zewar" when unset. The returned profile carries the company
 * name (for stamping seed content) and the dbName (so each demo seeds into its
 * own isolated database).
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const DEFAULT_DEMO = "demo";
const demosDir = join(dirname(fileURLToPath(import.meta.url)), "..", "src", "demos");

export function activeDemoSlug() {
  const raw = (process.env.NEXT_PUBLIC_DEMO ?? process.env.DEMO ?? "").trim();
  return raw || DEFAULT_DEMO;
}

export function loadDemo() {
  const slug = activeDemoSlug();
  const file = join(demosDir, `${slug}.json`);
  if (!existsSync(file)) {
    throw new Error(
      `Unknown demo "${slug}": ${file} does not exist. ` +
        `Create src/demos/${slug}.json (and register it in src/lib/data/demos.ts).`,
    );
  }
  return JSON.parse(readFileSync(file, "utf8"));
}

/** The database name for the active demo, honouring a MONGODB_DB override. */
export function demoDbName(demo = loadDemo()) {
  return process.env.MONGODB_DB?.trim() || demo.dbName;
}
