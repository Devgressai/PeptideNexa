import type { NextRequest } from "next/server";
import { updateSupabaseSession } from "@/lib/supabase/middleware";

// Skip middleware for static assets and anything the OG/icon routes serve.
// Everything else passes through Supabase session refresh.
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon|og|\\.well-known|robots\\.txt|sitemap\\.xml|.*\\.(?:png|jpg|jpeg|svg|webp|avif)$).*)",
  ],
};

export async function middleware(request: NextRequest) {
  return updateSupabaseSession(request);
}
