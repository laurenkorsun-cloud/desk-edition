import Parser from "rss-parser";
import {
  RSS_FETCH_FALLBACK_HOURS,
  RSS_FETCH_HOURS,
  RSS_SOURCES,
  MAX_HEADLINES_FOR_LLM,
  type RssSource,
} from "@/config/sources";

export type RawHeadline = {
  title: string;
  link: string;
  source: string;
  category: RssSource["category"];
  pubDate: string | null;
  snippet: string;
};

const parser = new Parser({
  timeout: 15000,
  headers: {
    "User-Agent": "DeskEdition/1.0 (news digest bot)",
  },
});

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function isWithinHours(date: Date | null, hours: number): boolean {
  if (!date || Number.isNaN(date.getTime())) return true;
  const cutoff = Date.now() - hours * 60 * 60 * 1000;
  return date.getTime() >= cutoff;
}

export async function fetchHeadlines(
  extraFeeds: { name: string; url: string; category?: RssSource["category"] }[] = []
): Promise<RawHeadline[]> {
  const sources: RssSource[] = [
    ...RSS_SOURCES,
    ...extraFeeds.map((f) => ({
      name: f.name,
      url: f.url,
      category: f.category ?? ("general" as const),
    })),
  ];

  const results: RawHeadline[] = [];

  await Promise.all(
    sources.map(async (source) => {
      try {
        const feed = await parser.parseURL(source.url);
        for (const item of feed.items ?? []) {
          if (!item.title?.trim()) continue;
          const pubDate = item.isoDate
            ? new Date(item.isoDate)
            : item.pubDate
              ? new Date(item.pubDate)
              : null;

          results.push({
            title: item.title.trim(),
            link: item.link ?? item.guid ?? "",
            source: source.name,
            category: source.category,
            pubDate: pubDate?.toISOString() ?? null,
            snippet: (item.contentSnippet ?? item.summary ?? "")
              .slice(0, 400)
              .trim(),
          });
        }
      } catch (err) {
        console.warn(`RSS fetch failed for ${source.name}:`, err);
      }
    })
  );

  let filtered = results.filter((h) => {
    const d = h.pubDate ? new Date(h.pubDate) : null;
    return isWithinHours(d, RSS_FETCH_HOURS);
  });

  if (filtered.length < 15) {
    filtered = results.filter((h) => {
      const d = h.pubDate ? new Date(h.pubDate) : null;
      return isWithinHours(d, RSS_FETCH_FALLBACK_HOURS);
    });
  }

  const seen = new Set<string>();
  const deduped: RawHeadline[] = [];
  for (const h of filtered) {
    const key = normalizeTitle(h.title);
    if (key.length < 10 || seen.has(key)) continue;
    seen.add(key);
    deduped.push(h);
  }

  deduped.sort((a, b) => {
    const ta = a.pubDate ? new Date(a.pubDate).getTime() : 0;
    const tb = b.pubDate ? new Date(b.pubDate).getTime() : 0;
    return tb - ta;
  });

  return deduped.slice(0, MAX_HEADLINES_FOR_LLM);
}

export function formatHeadlinesForPrompt(headlines: RawHeadline[]): string {
  return headlines
    .map(
      (h, i) =>
        `${i + 1}. [${h.category}] ${h.source}: ${h.title}\n   URL: ${h.link}\n   Snippet: ${h.snippet || "(none)"}`
    )
    .join("\n\n");
}
