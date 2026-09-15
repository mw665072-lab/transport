import type { Metadata } from "next";
import Link from "next/link";
import { Inbox, Mail, MailCheck, MailWarning, Phone, Truck } from "lucide-react";
import {
  countByStatus,
  listLinkedSubmissionIds,
  listSubmissions,
  type SubmissionStatus,
} from "@/lib/server/db";
import { removeSubmission, updateStatus } from "@/app/admin/actions";
import { AdminPageHeader } from "@/components/layout/admin-page-header";
import { Pagination, paginate, parsePage } from "@/components/admin/pagination";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact submissions",
  robots: { index: false, follow: false, nocache: true },
};

const STATUS_STYLES: Record<SubmissionStatus, string> = {
  new: "bg-amber-100 text-amber-800 border border-amber-200",
  read: "bg-slate-100 text-slate-700 border border-slate-200",
  archived: "bg-slate-100 text-slate-400 border border-slate-200",
};

function formatDate(value: string) {
  const date = new Date(value.replace(" ", "T") + "Z");
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const { status, page } = await searchParams;
  const filter = (["new", "read", "archived"] as const).find((s) => s === status);
  const all = await listSubmissions(filter);
  const view = paginate(all, parsePage(page));
  const counts = await countByStatus();
  const linked = new Set(await listLinkedSubmissionIds());

  const tiles = [
    { key: undefined, label: "Total", value: counts.total, icon: Inbox, href: "/admin" },
    { key: "new", label: "New", value: counts.new, icon: MailWarning, href: "/admin?status=new" },
    { key: "read", label: "Read", value: counts.read, icon: MailCheck, href: "/admin?status=read" },
    { key: "archived", label: "Archived", value: counts.archived, icon: Mail, href: "/admin?status=archived" },
  ];

  return (
    <>
      <AdminPageHeader
        title="Contact submissions"
        description="Messages and quote requests sent through the website contact form."
      />

      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {tiles.map((tile) => {
          const isActive = status === tile.key || (!status && tile.key === undefined);
          return (
            <Link
              key={tile.label}
              href={tile.href}
              className={cn(
                "group relative overflow-hidden rounded-xl border bg-white p-4 sm:p-5 shadow-xs transition-all hover:border-gold-500 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500",
                isActive
                  ? "border-gold-500 ring-2 ring-gold-500/20 bg-gold-50/10"
                  : "border-slate-200/90 hover:bg-slate-50/50",
              )}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {tile.label}
                </span>
                <tile.icon
                  className={cn(
                    "h-4 w-4 shrink-0 transition-colors",
                    isActive ? "text-gold-600" : "text-slate-400 group-hover:text-gold-500",
                  )}
                  aria-hidden="true"
                />
              </div>
              <p className="mt-2 text-2xl font-bold tracking-tight text-navy-950 sm:text-3xl">
                {tile.value}
              </p>
            </Link>
          );
        })}
      </div>

      {view.total === 0 ? (
        <Card className="mt-6 p-8 sm:p-12 text-center border-dashed border-slate-200">
          <Inbox className="mx-auto h-8 w-8 text-slate-400" aria-hidden="true" />
          <p className="mt-3 font-semibold text-navy-950">No submissions found</p>
          <p className="mt-1 text-sm text-slate-500">
            {status ? `No submissions matching "${status}" status.` : "Messages sent through the contact form will appear here."}
          </p>
        </Card>
      ) : (
        <div className="mt-6 grid gap-3.5 sm:gap-4">
          {view.items.map((item) => (
            <Card
              key={item.id}
              className="group rounded-xl border border-slate-200/90 bg-white p-4 sm:p-5 lg:p-6 shadow-xs hover:border-slate-300 transition-colors"
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-navy-950">{item.name}</h2>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${STATUS_STYLES[item.status]}`}
                    >
                      {item.status}
                    </span>
                    {item.form === "freight-quote" && linked.has(item.id) && (
                      <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-emerald-700">
                        Shipment created
                      </span>
                    )}
                    {item.emailed === 0 && (
                      <span className="inline-flex items-center rounded-full bg-rose-50 border border-rose-200 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-rose-700">
                        Not emailed
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs sm:text-sm text-slate-500">
                    <span className="font-medium text-slate-700">{item.subject}</span> · {formatDate(item.created_at)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 shrink-0 pt-2 lg:pt-0 border-t border-slate-100 lg:border-t-0">
                  {item.form === "freight-quote" && !linked.has(item.id) && (
                    <Button asChild size="sm" className="h-9 px-3 text-xs sm:text-sm">
                      <Link href={`/admin/shipments?from=${item.id}`}>
                        <Truck className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Create shipment</span>
                      </Link>
                    </Button>
                  )}
                  {(["read", "archived", "new"] as const)
                    .filter((s) => s !== item.status)
                    .map((next) => (
                      <form action={updateStatus} key={next}>
                        <input type="hidden" name="id" value={item.id} />
                        <input type="hidden" name="status" value={next} />
                        <Button type="submit" size="sm" variant="ghost" className="h-9 px-2.5 text-xs capitalize text-slate-600 hover:text-navy-950">
                          Mark {next}
                        </Button>
                      </form>
                    ))}
                  <form action={removeSubmission}>
                    <input type="hidden" name="id" value={item.id} />
                    <ConfirmSubmit
                      recordKind="submission"
                      recordName={`message from ${item.name}`}
                      label="Delete"
                      className="h-9 px-2.5 text-xs"
                    />
                  </form>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs sm:text-sm text-slate-600">
                <a
                  href={`mailto:${item.email}`}
                  className="inline-flex items-center gap-1.5 font-medium text-navy-900 hover:text-gold-600 focus-visible:outline-none focus-visible:underline break-all"
                >
                  <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
                  {item.email}
                </a>
                {item.phone && (
                  <a
                    href={`tel:${item.phone.replace(/[^+\d]/g, "")}`}
                    className="inline-flex items-center gap-1.5 font-medium text-navy-900 hover:text-gold-600 focus-visible:outline-none focus-visible:underline"
                  >
                    <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
                    {item.phone}
                  </a>
                )}
              </div>

              <p className="mt-3 whitespace-pre-wrap rounded-lg bg-slate-50 border border-slate-100 p-3 sm:p-4 text-xs sm:text-sm leading-relaxed text-slate-800">
                {item.message}
              </p>
            </Card>
          ))}
        </div>
      )}

      <Pagination
        basePath="/admin"
        params={{ status }}
        page={view.page}
        totalPages={view.totalPages}
        from={view.from}
        to={view.to}
        total={view.total}
        label="messages"
      />
    </>
  );
}
