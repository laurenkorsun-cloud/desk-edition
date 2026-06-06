import { INDUSTRY_TARGET_STORIES } from "@/config/industry-editorial";
import type { ModuleItem } from "@/lib/config-types";
import type { PersonalEditionContent } from "@/lib/config-types";
import type { Story } from "@/lib/types";
import { getModuleBlock } from "@/lib/briefing-content";
import { buildIndustryTalkingPoint } from "@/lib/industry-story-display";
import { sampleIndustryStories } from "@/lib/sample-industry-stories";
import { wordCount } from "@/lib/enrich-news-stories";

function moduleItemToStory(item: ModuleItem, lensLabel: string): Story {
  const synopsis = item.synopsis?.trim() ?? "";
  const description = item.description?.trim() ?? "";
  const summary =
    synopsis.split(/[.!?]/).slice(0, 2).join(". ").trim() + "." ||
    synopsis.slice(0, 280);

  const sample = sampleIndustryStories(lensLabel).find(
    (s) => s.headline === item.headline
  );

  const story: Story = {
    headline: item.headline,
    summary: sample?.summary ?? summary,
    synopsis: sample?.synopsis ?? (synopsis.length > summary.length ? synopsis : undefined),
    description: sample?.description ?? (description || undefined),
    whyItMatters:
      sample?.whyItMatters ??
      (description.split(/[.!?]/)[0]?.trim()
        ? `${description.split(/[.!?]/)[0]?.trim()}.`
        : `This headline affects how ${lensLabel} teams plan the week—note one client or workflow angle before stand-up.`),
    sourceUrl: item.sourceUrl,
    sourceName: item.sourceName,
    talkingPoint: sample?.talkingPoint,
  };

  return {
    ...story,
    talkingPoint:
      story.talkingPoint ?? buildIndustryTalkingPoint(story, lensLabel),
  };
}

function storiesFromSections(content: PersonalEditionContent): Story[] {
  const seen = new Set<string>();
  const out: Story[] = [];
  for (const section of content.sections ?? []) {
    for (const st of section.stories) {
      const key = st.headline.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(st);
    }
  }
  return out;
}

export function getIndustryStories(
  content: PersonalEditionContent,
  lensLabel: string
): Story[] {
  const block = getModuleBlock(content, "industry_lens");
  const fromModule = (block?.items ?? []).map((item) =>
    moduleItemToStory(item, lensLabel)
  );

  if (fromModule.length >= INDUSTRY_TARGET_STORIES) {
    return fromModule.slice(0, INDUSTRY_TARGET_STORIES);
  }

  const seen = new Set(fromModule.map((s) => s.headline.toLowerCase()));
  const supplemental = storiesFromSections(content).filter(
    (s) => !seen.has(s.headline.toLowerCase())
  );

  const merged = [...fromModule, ...supplemental].slice(
    0,
    INDUSTRY_TARGET_STORIES
  );

  if (merged.length > 0) return merged;

  return sampleIndustryStories(lensLabel).map((s) => ({
    ...s,
    talkingPoint: s.talkingPoint ?? buildIndustryTalkingPoint(s, lensLabel),
  }));
}

export function enrichIndustryStory(story: Story, lensLabel: string): Story {
  const enriched = {
    ...story,
    talkingPoint:
      story.talkingPoint ?? buildIndustryTalkingPoint(story, lensLabel),
  };

  const weak =
    !story.whyItMatters?.trim() ||
    story.whyItMatters.length < 40 ||
    /worth a quick skim|before your first meeting/i.test(story.whyItMatters);

  if (weak && story.description) {
    const first = story.description.split(/[.!?]/)[0]?.trim();
    if (first && first.length > 30) {
      enriched.whyItMatters = `${first}.`;
    }
  }

  return enriched;
}

export function enrichIndustryContent(
  content: PersonalEditionContent,
  options?: { lensLabel?: string }
): PersonalEditionContent {
  const lens = options?.lensLabel ?? content.meta?.primaryLens ?? "your field";
  const stories = getIndustryStories(content, lens).map((s) =>
    enrichIndustryStory(s, lens)
  );

  return content;
}

export function industryNeedsRegeneration(
  content: PersonalEditionContent,
  lensLabel: string
): boolean {
  const block = getModuleBlock(content, "industry_lens");
  const items = block?.items ?? [];
  if (items.length === 0) return true;
  const short = items.filter(
    (i) => wordCount(i.synopsis ?? "") < 40
  ).length;
  return short > items.length / 2;
}
