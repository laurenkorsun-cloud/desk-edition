import type { PersonalEditionContent } from "@/lib/config-types";
import type { Section, Story } from "@/lib/types";
import type { BriefingCategory } from "@/config/briefing-nav";
import { enrichNewsContent } from "@/lib/enrich-news-stories";
import { anchorTalkingPoints } from "@/lib/anchor-talking-points";

export function normalizeContent(
  raw: PersonalEditionContent
): PersonalEditionContent {
  const withNews = enrichNewsContent(raw);
  return anchorTalkingPoints(withNews, {
    lensLabel: raw.meta?.primaryLens,
    enabledSlugs: raw.meta?.enabledModules,
  });
}

export function getStoriesForCategory(
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
      if (primary.length >= 6) return primary;
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

export function getModuleBlock(
  content: PersonalEditionContent,
  slug: string
) {
  return content.modules?.find((m) => m.slug === slug);
}

export function getCategoryTalkingPoints(
  content: PersonalEditionContent,
  category: BriefingCategory
): string[] {
  const c = normalizeContent(content);
  return c.talkingPointsByCategory?.[category] ?? [];
}

export function getHubHighlights(content: PersonalEditionContent) {
  const c = normalizeContent(content);
  const industryBlock = c.modules?.find((m) => m.slug === "industry_lens");
  const industryText =
    industryBlock?.synopsis?.split(".")[0] ??
    c.sections.find((s) => /world|policy/i.test(s.name))?.stories[1]?.headline;

  return [
    { label: "News", href: "news", text: c.sections[0]?.stories[0]?.headline },
    {
      label: "Markets",
      href: "markets",
      text: c.sections.find((s) => /business/i.test(s.name))?.stories[0]
        ?.headline,
    },
    { label: "Industry", href: "industry", text: industryText },
  ].filter((h) => h.text);
}

export function getIndustryIntro(
  content: PersonalEditionContent,
  lensName: string
) {
  const block = getModuleBlock(content, "industry_lens");
  return (
    block?.body ??
    `Today's briefing is tailored for ${lensName}—news and context selected for your field.`
  );
}
