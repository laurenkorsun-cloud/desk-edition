/**
 * Run after setting env vars:
 * npx tsx scripts/seed-sample.ts
 *
 * Or use: POST /api/admin/seed-sample with x-admin-secret header
 */

/** Load env: export $(grep -v '^#' .env.local | xargs) before running */

async function main() {
  const { upsertEdition } = await import("../lib/editions");
  const { getSampleEditionContent } = await import("../lib/sample-edition");

  const content = getSampleEditionContent();
  const edition = await upsertEdition({
    slug: "sample",
    title: "Sample Edition",
    lede: content.lede,
    content,
    status: "published",
    editionNumber: 0,
    publishedAt: new Date().toISOString(),
  });

  console.log("Seeded:", edition.slug);
}

main().catch(console.error);
