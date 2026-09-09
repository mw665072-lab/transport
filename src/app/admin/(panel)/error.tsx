"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

/**
 * Catches any failure inside the admin panel, which in practice is almost always
 * the database being unreachable. The driver's own message is useless to an
 * operator and can name internal hosts, so it stays in the server log and this
 * explains what to check instead.
 */
export default function PanelError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[admin]", error);
  }, [error]);

  const looksLikeDatabase = /mongo|ECONNREFUSED|querySrv|ETIMEDOUT|ServerSelection/i.test(
    error.message,
  );

  return (
    <Card className="border-danger/30 bg-danger/5 p-6 md:p-8">
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-danger" aria-hidden="true" />
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-navy-900">
            {looksLikeDatabase ? "Cannot reach the database." : "Something went wrong."}
          </h1>

          {looksLikeDatabase ? (
            <>
              <p className="mt-2 text-sm leading-relaxed text-steel-600">
                The admin panel needs the database. Common causes:
              </p>
              <ul className="mt-3 grid gap-2 text-sm leading-relaxed text-steel-600">
                {[
                  "MONGODB_URI is missing or wrong in this machine's environment.",
                  "This network cannot resolve the cluster's DNS SRV record. Use the non-SRV connection string from Atlas, or set the machine's DNS to 1.1.1.1.",
                  "This machine's IP address is not on the Atlas access list.",
                ].map((line) => (
                  <li key={line} className="flex gap-2.5">
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-danger"
                      aria-hidden="true"
                    />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="mt-2 text-sm leading-relaxed text-steel-600">
              Try again. If it keeps happening, the details are in the server log.
            </p>
          )}

          <Button type="button" onClick={reset} className="mt-6">
            <RotateCcw aria-hidden="true" />
            Try again
          </Button>
        </div>
      </div>
    </Card>
  );
}
