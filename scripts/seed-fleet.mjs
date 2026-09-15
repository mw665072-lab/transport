/**
 * Seeds the equipment classes and the coverage states/lanes into MongoDB so both
 * become editable in /admin/equipment and /admin/coverage.
 *
 * The copy mirrors the typed seed files: capacity figures stay "confirmed at
 * dispatch" rather than being invented, because the assigned unit decides them.
 *
 * Re-running is safe: rows are matched on slug (equipment) or kind+label
 * (coverage), so existing ids and any admin edits to other fields are kept.
 *
 * Run: node scripts/seed-fleet.mjs
 */
import { MongoClient } from "mongodb";
import { loadEnv } from "./load-env.mjs";
import { loadDemo, demoDbName } from "./load-demo.mjs";

loadEnv();

const demo = loadDemo();

const client = await new MongoClient(
  process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017",
).connect();
const db = client.db(demoDbName(demo));

async function nextId(name) {
  const res = await db
    .collection("counters")
    .findOneAndUpdate(
      { _id: name },
      { $inc: { value: 1 } },
      { upsert: true, returnDocument: "after" },
    );
  return res.value;
}

const CONFIRMED = "Confirmed against your freight before dispatch";

const equipment = [
  {
    slug: "cargo-vans",
    name: "Cargo Vans",
    image: "/images/cargo-van.jpg",
    description:
      "Enclosed, direct-delivery capacity for smaller commercial freight and urgent shipments.",
    body: [
      "Cargo vans are our smallest enclosed class. They suit boxed or hand-loadable commercial freight that has to travel on a dedicated vehicle rather than share a trailer with other shippers.",
      "Because the van carries only your load, there is no terminal transfer and no cross-docking between pickup and delivery. That keeps handling to the two ends of the trip, which matters most for fragile, high-value, or time-critical goods.",
      "Dispatch confirms the legal payload and usable cargo dimensions of the exact unit assigned when we quote your shipment.",
    ].join("\n\n"),
    specs: [
      `Payload: ${CONFIRMED}`,
      `Cargo length: ${CONFIRMED}`,
      "Liftgate: Not typical; confirmed per assigned vehicle",
      "Loading: Hand-load or dock-level, confirmed at booking",
    ].join("\n"),
    typical_uses: [
      "Urgent parts and equipment replacement runs",
      "Small boxed commercial freight between business addresses",
      "Time-critical deliveries that cannot wait for a consolidated line",
      "Loads that need to stay enclosed and on one vehicle end to end",
    ].join("\n"),
    status: "published",
    sort_order: 1,
  },
  {
    slug: "sprinter-vans",
    name: "Sprinter Vans",
    image: "/images/sprinter-van.jpg",
    description:
      "Higher-roof enclosed vans for dedicated business freight needing more usable cargo space.",
    body: [
      "Sprinter vans add interior height and length over a standard cargo van, so taller cased goods and longer items fit without moving up to a box truck.",
      "They stay manoeuvrable for city deliveries and constrained pickup sites while carrying noticeably more than a cargo van. Freight travels point to point on a dedicated vehicle.",
      "Whether the assigned unit carries a liftgate is confirmed at dispatch, along with payload and usable dimensions.",
    ].join("\n\n"),
    specs: [
      `Payload: ${CONFIRMED}`,
      `Cargo length: ${CONFIRMED}`,
      "Liftgate: Confirmed per assigned vehicle",
      "Loading: Hand-load, dock-level, or liftgate where available",
    ].join("\n"),
    typical_uses: [
      "Dedicated business freight too large for a cargo van",
      "Taller cased or crated goods that still travel enclosed",
      "Multi-stop regional delivery routes",
      "Trade and job-site deliveries with restricted access",
    ].join("\n"),
    status: "published",
    sort_order: 2,
  },
  {
    slug: "box-trucks",
    name: "Box Trucks",
    image: "/images/box-truck.jpg",
    description:
      "Road-ready enclosed trucks for palletized and commercial regional/interstate freight.",
    body: [
      "Box trucks are our largest enclosed class and the usual choice for palletized freight. They handle regional and interstate runs where the load is too large for a van but does not need a full trailer.",
      "Loads are secured with straps and load bars before the vehicle leaves the pickup site, and pre-trip checks are completed on every departure.",
      "A liftgate is available only when it is confirmed at dispatch, so tell us at quoting whether either end of the trip lacks a dock.",
    ].join("\n\n"),
    specs: [
      `Payload: ${CONFIRMED}`,
      `Deck length: ${CONFIRMED}`,
      "Liftgate: Available only when confirmed at dispatch",
      "Loading: Dock-level or liftgate, confirmed at booking",
    ].join("\n"),
    typical_uses: [
      "Palletized commercial freight on regional and interstate lanes",
      "Store, warehouse, and distribution-centre deliveries",
      "Larger consignments moving on one dedicated vehicle",
      "Loads that need securement gear rather than open-deck transport",
    ].join("\n"),
    status: "published",
    sort_order: 3,
  },
];

const coverage = [
  ...["California", "Texas", "Nevada", "Virginia"].map((label, i) => ({
    kind: "state",
    label,
    sort_order: i + 1,
  })),
  ...[
    "California ↔ Nevada regional freight",
    "California ↔ Texas interstate coordination",
    "Texas regional and surrounding-state lanes",
    "Virginia regional and surrounding interstate lanes",
  ].map((label, i) => ({ kind: "lane", label, sort_order: i + 1 })),
];

for (const item of equipment) {
  const collection = db.collection("equipment");
  const existing = await collection.findOne({ slug: item.slug });
  const id = existing?.id ?? (await nextId("equipment"));
  await collection.updateOne({ slug: item.slug }, { $set: { ...item, id } }, { upsert: true });
  console.log(`${existing ? "updated" : "inserted"} equipment ${item.slug} (#${id})`);
}

for (const row of coverage) {
  const collection = db.collection("coverage");
  const existing = await collection.findOne({ kind: row.kind, label: row.label });
  const id = existing?.id ?? (await nextId("coverage"));
  await collection.updateOne(
    { kind: row.kind, label: row.label },
    { $set: { ...row, id, status: existing?.status ?? "published" } },
    { upsert: true },
  );
  console.log(
    `${existing ? "updated" : "inserted"} coverage ${row.kind}: ${row.label} (#${id})`,
  );
}

await client.close();
console.log("Done.");
