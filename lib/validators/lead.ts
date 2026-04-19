import { z } from "zod";

export const BudgetTierEnum = z.enum(["UNDER_250", "MID", "HIGH"]);
export type BudgetTierValue = z.infer<typeof BudgetTierEnum>;

export const leadInputSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  name: z.string().min(1).max(120).optional(),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9()+\-.\s]{7,20}$/, "Enter a valid phone number")
    .optional()
    .or(z.literal("")),
  source: z.string().min(1).max(200),
  intentGoalSlug: z.string().max(120).optional(),
  intentPeptideSlug: z.string().max(120).optional(),
  locationState: z
    .string()
    .trim()
    .length(2, "Use the 2-letter state code")
    .toUpperCase()
    .optional()
    .or(z.literal("")),
  onlineOk: z.boolean().default(true),
  budgetTier: BudgetTierEnum.optional(),
  notes: z.string().max(2000).optional(),
  // Honeypot — must be empty. Rejected server-side without signalling.
  company: z.string().max(0).optional().default(""),
  // Simple client-side consent receipt.
  consent: z.literal(true, { errorMap: () => ({ message: "Consent is required" }) }),
});

export type LeadInput = z.infer<typeof leadInputSchema>;
