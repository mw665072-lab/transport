import { z } from "zod";

export const CDL_CLASSES = ["Class A", "Class B", "None"] as const;
export const EQUIPMENT_TYPES = [
  "Cargo Van",
  "Sprinter Van",
  "Box Truck",
  "Hotshot Trailer",
] as const;
export const AVAILABILITY = ["Immediately", "Within 2 weeks", "Within a month"] as const;

/**
 * Shared by the browser form and the API route, so the rules cannot drift apart.
 * `website` is a honeypot and `startedAt` is a time trap.
 */
export const ownerOperatorSchema = z.object({
  fullName: z.string().trim().min(2, "Enter your full name").max(80, "Name is too long"),
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
  cdlClass: z.enum(CDL_CLASSES),
  yearsExperience: z
    .number({ message: "Enter your years of experience" })
    .int("Enter a whole number")
    .min(0, "Cannot be negative")
    .max(60, "Enter a realistic number of years"),
  equipmentType: z.enum(EQUIPMENT_TYPES),
  mcNumber: z.string().trim().max(30, "MC number is too long").optional().or(z.literal("")),
  preferredLanes: z
    .string()
    .trim()
    .max(300, "Keep preferred lanes under 300 characters")
    .optional()
    .or(z.literal("")),
  availability: z.enum(AVAILABILITY),
  website: z.string().max(0, "Leave this field empty"),
  startedAt: z.number().int().optional(),
});

export type OwnerOperatorValues = z.infer<typeof ownerOperatorSchema>;
