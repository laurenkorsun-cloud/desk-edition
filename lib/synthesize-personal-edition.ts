import OpenAI from "openai";
import { z } from "zod";
import { format } from "date-fns";
import { formatHeadlinesForPrompt, type RawHeadline } from "@/lib/rss";
import type { ModuleRow, ModuleBlock, PersonalEditionContent } from "@/lib/config-types";
import type { SubscriberProfile } from "@/lib/profile";
import type { EditionContent } from "@/lib/types";
import { getSampleEditionContent } from "@/lib/sample-edition";
import { getSamplePersonalModules } from "@/lib/sample-personal-modules";
import {
  formatModuleInstructions,
  formatSubscriberContext,
} from "@/lib/subscriber-context";
import {
  PersonalSynthesisSchema,
  type GeneratedModule,
} from "@/lib/module-content-schema";
import type { WeatherSummary } from "@/lib/weather";
import { fetchBriefingWebSearch } from "@/lib/fetch-briefing-search";
import { formatBriefingSearchForPrompt } from "@/lib/format-briefing-search";
import { isWebSearchConfigured } from "@/lib/web-search";
import { NEWS_STORY_PROMPT, NEWS_SYNOPSIS_MIN_WORDS } from "@/config/news-editorial";
import { enrichNewsContent } from "@/lib/enrich-news-stories";
import { anchorTalkingPoints } from "@/lib/anchor-talking-points";
import { TALKING_POINTS_PROMPT } from "@/config/talking-points-editorial";

const AI_MODULE_SLUGS = [
  "weather",
  "calendar",
  "music",
  "books",
  "movies",
  "historical_fact",
  "clothing_sales",
  "vacation_planning",
  "industry_lens",
] as const;

const SYSTEM = `You are the editor of Desk Edition—a personalized daily morning briefing for one specific reader.

Every section you write is AI-generated for THIS person only: their job lens, city, hobbies, goals, calendar notes, and enabled modules.

Rules:
- Write fresh content for today's date—never recycle generic filler.
- Personalize: tie recommendations and framing to their lens, hobbies, and goals.
- For module items: synopsis 3–5 sentences; description one full paragraph.
- For NEWS stories (World section): synopsis must be a standalone mini-article (${NEWS_SYNOPSIS_MIN_WORDS}+ words) so the reader never needs the link; follow NEWS rules in the user message.
- Sources: include sourceUrl and sourceName on every item when possible.
  - For news/markets: prefer URLs from the HEADLINES list.
  - For books/movies/music/sales/hobbies/etc.: MUST use URLs from the WEB SEARCH RESULTS block when provided.
  - Never invent URLs. If search has no match, omit sourceUrl and say so in synopsis.
- Neutral, factual tone on news and politics. No buy/sell advice.
- Talking points must cite today's specific stories, modules, and numbers—never generic platitudes.`;

function enabledAiModules(enabled: string[]): string[] {
  const set = new Set(enabled);
  return AI_MODULE_SLUGS.filter((s) => set.has(s));
}

function toModuleBlock(slug: string, mod: ModuleRow | undefined, gen: GeneratedModule): ModuleBlock {
  const title = gen.title ?? mod?.name ?? slug;
  const bodyParts = [
    gen.synopsis,
    "",
    gen.description,
    ...gen.items.map(
      (it) =>
        `\n**${it.headline}**\n${it.synopsis}\n\n${it.description}${
          it.sourceUrl ? `\n[${it.sourceName ?? "Source"}](${it.sourceUrl})` : ""
        }`
    ),
  ];
  return {
    slug,
    title,
    synopsis: gen.synopsis,
    description: gen.description,
    body: bodyParts.join("\n"),
    items: gen.items,
    sources: gen.sources.filter((s) => s.url),
  };
}

function mergeWeatherData(
  blocks: ModuleBlock[],
  weather: WeatherSummary | null
): ModuleBlock[] {
  if (!weather) return blocks;
  return blocks.map((b) =>
    b.slug === "weather"
      ? {
          ...b,
          data: weather,
          synopsis:
            b.synopsis ||
            `${weather.condition}, ${weather.tempF}°F in your city.`,
        }
      : b
  );
}

