"use client";
import { useRef, useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ownerOperatorSchema, type OwnerOperatorValues } from "@/lib/schemas/owner-operator";
import { submitForm } from "@/lib/forms/submit";
import { Field } from "@/components/forms/form-field";
import { Honeypot } from "@/components/forms/honeypot";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const cdl = ["Class A", "Class B", "None"] as const,
  eq = ["Cargo Van", "Sprinter Van", "Box Truck", "Hotshot Trailer"] as const,
  avail = ["Immediately", "Within 2 weeks", "Within a month"] as const;
export function OwnerOperatorForm() {
  const [done, setDone] = useState(false);
  // The clock starts when the form is first rendered, so the server can tell a
  // human apart from a bot that posts the instant the page loads.
  const startedAt = useRef<number>(Date.now());
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OwnerOperatorValues>({
    resolver: zodResolver(ownerOperatorSchema),
    defaultValues: {
      website: "",
      fullName: "",
      email: "",
      phone: "",
      cdlClass: "None",
      yearsExperience: 0,
      equipmentType: "Cargo Van",
      mcNumber: "",
      preferredLanes: "",
      availability: "Immediately",
    },
  });
  const onSubmit = async (v: OwnerOperatorValues) => {
    const r = await submitForm("owner-operator", { ...v, startedAt: startedAt.current });
    if (r.success) {
      setDone(true);
      toast.success("Request received");
    } else toast.error(r.message);
  };
  if (done)
    return (
      <div className="rounded-xl bg-emerald-50 p-7">
        <CheckCircle2 className="h-9 w-9 text-emerald-600" />
        <h2 className="mt-4 text-2xl font-bold text-navy-900">Application details received.</h2>
        <p className="mt-2 text-steel-600">
          Zewar Transport will review the information and contact you if there is a fit.
        </p>
      </div>
    );
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" htmlFor="fullName" error={errors.fullName?.message}>
          <Input id="fullName" autoComplete="name" {...register("fullName")} />
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
          <Input id="phone" autoComplete="tel" inputMode="tel" {...register("phone")} />
        </Field>
        <Field label="CDL class" htmlFor="cdlClass" error={errors.cdlClass?.message}>
          <Controller
            control={control}
            name="cdlClass"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="cdlClass">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cdl.map((x) => (
                    <SelectItem key={x} value={x}>
                      {x}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
        <Field
          label="Years of experience"
          htmlFor="yearsExperience"
          error={errors.yearsExperience?.message}
        >
          <Input
            id="yearsExperience"
            type="number"
            min="0"
            max="50"
            {...register("yearsExperience", { valueAsNumber: true })}
          />
        </Field>
        <Field
          label="Equipment type"
          htmlFor="equipmentType"
          error={errors.equipmentType?.message}
        >
          <Controller
            control={control}
            name="equipmentType"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="equipmentType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {eq.map((x) => (
                    <SelectItem key={x} value={x}>
                      {x}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
        <Field label="MC number (optional)" htmlFor="mcNumber" error={errors.mcNumber?.message}>
          <Input id="mcNumber" {...register("mcNumber")} />
        </Field>
        <Field
          label="Preferred lanes (optional)"
          htmlFor="preferredLanes"
          error={errors.preferredLanes?.message}
        >
          <Input id="preferredLanes" {...register("preferredLanes")} />
        </Field>
        <Field label="Availability" htmlFor="availability" error={errors.availability?.message}>
          <Controller
            control={control}
            name="availability"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="availability">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {avail.map((x) => (
                    <SelectItem key={x} value={x}>
                      {x}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
      </div>
      <Honeypot id="website" register={register("website")} />
      <Button type="submit" disabled={isSubmitting} className="w-fit">
        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
        {isSubmitting ? "Sending…" : "Submit Details"}
      </Button>
    </form>
  );
}
