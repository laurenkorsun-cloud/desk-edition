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
  imageUrl?: string;
};

export function normalizeHeadlineTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractImageFromRssItem(
  item: Parser.Item & {
    mediaContent?: { $?: { url?: string } } | { $?: { url?: string } }[];
    mediaThumbnail?: { $?: { url?: string } } | { $?: { url?: string } }[];
    contentEncoded?: string;
  }
): string | undefined {
  const thumb = item.mediaThumbnail;
  const thumbUrl = Array.isArray(thumb)
    ? thumb[0]?.$?.url
    : thumb?.$?.url;
  if (thumbUrl?.startsWith("http")) return thumbUrl;

  const media = item.mediaContent;
  const mediaUrl = Array.isArray(media)
    ? media.find((m) => m?.$?.url?.startsWith("http"))?.$?.url
    : media?.$?.url;
  if (mediaUrl?.startsWith("http")) return mediaUrl;

  if (item.enclosure?.url) {
    const type = item.enclosure.type ?? "";
    if (/image|jpeg|png|webp/i.test(type) || /\.(jpg|jpeg|png|webp)/i.test(item.enclosure.url)) {
      return item.enclosure.url;
    }
  }

  const html = item.contentEncoded ?? item.content ?? "";
  const imgMatch = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (imgMatch?.[1]?.startsWith("http")) return imgMatch[1];

  return undefined;
}

const parser = new Parser({
  timeout: 15000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (compatible; DeskEdition/1.0; +https://desk-edition)",
  },
  customFields: {
    item: [
      ["media:content", "mediaContent"],
      ["media:thumbnail", "mediaThumbnail"],
      ["content:encoded", "contentEncoded"],
    ],
  },
});

const normalizeTitle = normalizeHeadlineTitle;

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
            imageUrl: extractImageFromRssItem(
              item as Parser.Item & {
                mediaContent?: { $?: { url?: string } }[];
                mediaThumbnail?: { $?: { url?: string } };
                contentEncoded?: string;
              }
            ),
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
        `${i + 1}. [${h.category}] ${h.source}: ${h.title}\n   URL: ${h.link}${h.imageUrl ? `\n   Image: ${h.imageUrl}` : ""}\n   Snippet: ${h.snippet || "(none)"}`
    )
    .join("\n\n");
}
