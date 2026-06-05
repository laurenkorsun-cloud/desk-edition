import { buildBriefingSearchQueries } from "@/lib/briefing-search-queries";
import type { SubscriberProfile } from "@/lib/profile";
import { webSearch, isWebSearchConfigured } from "@/lib/web-search";
import type { BriefingSearchBundle } from "@/lib/web-search/types";

export async function fetchBriefingWebSearch(params: {
  enabledSlugs: string[];
  subscriber: SubscriberProfile;
  lensNames: { primary: string; secondary: string | null };
  editionDate: Date;
  headlineCount: number;
}): Promise<BriefingSearchBundle[]> {
  if (!isWebSearchConfigured()) return [];

  const queries = buildBriefingSearchQueries(params);
  if (queries.length === 0) return [];

  const concurrency = Number(process.env.WEB_SEARCH_CONCURRENCY ?? "4");
  const bySlug = new Map<string, BriefingSearchBundle>();

  for (let i = 0; i < queries.length; i += concurrency) {
    const batch = queries.slice(i, i + concurrency);
    const settled = await Promise.allSettled(
      batch.map(async (q) => {
        const response = await webSearch(q.query);
        return { q, response };
      })
    );

    for (const result of settled) {
      if (result.status !== "fulfilled" || !result.value.response) continue;
      const { q, response } = result.value;
      const existing = bySlug.get(q.slug);
      if (existing) {
        existing.searches.push(response);
        if (q.label) existing.label = q.label;
      } else {
        bySlug.set(q.slug, {
          slug: q.slug,
          label: q.label,
          searches: [response],
        });
      }
    }
  }

  return Array.from(bySlug.values());
}
