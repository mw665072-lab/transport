import { z } from "zod";

/** Upload limits shared by the browser control and the API route. */
export const DOC_MAX_BYTES = 10 * 1024 * 1024;
export const DOC_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/heic"] as const;
export const DOC_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png", ".heic"] as const;
export const DOC_ACCEPT = DOC_EXTENSIONS.join(",");

export const documentSchema = z.object({
  /** Spam trap. Accepted here so an autofilled value cannot block a real
   * customer; the server schema is the one that rejects it. */
  website: z.string().optional(), // honeypot
  reference: z
    .string()
    .trim()
    .min(2, "Enter the load or PO reference")
    .max(60, "Reference is too long"),
  company: z.string().trim().min(2, "Enter your company name").max(120, "Name is too long"),
  contact: z.string().trim().min(2, "Enter a contact name").max(80, "Name is too long"),
  email: z
    .string()
    .trim()
    .min(1, "Enter your email")
    .email("Enter a valid email address")
    .max(160, "Email is too long"),
  phone: z
    .string()
    .trim()
    .max(24, "Phone number is too long")
    .refine((v) => v === "" || /^[+()\d\s.-]{7,}$/.test(v), "Enter a valid phone number")
    .optional()
    .or(z.literal("")),
  note: z
    .string()
    .trim()
    .max(1000, "Keep the note under 1000 characters")
    .optional()
    .or(z.literal("")),
});

export type DocumentValues = z.infer<typeof documentSchema>;

/**
 * What the API validates. The spam signals are carried but never rejected here:
 * the route decides what to do with them, so a filled trap is accepted silently
 * rather than returned as an error a real customer cannot see or fix.
 */
export const documentServerSchema = documentSchema.extend({
  website: z.string().optional(),
  startedAt: z.number().int().optional(),
});

export type DocumentServerValues = z.infer<typeof documentServerSchema>;
