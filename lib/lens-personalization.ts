import type { EditionContent, Story } from "@/lib/types";
import { buildMarketTalkingPoint } from "@/lib/markets-story-display";
import type { PersonalEditionContent } from "@/lib/config-types";
import {
  DEFAULT_CORP_TOGGLES,
  DEFAULT_MED_TOGGLES,
  SEED_LENSES,
} from "@/config/seed-lenses-modules";

export const DEFAULT_NONPROFIT_TOGGLES: Record<string, boolean> = {
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
  podcast_pick: true,
};

export const DEFAULT_TECH_TOGGLES: Record<string, boolean> = {
  ...DEFAULT_CORP_TOGGLES,
  books: true,
  movies: true,
  podcast_pick: true,
};

const SLUG_TO_NAME = Object.fromEntries(
  SEED_LENSES.map((l) => [l.slug, l.name])
);

const SLUG_TO_ADDON = Object.fromEntries(
  SEED_LENSES.map((l) => [l.slug, l.prompt_addon])
);

export function resolveLensDisplayName(
  slugOrName: string | undefined | null,
  fallback = "your field"
): string {
  if (!slugOrName || slugOrName === "none") return fallback;
  if (SLUG_TO_NAME[slugOrName]) return SLUG_TO_NAME[slugOrName];
  if (slugOrName.includes("_") || slugOrName === slugOrName.toLowerCase()) {
    return slugOrName.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }
  return slugOrName;
}

export function getDefaultTogglesForLens(slug: string): Record<string, boolean> {
  switch (slug) {
    case "medical":
      return { ...DEFAULT_MED_TOGGLES };
    case "nonprofit":
      return { ...DEFAULT_NONPROFIT_TOGGLES };
    case "technology":
    case "product":
    case "data_analytics":
      return { ...DEFAULT_TECH_TOGGLES };
    default:
      return { ...DEFAULT_CORP_TOGGLES };
  }
}

type LensFraming = {
  lede: string;
  industrySynopsis: string;
  talkingPoints: string[];
  storyAngles: Record<string, string>;
};

