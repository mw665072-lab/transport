"use client";

import { useActionState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { saveShipment } from "@/app/admin/actions";
import type { Shipment } from "@/lib/data/records";
import { SHIPMENT_STATUSES } from "@/lib/data/shipment-status";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function ShipmentForm({ shipment }: { shipment?: Shipment }) {
  const [error, formAction, pending] = useActionState(saveShipment, undefined);
  const id = shipment?.id ?? "new";

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

      {shipment && <input type="hidden" name="id" value={shipment.id} />}

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <Label htmlFor={`reference-${id}`}>Reference *</Label>
          <Input
            id={`reference-${id}`}
            name="reference"
            defaultValue={shipment?.reference}
            placeholder="ZWR-A1B2C3D4"
            required
          />
        </div>
        <div>
          <Label htmlFor={`status-${id}`}>Status</Label>
          <select
            id={`status-${id}`}
            name="status"
            defaultValue={shipment?.status ?? "Booked"}
            className="flex min-h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-base text-navy-900 outline-none transition hover:border-slate-400 focus:border-gold-500 focus:ring-2 focus:ring-gold-500/20"
          >
            {SHIPMENT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor={`service-${id}`}>Service</Label>
          <Input
            id={`service-${id}`}
            name="service"
            defaultValue={shipment?.service}
            placeholder="Box Truck Transportation"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <Label htmlFor={`origin-${id}`}>Origin</Label>
          <Input
            id={`origin-${id}`}
            name="origin"
            defaultValue={shipment?.origin}
            placeholder="Sacramento, CA"
          />
        </div>
        <div>
          <Label htmlFor={`destination-${id}`}>Destination</Label>
          <Input
            id={`destination-${id}`}
            name="destination"
            defaultValue={shipment?.destination}
            placeholder="Reno, NV"
          />
        </div>
        <div>
          <Label htmlFor={`customer-${id}`}>Customer (internal)</Label>
          <Input id={`customer-${id}`} name="customer" defaultValue={shipment?.customer} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <Label htmlFor={`pickup-${id}`}>Pickup date</Label>
          <Input
            id={`pickup-${id}`}
            name="pickup_date"
            type="date"
            defaultValue={shipment?.pickup_date}
          />
        </div>
        <div>
          <Label htmlFor={`eta-${id}`}>Estimated delivery</Label>
          <Input
            id={`eta-${id}`}
            name="delivery_estimate"
            type="date"
            defaultValue={shipment?.delivery_estimate}
          />
        </div>
        <div>
          <Label htmlFor={`delivered-${id}`}>Delivered on</Label>
          <Input
            id={`delivered-${id}`}
            name="delivered_at"
            type="date"
            defaultValue={shipment?.delivered_at}
          />
        </div>
      </div>

      <div>
        <Label htmlFor={`note-${id}`}>Internal note</Label>
        <Textarea id={`note-${id}`} name="note" rows={2} defaultValue={shipment?.note} />
      </div>

      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? (
          <>
            <Loader2 className="animate-spin" aria-hidden="true" />
            Saving…
          </>
        ) : shipment ? (
          "Save changes"
        ) : (
          "Add shipment"
        )}
      </Button>
    </form>
  );
}
