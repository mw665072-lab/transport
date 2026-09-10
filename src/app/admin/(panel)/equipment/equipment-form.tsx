"use client";

import { useActionState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { saveEquipment } from "@/app/admin/actions";
import type { EquipmentRow } from "@/lib/data/records";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function EquipmentForm({ item }: { item?: EquipmentRow }) {
  const [error, formAction, pending] = useActionState(saveEquipment, undefined);
  const id = item?.id ?? "new";

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

      {item && <input type="hidden" name="id" value={item.id} />}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor={`name-${id}`}>Name *</Label>
          <Input id={`name-${id}`} name="name" defaultValue={item?.name} required />
        </div>
        <div>
          <Label htmlFor={`slug-${id}`}>URL slug</Label>
          <Input
            id={`slug-${id}`}
            name="slug"
            defaultValue={item?.slug}
            placeholder="Left blank, built from the name"
          />
        </div>
      </div>

      <div>
        <Label htmlFor={`description-${id}`}>Card summary</Label>
        <Textarea
          id={`description-${id}`}
          name="description"
          rows={2}
          defaultValue={item?.description}
        />
      </div>

      <div>
        <Label htmlFor={`body-${id}`}>Full description</Label>
        <Textarea id={`body-${id}`} name="body" rows={6} defaultValue={item?.body} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <div className="mb-2 flex items-baseline justify-between gap-2">
            <Label htmlFor={`specs-${id}`} className="mb-0">
              Specifications
            </Label>
            <span className="text-xs text-steel-600">
              One &ldquo;Label: value&rdquo; per line.
            </span>
          </div>
          <Textarea
            id={`specs-${id}`}
            name="specs"
            rows={6}
            defaultValue={item?.specs}
            placeholder={
              "Payload: Confirmed before dispatch\nCargo length: Confirmed before dispatch"
            }
          />
        </div>
        <div>
          <div className="mb-2 flex items-baseline justify-between gap-2">
            <Label htmlFor={`uses-${id}`} className="mb-0">
              Typical uses
            </Label>
            <span className="text-xs text-steel-600">One item per line.</span>
          </div>
          <Textarea
            id={`uses-${id}`}
            name="typical_uses"
            rows={6}
            defaultValue={item?.typical_uses}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor={`image-${id}`}>Image path</Label>
          <Input
            id={`image-${id}`}
            name="image"
            defaultValue={item?.image}
            placeholder="/images/box-truck.jpg"
          />
        </div>
        <div>
          <Label htmlFor={`order-${id}`}>Display order</Label>
          <Input
            id={`order-${id}`}
            name="sort_order"
            type="number"
            defaultValue={item?.sort_order ?? 0}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex min-h-11 items-center gap-2 text-sm font-semibold text-navy-900">
          <input
            type="checkbox"
            name="status"
            value="published"
            defaultChecked={item ? item.status === "published" : true}
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
          ) : item ? (
            "Save changes"
          ) : (
            "Add equipment"
          )}
        </Button>
      </div>
    </form>
  );
}
