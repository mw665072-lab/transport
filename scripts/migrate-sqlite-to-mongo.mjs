/**
 * One-off migration from the old SQLite file into MongoDB.
 *
 * Every row keeps its numeric `id`, and the per-collection counters are set to
 * the highest id seen so new records continue the sequence. Safe to re-run: each
 * document is upserted on its id.
 *
 * Run: node scripts/migrate-sqlite-to-mongo.mjs [path/to/zewar.db]
 */
import { DatabaseSync } from "node:sqlite";
import { MongoClient } from "mongodb";
import { loadEnv } from "./load-env.mjs";

loadEnv();
import { existsSync } from "node:fs";

const sqlitePath = process.argv[2] ?? process.env.CONTACT_DB_PATH ?? "./data/zewar.db";
const uri = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017";
const dbName = process.env.MONGODB_DB ?? "zewar";

if (!existsSync(sqlitePath)) {
  console.log(`No SQLite file at ${sqlitePath}; nothing to migrate.`);
  process.exit(0);
}

const TABLES = [
  "submissions",
  "jobs",
  "applications",
  "services",
  "service_items",
  "posts",
  "testimonials",
  "shipments",
  "shipment_events",
  "documents",
];

const sqlite = new DatabaseSync(sqlitePath);
const client = await new MongoClient(uri).connect();
const db = client.db(dbName);

const existing = new Set(
  sqlite
    .prepare("SELECT name FROM sqlite_master WHERE type='table'")
    .all()
    .map((r) => r.name),
);

for (const table of TABLES) {
  if (!existing.has(table)) {
    console.log(`  ${table.padEnd(16)} skipped (not in SQLite)`);
    continue;
  }
  const rows = sqlite.prepare(`SELECT * FROM ${table}`).all().map((r) => ({ ...r }));
  if (rows.length === 0) {
    console.log(`  ${table.padEnd(16)} 0 rows`);
    continue;
  }
  const collection = db.collection(table);
  for (const row of rows) {
    await collection.updateOne({ id: row.id }, { $set: row }, { upsert: true });
  }
  const maxId = Math.max(...rows.map((r) => Number(r.id) || 0));
  await db
    .collection("counters")
    .updateOne({ _id: table }, { $set: { value: maxId } }, { upsert: true });
  console.log(`  ${table.padEnd(16)} ${rows.length} rows (next id ${maxId + 1})`);
}

// site_settings is keyed by name rather than a numeric id.
if (existing.has("site_settings")) {
  const rows = sqlite.prepare("SELECT key, value FROM site_settings").all();
  for (const row of rows) {
    await db
      .collection("site_settings")
      .updateOne({ key: row.key }, { $set: { key: row.key, value: row.value } }, { upsert: true });
  }
  console.log(`  site_settings    ${rows.length} rows`);
}

await client.close();
console.log("\nMigration complete.");
