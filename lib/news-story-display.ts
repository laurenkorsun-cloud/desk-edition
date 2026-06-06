import {
  NEWS_DEPTH_MIN_WORDS,
  NEWS_LEDE_MAX_WORDS,
} from "@/config/news-editorial";
import type { Story } from "@/lib/types";
import { wordCount } from "@/lib/enrich-news-stories";

export type NewsTalkingPoint = {
  line: string;
  question: string;
};

export type TieredNewsDisplay = {
  lede: string;
  depth: string | null;
  analysis: string | null;
  hasExpand: boolean;
  isLegacy: boolean;
};

function firstParagraphs(text: string, maxWords: number): {
  taken: string;
  rest: string;
} {
  const paragraphs = text.split(/\n\n+/).filter((p) => p.trim());
  const taken: string[] = [];
  let words = 0;
  let restStart = 0;

  for (let i = 0; i < paragraphs.length; i++) {
    const w = wordCount(paragraphs[i]);
    if (words > 0 && words + w > maxWords) break;
    taken.push(paragraphs[i].trim());
    words += w;
    restStart = i + 1;
  }

  const rest = paragraphs.slice(restStart).join("\n\n").trim();
  return { taken: taken.join("\n\n"), rest };
}

export function resolveTieredNews(story: Story): TieredNewsDisplay {
  const summary = story.summary?.trim() ?? "";
  const synopsis = story.synopsis?.trim() ?? "";
  const description = story.description?.trim() ?? "";

  if (wordCount(summary) >= 25 && wordCount(summary) <= NEWS_LEDE_MAX_WORDS + 40) {
    const depthParts = [synopsis, description]
      .filter((p) => p && p !== summary)
      .join("\n\n")
      .trim();
    return {
      lede: summary,
      depth: depthParts || null,
      analysis: null,
      hasExpand: wordCount(depthParts) >= NEWS_DEPTH_MIN_WORDS / 2,
      isLegacy: false,
    };
  }

  if (wordCount(synopsis) >= 80) {
    const { taken, rest } = firstParagraphs(synopsis, NEWS_LEDE_MAX_WORDS);
    const lede = taken || summary || synopsis.slice(0, 400);
    const depth = [rest, description]
      .filter((p) => p && p !== lede)
      .join("\n\n")
      .trim();
    return {
      lede,
      depth: depth || null,
      analysis: null,
      hasExpand: wordCount(depth) >= 40,
      isLegacy: wordCount(synopsis) >= 200,
    };
  }

  const merged = [summary, synopsis, description].filter(Boolean).join("\n\n");
  const { taken, rest } = firstParagraphs(merged, NEWS_LEDE_MAX_WORDS);
  return {
    lede: taken || merged,
    depth: rest || null,
    analysis: null,
    hasExpand: wordCount(rest) >= 40,
    isLegacy: true,
  };
}

export function buildNewsTalkingPoint(
  story: Story,
  lensLabel: string
): NewsTalkingPoint {
  const matter =
    story.whyItMatters?.trim().split(/[.!?]/)[0]?.trim() ??
    "This could affect how your team plans the week";
  const shortHeadline =
    story.headline.length > 55
      ? `${story.headline.slice(0, 52)}…`
      : story.headline;

  return {
    line: `${matter}.`,
    question: `Did you catch the news on "${shortHeadline}"—how is that landing for ${lensLabel} work?`,
  };
}
