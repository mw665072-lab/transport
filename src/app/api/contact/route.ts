import { NextResponse } from "next/server";
import { createHash, randomUUID } from "node:crypto";
import { contactSchema } from "@/lib/schemas/contact";
import { checkRateLimit } from "@/lib/server/rate-limit";
import { insertSubmission, markEmailed } from "@/lib/server/db";
import { mailerConfigured, sendContactEmail } from "@/lib/server/mailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Bots post instantly; a person needs a few seconds to fill the form in. */
const MIN_FILL_MS = 2500;

const GENERIC_ERROR =
  "Something went wrong while sending your message. Please try again, or call dispatch.";

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

/** IPs are stored hashed so the database holds no raw addresses. */
function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT ?? "zewar-contact";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

function reference(): string {
  return `ZWR-${randomUUID().split("-")[0].toUpperCase()}`;
}

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ success: false, message: GENERIC_ERROR }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    // Field-level messages go back so the form can highlight the right input.
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

  const data = parsed.data;

  // Silently accept obvious bots so they get no signal to retry differently.
  const tooFast =
    typeof data.startedAt === "number" && Date.now() - data.startedAt < MIN_FILL_MS;
  if (tooFast) {
    return NextResponse.json({ success: true, message: "Received.", referenceId: reference() });
  }

  const ip = clientIp(request);
  const ipHash = hashIp(ip);
  const limit = checkRateLimit(ipHash);
  if (!limit.allowed) {
    return NextResponse.json(
      {
        success: false,
        message:
          "You've sent several messages recently. Please try again shortly or call dispatch.",
      },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  const referenceId = reference();
  let submissionId: number | null = null;

  // The submission is stored first, so a mail outage never loses a lead.
  try {
    submissionId = await insertSubmission({
      form: "contact",
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      subject: data.subject,
      message: data.message,
      ipHash,
      userAgent: request.headers.get("user-agent")?.slice(0, 300) ?? null,
    });
  } catch (cause) {
    console.error("[contact] could not store submission", cause);
  }

  let emailed = false;
  if (mailerConfigured) {
    const sent = await sendContactEmail({
      reference: referenceId,
      name: data.name,
      email: data.email,
      phone: data.phone || undefined,
      subject: data.subject,
      message: data.message,
    });
    if (sent.ok) {
      emailed = true;
      if (submissionId !== null) await markEmailed(submissionId);
    } else {
      console.error("[contact] Resend delivery failed:", sent.reason);
    }
  } else {
    console.warn("[contact] Resend is not configured; submission stored only.");
  }

  // A stored submission is a delivered lead: the team sees it in the admin panel
  // even when email is down. Only a total failure is reported as an error.
  if (submissionId === null && !emailed) {
    return NextResponse.json({ success: false, message: GENERIC_ERROR }, { status: 502 });
  }

  return NextResponse.json({
    success: true,
    message: "Thanks — we've received your message and will respond within 2 business hours.",
    referenceId,
  });
}
