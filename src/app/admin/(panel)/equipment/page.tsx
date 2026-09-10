import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, Truck } from "lucide-react";
import { getEquipmentById, listEquipment } from "@/lib/server/db";
import { removeEquipment, toggleEquipment } from "@/app/admin/actions";
import { AdminPageHeader } from "@/components/layout/admin-page-header";
import { FormModal } from "@/components/admin/form-modal";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { Pagination, paginate, parsePage } from "@/components/admin/pagination";
import { EquipmentForm } from "@/app/admin/(panel)/equipment/equipment-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Equipment",
  robots: { index: false, follow: false, nocache: true },
};

export default async function AdminEquipment({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; page?: string }>;
}) {
  const { edit, page } = await searchParams;
  const editing = edit ? await getEquipmentById(Number(edit)) : null;
  const all = await listEquipment({ includeHidden: true });
  const view = paginate(all, parsePage(page));

  return (
    <>
      <AdminPageHeader
        title="Equipment"
        description="The fleet shown on the homepage, the equipment page, and each vehicle's own page."
        action={
          <FormModal
            triggerLabel="Add equipment"
            title={editing ? `Edit: ${editing.name}` : "Add equipment"}
            description="Specifications take one “Label: value” pair per line. Typical uses take one item per line."
            editing={Boolean(editing)}
          >
            <EquipmentForm key={editing?.id ?? "new"} item={editing ?? undefined} />
          </FormModal>
        }
      />

      <h2 className="mt-10 text-xl font-bold text-navy-900">All equipment ({view.total})</h2>

      {view.total === 0 ? (
        <Card className="mt-4 p-10 text-center">
          <Truck className="mx-auto h-8 w-8 text-steel-600" aria-hidden="true" />
          <p className="mt-4 font-semibold text-navy-900">No equipment in the database yet.</p>
          <p className="mt-2 text-sm text-steel-600">
            Until you add one, the site falls back to the three vehicles defined in the code, so
            the fleet is never empty.
          </p>
        </Card>
      ) : (
        <div className="mt-4 grid gap-4">
          {view.items.map((item) => (
            <Card key={item.id} className="p-5 md:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold text-navy-900">{item.name}</h3>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${
                        item.status === "published"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {item.status === "published" ? "Live" : "Hidden"}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-steel-600">
                      #{item.sort_order}
                    </span>
                  </div>
                  <p className="mt-1 break-all text-sm text-steel-600">
                    /equipment/{item.slug}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button asChild size="sm" variant="ghost">
                    <Link href={`/admin/equipment?edit=${item.id}`}>Edit</Link>
                  </Button>
                  {item.status === "published" && (
                    <Button asChild size="sm" variant="ghost">
                      <Link href={`/equipment/${item.slug}`} target="_blank">
                        View
                        <ExternalLink aria-hidden="true" />
                        <span className="sr-only"> (opens in a new tab)</span>
                      </Link>
                    </Button>
                  )}
                  <form action={toggleEquipment}>
                    <input type="hidden" name="id" value={item.id} />
                    <input
                      type="hidden"
                      name="status"
                      value={item.status === "published" ? "hidden" : "published"}
                    />
                    <Button type="submit" size="sm" variant="ghost">
                      {item.status === "published" ? "Hide" : "Publish"}
                    </Button>
                  </form>
                  <form action={removeEquipment}>
                    <input type="hidden" name="id" value={item.id} />
                    <ConfirmSubmit recordKind="equipment entry" recordName={item.name} />
                  </form>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Pagination
        basePath="/admin/equipment"
        page={view.page}
        totalPages={view.totalPages}
        from={view.from}
        to={view.to}
        total={view.total}
        label="vehicles"
      />
    </>
  );
}
