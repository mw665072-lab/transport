import type { Metadata } from "next";
import Link from "next/link";
import { Briefcase, ExternalLink } from "lucide-react";
import { getJobById, listJobs } from "@/lib/server/db";
import { removeJob, toggleJob } from "@/app/admin/actions";
import { AdminPageHeader } from "@/components/layout/admin-page-header";
import { FormModal } from "@/components/admin/form-modal";
import { Pagination, paginate, parsePage } from "@/components/admin/pagination";
import { JobForm } from "@/app/admin/(panel)/jobs/job-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Jobs",
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
        title="Jobs"
        description="Post and close the roles listed on the careers page."
        action={
          <FormModal
            triggerLabel="Post a role"
            title={editing ? `Edit: ${editing.title}` : "Post a new role"}
            description="Responsibilities, requirements, and benefits take one item per line."
            editing={Boolean(editing)}
          >
            <JobForm key={editing?.id ?? "new"} job={editing ?? undefined} />
          </FormModal>
        }
      />

      <h2 className="mt-10 text-xl font-bold text-navy-900">All roles ({view.total})</h2>

      {view.total === 0 ? (
        <Card className="mt-4 p-10 text-center">
          <Briefcase className="mx-auto h-8 w-8 text-steel-600" aria-hidden="true" />
          <p className="mt-4 font-semibold text-navy-900">No roles posted yet.</p>
          <p className="mt-2 text-sm text-steel-600">
            Use the form above to publish the first opening. It appears on the careers page
            immediately.
          </p>
        </Card>
      ) : (
        <div className="mt-4 grid gap-4">
          {view.items.map((job) => (
            <Card key={job.id} className="p-5 md:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold text-navy-900">{job.title}</h3>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${
                        job.status === "open"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {job.status === "open" ? "Listed" : "Closed"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-steel-600">
                    {job.department} · {job.location} · {job.employment_type}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button asChild size="sm" variant="ghost">
                    <Link href={`/admin/jobs?edit=${job.id}`}>Edit</Link>
                  </Button>
                  {job.status === "open" && (
                    <Button asChild size="sm" variant="ghost">
                      <Link href={`/career/${job.slug}`} target="_blank">
                        View
                        <ExternalLink aria-hidden="true" />
                        <span className="sr-only"> (opens in a new tab)</span>
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
                    <Button type="submit" size="sm" variant="ghost">
                      {job.status === "open" ? "Close" : "Reopen"}
                    </Button>
                  </form>
                  <form action={removeJob}>
                    <input type="hidden" name="id" value={job.id} />
                    <Button type="submit" size="sm" variant="ghost" className="text-danger">
                      Delete
                    </Button>
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
