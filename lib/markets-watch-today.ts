import type { MarketsMeta } from "@/lib/config-types";
import type { Story } from "@/lib/types";
import { inferMarketTheme } from "@/lib/markets-story-display";

export type WatchTodayItem = {
  text: string;
  hint?: string;
};

export type WatchTodayDisplay = {
  intro: string;
  items: WatchTodayItem[];
};

const WATCH_HINTS: Record<string, string> = {
  fed: "The Federal Reserve sets interest rates—when officials speak, markets listen for hints about cuts or hikes.",
  cpi: "Inflation data (CPI) shows whether prices are still rising fast—hotter numbers often make stocks nervous.",
  inflation: "Inflation reports can change rate expectations overnight.",
  earnings: "Big companies reporting profits can pull the whole market up or down in after-hours trading.",
  ipo: "New stock listings and mergers signal whether executives feel confident enough to do deals.",
  deal: "More deal headlines usually mean companies are feeling less defensive about spending money.",
  jobs: "Jobs data affects whether the Fed thinks the economy is too hot or cooling off.",
  payroll: "Employment numbers influence Fed policy and rate expectations.",
};

function hintForItem(text: string): string | undefined {
  const lower = text.toLowerCase();
  for (const [key, hint] of Object.entries(WATCH_HINTS)) {
    if (lower.includes(key)) return hint;
  }
  return undefined;
}

function humanizePulse(pulse: string): string {
  const parts: string[] = [];

  if (/s&p|spx|stocks?|index/i.test(pulse)) {
    if (/\+|up|higher|positive|gain/i.test(pulse)) {
      parts.push("U.S. stocks look set for a slightly positive day");
    } else if (/−|-\s*\d|down|lower|slip|fall/i.test(pulse)) {
      parts.push("U.S. stocks look softer overnight");
    } else {
      parts.push("U.S. stocks are roughly flat");
    }
  }

  if (/nasdaq|tech/i.test(pulse)) {
    if (/\+|lead|outperform|up/i.test(pulse)) {
      parts.push("big tech is doing most of the lifting");
    }
  }

  if (/yield|rate|fed|treasury/i.test(pulse)) {
    if (/steady|unchanged|little changed|hold|flat/i.test(pulse)) {
      parts.push("interest rates barely moved");
    } else if (/\+|up|rise|higher/i.test(pulse)) {
      parts.push("interest rates ticked up a bit");
    } else if (/−|-\s*\d|down|fall|lower/i.test(pulse)) {
      parts.push("interest rates eased slightly");
    }
  }

  if (/deal|ipo|m&a/i.test(pulse)) {
    parts.push("there's more chatter about company deals and new stock listings");
  }

  if (parts.length === 0) {
    return "Markets moved overnight—not dramatically, but enough that a few scheduled events today could change the tone.";
  }

  const sentence =
    parts.length === 1
      ? `${parts[0]}.`
      : `${parts[0]}, and ${parts.slice(1).join(", ")}.`;

  return `${sentence} Nothing wild so far—but check the list below for what could shift the mood before your first meeting.`;
}

function introFromStories(stories: Story[]): string {
  if (stories.length === 0) {
    return "No big market shock overnight—still worth scanning what’s on the calendar today in case something moves while you’re in meetings.";
  }

  const themes = stories.map((s) => inferMarketTheme(s));
  const hasTech = themes.some((t) => t === "Mega-cap tech" || t === "Earnings");
  const hasRates = themes.some((t) => t === "Rates & Fed");
  const hasDeals = themes.some((t) => t === "Deals & IPOs");

  const bits: string[] = ["Overnight, markets were in the news"];
  if (hasTech) bits.push("mostly around big tech and earnings");
  if (hasRates) bits.push("with interest-rate talk in the mix");
  if (hasDeals) bits.push("and more headlines about deals and IPOs");

  return `${bits.join(", ")}. Below is what to keep an eye on today—in plain terms.`;
}

function watchItemsFromStories(stories: Story[]): WatchTodayItem[] {
  const items: WatchTodayItem[] = [];
  for (const story of stories) {
    const text = [story.headline, story.summary].join(" ");
    if (/fed|fomc|rate/i.test(text) && !items.some((i) => /fed/i.test(i.text))) {
      items.push({
        text: "Fed officials or rate commentary today",
        hint: WATCH_HINTS.fed,
      });
    }
    if (/cpi|inflation/i.test(text) && !items.some((i) => /inflation|cpi/i.test(i.text))) {
      items.push({
        text: "Inflation data (CPI) on the calendar",
        hint: WATCH_HINTS.cpi,
      });
    }
    if (/earnings/i.test(text) && !items.some((i) => /earnings/i.test(i.text))) {
      items.push({
        text: "Company earnings reports",
        hint: WATCH_HINTS.earnings,
      });
    }
    if (/ipo|m&a|deal/i.test(text) && !items.some((i) => /deal|ipo/i.test(i.text))) {
      items.push({
        text: "Deal and IPO headlines",
        hint: WATCH_HINTS.deal,
      });
    }
  }
  return items.slice(0, 4);
}

export function resolveWatchTodayDisplay(
  meta: MarketsMeta | undefined,
  stories: Story[]
): WatchTodayDisplay {
  const rawIntro = meta?.intro?.trim() || meta?.pulse?.trim() || "";
  const intro = meta?.intro?.trim()
    ? meta.intro
    : rawIntro
      ? humanizePulse(rawIntro)
      : introFromStories(stories);

  const rawItems = meta?.watchItems ?? [];
  const items: WatchTodayItem[] =
    rawItems.length > 0
      ? rawItems.map((text) => ({
          text: humanizeWatchItemText(text),
          hint: hintForItem(text),
        }))
      : watchItemsFromStories(stories);

  return { intro, items };
}

function humanizeWatchItemText(text: string): string {
  const map: Record<string, string> = {
    "Fed speakers this morning":
      "Fed officials speaking today — comments on interest rates can move markets quickly",
    "Thursday CPI (core ~+0.2% m/m expected)":
      "Thursday inflation report (CPI) — hotter-than-expected numbers often make stocks drop",
    "Mega-cap earnings after the close":
      "Big tech earnings after the close — strong or weak results can set tomorrow's tone",
    "Mid-cap IPO filing updates":
      "More IPO and deal headlines — a sign companies may be feeling braver about spending",
  };
  return map[text] ?? text;
}
