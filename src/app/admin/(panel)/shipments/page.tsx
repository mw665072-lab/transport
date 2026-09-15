import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calendar, MapPin, PackageSearch, Plus, Tag } from "lucide-react";
import {
  getShipmentById,
  getSubmission,
  listShipmentEvents,
  listShipments,
} from "@/lib/server/db";
import { draftFromSubmission } from "@/lib/server/quote-to-shipment";
import { SHIPMENT_STATUSES } from "@/lib/data/shipment-status";
import { addMilestone, removeMilestone, removeShipment } from "@/app/admin/actions";
import { AdminPageHeader } from "@/components/layout/admin-page-header";
import { FormModal } from "@/components/admin/form-modal";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { Pagination, paginate, parsePage } from "@/components/admin/pagination";
import { ShipmentForm } from "@/app/admin/(panel)/shipments/shipment-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Shipments",
  robots: { index: false, follow: false, nocache: true },
};

function formatStamp(value: string) {
  const date = new Date(value.replace(" ", "T") + "Z");
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

export default async function AdminShipments({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; events?: string; from?: string; page?: string }>;
}) {
  const { edit, events, from, page } = await searchParams;
  const editing = edit ? await getShipmentById(Number(edit)) : null;
  const eventsFor = events ? await getShipmentById(Number(events)) : null;
  const milestones = eventsFor ? await listShipmentEvents(eventsFor.id) : [];
  const fromSubmission = from ? await getSubmission(Number(from)) : null;
  const draft = fromSubmission ? await draftFromSubmission(fromSubmission) : null;

  const all = await listShipments();
  const view = paginate(all, parsePage(page));

  return (
    <>
      <AdminPageHeader
        title="Active Shipments"
        description="Create and track freight shipments, update delivery progress, and publish live milestones."
        action={
          <FormModal
            triggerLabel="Add shipment"
            title={
              editing
                ? `Edit Shipment: ${editing.reference}`
                : draft
                  ? `New Shipment from ${fromSubmission?.name}'s quote`
                  : "Create New Shipment"
            }
            description={
              draft
                ? "Prefilled from the quote. The customer's original reference carries over, so the tracking number works automatically."
                : "Customers look up shipments by reference. Status, route, service and milestone updates are visible publicly."
            }
            editing={Boolean(editing) || Boolean(draft)}
          >
            <ShipmentForm
              key={editing?.id ?? (draft ? `from-${from}` : "new")}
              shipment={editing ?? undefined}
              draft={draft ?? undefined}
              submissionId={fromSubmission?.id}
            />
          </FormModal>
        }
      />

      {eventsFor && (
        <Card className="mt-6 border-gold-500/40 bg-gold-50/10 p-4 sm:p-6 lg:p-7 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-navy-950">
                Milestones & Tracking: <span className="text-gold-600">{eventsFor.reference}</span>
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-500">
                Adding a milestone automatically updates the shipment&apos;s live tracking status.
              </p>
            </div>
            <Button asChild size="sm" variant="outline" className="h-9 text-xs">
              <Link href="/admin/shipments">Close milestones</Link>
            </Button>
          </div>

          <form
            action={addMilestone}
            className="mt-5 grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4 lg:items-end"
          >
            <input type="hidden" name="shipment_id" value={eventsFor.id} />
            <div>
              <Label htmlFor="milestone-status" className="text-xs font-semibold text-slate-700">Status</Label>
              <select
                id="milestone-status"
                name="status"
                defaultValue={eventsFor.status}
                className="mt-1 flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-navy-950 outline-none transition hover:border-slate-400 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
              >
                {SHIPMENT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="milestone-location" className="text-xs font-semibold text-slate-700">Location</Label>
              <Input id="milestone-location" name="location" placeholder="e.g. Reno, NV" className="mt-1 h-10 text-sm" />
            </div>
            <div>
              <Label htmlFor="milestone-note" className="text-xs font-semibold text-slate-700">Public note</Label>
              <Input id="milestone-note" name="note" placeholder="e.g. Cleared inspection" className="mt-1 h-10 text-sm" />
            </div>
            <div>
              <Button type="submit" className="h-10 w-full text-xs font-semibold">
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Add milestone</span>
              </Button>
            </div>
          </form>

          {milestones.length > 0 ? (
            <div className="mt-6 border-t border-slate-200/80 pt-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Timeline history ({milestones.length})</span>
              <ol className="mt-3 grid gap-2.5">
                {milestones.map((event) => (
                  <li
                    key={event.id}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 rounded-lg border border-slate-200 bg-white p-3 sm:p-4 text-xs sm:text-sm"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-navy-950">{event.status}</span>
                        {event.location && (
                          <span className="inline-flex items-center gap-1 rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                            <MapPin className="h-3 w-3" aria-hidden="true" />
                            {event.location}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-slate-400">{formatStamp(event.occurred_at)}</p>
                      {event.note && <p className="mt-1.5 text-slate-700">{event.note}</p>}
                    </div>

                    <form action={removeMilestone} className="shrink-0 self-end sm:self-center">
                      <input type="hidden" name="id" value={event.id} />
                      <ConfirmSubmit
                        recordKind="milestone"
                        recordName={`${event.status} milestone`}
                        label="Delete"
                        className="h-8 px-2 text-xs"
                      />
                    </form>
                  </li>
                ))}
              </ol>
            </div>
          ) : (
            <p className="mt-4 text-xs text-slate-400 italic">No milestones recorded yet for this load.</p>
          )}
        </Card>
      )}

      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-bold text-navy-950">
          All Shipments ({view.total})
        </h2>
      </div>

      {view.total === 0 ? (
        <Card className="mt-4 p-8 sm:p-12 text-center border-dashed border-slate-200">
          <PackageSearch className="mx-auto h-8 w-8 text-slate-400" aria-hidden="true" />
          <p className="mt-3 font-semibold text-navy-950">No shipments found</p>
          <p className="mt-1 text-sm text-slate-500">
            Click &ldquo;Add shipment&rdquo; to create a new tracking reference.
          </p>
        </Card>
      ) : (
        <div className="mt-4 grid gap-3.5 sm:gap-4">
          {view.items.map((s) => (
            <Card
              key={s.id}
              className="group rounded-xl border border-slate-200/90 bg-white p-4 sm:p-5 lg:p-6 shadow-xs hover:border-slate-300 transition-colors"
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold tracking-tight text-navy-950">{s.reference}</h3>
                    <span className="inline-flex items-center rounded-full bg-gold-500/15 border border-gold-500/30 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-gold-700">
                      {s.status}
                    </span>
                    {s.customer && (
                      <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                        <Tag className="h-3 w-3 text-slate-400" aria-hidden="true" />
                        {s.customer}
                      </span>
                    )}
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs sm:text-sm font-medium text-slate-800">
                    <span className="inline-flex items-center gap-1 text-slate-700">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                      {s.origin || "Origin not set"}
                    </span>
                    <ArrowRight className="h-3 w-3 text-slate-400" aria-hidden="true" />
                    <span className="inline-flex items-center gap-1 text-slate-700">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                      {s.destination || "Destination not set"}
                    </span>
                    {s.service && (
                      <span className="text-xs text-slate-400 font-normal">({s.service})</span>
                    )}
                  </div>

                  {(s.pickup_date || s.delivery_estimate) && (
                    <p className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                      {s.pickup_date && <span>Pickup: {s.pickup_date}</span>}
                      {s.pickup_date && s.delivery_estimate && <span>·</span>}
                      {s.delivery_estimate && <span>Est. Delivery: {s.delivery_estimate}</span>}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-1.5 shrink-0 pt-2 lg:pt-0 border-t border-slate-100 lg:border-t-0">
                  <Button asChild size="sm" variant="ghost" className="h-9 px-3 text-xs text-slate-700 hover:text-navy-950">
                    <Link href={`/admin/shipments?edit=${s.id}`}>Edit</Link>
                  </Button>
                  <Button asChild size="sm" variant="ghost" className="h-9 px-3 text-xs text-slate-700 hover:text-navy-950">
                    <Link href={`/admin/shipments?events=${s.id}`}>Milestones</Link>
                  </Button>
                  <form action={removeShipment}>
                    <input type="hidden" name="id" value={s.id} />
                    <ConfirmSubmit
                      recordKind="shipment"
                      recordName={`shipment ${s.reference}`}
                      description="All associated milestone history will be deleted as well."
                      label="Delete"
                      className="h-9 px-2.5 text-xs"
                    />
                  </form>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Pagination
        basePath="/admin/shipments"
        page={view.page}
        totalPages={view.totalPages}
        from={view.from}
        to={view.to}
        total={view.total}
        label="shipments"
      />
    </>
  );
}
