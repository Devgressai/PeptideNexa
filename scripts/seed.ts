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

  const editorial = await prisma.author.upsert({
    where: { slug: "editorial" },
    update: {},
    create: {
      slug: "editorial",
      name: "PeptideNexa Editorial",
      credentials: "Staff",
      bio: "The in-house editorial team at PeptideNexa.",
    },
  });

  const articleBody = [
    "Peptide research is having a moment, and most of what gets shared online is either hype or fear.",
    "",
    "<Callout tone=\"info\" title=\"How to read the rest of this guide\">",
    "  We summarize the public literature, cite primary sources where they exist, and mark anything speculative as such.",
    "</Callout>",
    "",
    "## Start with the mechanism",
    "",
    "When evaluating any peptide, the first question is mechanism. What does it do at the receptor level, and which tissues express those receptors? Mechanism tells you what questions to ask — of the research and of the provider.",
    "",
    "## Evaluate the evidence ladder",
    "",
    "- In vitro studies answer *can this happen at all*.",
    "- Animal studies answer *does it happen in a living system*.",
    "- Human trials answer *does it help real people, at doses a clinician would use*.",
    "",
    "Most peptides sold online live in the first two rungs. That doesn't mean they're useless — it means the confidence interval is wide.",
    "",
    "## Evaluating a provider",
    "",
    "A credible provider will:",
    "",
    "1. Explain what the research does and does not support.",
    "2. Discuss compounding pharmacy sourcing and sterility.",
    "3. Insist on follow-up, not just a one-shot prescription.",
    "",
    "<DisclaimerBanner />",
  ].join("\n");

  await prisma.article.upsert({
    where: { slug: "calm-guide-to-peptide-research" },
    update: { bodyMdx: articleBody },
    create: {
      slug: "calm-guide-to-peptide-research",
      title: "A calm guide to peptide research",
      excerpt:
        "How to read public peptide research without getting hype-pilled — and what to look for when evaluating a provider.",
      bodyMdx: articleBody,
      authorId: editorial.id,
      status: ContentStatus.PUBLISHED,
      publishedAt: new Date(),
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
