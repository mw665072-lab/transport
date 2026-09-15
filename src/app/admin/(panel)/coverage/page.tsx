import type { Metadata } from "next";
import Link from "next/link";
import { Compass, MapPin, Navigation } from "lucide-react";
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
      title: "States & Regions",
      icon: MapPin,
      rows: all.filter((r) => r.kind === "state"),
    },
    {
      kind: "lane" as const,
      title: "Operating Highway Lanes",
      icon: Navigation,
      rows: all.filter((r) => r.kind === "lane"),
    },
  ];

  return (
    <>
      <AdminPageHeader
        title="Coverage & Lanes"
        description="Configure served states, regional hubs, and freight corridor lanes displayed on public pages."
        action={
          <FormModal
            triggerLabel="Add coverage"
            title={editing ? `Edit Coverage: ${editing.label}` : "Add State or Freight Lane"}
            description="States display as regional badges; lanes display as route connections with SEO structured data."
            editing={Boolean(editing)}
          >
            <CoverageForm key={editing?.id ?? "new"} row={editing ?? undefined} />
          </FormModal>
        }
      />

      {all.length === 0 && (
        <Card className="mt-6 p-8 sm:p-12 text-center border-dashed border-slate-200">
          <Compass className="mx-auto h-8 w-8 text-slate-400" aria-hidden="true" />
          <p className="mt-3 font-semibold text-navy-950">No coverage records in database</p>
          <p className="mt-1 text-sm text-slate-500">
            The website will use the built-in states until you add custom locations.
          </p>
        </Card>
      )}

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {groups.map((group) => (
          <section key={group.kind} className="flex flex-col">
            <div className="flex items-center gap-2 border-b border-slate-200/80 pb-3">
              <group.icon className="h-4 w-4 text-gold-600" aria-hidden="true" />
              <h2 className="text-base font-bold text-navy-950">
                {group.title} ({group.rows.length})
              </h2>
            </div>

            {group.rows.length === 0 ? (
              <p className="mt-3 text-xs text-slate-400 italic">No {group.kind}s added yet.</p>
            ) : (
              <ul className="mt-3 grid gap-2.5">
                {group.rows.map((row) => (
                  <li key={row.id}>
                    <Card className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 shadow-2xs hover:border-slate-300 transition-colors">
                      <div className="flex min-w-0 flex-wrap items-center gap-2">
                        <span className="font-bold text-navy-950 text-sm">{row.label}</span>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${
                            row.status === "published"
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : "bg-slate-100 text-slate-500 border border-slate-200"
                          }`}
                        >
                          {row.status === "published" ? "Live" : "Hidden"}
                        </span>
                        <span className="inline-flex items-center rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-600">
                          #{row.sort_order}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                        <Button asChild size="sm" variant="ghost" className="h-8 px-2.5 text-xs text-slate-700 hover:text-navy-950">
                          <Link href={`/admin/coverage?edit=${row.id}`}>Edit</Link>
                        </Button>
                        <form action={removeCoverage}>
                          <input type="hidden" name="id" value={row.id} />
                          <ConfirmSubmit
                            recordKind={group.kind}
                            recordName={row.label}
                            label="Delete"
                            className="h-8 px-2 text-xs"
                          />
                        </form>
                      </div>
                    </Card>
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </>
  );
}
