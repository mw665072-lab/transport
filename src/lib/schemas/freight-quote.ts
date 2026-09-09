import { z } from "zod";
import { US_STATES } from "@/lib/us-states";
import { SERVICES } from "@/lib/data/services";

const today = () => new Date(new Date().setHours(0, 0, 0, 0));

export const freightQuoteSchema = z.object({
  /** Spam trap. Accepted here so an autofilled value cannot block a real
   * customer; the server schema is the one that rejects it. */
  website: z.string().optional(), // honeypot
  pickupCity: z.string().min(2, "Enter the pickup city"),
  pickupState: z.enum(US_STATES),
  deliveryCity: z.string().min(2, "Enter the delivery city"),
  deliveryState: z.enum(US_STATES),
  pickupDate: z
    .string()
    .min(1, "Choose a pickup date")
    .refine(
      (value) => new Date(`${value}T00:00:00`) >= today(),
      "Pickup date cannot be in the past",
    ),
  serviceType: z
    .string()
    .refine((value) => SERVICES.some((service) => service.slug === value), "Choose a service"),
  commodity: z.string().min(2, "Enter the commodity"),
  weightLbs: z.number().positive("Weight must be positive").optional(),
  dimensions: z.string().optional(),
  notes: z.string().max(1000, "Keep notes under 1000 characters").optional(),
  fullName: z.string().min(2, "Enter your name"),
  company: z.string().optional(),
  email: z.string().email("Enter a valid email"),
  phone: z
    .string()
    .trim()
    .regex(/^[+()\d\s.-]{10,}$/, "Enter a valid US phone number")
    .max(24, "Phone number is too long"),
});

export type FreightQuoteValues = z.infer<typeof freightQuoteSchema>;

/**
 * What the API validates. The spam signals are carried but never rejected here:
 * the route decides what to do with them, so a filled trap is accepted silently
 * rather than returned as an error a real customer cannot see or fix.
 */
export const freightQuoteServerSchema = freightQuoteSchema.extend({
  website: z.string().optional(),
  startedAt: z.number().int().optional(),
});

export type FreightQuoteServerValues = z.infer<typeof freightQuoteServerSchema>;
