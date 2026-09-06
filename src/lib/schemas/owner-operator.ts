import { z } from "zod";

export const ownerOperatorSchema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().min(10, "Enter a valid phone number"),
  cdlClass: z.enum(["Class A", "Class B", "None"]),
  yearsExperience: z.number().min(0).max(50),
  equipmentType: z.enum(["Cargo Van", "Sprinter Van", "Box Truck", "Hotshot Trailer"]),
  mcNumber: z.string().optional(),
  preferredLanes: z.string().optional(),
  availability: z.enum(["Immediately", "Within 2 weeks", "Within a month"]),
  website: z.string().max(0, "Leave this field empty"),
});

export type OwnerOperatorValues = z.infer<typeof ownerOperatorSchema>;
