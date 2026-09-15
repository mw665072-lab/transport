"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useFormStatus } from "react-dom";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

/**
 * Destructive submit button with an interactive confirmation modal.
 * Built on Radix Dialog for accessibility, focus trapping, Escape handling,
 * and reliable form submission.
 */
export function ConfirmSubmit({
  recordName,
  recordKind,
  label = "Delete",
  confirmLabel,
  description,
  className,
  showIcon = true,
}: {
  /** The record's own name, so the prompt shows which row is about to go. */
  recordName: string;
  /** Singular noun for the record: "service", "job", "gallery item". */
  recordKind: string;
  /** Text on the button in the list. */
  label?: string;
  /** Text on the confirming button. Defaults to `Delete <kind>`. */
  confirmLabel?: string;
  /** One extra sentence for knock-on effects, e.g. related rows going too. */
  description?: string;
  className?: string;
  showIcon?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement | null>(null);
  const { pending } = useFormStatus();

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        if (!pending) setOpen(next);
      }}
    >
      <Dialog.Trigger asChild>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          disabled={pending}
          className={cn(
            "text-red-600 hover:bg-red-50 hover:text-red-700 active:bg-red-100/80",
            className,
          )}
          onClick={(event) => {
            formRef.current = event.currentTarget.form;
          }}
        >
          {pending ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              <span>Deleting…</span>
            </>
          ) : (
            <>
              {showIcon && <Trash2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
              <span>{label}</span>
            </>
          )}
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[90] bg-navy-950/60 backdrop-blur-xs data-[state=open]:animate-in data-[state=open]:fade-in duration-200" />
        <Dialog.Content
          role="alertdialog"
          onInteractOutside={(event) => event.preventDefault()}
          className={cn(
            "fixed left-1/2 top-1/2 z-[95] w-[min(calc(100%-2rem),26rem)] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-5 sm:p-6 shadow-2xl border border-slate-100",
            "data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95 duration-200",
          )}
        >
          <div className="flex items-start gap-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-100/80 text-red-600 ring-4 ring-red-50">
              <AlertTriangle className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <Dialog.Title className="text-lg font-bold text-navy-950">
                Delete this {recordKind}?
              </Dialog.Title>
              <div className="mt-2 text-sm leading-relaxed text-slate-600">
                <p>
                  Are you sure you want to permanently delete{" "}
                  <span className="font-semibold text-navy-900 break-words rounded bg-slate-100 px-1.5 py-0.5">
                    {recordName}
                  </span>
                  ?
                </p>
                {description && <p className="mt-1.5 text-xs text-slate-500">{description}</p>}
                <p className="mt-2 text-xs font-semibold text-red-600">
                  This action cannot be undone.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:gap-2.5">
            <Dialog.Close asChild>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={pending}
                className="w-full sm:w-auto border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300"
              >
                Cancel
              </Button>
            </Dialog.Close>
            <Button
              type="button"
              size="sm"
              disabled={pending}
              className="w-full sm:w-auto bg-red-600 text-white hover:bg-red-700 active:bg-red-800"
              onClick={() => formRef.current?.requestSubmit()}
            >
              {pending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                  <span>Deleting…</span>
                </>
              ) : (
                confirmLabel ?? `Delete ${recordKind}`
              )}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
