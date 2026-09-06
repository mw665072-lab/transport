import { z } from "zod";
export const contactSchema = z.object({ name: z.string().min(2, "Enter your name"), email: z.string().email("Enter a valid email"), phone: z.string().optional(), subject: z.enum(["New Shipment","Existing Load","Partnership","Careers","Other"]), message: z.string().min(10, "Tell us how we can help").max(1000), website: z.string().max(0) });
export type ContactValues = z.infer<typeof contactSchema>;
