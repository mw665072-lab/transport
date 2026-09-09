import type { Metadata } from "next";
import { FileText, Files } from "lucide-react";
import { listDocuments } from "@/lib/server/db";
import { updateDocumentStatus } from "@/app/admin/actions";
import { AdminPageHeader } from "@/components/layout/admin-page-header";
import { Pagination, paginate, parsePage } from "@/components/admin/pagination";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Documents",
  robots: { index: false, follow: false, nocache: true },
};

const STATUSES = ["new", "matched", "archived"] as const;

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
        title="Documents"
        description="Paperwork uploaded by shippers for a load."
      />

      <div className="mt-8 flex flex-wrap gap-2">
        <a
          href="/admin/documents"
          className="inline-flex min-h-11 items-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-navy-900 transition hover:border-gold-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
        >
          All
        </a>
        {STATUSES.map((s) => (
          <a
            key={s}
            href={`/admin/documents?status=${s}`}
            className="inline-flex min-h-11 items-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold capitalize text-navy-900 transition hover:border-gold-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
          >
            {s}
          </a>
        ))}
      </div>

      {view.total === 0 ? (
        <Card className="mt-8 p-10 text-center">
          <Files className="mx-auto h-8 w-8 text-steel-600" aria-hidden="true" />
          <p className="mt-4 font-semibold text-navy-900">No documents here yet.</p>
          <p className="mt-2 text-sm text-steel-600">
            Paperwork sent through the upload page will appear on this page.
          </p>
        </Card>
      ) : (
        <div className="mt-8 grid gap-4">
          {view.items.map((doc) => (
            <Card key={doc.id} className="p-5 md:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold text-navy-900">{doc.reference}</h2>
                    <span className="rounded-full bg-gold-500/15 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-gold-600">
                      {doc.status}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-steel-600">
                    {doc.company} · {doc.contact} · {formatStamp(doc.created_at)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.filter((s) => s !== doc.status).map((next) => (
                    <form action={updateDocumentStatus} key={next}>
                      <input type="hidden" name="id" value={doc.id} />
                      <input type="hidden" name="status" value={next} />
                      <Button type="submit" size="sm" variant="ghost" className="capitalize">
                        {next}
                      </Button>
                    </form>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={`/api/admin/document/${doc.id}`}
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-300 px-4 text-sm font-semibold text-navy-900 transition hover:border-gold-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
                >
                  <FileText className="h-4 w-4 text-gold-600" aria-hidden="true" />
                  {doc.filename}
                </a>
                <a
                  href={`mailto:${doc.email}`}
                  className="inline-flex min-h-11 items-center rounded-lg border border-slate-300 px-4 text-sm font-semibold text-navy-900 transition hover:border-gold-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
                >
                  {doc.email}
                </a>
              </div>

              {doc.note && (
                <p className="mt-4 whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-sm leading-relaxed text-navy-900">
                  {doc.note}
                </p>
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
