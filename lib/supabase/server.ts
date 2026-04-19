import "server-only";
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

/**
 * Server-side Supabase client for use in server components, route handlers,
 * and server actions. Threads the request's cookies through Supabase so SSR
 * auth sessions stay in sync with the browser.
 *
 * Prefer the Prisma client (`lib/db/client.ts`) for arbitrary SQL. This client
 * is for Supabase-specific features: Auth, Storage, Realtime. The two can be
 * used side-by-side on the same Postgres database without conflict.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      "Supabase server client requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }

  return createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options as CookieOptions);
          }
        } catch {
          // `cookies()` in server components only permits reads. Writes from
          // server components silently fail here; route handlers and server
          // actions (which support writes) get the cookie mutation.
        }
      },
    },
  });
}

/**
 * Privileged service-role client — bypasses Row Level Security. NEVER import
 * this from anything that might reach the client bundle. Use for admin jobs,
 * webhooks, and bulk operations only.
 */
export function createSupabaseServiceClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error(
      "Supabase service client requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  // Lazy import to avoid pulling the base client when only SSR is needed.
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createClient } = require("@supabase/supabase-js") as typeof import("@supabase/supabase-js");
  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
