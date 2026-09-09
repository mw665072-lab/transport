import type { Metadata } from "next";
import Link from "next/link";
import { MessageSquareQuote } from "lucide-react";
import { getTestimonial, listTestimonials } from "@/lib/server/db";
import { removeTestimonial } from "@/app/admin/actions";
import { AdminPageHeader } from "@/components/layout/admin-page-header";
import { FormModal } from "@/components/admin/form-modal";
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
        title="Testimonials"
        description="Customer quotes shown on the homepage."
        action={
          <FormModal
            triggerLabel="Add testimonial"
            title={editing ? `Edit: ${editing.author}` : "Add a testimonial"}
            description="Only publish quotes a customer has actually given you and agreed to have shown."
            editing={Boolean(editing)}
          >
            <TestimonialForm key={editing?.id ?? "new"} testimonial={editing ?? undefined} />
          </FormModal>
        }
      />

      <h2 className="mt-10 text-xl font-bold text-navy-900">All testimonials ({view.total})</h2>

      {view.total === 0 ? (
        <Card className="mt-4 p-10 text-center">
          <MessageSquareQuote className="mx-auto h-8 w-8 text-steel-600" aria-hidden="true" />
          <p className="mt-4 font-semibold text-navy-900">No testimonials yet.</p>
          <p className="mt-2 text-sm text-steel-600">
            The homepage section stays hidden until at least one is published, so nothing is
            invented.
          </p>
        </Card>
      ) : (
        <div className="mt-4 grid gap-4">
          {view.items.map((item) => (
            <Card key={item.id} className="p-5 md:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold text-navy-900">{item.author}</h3>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${
                        item.status === "published"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {item.status === "published" ? "Live" : "Hidden"}
                    </span>
                    <span className="rounded-full bg-gold-500/15 px-2.5 py-0.5 text-xs font-bold text-gold-600">
                      {item.rating}/5
                    </span>
                  </div>
                  {(item.role || item.company) && (
                    <p className="mt-1 text-sm text-steel-600">
                      {[item.role, item.company].filter(Boolean).join(", ")}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button asChild size="sm" variant="ghost">
                    <Link href={`/admin/testimonials?edit=${item.id}`}>Edit</Link>
                  </Button>
                  <form action={removeTestimonial}>
                    <input type="hidden" name="id" value={item.id} />
                    <Button type="submit" size="sm" variant="ghost" className="text-danger">
                      Delete
                    </Button>
                  </form>
                </div>
              </div>
              <p className="mt-4 rounded-lg bg-slate-50 p-4 text-sm leading-relaxed text-navy-900">
                {item.quote}
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