export async function synthesizePersonalEdition(params: {
  subscriber: SubscriberProfile;
  editionDate: Date;
  headlines: RawHeadline[];
  enabledSlugs: string[];
  modules: ModuleRow[];
  lensNames: { primary: string; secondary: string | null };
  primaryLensAddon?: string;
  secondaryLensAddon?: string;
  weatherFacts?: WeatherSummary | null;
}): Promise<PersonalEditionContent> {
  const {
    subscriber,
    editionDate,
    headlines,
    enabledSlugs,
    modules,
    lensNames,
    weatherFacts,
  } = params;

  if (process.env.USE_SAMPLE_EDITION === "true") {
    return buildSamplePersonal(params);
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.warn("OPENAI_API_KEY missing — sample personal edition");
    return buildSamplePersonal(params);
  }

  const hobbies = subscriber.hobbies?.filter(Boolean) ?? [];
  const aiSlugs: string[] = [...enabledAiModules(enabledSlugs)];
  if (hobbies.length > 0) aiSlugs.push("hobbies");

  const moduleInstructions = formatModuleInstructions(
    [...enabledSlugs, ...(hobbies.length ? ["hobbies"] : [])],
    modules
  );
  const readerContext = formatSubscriberContext(subscriber, lensNames);
  const dateLabel = format(editionDate, "EEEE, MMMM d, yyyy");
  const headlineBlock = formatHeadlinesForPrompt(headlines);

  let webSearchBlock = "";
  if (isWebSearchConfigured()) {
    const bundles = await fetchBriefingWebSearch({
      enabledSlugs,
      subscriber,
      lensNames,
      editionDate,
      headlineCount: headlines.length,
    });
    webSearchBlock = formatBriefingSearchForPrompt(bundles);
    if (webSearchBlock) {
      console.info(
        `Web search: ${bundles.length} module groups, ${bundles.reduce((n, b) => n + b.searches.length, 0)} queries`
      );
    }
  }

  const weatherBlock = weatherFacts
    ? `Live weather API (use in weather module; do not contradict): ${JSON.stringify(weatherFacts)}`
    : "Weather API: no data—prompt user to set city if module enabled.";

  const lensBlock = [
    params.primaryLensAddon
      ? `Primary lens editor notes:\n${params.primaryLensAddon}`
      : "",
    params.secondaryLensAddon
      ? `Secondary lens editor notes:\n${params.secondaryLensAddon}`
      : "",
  ]
    .filter(Boolean)
    .join("\n");

  const enabledList = enabledSlugs.join(", ");
  const modulesToGenerate = aiSlugs.join(", ");

  const userPrompt = `Edition date: ${dateLabel}

READER PROFILE:
${readerContext}

${lensBlock}

ENABLED MODULES: ${enabledList}
Generate AI content for these module keys in "modules": ${modulesToGenerate}
${hobbies.length ? '"hobbies" = personalized picks tied to their hobby chips (books, events, culture—not news).' : ""}

MODULE EDITORIAL GUIDES:
${moduleInstructions || "(none)"}

${weatherBlock}

HEADLINES (last 24–48h — use these URLs for news/markets sources):
${headlineBlock}

${webSearchBlock ? `\n${webSearchBlock}\n` : ""}

Produce JSON:
{
  "lede": "one compelling personalized sentence",
  "sections": [
    { "name": "World", "stories": [{ "headline", "summary", "synopsis", "description", "whyItMatters", "sourceUrl", "sourceName" }] },
  IMPORTANT: Put the 280+ word text in "synopsis", NOT in "summary". "summary" is optional and short.
    { "name": "Business & markets", "stories": [...] },
    { "name": "Policy & work", "stories": [...] },
    { "name": "One interesting thing", "stories": [...] }
  ],
  "talkingPoints": [3-5 strings],
  "talkingPointsByCategory": {
    "news", "markets", "industry", "weather", "calendar", "music", "books", "movies", "clothing_sales", "hobbies": arrays of 1-2 strings each (only for enabled areas)
  },
  "emailBullets": [5-7 strings],
  "modules": {
    "<slug>": {
      "title": "optional display title",
      "synopsis": "module-level 3-5 sentence overview for this reader today",
      "description": "full paragraph module overview",
      "items": [
        {
          "headline": "item title",
          "synopsis": "3-5 sentences",
          "description": "full paragraph",
          "sourceUrl": "https://...",
          "sourceName": "Publisher"
        }
      ],
      "sources": [{ "title": "...", "url": "https://..." }]
    }
  }
}

${enabledSlugs.includes("news") ? NEWS_STORY_PROMPT : 'Omit or empty "World" and non-business sections.'}
${!enabledSlugs.includes("markets") ? 'Keep Business section to 1 general story only if news is on.' : "Markets on: emphasize moves, why, themes in Business section and markets talking points."}
${!enabledSlugs.includes("talking_points") ? "talkingPoints: [] and minimal talkingPointsByCategory." : TALKING_POINTS_PROMPT}

Each module needs at least 1 item (books/movies: 1 pick; clothing_sales: 2-3 sales; historical_fact: 1 fact with source; weather: 1 item using live API; calendar: today's plan from their notes).`;

  const openai = new OpenAI({ apiKey });
  const response = await openai.chat.completions.create({
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    messages: [
      { role: "system", content: SYSTEM },
      { role: "user", content: userPrompt },
    ],
    response_format: { type: "json_object" },
    temperature: 0.45,
    max_tokens: Number(process.env.OPENAI_MAX_TOKENS_PERSONAL ?? "10000"),
  });

  const raw = response.choices[0]?.message?.content;
  if (!raw) throw new Error("Empty LLM response");

  try {
    const parsed = PersonalSynthesisSchema.parse(JSON.parse(raw));
    return assemblePersonalContent(parsed, {
      enabledSlugs,
      modules,
      lensNames,
      weatherFacts: weatherFacts ?? null,
    });
  } catch (err) {
    console.warn("Personal synthesis parse failed, using sample:", err);
    return buildSamplePersonal({
      subscriber,
      enabledSlugs,
      modules,
      lensNames,
      weatherFacts,
    });
  }
}

