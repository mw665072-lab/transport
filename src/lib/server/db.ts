import "server-only";
import { collection, ensureIndexes, nextId, toPlain, toPlainAll } from "@/lib/server/mongo";
import type { ShipmentStatus } from "@/lib/data/shipment-status";

export type { ShipmentStatus } from "@/lib/data/shipment-status";

export type {
  SubmissionStatus,
  JobStatus,
  ApplicationStatus,
  ServiceStatus,
  PostStatus,
  Submission,
  Job,
  Application,
  ServiceRow,
  ServiceItem,
  Testimonial,
  Post,
  Shipment,
  ShipmentEvent,
  DocumentRecord,
  Document,
} from "@/lib/data/records";

import type {
  SubmissionStatus,
  JobStatus,
  ApplicationStatus,
  ServiceStatus,
  Submission,
  Job,
  Application,
  ServiceRow,
  ServiceItem,
  Testimonial,
  Post,
  Shipment,
  ShipmentEvent,
  DocumentRecord,
} from "@/lib/data/records";

/* ------------------------------------------------------------- helpers */

/** Matches the timestamp format the UI already parses. */
function stamp(): string {
  return new Date().toISOString().replace("T", " ").slice(0, 19);
}


async function col<T extends Record<string, unknown>>(name: string) {
  await ensureIndexes();
  return collection<T>(name);
}

const LIST_LIMIT = 500;

/* --------------------------------------------------------- submissions */

export async function insertSubmission(input: {
  form: string;
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
  payload?: Record<string, unknown> | null;
  ipHash: string | null;
  userAgent: string | null;
}): Promise<number> {
  const c = await col<Submission>("submissions");
  const id = await nextId("submissions");
  await c.insertOne({
    id,
    form: input.form,
    name: input.name,
    email: input.email,
    phone: input.phone ?? null,
    subject: input.subject,
    message: input.message,
    status: "new",
    emailed: 0,
    payload: input.payload ? JSON.stringify(input.payload) : null,
    ip_hash: input.ipHash,
    user_agent: input.userAgent,
    created_at: stamp(),
  } as never);
  return id;
}

export async function markEmailed(id: number): Promise<void> {
  const c = await col<Submission>("submissions");
  await c.updateOne({ id } as never, { $set: { emailed: 1 } });
}

export async function listSubmissions(status?: SubmissionStatus): Promise<Submission[]> {
  const c = await col<Submission>("submissions");
  const docs = await c
    .find(status ? ({ status } as never) : ({} as never))
    .sort({ created_at: -1, id: -1 })
    .limit(LIST_LIMIT)
    .toArray();
  return toPlainAll<Submission>(docs);
}

export async function countByStatus(): Promise<Record<SubmissionStatus | "total", number>> {
  const c = await col<Submission>("submissions");
  const rows = await c.aggregate([{ $group: { _id: "$status", n: { $sum: 1 } } }]).toArray();
  const out = { new: 0, read: 0, archived: 0, total: 0 };
  for (const row of rows) {
    const key = row._id as SubmissionStatus;
    if (key in out) out[key] = row.n as number;
    out.total += row.n as number;
  }
  return out;
}

export async function setStatus(id: number, status: SubmissionStatus): Promise<void> {
  const c = await col<Submission>("submissions");
  await c.updateOne({ id } as never, { $set: { status } });
}

/* ---------------------------------------------------------------- jobs */

export async function listJobs(opts: { includeClosed?: boolean } = {}): Promise<Job[]> {
  const c = await col<Job>("jobs");
  const docs = await c
    .find(opts.includeClosed ? ({} as never) : ({ status: "open" } as never))
    .sort({ posted_at: -1, id: -1 })
    .toArray();
  return toPlainAll<Job>(docs);
}

export async function getJobBySlug(slug: string): Promise<Job | null> {
  const c = await col<Job>("jobs");
  return toPlain<Job>(await c.findOne({ slug } as never));
}

export async function getJobById(id: number): Promise<Job | null> {
  const c = await col<Job>("jobs");
  return toPlain<Job>(await c.findOne({ id } as never));
}

