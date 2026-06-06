import type { Story } from "@/lib/types";
import type { MarketTalkingPoint } from "@/lib/markets-story-display";
import {
  buildMarketTalkingPoint,
  inferMarketTheme,
} from "@/lib/markets-story-display";
import { SAMPLE_MARKETS_STORIES } from "@/lib/sample-markets-stories";
import { getLensMarketWhyItMatters } from "@/lib/lens-personalization";

type BaselineEntry = {
  whyItMatters: string;
  talkingPoint: MarketTalkingPoint;
};

/** Canonical copy — applied at display time so old editions don't need regeneration. */
const BASELINE_BY_HEADLINE: Record<string, BaselineEntry> = Object.fromEntries(
  SAMPLE_MARKETS_STORIES.map((s) => [
    s.headline,
    {
      whyItMatters: s.whyItMatters,
      talkingPoint: s.talkingPoint!,
    },
  ])
);

/** Legacy headlines still in older stored editions */
BASELINE_BY_HEADLINE["Mega-cap tech and AI capex dominate market conversation"] = {
  whyItMatters:
    "When mega-caps lead on AI spend, the market story is about earnings validation and capex discipline—not just hype. Budget owners and deal teams hear this as a question of whether AI investment is translating into margins.",
  talkingPoint: {
    line: "Business press is still anchored on AI infrastructure spending and whether valuations reflect near-term earnings or long-run optionality.",
    question:
      "Is the sharper debate whether AI capex is hitting P&L yet—or still being capitalized and talked about as option value?",
  },
};

BASELINE_BY_HEADLINE[
  "Deal flow and IPO windows remain a barometer of risk appetite"
] = {
  whyItMatters:
    "IPO windows and M&A volume are sentiment gauges—when they reopen, boards signal selective offense again. Anyone near advisory, banking, or corp-dev work will hear clients reference this before they reference the S&P.",
  talkingPoint: {
    line: "M&A and listing headlines are a quick read on whether boards feel bullish enough to transact—or still in defensive mode.",
    question:
      "Are we seeing clients accelerate live deal work, or just watching headlines until financing conditions improve?",
  },
};

const WEAK_PATTERNS =
  /hallway line|if markets come up|safe (?:hallway|question)|worth a (?:quick )?mention|sounds informed|can you tie|when someone mentions|leading with/i;

export function isWeakMarketWhyItMatters(text: string | undefined): boolean {
  if (!text?.trim()) return true;
  if (text.trim().length < 40) return true;
  return WEAK_PATTERNS.test(text);
}

function themeWhyItMatters(story: Story, lensLabel: string): string {
  const theme = inferMarketTheme(story);
  switch (theme) {
    case "Rates & Fed":
      return `When cut odds or yields shift, the discount rate behind deals and project approvals moves with them—${lensLabel} conversations often track policy paths before they track index levels.`;
    case "Earnings":
      return `Earnings weeks reprice what the market is paying for growth; that changes how ${lensLabel} teams talk about client health, budgets, and hiring—not just ticker moves.`;
    case "Deals & IPOs":
      return `Deal and IPO headlines signal whether boards are playing offense again; for ${lensLabel} work, that often matters more than a half-point on the S&P.`;
    case "Mega-cap tech":
      return `Mega-cap tech still sets the tone for the index—so AI and cloud spend narratives spill into ${lensLabel} planning even when your work isn't trading stocks.`;
    case "Sector rotation":
      return `Sector leadership tells you where risk is flowing; ${lensLabel} teams use that to frame which industries clients mention first in meetings.`;
    default:
      return `Overnight moves change which risks clients and managers name first—${lensLabel} prep is about that second-order effect, not reciting the headline.`;
  }
}

function lensAwareQuestion(
  point: MarketTalkingPoint,
  lensLabel: string
): MarketTalkingPoint {
  if (point.question.includes(lensLabel)) return point;
  return {
    ...point,
    question: point.question.replace(
      /Are (?:we|clients)/,
      `Are ${lensLabel} teams`
    ),
  };
}

/**
 * Apply display-time baseline for whyItMatters + talkingPoint.
 * Runs on every Markets page load — no regeneration required.
 */
export function applyMarketsBaseline(
  story: Story,
  lensLabel: string,
  lensSlug?: string | null
): Story {
  const canonical = BASELINE_BY_HEADLINE[story.headline];
  const lensAngle =
    lensSlug && getLensMarketWhyItMatters(story.headline, lensSlug, lensLabel);

  let whyItMatters = story.whyItMatters?.trim() ?? "";

  if (lensAngle) {
    whyItMatters = lensAngle;
  } else if (canonical && isWeakMarketWhyItMatters(whyItMatters)) {
    whyItMatters = canonical.whyItMatters;
  } else if (isWeakMarketWhyItMatters(whyItMatters)) {
    whyItMatters = canonical?.whyItMatters ?? themeWhyItMatters(story, lensLabel);
  }

  const talkingPoint = canonical
    ? lensAwareQuestion(canonical.talkingPoint, lensLabel)
    : buildMarketTalkingPoint({ ...story, whyItMatters }, lensLabel);

  return {
    ...story,
    whyItMatters,
    talkingPoint,
  };
}
