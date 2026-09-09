"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { contactSchema, CONTACT_SUBJECTS, type ContactValues } from "@/lib/schemas/contact";
import { submitForm } from "@/lib/forms/submit";
import { Field } from "@/components/forms/form-field";
import { Honeypot } from "@/components/forms/honeypot";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COMPANY } from "@/lib/data/company";

const MESSAGE_MAX = 2000;

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [reference, setReference] = useState<string>();
  const [formError, setFormError] = useState<string>();
  const startedAt = useRef<number>(Date.now());
  const errorRef = useRef<HTMLDivElement>(null);

  const {
    register,
    control,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
    defaultValues: {
      website: "",
      name: "",
      email: "",
      phone: "",
      subject: "New Shipment",
      message: "",
    },
  });

  // The clock starts when the form is first rendered, so the server can tell a
  // human apart from a bot that posts the instant the page loads.
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  // Move focus to the banner so a screen reader announces a failed submission.
  useEffect(() => {
    if (formError) errorRef.current?.focus();
  }, [formError]);

  const messageLength = watch("message")?.length ?? 0;

  const onSubmit = async (values: ContactValues) => {
    setFormError(undefined);
    const result = await submitForm("contact", { ...values, startedAt: startedAt.current });

    if (result.success) {
      // Success is tracked separately from the reference: a delivered message
      // must confirm even if the server did not return a reference id.
      setSent(true);
      setReference(result.referenceId);
      toast.success("Message sent");
      return;
    }

    if (result.fieldErrors) {
      for (const [field, message] of Object.entries(result.fieldErrors)) {
        setError(field as keyof ContactValues, { type: "server", message });
      }
    }
    setFormError(result.message);
    toast.error(result.message);
  };

  if (sent) {
    return (
      <div
        role="status"
        className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 md:p-8"
      >
        <CheckCircle2 className="h-10 w-10 text-emerald-600" aria-hidden="true" />
        <h3 className="mt-4 text-2xl font-bold text-navy-900">Message sent.</h3>
        <p className="mt-3 leading-relaxed text-steel-600">
          Thanks. Dispatch will review your message and reply using the contact details you
          provided, normally within 2 business hours.
        </p>
        {reference && (
          <p className="mt-4 text-sm text-steel-600">
            Your reference: <strong className="text-navy-900">{reference}</strong>
          </p>
        )}
        <p className="mt-6 text-sm text-steel-600">
          Need an answer sooner?{" "}
          <a
            href={COMPANY.phoneHref}
            className="rounded-sm font-semibold text-navy-900 underline decoration-gold-500 decoration-2 underline-offset-4 hover:text-gold-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
          >
            Call dispatch on {COMPANY.phone}
          </a>
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5" noValidate>
      {formError && (
        <div
          ref={errorRef}
          tabIndex={-1}
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-danger/30 bg-danger/5 p-4 text-sm text-navy-900 focus:outline-none"
        >
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-danger" aria-hidden="true" />
          <span>{formError}</span>
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" htmlFor="name" required error={errors.name?.message}>
          <Input
            id="name"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "name-error" : undefined}
            {...register("name")}
          />
        </Field>
        <Field label="Email" htmlFor="email" required error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            {...register("email")}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Phone" htmlFor="phone" hint="Optional" error={errors.phone?.message}>
          <Input
            id="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+1 555 000 0000"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "phone-error" : undefined}
            {...register("phone")}
          />
        </Field>
        <Field label="Subject" htmlFor="subject" required error={errors.subject?.message}>
          <Controller
            control={control}
            name="subject"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="subject" aria-invalid={Boolean(errors.subject)}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONTACT_SUBJECTS.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
      </div>

      <Field
        label="Message"
        htmlFor="message"
        required
        error={errors.message?.message}
        hint={`${messageLength}/${MESSAGE_MAX}`}
      >
        <Textarea
          id="message"
          rows={6}
          maxLength={MESSAGE_MAX}
          placeholder="Pickup and delivery locations, timing, and what you are shipping."
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          {...register("message")}
        />
      </Field>
      <Honeypot id="website" register={register("website")} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" aria-hidden="true" />
              Sending message…
            </>
          ) : (
            <>
              <Send aria-hidden="true" />
              Send Message
            </>
          )}
        </Button>
        <p className="text-xs leading-relaxed text-steel-600">
          We reply within 2 business hours. Your details are used only to answer this enquiry.
        </p>
      </div>
    </form>
  );
}
