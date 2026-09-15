import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, Eye, EyeOff, Image as ImageIcon, Layers } from "lucide-react";
import { getServiceById, listServices, listServiceItems } from "@/lib/server/db";
import { removeService, removeServiceItem, toggleService } from "@/app/admin/actions";
import { AdminPageHeader } from "@/components/layout/admin-page-header";
import { FormModal } from "@/components/admin/form-modal";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { Pagination, paginate, parsePage } from "@/components/admin/pagination";
import { ServiceForm } from "@/app/admin/(panel)/services/service-form";
import { ItemForm } from "@/app/admin/(panel)/services/item-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Services",
  robots: { index: false, follow: false, nocache: true },
};

export default async function AdminServices({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; items?: string; page?: string }>;
}) {
  const { edit, items, page } = await searchParams;
  const editing = edit ? await getServiceById(Number(edit)) : null;
  const all = await listServices({ includeHidden: true });
  const view = paginate(all, parsePage(page));
  const itemsFor = items ? await getServiceById(Number(items)) : null;
  const galleryItems = itemsFor ? await listServiceItems(itemsFor.id) : [];

  return (
    <>
      <AdminPageHeader
        title="Freight & Logistics Services"
        description="Manage services displayed across the navigation menu, footer, and dedicated service pages."
        action={
          <FormModal
            triggerLabel="Add service"
            title={editing ? `Edit Service: ${editing.name}` : "Create New Service"}
            description="Saving updates the navigation menu, footer, services overview, and dedicated service landing page."
            editing={Boolean(editing)}
          >
            <ServiceForm key={editing?.id ?? "new"} service={editing ?? undefined} />
          </FormModal>
        }
      />

      {itemsFor && (
        <Card className="mt-6 border-gold-500/40 bg-gold-50/10 p-4 sm:p-6 lg:p-7 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-navy-950">
                Gallery Portfolio: <span className="text-gold-600">{itemsFor.name}</span>
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-500">
                Gallery items display in filterable tabs on this service&apos;s public landing page.
              </p>
            </div>
            <Button asChild size="sm" variant="outline" className="h-9 text-xs">
              <Link href="/admin/services">Close gallery</Link>
            </Button>
          </div>

          <div className="mt-5 grid gap-4">
            {galleryItems.map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
                <ItemForm serviceId={itemsFor.id} item={item} />
                <div className="mt-3 flex justify-end border-t border-slate-100 pt-3">
                  <form action={removeServiceItem}>
                    <input type="hidden" name="id" value={item.id} />
                    <ConfirmSubmit
                      recordKind="gallery item"
                      recordName={item.title}
                      label="Delete this gallery item"
                      className="h-8 px-2.5 text-xs"
                    />
                  </form>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white/70 p-4 sm:p-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3">
              Add New Gallery Item
            </h3>
            <ItemForm serviceId={itemsFor.id} />
          </div>
        </Card>
      )}

      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-bold text-navy-950">
          All Services ({view.total})
        </h2>
      </div>

      {view.total === 0 ? (
        <Card className="mt-4 p-8 sm:p-12 text-center border-dashed border-slate-200">
          <Layers className="mx-auto h-8 w-8 text-slate-400" aria-hidden="true" />
          <p className="mt-3 font-semibold text-navy-950">No custom services created</p>
          <p className="mt-1 text-sm text-slate-500">
            The website will use the built-in fallback services until you add custom entries.
          </p>
        </Card>
      ) : (
        <div className="mt-4 grid gap-3.5 sm:gap-4">
          {view.items.map((service) => (
            <Card
              key={service.id}
              className="group rounded-xl border border-slate-200/90 bg-white p-4 sm:p-5 lg:p-6 shadow-xs hover:border-slate-300 transition-colors"
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-navy-950">{service.name}</h3>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                        service.status === "published"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : "bg-slate-100 text-slate-500 border border-slate-200"
                      }`}
                    >
                      {service.status === "published" ? "Live" : "Hidden"}
                    </span>
                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                      Order: #{service.sort_order}
                    </span>
                  </div>
                  <p className="mt-1 text-xs sm:text-sm text-slate-500">
                    <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-700">/services/{service.slug}</code>
                    {service.nav_description && <span className="ml-2 text-slate-500 hidden sm:inline">· {service.nav_description}</span>}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 shrink-0 pt-2 lg:pt-0 border-t border-slate-100 lg:border-t-0">
                  <Button asChild size="sm" variant="ghost" className="h-9 px-3 text-xs text-slate-700 hover:text-navy-950">
                    <Link href={`/admin/services?edit=${service.id}`}>Edit</Link>
                  </Button>
                  <Button asChild size="sm" variant="ghost" className="h-9 px-3 text-xs text-slate-700 hover:text-navy-950">
                    <Link href={`/admin/services?items=${service.id}`}>
                      <ImageIcon className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                      Gallery
                    </Link>
                  </Button>
                  {service.status === "published" && (
                    <Button asChild size="sm" variant="ghost" className="h-9 px-3 text-xs text-slate-700 hover:text-navy-950">
                      <Link href={`/services/${service.slug}`} target="_blank">
                        View
                        <ExternalLink className="h-3 w-3 ml-1 text-slate-400" aria-hidden="true" />
                      </Link>
                    </Button>
                  )}
                  <form action={toggleService}>
                    <input type="hidden" name="id" value={service.id} />
                    <input
                      type="hidden"
                      name="status"
                      value={service.status === "published" ? "hidden" : "published"}
                    />
                    <Button type="submit" size="sm" variant="ghost" className="h-9 px-2.5 text-xs text-slate-600 hover:text-navy-950">
                      {service.status === "published" ? (
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
                  <form action={removeService}>
                    <input type="hidden" name="id" value={service.id} />
                    <ConfirmSubmit
                      recordKind="service"
                      recordName={service.name}
                      description="Deleting this service will permanently remove its public page, gallery entries, and menu links."
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
        basePath="/admin/services"
        page={view.page}
        totalPages={view.totalPages}
        from={view.from}
        to={view.to}
        total={view.total}
        label="services"
      />
    </>
  );
}
