import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refresh the Supabase auth session cookie on every request that reaches
 * middleware. Called from root-level `middleware.ts`. Keeps sessions alive
 * without a round-trip from the browser on every page load.
 */
export async function updateSupabaseSession(request: NextRequest) {
  const response = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return response;

  const supabase = createServerClient(url, anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        for (const { name, value } of cookiesToSet) {
          request.cookies.set(name, value);
        }
        for (const { name, value, options } of cookiesToSet) {
          response.cookies.set(name, value, options);
        }
      },
    },
  });

  // Touch the session to trigger refresh if needed. Result intentionally
  // ignored — this is a side effect.
  await supabase.auth.getUser();

  return response;
}
