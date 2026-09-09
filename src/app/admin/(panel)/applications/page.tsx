import type { Metadata } from "next";
import { FileText, Users } from "lucide-react";
import { countApplications, listApplications, type ApplicationStatus } from "@/lib/server/db";
import { updateApplicationStatus } from "@/app/admin/actions";
import { AdminPageHeader } from "@/components/layout/admin-page-header";
import { Pagination, paginate, parsePage } from "@/components/admin/pagination";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Applications",
  robots: { index: false, follow: false, nocache: true },
};

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  new: "bg-gold-500/15 text-gold-600",
  reviewing: "bg-slate-100 text-steel-600",
  shortlisted: "bg-emerald-100 text-emerald-700",
  rejected: "bg-slate-100 text-slate-400",
};

const ALL: ApplicationStatus[] = ["new", "reviewing", "shortlisted", "rejected"];

function formatDate(value: string) {
  const date = new Date(value.replace(" ", "T") + "Z");
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

export default async function AdminApplications({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const { status, page } = await searchParams;
  const filter = ALL.find((s) => s === status);
  const all = await listApplications(filter);
  const view = paginate(all, parsePage(page));
  const counts = await countApplications();

  return (
    <>
      <AdminPageHeader
        title="Applications"
        description="People who applied through the careers pages."
      />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <a
          href="/admin/applications"
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-gold-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
        >
          <Users className="h-5 w-5 text-gold-600" aria-hidden="true" />
          <p className="mt-3 text-2xl font-bold text-navy-900">{counts.total}</p>
          <p className="mt-1 text-sm text-steel-600">Total</p>
        </a>
        {ALL.map((s) => (
          <a
            key={s}
            href={`/admin/applications?status=${s}`}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-gold-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
          >
            <FileText className="h-5 w-5 text-gold-600" aria-hidden="true" />
            <p className="mt-3 text-2xl font-bold text-navy-900">{counts[s]}</p>
            <p className="mt-1 text-sm capitalize text-steel-600">{s}</p>
          </a>
        ))}
      </div>

      {view.total === 0 ? (
        <Card className="mt-8 p-10 text-center">
          <p className="font-semibold text-navy-900">No applications here yet.</p>
          <p className="mt-2 text-sm text-steel-600">
            Applications sent from the careers pages will appear on this page.
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
                  </div>
                  <p className="mt-1 text-sm text-steel-600">
                    {item.job_title} · {formatDate(item.created_at)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {ALL.filter((s) => s !== item.status).map((next) => (
                    <form action={updateApplicationStatus} key={next}>
                      <input type="hidden" name="id" value={item.id} />
                      <input type="hidden" name="status" value={next} />
                      <Button type="submit" size="sm" variant="ghost">
                        {next}
                      </Button>
                    </form>
                  ))}
                </div>
              </div>

              <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <dt className="text-xs text-steel-600">Email</dt>
                  <dd>
                    <a
                      href={`mailto:${item.email}`}
                      className="inline-block break-all py-1 font-semibold text-navy-900 hover:text-gold-600"
                    >
                      {item.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-steel-600">Phone</dt>
                  <dd>
                    <a
                      href={`tel:${item.phone.replace(/[^+\d]/g, "")}`}
                      className="inline-block py-1 font-semibold text-navy-900 hover:text-gold-600"
                    >
                      {item.phone}
                    </a>
                  </dd>
                </div>
                {item.cdl_class && item.cdl_class !== "None" && (
                  <div>
                    <dt className="text-xs text-steel-600">CDL</dt>
                    <dd className="font-semibold text-navy-900">{item.cdl_class}</dd>
                  </div>
                )}
                {item.years_experience !== null && (
                  <div>
                    <dt className="text-xs text-steel-600">Experience</dt>
                    <dd className="font-semibold text-navy-900">
                      {item.years_experience} year{item.years_experience === 1 ? "" : "s"}
                    </dd>
                  </div>
                )}
              </dl>

              <div className="mt-4 flex flex-wrap gap-3">
                {item.resume_filename && (
                  <a
                    href={`/api/admin/resume/${item.id}`}
                    className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-slate-300 px-4 text-sm font-semibold text-navy-900 transition hover:border-gold-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
                  >
                    <FileText className="h-4 w-4 text-gold-600" aria-hidden="true" />
                    {item.resume_filename}
                  </a>
                )}
                {item.linkedin && (
                  <a
                    href={item.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center rounded-lg border border-slate-300 px-4 text-sm font-semibold text-navy-900 transition hover:border-gold-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
                  >
                    Profile link
                  </a>
                )}
              </div>

              {item.cover_letter && (
                <p className="mt-4 whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-sm leading-relaxed text-navy-900">
                  {item.cover_letter}
                </p>
              )}
            </Card>
          ))}
        </div>
      )}

      <Pagination
        basePath="/admin/applications"
        params={{ status }}
        page={view.page}
        totalPages={view.totalPages}
        from={view.from}
        to={view.to}
        total={view.total}
        label="applications"
      />
    </>
  );
}
