"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Centred dialog for admin forms. Radix handles the focus trap, Escape, and the
 * aria wiring; this only supplies the shell and the scrolling behaviour a long
 * form needs on a short screen.
 */
export const Modal = Dialog.Root;
export const ModalTrigger = Dialog.Trigger;
export const ModalClose = Dialog.Close;

export function ModalContent({
  className,
  title,
  description,
  children,
  ...props
}: React.ComponentProps<typeof Dialog.Content> & {
  title: string;
  description?: string;
}) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-[90] bg-navy-950/60 data-[state=open]:animate-in data-[state=open]:fade-in" />
      <Dialog.Content
        className={cn(
          "fixed left-1/2 top-1/2 z-[95] flex max-h-[calc(100dvh-2rem)] w-[min(100%-1.5rem,56rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl bg-white shadow-2xl",
          "data-[state=open]:animate-in data-[state=open]:fade-in data-[state=open]:zoom-in-95",
          className,
        )}
        {...props}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5 md:p-6">
          <div className="min-w-0">
            <Dialog.Title className="text-xl font-bold text-navy-900">{title}</Dialog.Title>
            {description ? (
              <Dialog.Description className="mt-1.5 text-sm leading-relaxed text-steel-600">
                {description}
              </Dialog.Description>
            ) : (
              <Dialog.Description className="sr-only">{title}</Dialog.Description>
            )}
          </div>
          <Dialog.Close className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-steel-600 transition hover:bg-slate-100 hover:text-navy-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2">
            <X className="h-5 w-5" aria-hidden="true" />
            <span className="sr-only">Close</span>
          </Dialog.Close>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5 md:p-6">{children}</div>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
