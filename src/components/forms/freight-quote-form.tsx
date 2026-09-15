"use client";
import { useRef, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Phone } from "lucide-react";
import { toast } from "sonner";
import { freightQuoteSchema, type FreightQuoteValues } from "@/lib/schemas/freight-quote";
import { submitForm } from "@/lib/forms/submit";
import { US_STATES } from "@/lib/us-states";
import type { PublicService } from "@/lib/server/services";
import { COMPANY } from "@/lib/data/company";
import { Button } from "@/components/ui/button";
import { Honeypot } from "@/components/forms/honeypot";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, describedBy } from "@/components/forms/form-field";
const stepFields: (keyof FreightQuoteValues)[][] = [
  ["pickupCity", "pickupState", "deliveryCity", "deliveryState", "pickupDate"],
  ["serviceType", "commodity", "weightLbs", "dimensions", "notes"],
  ["fullName", "company", "email", "phone"],
];
export function FreightQuoteForm({ services }: { services: PublicService[] }) {
  const [step, setStep] = useState(0);
  // The clock starts when the form is first rendered, so the server can tell a
  // human apart from a bot that posts the instant the page loads.
  const startedAt = useRef<number>(Date.now());
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  const [reference, setReference] = useState<string>();
  const {
    register,
    control,
    trigger,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FreightQuoteValues>({
    resolver: zodResolver(freightQuoteSchema),
    defaultValues: {
      website: "",
      pickupCity: "",
      pickupState: "CA",
      deliveryCity: "",
      deliveryState: "NV",
      pickupDate: "",
      serviceType: "",
      commodity: "",
      weightLbs: undefined,
      dimensions: "",
      notes: "",
      fullName: "",
      company: "",
      email: "",
      phone: "",
    },
  });
  const next = async () => {
    if (await trigger(stepFields[step], { shouldFocus: true }))
      setStep((s) => Math.min(2, s + 1));
  };
  const onSubmit = async (values: FreightQuoteValues) => {
    const r = await submitForm("freight-quote", { ...values, startedAt: startedAt.current });
    if (r.success) {
      setReference(r.referenceId);
      toast.success("Request received");
    } else toast.error(r.message);
  };
  if (reference)
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-7">
        <CheckCircle2 className="h-10 w-10 text-emerald-600" />
        <h2 className="mt-4 text-2xl font-bold text-navy-900">Request received.</h2>
        <p className="mt-2 text-steel-600">
          Reference: <strong>{reference}</strong>
        </p>
        <div className="mt-5 space-y-2 text-sm text-navy-900">
          <p>1. Dispatch reviews your route and freight details.</p>
          <p>2. {COMPANY.shortName} confirms equipment and availability.</p>
          <p>3. You receive the next-step response within the stated business window.</p>
        </div>
        <a
          href={COMPANY.phoneHref}
          className="mt-6 inline-flex items-center gap-2 font-semibold text-navy-900"
        >
          <Phone className="h-4 w-4" />
          {COMPANY.phone}
        </a>
      </div>
    );
  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="mb-8 grid grid-cols-3 gap-2">
        {["Shipment", "Freight", "Contact"].map((l, i) => (
          <div key={l}>
            <div
              className={`h-1.5 rounded-full ${i <= step ? "bg-gold-500" : "bg-slate-200"}`}
            />
            <p
              className={`mt-2 text-xs font-semibold ${i === step ? "text-navy-900" : "text-steel-600"}`}
            >
              {i + 1}. {l}
            </p>
          </div>
        ))}
      </div>
      {step === 0 && (
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Pickup city" htmlFor="pickupCity" error={errors.pickupCity?.message}>
            <Input
              id="pickupCity"
              autoComplete="address-level2"
              aria-invalid={!!errors.pickupCity}
              aria-describedby={describedBy("pickupCity", errors.pickupCity)}
              {...register("pickupCity")}
            />
          </Field>
          <Field label="Pickup state" htmlFor="pickupState" error={errors.pickupState?.message}>
            <Controller
              control={control}
              name="pickupState"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="pickupState">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {US_STATES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
          <Field
            label="Delivery city"
            htmlFor="deliveryCity"
            error={errors.deliveryCity?.message}
          >
            <Input
              id="deliveryCity"
              autoComplete="off"
              aria-invalid={!!errors.deliveryCity}
              {...register("deliveryCity")}
            />
          </Field>
          <Field
            label="Delivery state"
            htmlFor="deliveryState"
            error={errors.deliveryState?.message}
          >
            <Controller
              control={control}
              name="deliveryState"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="deliveryState">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {US_STATES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
          <Field label="Pickup date" htmlFor="pickupDate" error={errors.pickupDate?.message}>
            <Input type="date" id="pickupDate" {...register("pickupDate")} />
          </Field>
        </div>
      )}
      {step === 1 && (
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Service type" htmlFor="serviceType" error={errors.serviceType?.message}>
            <Controller
              control={control}
              name="serviceType"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="serviceType">
                    <SelectValue placeholder="Choose service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((s) => (
                      <SelectItem key={s.slug} value={s.slug}>
                        {s.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
          <Field label="Commodity" htmlFor="commodity" error={errors.commodity?.message}>
            <Input id="commodity" {...register("commodity")} />
          </Field>
          <Field
            label="Weight (lb, optional)"
            htmlFor="weightLbs"
            error={errors.weightLbs?.message}
          >
            <Input
              id="weightLbs"
              type="number"
              min="0"
              {...register("weightLbs", {
                setValueAs: (value) => (value === "" ? undefined : Number(value)),
              })}
            />
          </Field>
          <Field
            label="Dimensions (L × W × H)"
            htmlFor="dimensions"
            error={errors.dimensions?.message}
          >
            <Input
              id="dimensions"
              placeholder="Example: 48 × 40 × 36 in"
              {...register("dimensions")}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Notes" htmlFor="notes" error={errors.notes?.message}>
              <Textarea id="notes" maxLength={1000} {...register("notes")} />
            </Field>
          </div>
        </div>
      )}
      {step === 2 && (
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Full name" htmlFor="fullName" error={errors.fullName?.message}>
            <Input id="fullName" autoComplete="name" {...register("fullName")} />
          </Field>
          <Field label="Company (optional)" htmlFor="company" error={errors.company?.message}>
            <Input id="company" autoComplete="organization" {...register("company")} />
          </Field>
          <Field label="Email" htmlFor="email" error={errors.email?.message}>
            <Input
              id="email"
              autoComplete="email"
              type="email"
              inputMode="email"
              {...register("email")}
            />
          </Field>
          <Field label="Phone" htmlFor="phone" error={errors.phone?.message}>
            <Input
              id="phone"
              autoComplete="tel"
              type="tel"
              inputMode="tel"
              {...register("phone")}
            />
          </Field>
          <Honeypot id="website" register={register("website")} />
        </div>
      )}
      <div className="mt-8 flex items-center justify-between gap-3">
        {step > 0 ? (
          <Button
            type="button"
            variant="outline"
            className="border-navy-900 text-navy-900"
            onClick={() => setStep((s) => s - 1)}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        ) : (
          <span />
        )}
        {step < 2 ? (
          <Button type="button" onClick={next}>
            Next <ArrowRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting ? "Sending…" : "Submit Quote"}
          </Button>
        )}
      </div>
    </form>
  );
}
