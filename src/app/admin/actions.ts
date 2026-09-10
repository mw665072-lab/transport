"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createSession,
  destroySession,
  isAuthenticated,
  verifyPassword,
} from "@/lib/server/auth";
import {
  setStatus,
  upsertJob,
  setJobStatus,
  deleteJob,
  setApplicationStatus,
  type SubmissionStatus,
  type JobStatus,
  type ApplicationStatus,
  upsertService,
  setServiceStatus,
  deleteService,
  type ServiceStatus,
  upsertServiceItem,
  deleteServiceItem,
  setSetting,
  upsertTestimonial,
  deleteTestimonial,
  upsertPost,
  deletePost,
  upsertShipment,
  addShipmentEvent,
  deleteShipment,
  setDocumentStatus,
  upsertEquipment,
  setEquipmentStatus,
  deleteEquipment,
  upsertCoverage,
  deleteCoverage,
  type PostStatus,
  type ShipmentStatus,
} from "@/lib/server/db";

export async function login(_prev: string | undefined, formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (!verifyPassword(password)) {
    // Deliberately vague: no hint about whether the panel is even configured.
    return "Incorrect password.";
  }
  await createSession();
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

export async function updateStatus(formData: FormData) {
  if (!(await isAuthenticated())) redirect("/admin/login");
  const id = Number(formData.get("id"));
  const status = String(formData.get("status")) as SubmissionStatus;
  if (!Number.isInteger(id) || !["new", "read", "archived"].includes(status)) return;
  await setStatus(id, status);
  revalidatePath("/admin");
}

/** Kebab-case slug derived from the title when the operator does not supply one. */
function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function saveJob(_prev: string | undefined, formData: FormData) {
  if (!(await isAuthenticated())) redirect("/admin/login");

  const title = String(formData.get("title") ?? "").trim();
  const department = String(formData.get("department") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const employmentType = String(formData.get("employment_type") ?? "").trim();

  if (!title || !department || !location || !employmentType) {
    return "Title, department, location, and employment type are all required.";
  }

  const rawId = formData.get("id");
  const id = rawId ? Number(rawId) : undefined;
  const slug = slugify(String(formData.get("slug") ?? "") || title);
  if (!slug) return "Could not build a URL from that title. Add a slug manually.";

  try {
    await upsertJob({
      id: Number.isInteger(id) && id ? id : undefined,
      slug,
      title,
      department,
      location,
      employment_type: employmentType,
      experience_level: String(formData.get("experience_level") ?? "").trim(),
      summary: String(formData.get("summary") ?? "").trim(),
      responsibilities: String(formData.get("responsibilities") ?? "").trim(),
      requirements: String(formData.get("requirements") ?? "").trim(),
      benefits: String(formData.get("benefits") ?? "").trim(),
      // An unchecked box sends nothing, so presence of the field is the signal.
      status: (formData.get("status") === "open" ? "open" : "closed") as JobStatus,
    });
  } catch (cause) {
    console.error("[admin] could not save job", cause);
    return "That URL slug is already used by another role. Choose a different one.";
  }

  revalidatePath("/admin/jobs");
  revalidatePath("/career");
  redirect("/admin/jobs");
}

export async function toggleJob(formData: FormData) {
  if (!(await isAuthenticated())) redirect("/admin/login");
  const id = Number(formData.get("id"));
  const status = String(formData.get("status")) as JobStatus;
  if (!Number.isInteger(id) || !["open", "closed"].includes(status)) return;
  await setJobStatus(id, status);
  revalidatePath("/admin/jobs");
  revalidatePath("/career");
}

export async function removeJob(formData: FormData) {
  if (!(await isAuthenticated())) redirect("/admin/login");
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;
  await deleteJob(id);
  revalidatePath("/admin/jobs");
  revalidatePath("/career");
}

export async function updateApplicationStatus(formData: FormData) {
  if (!(await isAuthenticated())) redirect("/admin/login");
  const id = Number(formData.get("id"));
  const status = String(formData.get("status")) as ApplicationStatus;
  if (
    !Number.isInteger(id) ||
    !["new", "reviewing", "shortlisted", "rejected"].includes(status)
  )
    return;
  await setApplicationStatus(id, status);
  revalidatePath("/admin/applications");
}

export async function saveService(_prev: string | undefined, formData: FormData) {
  if (!(await isAuthenticated())) redirect("/admin/login");

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return "The service name is required.";

  const slug = slugify(String(formData.get("slug") ?? "") || name);
  if (!slug) return "Could not build a URL from that name. Add a slug manually.";

  const rawId = formData.get("id");
  const id = rawId ? Number(rawId) : undefined;

  try {
    await upsertService({
      id: Number.isInteger(id) && id ? id : undefined,
      slug,
      name,
      nav_label: String(formData.get("nav_label") ?? "").trim(),
      nav_description: String(formData.get("nav_description") ?? "").trim(),
      short: String(formData.get("short") ?? "").trim(),
      body: String(formData.get("body") ?? "").trim(),
      typical_loads: String(formData.get("typical_loads") ?? "").trim(),
      turnaround: String(formData.get("turnaround") ?? "").trim(),
      image: String(formData.get("image") ?? "").trim() || "/images/hero-freight.jpg",
      status: (formData.get("status") === "published"
        ? "published"
        : "hidden") as ServiceStatus,
      sort_order: Number(formData.get("sort_order") ?? 0) || 0,
    });
  } catch (cause) {
    console.error("[admin] could not save service", cause);
    return "That URL slug is already used by another service. Choose a different one.";
  }

  // The menu and footer are built from this table, so every page revalidates.
  revalidatePath("/", "layout");
  redirect("/admin/services");
}

export async function toggleService(formData: FormData) {
  if (!(await isAuthenticated())) redirect("/admin/login");
  const id = Number(formData.get("id"));
  const status = String(formData.get("status")) as ServiceStatus;
  if (!Number.isInteger(id) || !["published", "hidden"].includes(status)) return;
  await setServiceStatus(id, status);
  revalidatePath("/", "layout");
}

export async function removeService(formData: FormData) {
  if (!(await isAuthenticated())) redirect("/admin/login");
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;
  await deleteService(id);
  revalidatePath("/", "layout");
}

export async function saveServiceItem(_prev: string | undefined, formData: FormData) {
  if (!(await isAuthenticated())) redirect("/admin/login");

  const serviceId = Number(formData.get("service_id"));
  const title = String(formData.get("title") ?? "").trim();
  if (!Number.isInteger(serviceId) || !serviceId) return "Pick a service for this item.";
  if (!title) return "The item title is required.";

  const rawId = formData.get("id");
  const id = rawId ? Number(rawId) : undefined;

  try {
    await upsertServiceItem({
      id: Number.isInteger(id) && id ? id : undefined,
      service_id: serviceId,
      // Categories drive the filter tabs, so they are normalised to lower case.
      category: String(formData.get("category") ?? "")
        .trim()
        .toLowerCase(),
      title,
      description: String(formData.get("description") ?? "").trim(),
      image: String(formData.get("image") ?? "").trim(),
      sort_order: Number(formData.get("sort_order") ?? 0) || 0,
    });
  } catch (cause) {
    console.error("[admin] could not save service item", cause);
    return "Could not save that item. Please try again.";
  }

  revalidatePath("/", "layout");
  redirect(`/admin/services?items=${serviceId}`);
}

export async function removeServiceItem(formData: FormData) {
  if (!(await isAuthenticated())) redirect("/admin/login");
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;
  await deleteServiceItem(id);
  revalidatePath("/", "layout");
}

export async function saveSocialLinks(_prev: string | undefined, formData: FormData) {
  if (!(await isAuthenticated())) redirect("/admin/login");

  const keys = [
    "social_facebook",
    "social_linkedin",
    "social_x",
    "social_instagram",
    "social_youtube",
  ];

  for (const key of keys) {
    const value = String(formData.get(key) ?? "").trim();
    // A blank value clears the link; anything else must be a full URL, otherwise
    // the footer would render a link that goes nowhere.
    if (value && !/^https?:\/\/.+\..+/.test(value)) {
      return "Each profile link must be a full URL starting with https://";
    }
    await setSetting(key, value);
  }

  revalidatePath("/", "layout");
  return "Saved.";
}

export async function saveTestimonial(_prev: string | undefined, formData: FormData) {
  if (!(await isAuthenticated())) redirect("/admin/login");

  const author = String(formData.get("author") ?? "").trim();
  const quote = String(formData.get("quote") ?? "").trim();
  if (!author) return "The author name is required.";
  if (quote.length < 10) return "Add a little more of the quote.";

  const rawId = formData.get("id");
  const id = rawId ? Number(rawId) : undefined;
  const rating = Math.min(5, Math.max(1, Number(formData.get("rating") ?? 5) || 5));

  await upsertTestimonial({
    id: Number.isInteger(id) && id ? id : undefined,
    author,
    role: String(formData.get("role") ?? "").trim(),
    company: String(formData.get("company") ?? "").trim(),
    quote,
    rating,
    status: formData.get("status") === "published" ? "published" : "hidden",
    sort_order: Number(formData.get("sort_order") ?? 0) || 0,
  });

  revalidatePath("/", "layout");
  redirect("/admin/testimonials");
}

export async function removeTestimonial(formData: FormData) {
  if (!(await isAuthenticated())) redirect("/admin/login");
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;
  await deleteTestimonial(id);
  revalidatePath("/", "layout");
}

export async function savePost(_prev: string | undefined, formData: FormData) {
  if (!(await isAuthenticated())) redirect("/admin/login");

  const title = String(formData.get("title") ?? "").trim();
  if (!title) return "The title is required.";

  const slug = slugify(String(formData.get("slug") ?? "") || title);
  if (!slug) return "Could not build a URL from that title. Add a slug manually.";

  const rawId = formData.get("id");
  const id = rawId ? Number(rawId) : undefined;
  const publishedAt = String(formData.get("published_at") ?? "").trim();

  try {
    await upsertPost({
      id: Number.isInteger(id) && id ? id : undefined,
      slug,
      title,
      excerpt: String(formData.get("excerpt") ?? "").trim(),
      // Paragraphs are separated by a blank line when the article renders.
      body: String(formData.get("body") ?? "").trim(),
      category: String(formData.get("category") ?? "").trim() || "Update",
      status: (formData.get("status") === "published" ? "published" : "draft") as PostStatus,
      published_at: /^\d{4}-\d{2}-\d{2}$/.test(publishedAt)
        ? publishedAt
        : new Date().toISOString().slice(0, 10),
    });
  } catch (cause) {
    console.error("[admin] could not save post", cause);
    return "That URL slug is already used by another article. Choose a different one.";
  }

  revalidatePath("/", "layout");
  redirect("/admin/posts");
}

export async function removePost(formData: FormData) {
  if (!(await isAuthenticated())) redirect("/admin/login");
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;
  await deletePost(id);
  revalidatePath("/", "layout");
}

export async function saveShipment(_prev: string | undefined, formData: FormData) {
  if (!(await isAuthenticated())) redirect("/admin/login");

  const reference = String(formData.get("reference") ?? "")
    .trim()
    .toUpperCase();
  if (reference.length < 4) return "The reference number is required.";

  const rawId = formData.get("id");
  const id = rawId ? Number(rawId) : undefined;

  try {
    const submissionId = Number(formData.get("submission_id"));
    await upsertShipment({
      id: Number.isInteger(id) && id ? id : undefined,
      reference,
      // Set when the shipment was created from a quote, so the two stay linked.
      submission_id: Number.isInteger(submissionId) && submissionId ? submissionId : null,
      status: String(formData.get("status") ?? "Booked") as ShipmentStatus,
      origin: String(formData.get("origin") ?? "").trim(),
      destination: String(formData.get("destination") ?? "").trim(),
      service: String(formData.get("service") ?? "").trim(),
      customer: String(formData.get("customer") ?? "").trim(),
      pickup_date: String(formData.get("pickup_date") ?? "").trim(),
      delivery_estimate: String(formData.get("delivery_estimate") ?? "").trim(),
      delivered_at: String(formData.get("delivered_at") ?? "").trim(),
      note: String(formData.get("note") ?? "").trim(),
    });
  } catch (cause) {
    console.error("[admin] could not save shipment", cause);
    return "That reference is already used by another shipment.";
  }

  revalidatePath("/admin/shipments");
  redirect("/admin/shipments");
}

export async function addMilestone(formData: FormData) {
  if (!(await isAuthenticated())) redirect("/admin/login");
  const shipmentId = Number(formData.get("shipment_id"));
  const status = String(formData.get("status") ?? "").trim();
  if (!Number.isInteger(shipmentId) || !status) return;

  await addShipmentEvent({
    shipmentId,
    status,
    location: String(formData.get("location") ?? "").trim(),
    note: String(formData.get("note") ?? "").trim(),
  });
  revalidatePath("/admin/shipments");
}

export async function removeShipment(formData: FormData) {
  if (!(await isAuthenticated())) redirect("/admin/login");
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;
  await deleteShipment(id);
  revalidatePath("/admin/shipments");
}

export async function updateDocumentStatus(formData: FormData) {
  if (!(await isAuthenticated())) redirect("/admin/login");
  const id = Number(formData.get("id"));
  const status = String(formData.get("status"));
  if (!Number.isInteger(id) || !["new", "matched", "archived"].includes(status)) return;
  await setDocumentStatus(id, status);
  revalidatePath("/admin/documents");
}

export async function saveEquipment(_prev: string | undefined, formData: FormData) {
  if (!(await isAuthenticated())) redirect("/admin/login");

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return "The equipment name is required.";
  const slug = slugify(String(formData.get("slug") ?? "") || name);
  if (!slug) return "Could not build a URL from that name. Add a slug manually.";

  const rawId = formData.get("id");
  const id = rawId ? Number(rawId) : undefined;

  try {
    await upsertEquipment({
      id: Number.isInteger(id) && id ? id : undefined,
      slug,
      name,
      image: String(formData.get("image") ?? "").trim() || "/images/box-truck.jpg",
      description: String(formData.get("description") ?? "").trim(),
      body: String(formData.get("body") ?? "").trim(),
      specs: String(formData.get("specs") ?? "").trim(),
      typical_uses: String(formData.get("typical_uses") ?? "").trim(),
      status: formData.get("status") === "published" ? "published" : "hidden",
      sort_order: Number(formData.get("sort_order") ?? 0) || 0,
    });
  } catch (cause) {
    console.error("[admin] could not save equipment", cause);
    const duplicate =
      typeof cause === "object" &&
      cause !== null &&
      (cause as { code?: number }).code === 11000;
    return duplicate
      ? "That URL slug is already used by another vehicle. Choose a different one."
      : "Could not save the vehicle. Check the database connection and try again.";
  }

  revalidatePath("/", "layout");
  redirect("/admin/equipment");
}

export async function toggleEquipment(formData: FormData) {
  if (!(await isAuthenticated())) redirect("/admin/login");
  const id = Number(formData.get("id"));
  const status = String(formData.get("status"));
  if (!Number.isInteger(id) || !["published", "hidden"].includes(status)) return;
  await setEquipmentStatus(id, status as "published" | "hidden");
  revalidatePath("/", "layout");
}

export async function removeEquipment(formData: FormData) {
  if (!(await isAuthenticated())) redirect("/admin/login");
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;
  await deleteEquipment(id);
  revalidatePath("/", "layout");
}

export async function saveCoverage(_prev: string | undefined, formData: FormData) {
  if (!(await isAuthenticated())) redirect("/admin/login");

  const label = String(formData.get("label") ?? "").trim();
  if (!label) return "Enter a state or lane.";
  const kind = formData.get("kind") === "lane" ? "lane" : "state";
  const rawId = formData.get("id");
  const id = rawId ? Number(rawId) : undefined;

  await upsertCoverage({
    id: Number.isInteger(id) && id ? id : undefined,
    kind,
    label,
    // Unticking the checkbox omits the field entirely, so absence means hidden.
    status: formData.get("status") === "published" ? "published" : "hidden",
    sort_order: Number(formData.get("sort_order") ?? 0) || 0,
  });

  revalidatePath("/", "layout");
  redirect("/admin/coverage");
}

export async function removeCoverage(formData: FormData) {
  if (!(await isAuthenticated())) redirect("/admin/login");
  const id = Number(formData.get("id"));
  if (!Number.isInteger(id)) return;
  await deleteCoverage(id);
  revalidatePath("/", "layout");
}
