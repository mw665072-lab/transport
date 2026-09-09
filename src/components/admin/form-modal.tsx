"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Modal, ModalContent, ModalTrigger } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";

/**
 * Wraps an admin form in a dialog.
 *
 * Editing is driven by a query parameter, so the server can render the form with
 * the record already loaded. When that parameter is present the dialog opens on
 * arrival, and closing it strips the parameter so a refresh does not reopen it.
 * A successful save redirects to the clean URL, which closes the dialog.
 */
export function FormModal({
  triggerLabel,
  title,
  description,
  editing,
  children,
}: {
  triggerLabel: string;
  title: string;
  description?: string;
  /** True when the page was opened with an edit query parameter. */
  editing?: boolean;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(Boolean(editing));

  useEffect(() => setOpen(Boolean(editing)), [editing]);

  const onOpenChange = (next: boolean) => {
    setOpen(next);
    // Closing an edit dialog returns to the plain list URL.
    if (!next && editing) {
      router.replace(window.location.pathname);
    }
  };

  return (
    <Modal open={open} onOpenChange={onOpenChange}>
      <ModalTrigger asChild>
        <Button type="button">
          <Plus aria-hidden="true" />
          {triggerLabel}
        </Button>
      </ModalTrigger>
      <ModalContent title={title} description={description}>
        {children}
      </ModalContent>
    </Modal>
  );
}
