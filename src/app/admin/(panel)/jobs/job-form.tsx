"use client";

import { useActionState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { saveJob } from "@/app/admin/actions";
import type { Job } from "@/lib/data/records";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const LIST_HINT = "One item per line.";

export function JobForm({ job }: { job?: Job }) {
  const [error, formAction, pending] = useActionState(saveJob, undefined);

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

      {job && <input type="hidden" name="id" value={job.id} />}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="title">Job title *</Label>
          <Input id="title" name="title" defaultValue={job?.title} required />
        </div>
        <div>
          <Label htmlFor="slug">URL slug</Label>
          <Input
            id="slug"
            name="slug"
            defaultValue={job?.slug}
            placeholder="Left blank, built from the title"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Label htmlFor="department">Department *</Label>
          <Input id="department" name="department" defaultValue={job?.department} required />
        </div>
        <div>
          <Label htmlFor="location">Location *</Label>
          <Input id="location" name="location" defaultValue={job?.location} required />
        </div>
        <div>
          <Label htmlFor="employment_type">Employment type *</Label>
          <Input
            id="employment_type"
            name="employment_type"
            defaultValue={job?.employment_type}
            placeholder="Full time"
            required
          />
        </div>
        <div>
          <Label htmlFor="experience_level">Experience level</Label>
          <Input
            id="experience_level"
            name="experience_level"
            defaultValue={job?.experience_level}
            placeholder="2+ years"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="summary">Summary</Label>
        <Textarea id="summary" name="summary" rows={3} defaultValue={job?.summary} />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div>
          <div className="mb-2 flex items-baseline justify-between gap-2">
            <Label htmlFor="responsibilities" className="mb-0">
              Responsibilities
            </Label>
            <span className="text-xs text-steel-600">{LIST_HINT}</span>
          </div>
          <Textarea
            id="responsibilities"
            name="responsibilities"
            rows={7}
            defaultValue={job?.responsibilities}
          />
        </div>
        <div>
          <div className="mb-2 flex items-baseline justify-between gap-2">
            <Label htmlFor="requirements" className="mb-0">
              Requirements
            </Label>
            <span className="text-xs text-steel-600">{LIST_HINT}</span>
          </div>
          <Textarea
            id="requirements"
            name="requirements"
            rows={7}
            defaultValue={job?.requirements}
          />
        </div>
        <div>
          <div className="mb-2 flex items-baseline justify-between gap-2">
            <Label htmlFor="benefits" className="mb-0">
              What we offer
            </Label>
            <span className="text-xs text-steel-600">{LIST_HINT}</span>
          </div>
          <Textarea id="benefits" name="benefits" rows={7} defaultValue={job?.benefits} />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex min-h-11 items-center gap-2 text-sm font-semibold text-navy-900">
          <input
            type="checkbox"
            name="status"
            value="open"
            defaultChecked={job ? job.status === "open" : true}
            className="h-4 w-4 rounded border-slate-300 accent-gold-500"
          />
          Listed publicly
        </label>
        <Button type="submit" disabled={pending}>
          {pending ? (
            <>
              <Loader2 className="animate-spin" aria-hidden="true" />
              Saving…
            </>
          ) : job ? (
            "Save changes"
          ) : (
            "Post role"
          )}
        </Button>
      </div>
    </form>
  );
}
