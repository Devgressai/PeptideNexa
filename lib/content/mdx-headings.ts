/**
 * Extract h2/h3 headings from an MDX string so we can emit a Table of Contents
 * server-side without parsing the compiled React tree.
 *
 * The ID computation mirrors `github-slugger` (what rehype-slug uses), so the
 * emitted anchors match the in-body anchor IDs added by rehype-slug during
 * MDX compilation.
 */

export type MdxHeading = {
  level: 2 | 3;
  text: string;
  id: string;
};

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    // Strip MDX inline syntax: **bold**, *em*, `code`, [link](url)
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    // Keep letters, numbers, hyphens, spaces; drop the rest.
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function extractMdxHeadings(source: string): MdxHeading[] {
  if (!source) return [];
  const headings: MdxHeading[] = [];
  const seen = new Map<string, number>();

  // Line-based parse. Ignore heading syntax inside fenced code blocks.
  let inFence = false;
  for (const line of source.split("\n")) {
    const fenceMatch = line.match(/^(?:`{3,}|~{3,})/);
    if (fenceMatch) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = line.match(/^(#{2,3})\s+(.+?)\s*$/);
    if (!match) continue;
    const level = (match[1] as string).length as 2 | 3;
    const text = (match[2] as string).trim();
    const base = slugify(text);
    if (!base) continue;

    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    const id = count === 0 ? base : `${base}-${count}`;

    headings.push({ level, text, id });
  }

  return headings;
}
