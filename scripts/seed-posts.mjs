/**
 * Seeds the original guide article so it can be edited in /admin/posts.
 *
 * No testimonials are seeded: inventing customer quotes would be fabricating
 * reviews. The homepage section stays hidden until real ones are added.
 *
 * Run: node scripts/seed-posts.mjs
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

const body = [
  "Vehicle choice starts with the freight itself: dimensions, total weight, piece count, loading method, pickup access, and delivery requirements.",
  "Cargo vans can be efficient for smaller enclosed loads. Sprinter vans add usable interior height and length. Box trucks suit larger palletized or commercial freight, while hotshot service can be useful for urgent or job-site moves that match the available trailer.",
  `The final decision should always be confirmed against the exact equipment assigned. ${COMPANY} reviews shipment details during quoting instead of assuming one vehicle configuration fits every load.`,
].join("\n\n");

const posts = db.collection("posts");
const slug = "choosing-the-right-vehicle";
const existing = await posts.findOne({ slug });
const id = existing?.id ?? (await nextId("posts"));

await posts.updateOne(
  { slug },
  {
    $set: {
      id,
      slug,
      title: "Choosing the Right Vehicle for a Road Freight Shipment",
      excerpt:
        "A practical guide to when cargo vans, Sprinter vans, box trucks, or hotshot service may fit a shipment.",
      body,
      category: "Guide",
      status: "published",
      published_at: "2026-09-01",
    },
  },
  { upsert: true },
);

console.log("posts:", await posts.countDocuments());
console.log("testimonials:", await db.collection("testimonials").countDocuments(), "(none seeded by design)");
await client.close();
