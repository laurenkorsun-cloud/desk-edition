import { NEWS_TARGET_ARTICLES } from "@/config/news-editorial";
import type { PersonalEditionContent } from "@/lib/config-types";
import { buildNewsTalkingPoint } from "@/lib/news-story-display";
import { buildMarketTalkingPoint } from "@/lib/markets-story-display";
import { buildIndustryTalkingPoint } from "@/lib/industry-story-display";
import type { Story } from "@/lib/types";
import type { BriefingCategory } from "@/config/briefing-nav";

function getModuleBlock(content: PersonalEditionContent, slug: string) {
  return content.modules?.find((m) => m.slug === slug);
}

function getStoriesForCategory(
  content: PersonalEditionContent,
  category: BriefingCategory
): Story[] {
  const sections = content.sections ?? [];
  switch (category) {
    case "news": {
      const primary = sections
        .filter(
          (s) =>
            /world|policy|news|work/i.test(s.name) &&
            !/interesting|culture/i.test(s.name)
        )
        .flatMap((s) => s.stories);
      if (primary.length >= 4) return primary;
      const broader = sections
        .filter((s) => !/business|market/i.test(s.name))
        .flatMap((s) => s.stories);
      const seen = new Set<string>();
      const merged: Story[] = [];
      for (const st of [...primary, ...broader]) {
        const key = st.headline.toLowerCase();
        if (seen.has(key)) continue;
        seen.add(key);
        merged.push(st);
      }
      return merged;
    }
    case "markets":
      return sections
        .filter((s) => /business|market/i.test(s.name))
        .flatMap((s) => s.stories);
    case "industry":
      return sections.flatMap((s) => s.stories).slice(0, 4);
    case "hobbies":
      return sections
        .filter((s) => /interesting|culture/i.test(s.name))
        .flatMap((s) => s.stories);
    default:
      return [];
  }
}

function firstNumber(text: string): string | null {
  const m = text.match(
    /(?:\$|€|£)?\d[\d,.]*(?:%|billion|million|B|M|bps|points)?|\d+(?:\.\d+)?%/i
  );
  return m ? m[0] : null;
}

function pointFromStory(story: Story, lensLabel: string): string {
  const num = firstNumber(
    [story.synopsis, story.description, story.summary].filter(Boolean).join(" ")
  );
  const numBit = num ? ` (${num} in today's coverage)` : "";
  const hook = story.headline.length > 70 ? `${story.headline.slice(0, 67)}…` : story.headline;
  return `On "${hook}"${numBit}: ${story.whyItMatters} Ask your team how this is showing up for ${lensLabel} work this week.`;
}

function pointFromModule(
  slug: string,
  content: PersonalEditionContent,
  lensLabel: string
): string[] {
  const block = getModuleBlock(content, slug);
  if (!block) return [];
  const item = block.items?.[0];
  const headline = item?.headline ?? block.title;
  const fact =
    item?.synopsis?.split(".")[0] ?? block.synopsis?.split(".")[0] ?? "";
  return [
    `On today's ${block.title} pick ("${headline}"): ${fact} Ask if anyone on the team has a take tied to ${lensLabel}.`,
  ];
}

function isAnchored(point: string, anchors: string[]): boolean {
  const lower = point.toLowerCase();
  if (anchors.some((a) => a.length > 8 && lower.includes(a.toLowerCase()))) {
    return true;
  }
  return /\d/.test(point) && (lower.includes("on ") || lower.includes("today"));
}

function collectAnchors(content: PersonalEditionContent): string[] {
  const anchors: string[] = [];
  for (const section of content.sections) {
    for (const st of section.stories) {
      anchors.push(st.headline);
      const num = firstNumber(st.synopsis ?? st.summary ?? "");
      if (num) anchors.push(num);
    }
  }
  for (const mod of content.modules ?? []) {
    anchors.push(mod.title);
    for (const it of mod.items ?? []) anchors.push(it.headline);
  }
  return anchors.filter((a) => a.length > 4);
}

function buildCategoryPoints(
  content: PersonalEditionContent,
  category: BriefingCategory,
  lensLabel: string
): string[] {
  switch (category) {
    case "news":
      return [];
    case "markets":
      return [];
    case "industry": {
      const mod = pointFromModule("industry_lens", content, lensLabel);
      const stories = getStoriesForCategory(content, "industry").slice(0, 1);
      return [...mod, ...stories.map((s) => pointFromStory(s, lensLabel))].slice(
        0,
        2
      );
    }
    case "weather":
      return pointFromModule("weather", content, lensLabel);
    case "calendar":
      return pointFromModule("calendar", content, lensLabel);
    case "music":
      return pointFromModule("music", content, lensLabel);
    case "books":
      return pointFromModule("books", content, lensLabel);
    case "movies":
      return pointFromModule("movies", content, lensLabel);
    case "clothing_sales":
      return pointFromModule("clothing_sales", content, lensLabel);
    case "hobbies":
      return [
        ...pointFromModule("hobbies", content, lensLabel),
        ...getStoriesForCategory(content, "hobbies")
          .slice(0, 1)
          .map((s) => pointFromStory(s, lensLabel)),
      ].slice(0, 2);
    case "historical":
      return pointFromModule("historical_fact", content, lensLabel);
    case "vacation":
      return pointFromModule("vacation_planning", content, lensLabel);
    case "commute":
      return pointFromModule("commute", content, lensLabel);
    case "sports":
      return pointFromModule("sports_scores", content, lensLabel);
    case "podcast":
      return pointFromModule("podcast_pick", content, lensLabel);
    default:
      return [];
  }
}

