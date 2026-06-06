import type { Story } from "@/lib/types";

function article(
  partial: Story & { synopsis: string; description: string }
): Story {
  return partial;
}

/** Tiered sample market stories for dev/sample mode. */
export const SAMPLE_MARKETS_STORIES: Story[] = [
  article({
    headline: "S&P 500 edges higher as mega-cap tech leads; yields hold near recent range",
    summary:
      "The S&P 500 rose about 0.6% in overnight futures trading while the Nasdaq 100 outperformed at +1.1%. The 10-year Treasury yield hovered near 4.25%, little changed after last week's data.",
    synopsis:
      "Index futures pointed to a positive open with technology carrying the tape. Semiconductor and cloud names led gainers after another round of AI infrastructure headlines, while defensives lagged.\n\nTraders cited light volume ahead of a busy earnings week and two Fed speakers on the calendar. Options markets priced modest upside into the close, with the VIX near 14—below its 30-day average.\n\nSector rotation favored growth over value for a second session; energy and utilities were flat to down as crude slipped roughly 0.4%. Banks tracked the broader market, with no major shift in rate-cut expectations implied by fed funds futures.",
    description:
      "The move is less about a single catalyst than sustained positioning into earnings. Mega-cap tech still sets the tone for index-level returns, so even neutral macro days can feel bullish when AI-linked names advance.\n\nFor office conversation, the useful frame is leadership (tech up, breadth mixed) rather than a dramatic macro shock.",
    whyItMatters:
      "When tech leads and rates barely move, the market story is really about earnings expectations and AI spend—not a macro scare. Teams advising on budgets or deals will hear this framed as risk-on positioning into results, not a fundamental shift in policy.",
    talkingPoint: {
      line: "Nasdaq futures outpaced the S&P by roughly half a point overnight (+1.1% vs +0.6%) while the 10-year held near 4.25%.",
      question:
        "Is the sharper question whether megacap earnings justify the AI capex narrative—or whether breadth is too narrow for this to last?",
    },
    sourceUrl: "https://www.cnbc.com/",
    sourceName: "CNBC",
  }),
  article({
    headline: "Fed officials stress data dependence; rate-cut bets push toward September",
    summary:
      "Fed funds futures now imply roughly a 55% chance of a cut by September, up from about 45% last week. Two officials emphasized inflation must cool further before policy eases.",
    synopsis:
      "Markets parsed weekend and Monday commentary from regional Fed presidents who repeated that policy is 'data dependent' but did not endorse near-term cuts. The 2-year yield moved about 3 bps on the week, a modest repricing rather than a dramatic shift.\n\nFixed-income desks noted that front-end rates remain the primary signal for equity multiples in the current regime—especially for long-duration growth stocks. Swap markets show investors still leaning toward one to two cuts in 2025, not the three-plus some bulls hoped for in spring.\n\nThe next catalyst is Thursday's CPI print, with consensus near +0.2% month-over-month core. A hotter number could unwind recent equity gains quickly.",
    description:
      "Rate expectations are the hidden driver behind many 'earnings beat, stock down' reactions. When officials push back on cuts, high-multiple sectors feel it first.\n\nInterns can sound sharp by asking whether the conversation is about the level of rates or the path—those are different risks for clients.",
    whyItMatters:
      "Cut-timing shifts the discount rate behind every DCF and deal model—so a 10-point move in September-cut odds can change how finance teams approve projects even when the S&P looks calm. That's why Fed speak matters more than the index print on days like this.",
    talkingPoint: {
      line: "Fed funds futures now imply ~55% odds of a September cut—up from ~45% last week, with the 2-year yield moving only ~3 bps.",
      question:
        "Are clients repricing deal timelines off this shift, or waiting for Thursday's CPI before changing assumptions?",
    },
    sourceUrl: "https://www.federalreserve.gov/",
    sourceName: "Federal Reserve",
  }),
  article({
    headline: "Deal chatter picks up as IPO window cracks open for select issuers",
    summary:
      "Three mid-cap tech issuers filed updated S-1 language this week, and bankers point to at least $8B in announced M&A across software and health-tech. Leveraged loan spreads tightened about 15 bps month-to-date.",
    synopsis:
      "After a quiet stretch, capital markets desks report more serious IPO prep calls and a handful of reverse inquiry on block trades. None of the filings guarantee near-term listings, but the pipeline is thicker than in Q1.\n\nM&A headlines clustered in enterprise software and healthcare IT, with purchase multiples discussed in the high single digits to low teens of revenue for growth assets—still below 2021 peaks but above 2023 troughs.\n\nCredit markets are cooperating: tighter loan spreads and stable high-yield issuance suggest boards may feel slightly more confident about financing deals than six months ago.",
    description:
      "Deal flow is a sentiment indicator. When IPO filings and M&A return to the front page, managers interpret it as boards shifting from pure defense to selective offense.\n\nFor advisory and banking interns, tying a specific deal headline to 'risk appetite' is more credible than generic market commentary.",
    whyItMatters:
      "IPO filings and tighter loan spreads are early signals that boards may fund growth again—not just cut costs. For anyone on advisory, banking, or corp-dev adjacent work, that changes which client conversations are live this quarter.",
    talkingPoint: {
      line: "At least $8B in software and health-tech M&A hit the headlines this week, with loan spreads ~15 bps tighter month-to-date.",
      question:
        "Are we seeing more inbound from clients on listings and M&A—or is this still banker marketing until a deal actually prices?",
    },
    sourceUrl: "https://www.marketwatch.com/",
    sourceName: "MarketWatch",
  }),
];

export const SAMPLE_MARKETS_META = {
  pulse:
    "S&P futures +0.6%, Nasdaq +1.1%, yields steady near 4.25% — tech leads, deal chatter picking up.",
  intro:
    "Stocks look set for a slightly positive open—big tech is leading, and interest rates barely moved overnight. Nothing dramatic yet, but a few things on today's calendar could change the mood before lunch.",
  watchItems: [
    "Fed officials speaking today — comments on interest rates can move markets quickly",
    "Thursday inflation report (CPI) — hotter-than-expected numbers often make stocks drop",
    "Big tech earnings after the close — strong or weak results can set tomorrow's tone",
    "More deal and IPO headlines — a sign companies may be feeling braver about spending",
  ],
};