const LENS_FRAMING: Record<string, LensFraming> = {
  medical: {
    lede:
      "Overnight policy and research headlines filtered for medical readers—clinical impact, public health, and what hospital or lab teams may reference before rounds.",
    industrySynopsis:
      "Today's coverage emphasizes health policy, research funding, and care delivery—angles your preceptors and attendings are likely to mention.",
    talkingPoints: [
      "Ask whether anyone on the team is tracking the Medicare or FDA headline from today—shows you connect news to patient care context.",
      "If research funding comes up, try: 'Are we seeing more grant delays, or just different priority areas?'",
      "When public health policy is mentioned, ask how it might affect community clinics versus academic centers.",
    ],
    storyAngles: {
      "Global diplomacy stays focused on trade and security flashpoints":
        "Export controls on medical devices and pharma inputs can delay trials and supply—worth asking if your site has seen back-order issues.",
      "Energy and commodity prices still shape inflation narratives":
        "Hospital operating costs and supply chain budgets track energy and commodity swings—relevant if anyone discusses margin pressure in health systems.",
      "Election-year policy leaks are moving sector models before any votes are cast":
        "Medicare Advantage and Medicaid reimbursement leaks move hospital planning faster than most clinical headlines—managers in health systems watch this closely.",
      "Cyber incidents on physical infrastructure are forcing real money decisions this quarter—not theoretical risk reviews":
        "Hospital ransomware and EHR outages are board-level issues—if IT security comes up, ask whether downtime playbooks were updated this quarter.",
      "Climate-linked disasters keep insurance markets tight":
        "Rural hospitals and community health centers feel insurance retreat first—useful if your team discusses disaster preparedness or facility planning.",
      "S&P 500 edges higher as mega-cap tech leads; yields hold near recent range":
        "Hospital endowment and pension returns track broad equity moves—relevant if finance comes up on an admin rotation.",
      "Fed officials stress data dependence; rate-cut bets push toward September":
        "Hospital bond and pension portfolios are rate-sensitive—shifts in cut timing change endowment income assumptions that finance committees track closely.",
      "Deal chatter picks up as IPO window cracks open for select issuers":
        "Biotech financing windows affect research hiring and trial starts—relevant if anyone mentions lab expansion or grant-funded positions.",
      "Central bank communication still drives rate expectations":
        "Municipal hospital bonds and nonprofit health system debt are rate-sensitive—fair question if finance comes up on a admin rotation.",
    },
  },
  technology: {
    lede:
      "AI capex, cloud shifts, and antitrust headlines—framed for product and engineering teams deciding what to build, buy, or deprecate this quarter.",
    industrySynopsis:
      "Coverage weighted toward platform moves, enterprise software, semiconductors, and regulation that shows up in roadmap and vendor reviews.",
    talkingPoints: [
      "If AI spend comes up, ask whether the conversation is about inference cost, training capex, or governance—that shows technical fluency.",
      "On today's biggest tech headline: 'Are we building, partnering, or waiting?' is a strong stand-up question.",
      "When antitrust or regulation is mentioned, ask which product surface area legal is reviewing first.",
    ],
    storyAngles: {
      "Global diplomacy stays focused on trade and security flashpoints":
        "Chip and cloud export rules directly affect GPU availability and model deployment timelines—engineering leads will reference this in capacity planning.",
      "Energy and commodity prices still shape inflation narratives":
        "Data-center power costs are a first-order input for cloud unit economics—relevant when finance asks about infra spend.",
      "Election-year policy leaks are moving sector models before any votes are cast":
        "Manufacturing credits and CHIPS-style incentives change where teams host inference and train models—strategy conversations will cite this.",
      "Cyber incidents on physical infrastructure are forcing real money decisions this quarter—not theoretical risk reviews":
        "Supply-chain and SaaS security incidents drive vendor review cycles—ask whether your team's third-party risk process was updated this year.",
      "S&P 500 edges higher as mega-cap tech leads; yields hold near recent range":
        "Hyperscaler capex guides set the tone for AI tooling budgets—if your manager mentions 'efficiency,' connect it to whether spend is shifting to inference.",
      "Fed officials stress data dependence; rate-cut bets push toward September":
        "Higher rates slow late-stage funding and extend enterprise sales cycles—worth mentioning if GTM targets are discussed.",
      "Deal chatter picks up as IPO window cracks open for select issuers":
        "IPO and M&A windows affect comp bands and equity liquidity in tech—useful context if recruiting or headcount comes up.",
      "Central bank communication still drives rate expectations":
        "Higher rates slow late-stage funding and extend sales cycles for enterprise software—worth mentioning if GTM targets are discussed.",
    },
  },
  audit: {
    lede:
      "Regulatory, audit, and client-risk headlines—selected so you can sound prepared in stand-ups, walkthroughs, and client calls during busy season.",
    industrySynopsis:
      "Stories emphasize controls, disclosure, PCAOB/SEC developments, and what engagement teams are likely to ask interns to track.",
    talkingPoints: [
      "On today's trade or policy headline: ask whether clients are updating vendor due diligence or control narratives.",
      "If a company name from the news is in your client's industry, ask whether the team has a monitoring note on it.",
      "When rates or deals come up, connect it to going-concern and impairment conversations—credible audit intern move.",
    ],
    storyAngles: {
      "Global diplomacy stays focused on trade and security flashpoints":
        "Trade controls expand audit evidence requests—clients may need updated vendor and transfer-pricing documentation sooner than usual.",
      "Energy and commodity prices still shape inflation narratives":
        "Commodity volatility flows into inventory valuation and hedge accounting—managers will ask if clients updated assumptions this quarter.",
      "Election-year policy leaks are moving sector models before any votes are cast":
        "Tax credit and manufacturing incentive leaks change deferred tax and credit recognition models—watch for client FAQ traffic.",
      "Cyber incidents on physical infrastructure are forcing real money decisions this quarter—not theoretical risk reviews":
        "Cyber incidents trigger incident-response controls testing—ask whether your clients refreshed ITGC narratives after recent advisories.",
      "S&P 500 edges higher as mega-cap tech leads; yields hold near recent range":
        "Client impairment and fair-value narratives often reference broad index moves—even a calm tape affects going-concern sensitivity analyses.",
      "Fed officials stress data dependence; rate-cut bets push toward September":
        "Rate moves affect impairment triggers and covenant compliance—engagement teams watch Fed speak for client industries with heavy debt loads.",
      "Deal chatter picks up as IPO window cracks open for select issuers":
        "IPO windows affect revenue recognition and S-1 disclosure scrutiny—live deal chatter means more client FAQ traffic for capital markets-adjacent teams.",
      "Mega-cap tech and AI capex dominate market conversation":
        "Capitalization vs. expense judgments on AI spend are live client questions—useful if your team discusses emerging tech audits.",
      "Deal flow and IPO windows remain a barometer of risk appetite":
        "IPO windows affect revenue recognition and S-1 disclosure scrutiny—relevant for capital markets adjacent teams.",
      "Central bank communication still drives rate expectations":
        "Rate moves affect impairment triggers and covenant compliance—classic audit conversation starter with industry teams.",
    },
  },
  tax: {
    lede:
      "Federal and state tax policy, compliance deadlines, and entity-structure headlines—filtered for tax interns building technical credibility early.",
    industrySynopsis:
      "Emphasis on legislative drafts, IRS guidance, cross-border rules, and what tax managers will expect you to have skimmed.",
    talkingPoints: [
      "If a policy leak mentions credits or rates, ask which client industries are running impact models first.",
      "On international trade news: 'Are we seeing more transfer-pricing memos this month?' is a sharp question.",
      "When M&A headlines land, ask whether the team is tracking treatment of earn-outs and NOLs.",
    ],
    storyAngles: {
      "Global diplomacy stays focused on trade and security flashpoints":
        "Tariff and export-control changes reopen customs and transfer-pricing positions—tax managers will ask for client industry examples.",
      "Election-year policy leaks are moving sector models before any votes are cast":
        "Manufacturing and energy credit leaks are immediate modeling exercises—this is core tax intern prep material.",
      "S&P 500 edges higher as mega-cap tech leads; yields hold near recent range":
        "Equity strength can accelerate estimated tax payment planning for clients with large unrealized positions—indices matter for tax timing conversations.",
      "Fed officials stress data dependence; rate-cut bets push toward September":
        "Rate and inflation paths affect estimated payments and entity planning—tax managers track cut odds for client modeling requests.",
      "Deal chatter picks up as IPO window cracks open for select issuers":
        "Deal flow drives §382, structuring, and withholding questions—thicker M&A headlines usually mean more technical memo work.",
      "Mega-cap tech and AI capex dominate market conversation":
        "R&D and capitalization elections for AI spend are active client debates—connect market headlines to technical memo work.",
      "Deal flow and IPO windows remain a barometer of risk appetite":
        "Deal flow drives §382, structuring, and withholding questions—mention one headline company if M&A comes up.",
      "Central bank communication still drives rate expectations":
        "Rate and inflation paths affect estimated payments and planning—safe hallway question for tax teams.",
    },
  },
  nonprofit: {
    lede:
      "Grants, donor policy, and mission-driven sector news—selected for nonprofit teams balancing impact, compliance, and stakeholder trust.",
    industrySynopsis:
      "Headlines framed around funding cycles, foundation policy, advocacy, and what program and development staff may discuss today.",
    talkingPoints: [
      "Ask whether today's policy headline could affect grant timelines or restricted-fund reporting for your partners.",
      "If inflation or costs come up, try: 'Are we seeing donors shift from multi-year gifts to shorter commitments?'",
      "When regulation is mentioned, ask how it lands for 501(c)(3) compliance versus advocacy arms.",
    ],
    storyAngles: {
      "Global diplomacy stays focused on trade and security flashpoints":
        "Humanitarian logistics and grant compliance get harder when trade routes shift—relevant for international program teams.",
      "Energy and commodity prices still shape inflation narratives":
        "Operating grants rarely keep pace with inflation—development teams feel this in renewal conversations first.",
      "Election-year policy leaks are moving sector models before any votes are cast":
        "Nonprofit advocacy rules and donor disclosure debates intensify in election years—worth noting in coalition meetings.",
      "Climate-linked disasters keep insurance markets tight":
        "Community nonprofits face higher facility insurance costs—program leads may discuss site consolidation or remote work.",
      "S&P 500 edges higher as mega-cap tech leads; yields hold near recent range":
        "Endowment and reserve portfolios drive operating grant capacity—a positive tape can ease donor anxiety about multi-year commitments.",
      "Fed officials stress data dependence; rate-cut bets push toward September":
        "Endowment and reserve income assumptions change with rates—finance committees revise payout policy when cut timing shifts.",
      "Deal chatter picks up as IPO window cracks open for select issuers":
        "A healthier deal market can signal more corporate foundation giving and sponsored programs—development teams watch IPO/M&A as a donor-confidence proxy.",
      "Mega-cap tech and AI capex dominate market conversation":
        "Foundation tech grants and AI-for-good programs follow corporate capex cycles—ask if your org is revisiting data grants.",
      "Central bank communication still drives rate expectations":
        "Endowment and reserve income assumptions change with rates—finance committees will reference this.",
    },
  },
};

