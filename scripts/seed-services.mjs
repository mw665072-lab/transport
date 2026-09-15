/**
 * Seeds the services collection.
 *
 * The five road services carry the copy already written for the site. The sixth,
 * "Expedited & Same-Day Delivery", was found on the live WordPress site and had
 * no description there beyond placeholder text, so its copy is written here.
 *
 * Safe to re-run: each service is upserted on its slug.
 *
 * Run: node scripts/seed-services.mjs
 */
import { MongoClient } from "mongodb";
import { loadEnv } from "./load-env.mjs";
import { loadDemo, demoDbName } from "./load-demo.mjs";

loadEnv();

const demo = loadDemo();
const COMPANY = demo.shortName;

const client = await new MongoClient(
  process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017",
).connect();
const db = client.db(demoDbName(demo));
const services = db.collection("services");

async function nextId(name) {
  const res = await db
    .collection("counters")
    .findOneAndUpdate({ _id: name }, { $inc: { value: 1 } }, { upsert: true, returnDocument: "after" });
  return res.value;
}

const items = [
  {
    slug: "box-truck-transportation",
    name: "Box Truck Transportation",
    nav_label: "Box Truck Transportation",
    nav_description: "Enclosed regional freight & pallet moves",
    short: "Flexible regional and interstate capacity for palletized, boxed, retail, and commercial freight.",
    image: "/images/box-truck.jpg",
    typical_loads: "Palletized freight\nRetail and commercial goods\nEquipment and boxed materials",
    turnaround: "Scheduled, same-day, or expedited options based on lane and availability.",
    body: `${COMPANY} uses box trucks for freight that needs more protected cargo space than a van while remaining practical for docks, commercial sites, and regional routes. Typical work includes palletized goods, boxed products, retail replenishment, business equipment, and time-sensitive commercial shipments. Capacity varies by the exact truck assigned, so ${COMPANY} confirms the legal payload, cargo dimensions, and loading method before dispatch rather than advertising an unverified weight limit.`,
    sort_order: 1,
  },
  {
    slug: "hotshot-services",
    name: "Hotshot Services",
    nav_label: "Hotshot Services",
    nav_description: "Time-sensitive direct freight delivery",
    short: "Responsive transportation for urgent, job-site, equipment, and time-critical loads.",
    image: "/images/hotshot.jpg",
    typical_loads: "Job-site materials\nUrgent equipment\nTime-critical commercial freight",
    turnaround: "Expedited dispatch subject to lane, trailer, and driver availability.",
    body: "Hotshot transportation is suited to shipments that are urgent, operationally important, or better handled without waiting for a larger scheduled truck. Because hotshot capacity changes significantly with trailer type, axle rating, load shape, and securement requirements, the dispatch team confirms weight and dimensions before accepting a load.",
    sort_order: 2,
  },
  {
    slug: "cargo-van-delivery",
    name: "Cargo Van Delivery",
    nav_label: "Cargo Van Delivery",
    nav_description: "Express parcels & smaller commercial cargo",
    short: "Direct delivery for smaller freight, cartons, parts, and urgent business shipments.",
    image: "/images/cargo-van.jpg",
    typical_loads: "Cartons and packaged goods\nParts and supplies\nSmall business freight",
    turnaround: "Local, regional, and expedited direct-delivery options based on availability.",
    body: "Cargo van delivery is a practical choice for smaller freight that does not require a box truck but still benefits from dedicated, enclosed transportation. The service works well for direct deliveries where shippers want fewer handling points and a vehicle dedicated to the load.",
    sort_order: 3,
  },
  {
    slug: "sprinter-van-transportation",
    name: "Sprinter Van Transportation",
    nav_label: "Sprinter Van Transportation",
    nav_description: "High-roof dedicated van transportation",
    short: "More enclosed cargo space for dedicated, fast-moving freight without a large truck.",
    image: "/images/sprinter-van.jpg",
    typical_loads: "Multiple cartons\nTall or longer packaged freight\nExpedited B2B deliveries",
    turnaround: "Same-day or scheduled service where equipment and lane availability allow.",
    body: "Sprinter van transportation gives shippers a useful middle ground between a standard cargo van and a box truck. The taller and longer cargo area can accommodate business freight that needs additional enclosed space while preserving the speed and direct-routing advantages of a van.",
    sort_order: 4,
  },
  {
    slug: "freight-transportation",
    name: "Freight Transportation Services",
    nav_label: "Freight Transportation",
    nav_description: "Interstate full & partial load moves",
    short: "Coordinated road freight using box trucks and vans for regional and interstate shipments.",
    image: "/images/hero-freight.jpg",
    typical_loads: "Commercial freight\nPallets and packaged goods\nDedicated road shipments",
    turnaround: "Planned or expedited road transport based on shipment requirements and capacity.",
    body: `${COMPANY} provides road-based freight transportation for businesses that need dependable movement of commercial goods across regional and interstate lanes. The service is built around the company's actual operating model: box trucks, cargo vans, Sprinter vans, and hotshot capacity rather than air, ocean, or port logistics.`,
    sort_order: 5,
  },
  {
    slug: "expedited-same-day-delivery",
    name: "Expedited & Same-Day Delivery",
    nav_label: "Expedited & Same-Day Delivery",
    nav_description: "Urgent same-day and next-day runs",
    short: "Direct same-day and next-day runs when a shipment cannot wait for scheduled capacity.",
    image: "/images/hotshot.jpg",
    typical_loads: "Production-down parts\nMissed-appointment recovery\nUrgent replenishment and documents",
    turnaround: "Same-day dispatch where a driver and suitable vehicle are already in position.",
    body: `Expedited and same-day delivery covers shipments where timing decides everything: a line-down part, a missed delivery appointment, or replenishment that has to arrive before a site opens. ${COMPANY} handles these as dedicated direct runs, so the freight stays on one vehicle from pickup to delivery with no terminal transfer.`,
    sort_order: 6,
  },
];

for (const item of items) {
  const existing = await services.findOne({ slug: item.slug });
  const id = existing?.id ?? (await nextId("services"));
  await services.updateOne(
    { slug: item.slug },
    { $set: { ...item, id, status: "published" } },
    { upsert: true },
  );
}

console.log("services:", await services.countDocuments());
for (const s of await services.find({}).sort({ sort_order: 1 }).toArray()) {
  console.log(`  ${s.sort_order}. ${s.name}  ->  /services/${s.slug}`);
}
await client.close();
