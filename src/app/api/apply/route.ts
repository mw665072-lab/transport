import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { resolve } from "node:path";
import {
  applicationServerSchema,
  RESUME_EXTENSIONS,
  RESUME_MAX_BYTES,
  RESUME_TYPES,
} from "@/lib/schemas/application";
import { storeUpload } from "@/lib/server/uploads";
import { checkRateLimit } from "@/lib/server/rate-limit";
import { getJobBySlug, insertApplication } from "@/lib/server/db";
import { mailerConfigured, sendFormEmail } from "@/lib/server/mailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MIN_FILL_MS = 2500;
const UPLOAD_DIR = resolve(process.env.RESUME_UPLOAD_DIR ?? "./data/resumes");

const GENERIC_ERROR =
  "Something went wrong while sending your application. Please try again, or email us directly.";

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT ?? "zewar-contact";
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex").slice(0, 32);
}

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ success: false, message: GENERIC_ERROR }, { status: 400 });
  }

  const raw = {
    jobSlug: String(form.get("jobSlug") ?? ""),
    name: String(form.get("name") ?? ""),
    email: String(form.get("email") ?? ""),
    phone: String(form.get("phone") ?? ""),
    cdlClass: form.get("cdlClass") ? String(form.get("cdlClass")) : undefined,
    yearsExperience: form.get("yearsExperience")
      ? Number(form.get("yearsExperience"))
      : undefined,
    linkedin: String(form.get("linkedin") ?? ""),
    coverLetter: String(form.get("coverLetter") ?? ""),
    website: String(form.get("website") ?? ""),
    startedAt: form.get("startedAt") ? Number(form.get("startedAt")) : undefined,
  };

  const parsed = applicationServerSchema.safeParse(raw);
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

  const data = parsed.data;

  // Silent accept for both spam signals: a bot gets no clue it was caught, and a
  // customer whose password manager filled the hidden trap sees no error about a
  // field they cannot see.
  const tooFast =
    typeof data.startedAt === "number" && Date.now() - data.startedAt < MIN_FILL_MS;
  const trapFilled = typeof data.website === "string" && data.website.trim() !== "";
  if (tooFast || trapFilled) {
    return NextResponse.json({ success: true, message: "Received." });
  }

  const ipHash = hashIp(clientIp(request));
  const limit = checkRateLimit(`apply:${ipHash}`);
  if (!limit.allowed) {
    return NextResponse.json(
      {
        success: false,
        message: "You've sent several applications recently. Please try again shortly.",
      },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  const job = data.jobSlug ? await getJobBySlug(data.jobSlug) : null;
  if (data.jobSlug && (!job || job.status !== "open")) {
    return NextResponse.json(
      { success: false, message: "That role is no longer open. Please pick another opening." },
      { status: 409 },
    );
  }

  let resumeFilename: string | null = null;
  let resumePath: string | null = null;
  const upload = form.get("resume");
  if (upload instanceof File && upload.size > 0) {
    const stored = await storeUpload(upload, {
      directory: UPLOAD_DIR,
      allowedTypes: RESUME_TYPES,
      allowedExtensions: RESUME_EXTENSIONS,
      maxBytes: RESUME_MAX_BYTES,
      rejectMessage: "Upload a PDF or Word document.",
    });
    if (!stored.ok) {
      return NextResponse.json(
        { success: false, message: stored.message, fieldErrors: { resume: stored.message } },
        { status: 422 },
      );
    }
    resumeFilename = stored.filename;
    resumePath = stored.path;
  }

  let applicationId: number | null = null;
  try {
    applicationId = await insertApplication({
      jobId: job?.id ?? null,
      jobTitle: job?.title ?? "General interest",
      name: data.name,
      email: data.email,
      phone: data.phone,
      cdlClass: data.cdlClass ?? null,
      yearsExperience: data.yearsExperience ?? null,
      linkedin: data.linkedin || null,
      coverLetter: data.coverLetter || null,
      resumeFilename,
      resumePath,
      ipHash,
    });
  } catch (cause) {
    console.error("[apply] could not store application", cause);
    return NextResponse.json({ success: false, message: GENERIC_ERROR }, { status: 502 });
  }

  // The application is already saved, so a mail failure is logged but never
  // shown to the applicant as an error.
  if (mailerConfigured) {
    const sent = await sendFormEmail({
      formLabel: "application",
      reference: `APP-${applicationId}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: `Application: ${job?.title ?? "General interest"}`,
      message: data.coverLetter || "",
      details: {
        role: job?.title ?? "General interest",
        cdlClass: data.cdlClass,
        yearsExperience: data.yearsExperience,
        linkedin: data.linkedin,
        resume: resumeFilename ? `${resumeFilename} (in the admin panel)` : "Not attached",
      },
    });
    if (!sent.ok) console.error("[apply] Resend delivery failed:", sent.reason);
  } else {
    console.warn("[apply] Resend is not configured; application stored only.");
  }

  return NextResponse.json({
    success: true,
    message: "Your application has been submitted successfully.",
  });
}