export function getLensMarketWhyItMatters(
  headline: string,
  lensSlug: string,
  _lensName: string
): string | null {
  return LENS_FRAMING[lensSlug]?.storyAngles[headline] ?? null;
}

function fallbackWhyItMatters(lensSlug: string, lensName: string, headline: string): string {
  const addon = SLUG_TO_ADDON[lensSlug];
  const short =
    headline.length > 60 ? `${headline.slice(0, 57)}…` : headline;
  if (addon) {
    return `${addon.split(".")[0]}. Today's move on "${short}" changes which ${lensName} conversations are live—not just what moved on the tape.`;
  }
  return `This market headline affects planning and client talk in ${lensName}—the stakes are in second-order effects, not the index print alone.`;
}

function personalizeStory(story: Story, lensSlug: string, lensName: string): Story {
  const framing = LENS_FRAMING[lensSlug];
  const angle =
    framing?.storyAngles[story.headline] ??
    fallbackWhyItMatters(lensSlug, lensName, story.headline);

  const personalized: Story = {
    ...story,
    whyItMatters: angle,
  };

  return {
    ...personalized,
    talkingPoint: buildMarketTalkingPoint(personalized, lensName),
  };
}

export function personalizeEditionForLens(
  content: EditionContent,
  lensSlug: string,
  lensName: string
): EditionContent {
  const framing = LENS_FRAMING[lensSlug];
  const resolvedName = lensName || resolveLensDisplayName(lensSlug);

  return {
    ...content,
    lede: framing?.lede ?? content.lede.replace(/your field|corporate job|interns/gi, resolvedName),
    sections: content.sections.map((section) => ({
      ...section,
      stories: section.stories.map((st) =>
        personalizeStory(st, lensSlug, resolvedName)
      ),
    })),
    talkingPoints: framing?.talkingPoints ?? content.talkingPoints.map((tp) =>
      tp.includes(resolvedName) ? tp : `${tp} (framed for ${resolvedName})`
    ),
  };
}

