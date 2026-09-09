/**
 * Shapes of the stored records.
 *
 * These live outside the server module so admin forms and other client
 * components can type their props without pulling the database driver into
 * the browser bundle.
 */
import type { ShipmentStatus } from "@/lib/data/shipment-status";

export type SubmissionStatus = "new" | "read" | "archived";
export type JobStatus = "open" | "closed";
export type ApplicationStatus = "new" | "reviewing" | "shortlisted" | "rejected";
export type ServiceStatus = "published" | "hidden";
export type PostStatus = "published" | "draft";

export type Submission = {
  id: number;
  form: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: SubmissionStatus;
  emailed: number;
  /** The reference shown to the customer when they submitted. */
  reference: string | null;
  payload: string | null;
  ip_hash: string | null;
  user_agent: string | null;
  created_at: string;
};

export type Job = {
  id: number;
  slug: string;
  title: string;
  department: string;
  location: string;
  employment_type: string;
  experience_level: string;
  summary: string;
  responsibilities: string;
  requirements: string;
  benefits: string;
  status: JobStatus;
  posted_at: string;
};

export type Application = {
  id: number;
  job_id: number | null;
  job_title: string;
  name: string;
  email: string;
  phone: string;
  cdl_class: string | null;
  years_experience: number | null;
  linkedin: string | null;
  cover_letter: string | null;
  resume_filename: string | null;
  resume_path: string | null;
  status: ApplicationStatus;
  created_at: string;
};

export type ServiceRow = {
  id: number;
  slug: string;
  name: string;
  nav_label: string;
  nav_description: string;
  short: string;
  body: string;
  typical_loads: string;
  turnaround: string;
  image: string;
  status: ServiceStatus;
  sort_order: number;
};

export type ServiceItem = {
  id: number;
  service_id: number;
  category: string;
  title: string;
  description: string;
  image: string;
  sort_order: number;
};

export type Testimonial = {
  id: number;
  author: string;
  role: string;
  company: string;
  quote: string;
  rating: number;
  status: "published" | "hidden";
  sort_order: number;
  created_at: string;
};

export type Post = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  category: string;
  status: PostStatus;
  published_at: string;
};

export type Shipment = {
  id: number;
  reference: string;
  /** Set when the shipment was created from a quote, so the two stay linked. */
  submission_id: number | null;
  status: ShipmentStatus;
  origin: string;
  destination: string;
  service: string;
  /** Shown only in the admin panel, never returned by the tracking API. */
  customer: string;
  pickup_date: string;
  delivery_estimate: string;
  delivered_at: string;
  note: string;
  created_at: string;
  updated_at: string;
};

export type ShipmentEvent = {
  id: number;
  shipment_id: number;
  status: string;
  location: string;
  note: string;
  occurred_at: string;
};

export type DocumentRecord = {
  id: number;
  kind: string;
  reference: string;
  company: string;
  contact: string;
  email: string;
  phone: string;
  note: string;
  filename: string;
  path: string;
  status: string;
  created_at: string;
};

/** Kept for the callers that still import the old name. */
export type Document = DocumentRecord;
