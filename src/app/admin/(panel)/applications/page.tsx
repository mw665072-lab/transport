import type { Metadata } from "next";
import Link from "next/link";
import { Briefcase, Download, ExternalLink, FileText, Mail, Phone, Users } from "lucide-react";
import { countApplications, listApplications, type ApplicationStatus } from "@/lib/server/db";
import { removeApplication, updateApplicationStatus } from "@/app/admin/actions";
import { AdminPageHeader } from "@/components/layout/admin-page-header";
import { Pagination, paginate, parsePage } from "@/components/admin/pagination";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/cn";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Applications",
  robots: { index: false, follow: false, nocache: true },
};

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  new: "bg-amber-100 text-amber-800 border border-amber-200",
  reviewing: "bg-blue-100 text-blue-800 border border-blue-200",
  shortlisted: "bg-emerald-100 text-emerald-800 border border-emerald-200",
  rejected: "bg-slate-100 text-slate-500 border border-slate-200",
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

  const filterCards = [
    { key: undefined, label: "Total", value: counts.total, icon: Users, href: "/admin/applications" },
    ...ALL.map((s) => ({
      key: s,
      label: s,
      value: counts[s],
      icon: FileText,
      href: `/admin/applications?status=${s}`,
    })),
  ];

  return (
    <>
      <AdminPageHeader
        title="Job Applications"
        description="Candidates who applied for open positions through the careers portal."
      />

      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {filterCards.map((tile) => {
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
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 capitalize">
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
          <Users className="mx-auto h-8 w-8 text-slate-400" aria-hidden="true" />
          <p className="mt-3 font-semibold text-navy-950">No applications found</p>
          <p className="mt-1 text-sm text-slate-500">
            {status ? `No candidates in "${status}" status.` : "Candidate applications will appear here as soon as they apply."}
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
                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                      <Briefcase className="h-3 w-3 text-slate-400" aria-hidden="true" />
                      {item.job_title}
                    </span>
                  </div>
                  <p className="mt-1 text-xs sm:text-sm text-slate-500">
                    Applied on {formatDate(item.created_at)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 shrink-0 pt-2 lg:pt-0 border-t border-slate-100 lg:border-t-0">
                  {ALL.filter((s) => s !== item.status).map((next) => (
                    <form action={updateApplicationStatus} key={next}>
                      <input type="hidden" name="id" value={item.id} />
                      <input type="hidden" name="status" value={next} />
                      <Button
                        type="submit"
                        size="sm"
                        variant="ghost"
                        className="h-9 px-2.5 text-xs capitalize text-slate-600 hover:text-navy-950"
                      >
                        {next}
                      </Button>
                    </form>
                  ))}
                  <form action={removeApplication}>
                    <input type="hidden" name="id" value={item.id} />
                    <ConfirmSubmit
                      recordKind="application"
                      recordName={`application from ${item.name}`}
                      label="Delete"
                      className="h-9 px-2.5 text-xs"
                    />
                  </form>
                </div>
              </div>

              <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4 rounded-lg bg-slate-50/70 border border-slate-100 p-3 sm:p-3.5 text-xs sm:text-sm">
                <div>
                  <span className="block text-[11px] font-medium uppercase tracking-wider text-slate-400">Email</span>
                  <a
                    href={`mailto:${item.email}`}
                    className="mt-0.5 inline-flex items-center gap-1.5 font-medium text-navy-900 hover:text-gold-600 break-all focus-visible:underline"
                  >
                    <Mail className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
                    {item.email}
                  </a>
                </div>
                <div>
                  <span className="block text-[11px] font-medium uppercase tracking-wider text-slate-400">Phone</span>
                  <a
                    href={`tel:${item.phone.replace(/[^+\d]/g, "")}`}
                    className="mt-0.5 inline-flex items-center gap-1.5 font-medium text-navy-900 hover:text-gold-600 focus-visible:underline"
                  >
                    <Phone className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-hidden="true" />
                    {item.phone}
                  </a>
                </div>
                {item.cdl_class && item.cdl_class !== "None" && (
                  <div>
                    <span className="block text-[11px] font-medium uppercase tracking-wider text-slate-400">CDL License</span>
                    <span className="mt-0.5 block font-semibold text-navy-900">{item.cdl_class}</span>
                  </div>
                )}
                {item.years_experience !== null && (
                  <div>
                    <span className="block text-[11px] font-medium uppercase tracking-wider text-slate-400">Experience</span>
                    <span className="mt-0.5 block font-semibold text-navy-900">
                      {item.years_experience} year{item.years_experience === 1 ? "" : "s"}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                {item.resume_filename && (
                  <a
                    href={`/api/admin/resume/${item.id}`}
                    className="inline-flex h-9 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 shadow-2xs transition hover:border-gold-500 hover:text-navy-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
                  >
                    <Download className="h-3.5 w-3.5 text-gold-600" aria-hidden="true" />
                    <span>Resume ({item.resume_filename})</span>
                  </a>
                )}
                {item.linkedin && (
                  <a
                    href={item.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 shadow-2xs transition hover:border-gold-500 hover:text-navy-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
                  >
                    <span>LinkedIn profile</span>
                    <ExternalLink className="h-3 w-3 text-slate-400" aria-hidden="true" />
                  </a>
                )}
              </div>

              {item.cover_letter && (
                <div className="mt-3">
                  <span className="block text-[11px] font-medium uppercase tracking-wider text-slate-400 mb-1">Cover Letter</span>
                  <p className="whitespace-pre-wrap rounded-lg bg-slate-50 border border-slate-100 p-3 sm:p-4 text-xs sm:text-sm leading-relaxed text-slate-800">
                    {item.cover_letter}
                  </p>
                </div>
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
