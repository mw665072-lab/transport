import type { Metadata } from "next";
import Link from "next/link";
import { Briefcase, Building, ExternalLink, Lock, MapPin, Unlock } from "lucide-react";
import { getJobById, listJobs } from "@/lib/server/db";
import { removeJob, toggleJob } from "@/app/admin/actions";
import { AdminPageHeader } from "@/components/layout/admin-page-header";
import { FormModal } from "@/components/admin/form-modal";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { Pagination, paginate, parsePage } from "@/components/admin/pagination";
import { JobForm } from "@/app/admin/(panel)/jobs/job-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Career Openings",
  robots: { index: false, follow: false, nocache: true },
};

export default async function AdminJobs({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; page?: string }>;
}) {
  const { edit, page } = await searchParams;
  const editing = edit ? await getJobById(Number(edit)) : null;
  const all = await listJobs({ includeClosed: true });
  const view = paginate(all, parsePage(page));

  return (
    <>
      <AdminPageHeader
        title="Career Openings"
        description="Publish driver and operations job vacancies, edit requirements, and manage listings."
        action={
          <FormModal
            triggerLabel="Post a role"
            title={editing ? `Edit Role: ${editing.title}` : "Post a New Career Opening"}
            description="Responsibilities, requirements, and benefits should be entered one bullet item per line."
            editing={Boolean(editing)}
          >
            <JobForm key={editing?.id ?? "new"} job={editing ?? undefined} />
          </FormModal>
        }
      />

      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-bold text-navy-950">
          All Job Roles ({view.total})
        </h2>
      </div>

      {view.total === 0 ? (
        <Card className="mt-4 p-8 sm:p-12 text-center border-dashed border-slate-200">
          <Briefcase className="mx-auto h-8 w-8 text-slate-400" aria-hidden="true" />
          <p className="mt-3 font-semibold text-navy-950">No career openings posted</p>
          <p className="mt-1 text-sm text-slate-500">
            Click &ldquo;Post a role&rdquo; to publish the first open job opportunity.
          </p>
        </Card>
      ) : (
        <div className="mt-4 grid gap-3.5 sm:gap-4">
          {view.items.map((job) => (
            <Card
              key={job.id}
              className="group rounded-xl border border-slate-200/90 bg-white p-4 sm:p-5 lg:p-6 shadow-xs hover:border-slate-300 transition-colors"
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-navy-950">{job.title}</h3>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                        job.status === "open"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : "bg-slate-100 text-slate-500 border border-slate-200"
                      }`}
                    >
                      {job.status === "open" ? "Listed" : "Closed"}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                      <Building className="h-3 w-3 text-slate-400" aria-hidden="true" />
                      {job.department}
                    </span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                      {job.location}
                    </span>
                    <span>·</span>
                    <span className="font-medium text-slate-700">{job.employment_type}</span>
                    {job.experience_level && (
                      <>
                        <span>·</span>
                        <span>{job.experience_level}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 shrink-0 pt-2 lg:pt-0 border-t border-slate-100 lg:border-t-0">
                  <Button asChild size="sm" variant="ghost" className="h-9 px-3 text-xs text-slate-700 hover:text-navy-950">
                    <Link href={`/admin/jobs?edit=${job.id}`}>Edit</Link>
                  </Button>
                  {job.status === "open" && (
                    <Button asChild size="sm" variant="ghost" className="h-9 px-3 text-xs text-slate-700 hover:text-navy-950">
                      <Link href={`/career/${job.slug}`} target="_blank">
                        View
                        <ExternalLink className="h-3 w-3 ml-1 text-slate-400" aria-hidden="true" />
                      </Link>
                    </Button>
                  )}
                  <form action={toggleJob}>
                    <input type="hidden" name="id" value={job.id} />
                    <input
                      type="hidden"
                      name="status"
                      value={job.status === "open" ? "closed" : "open"}
                    />
                    <Button type="submit" size="sm" variant="ghost" className="h-9 px-2.5 text-xs text-slate-600 hover:text-navy-950">
                      {job.status === "open" ? (
                        <>
                          <Lock className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                          Close
                        </>
                      ) : (
                        <>
                          <Unlock className="h-3.5 w-3.5 mr-1" aria-hidden="true" />
                          Reopen
                        </>
                      )}
                    </Button>
                  </form>
                  <form action={removeJob}>
                    <input type="hidden" name="id" value={job.id} />
                    <ConfirmSubmit
                      recordKind="job opening"
                      recordName={job.title}
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
        basePath="/admin/jobs"
        page={view.page}
        totalPages={view.totalPages}
        from={view.from}
        to={view.to}
        total={view.total}
        label="roles"
      />
    </>
  );
}
