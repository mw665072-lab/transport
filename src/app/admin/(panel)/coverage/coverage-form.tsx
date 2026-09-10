"use client";

import { useActionState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { saveCoverage } from "@/app/admin/actions";
import type { CoverageRow } from "@/lib/data/records";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CoverageForm({ row }: { row?: CoverageRow }) {
  const [error, formAction, pending] = useActionState(saveCoverage, undefined);
  const id = row?.id ?? "new";

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

      {row && <input type="hidden" name="id" value={row.id} />}

      <div>
        <Label htmlFor={`kind-${id}`}>Type</Label>
        <select
          id={`kind-${id}`}
          name="kind"
          defaultValue={row?.kind ?? "state"}
          className="flex min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-base text-navy-900 outline-none transition hover:border-slate-400 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
        >
          <option value="state">State served</option>
          <option value="lane">Operating lane</option>
        </select>
      </div>

      <div>
        <Label htmlFor={`label-${id}`}>Label *</Label>
        <Input
          id={`label-${id}`}
          name="label"
          defaultValue={row?.label}
          placeholder="California, or California to Nevada regional freight"
          required
        />
      </div>

      <div>
        <Label htmlFor={`order-${id}`}>Display order</Label>
        <Input
          id={`order-${id}`}
          name="sort_order"
          type="number"
          defaultValue={row?.sort_order ?? 0}
        />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex min-h-11 items-center gap-2 text-sm font-semibold text-navy-900">
          <input
            type="checkbox"
            name="status"
            value="published"
            defaultChecked={row ? row.status === "published" : true}
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
          ) : row ? (
            "Save changes"
          ) : (
            "Add"
          )}
        </Button>
      </div>
    </form>
  );
}
