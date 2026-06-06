import OpenAI from "openai";
import type { DemoPreferences } from "@/config/home-demo";
import { DEMO_LENSES, DEMO_GOALS, DEMO_MODULES } from "@/config/home-demo";

export type PreviewSection = {
  title: string;
  lines: string[];
};

export type PreviewSample = {
  lede: string;
  sections: PreviewSection[];
  talkingPoints: string[];
};

function buildFallback(prefs: DemoPreferences): PreviewSample {
  const lens = DEMO_LENSES.find((l) => l.slug === prefs.primaryLens)?.name ?? "your field";
  const hobbies = [
    ...prefs.hobbies,
    ...(prefs.customHobby.trim() ? [prefs.customHobby.trim()] : []),
  ];
  const enabled = DEMO_MODULES.filter((m) => prefs.modules[m.slug]).map((m) => m.name);
  const tone =
    prefs.contentTone < 33 ? "straight" : prefs.contentTone > 66 ? "witty" : "balanced";

  const sections: PreviewSection[] = [];

  if (prefs.modules.news) {
    sections.push({
      title: "News",
      lines: [
        `Top stories filtered for ${lens}—policy and industry headlines interns actually hear about.`,
      ],
    });
  }
  if (prefs.modules.markets) {
    const marketLine =
      lens === "Medical"
        ? "Biotech and health-system equities in focus—relevant if hospital finance comes up."
        : lens === "Nonprofit"
          ? "Endowment and muni markets matter more than mega-cap tech for many mission-driven orgs."
          : lens === "Technology"
            ? "Mega-cap tech and AI capex still set the tone—watch hyperscaler earnings commentary."
            : lens === "Audit" || lens === "Tax"
              ? "Rates and deal flow headlines help you follow what audit and tax clients care about."
              : "Indices mixed overnight; rates and earnings commentary driving the narrative.";
    sections.push({
      title: "Markets",
      lines: [marketLine],
    });
  }
  if (prefs.modules.weather && prefs.city) {
    sections.push({
      title: "Weather",
      lines: [`${prefs.city} — check forecast before you head out.`],
    });
  }
  if (prefs.modules.calendar) {
    sections.push({
      title: "Your day",
      lines: ["Your calendar notes will appear here each morning."],
    });
  }
  if (prefs.modules.music) {
    sections.push({
      title: "Music",
      lines: ["Your morning playlist link will land here."],
    });
  }
  if (prefs.modules.books) {
    sections.push({
      title: "Books",
      lines: ["A short synopsis of one book worth knowing about this week."],
    });
  }
  if (prefs.modules.movies) {
    sections.push({
      title: "Movies",
      lines: ["One release or stream pick—no spoilers, just context."],
    });
  }
  if (prefs.modules.clothing_sales) {
    sections.push({
      title: "Clothing sales",
      lines: [
        "Curated professional-wear sales—business casual brands and seasonal deals.",
      ],
    });
  }
  if (prefs.modules.commute) {
    sections.push({
      title: "Commute",
      lines: ["Transit and traffic notes for your morning route."],
    });
  }
  if (prefs.modules.sports_scores) {
    sections.push({
      title: "Sports",
      lines: ["Last night's scores and headlines worth a quick glance."],
    });
  }
  if (prefs.modules.podcast_pick) {
    sections.push({
      title: "Podcast",
      lines: ["One episode recommendation for the commute."],
    });
  }
  if (prefs.modules.vacation_planning) {
    sections.push({
      title: "Vacation planning",
      lines: ["Weekend getaway ideas and travel prompts."],
    });
  }
  if (prefs.modules.historical_fact) {
    sections.push({
      title: "Historical fact",
      lines: ["One surprising fact tied to today's date or news theme."],
    });
  }

  const talkingPoints = prefs.modules.talking_points
    ? lens === "Medical"
      ? [
          "Ask whether anyone is tracking today's FDA or Medicare headline before rounds.",
          "If research funding comes up: 'Are grant timelines slipping or just reprioritized?'",
          hobbies[0]
            ? `Light rapport: mention something from ${hobbies[0]} if the chat goes personal.`
            : "Offer one light personal question if the conversation opens up.",
        ]
      : lens === "Nonprofit"
        ? [
            `Ask whether today's policy headline could affect grant cycles for ${lens} partners.`,
            "If donors come up: 'Are multi-year gifts holding, or shifting shorter?'",
            "Connect one headline to mission impact—not just markets.",
          ]
        : lens === "Technology"
          ? [
              "If AI spend comes up, ask whether the team is building, buying, or waiting.",
              "On today's platform headline: 'Which roadmap bet does this pressure?'",
              "Offer one hobby-related question if the conversation goes personal.",
            ]
          : [
              `Ask whether your ${lens} clients or team are reacting to today's biggest headline.`,
              "If markets come up: 'Are deals getting repriced, or just delayed?'",
              "Offer one hobby-related question if the conversation goes personal—it builds rapport.",
            ]
    : [];

  return {
    lede: `Your ${tone} morning briefing for ${lens}—${enabled.length} modules enabled.`,
    sections,
    talkingPoints,
  };
}

export async function generatePreviewSample(
  prefs: DemoPreferences
): Promise<PreviewSample> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || process.env.USE_SAMPLE_EDITION === "true") {
    return buildFallback(prefs);
  }

  const lens = DEMO_LENSES.find((l) => l.slug === prefs.primaryLens);
  const hobbies = [
    ...prefs.hobbies,
    ...(prefs.customHobby.trim() ? [prefs.customHobby.trim()] : []),
  ];
  const goals = DEMO_GOALS.filter((g) => prefs.goals.includes(g.id)).map((g) => g.label);
  const enabledModules = DEMO_MODULES.filter((m) => prefs.modules[m.slug]).map(
    (m) => m.slug
  );

  const openai = new OpenAI({ apiKey });
  const prompt = `Generate a SAMPLE morning briefing preview (not real news). 
Lens: ${lens?.name}. City: ${prefs.city}. Hobbies: ${hobbies.join(", ") || "none"}. Goals: ${goals.join(", ")}.
Tone slider 0-100: ${prefs.contentTone} (0=straight facts, 100=witty).
Enabled modules only: ${enabledModules.join(", ")}.

Return JSON:
{
  "lede": "one sentence",
  "sections": [{
    "title": "Section name matching module",
    "lines": ["synopsis line"],
    "sourceUrl": "https://example.com",
    "sourceName": "Publisher"
  }],
  "talkingPoints": ["2-3 strings"]
}
Only include sections for enabled modules. If talking_points not enabled, talkingPoints=[].
Each section should feel personalized to their lens, hobbies, and city. Include a plausible sourceUrl per section.
For clothing_sales, mention professional wear. Clearly sample text, not real breaking news.`;

  try {
    const res = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You write sample UI preview copy for a morning briefing app.",
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.5,
      max_tokens: 600,
    });
    const raw = res.choices[0]?.message?.content;
    if (!raw) return buildFallback(prefs);
    const parsed = JSON.parse(raw) as PreviewSample;
    if (!prefs.modules.talking_points) parsed.talkingPoints = [];
    return parsed;
  } catch {
    return buildFallback(prefs);
  }
}
