/**
 * Seeds example job listings. Replace these with real vacancies in /admin/jobs.
 *
 * Safe to re-run: each job is upserted on its slug.
 *
 * Run: node scripts/seed-jobs.mjs
 */
import { MongoClient } from "mongodb";
import { loadEnv } from "./load-env.mjs";

loadEnv();

const client = await new MongoClient(
  process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017",
).connect();
const db = client.db(process.env.MONGODB_DB ?? "zewar");

async function nextId(name) {
  const res = await db
    .collection("counters")
    .findOneAndUpdate({ _id: name }, { $inc: { value: 1 } }, { upsert: true, returnDocument: "after" });
  return res.value;
}

const jobs = [
  {
    slug: "box-truck-driver-woodbridge-va", title: "Box Truck Driver",
    department: "Drivers", location: "Woodbridge, VA", employment_type: "Full time",
    experience_level: "1+ years",
    summary: "Run regional and interstate box truck freight out of our Woodbridge base, with dispatch coordinating pickups and delivery windows.",
    responsibilities: "Operate a company box truck on assigned regional and interstate lanes\nComplete pre-trip and post-trip vehicle inspections\nSecure palletized and boxed freight correctly before departure\nKeep dispatch updated at pickup, en route, and delivery\nMaintain accurate delivery paperwork",
    requirements: "Valid US driver licence with a clean record\nExperience operating a box truck or similar commercial vehicle\nComfortable with dock and curbside loading\nAble to pass a background check and drug screen\nReliable communication with dispatch",
    benefits: "Defined lanes across our core operating states\nDirect contact with our own dispatch team, not a call centre\nWell-maintained, road-ready equipment",
  },
  {
    slug: "sprinter-van-driver", title: "Sprinter Van Driver",
    department: "Drivers", location: "Sacramento, CA", employment_type: "Full time",
    experience_level: "Entry level welcome",
    summary: "Handle expedited and dedicated Sprinter van deliveries for commercial shippers on regional routes.",
    responsibilities: "Complete dedicated and expedited van deliveries on time\nLoad and unload cartons and packaged freight safely\nConfirm pickup and delivery details with dispatch\nKeep the assigned vehicle clean and roadworthy",
    requirements: "Valid US driver licence with a clean record\nComfortable driving a high-roof Sprinter van\nGood written and spoken communication\nAble to lift and handle packaged freight",
    benefits: "Regional routes with predictable schedules\nDirect dispatch support\nMaintained vehicles",
  },
  {
    slug: "freight-dispatcher", title: "Freight Dispatcher",
    department: "Operations", location: "Woodbridge, VA", employment_type: "Full time",
    experience_level: "2+ years",
    summary: "Coordinate loads, drivers, and shipper communication across our regional and interstate lanes.",
    responsibilities: "Match incoming freight to available drivers and equipment\nConfirm weight, dimensions, and loading requirements before dispatch\nCommunicate pickup and delivery updates to shippers\nResolve delays and route changes as they happen\nMaintain accurate load records",
    requirements: "Experience dispatching in road freight, brokerage, or logistics\nStrong organisation under time pressure\nClear written and phone communication\nComfortable with dispatch and tracking software",
    benefits: "Direct ownership of your lanes and drivers\nSmall team where decisions move quickly",
  },
];

const collection = db.collection("jobs");
for (const job of jobs) {
  const existing = await collection.findOne({ slug: job.slug });
  const id = existing?.id ?? (await nextId("jobs"));
  await collection.updateOne(
    { slug: job.slug },
    { $set: { ...job, id, status: "open", posted_at: new Date().toISOString().replace("T", " ").slice(0, 19) } },
    { upsert: true },
  );
}

console.log("jobs:", await collection.countDocuments());
for (const j of await collection.find({}).toArray()) console.log("  -", j.title);
await client.close();
