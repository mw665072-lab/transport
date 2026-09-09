"use client";

import { useRef, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Circle,
  Loader2,
  MapPin,
  Search,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { COMPANY } from "@/lib/data/company";

type TrackEvent = {
  id: number;
  status: string;
  location: string;
  note: string;
  occurredAt: string;
};

type TrackResult = {
  found: boolean;
  message?: string;
  shipment?: {
    reference: string;
    status: string;
    origin: string;
    destination: string;
    service: string;
    pickupDate: string;
    deliveryEstimate: string;
    deliveredAt: string;
  };
  events?: TrackEvent[];
};

function formatStamp(value: string) {
  const date = new Date(value.replace(" ", "T") + "Z");
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

function formatDate(value: string) {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00Z`);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
}

export function TrackForm() {
  const [reference, setReference] = useState("");
  const [result, setResult] = useState<TrackResult>();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string>();
  const resultRef = useRef<HTMLDivElement>(null);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setError(undefined);
    setResult(undefined);

    try {
      const response = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference }),
      });
      const data: TrackResult = await response.json();
      setResult(data);
      if (!data.found) setError(data.message ?? "We could not find that reference.");
      // Move focus so a screen reader announces the outcome.
      requestAnimationFrame(() => resultRef.current?.focus());
    } catch {
      setError("We could not reach the server. Please check your connection and try again.");
    } finally {
      setPending(false);
    }
  };

  const shipment = result?.found ? result.shipment : undefined;
  const events = result?.events ?? [];

  return (
    <div>
      <Card className="p-6 md:p-8">
        <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <Label htmlFor="reference">Reference number</Label>
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-steel-600"
                aria-hidden="true"
              />
              <Input
                id="reference"
                name="reference"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="ZWR-XXXXXXXX"
                autoComplete="off"
                spellCheck={false}
                className="pl-9"
                required
              />
            </div>
          </div>
          <Button type="submit" size="lg" disabled={pending} className="w-full sm:w-auto">
            {pending ? (
              <>
                <Loader2 className="animate-spin" aria-hidden="true" />
                Checking…
              </>
            ) : (
              "Track shipment"
            )}
          </Button>
        </form>
        <p className="mt-4 text-xs leading-relaxed text-steel-600">
          The reference is on the confirmation we sent when the shipment was booked.
        </p>
      </Card>

      <div ref={resultRef} tabIndex={-1} aria-live="polite" className="focus:outline-none">
        {error && (
          <Card className="mt-6 border-danger/30 bg-danger/5 p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-danger" aria-hidden="true" />
              <div>
                <p className="font-semibold text-navy-900">{error}</p>
                <p className="mt-2 text-sm text-steel-600">
                  Call dispatch on{" "}
                  <a
                    href={COMPANY.phoneHref}
                    className="rounded-sm font-semibold text-navy-900 underline decoration-gold-500 decoration-2 underline-offset-4 hover:text-gold-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
                  >
                    {COMPANY.phone}
                  </a>{" "}
                  and we will look it up for you.
                </p>
              </div>
            </div>
          </Card>
        )}

        {shipment && (
          <Card className="mt-6 overflow-hidden">
            <div className="bg-navy-950 p-6 text-white md:p-8">
              <p className="text-xs font-bold uppercase tracking-[.18em] text-gold-400">
                {shipment.reference}
              </p>
              <p className="mt-2 flex items-center gap-2 text-2xl font-bold">
                <Truck className="h-6 w-6 shrink-0 text-gold-400" aria-hidden="true" />
                {shipment.status}
              </p>
              {(shipment.origin || shipment.destination) && (
                <p className="mt-3 flex flex-wrap items-center gap-2 text-sm text-slate-300">
                  <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {shipment.origin} <span aria-hidden="true">→</span> {shipment.destination}
                </p>
              )}
            </div>

            <dl className="grid gap-x-6 gap-y-4 border-b border-slate-200 p-6 sm:grid-cols-3 md:p-8">
              {shipment.service && (
                <div>
                  <dt className="text-xs text-steel-600">Service</dt>
                  <dd className="mt-0.5 font-semibold text-navy-900">{shipment.service}</dd>
                </div>
              )}
              {formatDate(shipment.pickupDate) && (
                <div>
                  <dt className="text-xs text-steel-600">Pickup</dt>
                  <dd className="mt-0.5 font-semibold text-navy-900">
                    {formatDate(shipment.pickupDate)}
                  </dd>
                </div>
              )}
              {formatDate(shipment.deliveredAt) ? (
                <div>
                  <dt className="text-xs text-steel-600">Delivered</dt>
                  <dd className="mt-0.5 font-semibold text-navy-900">
                    {formatDate(shipment.deliveredAt)}
                  </dd>
                </div>
              ) : (
                formatDate(shipment.deliveryEstimate) && (
                  <div>
                    <dt className="text-xs text-steel-600">Estimated delivery</dt>
                    <dd className="mt-0.5 font-semibold text-navy-900">
                      {formatDate(shipment.deliveryEstimate)}
                    </dd>
                  </div>
                )
              )}
            </dl>

            <div className="p-6 md:p-8">
              <h2 className="text-lg font-bold text-navy-900">Shipment history</h2>
              {events.length === 0 ? (
                <p className="mt-3 text-sm text-steel-600">
                  No milestones have been recorded yet. The status above is current.
                </p>
              ) : (
                <ol className="mt-5 grid gap-5">
                  {events.map((event, index) => (
                    <li key={event.id} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        {index === 0 ? (
                          <CheckCircle2
                            className="h-5 w-5 shrink-0 text-gold-600"
                            aria-hidden="true"
                          />
                        ) : (
                          <Circle
                            className="h-5 w-5 shrink-0 text-slate-300"
                            aria-hidden="true"
                          />
                        )}
                        {index < events.length - 1 && (
                          <span className="mt-1 w-px flex-1 bg-slate-200" aria-hidden="true" />
                        )}
                      </div>
                      <div className="pb-1">
                        <p className="font-semibold text-navy-900">{event.status}</p>
                        <p className="mt-0.5 text-xs text-steel-600">
                          {formatStamp(event.occurredAt)}
                          {event.location ? ` · ${event.location}` : ""}
                        </p>
                        {event.note && (
                          <p className="mt-1.5 text-sm leading-relaxed text-steel-600">
                            {event.note}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