function assemblePersonalContent(
  parsed: z.infer<typeof PersonalSynthesisSchema>,
  ctx: {
    enabledSlugs: string[];
    modules: ModuleRow[];
    lensNames: { primary: string; secondary: string | null };
    weatherFacts: WeatherSummary | null;
  }
): PersonalEditionContent {
  const bySlug = Object.fromEntries(ctx.modules.map((m) => [m.slug, m]));
  const blocks: ModuleBlock[] = [];

  for (const [slug, gen] of Object.entries(parsed.modules ?? {})) {
    blocks.push(toModuleBlock(slug, bySlug[slug], gen));
  }

  const base: EditionContent = {
    lede: parsed.lede,
    sections: parsed.sections.map((s) => ({
      ...s,
      stories: s.stories.map((st) => ({
        ...st,
        synopsis: st.synopsis?.trim() || undefined,
        description: st.description?.trim() || st.whyItMatters,
      })),
    })),
    talkingPoints: parsed.talkingPoints,
    emailBullets: parsed.emailBullets,
  };

  let assembled: PersonalEditionContent = {
    ...base,
    talkingPointsByCategory: parsed.talkingPointsByCategory,
    modules: mergeWeatherData(blocks, ctx.weatherFacts),
    meta: {
      primaryLens: ctx.lensNames.primary,
      secondaryLens: ctx.lensNames.secondary ?? null,
      enabledModules: ctx.enabledSlugs,
    },
  };

  if (ctx.enabledSlugs.includes("news")) {
    assembled = enrichNewsContent(assembled);
  }

  if (ctx.enabledSlugs.includes("talking_points")) {
    assembled = anchorTalkingPoints(assembled, {
      lensLabel: ctx.lensNames.primary,
      enabledSlugs: ctx.enabledSlugs,
    });
  }

  return assembled;
}

function buildSamplePersonal(params: {
  subscriber: SubscriberProfile;
  enabledSlugs: string[];
  modules: ModuleRow[];
  lensNames: { primary: string; secondary: string | null };
  weatherFacts?: WeatherSummary | null;
}): PersonalEditionContent {
  const base = getSampleEditionContent();
  const sampleModules = getSamplePersonalModules({
    enabled: params.enabledSlugs,
    modules: params.modules,
    subscriber: params.subscriber,
    lensName: params.lensNames.primary,
    weather: params.weatherFacts ?? null,
  });

  const sample: PersonalEditionContent = {
    ...base,
    talkingPointsByCategory: {
      news: base.talkingPoints.slice(0, 2),
      markets: base.talkingPoints.slice(1, 3),
      industry: [base.talkingPoints[0] ?? "What's your team's take on today's headline?"],
      weather: ["Did the commute weather catch anyone off guard?"],
      books: ["Have you read anything good lately—I can share a pick."],
      movies: ["Anything good on streaming this weekend?"],
      clothing_sales: ["Anyone score a good sale on work clothes lately?"],
      hobbies: base.talkingPoints.slice(0, 2),
    },
    modules: sampleModules,
    meta: {
      primaryLens: params.lensNames.primary,
      secondaryLens: params.lensNames.secondary,
      enabledModules: params.enabledSlugs,
    },
  };

  let out = enrichNewsContent(sample);
  if (params.enabledSlugs.includes("talking_points")) {
    out = anchorTalkingPoints(out, {
      lensLabel: params.lensNames.primary,
      enabledSlugs: params.enabledSlugs,
    });
  }
  return out;
}
