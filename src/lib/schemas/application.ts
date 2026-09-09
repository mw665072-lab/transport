import { z } from "zod";

export const CDL_CLASSES = ["Class A", "Class B", "Class C", "None"] as const;

/** Resume upload limits, shared by the browser control and the API route. */
export const RESUME_MAX_BYTES = 5 * 1024 * 1024;
export const RESUME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
] as const;
export const RESUME_EXTENSIONS = [".pdf", ".doc", ".docx"] as const;
export const RESUME_ACCEPT = RESUME_EXTENSIONS.join(",");

export const applicationSchema = z.object({
  jobSlug: z.string().trim().max(120).optional().or(z.literal("")),
  name: z.string().trim().min(2, "Enter your full name").max(80, "Name is too long"),
  email: z
    .string()
    .trim()
    .min(1, "Enter your email")
    .email("Enter a valid email address")
    .max(160, "Email is too long"),
  phone: z
    .string()
    .trim()
    .min(7, "Enter a phone number we can reach you on")
    .max(24, "Phone number is too long")
    .regex(/^[+()\d\s.-]+$/, "Enter a valid phone number"),
  cdlClass: z.enum(CDL_CLASSES).optional(),
  yearsExperience: z
    .number({ message: "Enter your years of experience" })
    .int("Enter a whole number")
    .min(0, "Cannot be negative")
    .max(60, "Enter a realistic number of years")
    .optional(),
  linkedin: z
    .string()
    .trim()
    .max(200, "Link is too long")
    .refine(
      (v) => v === "" || /^https?:\/\/.+\..+/.test(v),
      "Enter a full URL starting with https://",
    )
    .optional()
    .or(z.literal("")),
  coverLetter: z
    .string()
    .trim()
    .max(3000, "Please keep this under 3000 characters")
    .optional()
    .or(z.literal("")),
  website: z.string().max(0, "Leave this field empty"),
  startedAt: z.number().int().optional(),
});

export type ApplicationValues = z.infer<typeof applicationSchema>;

/** Human-readable size, used in the upload control and error messages. */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
