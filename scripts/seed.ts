/**
 * Minimal dev seed. Populates a handful of categories, peptides, and providers
 * so the shell pages render real data once DB is wired.
 *
 * Usage: pnpm db:seed (after `pnpm db:push`)
 */

import { PrismaClient, ProviderStatus, ProviderType, ContentStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const healing = await prisma.category.upsert({
    where: { slug: "healing-repair" },
    update: {},
    create: { slug: "healing-repair", name: "Healing & repair" },
  });
  const ghs = await prisma.category.upsert({
    where: { slug: "ghs" },
    update: {},
    create: { slug: "ghs", name: "Growth hormone secretagogues" },
  });

  const recovery = await prisma.goal.upsert({
    where: { slug: "recovery" },
    update: {},
    create: { slug: "recovery", name: "Recovery" },
  });

  const bpcBody = [
    "BPC-157 is a synthetic peptide derived from a protein fragment found in gastric juice. Most public research on it sits in the preclinical literature — animal and cell studies — with limited human trial data.",
    "",
    "<Callout tone=\"info\" title=\"What this page covers\">",
    "  A structured summary of what public research reports about BPC-157, the forms it is typically discussed in, and the providers known to work with it.",
    "</Callout>",
    "",
    "## Mechanism summary",
    "",
    "Preclinical research has explored BPC-157's role in angiogenesis, fibroblast activity, and interactions with the nitric-oxide system. These mechanisms are often cited in discussions of tissue repair, though human confirmation is limited.",
    "",
    "## Forms commonly discussed",
    "",
    "BPC-157 appears in the literature and in provider conversations in two common forms:",
    "",
    "- **Injectable** — subcutaneous injection near the area of interest.",
    "- **Oral** — capsule or liquid; bioavailability is an active research question.",
    "",
    "## What the research does not show",
    "",
    "We found no FDA-approved indication for BPC-157 and no large, randomized human trials demonstrating efficacy for any condition. Anyone framing it otherwise is moving ahead of the evidence.",
    "",
    "<DisclaimerBanner />",
  ].join("\n");

  await prisma.peptide.upsert({
    where: { slug: "bpc-157" },
    update: { bodyMdx: bpcBody },
    create: {
      slug: "bpc-157",
      name: "BPC-157",
      aliases: ["Body Protection Compound 157"],
      categoryId: healing.id,
      goals: { connect: [{ id: recovery.id }] },
      summary:
        "A synthetic peptide frequently discussed in tissue-repair research contexts. Most data comes from preclinical studies.",
      bodyMdx: bpcBody,
      researchLevel: 3,
      commonForms: ["Injectable", "Oral"],
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date(),
    },
  });

  await prisma.peptide.upsert({
    where: { slug: "ipamorelin" },
    update: {},
    create: {
      slug: "ipamorelin",
      name: "Ipamorelin",
      categoryId: ghs.id,
      summary:
        "A selective growth hormone secretagogue studied for its pulsatile release profile and short half-life.",
      researchLevel: 3,
      commonForms: ["Injectable"],
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date(),
    },
  });

  await prisma.provider.upsert({
    where: { slug: "example-online-provider" },
    update: {},
    create: {
      slug: "example-online-provider",
      name: "Example Telehealth",
      type: ProviderType.ONLINE,
      status: ProviderStatus.FEATURED,
      verified: true,
      websiteUrl: "https://example.com",
      servesStates: ["TX", "CA", "NY", "FL"],
      shortDescription:
        "Licensed telehealth platform serving peptide-adjacent research consultations in multiple states.",
      lastVerifiedAt: new Date(),
    },
  });

  console.log("✅ seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
