/**
 * Seeds every collection for one demo's database in a single command.
 *
 *   DEMO=acme node scripts/seed-demo.mjs
 *   # or:  node scripts/seed-demo.mjs acme
 *
 * The demo is resolved from the DEMO env var, or the first CLI argument if given.
 * Each child seed script inherits DEMO, so they all write into that demo's own
 * database (demo.dbName) — never another company's.
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { loadEnv } from "./load-env.mjs";
import { loadDemo, demoDbName } from "./load-demo.mjs";

loadEnv();

// A slug passed as the first CLI arg overrides the env var.
const cliSlug = process.argv[2]?.trim();
if (cliSlug) process.env.DEMO = cliSlug;

const demo = loadDemo();
const scriptsDir = dirname(fileURLToPath(import.meta.url));

const STEPS = [
  "seed-services.mjs",
  "seed-jobs.mjs",
  "seed-fleet.mjs",
  "seed-posts.mjs",
  "seed-warehousing.mjs",
];

console.log(
  `\nSeeding "${demo.shortName}" (demo: ${demo.slug}) into database "${demoDbName(demo)}"\n`,
);

for (const step of STEPS) {
  console.log(`→ ${step}`);
  const result = spawnSync(process.execPath, [join(scriptsDir, step)], {
    stdio: "inherit",
    env: { ...process.env, DEMO: demo.slug },
  });
  if (result.status !== 0) {
    console.error(`\n✗ ${step} failed (exit ${result.status}). Stopping.`);
    process.exit(result.status ?? 1);
  }
}

console.log(`\n✓ Done. "${demo.shortName}" seeded into "${demoDbName(demo)}".\n`);
