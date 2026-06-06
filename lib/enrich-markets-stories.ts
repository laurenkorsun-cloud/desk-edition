import {
  MARKETS_DEPTH_MIN_WORDS,
  MARKETS_LEDE_MAX_WORDS,
} from "@/config/markets-editorial";
import type { PersonalEditionContent } from "@/lib/config-types";
import type { MarketsMeta } from "@/lib/config-types";
import { getStoriesForCategory } from "@/lib/briefing-content";
import { applyMarketsBaseline } from "@/lib/markets-baseline";
import { resolveWatchTodayDisplay } from "@/lib/markets-watch-today";
import { wordCount } from "@/lib/enrich-news-stories";
import type { Story } from "@/lib/types";

export function isShortMarketsStory(story: Story): boolean {
  const summary = story.summary?.trim() ?? "";
  if (
    wordCount(summary) >= 20 &&
    wordCount(summary) <= MARKETS_LEDE_MAX_WORDS + 30
  ) {
    const depth = [story.synopsis, story.description].filter(Boolean).join(" ");
    return wordCount(depth) < MARKETS_DEPTH_MIN_WORDS / 2;
  }
  const combined = [story.synopsis, story.description, story.summary]
    .filter(Boolean)
    .join(" ");
  return wordCount(combined) < MARKETS_DEPTH_MIN_WORDS;
}

export function enrichMarketsStory(story: Story): Story {
  const synopsis = story.synopsis?.trim() ?? "";
  const summary = story.summary?.trim() ?? "";
  const description = story.description?.trim() ?? "";

  if (wordCount(synopsis) >= MARKETS_DEPTH_MIN_WORDS) {
    return {
      ...story,
      synopsis,
      description: description || undefined,
    };
  }

  if (wordCount(description) >= MARKETS_DEPTH_MIN_WORDS) {
    return {
      ...story,
      synopsis: description,
      description: synopsis && synopsis !== description ? synopsis : undefined,
    };
  }

  const merged = [synopsis, description, summary].filter(Boolean).join("\n\n");
  return {
    ...story,
    synopsis: merged || summary,
    description: description || undefined,
  };
}

function buildFallbackPulse(stories: Story[]): string {
  const chips = stories
    .flatMap((s) => {
      const text = [s.headline, s.summary].join(" ");
      const matches = text.match(
        /(?:S&P|Nasdaq|Dow|10-year|yields?)[^.]{0,40}(?:\+|−|-)?\d[\d.]*%?/gi
      );
      return matches?.slice(0, 1) ?? [];
    })
    .slice(0, 3);

  if (chips.length > 0) {
    return `${chips.join("; ")} — see overnight moves below.`;
  }
  if (stories[0]?.summary) {
    return stories[0].summary.split(/[.!?]/)[0] + ".";
  }
  return "Indices and rates moved overnight — expand stories below for context.";
}

function buildFallbackWatch(stories: Story[]): string[] {
  const items: string[] = [];
  for (const story of stories) {
    const text = [story.headline, story.synopsis, story.summary].join(" ");
    if (/fed|fomc|powell/i.test(text)) items.push("Fed commentary on the calendar");
    if (/cpi|jobs|payroll|inflation/i.test(text)) items.push("Key inflation or jobs data this week");
    if (/earnings|results|guidance/i.test(text)) items.push("Earnings releases worth watching");
    if (/ipo|m&a|deal/i.test(text)) items.push("Deal flow and listing headlines");
  }
  return [...new Set(items)].slice(0, 4);
}

export function resolveMarketsMeta(
  content: PersonalEditionContent
): MarketsMeta {
  const stories = getStoriesForCategory(content, "markets");
  const existing = content.marketsMeta;

  const watchToday = resolveWatchTodayDisplay(existing, stories);

  return {
    pulse: existing?.pulse?.trim() || buildFallbackPulse(stories),
    intro: existing?.intro?.trim() || watchToday.intro,
    watchItems:
      existing?.watchItems?.length
        ? existing.watchItems
        : watchToday.items.map((i) => i.text),
    builtAt: existing?.builtAt,
  };
}

export function enrichMarketsContent(
  content: PersonalEditionContent,
  options?: { lensLabel?: string; lensSlug?: string | null }
): PersonalEditionContent {
  const lens = options?.lensLabel ?? content.meta?.primaryLens ?? "your team";
  const lensSlug =
    options?.lensSlug ?? content.meta?.primaryLensSlug ?? null;

  const sections = content.sections.map((section) => {
    if (!/business|market/i.test(section.name)) return section;
    return {
      ...section,
      stories: section.stories.map((st) =>
        applyMarketsBaseline(enrichMarketsStory(st), lens, lensSlug)
      ),
    };
  });

  const enriched: PersonalEditionContent = {
    ...content,
    sections,
    marketsMeta: resolveMarketsMeta({ ...content, sections }),
  };

  return enriched;
}

export function marketsNeedsRegeneration(
  content: PersonalEditionContent
): boolean {
  const stories = getStoriesForCategory(content, "markets");
  if (stories.length === 0) return true;
  const shortCount = stories.filter(isShortMarketsStory).length;
  return shortCount > stories.length / 2 || !content.marketsMeta?.pulse;
}
