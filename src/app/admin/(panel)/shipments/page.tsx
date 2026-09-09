import type { Metadata } from "next";
import Link from "next/link";
import { PackageSearch } from "lucide-react";
import { getShipmentById, listShipmentEvents, listShipments } from "@/lib/server/db";
import { SHIPMENT_STATUSES } from "@/lib/data/shipment-status";
import { addMilestone, removeShipment } from "@/app/admin/actions";
import { AdminPageHeader } from "@/components/layout/admin-page-header";
import { FormModal } from "@/components/admin/form-modal";
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
  searchParams: Promise<{ edit?: string; events?: string; page?: string }>;
}) {
  const { edit, events, page } = await searchParams;
  const editing = edit ? await getShipmentById(Number(edit)) : null;
  const eventsFor = events ? await getShipmentById(Number(events)) : null;
  const milestones = eventsFor ? await listShipmentEvents(eventsFor.id) : [];
  const all = await listShipments();
  const view = paginate(all, parsePage(page));

  return (
    <>
      <AdminPageHeader
        title="Shipments"
        description="Create a shipment, then add milestones as the load moves."
        action={
          <FormModal
            triggerLabel="Add shipment"
            title={editing ? `Edit: ${editing.reference}` : "Add a shipment"}
            description="Customers look a shipment up by its reference. Only status, route, service and dates are shown publicly."
            editing={Boolean(editing)}
          >
            <ShipmentForm key={editing?.id ?? "new"} shipment={editing ?? undefined} />
          </FormModal>
        }
      />

      {eventsFor && (
        <Card className="mt-10 p-6 md:p-8">
          <h2 className="text-xl font-bold text-navy-900">Milestones: {eventsFor.reference}</h2>
          <p className="mt-2 text-sm leading-relaxed text-steel-600">
            Adding a milestone also updates the shipment&apos;s headline status, so the tracking
            page always reflects the newest entry.
          </p>

          <form
            action={addMilestone}
            className="mt-6 grid gap-4 lg:grid-cols-[1fr_1fr_2fr_auto] lg:items-end"
          >
            <input type="hidden" name="shipment_id" value={eventsFor.id} />
            <div>
              <Label htmlFor="milestone-status">Status</Label>
              <select
                id="milestone-status"
                name="status"
                defaultValue={eventsFor.status}
                className="flex min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-base text-navy-900 outline-none transition hover:border-slate-400 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
              >
                {SHIPMENT_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="milestone-location">Location</Label>
              <Input id="milestone-location" name="location" placeholder="Reno, NV" />
            </div>
            <div>
              <Label htmlFor="milestone-note">Note (shown publicly)</Label>
              <Input id="milestone-note" name="note" />
            </div>
            <Button type="submit">Add milestone</Button>
          </form>

          {milestones.length > 0 && (
            <ol className="mt-8 grid gap-3">
              {milestones.map((event) => (
                <li key={event.id} className="rounded-lg border border-slate-200 p-4 text-sm">
                  <p className="font-semibold text-navy-900">{event.status}</p>
                  <p className="mt-0.5 text-xs text-steel-600">
                    {formatStamp(event.occurred_at)}
                    {event.location ? ` · ${event.location}` : ""}
                  </p>
                  {event.note && <p className="mt-1.5 text-steel-600">{event.note}</p>}
                </li>
              ))}
            </ol>
          )}

          <p className="mt-6 text-sm">
            <Link
              href="/admin/shipments"
              className="rounded-sm font-semibold text-navy-900 underline decoration-gold-500 decoration-2 underline-offset-4 hover:text-gold-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
            >
              Done with milestones
            </Link>
          </p>
        </Card>
      )}

      <h2 className="mt-10 text-xl font-bold text-navy-900">All shipments ({view.total})</h2>

      {view.total === 0 ? (
        <Card className="mt-4 p-10 text-center">
          <PackageSearch className="mx-auto h-8 w-8 text-steel-600" aria-hidden="true" />
          <p className="mt-4 font-semibold text-navy-900">No shipments yet.</p>
          <p className="mt-2 text-sm text-steel-600">
            Add one above and give the customer its reference number so they can track it.
          </p>
        </Card>
      ) : (
        <div className="mt-4 grid gap-4">
          {view.items.map((s) => (
            <Card key={s.id} className="p-5 md:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold text-navy-900">{s.reference}</h3>
                    <span className="rounded-full bg-gold-500/15 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-gold-600">
                      {s.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-steel-600">
                    {[s.origin, s.destination].filter(Boolean).join(" to ") || "Route not set"}
                    {s.customer ? ` · ${s.customer}` : ""}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button asChild size="sm" variant="ghost">
                    <Link href={`/admin/shipments?edit=${s.id}`}>Edit</Link>
                  </Button>
                  <Button asChild size="sm" variant="ghost">
                    <Link href={`/admin/shipments?events=${s.id}`}>Milestones</Link>
                  </Button>
                  <form action={removeShipment}>
                    <input type="hidden" name="id" value={s.id} />
                    <Button type="submit" size="sm" variant="ghost" className="text-danger">
                      Delete
                    </Button>
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
