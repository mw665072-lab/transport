/**
 * Adds the Warehousing service plus a starter gallery.
 *
 * The live WordPress /warehousing/ page had no warehousing content: its gallery
 * was the Phlox theme's demo portfolio. None of it belongs to this carrier, so nothing
 * was copied. The items below are freight-relevant placeholders using images
 * already in the project. Replace them in /admin/services.
 *
 * Run: node scripts/seed-warehousing.mjs
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

async function nextId(name) {
  const res = await db
    .collection("counters")
    .findOneAndUpdate({ _id: name }, { $inc: { value: 1 } }, { upsert: true, returnDocument: "after" });
  return res.value;
}


const services = db.collection("services");
const slug = "warehousing";
const existingService = await services.findOne({ slug });
const serviceId = existingService?.id ?? (await nextId("services"));

await services.updateOne(
  { slug },
  {
    $set: {
      id: serviceId,
      slug,
      name: "Warehousing & Storage",
      nav_label: "Warehousing",
      nav_description: "Short-term storage & cross-dock handling",
      short: "Short-term storage and cross-dock handling arranged around your road freight.",
      body: `Warehousing covers the pause between pickup and final delivery: freight that needs to wait for an appointment, a load that has to be broken down before it goes out, or stock held briefly between runs. ${COMPANY} arranges this around the road move rather than as a standalone facility service, so the same dispatch team keeps the shipment tracked from first pickup through to final delivery.`,
      typical_loads:
        "Palletized freight awaiting an appointment\nCross-dock transfers between vehicles\nShort-term overflow stock",
      turnaround: "Confirmed per shipment, based on location and duration required.",
      image: "/images/logistics-network.jpg",
      status: "published",
      sort_order: 7,
    },
  },
  { upsert: true },
);

const items = [
  ["storage", "Palletized short-term storage", "Pallets held between pickup and a booked delivery appointment.", "/images/box-truck.jpg", 1],
  ["storage", "Overflow stock holding", "Temporary space for stock that will not fit the next scheduled run.", "/images/logistics-network.jpg", 2],
  ["cross-dock", "Vehicle-to-vehicle transfer", "Freight moved directly between vehicles without entering long-term storage.", "/images/hero-freight.jpg", 3],
  ["cross-dock", "Load consolidation", "Several smaller consignments combined onto one outbound vehicle.", "/images/sprinter-van.jpg", 4],
  ["handling", "Break-bulk handling", "Larger consignments split down for separate onward deliveries.", "/images/cargo-van.jpg", 5],
  ["handling", "Appointment staging", "Freight staged so it can be loaded the moment a delivery slot opens.", "/images/hotshot.jpg", 6],
];

const serviceItems = db.collection("service_items");
await serviceItems.deleteMany({ service_id: serviceId });
for (const [category, title, description, image, order] of items) {
  await serviceItems.insertOne({
    id: await nextId("service_items"),
    service_id: serviceId,
    category,
    title,
    description,
    image,
    sort_order: order,
  });
}

console.log("services:", await services.countDocuments());
console.log("warehousing gallery items:", await serviceItems.countDocuments({ service_id: serviceId }));
await client.close();
