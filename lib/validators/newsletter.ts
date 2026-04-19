import { z } from "zod";

export const newsletterInputSchema = z.object({
  email: z.string().email(),
  source: z.string().max(200).default("unknown"),
  company: z.string().max(0).optional().default(""),
});

export type NewsletterInput = z.infer<typeof newsletterInputSchema>;
