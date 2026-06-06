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
  {
    slug: "general_business",
    name: "General business",
    sort_order: 11,
    prompt_addon:
      "Frame for general business roles: corporate strategy, office culture, cross-functional priorities, and headlines any professional should know.",
    rss_feeds: [],
  },
  {
    slug: "product",
    name: "Product",
    sort_order: 12,
    prompt_addon:
      "Frame for product managers and PM interns: roadmaps, launches, user research, competitive moves, and platform shifts.",
    rss_feeds: [],
  },
  {
    slug: "marketing",
    name: "Marketing",
    sort_order: 13,
    prompt_addon:
      "Frame for marketing roles: brand, campaigns, growth, social, and how consumer trends affect business.",
    rss_feeds: [],
  },
  {
    slug: "data_analytics",
    name: "Data & analytics",
    sort_order: 14,
    prompt_addon:
      "Frame for data and analytics roles: metrics, BI, experimentation, AI tooling, and how data drives decisions.",
    rss_feeds: [],
  },
  {
    slug: "hr",
    name: "HR",
    sort_order: 15,
    prompt_addon:
      "Frame for HR and people ops: hiring, culture, labor policy, benefits, and workplace trends.",
    rss_feeds: [],
  },
  {
    slug: "government",
    name: "Government",
    sort_order: 16,
    prompt_addon:
      "Frame for public-sector roles: agencies, budgets, regulation, and policy implementation.",
    rss_feeds: [],
  },
  {
    slug: "nonprofit",
    name: "Nonprofit",
    sort_order: 17,
    prompt_addon:
      "Frame for nonprofit roles: mission impact, grants, donors, and sector-specific policy.",
    rss_feeds: [],
  },
  {
    slug: "student",
    name: "Student",
    sort_order: 18,
    prompt_addon:
      "Frame for students and early-career readers: internships, recruiting, campus-to-office transition, and foundational business literacy.",
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
- Business & markets section: ${3} tiered stories with visible ledes (numbers required) + expandable depth.
- Return marketsMeta.pulse (one-line summary with 2–3 key %) and marketsMeta.watchItems (today's catalysts).
- Lead with what moved (indices, rates, sectors) and by roughly how much; then why.
- Tag themes: Rates & Fed, Earnings, Deals & IPOs, Sector rotation, Mega-cap tech.
- whyItMatters: concrete stakes comment (not a script). talkingPoint per story: observation with a number + educated intern question.
- No buy/sell advice; neutral tone; define jargon briefly.`,
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
    admin_body: `Industry lens module — editorial instructions:
- Write ONLY for the reader's primary lens (from READER PROFILE). A Medical edition and a Technology edition must not share the same synopsis.
- Tie today's top headline or sector theme to vocabulary that lens uses daily (e.g. clinical teams, platform roadmaps, grant cycles, audit clients).
- Include one item with a headline like "Why today matters for [lens name]" and concrete examples—not generic "at work" advice.
- If secondary lens is set, add one sentence bridging both fields.`,
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
      "Edit: 2–3 sale links or retailers (business casual / professional wear). Primary Nordstrom link: https://www.nordstrom.com/browse/sale/men/clothing",
  },
  {
    slug: "commute",
    name: "Commute",
    description: "Transit, traffic, and timing for your route",
    default_on: false,
    sort_order: 13,
    admin_body:
      "Edit: one practical commute note—transit delays, weather impact, or timing tip.",
  },
  {
    slug: "sports_scores",
    name: "Sports",
    description: "Scores and headlines worth knowing",
    default_on: false,
    sort_order: 14,
    admin_body:
      "Edit: 1–2 sports headlines or scores fans in the office might mention.",
  },
  {
    slug: "podcast_pick",
    name: "Podcast",
    description: "One listen recommendation for the morning",
    default_on: false,
    sort_order: 15,
    admin_body:
      "Edit: one podcast episode or show worth a commute listen—no spoilers.",
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
  commute: false,
  sports_scores: false,
  podcast_pick: false,
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
  commute: false,
  sports_scores: false,
  podcast_pick: false,
};
