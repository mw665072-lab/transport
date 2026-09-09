import { NextResponse } from "next/server";
import {
  documentServerSchema,
  DOC_EXTENSIONS,
  DOC_MAX_BYTES,
  DOC_TYPES,
} from "@/lib/schemas/document";
import { checkRateLimit } from "@/lib/server/rate-limit";
import { insertDocument } from "@/lib/server/db";
import { storeUpload } from "@/lib/server/uploads";
import { clientIp, hashIp, reference as makeReference } from "@/lib/server/form-intake";
import { mailerConfigured, sendFormEmail } from "@/lib/server/mailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MIN_FILL_MS = 2500;
const UPLOAD_DIR = process.env.DOCUMENT_UPLOAD_DIR ?? "./data/documents";

const GENERIC_ERROR =
  "Something went wrong while uploading your document. Please try again, or email it to dispatch.";

export async function POST(request: Request) {
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ success: false, message: GENERIC_ERROR }, { status: 400 });
  }

  const parsed = documentServerSchema.safeParse({
    reference: String(form.get("reference") ?? ""),
    company: String(form.get("company") ?? ""),
    contact: String(form.get("contact") ?? ""),
    email: String(form.get("email") ?? ""),
    phone: String(form.get("phone") ?? ""),
    note: String(form.get("note") ?? ""),
    website: String(form.get("website") ?? ""),
    startedAt: form.get("startedAt") ? Number(form.get("startedAt")) : undefined,
  });

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
  const limit = checkRateLimit(`documents:${ipHash}`);
  if (!limit.allowed) {
    return NextResponse.json(
      {
        success: false,
        message: "You've uploaded several documents recently. Please try again shortly.",
      },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  const upload = form.get("document");
  if (!(upload instanceof File) || upload.size === 0) {
    const message = "Attach the document you want to send.";
    return NextResponse.json(
      { success: false, message, fieldErrors: { document: message } },
      { status: 422 },
    );
  }

  const stored = await storeUpload(upload, {
    directory: UPLOAD_DIR,
    allowedTypes: DOC_TYPES,
    allowedExtensions: DOC_EXTENSIONS,
    maxBytes: DOC_MAX_BYTES,
    rejectMessage: "Upload a PDF or a photo of the document.",
  });
  if (!stored.ok) {
    return NextResponse.json(
      { success: false, message: stored.message, fieldErrors: { document: stored.message } },
      { status: 422 },
    );
  }

  try {
    await insertDocument({
      kind: "bol",
      reference: data.reference,
      company: data.company,
      contact: data.contact,
      email: data.email,
      phone: data.phone || "",
      note: data.note || "",
      filename: stored.filename,
      path: stored.path,
      ipHash,
    });
  } catch (cause) {
    console.error("[documents] could not store record", cause);
    return NextResponse.json({ success: false, message: GENERIC_ERROR }, { status: 502 });
  }

  if (mailerConfigured) {
    const sent = await sendFormEmail({
      formLabel: "document",
      reference: makeReference(),
      name: data.contact,
      email: data.email,
      phone: data.phone || undefined,
      subject: `Document received: ${data.reference}`,
      message: data.note || "",
      details: {
        loadReference: data.reference,
        company: data.company,
        file: `${stored.filename} (in the admin panel)`,
      },
    });
    if (!sent.ok) console.error("[documents] Resend delivery failed:", sent.reason);
  }

  return NextResponse.json({
    success: true,
    message: "Your document has been received.",
  });
}
