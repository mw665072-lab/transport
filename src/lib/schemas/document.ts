import { z } from "zod";

/** Upload limits shared by the browser control and the API route. */
export const DOC_MAX_BYTES = 10 * 1024 * 1024;
export const DOC_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/heic"] as const;
export const DOC_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png", ".heic"] as const;
export const DOC_ACCEPT = DOC_EXTENSIONS.join(",");

export const documentSchema = z.object({
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
  website: z.string().max(0, "Leave this field empty"),
  startedAt: z.number().int().optional(),
});

export type DocumentValues = z.infer<typeof documentSchema>;
