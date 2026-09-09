"use client";

import { useActionState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { saveTestimonial } from "@/app/admin/actions";
import type { Testimonial } from "@/lib/data/records";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function TestimonialForm({ testimonial }: { testimonial?: Testimonial }) {
  const [error, formAction, pending] = useActionState(saveTestimonial, undefined);
  const id = testimonial?.id ?? "new";

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

      {testimonial && <input type="hidden" name="id" value={testimonial.id} />}

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <Label htmlFor={`author-${id}`}>Name *</Label>
          <Input
            id={`author-${id}`}
            name="author"
            defaultValue={testimonial?.author}
            required
          />
        </div>
        <div>
          <Label htmlFor={`role-${id}`}>Role</Label>
          <Input
            id={`role-${id}`}
            name="role"
            defaultValue={testimonial?.role}
            placeholder="Logistics Manager"
          />
        </div>
        <div>
          <Label htmlFor={`company-${id}`}>Company</Label>
          <Input id={`company-${id}`} name="company" defaultValue={testimonial?.company} />
        </div>
      </div>

      <div>
        <Label htmlFor={`quote-${id}`}>Quote *</Label>
        <Textarea
          id={`quote-${id}`}
          name="quote"
          rows={4}
          defaultValue={testimonial?.quote}
          required
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor={`rating-${id}`}>Rating (1 to 5)</Label>
          <Input
            id={`rating-${id}`}
            name="rating"
            type="number"
            min="1"
            max="5"
            defaultValue={testimonial?.rating ?? 5}
          />
        </div>
        <div>
          <Label htmlFor={`order-${id}`}>Display order</Label>
          <Input
            id={`order-${id}`}
            name="sort_order"
            type="number"
            defaultValue={testimonial?.sort_order ?? 0}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex min-h-11 items-center gap-2 text-sm font-semibold text-navy-900">
          <input
            type="checkbox"
            name="status"
            value="published"
            defaultChecked={testimonial ? testimonial.status === "published" : true}
            className="h-4 w-4 rounded border-slate-300 accent-gold-500"
          />
          Show on the website
        </label>
        <Button type="submit" disabled={pending}>
          {pending ? (
            <>
              <Loader2 className="animate-spin" aria-hidden="true" />
              Saving…
            </>
          ) : testimonial ? (
            "Save changes"
          ) : (
            "Add testimonial"
          )}
        </Button>
      </div>
    </form>
  );
}
