"use client";

import { useActionState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { savePost } from "@/app/admin/actions";
import type { Post } from "@/lib/data/records";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function PostForm({ post }: { post?: Post }) {
  const [error, formAction, pending] = useActionState(savePost, undefined);
  const id = post?.id ?? "new";
  const today = new Date().toISOString().slice(0, 10);

  return (
    <form action={formAction} className="grid gap-5">
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-danger/30 bg-danger/5 p-3 text-sm text-navy-900"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      {post && <input type="hidden" name="id" value={post.id} />}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor={`title-${id}`}>Title *</Label>
          <Input id={`title-${id}`} name="title" defaultValue={post?.title} required />
        </div>
        <div>
          <Label htmlFor={`slug-${id}`}>URL slug</Label>
          <Input
            id={`slug-${id}`}
            name="slug"
            defaultValue={post?.slug}
            placeholder="Left blank, built from the title"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor={`category-${id}`}>Category</Label>
          <Input
            id={`category-${id}`}
            name="category"
            defaultValue={post?.category ?? "Update"}
            placeholder="Update, Guide, News"
          />
        </div>
        <div>
          <Label htmlFor={`date-${id}`}>Published date</Label>
          <Input
            id={`date-${id}`}
            name="published_at"
            type="date"
            defaultValue={post?.published_at ?? today}
          />
        </div>
      </div>

      <div>
        <Label htmlFor={`excerpt-${id}`}>Summary</Label>
        <Textarea
          id={`excerpt-${id}`}
          name="excerpt"
          rows={2}
          defaultValue={post?.excerpt}
          placeholder="One or two lines shown on the news listing."
        />
      </div>

      <div>
        <div className="mb-2 flex items-baseline justify-between gap-2">
          <Label htmlFor={`body-${id}`} className="mb-0">
            Article body
          </Label>
          <span className="text-xs text-steel-600">Separate paragraphs with a blank line.</span>
        </div>
        <Textarea id={`body-${id}`} name="body" rows={14} defaultValue={post?.body} />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex min-h-11 items-center gap-2 text-sm font-semibold text-navy-900">
          <input
            type="checkbox"
            name="status"
            value="published"
            defaultChecked={post ? post.status === "published" : true}
            className="h-4 w-4 rounded border-slate-300 accent-gold-500"
          />
          Publish on the website
        </label>
        <Button type="submit" disabled={pending}>
          {pending ? (
            <>
              <Loader2 className="animate-spin" aria-hidden="true" />
              Saving…
            </>
          ) : post ? (
            "Save changes"
          ) : (
            "Publish update"
          )}
        </Button>
      </div>
    </form>
  );
}
