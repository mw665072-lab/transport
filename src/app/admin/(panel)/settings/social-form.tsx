"use client";

import { useActionState } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { saveSocialLinks } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { SOCIAL_KEYS } from "@/lib/data/social";

export function SocialForm({ values }: { values: Record<string, string> }) {
  const [message, formAction, pending] = useActionState(saveSocialLinks, undefined);
  const saved = message === "Saved.";

  return (
    <Card className="p-6 md:p-8">
      <h2 className="text-xl font-bold text-navy-900">Social profiles</h2>
      <p className="mt-2 text-sm leading-relaxed text-steel-600">
        An icon appears in the footer only for a link filled in here. Leave a field blank to
        remove its icon. X and Instagram have no icon in the current set, so they are stored but
        not shown yet.
      </p>

      <form action={formAction} className="mt-6 grid gap-5">
        {message && (
          <div
            role="status"
            className={
              saved
                ? "flex items-start gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-navy-900"
                : "flex items-start gap-2 rounded-lg border border-danger/30 bg-danger/5 p-3 text-sm text-navy-900"
            }
          >
            {saved ? (
              <CheckCircle2
                className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
                aria-hidden="true"
              />
            ) : (
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-hidden="true" />
            )}
            <span>{saved ? "Social links saved." : message}</span>
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          {SOCIAL_KEYS.map((field) => (
            <div key={field.key}>
              <Label htmlFor={field.key}>{field.label}</Label>
              <Input
                id={field.key}
                name={field.key}
                type="url"
                inputMode="url"
                defaultValue={values[field.key] ?? ""}
                placeholder={field.placeholder}
              />
            </div>
          ))}
        </div>

        <Button type="submit" disabled={pending} className="w-fit">
          {pending ? (
            <>
              <Loader2 className="animate-spin" aria-hidden="true" />
              Saving…
            </>
          ) : (
            "Save social links"
          )}
        </Button>
      </form>
    </Card>
  );
}
