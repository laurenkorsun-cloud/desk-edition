/**
 * @deprecated Personal editions use lib/synthesize-personal-edition.ts (all modules AI-generated).
 */
import type { ModuleRow } from "@/lib/config-types";
import type { ModuleBlock } from "@/lib/config-types";
import type { SubscriberProfile } from "@/lib/profile";
import { fetchWeather } from "@/lib/weather";

export async function buildExtraModules(params: {
  enabledSlugs: string[];
  modules: ModuleRow[];
  subscriber: SubscriberProfile;
  lensNames: { primary: string; secondary?: string | null };
}): Promise<ModuleBlock[]> {
  const blocks: ModuleBlock[] = [];
  const bySlug = Object.fromEntries(params.modules.map((m) => [m.slug, m]));

  for (const slug of params.enabledSlugs) {
    const mod = bySlug[slug];
    if (!mod) continue;

    if (["news", "markets", "talking_points", "industry_lens"].includes(slug)) {
      continue;
    }

    const block = await buildOneModule(slug, mod, params.subscriber, params.lensNames);
    if (block) blocks.push(block);
  }

  return blocks;
}

async function buildOneModule(
  slug: string,
  mod: ModuleRow,
  subscriber: SubscriberProfile,
  lensNames: { primary: string; secondary?: string | null }
): Promise<ModuleBlock | null> {
  switch (slug) {
    case "weather": {
      const wx = await fetchWeather(subscriber.city ?? "");
      if (!wx) {
        return {
          slug,
          title: mod.name,
          body: subscriber.city
            ? "Weather unavailable—check your city in settings."
            : "Add your city in settings to enable weather.",
        };
      }
      return {
        slug,
        title: mod.name,
        body: `${wx.condition}, ${wx.tempF}°F — ${wx.takeaway}`,
        data: wx,
      };
    }
    case "calendar": {
      const notes = subscriber.manual_calendar_notes?.trim();
      return {
        slug,
        title: mod.name,
        body: notes
          ? notes
          : "No calendar notes today. Add your schedule in settings, or connect Google Calendar (coming soon).",
      };
    }
    case "music": {
      const url = subscriber.spotify_playlist_url?.trim();
      const fallback = mod.admin_body?.trim();
      return {
        slug,
        title: mod.name,
        body: url
          ? `Your morning playlist: ${url}`
          : fallback ||
            "Connect Spotify in settings, or set a playlist URL. Founder can edit default in Admin → Modules → music.",
      };
    }
    case "industry_lens":
      return {
        slug,
        title: mod.name,
        body: `Today's briefing is filtered for **${lensNames.primary}**${
          lensNames.secondary ? ` with context from **${lensNames.secondary}**` : ""
        }.`,
      };
    case "books":
    case "vacation_planning":
    case "movies":
    case "historical_fact":
    case "clothing_sales":
      return {
        slug,
        title: mod.name,
        body:
          mod.admin_body?.trim() ||
          `(Founder: edit this module's content in Admin → Modules → ${slug})`,
      };
    default:
      return null;
  }
}
