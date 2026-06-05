import { NEWS_SYNOPSIS_MIN_WORDS } from "@/config/news-editorial";
import type { PersonalEditionContent } from "@/lib/config-types";
import type { Story } from "@/lib/types";

export function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/** True when story lacks a real long-form synopsis (legacy or weak LLM output). */
export function isShortSynopsis(story: Story): boolean {
  const synopsis = story.synopsis?.trim() ?? "";
  if (wordCount(synopsis) >= NEWS_SYNOPSIS_MIN_WORDS) return false;
  const combined = [story.synopsis, story.description, story.summary]
    .filter(Boolean)
    .join(" ");
  return wordCount(combined) < NEWS_SYNOPSIS_MIN_WORDS;
}

/**
 * Pick the best body for "Full synopsis" — never show a 2-sentence summary alone.
 */
export function resolveDisplaySynopsis(story: Story): {
  synopsis: string;
  analysis: string | null;
  isLegacy: boolean;
} {
  const summary = story.summary?.trim() ?? "";
  const synopsis = story.synopsis?.trim() ?? "";
  const description = story.description?.trim() ?? "";

  if (wordCount(synopsis) >= NEWS_SYNOPSIS_MIN_WORDS) {
    return {
      synopsis,
      analysis:
        description && description !== synopsis ? description : null,
      isLegacy: false,
    };
  }

  if (wordCount(description) >= NEWS_SYNOPSIS_MIN_WORDS) {
    return {
      synopsis: description,
      analysis:
        synopsis && synopsis !== description
          ? synopsis
          : summary && summary !== description
            ? summary
            : null,
      isLegacy: true,
    };
  }

  const parts = [synopsis, summary, description].filter(
    (p, i, arr) => p && arr.indexOf(p) === i
  );
  const merged = parts.join("\n\n");

  if (wordCount(merged) >= 80) {
    return {
      synopsis: merged,
      analysis: null,
      isLegacy: true,
    };
  }

  return { synopsis: merged || summary, analysis: null, isLegacy: true };
}

export function enrichNewsStory(story: Story): Story {
  const { synopsis, analysis } = resolveDisplaySynopsis(story);
  return {
    ...story,
    synopsis,
    description: analysis ?? story.description,
  };
}

export function enrichNewsContent(
  content: PersonalEditionContent
): PersonalEditionContent {
  return {
    ...content,
    sections: content.sections.map((section) => ({
      ...section,
      stories: /business|market/i.test(section.name)
        ? section.stories
        : section.stories.map((st) => enrichNewsStory(st)),
    })),
  };
}

export function newsNeedsRegeneration(content: PersonalEditionContent): boolean {
  const newsStories = content.sections
    .filter((s) => !/business|market/i.test(s.name))
    .flatMap((s) => s.stories);
  if (newsStories.length === 0) return true;
  const shortCount = newsStories.filter(isShortSynopsis).length;
  return shortCount > newsStories.length / 2;
}
