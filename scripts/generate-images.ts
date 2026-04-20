/**
 * Generate brand imagery via the Google Gemini API.
 *
 * Usage:
 *   pnpm tsx scripts/generate-images.ts                  # generate all missing
 *   pnpm tsx scripts/generate-images.ts --force          # regenerate everything
 *   pnpm tsx scripts/generate-images.ts hero category-*  # selective targets
 *
 * Reads GOOGLE_AI_API_KEY from .env. Writes PNGs into public/generated/.
 * Designed for Gemini 2.5 image-capable models (`gemini-2.5-flash-image`) via
 * the generateContent REST endpoint, which works with an API key (no Vertex
 * service account required).
 */

import { writeFile, mkdir, access } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";

type Target = {
  id: string;
  file: string; // path relative to public/
  prompt: string;
};

const OUT_DIR = join(process.cwd(), "public", "generated");

// Editorial, restrained, matches PeptideNexa's palette. We bias every prompt
// toward "photographic but abstract" — no cartoon vibes, no stock-photo
// smiling-lab-coat people.
const TARGETS: Target[] = [
  {
    id: "hero",
    file: "generated/hero-molecular.png",
    prompt:
      "Editorial minimalist abstract visualization of peptide molecular structures. Soft warm off-white background (#FAF8F5). A single elegant 3D molecular chain rendering with amino acid residues, rendered in deep forest green (#0F5E4A) and soft ink tones. Extreme depth of field, soft lighting, Quanta Magazine science editorial style. Sophisticated, calm, expensive-looking. No text, no people, no logos. Wide cinematic composition with generous negative space.",
  },
  {
    id: "category-healing",
    file: "generated/cat-healing.png",
    prompt:
      "Editorial abstract macro photograph representing tissue healing and repair. Warm off-white background (#FAF8F5). Flowing organic filaments suggesting collagen or peptide strands, deep forest green accents. Soft natural lighting, extreme shallow depth of field. Scientific magazine aesthetic, calm, premium. No text, no people.",
  },
  {
    id: "category-ghs",
    file: "generated/cat-ghs.png",
    prompt:
      "Editorial abstract visualization of growth hormone signaling cascade. Minimalist, restrained, warm off-white background. Crystalline molecular ribbons with gentle green and ink tones. Shallow depth of field, soft diffused light. Scientific editorial aesthetic. No text, no people.",
  },
  {
    id: "category-metabolic",
    file: "generated/cat-metabolic.png",
    prompt:
      "Editorial abstract macro of flowing glucose or fatty-acid molecular structures. Soft warm off-white background. Delicate molecular chains in deep green and ink tones. Scientific editorial magazine style, calm, premium. No text, no people, no logos.",
  },
  {
    id: "category-cognitive",
    file: "generated/cat-cognitive.png",
    prompt:
      "Editorial abstract macro of neural dendrite tree. Warm off-white background. Delicate branching structures in ink and subtle green accents. Scientific editorial magazine style, shallow depth of field, restrained lighting. No text, no people.",
  },
  {
    id: "category-longevity",
    file: "generated/cat-longevity.png",
    prompt:
      "Editorial abstract visualization of telomere ends on chromosomes. Minimalist, warm off-white background. Soft molecular structures in ink and deep forest green. Scientific editorial magazine style. Shallow depth of field, diffused light. No text, no people.",
  },
  {
    id: "category-immune",
    file: "generated/cat-immune.png",
    prompt:
      "Editorial abstract macro of immune cell surface receptors. Warm off-white background. Molecular structures in soft ink and forest green tones. Scientific editorial magazine aesthetic. Calm, premium, restrained. No text, no people.",
  },
  {
    id: "editorial-spotlight",
    file: "generated/editorial-spotlight.png",
    prompt:
      "Editorial scientific still life: a single open research notebook on a warm off-white marble surface, beside a glass lab flask with subtle green liquid. Soft natural window light, Quanta Magazine aesthetic. Shallow depth of field, sophisticated composition. No text visible on the notebook. Warm neutrals with a single forest-green accent.",
  },
  {
    id: "trust-research",
    file: "generated/trust-research.png",
    prompt:
      "Editorial abstract macro of an open peer-reviewed research page, extremely shallow depth of field, warm neutral tones, single pages softly out of focus. Premium publishing aesthetic. No readable text, no people, warm off-white and ink.",
  },
];

async function loadEnv(): Promise<string> {
  // Minimal .env parser — we avoid pulling dotenv just for this script.
  try {
    const raw = readFileSync(join(process.cwd(), ".env"), "utf8");
    for (const line of raw.split("\n")) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (match) {
        const [, key, rawValue] = match;
        const value = rawValue!.replace(/^["']|["']$/g, "");
        if (!process.env[key!]) process.env[key!] = value;
      }
    }
  } catch {
    // no .env — try real env
  }
  const key = process.env.GOOGLE_AI_API_KEY;
  if (!key) {
    throw new Error(
      "GOOGLE_AI_API_KEY is not set. Add it to .env (gitignored) before running this script.",
    );
  }
  return key;
}

async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
        inlineData?: { mimeType: string; data: string };
      }>;
    };
  }>;
  error?: { message?: string };
};

async function generate(target: Target, apiKey: string): Promise<Buffer> {
  const models = [
    "gemini-2.5-flash-image",
    "gemini-2.5-flash-image-preview",
    "gemini-2.0-flash-exp-image-generation",
  ];

  let lastError = "";
  for (const model of models) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: target.prompt }] }],
        generationConfig: { responseModalities: ["IMAGE", "TEXT"] },
      }),
    });
    if (!res.ok) {
      lastError = `${model}: HTTP ${res.status} ${await res.text().catch(() => "")}`;
      continue;
    }
    const json = (await res.json()) as GeminiResponse;
    const parts = json.candidates?.[0]?.content?.parts ?? [];
    const inline = parts.find((p) => p.inlineData?.mimeType?.startsWith("image/"));
    if (inline?.inlineData?.data) {
      return Buffer.from(inline.inlineData.data, "base64");
    }
    lastError = `${model}: no image in response`;
  }
  throw new Error(`All image models failed for ${target.id}. Last: ${lastError}`);
}

async function run() {
  const args = process.argv.slice(2);
  const force = args.includes("--force");
  const filters = args.filter((a) => !a.startsWith("--"));

  const apiKey = await loadEnv();
  await mkdir(OUT_DIR, { recursive: true });

  const selected = filters.length
    ? TARGETS.filter((t) =>
        filters.some((f) => t.id === f || (f.endsWith("*") && t.id.startsWith(f.slice(0, -1)))),
      )
    : TARGETS;

  for (const target of selected) {
    const path = join(process.cwd(), "public", target.file);
    if (!force && (await exists(path))) {
      console.log(`✓ skip  ${target.id} (exists)`);
      continue;
    }
    await mkdir(dirname(path), { recursive: true });
    try {
      process.stdout.write(`• gen   ${target.id} ... `);
      const bytes = await generate(target, apiKey);
      await writeFile(path, bytes);
      console.log(`${(bytes.length / 1024).toFixed(0)} kB`);
    } catch (err) {
      console.log(`FAILED`);
      console.error(`  ${err instanceof Error ? err.message : String(err)}`);
    }
  }
  console.log("✅ done");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
