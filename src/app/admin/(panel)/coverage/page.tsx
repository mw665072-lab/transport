import type { Metadata } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { getCoverageById, listCoverage } from "@/lib/server/db";
import { removeCoverage } from "@/app/admin/actions";
import { AdminPageHeader } from "@/components/layout/admin-page-header";
import { FormModal } from "@/components/admin/form-modal";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { CoverageForm } from "@/app/admin/(panel)/coverage/coverage-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Coverage",
  robots: { index: false, follow: false, nocache: true },
};

export default async function AdminCoverage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  const { edit } = await searchParams;
  const editing = edit ? await getCoverageById(Number(edit)) : null;
  const all = await listCoverage({ includeHidden: true });
  const groups = [
    {
      kind: "state" as const,
      title: "States served",
      rows: all.filter((r) => r.kind === "state"),
    },
    {
      kind: "lane" as const,
      title: "Operating lanes",
      rows: all.filter((r) => r.kind === "lane"),
    },
  ];

  return (
    <>
      <AdminPageHeader
        title="Coverage"
        description="The states and lanes shown on the homepage, the coverage page, and in the site's structured data."
        action={
          <FormModal
            triggerLabel="Add coverage"
            title={editing ? `Edit: ${editing.label}` : "Add a state or lane"}
            description="States appear as pills; lanes appear as a bulleted list."
            editing={Boolean(editing)}
          >
            <CoverageForm key={editing?.id ?? "new"} row={editing ?? undefined} />
          </FormModal>
        }
      />

      {all.length === 0 && (
        <Card className="mt-10 p-10 text-center">
          <MapPin className="mx-auto h-8 w-8 text-steel-600" aria-hidden="true" />
          <p className="mt-4 font-semibold text-navy-900">No coverage in the database yet.</p>
          <p className="mt-2 text-sm text-steel-600">
            Until you add one, the site falls back to the four states defined in the code, so
            the coverage area is never empty.
          </p>
        </Card>
      )}

      {groups.map((group) =>
        group.rows.length === 0 ? null : (
          <section key={group.kind} className="mt-10">
            <h2 className="text-xl font-bold text-navy-900">
              {group.title} ({group.rows.length})
            </h2>
            <ul className="mt-4 grid gap-3">
              {group.rows.map((row) => (
                <li key={row.id}>
                  <Card className="flex flex-wrap items-center justify-between gap-3 p-4">
                    <div className="flex min-w-0 flex-wrap items-center gap-2">
                      <span className="font-semibold text-navy-900">{row.label}</span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${
                          row.status === "published"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-400"
                        }`}
                      >
                        {row.status === "published" ? "Live" : "Hidden"}
                      </span>
                      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-steel-600">
                        #{row.sort_order}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button asChild size="sm" variant="ghost">
                        <Link href={`/admin/coverage?edit=${row.id}`}>Edit</Link>
                      </Button>
                      <form action={removeCoverage}>
                        <input type="hidden" name="id" value={row.id} />
                        <ConfirmSubmit recordKind="coverage area" recordName={row.label} />
                      </form>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          </section>
        ),
      )}
    </>
  );
}
