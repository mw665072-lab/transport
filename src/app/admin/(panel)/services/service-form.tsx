"use client";

import { useActionState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { saveService } from "@/app/admin/actions";
import type { ServiceRow } from "@/lib/data/records";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function ServiceForm({ service }: { service?: ServiceRow }) {
  const [error, formAction, pending] = useActionState(saveService, undefined);

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

      {service && <input type="hidden" name="id" value={service.id} />}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="name">Service name *</Label>
          <Input id="name" name="name" defaultValue={service?.name} required />
        </div>
        <div>
          <Label htmlFor="slug">URL slug</Label>
          <Input
            id="slug"
            name="slug"
            defaultValue={service?.slug}
            placeholder="Left blank, built from the name"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="nav_label">Menu label</Label>
          <Input
            id="nav_label"
            name="nav_label"
            defaultValue={service?.nav_label}
            placeholder="Defaults to the service name"
          />
        </div>
        <div>
          <Label htmlFor="nav_description">Menu description</Label>
          <Input
            id="nav_description"
            name="nav_description"
            defaultValue={service?.nav_description}
            placeholder="One line shown under the menu label"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="short">Card summary</Label>
        <Textarea id="short" name="short" rows={2} defaultValue={service?.short} />
      </div>

      <div>
        <Label htmlFor="body">Full description</Label>
        <Textarea id="body" name="body" rows={8} defaultValue={service?.body} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div>
          <div className="mb-2 flex items-baseline justify-between gap-2">
            <Label htmlFor="typical_loads" className="mb-0">
              Typical loads
            </Label>
            <span className="text-xs text-steel-600">One item per line.</span>
          </div>
          <Textarea
            id="typical_loads"
            name="typical_loads"
            rows={4}
            defaultValue={service?.typical_loads}
          />
        </div>
        <div>
          <Label htmlFor="turnaround">Turnaround</Label>
          <Textarea
            id="turnaround"
            name="turnaround"
            rows={4}
            defaultValue={service?.turnaround}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="image">Image path</Label>
          <Input
            id="image"
            name="image"
            defaultValue={service?.image}
            placeholder="/images/box-truck.jpg"
          />
        </div>
        <div>
          <Label htmlFor="sort_order">Menu order</Label>
          <Input
            id="sort_order"
            name="sort_order"
            type="number"
            defaultValue={service?.sort_order ?? 0}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <label className="flex min-h-11 items-center gap-2 text-sm font-semibold text-navy-900">
          <input
            type="checkbox"
            name="status"
            value="published"
            defaultChecked={service ? service.status === "published" : true}
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
          ) : service ? (
            "Save changes"
          ) : (
            "Add service"
          )}
        </Button>
      </div>
    </form>
  );
}
