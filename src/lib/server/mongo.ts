import "server-only";
import { MongoClient, type Db, type Collection, type Document } from "mongodb";

/**
 * One shared client for the whole app.
 *
 * Next.js reloads modules in development, so the client is cached on globalThis
 * to avoid opening a new connection pool on every hot reload. In production the
 * module is evaluated once and the cache is simply the module scope.
 */
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB ?? "zewar";

if (!uri) {
  throw new Error(
    "MONGODB_URI is not set. Copy .env.example to .env.local and add your connection string.",
  );
}

type Cache = { client: MongoClient | null; promise: Promise<MongoClient> | null };

const globalCache = globalThis as typeof globalThis & { __mongo?: Cache };
const cache: Cache = (globalCache.__mongo ??= { client: null, promise: null });

async function connect(): Promise<MongoClient> {
  if (cache.client) return cache.client;
  cache.promise ??= new MongoClient(uri!, {
    // Fail fast rather than hanging a request when the cluster is unreachable.
    serverSelectionTimeoutMS: 8000,
  }).connect();
  cache.client = await cache.promise;
  return cache.client;
}

export async function getDb(): Promise<Db> {
  return (await connect()).db(dbName);
}

export async function collection<T extends Document>(name: string): Promise<Collection<T>> {
  return (await getDb()).collection<T>(name);
}

/**
 * Mongo hands back `_id` on every document. The app works with a numeric `id`,
 * so documents are stored with an explicit `id` field and `_id` is dropped on
 * the way out. This also produces a plain object, which React requires before a
 * document can be passed to a Client Component.
 */
export function toPlain<T>(doc: Document | null): T | null {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  void _id;
  return rest as T;
}

export function toPlainAll<T>(docs: Document[]): T[] {
  return docs.map((doc) => {
    const { _id, ...rest } = doc;
    void _id;
    return rest as T;
  });
}

/**
 * Auto-incrementing numeric ids, kept because every admin URL and form uses
 * them. A counters document is bumped atomically per collection.
 */
export async function nextId(name: string): Promise<number> {
  const counters = await collection<{ _id: string; value: number }>("counters");
  const result = await counters.findOneAndUpdate(
    { _id: name } as never,
    { $inc: { value: 1 } },
    { upsert: true, returnDocument: "after" },
  );
  return result?.value ?? 1;
}

/** Indexes are created once per process, on first use. */
let indexesReady: Promise<void> | null = null;

export function ensureIndexes(): Promise<void> {
  indexesReady ??= (async () => {
    const db = await getDb();
    await Promise.all([
      db.collection("submissions").createIndex({ created_at: -1 }),
      db.collection("submissions").createIndex({ status: 1 }),
      db.collection("jobs").createIndex({ slug: 1 }, { unique: true }),
      db.collection("jobs").createIndex({ status: 1 }),
      db.collection("applications").createIndex({ created_at: -1 }),
      db.collection("services").createIndex({ slug: 1 }, { unique: true }),
      db.collection("services").createIndex({ sort_order: 1 }),
      db.collection("service_items").createIndex({ service_id: 1, sort_order: 1 }),
      db.collection("posts").createIndex({ slug: 1 }, { unique: true }),
      db.collection("posts").createIndex({ status: 1, published_at: -1 }),
      db.collection("testimonials").createIndex({ status: 1, sort_order: 1 }),
      db.collection("shipments").createIndex({ reference: 1 }, { unique: true }),
      db.collection("shipment_events").createIndex({ shipment_id: 1, occurred_at: -1 }),
      db.collection("documents").createIndex({ created_at: -1 }),
      db.collection("site_settings").createIndex({ key: 1 }, { unique: true }),
      db.collection("equipment").createIndex({ slug: 1 }, { unique: true }),
      db.collection("equipment").createIndex({ sort_order: 1 }),
      db.collection("coverage").createIndex({ kind: 1, sort_order: 1 }),
    ]);
  })();
  return indexesReady;
}
