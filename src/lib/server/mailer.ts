import { Resend } from "resend";
import { COMPANY } from "@/lib/data/company";

/**
 * RESEND_API_KEY and CONTACT_FROM_EMAIL are read on the server only. They are not
 * NEXT_PUBLIC_, so they never reach the browser bundle.
 */
const API_KEY = process.env.RESEND_API_KEY;
const FROM = process.env.CONTACT_FROM_EMAIL;
const TO = process.env.CONTACT_TO_EMAIL ?? COMPANY.email;

export const mailerConfigured = Boolean(API_KEY && FROM);

const escape = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function row(label: string, value: string) {
  return `<tr>
    <td style="padding:8px 16px 8px 0;color:#47617f;font-size:13px;white-space:nowrap;vertical-align:top">${escape(label)}</td>
    <td style="padding:8px 0;color:#081a43;font-size:14px;font-weight:600">${escape(value)}</td>
  </tr>`;
}

const LABELS: Record<string, string> = {
  contact: "New contact request",
  "freight-quote": "New freight quote request",
  "owner-operator": "New owner operator enquiry",
  application: "New job application",
};

/** camelCase field names become readable labels in the detail table. */
function humanise(key: string): string {
  return key.replace(/([a-z0-9])([A-Z])/g, "$1 $2").replace(/^./, (c) => c.toUpperCase());
}

export type FormEmail = {
  formLabel: string;
  reference: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  /** Remaining fields, rendered as a detail table under the message. */
  details?: Record<string, unknown>;
};

/** Generic notification used by every form, so the layout stays consistent. */
export async function sendFormEmail(
  data: FormEmail,
): Promise<{ ok: true } | { ok: false; reason: string }> {
  if (!API_KEY || !FROM) {
    return { ok: false, reason: "RESEND_API_KEY or CONTACT_FROM_EMAIL is not set" };
  }

  const skip = new Set([
    "name",
    "email",
    "phone",
    "fullName",
    "message",
    "notes",
    "coverLetter",
  ]);
  const rows = Object.entries(data.details ?? {})
    .filter(([key, value]) => !skip.has(key) && value !== "" && value != null)
    .map(([key, value]) => row(humanise(key), String(value)))
    .join("");

  const heading = LABELS[data.formLabel] ?? "New website enquiry";

  const html = `<div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#f7f9fc;padding:24px">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden">
      <div style="background:#050f2c;padding:20px 24px">
        <p style="margin:0;color:#ffbe4d;font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase">${escape(heading)}</p>
        <p style="margin:6px 0 0;color:#ffffff;font-size:18px;font-weight:700">${escape(data.subject)}</p>
      </div>
      <div style="padding:24px">
        <table style="width:100%;border-collapse:collapse">
          ${row("Reference", data.reference)}
          ${row("Name", data.name)}
          ${row("Email", data.email)}
          ${data.phone ? row("Phone", data.phone) : ""}
          ${rows}
        </table>
        ${
          data.message
            ? `<p style="margin:20px 0 6px;color:#47617f;font-size:13px">Message</p>
               <div style="white-space:pre-wrap;color:#081a43;font-size:14px;line-height:1.65;background:#f7f9fc;border:1px solid #e2e8f0;border-radius:8px;padding:14px">${escape(data.message)}</div>`
            : ""
        }
      </div>
    </div>
  </div>`;

  const text = [
    `${heading} — ${data.subject}`,
    `Reference: ${data.reference}`,
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    data.phone ? `Phone: ${data.phone}` : null,
    "",
    data.message,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const resend = new Resend(API_KEY);
    const { error } = await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: data.email,
      subject: `[${data.subject}] ${data.name} — ${data.reference}`,
      html,
      text,
    });
    if (error) return { ok: false, reason: error.message };
    return { ok: true };
  } catch (cause) {
    return { ok: false, reason: cause instanceof Error ? cause.message : "unknown" };
  }
}

export type ContactEmail = {
  reference: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
};

export async function sendContactEmail(
  data: ContactEmail,
): Promise<{ ok: true } | { ok: false; reason: string }> {
  if (!API_KEY || !FROM) {
    return { ok: false, reason: "RESEND_API_KEY or CONTACT_FROM_EMAIL is not set" };
  }

  const html = `<div style="font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;background:#f7f9fc;padding:24px">
    <div style="max-width:600px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden">
      <div style="background:#050f2c;padding:20px 24px">
        <p style="margin:0;color:#ffbe4d;font-size:11px;font-weight:700;letter-spacing:.18em;text-transform:uppercase">New contact request</p>
        <p style="margin:6px 0 0;color:#ffffff;font-size:18px;font-weight:700">${escape(data.subject)}</p>
      </div>
      <div style="padding:24px">
        <table style="width:100%;border-collapse:collapse">
          ${row("Reference", data.reference)}
          ${row("Name", data.name)}
          ${row("Email", data.email)}
          ${data.phone ? row("Phone", data.phone) : ""}
        </table>
        <p style="margin:20px 0 6px;color:#47617f;font-size:13px">Message</p>
        <div style="white-space:pre-wrap;color:#081a43;font-size:14px;line-height:1.65;background:#f7f9fc;border:1px solid #e2e8f0;border-radius:8px;padding:14px">${escape(data.message)}</div>
      </div>
    </div>
  </div>`;

  const text = [
    `New contact request — ${data.subject}`,
    `Reference: ${data.reference}`,
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    data.phone ? `Phone: ${data.phone}` : null,
    "",
    data.message,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const resend = new Resend(API_KEY);
    const { error } = await resend.emails.send({
      from: FROM,
      to: TO,
      replyTo: data.email,
      subject: `[${data.subject}] ${data.name} — ${data.reference}`,
      html,
      text,
    });
    if (error) return { ok: false, reason: error.message };
    return { ok: true };
  } catch (cause) {
    return { ok: false, reason: cause instanceof Error ? cause.message : "unknown" };
  }
}
