import type { PersonalEditionContent } from "@/lib/config-types";
import type { Section, Story } from "@/lib/types";
import type { BriefingCategory } from "@/config/briefing-nav";
import { enrichNewsContent } from "@/lib/enrich-news-stories";
import { anchorTalkingPoints } from "@/lib/anchor-talking-points";
import { resolveLensDisplayName } from "@/lib/lens-personalization";

export function normalizeContent(
  raw: PersonalEditionContent,
  options?: { lensLabel?: string; lensSlug?: string | null }
): PersonalEditionContent {
  const lensLabel =
    options?.lensLabel ??
    resolveLensDisplayName(
      raw.meta?.primaryLensSlug ?? raw.meta?.primaryLens
    );
  const withNews = enrichNewsContent(raw);
  return anchorTalkingPoints(withNews, {
    lensLabel,
    enabledSlugs: raw.meta?.enabledModules,
  });
}

/** News page sections in sample-edition order (World, Policy & work, …). */
export function getNewsSections(content: PersonalEditionContent): Section[] {
  const sections = content.sections ?? [];
  const newsSections = sections.filter(
    (s) =>
      /world|policy|news|work/i.test(s.name) &&
      !/business|market|interesting|culture/i.test(s.name) &&
      (s.stories?.length ?? 0) > 0
  );

  const rank = (name: string) => {
    if (/^world/i.test(name)) return 0;
    if (/policy/i.test(name)) return 1;
    return 2;
  };

  return [...newsSections].sort((a, b) => rank(a.name) - rank(b.name));
}

export function getStoriesForCategory(
  content: PersonalEditionContent,
  category: BriefingCategory
): Story[] {
  const sections = content.sections ?? [];
  switch (category) {
    case "news": {
      const fromSections = getNewsSections(content).flatMap((s) => s.stories);
      if (fromSections.length > 0) return fromSections;

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
