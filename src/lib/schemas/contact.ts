import { z } from "zod";

export const CONTACT_SUBJECTS = [
  "New Shipment",
  "Existing Load",
  "Partnership",
  "Careers",
  "Other",
] as const;

/**
 * Shared by the browser form and the API route, so the rules cannot drift apart.
 * `website` is a honeypot and `startedAt` is a time trap: both must look untouched
 * by a human for the submission to be accepted.
 */
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(80, "Name is too long"),
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
  subject: z.enum(CONTACT_SUBJECTS),
  message: z
    .string()
    .trim()
    .min(10, "Please add a little more detail")
    .max(2000, "Message must be under 2000 characters"),
  website: z.string().max(0, "Leave this field empty"),
  startedAt: z.number().int().optional(),
});

export type ContactValues = z.infer<typeof contactSchema>;
