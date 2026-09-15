import type { Metadata } from "next";
import Link from "next/link";
import { Download, Files, Mail } from "lucide-react";
import { listDocuments } from "@/lib/server/db";
import { removeDocument, updateDocumentStatus } from "@/app/admin/actions";
import { AdminPageHeader } from "@/components/layout/admin-page-header";
import { Pagination, paginate, parsePage } from "@/components/admin/pagination";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Documents",
  robots: { index: false, follow: false, nocache: true },
};

const STATUSES = ["new", "matched", "archived"] as const;

const STATUS_STYLES: Record<string, string> = {
  new: "bg-amber-100 text-amber-800 border border-amber-200",
  matched: "bg-emerald-100 text-emerald-800 border border-emerald-200",
  archived: "bg-slate-100 text-slate-500 border border-slate-200",
};

function formatStamp(value: string) {
  const date = new Date(value.replace(" ", "T") + "Z");
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

export default async function AdminDocuments({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const { status, page } = await searchParams;
  const filter = STATUSES.find((s) => s === status);
  const all = await listDocuments(filter);
  const view = paginate(all, parsePage(page));

  return (
    <>
      <AdminPageHeader
        title="Load Documents"
        description="Paperwork, bills of lading, and load confirmations uploaded by shippers."
      />

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Link
          href="/admin/documents"
          className={cn(
            "inline-flex h-9 items-center rounded-lg px-3.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500",
            !status
              ? "bg-navy-950 text-white"
              : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
          )}
        >
          All Documents
        </Link>
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={`/admin/documents?status=${s}`}
            className={cn(
              "inline-flex h-9 items-center rounded-lg px-3.5 text-xs font-semibold capitalize transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500",
              status === s
                ? "bg-navy-950 text-white"
                : "border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50",
            )}
          >
            {s}
          </Link>
        ))}
      </div>

      {view.total === 0 ? (
        <Card className="mt-6 p-8 sm:p-12 text-center border-dashed border-slate-200">
          <Files className="mx-auto h-8 w-8 text-slate-400" aria-hidden="true" />
          <p className="mt-3 font-semibold text-navy-950">No documents found</p>
          <p className="mt-1 text-sm text-slate-500">
            {status ? `No documents in "${status}" status.` : "Paperwork sent through the load upload page will appear here."}
          </p>
        </Card>
      ) : (
        <div className="mt-6 grid gap-3.5 sm:gap-4">
          {view.items.map((doc) => (
            <Card
              key={doc.id}
              className="group rounded-xl border border-slate-200/90 bg-white p-4 sm:p-5 lg:p-6 shadow-xs hover:border-slate-300 transition-colors"
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-navy-950">{doc.reference}</h2>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${STATUS_STYLES[doc.status] ?? STATUS_STYLES.new}`}
                    >
                      {doc.status}
                    </span>
                    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                      {doc.company}
                    </span>
                  </div>
                  <p className="mt-1 text-xs sm:text-sm text-slate-500">
                    Uploaded by <span className="font-medium text-slate-700">{doc.contact}</span> · {formatStamp(doc.created_at)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 shrink-0 pt-2 lg:pt-0 border-t border-slate-100 lg:border-t-0">
                  {STATUSES.filter((s) => s !== doc.status).map((next) => (
                    <form action={updateDocumentStatus} key={next}>
                      <input type="hidden" name="id" value={doc.id} />
                      <input type="hidden" name="status" value={next} />
                      <Button
                        type="submit"
                        size="sm"
                        variant="ghost"
                        className="h-9 px-2.5 text-xs capitalize text-slate-600 hover:text-navy-950"
                      >
                        Mark {next}
                      </Button>
                    </form>
                  ))}
                  <form action={removeDocument}>
                    <input type="hidden" name="id" value={doc.id} />
                    <ConfirmSubmit
                      recordKind="document"
                      recordName={`document ${doc.reference}`}
                      label="Delete"
                      className="h-9 px-2.5 text-xs"
                    />
                  </form>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm">
                <a
                  href={`/api/admin/document/${doc.id}`}
                  className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 shadow-2xs transition hover:border-gold-500 hover:text-navy-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
                >
                  <Download className="h-3.5 w-3.5 text-gold-600" aria-hidden="true" />
                  <span>Download file ({doc.filename})</span>
                </a>
                <a
                  href={`mailto:${doc.email}`}
                  className="inline-flex items-center gap-1.5 font-medium text-navy-900 hover:text-gold-600 focus-visible:underline"
                >
                  <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
                  {doc.email}
                </a>
              </div>

              {doc.note && (
                <div className="mt-3">
                  <span className="block text-[11px] font-medium uppercase tracking-wider text-slate-400 mb-1">Shipper Note</span>
                  <p className="whitespace-pre-wrap rounded-lg bg-slate-50 border border-slate-100 p-3 sm:p-4 text-xs sm:text-sm leading-relaxed text-slate-800">
                    {doc.note}
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <Pagination
        basePath="/admin/documents"
        params={{ status }}
        page={view.page}
        totalPages={view.totalPages}
        from={view.from}
        to={view.to}
        total={view.total}
        label="documents"
      />
    </>
  );
}
