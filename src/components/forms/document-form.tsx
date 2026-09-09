"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2, FileText, Loader2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import {
  documentSchema,
  DOC_ACCEPT,
  DOC_MAX_BYTES,
  type DocumentValues,
} from "@/lib/schemas/document";
import { formatBytes } from "@/lib/schemas/application";
import { Field } from "@/components/forms/form-field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { COMPANY } from "@/lib/data/company";

export function DocumentForm() {
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState<string>();
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>();
  const startedAt = useRef<number>(Date.now());
  const errorRef = useRef<HTMLDivElement>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<DocumentValues>({
    resolver: zodResolver(documentSchema),
    mode: "onTouched",
    defaultValues: {
      reference: "",
      company: "",
      contact: "",
      email: "",
      phone: "",
      note: "",
      website: "",
    },
  });

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (formError) errorRef.current?.focus();
  }, [formError]);

  const pickFile = (selected: File | null) => {
    setFileError(undefined);
    if (!selected) {
      setFile(null);
      return;
    }
    if (selected.size > DOC_MAX_BYTES) {
      setFileError(`Keep the file under ${formatBytes(DOC_MAX_BYTES)}.`);
      setFile(null);
      return;
    }
    setFile(selected);
  };

  const clearFile = () => {
    setFile(null);
    setFileError(undefined);
    if (fileInput.current) fileInput.current.value = "";
  };

  const onSubmit = async (values: DocumentValues) => {
    setFormError(undefined);
    if (!file) {
      setFileError("Attach the document you want to send.");
      return;
    }

    const body = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== undefined && value !== null) body.append(key, String(value));
    });
    body.set("startedAt", String(startedAt.current));
    body.append("document", file);

    try {
      const response = await fetch("/api/documents", { method: "POST", body });
      const result = await response.json().catch(() => null);

      if (response.ok && result?.success) {
        setSent(true);
        toast.success("Document received");
        return;
      }
      if (result?.fieldErrors) {
        for (const [field, message] of Object.entries(
          result.fieldErrors as Record<string, string>,
        )) {
          if (field === "document") setFileError(message);
          else setError(field as keyof DocumentValues, { type: "server", message });
        }
      }
      const message =
        typeof result?.message === "string"
          ? result.message
          : "Something went wrong while uploading. Please try again.";
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
        <h2 className="mt-4 text-2xl font-bold text-navy-900">Document received.</h2>
        <p className="mt-3 leading-relaxed text-steel-600">
          Thanks. Dispatch has your document and will match it to the load. We will be in touch
          if anything is missing.
        </p>
        <p className="mt-4 text-sm text-steel-600">
          Need to send another?{" "}
          <button
            type="button"
            onClick={() => {
              setSent(false);
              clearFile();
            }}
            className="rounded-sm font-semibold text-navy-900 underline decoration-gold-500 decoration-2 underline-offset-4 hover:text-gold-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2"
          >
            Upload another document
          </button>
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
        <Field
          label="Load or PO reference"
          htmlFor="doc-reference"
          required
          error={errors.reference?.message}
        >
          <Input
            id="doc-reference"
            placeholder="ZWR-XXXXXXXX or your PO"
            aria-invalid={Boolean(errors.reference)}
            {...register("reference")}
          />
        </Field>
        <Field label="Company" htmlFor="doc-company" required error={errors.company?.message}>
          <Input
            id="doc-company"
            autoComplete="organization"
            aria-invalid={Boolean(errors.company)}
            {...register("company")}
          />
        </Field>
      </div>

      <div className="grid gap-5 sm:grid-cols-3">
        <Field
          label="Contact name"
          htmlFor="doc-contact"
          required
          error={errors.contact?.message}
        >
          <Input
            id="doc-contact"
            autoComplete="name"
            aria-invalid={Boolean(errors.contact)}
            {...register("contact")}
          />
        </Field>
        <Field label="Email" htmlFor="doc-email" required error={errors.email?.message}>
          <Input
            id="doc-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
        </Field>
        <Field label="Phone" htmlFor="doc-phone" hint="Optional" error={errors.phone?.message}>
          <Input
            id="doc-phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            aria-invalid={Boolean(errors.phone)}
            {...register("phone")}
          />
        </Field>
      </div>

      <div>
        <div className="mb-2 flex items-baseline justify-between gap-3">
          <Label htmlFor="doc-file" className="mb-0">
            Document
            <span className="ml-1 text-danger" aria-hidden="true">
              *
            </span>
            <span className="sr-only"> (required)</span>
          </Label>
          <span className="text-xs text-steel-600">
            PDF or photo, up to {formatBytes(DOC_MAX_BYTES)}
          </span>
        </div>

        <input
          ref={fileInput}
          id="doc-file"
          type="file"
          accept={DOC_ACCEPT}
          className="sr-only"
          aria-invalid={Boolean(fileError)}
          aria-describedby={fileError ? "doc-file-error" : undefined}
          onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
        />

        {file ? (
          <div className="flex items-center gap-3 rounded-lg border border-slate-300 bg-white p-3">
            <FileText className="h-5 w-5 shrink-0 text-gold-600" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-navy-900">{file.name}</p>
              <p className="text-xs text-steel-600">{formatBytes(file.size)}</p>
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={clearFile}>
              <X aria-hidden="true" />
              Remove
              <span className="sr-only"> selected document {file.name}</span>
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

        {fileError && (
          <p
            id="doc-file-error"
            role="alert"
            className="mt-1.5 text-sm font-medium text-danger"
          >
            {fileError}
          </p>
        )}
      </div>

      <Field label="Note" htmlFor="doc-note" hint="Optional" error={errors.note?.message}>
        <Textarea
          id="doc-note"
          rows={4}
          maxLength={1000}
          placeholder="Anything dispatch should know about this document."
          {...register("note")}
        />
      </Field>

      <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
        <label htmlFor="doc-website">Website</label>
        <input id="doc-website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" aria-hidden="true" />
              Uploading…
            </>
          ) : (
            <>
              <Upload aria-hidden="true" />
              Send document
            </>
          )}
        </Button>
        <p className="text-xs leading-relaxed text-steel-600">
          Prefer email? Send it to {COMPANY.email}.
        </p>
      </div>
    </form>
  );
}
