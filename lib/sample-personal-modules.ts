import type { ModuleBlock, ModuleRow } from "@/lib/config-types";
import type { SubscriberProfile } from "@/lib/profile";
import type { WeatherSummary } from "@/lib/weather";

export function getSamplePersonalModules(params: {
  enabled: string[];
  modules: ModuleRow[];
  subscriber: SubscriberProfile;
  lensName: string;
  weather: WeatherSummary | null;
}): ModuleBlock[] {
  const { enabled, modules, subscriber, lensName, weather } = params;
  const bySlug = Object.fromEntries(modules.map((m) => [m.slug, m]));
  const blocks: ModuleBlock[] = [];
  const hobbies = subscriber.hobbies?.join(", ") || "your interests";

  const samples: Record<string, Omit<ModuleBlock, "slug">> = {
    industry_lens: {
      title: "Industry lens",
      synopsis: `Today's briefing is filtered for ${lensName}. Headlines and talking points emphasize what clients and teams in your field are likely discussing.`,
      description:
        "Use this section before stand-ups or client calls to sound prepared without reading every trade publication.",
      body: "",
      items: [
        {
          headline: `Why today matters for ${lensName}`,
          synopsis:
            "Regulatory and market headlines are converging on themes your peers will reference in meetings.",
          description:
            "Skim the industry news tab for lens-specific stories, then borrow one talking point for hallway conversation.",
          sourceUrl: "https://www.reuters.com/",
          sourceName: "Reuters",
        },
      ],
      sources: [{ title: "Reuters", url: "https://www.reuters.com/" }],
    },
    weather: {
      title: "Weather",
      synopsis: weather
        ? `${weather.condition}, ${weather.tempF}°F — ${weather.takeaway}`
        : "Add your city in settings for a live forecast.",
      description: weather
        ? "Plan your commute and layers before you leave—conditions can shift by afternoon in many cities."
        : "Weather is personalized to your city each morning.",
      body: "",
      items: weather
        ? [
            {
              headline: "Today's conditions",
              synopsis: `${weather.condition} at ${weather.tempF}°F. ${weather.takeaway}`,
              description:
                "Check radar before a long commute; share a quick weather note if your team is hybrid.",
              sourceUrl: "https://open-meteo.com/",
              sourceName: "Open-Meteo",
            },
          ]
        : [],
      sources: [{ title: "Open-Meteo", url: "https://open-meteo.com/" }],
      data: weather ?? undefined,
    },
    books: {
      title: "Books",
      synopsis: "One book worth knowing about this week—matched to your lens and hobbies.",
      description:
        "A short read or listen that fits busy mornings; swap in your own title in settings later.",
      body: "",
      items: [
        {
          headline: "The Making of a Manager",
          synopsis:
            "Julie Zhuo's guide to leading when you're new—useful for first internships and early promotions.",
          description:
            "Especially relevant if your morning goals include mentorship or visibility. Good for 15-minute chapter reads.",
          sourceUrl: "https://www.penguinrandomhouse.com/books/",
          sourceName: "Penguin Random House",
        },
      ],
      sources: [],
    },
    movies: {
      title: "Movies",
      synopsis: "One release or stream pick with context—no spoilers.",
      description: "Use as a light talking point when conversations go personal.",
      body: "",
      items: [
        {
          headline: "Streaming pick of the week",
          synopsis:
            "A well-reviewed drama or documentary tied to business or culture in the headlines.",
          description:
            "Ask colleagues if they've seen it—low-stakes rapport builder after a long week.",
          sourceUrl: "https://www.imdb.com/",
          sourceName: "IMDb",
        },
      ],
      sources: [],
    },
    music: {
      title: "Music",
      synopsis: subscriber.spotify_playlist_url
        ? "Your connected playlist plus a morning focus suggestion."
        : "A calm focus playlist suggestion for deep work before the office buzz.",
      description:
        "Music sets tone for commute and inbox triage—connect Spotify in settings for your own link.",
      body: "",
      items: [
        {
          headline: "Morning focus",
          synopsis: "Instrumental or low-vocal tracks to ease into email and planning.",
          description:
            subscriber.spotify_playlist_url
              ? `Your playlist: ${subscriber.spotify_playlist_url}`
              : "Connect Spotify in settings to drop your playlist here daily.",
          sourceUrl:
            subscriber.spotify_playlist_url ?? "https://open.spotify.com/",
          sourceName: "Spotify",
        },
      ],
      sources: [],
    },
    calendar: {
      title: "Calendar",
      synopsis: subscriber.manual_calendar_notes?.trim()
        ? "Your day based on notes you provided."
        : "Add manual calendar notes in settings for a personalized day plan.",
      description:
        "AI expands your notes into priorities and one prep tip per key meeting.",
      body: "",
      items: [
        {
          headline: "Today's focus",
          synopsis:
            subscriber.manual_calendar_notes?.trim() ||
            "No calendar notes yet—add them in settings.",
          description:
            "Block 10 minutes after your first meeting to capture follow-ups while context is fresh.",
          sourceUrl: "",
          sourceName: "",
        },
      ],
      sources: [],
    },
    historical_fact: {
      title: "Historical fact",
      synopsis: "One surprising fact tied to today's date or news theme.",
      description: "Optional coffee-chat opener when small talk stalls.",
      body: "",
      items: [
        {
          headline: "On this day in business history",
          synopsis:
            "A milestone in markets, policy, or technology that echoes something in today's headlines.",
          description:
            "Connect the fact to your lens in one sentence if a partner asks for a perspective.",
          sourceUrl: "https://www.history.com/this-day-in-history",
          sourceName: "History.com",
        },
      ],
      sources: [],
    },
    clothing_sales: {
      title: "Clothing sales",
      synopsis: "Professional-wear deals curated for office dress codes.",
      description:
        "Verify sale terms on the retailer site—prices change daily.",
      body: "",
      items: [
        {
          headline: "Business casual sale",
          synopsis: "Seasonal markdowns on shirts, blazers, and shoes from major retailers.",
          description:
            "Good time to refresh interview and client-meeting staples if sizes are in stock.",
          sourceUrl: "https://www.nordstrom.com/",
          sourceName: "Nordstrom",
        },
        {
          headline: "Work bag / accessories",
          synopsis: "Briefcases and totes often discount mid-season.",
          description: "Compare return policies before buying for the office.",
          sourceUrl: "https://www.jcrew.com/",
          sourceName: "J.Crew",
        },
      ],
      sources: [],
    },
    hobbies: {
      title: "Hobbies",
      synopsis: `Picks and context related to ${hobbies}.`,
      description:
        "Personalized culture and leisure angles you can mention without forcing it.",
      body: "",
      items: [
        {
          headline: "Something for you",
          synopsis:
            "An event, album, or article aligned with your hobby chips—refreshed daily.",
          description:
            "Use when the conversation turns personal after work topics wrap.",
          sourceUrl: "https://www.nytimes.com/section/arts",
          sourceName: "NYT Arts",
        },
      ],
      sources: [],
    },
  };

  for (const slug of enabled) {
    const sample = samples[slug];
    const mod = bySlug[slug];
    if (!sample) continue;
    blocks.push({
      slug,
      ...sample,
      title: mod?.name ?? sample.title,
      body:
        sample.body ||
        [sample.synopsis, sample.description, ...(sample.items ?? []).map((i) => i.synopsis)]
          .filter(Boolean)
          .join("\n\n"),
    });
  }

  if ((subscriber.hobbies?.length ?? 0) > 0 && !enabled.includes("hobbies")) {
    const h = samples.hobbies;
    blocks.push({ slug: "hobbies", ...h, body: h.synopsis ?? "" });
  }

  return blocks;
}
