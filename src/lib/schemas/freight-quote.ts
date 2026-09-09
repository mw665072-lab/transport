import { z } from "zod";
import { US_STATES } from "@/lib/us-states";
import { SERVICES } from "@/lib/data/services";

const today = () => new Date(new Date().setHours(0, 0, 0, 0));

export const freightQuoteSchema = z.object({
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
  website: z.string().max(0, "Leave this field empty"),
  startedAt: z.number().int().optional(),
});

export type FreightQuoteValues = z.infer<typeof freightQuoteSchema>;
