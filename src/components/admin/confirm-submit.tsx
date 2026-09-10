"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

/**
 * Destructive submit button that asks first.
 *
 * The trigger is a plain button, so the surrounding form only posts once the
 * confirmation is accepted. Radix Dialog supplies the focus trap, Escape, and
 * the aria wiring; `role="alertdialog"` and the blocked outside-click give it
 * the interruptive behaviour a delete deserves, without pulling in a second
 * Radix package for the one dialog that needs it.
 *
 * The confirm button is portalled outside the form element, so it cannot submit
 * on its own. It calls `requestSubmit()` on the form the trigger belongs to,
 * which leaves the server action and its form data untouched.
 */
export function ConfirmSubmit({
  recordName,
  recordKind,
  label = "Delete",
  confirmLabel,
  description,
  className,
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
}) {
  const [open, setOpen] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement | null>(null);
  const { pending } = useFormStatus();

  return (
    <Dialog.Root
      open={open}
      // Once the action is away there is nothing left to cancel, so the dialog
      // stays put and shows the pending state until the row disappears.
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
          className={cn("text-danger", className)}
          onClick={(event) => {
            formRef.current = event.currentTarget.form;
          }}
        >
          {pending ? "Deleting…" : label}
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[90] bg-navy-950/60 data-[state=open]:animate-in data-[state=open]:fade-in" />
        <Dialog.Content
          role="alertdialog"
          // A misclick outside must not count as an answer either way.
          onInteractOutside={(event) => event.preventDefault()}
          className={cn(
            "fixed left-1/2 top-1/2 z-[95] w-[min(100%-1.5rem,28rem)] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-5 shadow-2xl md:p-6",
            "data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95",
          )}
        >
          <Dialog.Title className="text-lg font-bold text-navy-900">
            Delete this {recordKind}?
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-sm leading-relaxed text-steel-600">
            <span className="font-semibold text-navy-900">{recordName}</span> will be removed
            permanently.{description ? ` ${description}` : ""} This cannot be undone.
          </Dialog.Description>

          {/* Cancel is first in the DOM, so it takes the opening focus and
              Enter on arrival is the safe answer. */}
          <div className="mt-6 flex flex-wrap justify-end gap-2">
            <Dialog.Close asChild>
              <Button type="button" size="sm" variant="ghost" disabled={pending}>
                Cancel
              </Button>
            </Dialog.Close>
            <Button
              type="button"
              size="sm"
              disabled={pending}
              className="bg-danger text-white hover:bg-danger/90 active:bg-danger/90"
              onClick={() => formRef.current?.requestSubmit()}
            >
              {pending ? "Deleting…" : (confirmLabel ?? `Delete ${recordKind}`)}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
