import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, Layers } from "lucide-react";
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
        title="Services"
        description="Edit what appears in the Services menu, footer, and service pages."
        action={
          <FormModal
            triggerLabel="Add service"
            title={editing ? `Edit: ${editing.name}` : "Add a service"}
            description="Saving updates the Services menu, the footer, the services page, and this service's own page at once."
            editing={Boolean(editing)}
          >
            <ServiceForm key={editing?.id ?? "new"} service={editing ?? undefined} />
          </FormModal>
        }
      />

      {itemsFor && (
        <Card className="mt-10 p-6 md:p-8">
          <h2 className="text-xl font-bold text-navy-900">Gallery items: {itemsFor.name}</h2>
          <p className="mt-2 text-sm leading-relaxed text-steel-600">
            Items appear under this service&apos;s page as a filterable gallery. Each distinct
            category becomes a filter tab, alongside an automatic &ldquo;all&rdquo; tab.
          </p>

          <div className="mt-6 grid gap-4">
            {galleryItems.map((item) => (
              <div key={item.id} className="grid gap-3">
                <ItemForm serviceId={itemsFor.id} item={item} />
                <form action={removeServiceItem} className="w-fit">
                  <input type="hidden" name="id" value={item.id} />
                  <ConfirmSubmit
                    recordKind="gallery item"
                    recordName={item.title}
                    label="Delete this item"
                  />
                </form>
              </div>
            ))}
          </div>

          <h3 className="mt-8 text-sm font-bold uppercase tracking-wide text-navy-900">
            Add a new item
          </h3>
          <div className="mt-3">
            <ItemForm serviceId={itemsFor.id} />
          </div>

          <p className="mt-6 text-sm">
            <Link
              href="/admin/services"
              className="rounded-sm font-semibold text-navy-900 underline decoration-gold-500 decoration-2 underline-offset-4 hover:text-gold-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
            >
              Done editing gallery
            </Link>
          </p>
        </Card>
      )}

      <h2 className="mt-10 text-xl font-bold text-navy-900">All services ({view.total})</h2>

      {view.total === 0 ? (
        <Card className="mt-4 p-10 text-center">
          <Layers className="mx-auto h-8 w-8 text-steel-600" aria-hidden="true" />
          <p className="mt-4 font-semibold text-navy-900">No services in the database yet.</p>
          <p className="mt-2 text-sm text-steel-600">
            Until you add one, the site falls back to the five services defined in the code, so
            the menu is never empty.
          </p>
        </Card>
      ) : (
        <div className="mt-4 grid gap-4">
          {view.items.map((service) => (
            <Card key={service.id} className="p-5 md:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold text-navy-900">{service.name}</h3>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${
                        service.status === "published"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {service.status === "published" ? "Live" : "Hidden"}
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-steel-600">
                      #{service.sort_order}
                    </span>
                  </div>
                  <p className="mt-1 break-all text-sm text-steel-600">
                    /services/{service.slug}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button asChild size="sm" variant="ghost">
                    <Link href={`/admin/services?edit=${service.id}`}>Edit</Link>
                  </Button>
                  <Button asChild size="sm" variant="ghost">
                    <Link href={`/admin/services?items=${service.id}`}>Gallery</Link>
                  </Button>
                  {service.status === "published" && (
                    <Button asChild size="sm" variant="ghost">
                      <Link href={`/services/${service.slug}`} target="_blank">
                        View
                        <ExternalLink aria-hidden="true" />
                        <span className="sr-only"> (opens in a new tab)</span>
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
                    <Button type="submit" size="sm" variant="ghost">
                      {service.status === "published" ? "Hide" : "Publish"}
                    </Button>
                  </form>
                  <form action={removeService}>
                    <input type="hidden" name="id" value={service.id} />
                    <ConfirmSubmit
                      recordKind="service"
                      recordName={service.name}
                      description="Its page, gallery items, and menu entries go with it."
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
