import {
  MARKETS_LEDE_MAX_WORDS,
  MARKETS_DEPTH_MIN_WORDS,
} from "@/config/markets-editorial";
import { wordCount } from "@/lib/enrich-news-stories";
import type { Story } from "@/lib/types";

export type MarketTalkingPoint = {
  line: string;
  question: string;
};

export type MarketMoveChip = {
  label: string;
  value: string;
  direction: "up" | "down" | "flat";
};

export type TieredMarketsDisplay = {
  lede: string;
  depth: string | null;
  analysis: string | null;
  hasExpand: boolean;
};

const THEME_RULES: { theme: string; pattern: RegExp }[] = [
  { theme: "Rates & Fed", pattern: /fed|fomc|rate|yield|treasury|cpi|inflation|bps/i },
  { theme: "Earnings", pattern: /earnings|revenue|profit|guidance|eps|results/i },
  { theme: "Deals & IPOs", pattern: /ipo|m&a|merger|acquisition|deal|listing|buyout/i },
  { theme: "Sector rotation", pattern: /sector|rotation|energy|utilities|financials|semiconductor/i },
  { theme: "Global markets", pattern: /europe|asia|china|emerging|fx|dollar|yen|euro/i },
  { theme: "Mega-cap tech", pattern: /mega-cap|magnificent|nvidia|apple|microsoft|alphabet|meta|ai capex/i },
];

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

  return {
    taken: taken.join("\n\n"),
    rest: paragraphs.slice(restStart).join("\n\n").trim(),
  };
}

function firstNumber(text: string): string | null {
  const m = text.match(
    /(?:\+|−|-)?\s*\d[\d,.]*(?:%|bps|points)?|\d+(?:\.\d+)?%|~\d+%/i
  );
  return m ? m[0].replace(/\s+/g, "") : null;
}

function firstSentence(text: string): string {
  const s = text.trim().split(/[.!?]/)[0]?.trim();
  return s ? `${s}.` : text.trim().slice(0, 120);
}

export function resolveTieredMarkets(story: Story): TieredMarketsDisplay {
  const summary = story.summary?.trim() ?? "";
  const synopsis = story.synopsis?.trim() ?? "";
  const description = story.description?.trim() ?? "";

  if (wordCount(summary) >= 15 && wordCount(summary) <= MARKETS_LEDE_MAX_WORDS + 40) {
    const depthParts = [synopsis, description]
      .filter((p) => p && p !== summary)
      .join("\n\n")
      .trim();
    return {
      lede: summary,
      depth: depthParts || null,
      analysis: null,
      hasExpand: wordCount(depthParts) >= MARKETS_DEPTH_MIN_WORDS / 2,
    };
  }

  const merged = [summary, synopsis, description].filter(Boolean).join("\n\n");
  const { taken, rest } = firstParagraphs(merged, MARKETS_LEDE_MAX_WORDS);
  return {
    lede: taken || merged,
    depth: rest || null,
    analysis: null,
    hasExpand: wordCount(rest) >= 40,
  };
}

export function inferMarketTheme(story: Story): string {
  const text = [story.headline, story.summary, story.synopsis]
    .filter(Boolean)
    .join(" ");
  for (const { theme, pattern } of THEME_RULES) {
    if (pattern.test(text)) return theme;
  }
  return "Markets";
}

function parseDirection(value: string): "up" | "down" | "flat" {
  if (/^\+|up|gain|rise|higher|outperform/i.test(value)) return "up";
  if (/^-|−|down|fall|drop|lower|slip|lag/i.test(value)) return "down";
  return "flat";
}

export function extractMoveChips(story: Story): MarketMoveChip[] {
  const text = [story.headline, story.summary, story.synopsis]
    .filter(Boolean)
    .join(" ");
  const chips: MarketMoveChip[] = [];
  const seen = new Set<string>();

  const patterns: { label: string; regex: RegExp }[] = [
    {
      label: "S&P",
      regex:
        /S&P\s*500[^.]{0,30}?((?:\+|−|-)\s*[\d.]+%?|[\d.]+%)/i,
    },
    {
      label: "Nasdaq",
      regex:
        /Nasdaq(?:\s*100)?[^.]{0,30}?((?:\+|−|-)\s*[\d.]+%?|[\d.]+%)/i,
    },
    {
      label: "Dow",
      regex: /Dow[^.]{0,30}?((?:\+|−|-)\s*[\d.]+%?|[\d.]+%)/i,
    },
    {
      label: "10Y yield",
      regex:
        /10-?year[^.]{0,35}?([\d.]+%|(?:\+|−|-)\s*[\d.]+\s*bps?)/i,
    },
    {
      label: "Move",
      regex: /((?:\+|−|-)\s*[\d.]+%)/,
    },
  ];

  for (const { label, regex } of patterns) {
    const m = text.match(regex);
    if (!m || seen.has(label)) continue;
    const value = m[1].trim();
    seen.add(label);
    chips.push({
      label,
      value,
      direction: parseDirection(value),
    });
    if (chips.length >= 3) break;
  }

  return chips;
}

function buildObservationLine(story: Story): string {
  const text = [story.summary, story.synopsis, story.headline].join(" ");
  const num = firstNumber(text);
  if (num) {
    const theme = inferMarketTheme(story);
    return `Today's ${theme.toLowerCase()} coverage centers on ${num}—a concrete detail you can reference without sounding like you watched futures all morning.`;
  }
  return firstSentence(story.summary || story.headline);
}

function buildInternQuestion(story: Story, lensLabel: string): string {
  const theme = inferMarketTheme(story);
  const text = [story.summary, story.synopsis].join(" ");
  const num = firstNumber(text);
  const numRef = num ? ` after ${num} showed up in the tape` : "";

  switch (theme) {
    case "Rates & Fed":
      return `Are ${lensLabel} clients changing financing or capex assumptions${numRef}, or is everyone still waiting on the next inflation print before updating models?`;
    case "Earnings":
      return `If earnings come up, is your team more focused on margin and capex guidance—or just whether megacaps cleared lowered bars?`;
    case "Deals & IPOs":
      return `Are we actually seeing more live deal or IPO prep work${numRef}, or is this still headline chatter until spreads tighten further?`;
    case "Mega-cap tech":
      return `Is AI spend showing up in ${lensLabel} conversations as a budget line yet, or still as a strategic "watch item"?`;
    case "Sector rotation":
      return `Does today's sector leadership change how your team talks about winners and losers in ${lensLabel}—or is it still a macro-only story?`;
    case "Global markets":
      return `Are overseas moves affecting any ${lensLabel} clients' supply chains or revenue mix—or is this mostly index-level noise domestically?`;
    default:
      return `What would ${lensLabel} teams watch first from this move—second-order effects on clients, or just the headline index print?`;
  }
}

export function buildMarketTalkingPoint(
  story: Story,
  lensLabel: string
): MarketTalkingPoint {
  if (story.talkingPoint?.line && story.talkingPoint?.question) {
    return story.talkingPoint;
  }

  return {
    line: buildObservationLine(story),
    question: buildInternQuestion(story, lensLabel),
  };
}

/** First sentence of lede for collapsed preview */
export function collapsedMarketsLede(story: Story): string {
  const tiered = resolveTieredMarkets(story);
  const first = tiered.lede.split(/[.!?]/)[0]?.trim();
  return first ? `${first}.` : tiered.lede.slice(0, 160);
}