/**
 * Ensure talking points reference today's headlines, numbers, and modules.
 */
export function anchorTalkingPoints(
  content: PersonalEditionContent,
  options: { lensLabel?: string; enabledSlugs?: string[] } = {}
): PersonalEditionContent {
  const lens = options.lensLabel ?? content.meta?.primaryLens ?? "your team";
  const enabled = new Set(options.enabledSlugs ?? content.meta?.enabledModules ?? []);
  const anchors = collectAnchors(content);

  const categories: BriefingCategory[] = [
    "news",
    "markets",
    "industry",
    "weather",
    "calendar",
    "music",
    "books",
    "movies",
    "clothing_sales",
    "hobbies",
    "historical",
    "vacation",
  ];

  const categoryToModule: Record<string, string> = {
    news: "news",
    markets: "markets",
    industry: "industry_lens",
    weather: "weather",
    calendar: "calendar",
    music: "music",
    books: "books",
    movies: "movies",
    clothing_sales: "clothing_sales",
    hobbies: "hobbies",
    historical: "historical_fact",
    vacation: "vacation_planning",
    commute: "commute",
    sports: "sports_scores",
    podcast: "podcast_pick",
  };

  const byCategory: Record<string, string[]> = {
    ...(content.talkingPointsByCategory ?? {}),
  };

  for (const cat of categories) {
    const modSlug = categoryToModule[cat];
    if (modSlug && !enabled.has(modSlug) && cat !== "news" && cat !== "markets") {
      continue;
    }
    if (cat === "news" && !enabled.has("news")) continue;
    if (cat === "markets" && !enabled.has("markets")) continue;

    const generated = buildCategoryPoints(content, cat, lens);
    if (generated.length === 0) continue;

    const existing = byCategory[cat] ?? [];
    const merged: string[] = [];

    for (let i = 0; i < Math.max(existing.length, generated.length); i++) {
      const ex = existing[i];
      const gen = generated[i];
      if (ex && isAnchored(ex, anchors)) {
        merged.push(ex);
      } else if (gen) {
        merged.push(gen);
      } else if (ex) {
        merged.push(ex);
      }
    }

    byCategory[cat] =
      cat === "news" || cat === "markets" || cat === "industry"
        ? []
        : merged.slice(0, 2);
  }

  const newsStories = getStoriesForCategory(content, "news").slice(
    0,
    NEWS_TARGET_ARTICLES
  );
  let sections = content.sections;
  if (enabled.has("news") && newsStories.length > 0) {
    const newsHeadlines = new Set(newsStories.map((n) => n.headline));
    sections = sections.map((section) => {
      if (/business|market/i.test(section.name)) return section;
      return {
        ...section,
        stories: section.stories.map((st) => {
          if (!newsHeadlines.has(st.headline)) return st;
          return {
            ...st,
            talkingPoint:
              st.talkingPoint ?? buildNewsTalkingPoint(st, lens),
          };
        }),
      };
    });
  }

  if (enabled.has("markets")) {
    const marketStories = getStoriesForCategory(content, "markets");
    const marketHeadlines = new Set(marketStories.map((n) => n.headline));
    sections = sections.map((section) => {
      if (!/business|market/i.test(section.name)) return section;
      return {
        ...section,
        stories: section.stories.map((st) => {
          if (!marketHeadlines.has(st.headline)) return st;
          return {
            ...st,
            talkingPoint:
              st.talkingPoint ?? buildMarketTalkingPoint(st, lens),
          };
        }),
      };
    });
  }

  const flat = Object.values(byCategory).flat();
  const global = (content.talkingPoints ?? []).filter((p) =>
    isAnchored(p, anchors)
  );
  const talkingPoints =
    global.length >= 3
      ? global.slice(0, 5)
      : [...global, ...flat]
          .filter((p, i, arr) => arr.indexOf(p) === i)
          .slice(0, 5);

  return {
    ...content,
    sections,
    talkingPointsByCategory: byCategory,
    talkingPoints: talkingPoints.length > 0 ? talkingPoints : flat.slice(0, 5),
  };
}