export async function upsertJob(
  job: Omit<Job, "id" | "posted_at"> & { id?: number },
): Promise<void> {
  const c = await col<Job>("jobs");
  if (job.id) {
    const { id, ...rest } = job;
    await c.updateOne({ id } as never, { $set: rest as never });
    return;
  }
  await c.insertOne({ ...job, id: await nextId("jobs"), posted_at: stamp() } as never);
}

export async function setJobStatus(id: number, status: JobStatus): Promise<void> {
  const c = await col<Job>("jobs");
  await c.updateOne({ id } as never, { $set: { status } });
}

export async function deleteJob(id: number): Promise<void> {
  const c = await col<Job>("jobs");
  await c.deleteOne({ id } as never);
}

/* -------------------------------------------------------- applications */

export async function insertApplication(input: {
  jobId: number | null;
  jobTitle: string;
  name: string;
  email: string;
  phone: string;
  cdlClass?: string | null;
  yearsExperience?: number | null;
  linkedin?: string | null;
  coverLetter?: string | null;
  resumeFilename?: string | null;
  resumePath?: string | null;
  ipHash: string | null;
}): Promise<number> {
  const c = await col<Application>("applications");
  const id = await nextId("applications");
  await c.insertOne({
    id,
    job_id: input.jobId,
    job_title: input.jobTitle,
    name: input.name,
    email: input.email,
    phone: input.phone,
    cdl_class: input.cdlClass ?? null,
    years_experience: input.yearsExperience ?? null,
    linkedin: input.linkedin ?? null,
    cover_letter: input.coverLetter ?? null,
    resume_filename: input.resumeFilename ?? null,
    resume_path: input.resumePath ?? null,
    status: "new",
    ip_hash: input.ipHash,
    created_at: stamp(),
  } as never);
  return id;
}

export async function listApplications(status?: ApplicationStatus): Promise<Application[]> {
  const c = await col<Application>("applications");
  const docs = await c
    .find(status ? ({ status } as never) : ({} as never))
    .sort({ created_at: -1, id: -1 })
    .limit(LIST_LIMIT)
    .toArray();
  return toPlainAll<Application>(docs);
}

export async function setApplicationStatus(
  id: number,
  status: ApplicationStatus,
): Promise<void> {
  const c = await col<Application>("applications");
  await c.updateOne({ id } as never, { $set: { status } });
}

export async function getApplication(id: number): Promise<Application | null> {
  const c = await col<Application>("applications");
  return toPlain<Application>(await c.findOne({ id } as never));
}

export async function countApplications(): Promise<
  Record<ApplicationStatus | "total", number>
> {
  const c = await col<Application>("applications");
  const rows = await c.aggregate([{ $group: { _id: "$status", n: { $sum: 1 } } }]).toArray();
  const out = { new: 0, reviewing: 0, shortlisted: 0, rejected: 0, total: 0 };
  for (const row of rows) {
    const key = row._id as ApplicationStatus;
    if (key in out) out[key] = row.n as number;
    out.total += row.n as number;
  }
  return out;
}

/* ------------------------------------------------------------ services */

export async function listServices(
  opts: { includeHidden?: boolean } = {},
): Promise<ServiceRow[]> {
  const c = await col<ServiceRow>("services");
  const docs = await c
    .find(opts.includeHidden ? ({} as never) : ({ status: "published" } as never))
    .sort({ sort_order: 1, id: 1 })
    .toArray();
  return toPlainAll<ServiceRow>(docs);
}

export async function getServiceBySlug(slug: string): Promise<ServiceRow | null> {
  const c = await col<ServiceRow>("services");
  return toPlain<ServiceRow>(await c.findOne({ slug } as never));
}

export async function getServiceById(id: number): Promise<ServiceRow | null> {
  const c = await col<ServiceRow>("services");
  return toPlain<ServiceRow>(await c.findOne({ id } as never));
}

export async function upsertService(
  service: Omit<ServiceRow, "id"> & { id?: number },
): Promise<void> {
  const c = await col<ServiceRow>("services");
  if (service.id) {
    const { id, ...rest } = service;
    await c.updateOne({ id } as never, { $set: rest as never });
    return;
  }
  await c.insertOne({ ...service, id: await nextId("services") } as never);
}

export async function setServiceStatus(id: number, status: ServiceStatus): Promise<void> {
  const c = await col<ServiceRow>("services");
  await c.updateOne({ id } as never, { $set: { status } });
}

