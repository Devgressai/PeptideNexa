// Server-only env. Import from server code only (route handlers, server
// actions, Prisma singleton). Importing this from a client component will
// leak secrets into the client bundle — Next.js enforces the `server-only`
// contract below.

import "server-only";
import { z } from "zod";

const serverSchema = z.object({
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url().optional(),
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().default("PeptideNexa <hello@peptidenexa.com>"),
  EMAIL_LEAD_INBOX: z.string().email().optional(),
  AUTH_SECRET: z.string().min(16).optional(),
  AUTH_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  MEILI_HOST: z.string().url().optional(),
  MEILI_API_KEY: z.string().optional(),
  SENTRY_DSN: z.string().optional(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

const parsed = serverSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid server environment", parsed.error.flatten().fieldErrors);
  throw new Error("Invalid server environment. See logs.");
}

export const serverEnv = parsed.data;
