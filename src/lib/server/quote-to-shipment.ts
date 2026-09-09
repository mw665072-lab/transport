import "server-only";
import type { Submission } from "@/lib/data/records";
import { getServices } from "@/lib/server/services";

/**
 * Turns a freight quote submission into the fields a shipment needs.
 *
 * The quote already holds the route, timing, and service, so an operator
 * accepting a load should not retype any of it. The customer's original
 * reference carries over, which means the number they were given on the day they
 * enquired is the number that works on the tracking page.
 */
export type ShipmentDraft = {
  reference: string;
  origin: string;
  destination: string;
  service: string;
  customer: string;
  pickupDate: string;
  note: string;
};

function readPayload(submission: Submission): Record<string, unknown> {
  if (!submission.payload) return {};
  try {
    const parsed: unknown = JSON.parse(submission.payload);
    return parsed && typeof parsed === "object" ? (parsed as Record<string, unknown>) : {};
  } catch {
    return {};
  }
}

const text = (value: unknown): string => (typeof value === "string" ? value.trim() : "");

export async function draftFromSubmission(
  submission: Submission,
): Promise<ShipmentDraft | null> {
  if (submission.form !== "freight-quote") return null;

  const payload = readPayload(submission);
  const join = (city: unknown, state: unknown) =>
    [text(city), text(state)].filter(Boolean).join(", ");

  // The quote stores a service slug; the shipment shows the service name.
  const slug = text(payload.serviceType);
  const service = slug
    ? ((await getServices()).find((s) => s.slug === slug)?.name ?? slug)
    : "";

  const note = [
    text(payload.commodity) && `Commodity: ${text(payload.commodity)}`,
    payload.weightLbs ? `Weight: ${String(payload.weightLbs)} lb` : "",
    text(payload.dimensions) && `Dimensions: ${text(payload.dimensions)}`,
    text(payload.notes) && `Customer notes: ${text(payload.notes)}`,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    reference: submission.reference ?? "",
    origin: join(payload.pickupCity, payload.pickupState),
    destination: join(payload.deliveryCity, payload.deliveryState),
    service,
    customer: text(payload.company) || submission.name,
    pickupDate: text(payload.pickupDate),
    note,
  };
}
