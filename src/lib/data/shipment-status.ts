/**
 * Shipment statuses. Plain data with no server dependency, so the admin client
 * forms can import it without pulling the database module into the browser
 * bundle.
 */
export const SHIPMENT_STATUSES = [
  "Booked",
  "Picked up",
  "In transit",
  "Out for delivery",
  "Delivered",
  "On hold",
] as const;

export type ShipmentStatus = (typeof SHIPMENT_STATUSES)[number];
