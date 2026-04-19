"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client. Safe to call from client components. Uses only the
 * public anon key — all access is mediated by Postgres Row Level Security.
 *
 * Do NOT use the service role key here. `SUPABASE_SERVICE_ROLE_KEY` lives in
 * server env only and is consumed by `createSupabaseServiceClient`.
 */
export function createSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      "Supabase browser client requires NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }
  return createBrowserClient(url, anonKey);
}
