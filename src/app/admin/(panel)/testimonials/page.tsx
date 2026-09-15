import type { Metadata } from "next";
import Link from "next/link";
import { MessageSquareQuote, Star } from "lucide-react";
import { getTestimonial, listTestimonials } from "@/lib/server/db";
import { removeTestimonial } from "@/app/admin/actions";
import { AdminPageHeader } from "@/components/layout/admin-page-header";
import { FormModal } from "@/components/admin/form-modal";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { Pagination, paginate, parsePage } from "@/components/admin/pagination";
import { TestimonialForm } from "@/app/admin/(panel)/testimonials/testimonial-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Testimonials",
  robots: { index: false, follow: false, nocache: true },
};

export default async function AdminTestimonials({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; page?: string }>;
}) {
  const { edit, page } = await searchParams;
  const editing = edit ? await getTestimonial(Number(edit)) : null;
  const all = await listTestimonials({ includeHidden: true });
  const view = paginate(all, parsePage(page));

  return (
    <>
      <AdminPageHeader
        title="Client Testimonials"
        description="Authentic shipper testimonials and partner reviews highlighted on the website."
        action={
          <FormModal
            triggerLabel="Add testimonial"
            title={editing ? `Edit Review: ${editing.author}` : "Add Client Testimonial"}
            description="Only publish authentic quotes that a client has approved to be shared."
            editing={Boolean(editing)}
          >
            <TestimonialForm key={editing?.id ?? "new"} testimonial={editing ?? undefined} />
          </FormModal>
        }
      />

      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-bold text-navy-950">
          All Testimonials ({view.total})
        </h2>
      </div>

      {view.total === 0 ? (
        <Card className="mt-4 p-8 sm:p-12 text-center border-dashed border-slate-200">
          <MessageSquareQuote className="mx-auto h-8 w-8 text-slate-400" aria-hidden="true" />
          <p className="mt-3 font-semibold text-navy-950">No testimonials published</p>
          <p className="mt-1 text-sm text-slate-500">
            Click &ldquo;Add testimonial&rdquo; to add your first customer review.
          </p>
        </Card>
      ) : (
        <div className="mt-4 grid gap-3.5 sm:gap-4">
          {view.items.map((item) => (
            <Card
              key={item.id}
              className="group rounded-xl border border-slate-200/90 bg-white p-4 sm:p-5 lg:p-6 shadow-xs hover:border-slate-300 transition-colors"
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-navy-950">{item.author}</h3>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                        item.status === "published"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : "bg-slate-100 text-slate-500 border border-slate-200"
                      }`}
                    >
                      {item.status === "published" ? "Live" : "Hidden"}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-gold-500/10 border border-gold-500/20 px-2 py-0.5 text-xs font-bold text-gold-700">
                      <Star className="h-3 w-3 fill-gold-500 text-gold-500" aria-hidden="true" />
                      {item.rating}/5
                    </span>
                  </div>
                  {(item.role || item.company) && (
                    <p className="mt-1 text-xs sm:text-sm text-slate-500">
                      {[item.role, item.company].filter(Boolean).join(", ")}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-1.5 shrink-0 pt-2 lg:pt-0 border-t border-slate-100 lg:border-t-0">
                  <Button asChild size="sm" variant="ghost" className="h-9 px-3 text-xs text-slate-700 hover:text-navy-950">
                    <Link href={`/admin/testimonials?edit=${item.id}`}>Edit</Link>
                  </Button>
                  <form action={removeTestimonial}>
                    <input type="hidden" name="id" value={item.id} />
                    <ConfirmSubmit
                      recordKind="testimonial"
                      recordName={`review by ${item.author}`}
                      label="Delete"
                      className="h-9 px-2.5 text-xs"
                    />
                  </form>
                </div>
              </div>

              <p className="mt-3.5 whitespace-pre-wrap rounded-lg bg-slate-50 border border-slate-100 p-3 sm:p-4 text-xs sm:text-sm leading-relaxed text-slate-800 italic">
                &ldquo;{item.quote}&rdquo;
              </p>
            </Card>
          ))}
        </div>
      )}

      <Pagination
        basePath="/admin/testimonials"
        page={view.page}
        totalPages={view.totalPages}
        from={view.from}
        to={view.to}
        total={view.total}
        label="testimonials"
      />
    </>
  );
}
