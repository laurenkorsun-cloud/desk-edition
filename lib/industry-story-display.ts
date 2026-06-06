import { resolveTieredNews } from "@/lib/news-story-display";
import type { Story } from "@/lib/types";

export type IndustryTalkingPoint = {
  line: string;
  question: string;
};

const THEME_RULES: { theme: string; pattern: RegExp }[] = [
  { theme: "Regulation", pattern: /regulat|compliance|sec |pcaob|fda|cms|rule|law/i },
  { theme: "Policy", pattern: /policy|legislat|congress|government|budget|election/i },
  { theme: "Sector trend", pattern: /sector|industry|market share|demand|growth/i },
  { theme: "Deals & clients", pattern: /client|deal|m&a|contract|vendor|partnership/i },
  { theme: "Technology shift", pattern: /ai |tech|software|platform|digital|automation/i },
  { theme: "Workforce", pattern: /hiring|layoff|talent|workforce|union|labor/i },
];

function firstNumber(text: string): string | null {
  const m = text.match(
    /(?:\$|€|£)?\d[\d,.]*(?:%|billion|million|B|M|bps)?|\d+(?:\.\d+)?%/i
  );
  return m ? m[0] : null;
}

export function inferIndustryTheme(story: Story): string {
  const text = [story.headline, story.summary, story.synopsis].join(" ");
  for (const { theme, pattern } of THEME_RULES) {
    if (pattern.test(text)) return theme;
  }
  return "Your lens";
}

export function buildIndustryTalkingPoint(
  story: Story,
  lensLabel: string
): IndustryTalkingPoint {
  if (story.talkingPoint?.line && story.talkingPoint?.question) {
    return story.talkingPoint;
  }

  const text = [story.summary, story.synopsis, story.headline].join(" ");
  const num = firstNumber(text);
  const theme = inferIndustryTheme(story);

  const line = num
    ? `Today's ${theme.toLowerCase()} angle for ${lensLabel}: ${num} showed up in the coverage—worth knowing before stand-up.`
    : `One ${lensLabel} thread today: ${story.headline.length > 70 ? story.headline.slice(0, 67) + "…" : story.headline}.`;

  const question =
    theme === "Regulation"
      ? `Are ${lensLabel} teams updating compliance or client talking points off this—or is it still early?`
      : theme === "Policy"
        ? `Does this policy headline change any ${lensLabel} client plans this quarter, or is it mostly noise until rules are final?`
        : theme === "Deals & clients"
          ? `Are we hearing clients name this in calls yet, or is it still internal strategy chatter?`
          : theme === "Technology shift"
            ? `Is ${lensLabel} treating this as a near-term budget issue or a longer roadmap bet?`
            : `What would ${lensLabel} managers ask first about this story—risk, opportunity, or timing?`;

  return { line, question };
}

export { resolveTieredNews as resolveTieredIndustry };
