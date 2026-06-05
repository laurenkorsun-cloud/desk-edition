import type { EditionContent } from "@/lib/types";
import { SAMPLE_WORLD_NEWS } from "@/lib/sample-news-stories";

export function getSampleEditionContent(): EditionContent {
  return {
    lede: "Markets are watching central banks, while geopolitics and AI investment keep showing up in every client conversation—here's your cheat sheet before the office small talk starts.",
    sections: [
      {
        name: "World",
        stories: SAMPLE_WORLD_NEWS,
      },
      {
        name: "Business & markets",
        stories: [
          {
            headline: "Mega-cap tech and AI capex dominate market conversation",
            summary:
              "Business press continues to track AI infrastructure spending, cloud demand, and whether valuations reflect near-term earnings or long-run optionality.",
            whyItMatters:
              "Even in accounting and advisory, clients reference AI spend—asking how it maps to capitalization vs. expense is a credible intern move.",
            sourceUrl: "https://www.cnbc.com/",
            sourceName: "CNBC",
          },
          {
            headline: "Deal flow and IPO windows remain a barometer of risk appetite",
            summary:
              "M&A and listing activity in the headlines signal whether boards are offensive or defensive—useful for understanding client tone in advisory conversations.",
            whyItMatters:
              "When a manager mentions 'busy season,' you can connect it to whether clients are closing transactions or just running steady-state compliance.",
            sourceUrl: "https://www.marketwatch.com/",
            sourceName: "MarketWatch",
          },
        ],
      },
      {
        name: "Policy & work",
        stories: [
          {
            headline: "Central bank communication still drives rate expectations",
            summary:
              "Fed and peer institutions remain in the news cycle via speeches and data releases. The workplace angle: financing costs and discount rates affect project approvals.",
            whyItMatters:
              "A safe hallway question: 'Are we seeing clients pause projects because of rate uncertainty?'",
            sourceUrl: "https://www.federalreserve.gov/",
            sourceName: "Federal Reserve",
          },
        ],
      },
      {
        name: "One interesting thing",
        stories: [
          {
            headline: "Workplace norms keep shifting for new grads",
            summary:
              "Ongoing coverage of return-to-office, hybrid expectations, and early-career development suggests your cohort is negotiating identity at work—not just tasks.",
            whyItMatters:
              "Talking about how your team structures mentorship or feedback sounds thoughtful without being political.",
            sourceUrl: "https://www.npr.org/",
            sourceName: "NPR",
          },
        ],
      },
    ],
    talkingPoints: [
      "Ask your manager which headline clients mentioned most this week—you'll learn what industries your office actually serves.",
      "If markets come up, try: 'Are we seeing more clients delay deals, or just reprice them?'—it's specific and non-partisan.",
      "When AI is mentioned, ask whether the conversation was about cost savings, revenue growth, or governance—that shows you listen for substance.",
      "Offer a light take on hybrid work by asking what 'good collaboration' looks like on your team this month.",
      "If someone mentions inflation, follow up with 'which cost line surprised you?' rather than debating macro policy.",
    ],
    emailBullets: [
      "World: Trade and security headlines still affect supply-chain and compliance talk.",
      "Markets: AI infrastructure spend remains the default investor narrative.",
      "Deals: M&A/IPO coverage is a quick read on whether boards feel bullish or cautious.",
      "Policy: Fed communication still anchors rate and project-approval conversations.",
      "Culture: Hybrid and early-career norms are fair game for thoughtful lunch chat.",
      "Your move: Pick one talking point below and use it before noon.",
    ],
  };
}
