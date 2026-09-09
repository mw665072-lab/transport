"use client";

import { useActionState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { saveServiceItem } from "@/app/admin/actions";
import type { ServiceItem } from "@/lib/data/records";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function ItemForm({ serviceId, item }: { serviceId: number; item?: ServiceItem }) {
  const [error, formAction, pending] = useActionState(saveServiceItem, undefined);

  return (
    <form action={formAction} className="grid gap-4 rounded-xl border border-slate-200 p-5">
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg border border-danger/30 bg-danger/5 p-3 text-sm text-navy-900"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      <input type="hidden" name="service_id" value={serviceId} />
      {item && <input type="hidden" name="id" value={item.id} />}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor={`title-${item?.id ?? "new"}`}>Item title *</Label>
          <Input
            id={`title-${item?.id ?? "new"}`}
            name="title"
            defaultValue={item?.title}
            required
          />
        </div>
        <div>
          <Label htmlFor={`category-${item?.id ?? "new"}`}>Category</Label>
          <Input
            id={`category-${item?.id ?? "new"}`}
            name="category"
            defaultValue={item?.category}
            placeholder="Becomes a filter tab, e.g. storage"
          />
        </div>
      </div>

      <div>
        <Label htmlFor={`description-${item?.id ?? "new"}`}>Description</Label>
        <Textarea
          id={`description-${item?.id ?? "new"}`}
          name="description"
          rows={2}
          defaultValue={item?.description}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-[1fr_auto]">
        <div>
          <Label htmlFor={`image-${item?.id ?? "new"}`}>Image path</Label>
          <Input
            id={`image-${item?.id ?? "new"}`}
            name="image"
            defaultValue={item?.image}
            placeholder="/images/box-truck.jpg"
          />
        </div>
        <div>
          <Label htmlFor={`order-${item?.id ?? "new"}`}>Order</Label>
          <Input
            id={`order-${item?.id ?? "new"}`}
            name="sort_order"
            type="number"
            className="sm:w-28"
            defaultValue={item?.sort_order ?? 0}
          />
        </div>
      </div>

      <Button type="submit" size="sm" disabled={pending} className="w-fit">
        {pending ? (
          <>
            <Loader2 className="animate-spin" aria-hidden="true" />
            Saving…
          </>
        ) : item ? (
          "Save item"
        ) : (
          "Add item"
        )}
      </Button>
    </form>
  );
}
