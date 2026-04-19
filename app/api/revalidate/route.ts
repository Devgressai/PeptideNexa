import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const revalidateInputSchema = z.object({
  paths: z.array(z.string().startsWith("/")).max(50).default([]),
  tags: z.array(z.string().min(1).max(100)).max(50).default([]),
});

/**
 * On-demand revalidation.
 *
 * Called by the admin publish workflow to invalidate specific paths (and,
 * once we adopt tag-based caching in loaders, specific tags) after a content
 * change. Authentication is via a shared secret header — the admin app holds
 * it as `REVALIDATE_TOKEN`, and the handler rejects anything without a match.
 *
 * Until the admin ships, this endpoint stays authenticated but inert in the
 * sense that nothing calls it in production.
 */
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_TOKEN;
  const auth = request.headers.get("x-revalidate-token");

  if (!secret) {
    logger.warn("revalidate.not_configured", {});
    return NextResponse.json({ error: "Not configured." }, { status: 503 });
  }
  if (auth !== secret) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
  }

  const parsed = revalidateInputSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input." }, { status: 422 });
  }

  for (const path of parsed.data.paths) {
    revalidatePath(path);
  }
  for (const tag of parsed.data.tags) {
    revalidateTag(tag);
  }

  logger.info("revalidate.ok", {
    paths: parsed.data.paths.length,
    tags: parsed.data.tags.length,
  });

  return NextResponse.json({
    ok: true,
    revalidated: { paths: parsed.data.paths, tags: parsed.data.tags },
  });
}