export async function deleteService(id: number): Promise<void> {
  const c = await col<ServiceRow>("services");
  await c.deleteOne({ id } as never);
  // Gallery items belong to the service, so they go with it.
  const items = await col<ServiceItem>("service_items");
  await items.deleteMany({ service_id: id } as never);
}

export async function countServices(): Promise<number> {
  const c = await col<ServiceRow>("services");
  return c.countDocuments();
}

/* ------------------------------------------------------- service items */

export async function listServiceItems(serviceId: number): Promise<ServiceItem[]> {
  const c = await col<ServiceItem>("service_items");
  const docs = await c
    .find({ service_id: serviceId } as never)
    .sort({ sort_order: 1, id: 1 })
    .toArray();
  return toPlainAll<ServiceItem>(docs);
}

export async function getServiceItem(id: number): Promise<ServiceItem | null> {
  const c = await col<ServiceItem>("service_items");
  return toPlain<ServiceItem>(await c.findOne({ id } as never));
}

export async function upsertServiceItem(
  item: Omit<ServiceItem, "id"> & { id?: number },
): Promise<void> {
  const c = await col<ServiceItem>("service_items");
  if (item.id) {
    const { id, ...rest } = item;
    await c.updateOne({ id } as never, { $set: rest as never });
    return;
  }
  await c.insertOne({ ...item, id: await nextId("service_items") } as never);
}

export async function deleteServiceItem(id: number): Promise<void> {
  const c = await col<ServiceItem>("service_items");
  await c.deleteOne({ id } as never);
}

/* ------------------------------------------------------------ settings */

export async function getSettings(): Promise<Record<string, string>> {
  const c = await col<{ key: string; value: string }>("site_settings");
  const docs = await c.find({} as never).toArray();
  return Object.fromEntries(docs.map((d) => [d.key as string, d.value as string]));
}

export async function setSetting(key: string, value: string): Promise<void> {
  const c = await col<{ key: string; value: string }>("site_settings");
  await c.updateOne({ key } as never, { $set: { key, value } }, { upsert: true });
}

/* -------------------------------------------------------- testimonials */

export async function listTestimonials(
  opts: { includeHidden?: boolean } = {},
): Promise<Testimonial[]> {
  const c = await col<Testimonial>("testimonials");
  const docs = await c
    .find(opts.includeHidden ? ({} as never) : ({ status: "published" } as never))
    .sort({ sort_order: 1, id: 1 })
    .toArray();
  return toPlainAll<Testimonial>(docs);
}

export async function getTestimonial(id: number): Promise<Testimonial | null> {
  const c = await col<Testimonial>("testimonials");
  return toPlain<Testimonial>(await c.findOne({ id } as never));
}

export async function upsertTestimonial(
  t: Omit<Testimonial, "id" | "created_at"> & { id?: number },
): Promise<void> {
  const c = await col<Testimonial>("testimonials");
  if (t.id) {
    const { id, ...rest } = t;
    await c.updateOne({ id } as never, { $set: rest as never });
    return;
  }
  await c.insertOne({ ...t, id: await nextId("testimonials"), created_at: stamp() } as never);
}

export async function deleteTestimonial(id: number): Promise<void> {
  const c = await col<Testimonial>("testimonials");
  await c.deleteOne({ id } as never);
}

/* --------------------------------------------------------------- posts */

export async function listPosts(opts: { includeDrafts?: boolean } = {}): Promise<Post[]> {
  const c = await col<Post>("posts");
  const docs = await c
    .find(opts.includeDrafts ? ({} as never) : ({ status: "published" } as never))
    .sort({ published_at: -1, id: -1 })
    .toArray();
  return toPlainAll<Post>(docs);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const c = await col<Post>("posts");
  return toPlain<Post>(await c.findOne({ slug } as never));
}

export async function getPostById(id: number): Promise<Post | null> {
  const c = await col<Post>("posts");
  return toPlain<Post>(await c.findOne({ id } as never));
}

export async function upsertPost(post: Omit<Post, "id"> & { id?: number }): Promise<void> {
  const c = await col<Post>("posts");
  if (post.id) {
    const { id, ...rest } = post;
    await c.updateOne({ id } as never, { $set: rest as never });
    return;
  }
  await c.insertOne({ ...post, id: await nextId("posts") } as never);
}

