import OpenAI from "openai";
import { formatHeadlinesForPrompt, type RawHeadline } from "@/lib/rss";
import { EditionContentSchema, type EditionContent } from "@/lib/types";
import { getSampleEditionContent } from "@/lib/sample-edition";
import { format } from "date-fns";

const SYSTEM_PROMPT = `You are the editor of "Desk Edition," a morning briefing for business students, interns, and new corporate professionals (accounting, consulting, finance, operations).

Your job: synthesize today's news headlines into a clear, neutral, worldly briefing.

Editorial rules:
- Neutral, factual tone. No partisan hot takes or predictions stated as fact.
- Prefer stories useful in corporate small talk: markets, mega-deals, regulation, geopolitics affecting business, Fed/policy, big tech, workplace trends.
- Talking points must reference specific stories and numbers from THIS edition (headline + fact)—never vague ("Markets are volatile").
- Summaries must be original — do not copy article text verbatim.
- Always include sourceUrl from the provided headlines when available; use empty string only if unknown.
- Sections required: "World" (6-8 in-depth stories with long synopsis and multi-paragraph description; include specific numbers from headlines), "Business & markets" (2-3 stories), "Policy & work" (1-2 stories), "One interesting thing" (1 story — culture/science/human angle).
- Each World story: synopsis 280+ words (12-20 sentences) as a standalone mini-article with 5-8 specific numbers; reader should not need the link. description adds deeper analysis without repeating synopsis.
- emailBullets: 5-7 one-line bullets for a short morning email.
- talkingPoints: 3-5 numbered-style strings (without numbers in the text).`;

export async function synthesizeEdition(
  headlines: RawHeadline[],
  editionDate: Date,
  options?: {
    lensPromptAddon?: string;
    secondaryLensAddon?: string;
    includeMarkets?: boolean;
  }
): Promise<EditionContent> {
  if (process.env.USE_SAMPLE_EDITION === "true") {
    return getSampleEditionContent();
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn("OPENAI_API_KEY missing — using sample edition");
    return getSampleEditionContent();
  }

  if (headlines.length < 5) {
    console.warn("Few headlines fetched — blending sample with available data");
    const sample = getSampleEditionContent();
    if (headlines.length === 0) return sample;
  }

  const openai = new OpenAI({ apiKey });
  const dateLabel = format(editionDate, "EEEE, MMMM d, yyyy");
  const headlineBlock = formatHeadlinesForPrompt(headlines);

  const lensBlock = options?.lensPromptAddon
    ? `\nPrimary industry lens:\n${options.lensPromptAddon}\n`
    : "";
  const secondaryBlock = options?.secondaryLensAddon
    ? `\nSecondary lens (lighter weight):\n${options.secondaryLensAddon}\n`
    : "";
  const marketsNote =
    options?.includeMarkets === false
      ? "\nOmit heavy markets jargon; keep Business section to 1 general story only.\n"
      : `
Markets module is ON. In "Business & markets", prioritize:
- Latest moves: what went up/down (indices, rates, key sectors or mega-cap names) and by roughly how much if known from headlines.
- Why: the clearest cause (economic data, central bank, earnings, geopolitics, regulation).
- Where: US vs global, which sectors lead or lag.
- What to watch: 1–2 emerging themes or upcoming catalysts (Fed speak, jobs report, big tech earnings, deal flow).
Plain English for interns; no trading recommendations; neutral and factual.
`;

  const userPrompt = `Edition date: ${dateLabel}
${lensBlock}${secondaryBlock}${marketsNote}
Here are raw headlines from the last 24-48 hours:

${headlineBlock}

Produce today's Desk Edition as JSON matching this schema:
{
  "lede": "one compelling sentence on why today matters",
  "sections": [{ "name": string, "stories": [{ "headline", "summary", "synopsis", "description", "whyItMatters", "sourceUrl", "sourceName" }] }],
  "talkingPoints": [3-5 strings],
  "talkingPointsByCategory": {
    "news": [1-2 conversation starters about today's news],
    "markets": [1-2 about markets],
    "industry": [1-2 about their industry lens],
    "weather": [0-1 if relevant],
    "calendar": [0-1 about their day],
    "music": [0-1],
    "books": [0-1],
    "movies": [0-1],
    "clothing_sales": [0-1],
    "hobbies": [0-1 personal rapport]
  },
  "emailBullets": [5-7 strings]
}`;

  const system =
    options?.lensPromptAddon != null
      ? `${SYSTEM_PROMPT}\n\nAdditional lens instructions from the editor:\n${options.lensPromptAddon}`
      : SYSTEM_PROMPT;

  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    messages: [
      { role: "system", content: system },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.4,
  });

  const raw = response.choices[0]?.message?.content;
  if (!raw) throw new Error("Empty LLM response");

  const parsed = EditionContentSchema.parse(JSON.parse(raw));
  return parsed;
}
