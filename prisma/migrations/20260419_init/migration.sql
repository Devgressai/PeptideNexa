-- CreateEnum
CREATE TYPE "ProviderType" AS ENUM ('ONLINE', 'CLINIC', 'COMPOUNDING');

-- CreateEnum
CREATE TYPE "ProviderStatus" AS ENUM ('DRAFT', 'LISTED', 'FEATURED', 'PAUSED');

-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'REVIEW', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "PriceTier" AS ENUM ('ECONOMY', 'STANDARD', 'PREMIUM');

-- CreateEnum
CREATE TYPE "BudgetTier" AS ENUM ('UNDER_250', 'MID', 'HIGH');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'ROUTED', 'ACCEPTED', 'REJECTED', 'CONVERTED', 'LOST');

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Goal" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Goal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Peptide" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "aliases" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "categoryId" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "bodyMdx" TEXT NOT NULL DEFAULT '',
    "researchLevel" INTEGER NOT NULL DEFAULT 0,
    "commonForms" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "authorId" TEXT,
    "reviewerId" TEXT,
    "lastReviewedAt" TIMESTAMP(3),
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Peptide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Provider" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ProviderType" NOT NULL,
    "status" "ProviderStatus" NOT NULL DEFAULT 'DRAFT',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "websiteUrl" TEXT NOT NULL,
    "affiliateUrl" TEXT,
    "addressLine1" TEXT,
    "city" TEXT,
    "state" TEXT,
    "postalCode" TEXT,
    "country" TEXT NOT NULL DEFAULT 'US',
    "servesStates" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "shortDescription" TEXT NOT NULL,
    "bodyMdx" TEXT,
    "priceTier" "PriceTier",
    "licensing" TEXT,
    "editorialNote" TEXT,
    "lastVerifiedAt" TIMESTAMP(3),
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "planId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Provider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderPeptide" (
    "providerId" TEXT NOT NULL,
    "peptideId" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "ProviderPeptide_pkey" PRIMARY KEY ("providerId","peptideId")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProviderContact" (
    "id" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,

    CONSTRAINT "ProviderContact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comparison" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "peptideAId" TEXT NOT NULL,
    "peptideBId" TEXT NOT NULL,
    "bodyMdx" TEXT NOT NULL DEFAULT '',
    "matrixJson" JSONB NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comparison_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Protocol" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "goalId" TEXT,
    "summary" TEXT NOT NULL,
    "bodyMdx" TEXT NOT NULL DEFAULT '',
    "disclaimer" TEXT NOT NULL,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Protocol_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Article" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "bodyMdx" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3),
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Author" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "credentials" TEXT,
    "bio" TEXT,
    "photoUrl" TEXT,

    CONSTRAINT "Author_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Faq" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "peptideId" TEXT,
    "comparisonId" TEXT,
    "locationId" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Faq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Source" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "publisher" TEXT,
    "year" INTEGER,
    "peptideId" TEXT,
    "protocolId" TEXT,

    CONSTRAINT "Source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'US',
    "intro" TEXT NOT NULL,
    "bodyMdx" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" TEXT NOT NULL,
    "intentGoalSlug" TEXT,
    "intentPeptideSlug" TEXT,
    "locationState" TEXT,
    "onlineOk" BOOLEAN NOT NULL DEFAULT true,
    "budgetTier" "BudgetTier",
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "name" TEXT,
    "notes" TEXT,
    "matchedProviderIds" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "routedProviderId" TEXT,
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadEvent" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "priceMonthly" INTEGER NOT NULL,
    "features" JSONB NOT NULL,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Redirect" (
    "id" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "code" INTEGER NOT NULL DEFAULT 301,

    CONSTRAINT "Redirect_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InternalLink" (
    "id" TEXT NOT NULL,
    "fromSlug" TEXT NOT NULL,
    "toSlug" TEXT NOT NULL,
    "anchor" TEXT NOT NULL,
    "weight" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "InternalLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PeptideGoals" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PeptideRelated" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProtocolPeptides" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ProviderServices" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ArticleTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ArticlePeptides" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Goal_slug_key" ON "Goal"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_slug_key" ON "Tag"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Peptide_slug_key" ON "Peptide"("slug");

-- CreateIndex
CREATE INDEX "Peptide_categoryId_status_idx" ON "Peptide"("categoryId", "status");

-- CreateIndex
CREATE INDEX "Peptide_status_publishedAt_idx" ON "Peptide"("status", "publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Provider_slug_key" ON "Provider"("slug");

-- CreateIndex
CREATE INDEX "Provider_status_type_idx" ON "Provider"("status", "type");

-- CreateIndex
CREATE INDEX "Provider_state_status_idx" ON "Provider"("state", "status");

-- CreateIndex
CREATE INDEX "ProviderPeptide_peptideId_idx" ON "ProviderPeptide"("peptideId");

-- CreateIndex
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Comparison_slug_key" ON "Comparison"("slug");

-- CreateIndex
CREATE INDEX "Comparison_status_idx" ON "Comparison"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Protocol_slug_key" ON "Protocol"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Article_slug_key" ON "Article"("slug");

-- CreateIndex
CREATE INDEX "Article_status_publishedAt_idx" ON "Article"("status", "publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Author_slug_key" ON "Author"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Location_slug_key" ON "Location"("slug");

-- CreateIndex
CREATE INDEX "Location_state_idx" ON "Location"("state");

-- CreateIndex
CREATE INDEX "Lead_status_createdAt_idx" ON "Lead"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Lead_email_idx" ON "Lead"("email");

-- CreateIndex
CREATE INDEX "LeadEvent_leadId_createdAt_idx" ON "LeadEvent"("leadId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Plan_slug_key" ON "Plan"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Redirect_from_key" ON "Redirect"("from");

-- CreateIndex
CREATE INDEX "InternalLink_fromSlug_idx" ON "InternalLink"("fromSlug");

-- CreateIndex
CREATE INDEX "InternalLink_toSlug_idx" ON "InternalLink"("toSlug");

-- CreateIndex
CREATE UNIQUE INDEX "InternalLink_fromSlug_toSlug_anchor_key" ON "InternalLink"("fromSlug", "toSlug", "anchor");

-- CreateIndex
CREATE UNIQUE INDEX "_PeptideGoals_AB_unique" ON "_PeptideGoals"("A", "B");

-- CreateIndex
CREATE INDEX "_PeptideGoals_B_index" ON "_PeptideGoals"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PeptideRelated_AB_unique" ON "_PeptideRelated"("A", "B");

-- CreateIndex
CREATE INDEX "_PeptideRelated_B_index" ON "_PeptideRelated"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProtocolPeptides_AB_unique" ON "_ProtocolPeptides"("A", "B");

-- CreateIndex
CREATE INDEX "_ProtocolPeptides_B_index" ON "_ProtocolPeptides"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ProviderServices_AB_unique" ON "_ProviderServices"("A", "B");

-- CreateIndex
CREATE INDEX "_ProviderServices_B_index" ON "_ProviderServices"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ArticleTags_AB_unique" ON "_ArticleTags"("A", "B");

-- CreateIndex
CREATE INDEX "_ArticleTags_B_index" ON "_ArticleTags"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ArticlePeptides_AB_unique" ON "_ArticlePeptides"("A", "B");

-- CreateIndex
CREATE INDEX "_ArticlePeptides_B_index" ON "_ArticlePeptides"("B");

-- AddForeignKey
ALTER TABLE "Peptide" ADD CONSTRAINT "Peptide_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Peptide" ADD CONSTRAINT "Peptide_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Peptide" ADD CONSTRAINT "Peptide_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "Author"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Provider" ADD CONSTRAINT "Provider_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderPeptide" ADD CONSTRAINT "ProviderPeptide_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderPeptide" ADD CONSTRAINT "ProviderPeptide_peptideId_fkey" FOREIGN KEY ("peptideId") REFERENCES "Peptide"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProviderContact" ADD CONSTRAINT "ProviderContact_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comparison" ADD CONSTRAINT "Comparison_peptideAId_fkey" FOREIGN KEY ("peptideAId") REFERENCES "Peptide"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comparison" ADD CONSTRAINT "Comparison_peptideBId_fkey" FOREIGN KEY ("peptideBId") REFERENCES "Peptide"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Protocol" ADD CONSTRAINT "Protocol_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Faq" ADD CONSTRAINT "Faq_peptideId_fkey" FOREIGN KEY ("peptideId") REFERENCES "Peptide"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Faq" ADD CONSTRAINT "Faq_comparisonId_fkey" FOREIGN KEY ("comparisonId") REFERENCES "Comparison"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Faq" ADD CONSTRAINT "Faq_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Source" ADD CONSTRAINT "Source_peptideId_fkey" FOREIGN KEY ("peptideId") REFERENCES "Peptide"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Source" ADD CONSTRAINT "Source_protocolId_fkey" FOREIGN KEY ("protocolId") REFERENCES "Protocol"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lead" ADD CONSTRAINT "Lead_routedProviderId_fkey" FOREIGN KEY ("routedProviderId") REFERENCES "Provider"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadEvent" ADD CONSTRAINT "LeadEvent_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PeptideGoals" ADD CONSTRAINT "_PeptideGoals_A_fkey" FOREIGN KEY ("A") REFERENCES "Goal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PeptideGoals" ADD CONSTRAINT "_PeptideGoals_B_fkey" FOREIGN KEY ("B") REFERENCES "Peptide"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PeptideRelated" ADD CONSTRAINT "_PeptideRelated_A_fkey" FOREIGN KEY ("A") REFERENCES "Peptide"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PeptideRelated" ADD CONSTRAINT "_PeptideRelated_B_fkey" FOREIGN KEY ("B") REFERENCES "Peptide"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProtocolPeptides" ADD CONSTRAINT "_ProtocolPeptides_A_fkey" FOREIGN KEY ("A") REFERENCES "Peptide"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProtocolPeptides" ADD CONSTRAINT "_ProtocolPeptides_B_fkey" FOREIGN KEY ("B") REFERENCES "Protocol"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProviderServices" ADD CONSTRAINT "_ProviderServices_A_fkey" FOREIGN KEY ("A") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProviderServices" ADD CONSTRAINT "_ProviderServices_B_fkey" FOREIGN KEY ("B") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticleTags" ADD CONSTRAINT "_ArticleTags_A_fkey" FOREIGN KEY ("A") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticleTags" ADD CONSTRAINT "_ArticleTags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticlePeptides" ADD CONSTRAINT "_ArticlePeptides_A_fkey" FOREIGN KEY ("A") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticlePeptides" ADD CONSTRAINT "_ArticlePeptides_B_fkey" FOREIGN KEY ("B") REFERENCES "Peptide"("id") ON DELETE CASCADE ON UPDATE CASCADE;

