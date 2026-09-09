"use client";

import { useActionState } from "react";
import { AlertCircle, Loader2, Lock } from "lucide-react";
import { login } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

export default function AdminLogin() {
  const [error, formAction, pending] = useActionState(login, undefined);

  return (
    <section className="flex min-h-screen items-center bg-navy-950 px-5 py-16">
      <Card className="mx-auto w-full max-w-sm p-6 md:p-8">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-500 text-navy-950">
          <Lock className="h-5 w-5" aria-hidden="true" />
        </div>
        <h1 className="mt-4 text-2xl font-bold text-navy-900">Admin sign in</h1>
        <p className="mt-2 text-sm leading-relaxed text-steel-600">
          Enter the admin password to view contact submissions.
        </p>

        <form action={formAction} className="mt-6 grid gap-4">
          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-lg border border-danger/30 bg-danger/5 p-3 text-sm text-navy-900"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-hidden="true" />
              <span>{error}</span>
            </div>
          )}
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              autoFocus
            />
          </div>
          <Button type="submit" disabled={pending} className="w-full">
            {pending ? (
              <>
                <Loader2 className="animate-spin" aria-hidden="true" />
                Signing in…
              </>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>
      </Card>
    </section>
  );
}
