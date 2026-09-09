import type { Metadata } from "next";
import { Inbox, Mail, MailCheck, MailWarning } from "lucide-react";
import { countByStatus, listSubmissions, type SubmissionStatus } from "@/lib/server/db";
import { updateStatus } from "@/app/admin/actions";
import { AdminPageHeader } from "@/components/layout/admin-page-header";
import { Pagination, paginate, parsePage } from "@/components/admin/pagination";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";

// The panel must never be indexed or previewed by a crawler.
export const metadata: Metadata = {
  title: "Contact submissions",
  robots: { index: false, follow: false, nocache: true },
};

const STATUS_STYLES: Record<SubmissionStatus, string> = {
  new: "bg-gold-500/15 text-gold-600",
  read: "bg-slate-100 text-steel-600",
  archived: "bg-slate-100 text-slate-400",
};

function formatDate(value: string) {
  // SQLite stores UTC without a zone marker; make that explicit before parsing.
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

  const tiles = [
    { label: "Total", value: counts.total, icon: Inbox, href: "/admin" },
    { label: "New", value: counts.new, icon: MailWarning, href: "/admin?status=new" },
    { label: "Read", value: counts.read, icon: MailCheck, href: "/admin?status=read" },
    { label: "Archived", value: counts.archived, icon: Mail, href: "/admin?status=archived" },
  ];

  return (
    <>
      <AdminPageHeader
        title="Contact submissions"
        description="Messages sent through the website contact form."
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {tiles.map((tile) => (
          <a
            key={tile.label}
            href={tile.href}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-gold-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
          >
            <tile.icon className="h-5 w-5 text-gold-600" aria-hidden="true" />
            <p className="mt-3 text-2xl font-bold text-navy-900">{tile.value}</p>
            <p className="mt-1 text-sm text-steel-600">{tile.label}</p>
          </a>
        ))}
      </div>

      {view.total === 0 ? (
        <Card className="mt-8 p-10 text-center">
          <p className="font-semibold text-navy-900">No submissions here yet.</p>
          <p className="mt-2 text-sm text-steel-600">
            Messages sent through the contact form will appear on this page.
          </p>
        </Card>
      ) : (
        <div className="mt-8 grid gap-4">
          {view.items.map((item) => (
            <Card key={item.id} className="p-5 md:p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-bold text-navy-900">{item.name}</h2>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${STATUS_STYLES[item.status]}`}
                    >
                      {item.status}
                    </span>
                    {item.emailed === 0 && (
                      <span className="rounded-full bg-danger/10 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-danger">
                        Not emailed
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-steel-600">
                    {item.subject} · {formatDate(item.created_at)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(["read", "archived", "new"] as const)
                    .filter((s) => s !== item.status)
                    .map((next) => (
                      <form action={updateStatus} key={next}>
                        <input type="hidden" name="id" value={item.id} />
                        <input type="hidden" name="status" value={next} />
                        <Button type="submit" size="sm" variant="ghost">
                          Mark {next}
                        </Button>
                      </form>
                    ))}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 text-sm">
                <a
                  href={`mailto:${item.email}`}
                  className="inline-block rounded-sm py-1 font-semibold text-navy-900 hover:text-gold-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
                >
                  {item.email}
                </a>
                {item.phone && (
                  <a
                    href={`tel:${item.phone.replace(/[^+\d]/g, "")}`}
                    className="inline-block rounded-sm py-1 font-semibold text-navy-900 hover:text-gold-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
                  >
                    {item.phone}
                  </a>
                )}
              </div>

              <p className="mt-4 whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-sm leading-relaxed text-navy-900">
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
