import "server-only";
import { NextResponse } from "next/server";
import { createHash, randomUUID } from "node:crypto";
import type { z } from "zod";
import { checkRateLimit } from "@/lib/server/rate-limit";
import { insertSubmission, markEmailed } from "@/lib/server/db";
import { mailerConfigured, sendFormEmail } from "@/lib/server/mailer";

/** Bots post instantly; a person needs a few seconds to fill a form in. */
const MIN_FILL_MS = 2500;

export const GENERIC_ERROR =
  "Something went wrong while sending your request. Please try again, or call dispatch.";

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

/** IPs are stored hashed so the database holds no raw addresses. */
export function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT ?? "zewar-contact";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

export function reference(): string {
  return `ZWR-${randomUUID().split("-")[0].toUpperCase()}`;
}

type Summary = {
  name: string;
  email: string;
  phone?: string | null;
  subject: string;
  message: string;
};

/**
 * One intake path for every JSON form: validate with the same schema the browser
 * used, screen for bots, rate limit, store, then email. The submission is stored
 * before the email is attempted, so a mail outage never loses a lead.
 */
export async function handleFormSubmission<S extends z.ZodType>({
  request,
  schema,
  formName,
  summarise,
}: {
  request: Request;
  schema: S;
  formName: string;
  /** May be async so a route can resolve database-backed labels. */
  summarise: (data: z.infer<S>) => Summary | Promise<Summary>;
}) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: GENERIC_ERROR }, { status: 400 });
  }

  const parsed = schema.safeParse(payload);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return NextResponse.json(
      { success: false, message: "Please check the highlighted fields.", fieldErrors },
      { status: 422 },
    );
  }

  const data = parsed.data as z.infer<S> & { startedAt?: number; website?: string };

  // Accept obvious bots silently so they get no signal to retry differently, and
  // so a customer whose password manager filled the hidden trap is never shown
  // an error about a field they cannot see.
  const tooFast =
    typeof data.startedAt === "number" && Date.now() - data.startedAt < MIN_FILL_MS;
  const trapFilled = typeof data.website === "string" && data.website.trim() !== "";
  if (tooFast || trapFilled) {
    // Logged so a false positive is discoverable: if a real enquiry ever trips
    // the trap, there is a record of it rather than a silently lost lead.
    console.warn(
      `[${formName}] discarded as automated (${tooFast ? "too fast" : "honeypot filled"})`,
    );
    return NextResponse.json({ success: true, message: "Received.", referenceId: reference() });
  }

  const ipHash = hashIp(clientIp(request));
  const limit = checkRateLimit(`${formName}:${ipHash}`);
  if (!limit.allowed) {
    return NextResponse.json(
      {
        success: false,
        message:
          "You've sent several requests recently. Please try again shortly or call dispatch.",
      },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  const summary = await summarise(data);
  const referenceId = reference();

  // The honeypot and the timing probe are spam checks, not business data.
  const stored: Record<string, unknown> = { ...(data as Record<string, unknown>) };
  delete stored.website;
  delete stored.startedAt;

  let submissionId: number | null = null;
  try {
    submissionId = await insertSubmission({
      form: formName,
      name: summary.name,
      email: summary.email,
      phone: summary.phone ?? null,
      subject: summary.subject,
      message: summary.message,
      payload: stored,
      reference: referenceId,
      ipHash,
      userAgent: request.headers.get("user-agent")?.slice(0, 300) ?? null,
    });
  } catch (cause) {
    console.error(`[${formName}] could not store submission`, cause);
  }

  let emailed = false;
  if (mailerConfigured) {
    const sent = await sendFormEmail({
      formLabel: formName,
      reference: referenceId,
      name: summary.name,
      email: summary.email,
      phone: summary.phone ?? undefined,
      subject: summary.subject,
      message: summary.message,
      details: stored,
    });
    if (sent.ok) {
      emailed = true;
      if (submissionId !== null) await markEmailed(submissionId);
    } else {
      console.error(`[${formName}] Resend delivery failed:`, sent.reason);
    }
  } else {
    console.warn(`[${formName}] Resend is not configured; submission stored only.`);
  }

  // A stored submission is a delivered lead: the team sees it in the admin panel
  // even when email is down. Only a total failure is reported as an error.
  if (submissionId === null && !emailed) {
    return NextResponse.json({ success: false, message: GENERIC_ERROR }, { status: 502 });
  }

  return NextResponse.json({
    success: true,
    message: "Thanks — we've received your request and will respond within 2 business hours.",
    referenceId,
  });
}
