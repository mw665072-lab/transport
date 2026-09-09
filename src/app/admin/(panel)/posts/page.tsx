import type { Metadata } from "next";
import Link from "next/link";
import { ExternalLink, Newspaper } from "lucide-react";
import { getPostById, listPosts } from "@/lib/server/db";
import { removePost } from "@/app/admin/actions";
import { AdminPageHeader } from "@/components/layout/admin-page-header";
import { FormModal } from "@/components/admin/form-modal";
import { Pagination, paginate, parsePage } from "@/components/admin/pagination";
import { PostForm } from "@/app/admin/(panel)/posts/post-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "News",
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
        title="News & updates"
        description="Company updates and guidance articles."
        action={
          <FormModal
            triggerLabel="Write an update"
            title={editing ? `Edit: ${editing.title}` : "Write an update"}
            description="Separate paragraphs with a blank line."
            editing={Boolean(editing)}
          >
            <PostForm key={editing?.id ?? "new"} post={editing ?? undefined} />
          </FormModal>
        }
      />

      <h2 className="mt-10 text-xl font-bold text-navy-900">All articles ({view.total})</h2>

      {view.total === 0 ? (
        <Card className="mt-4 p-10 text-center">
          <Newspaper className="mx-auto h-8 w-8 text-steel-600" aria-hidden="true" />
          <p className="mt-4 font-semibold text-navy-900">No articles in the database yet.</p>
          <p className="mt-2 text-sm text-steel-600">
            Until you publish one, the news page falls back to the guide defined in the code, so
            it is never empty.
          </p>
        </Card>
      ) : (
        <div className="mt-4 grid gap-4">
          {view.items.map((post) => (
            <Card key={post.id} className="p-5 md:p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold text-navy-900">{post.title}</h3>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${
                        post.status === "published"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {post.status === "published" ? "Live" : "Draft"}
                    </span>
                    <span className="rounded-full bg-gold-500/15 px-2.5 py-0.5 text-xs font-bold text-gold-600">
                      {post.category}
                    </span>
                  </div>
                  <p className="mt-1 break-all text-sm text-steel-600">
                    {post.published_at} · /blog/{post.slug}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button asChild size="sm" variant="ghost">
                    <Link href={`/admin/posts?edit=${post.id}`}>Edit</Link>
                  </Button>
                  {post.status === "published" && (
                    <Button asChild size="sm" variant="ghost">
                      <Link href={`/blog/${post.slug}`} target="_blank">
                        View
                        <ExternalLink aria-hidden="true" />
                        <span className="sr-only"> (opens in a new tab)</span>
                      </Link>
                    </Button>
                  )}
                  <form action={removePost}>
                    <input type="hidden" name="id" value={post.id} />
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