export async function deletePost(id: number): Promise<void> {
  const c = await col<Post>("posts");
  await c.deleteOne({ id } as never);
}

/* ----------------------------------------------------------- shipments */

/** Lookup is by exact reference only; references are never listed publicly. */
export async function getShipmentByReference(reference: string): Promise<Shipment | null> {
  const c = await col<Shipment>("shipments");
  const doc = await c.findOne({
    reference: {
      $regex: `^${reference.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
      $options: "i",
    },
  } as never);
  return toPlain<Shipment>(doc);
}

export async function listShipmentEvents(shipmentId: number): Promise<ShipmentEvent[]> {
  const c = await col<ShipmentEvent>("shipment_events");
  const docs = await c
    .find({ shipment_id: shipmentId } as never)
    .sort({ occurred_at: -1, id: -1 })
    .toArray();
  return toPlainAll<ShipmentEvent>(docs);
}

export async function listShipments(): Promise<Shipment[]> {
  const c = await col<Shipment>("shipments");
  const docs = await c
    .find({} as never)
    .sort({ updated_at: -1, id: -1 })
    .limit(LIST_LIMIT)
    .toArray();
  return toPlainAll<Shipment>(docs);
}

export async function getShipmentById(id: number): Promise<Shipment | null> {
  const c = await col<Shipment>("shipments");
  return toPlain<Shipment>(await c.findOne({ id } as never));
}

export async function upsertShipment(
  s: Omit<Shipment, "id" | "created_at" | "updated_at"> & { id?: number },
): Promise<void> {
  const c = await col<Shipment>("shipments");
  if (s.id) {
    const { id, ...rest } = s;
    await c.updateOne({ id } as never, { $set: { ...rest, updated_at: stamp() } as never });
    return;
  }
  await c.insertOne({
    ...s,
    id: await nextId("shipments"),
    created_at: stamp(),
    updated_at: stamp(),
  } as never);
}

export async function addShipmentEvent(input: {
  shipmentId: number;
  status: string;
  location: string;
  note: string;
}): Promise<void> {
  const events = await col<ShipmentEvent>("shipment_events");
  await events.insertOne({
    id: await nextId("shipment_events"),
    shipment_id: input.shipmentId,
    status: input.status,
    location: input.location,
    note: input.note,
    occurred_at: stamp(),
  } as never);

  // The shipment's headline status follows its newest event.
  const shipments = await col<Shipment>("shipments");
  await shipments.updateOne({ id: input.shipmentId } as never, {
    $set: { status: input.status as ShipmentStatus, updated_at: stamp() },
  });
}

export async function deleteShipment(id: number): Promise<void> {
  const c = await col<Shipment>("shipments");
  await c.deleteOne({ id } as never);
  const events = await col<ShipmentEvent>("shipment_events");
  await events.deleteMany({ shipment_id: id } as never);
}

/* ----------------------------------------------------------- documents */

export async function insertDocument(input: {
  kind: string;
  reference: string;
  company: string;
  contact: string;
  email: string;
  phone: string;
  note: string;
  filename: string;
  path: string;
  ipHash: string | null;
}): Promise<number> {
  const c = await col<DocumentRecord>("documents");
  const id = await nextId("documents");
  await c.insertOne({
    id,
    kind: input.kind,
    reference: input.reference,
    company: input.company,
    contact: input.contact,
    email: input.email,
    phone: input.phone,
    note: input.note,
    filename: input.filename,
    path: input.path,
    status: "new",
    ip_hash: input.ipHash,
    created_at: stamp(),
  } as never);
  return id;
}

export async function listDocuments(status?: string): Promise<DocumentRecord[]> {
  const c = await col<DocumentRecord>("documents");
  const docs = await c
    .find(status ? ({ status } as never) : ({} as never))
    .sort({ created_at: -1, id: -1 })
    .limit(LIST_LIMIT)
    .toArray();
  return toPlainAll<DocumentRecord>(docs);
}

export async function getDocument(id: number): Promise<DocumentRecord | null> {
  const c = await col<DocumentRecord>("documents");
  return toPlain<DocumentRecord>(await c.findOne({ id } as never));
}

export async function setDocumentStatus(id: number, status: string): Promise<void> {
  const c = await col<DocumentRecord>("documents");
  await c.updateOne({ id } as never, { $set: { status } });
}
