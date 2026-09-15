import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, ExternalLink, Newspaper, Tag } from "lucide-react";
import { getPostById, listPosts } from "@/lib/server/db";
import { removePost } from "@/app/admin/actions";
import { AdminPageHeader } from "@/components/layout/admin-page-header";
import { FormModal } from "@/components/admin/form-modal";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { Pagination, paginate, parsePage } from "@/components/admin/pagination";
import { PostForm } from "@/app/admin/(panel)/posts/post-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "News & Articles",
  robots: { index: false, follow: false, nocache: true },
};

export default async function AdminPosts({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; page?: string }>;
}) {
  const { edit, page } = await searchParams;
  const editing = edit ? await getPostById(Number(edit)) : null;
  const all = await listPosts({ includeDrafts: true });
  const view = paginate(all, parsePage(page));

  return (
    <>
      <AdminPageHeader
        title="News & Articles"
        description="Write company announcements, shipping advice, and industry regulatory updates."
        action={
          <FormModal
            triggerLabel="Write an article"
            title={editing ? `Edit Article: ${editing.title}` : "Write a New Article"}
            description="Separate paragraphs with a blank line. Published articles appear immediately on the news feed."
            editing={Boolean(editing)}
          >
            <PostForm key={editing?.id ?? "new"} post={editing ?? undefined} />
          </FormModal>
        }
      />

      <div className="mt-6 flex items-center justify-between">
        <h2 className="text-base sm:text-lg font-bold text-navy-950">
          All Articles ({view.total})
        </h2>
      </div>

      {view.total === 0 ? (
        <Card className="mt-4 p-8 sm:p-12 text-center border-dashed border-slate-200">
          <Newspaper className="mx-auto h-8 w-8 text-slate-400" aria-hidden="true" />
          <p className="mt-3 font-semibold text-navy-950">No published articles yet</p>
          <p className="mt-1 text-sm text-slate-500">
            Click &ldquo;Write an article&rdquo; to publish the first blog or news update.
          </p>
        </Card>
      ) : (
        <div className="mt-4 grid gap-3.5 sm:gap-4">
          {view.items.map((post) => (
            <Card
              key={post.id}
              className="group rounded-xl border border-slate-200/90 bg-white p-4 sm:p-5 lg:p-6 shadow-xs hover:border-slate-300 transition-colors"
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold text-navy-950">{post.title}</h3>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider ${
                        post.status === "published"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                          : "bg-slate-100 text-slate-500 border border-slate-200"
                      }`}
                    >
                      {post.status === "published" ? "Live" : "Draft"}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-gold-500/10 border border-gold-500/20 px-2 py-0.5 text-xs font-semibold text-gold-700">
                      <Tag className="h-3 w-3 text-gold-600" aria-hidden="true" />
                      {post.category}
                    </span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
                      {post.published_at}
                    </span>
                    <span>·</span>
                    <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-700">/blog/{post.slug}</code>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 shrink-0 pt-2 lg:pt-0 border-t border-slate-100 lg:border-t-0">
                  <Button asChild size="sm" variant="ghost" className="h-9 px-3 text-xs text-slate-700 hover:text-navy-950">
                    <Link href={`/admin/posts?edit=${post.id}`}>Edit</Link>
                  </Button>
                  {post.status === "published" && (
                    <Button asChild size="sm" variant="ghost" className="h-9 px-3 text-xs text-slate-700 hover:text-navy-950">
                      <Link href={`/blog/${post.slug}`} target="_blank">
                        View
                        <ExternalLink className="h-3 w-3 ml-1 text-slate-400" aria-hidden="true" />
                      </Link>
                    </Button>
                  )}
                  <form action={removePost}>
                    <input type="hidden" name="id" value={post.id} />
                    <ConfirmSubmit
                      recordKind="article"
                      recordName={post.title}
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
        basePath="/admin/posts"
        page={view.page}
        totalPages={view.totalPages}
        from={view.from}
        to={view.to}
        total={view.total}
        label="articles"
      />
    </>
  );
}
