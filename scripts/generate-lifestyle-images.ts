/**
 * Generate editorial lifestyle + cinematic hero imagery for PeptideNexa.
 *
 * Separate from generate-images.ts so we can iterate on the "alive / warm
 * photography" batch without regenerating the abstract library.
 */

import { writeFile, mkdir, access } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";

type Target = { id: string; file: string; prompt: string };

const OUT_DIR = join(process.cwd(), "public", "generated");

const TARGETS: Target[] = [
  {
    id: "hero-cinematic",
    file: "generated/hero-cinematic.png",
    prompt:
      "Cinematic editorial photograph. A single scientist's hand (close-up macro, partial view, no face) holding a small clear glass vial in warm natural window light. Background is softly out of focus — a wood desk, scientific notebooks, brass reading lamp. Shallow depth of field, extreme bokeh. Mayo Clinic editorial commercial photography aesthetic. Warm earth tones, off-white, gold highlights, a single forest-green accent. Wide 16:9 composition, professional premium feel. No text, no logos.",
  },
  {
    id: "researcher-desk",
    file: "generated/lifestyle-researcher.png",
    prompt:
      "Editorial photograph of an open leather notebook with handwritten equations and molecular diagrams, fountain pen resting on top, warm morning light through a window, shallow depth of field, a glass of water and an open medical journal blurred in background. Warm off-white and ink tones. Kinfolk magazine aesthetic. Premium, contemplative. No readable text. No people visible.",
  },
  {
    id: "clinic-consult",
    file: "generated/lifestyle-consult.png",
    prompt:
      "Editorial lifestyle photograph of two hands across a polished wood table — a patient's hand holding a pen over a form, a clinician's hand gesturing with open palm. No faces visible. Soft natural window light, warm off-white backdrop, shallow depth of field. Conveys trust and professional care without being clinical or sterile. Magazine editorial photography. Warm neutral palette.",
  },
  {
    id: "wellness-morning",
    file: "generated/lifestyle-wellness.png",
    prompt:
      "Editorial photograph of someone stretching in warm morning light, silhouette / back view only, soft focus. A single figure by a large window in a minimal bedroom — wood floor, linen curtains. Warm amber and off-white tones with deep ink shadows. Premium magazine lifestyle photography, Kinfolk / Cereal Magazine aesthetic. Conveys recovery, restoration, longevity.",
  },
  {
    id: "research-glass",
    file: "generated/lifestyle-glassware.png",
    prompt:
      "Macro editorial photograph of scientific glassware — a single round-bottom flask with a faint amber liquid, backlit by warm natural light against a soft off-white background. Condensation on glass. Extreme shallow depth of field. Editorial product photography at premium magazine quality. No text, no logos.",
  },
  {
    id: "library-editorial",
    file: "generated/lifestyle-library.png",
    prompt:
      "Editorial photograph looking down a corridor of dark wood bookshelves stacked with old medical journals, warm amber reading lamp glow, a single open book on a reading table in the foreground, extreme depth. Architectural library aesthetic — Oxford / medical academy feel. Warm amber, deep ink, restrained. Premium, intellectual. No people, no readable text.",
  },
  {
    id: "walk-outdoor",
    file: "generated/lifestyle-walk.png",
    prompt:
      "Editorial photograph of a person walking outdoors at sunrise through a meadow or park path — back view only, soft focus silhouette, warm golden hour light. Long cinematic aspect. Magazine lifestyle photography aesthetic (Monocle / Cereal). Warm amber, soft greens, pale sky. Conveys healthspan and quiet vitality. No face visible.",
  },
];

async function loadEnv() {
  try {
    const raw = readFileSync(join(process.cwd(), ".env"), "utf8");
    for (const line of raw.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) {
        const [, k, v] = m;
        if (!process.env[k!]) process.env[k!] = v!.replace(/^["']|["']$/g, "");
      }
    }
  } catch {}
  const key = process.env.GOOGLE_AI_API_KEY;
  if (!key) throw new Error("GOOGLE_AI_API_KEY missing.");
  return key;
}

async function exists(p: string) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

type GeminiResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }>;
    };
  }>;
};

async function generate(target: Target, apiKey: string) {
  const models = [
    "gemini-2.5-flash-image",
    "gemini-2.5-flash-image-preview",
    "gemini-2.0-flash-exp-image-generation",
  ];
  let lastErr = "";
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
      lastErr = `${model}: ${res.status} ${(await res.text().catch(() => "")).slice(0, 200)}`;
      continue;
    }
    const json = (await res.json()) as GeminiResponse;
    const parts = json.candidates?.[0]?.content?.parts ?? [];
    const inline = parts.find((p) => p.inlineData?.mimeType?.startsWith("image/"));
    if (inline?.inlineData?.data) {
      return Buffer.from(inline.inlineData.data, "base64");
    }
    lastErr = `${model}: no image in response`;
  }
  throw new Error(lastErr);
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

  for (const t of selected) {
    const path = join(process.cwd(), "public", t.file);
    if (!force && (await exists(path))) {
      console.log(`✓ skip  ${t.id}`);
      continue;
    }
    await mkdir(dirname(path), { recursive: true });
    try {
      process.stdout.write(`• gen   ${t.id} ... `);
      const bytes = await generate(t, apiKey);
      await writeFile(path, bytes);
      console.log(`${(bytes.length / 1024).toFixed(0)} kB`);
    } catch (err) {
      console.log("FAILED");
      console.error(`  ${err instanceof Error ? err.message : String(err)}`);
    }
  }
  console.log("✅ done");
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
