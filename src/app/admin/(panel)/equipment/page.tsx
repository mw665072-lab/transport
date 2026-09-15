import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, Eye, EyeOff, Truck } from "lucide-react";
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
  title: "Equipment Fleet",
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
        title="Fleet & Equipment"
        description="Vehicles, trailers, and specialized transport equipment shown across the website."
        action={
          <FormModal
            triggerLabel="Add equipment"
            title={editing ? `Edit Equipment: ${editing.name}` : "Add Fleet Vehicle"}
            description="Specifications take one “Label: value” pair per line. Typical uses take one item per line."
            editing={Boolean(editing)}
          >
            <EquipmentForm key={editing?.id ?? "new"} item={editing ?? undefined} />
          </FormModal>
        }
      />

      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-bold text-navy-950">
          All Equipment ({view.total})
        </h2>
      </div>

      {view.total === 0 ? (
        <Card className="mt-4 p-8 sm:p-12 text-center border-dashed border-slate-200">
          <Truck className="mx-auto h-8 w-8 text-slate-400" aria-hidden="true" />
          <p className="mt-3 font-semibold text-navy-950">No custom equipment created</p>
          <p className="mt-1 text-sm text-slate-500">
            The site uses default fleet entries until you add custom vehicles.
          </p>
        </Card>
      ) : (
        <div className="mt-4 grid gap-3.5 sm:gap-4">
          {view.items.map((item) => (
            <Card
              key={item.id}
              className="group rounded-xl border border-slate-200/90 bg-white p-4 sm:p-5 lg:p-6 shadow-xs hover:border-slate-300 transition-colors"
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-navy-950">{item.name}</h3>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                        item.status === "published"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : "bg-slate-100 text-slate-500 border border-slate-200"
                      }`}
                    >
                      {item.status === "published" ? "Live" : "Hidden"}
                    </span>
                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                      Order: #{item.sort_order}
                    </span>
                  </div>
                  <p className="mt-1 text-xs sm:text-sm text-slate-500">
                    <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-700">/equipment/{item.slug}</code>
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 shrink-0 pt-2 lg:pt-0 border-t border-slate-100 lg:border-t-0">
                  <Button asChild size="sm" variant="ghost" className="h-9 px-3 text-xs text-slate-700 hover:text-navy-950">
                    <Link href={`/admin/equipment?edit=${item.id}`}>Edit</Link>
                  </Button>
                  {item.status === "published" && (
                    <Button asChild size="sm" variant="ghost" className="h-9 px-3 text-xs text-slate-700 hover:text-navy-950">
                      <Link href={`/equipment/${item.slug}`} target="_blank">
                        View
                        <ExternalLink className="h-3 w-3 ml-1 text-slate-400" aria-hidden="true" />
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
                    <Button type="submit" size="sm" variant="ghost" className="h-9 px-2.5 text-xs text-slate-600 hover:text-navy-950">
                      {item.status === "published" ? (
                        <>
                          <EyeOff className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                          Hide
                        </>
                      ) : (
                        <>
                          <Eye className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                          Publish
                        </>
                      )}
                    </Button>
                  </form>
                  <form action={removeEquipment}>
                    <input type="hidden" name="id" value={item.id} />
                    <ConfirmSubmit
                      recordKind="equipment"
                      recordName={item.name}
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