export function personalizePersonalContent(
  content: PersonalEditionContent,
  lensSlug: string,
  lensName: string
): PersonalEditionContent {
  const resolvedName = lensName || resolveLensDisplayName(lensSlug);
  const framing = LENS_FRAMING[lensSlug];
  const base = personalizeEditionForLens(content, lensSlug, resolvedName);

  const modules = (content.modules ?? []).map((mod) => {
    if (mod.slug !== "industry_lens") return mod;
    return {
      ...mod,
      synopsis:
        framing?.industrySynopsis ??
        `Today's briefing is filtered for ${resolvedName}. Headlines and talking points emphasize what teams in your field are likely discussing.`,
      items: mod.items?.map((item) => ({
        ...item,
        synopsis: item.synopsis.includes(resolvedName)
          ? item.synopsis
          : `${item.synopsis} Lens: ${resolvedName}.`,
        description: item.description.includes(resolvedName)
          ? item.description
          : `${item.description} Tie examples back to ${resolvedName} when you share this.`,
      })),
    };
  });

  return {
    ...base,
    modules,
    meta: {
      ...content.meta,
      primaryLens: resolvedName,
      primaryLensSlug: lensSlug,
    },
  };
}

export const LENS_PERSONALIZATION_PROMPT = `
LENS PERSONALIZATION (mandatory — every reader must get a DIFFERENT edition):
- The primary lens defines vocabulary, examples, and "why it matters" for EVERY story and module.
- A Medical reader and a Technology reader MUST see different whyItMatters text for the same headline.
- An Audit/Tax reader and a Nonprofit reader MUST see different industry_lens copy and talking points.
- Use the primary lens editor notes below; if secondary lens is set, weave it into industry_lens or one talking point.
- Never write generic "at work" filler—name the lens (e.g. "hospital finance", "platform teams", "grant compliance").
- industry_lens module: write ONLY for the primary lens—synopsis, items, and questions must not apply equally to other fields.
- Books/movies/hobbies picks should skew toward the reader's lens and hobby chips when possible.`;

export function categorySubtitleForLens(
  category: string,
  lensName: string
): string | undefined {
  const subs: Record<string, string> = {
    news: `World and policy news—why it matters for ${lensName}.`,
    markets: `Overnight moves framed for ${lensName} conversations.`,
    industry: `Why today's headlines matter specifically for ${lensName}.`,
    hobbies: `Culture picks matched to your interests and ${lensName} context.`,
  };
  return subs[category];
}
