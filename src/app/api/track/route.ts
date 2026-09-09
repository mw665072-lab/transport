import { NextResponse } from "next/server";
import { getShipmentByReference, listShipmentEvents } from "@/lib/server/db";
import { checkRateLimit } from "@/lib/server/rate-limit";
import { clientIp, hashIp } from "@/lib/server/form-intake";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Reference lookup. A wrong reference and a reference that does not exist return
 * the same response, so the endpoint cannot be used to discover valid numbers,
 * and it is rate limited for the same reason.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ found: false }, { status: 400 });
  }

  const reference =
    typeof (body as { reference?: unknown })?.reference === "string"
      ? (body as { reference: string }).reference.trim()
      : "";

  if (reference.length < 4 || reference.length > 40) {
    return NextResponse.json({
      found: false,
      message: "Enter the reference number from your confirmation.",
    });
  }

  const limit = checkRateLimit(`track:${hashIp(clientIp(request))}`);
  if (!limit.allowed) {
    return NextResponse.json(
      { found: false, message: "Too many lookups. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  const shipment = await getShipmentByReference(reference);
  if (!shipment) {
    return NextResponse.json({
      found: false,
      message:
        "We could not find that reference. Check the number, or call dispatch and we will look it up.",
    });
  }

  const events = await listShipmentEvents(shipment.id);

  // Only shipment-level facts are returned. Customer name and internal notes
  // stay in the admin panel, so a guessed reference leaks no personal data.
  return NextResponse.json({
    found: true,
    shipment: {
      reference: shipment.reference,
      status: shipment.status,
      origin: shipment.origin,
      destination: shipment.destination,
      service: shipment.service,
      pickupDate: shipment.pickup_date,
      deliveryEstimate: shipment.delivery_estimate,
      deliveredAt: shipment.delivered_at,
    },
    events: events.map((e) => ({
      id: e.id,
      status: e.status,
      location: e.location,
      note: e.note,
      occurredAt: e.occurred_at,
    })),
  });
}
