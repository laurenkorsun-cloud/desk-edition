import type { LensSeed, ModuleSeed } from "@/lib/config-types";

export const SEED_LENSES: LensSeed[] = [
  {
    slug: "audit",
    name: "Audit",
    sort_order: 1,
    prompt_addon:
      "Frame relevance for Big 4 / audit interns: clients, PCAOB, SEC, internal controls, busy season.",
    rss_feeds: [],
  },
  {
    slug: "tax",
    name: "Tax",
    sort_order: 2,
    prompt_addon:
      "Frame for tax interns: compliance deadlines, policy changes, entity structures, state/federal.",
    rss_feeds: [],
  },
  {
    slug: "wealth_management",
    name: "Wealth management",
    sort_order: 3,
    prompt_addon:
      "Frame for wealth/AM: markets, client portfolios, rates, regulation, HNW client concerns.",
    rss_feeds: [],
  },
  {
    slug: "technology",
    name: "Technology",
    sort_order: 4,
    prompt_addon:
      "Frame for tech industry: AI capex, cloud, semiconductors, antitrust, enterprise software.",
    rss_feeds: [],
  },
  {
    slug: "medical",
    name: "Medical",
    sort_order: 5,
    prompt_addon:
      "Frame for med students: clinical research, health policy, public health—not corporate finance jargon.",
    rss_feeds: [],
  },
  {
    slug: "consulting",
    name: "Consulting",
    sort_order: 6,
    prompt_addon:
      "Frame for consulting interns: strategy, operations, C-suite priorities, transformation.",
    rss_feeds: [],
  },
  {
    slug: "investment_banking",
    name: "Investment banking",
    sort_order: 7,
    prompt_addon:
      "Frame for IB: deal flow, M&A, IPO windows, leverage, sector trends, Fed impact on financing.",
    rss_feeds: [],
  },
  {
    slug: "environmental_science",
    name: "Environmental science",
    sort_order: 8,
    prompt_addon:
      "Frame for environmental science: climate policy, energy transition, regulation, ESG reporting.",
    rss_feeds: [],
  },
  {
    slug: "politics",
    name: "Politics",
    sort_order: 9,
    prompt_addon:
      "Frame for politics and public affairs: elections, legislation, regulation, geopolitics, and how policy affects business and markets—neutral, non-partisan, factual.",
    rss_feeds: [],
  },
  {
    slug: "legal",
    name: "Legal",
    sort_order: 10,
    prompt_addon:
      "Frame for legal interns and law students: courts, regulation, corporate law, litigation trends, compliance, and deals—what matters in firms, government, and in-house teams.",
    rss_feeds: [],
  },
];

export const SEED_MODULES: ModuleSeed[] = [
  {
    slug: "news",
    name: "News",
    description: "World and lens-filtered headlines",
    default_on: true,
    sort_order: 1,
    admin_body: "",
  },
  {
    slug: "markets",
    name: "Markets",
    description:
      "What moved overnight and why—indices, rates, sectors, and names to watch, in plain English.",
    default_on: true,
    sort_order: 2,
    admin_body: `Markets module — editorial instructions:
- Lead with the single biggest market story of the day (index moves, rates, FX, commodities).
- Call out what is up vs down (major indices, key stocks or sectors) and the main driver (data, Fed, earnings, geopolitics, deal news).
- Explain why it matters in one line for someone starting a corporate job—not for day traders.
- Flag 1–2 "up and coming" themes (sector rotation, IPO/M&A buzz, policy shift) they might hear at work.
- No buy/sell advice; neutral tone; avoid jargon or define it briefly.`,
  },
  {
    slug: "talking_points",
    name: "Talking points",
    description: "Conversation starters for work",
    default_on: true,
    sort_order: 3,
    admin_body: "",
  },
  {
    slug: "industry_lens",
    name: "Industry lens",
    description: "Why today matters for your lens",
    default_on: true,
    sort_order: 4,
    admin_body: "",
  },
  {
    slug: "books",
    name: "Books",
    description: "Short book synopsis or excerpt-style blurb",
    default_on: false,
    sort_order: 5,
    admin_body:
      "Edit weekly: featured book title, author, and 3-sentence synopsis for your audience.",
  },
  {
    slug: "music",
    name: "Music",
    description: "Spotify playlist or morning music link",
    requires_integration: "spotify",
    default_on: true,
    sort_order: 6,
    admin_body: "Default playlist URL if user has not connected Spotify.",
  },
  {
    slug: "weather",
    name: "Weather",
    description: "Local weather and one-line takeaway",
    default_on: true,
    sort_order: 7,
    admin_body: "",
  },
  {
    slug: "calendar",
    name: "Calendar",
    description: "Today's schedule (Google or manual notes)",
    requires_integration: "calendar",
    default_on: true,
    sort_order: 8,
    admin_body: "",
  },
  {
    slug: "vacation_planning",
    name: "Vacation planning",
    description: "Getaway ideas and planning prompts",
    default_on: false,
    sort_order: 9,
    admin_body:
      "Edit: seasonal vacation ideas, long-weekend prompts, or travel deals you want to highlight.",
  },
  {
    slug: "movies",
    name: "Movies",
    description: "New releases and one pick to watch",
    default_on: false,
    sort_order: 10,
    admin_body:
      "Edit: one film in theaters or streaming worth knowing about—no spoilers.",
  },
  {
    slug: "historical_fact",
    name: "Historical fact",
    description: "Something you didn't know",
    default_on: false,
    sort_order: 11,
    admin_body:
      "Edit: one surprising historical fact tied to today's date or news theme.",
  },
  {
    slug: "clothing_sales",
    name: "Clothing sales",
    description: "Curated sales and style deals",
    default_on: false,
    sort_order: 12,
    admin_body:
      "Edit: 2–3 sale links or retailers (business casual / professional wear).",
  },
];

export const DEFAULT_CORP_TOGGLES: Record<string, boolean> = {
  news: true,
  markets: true,
  talking_points: true,
  industry_lens: true,
  books: false,
  music: true,
  weather: true,
  calendar: true,
  vacation_planning: false,
  movies: false,
  historical_fact: false,
  clothing_sales: false,
};

export const DEFAULT_MED_TOGGLES: Record<string, boolean> = {
  news: true,
  markets: false,
  talking_points: true,
  industry_lens: true,
  books: true,
  music: true,
  weather: true,
  calendar: true,
  vacation_planning: false,
  movies: false,
  historical_fact: true,
  clothing_sales: false,
};
