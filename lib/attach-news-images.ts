import type { PersonalEditionContent } from "@/lib/config-types";
import { fetchOgImageUrl } from "@/lib/fetch-og-image";
import type { RawHeadline } from "@/lib/rss";
import { normalizeHeadlineTitle } from "@/lib/rss";
import type { Story } from "@/lib/types";

function normalizeUrl(url: string): string {
  return url.replace(/\/$/, "").split("?")[0].toLowerCase();
}

/** Prefer larger BBC thumbnails when available */
export function upgradeNewsImageUrl(url: string): string {
  return url.replace(
    /(ichef\.bbci\.co\.uk\/ace\/standard\/)\d+/,
    "$1480"
  );
}

function imageIndex(headlines: RawHeadline[]) {
  const byLink = new Map<string, string>();
  const byTitle = new Map<string, string>();

  for (const h of headlines) {
    if (!h.imageUrl) continue;
    const img = upgradeNewsImageUrl(h.imageUrl);
    if (h.link) byLink.set(normalizeUrl(h.link), img);
    byTitle.set(normalizeHeadlineTitle(h.title), img);
  }

  return { byLink, byTitle };
}

function titleOverlap(a: string, b: string): number {
  const wordsA = new Set(normalizeHeadlineTitle(a).split(" ").filter((w) => w.length > 3));
  const wordsB = normalizeHeadlineTitle(b).split(" ").filter((w) => w.length > 3);
  if (wordsA.size === 0 || wordsB.length === 0) return 0;
  const shared = wordsB.filter((w) => wordsA.has(w)).length;
  return shared / Math.min(wordsA.size, wordsB.length);
}

function matchHeadlineImage(
  story: Story,
  headlines: RawHeadline[],
  index: ReturnType<typeof imageIndex>
): string | undefined {
  if (story.imageUrl) return upgradeNewsImageUrl(story.imageUrl);

  if (story.sourceUrl) {
    const normalized = normalizeUrl(story.sourceUrl);
    const byUrl = index.byLink.get(normalized);
    if (byUrl) return byUrl;

    for (const [link, img] of index.byLink) {
      if (normalized.includes(link) || link.includes(normalized)) return img;
    }
  }

  const exactTitle = index.byTitle.get(normalizeHeadlineTitle(story.headline));
  if (exactTitle) return exactTitle;

  let best: { score: number; img: string } | null = null;
  for (const h of headlines) {
    if (!h.imageUrl) continue;
    const score = titleOverlap(story.headline, h.title);
    if (score >= 0.45 && (!best || score > best.score)) {
      best = { score, img: upgradeNewsImageUrl(h.imageUrl) };
    }
  }
  return best?.img;
}

function isNewsSection(name: string): boolean {
  return !/business|market/i.test(name);
}

export function attachNewsImagesFromHeadlines(
  content: PersonalEditionContent,
  headlines: RawHeadline[]
): PersonalEditionContent {
  const index = imageIndex(headlines);

  return {
    ...content,
    sections: content.sections.map((section) => {
      if (!isNewsSection(section.name)) return section;
      return {
        ...section,
        stories: section.stories.map((story) => {
          const imageUrl = matchHeadlineImage(story, headlines, index);
          return imageUrl ? { ...story, imageUrl } : story;
        }),
      };
    }),
  };
}

/** Fill remaining gaps via og:image scrape (best-effort). */
export async function attachNewsImagesWithOgFallback(
  content: PersonalEditionContent,
  headlines: RawHeadline[]
): Promise<PersonalEditionContent> {
  let next = attachNewsImagesFromHeadlines(content, headlines);

  const stories = next.sections
    .filter((s) => isNewsSection(s.name))
    .flatMap((s) => s.stories)
    .filter((s) => !s.imageUrl && s.sourceUrl?.startsWith("http"))
    .slice(0, 5);

  const ogResults = await Promise.all(
    stories.map(async (story) => ({
      headline: story.headline,
      sourceUrl: story.sourceUrl,
      imageUrl: await fetchOgImageUrl(story.sourceUrl!),
    }))
  );

  for (const result of ogResults) {
    if (!result.imageUrl) continue;
    const img = upgradeNewsImageUrl(result.imageUrl);
    next = {
      ...next,
      sections: next.sections.map((section) => ({
        ...section,
        stories: section.stories.map((s) =>
          s.headline === result.headline && s.sourceUrl === result.sourceUrl
            ? { ...s, imageUrl: img }
            : s
        ),
      })),
    };
  }

  return next;
}
