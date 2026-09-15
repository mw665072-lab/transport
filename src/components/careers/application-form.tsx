"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, FileText, Loader2, Send, Upload, X } from "lucide-react";
import { toast } from "sonner";
import {
  applicationSchema,
  CDL_CLASSES,
  RESUME_ACCEPT,
  RESUME_MAX_BYTES,
  formatBytes,
  type ApplicationValues,
} from "@/lib/schemas/application";
import { Field } from "@/components/forms/form-field";
import { Honeypot } from "@/components/forms/honeypot";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COMPANY } from "@/lib/data/company";

const COVER_MAX = 3000;

export function ApplicationForm({
  jobSlug,
  jobTitle,
}: {
  jobSlug?: string;
  jobTitle?: string;
}) {
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState<string>();
  const [resume, setResume] = useState<File | null>(null);
  const [resumeError, setResumeError] = useState<string>();
  const startedAt = useRef<number>(Date.now());
  const errorRef = useRef<HTMLDivElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const {
    register,
    control,
    handleSubmit,
    setError,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ApplicationValues>({
    resolver: zodResolver(applicationSchema),
    mode: "onTouched",
    defaultValues: {
      website: "",
      jobSlug: jobSlug ?? "",
      name: "",
      email: "",
      phone: "",
      cdlClass: "None",
      linkedin: "",
      coverLetter: "",
    },
  });

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (formError) errorRef.current?.focus();
  }, [formError]);

  const coverLength = watch("coverLetter")?.length ?? 0;

  const pickResume = (file: File | null) => {
    setResumeError(undefined);
    if (!file) {
      setResume(null);
      return;
    }
    if (file.size > RESUME_MAX_BYTES) {
      setResumeError(`Keep the file under ${formatBytes(RESUME_MAX_BYTES)}.`);
      setResume(null);
      return;
    }
    setResume(file);
  };

  const clearResume = () => {
    setResume(null);
    setResumeError(undefined);
    if (fileInput.current) fileInput.current.value = "";
  };

  const onSubmit = async (values: ApplicationValues) => {
    setFormError(undefined);

    const body = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null) body.append(key, String(value));
    });
    body.set("startedAt", String(startedAt.current));
    if (resume) body.append("resume", resume);

    try {
      const response = await fetch("/api/apply", { method: "POST", body });
      const result = await response.json().catch(() => null);

      if (response.ok && result?.success) {
        setSent(true);
        toast.success("Application submitted");
        return;
      }

      if (result?.fieldErrors) {
        for (const [field, message] of Object.entries(
          result.fieldErrors as Record<string, string>,
        )) {
          if (field === "resume") setResumeError(message);
          else setError(field as keyof ApplicationValues, { type: "server", message });
        }
      }
      const message =
        typeof result?.message === "string"
          ? result.message
          : "Something went wrong while sending your application. Please try again.";
      setFormError(message);
      toast.error(message);
    } catch {
      const message =
        "We could not reach the server. Please check your connection and try again.";
      setFormError(message);
      toast.error(message);
    }
  };

  if (sent) {
    return (
      <div
        role="status"
        className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 md:p-8"
      >
        <CheckCircle2 className="h-10 w-10 text-emerald-600" aria-hidden="true" />
        <h3 className="mt-4 text-2xl font-bold text-navy-900">
          Your application has been submitted successfully.
        </h3>
        <p className="mt-3 leading-relaxed text-steel-600">
          {jobTitle
            ? `Thanks for applying for ${jobTitle}. `
            : `Thanks for your interest in joining ${COMPANY.shortName}. `}
          Our team reviews every application and will contact you if there is a fit.
        </p>
        <p className="mt-4 text-sm text-steel-600">
          Questions in the meantime?{" "}
          <a
            href={`mailto:${COMPANY.emailCareers}`}
            className="rounded-sm font-semibold text-navy-900 underline decoration-gold-500 decoration-2 underline-offset-4 hover:text-gold-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
          >
            {COMPANY.emailCareers}
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

      <input type="hidden" {...register("jobSlug")} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" htmlFor="app-name" required error={errors.name?.message}>
          <Input
            id="app-name"
            autoComplete="name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "app-name-error" : undefined}
            {...register("name")}
          />
        </Field>
        <Field label="Email" htmlFor="app-email" required error={errors.email?.message}>
          <Input
            id="app-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "app-email-error" : undefined}
            {...register("email")}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Phone" htmlFor="app-phone" required error={errors.phone?.message}>
          <Input
            id="app-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+1 555 000 0000"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "app-phone-error" : undefined}
            {...register("phone")}
          />
        </Field>
        <Field
          label="Years of experience"
          htmlFor="app-years"
          hint="Optional"
          error={errors.yearsExperience?.message}
        >
          <Input
            id="app-years"
            type="number"
            min="0"
            max="60"
            inputMode="numeric"
            aria-invalid={Boolean(errors.yearsExperience)}
            {...register("yearsExperience", {
              setValueAs: (v) => (v === "" ? undefined : Number(v)),
            })}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="CDL class"
          htmlFor="app-cdl"
          hint="Drivers only"
          error={errors.cdlClass?.message}
        >
          <Controller
            control={control}
            name="cdlClass"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger id="app-cdl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CDL_CLASSES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
        <Field
          label="LinkedIn or portfolio"
          htmlFor="app-linkedin"
          hint="Optional"
          error={errors.linkedin?.message}
        >
          <Input
            id="app-linkedin"
            type="url"
            inputMode="url"
            placeholder="https://"
            aria-invalid={Boolean(errors.linkedin)}
            {...register("linkedin")}
          />
        </Field>
      </div>

      {/* Resume upload: a styled button drives a visually hidden file input, so the
          control stays a real <input type="file"> for keyboard and screen readers. */}
      <div>
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <Label htmlFor="app-resume" className="mb-0">
            Resume
          </Label>
          <span className="text-xs text-steel-600">
            PDF or Word, up to {formatBytes(RESUME_MAX_BYTES)}
          </span>
        </div>

        <input
          ref={fileInput}
          id="app-resume"
          type="file"
          accept={RESUME_ACCEPT}
          className="sr-only"
          aria-invalid={Boolean(resumeError)}
          aria-describedby={resumeError ? "app-resume-error" : undefined}
          onChange={(e) => pickResume(e.target.files?.[0] ?? null)}
        />

        {resume ? (
          <div className="flex items-center gap-3 rounded-lg border border-slate-300 bg-white p-3">
            <FileText className="h-5 w-5 shrink-0 text-gold-600" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-navy-900">{resume.name}</p>
              <p className="text-xs text-steel-600">{formatBytes(resume.size)}</p>
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={clearResume}>
              <X aria-hidden="true" />
              Remove
              <span className="sr-only"> selected resume {resume.name}</span>
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start border-slate-300 text-navy-900 sm:w-auto"
            onClick={() => fileInput.current?.click()}
          >
            <Upload aria-hidden="true" />
            Choose a file
          </Button>
        )}

        {resumeError && (
          <p
            id="app-resume-error"
            role="alert"
            className="mt-1.5 text-sm font-medium text-danger"
          >
            {resumeError}
          </p>
        )}
      </div>

      <Field
        label="Cover note"
        htmlFor="app-cover"
        hint={`${coverLength}/${COVER_MAX}`}
        error={errors.coverLetter?.message}
      >
        <Textarea
          id="app-cover"
          rows={6}
          maxLength={COVER_MAX}
          placeholder="Tell us about your experience, the equipment you have run, and your preferred lanes."
          aria-invalid={Boolean(errors.coverLetter)}
          {...register("coverLetter")}
        />
      </Field>
      <Honeypot id="app-website" register={register("website")} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" aria-hidden="true" />
              Sending application…
            </>
          ) : (
            <>
              <Send aria-hidden="true" />
              Submit Application
            </>
          )}
        </Button>
        <p className="text-xs leading-relaxed text-steel-600">
          Your details are used only to assess this application.
        </p>
      </div>
    </form>
  );
}
