import type { ModuleRow } from "@/lib/config-types";
import type { SubscriberProfile } from "@/lib/profile";

export function formatSubscriberContext(
  subscriber: SubscriberProfile,
  lensNames: { primary: string; secondary: string | null }
): string {
  const hobbies = subscriber.hobbies?.filter(Boolean) ?? [];
  const goals = subscriber.morning_goals?.filter(Boolean) ?? [];
  const tone = subscriber.content_tone ?? "balanced";
  const toneGuide =
    tone === "witty"
      ? "Tone: witty but professional—light humor, no sarcasm at work topics."
      : tone === "straight"
        ? "Tone: straight facts, minimal flourish."
        : "Tone: balanced—clear, warm, professional.";

  return [
    `Primary lens: ${lensNames.primary}`,
    lensNames.secondary ? `Secondary lens: ${lensNames.secondary}` : null,
    `City: ${subscriber.city?.trim() || "not set"}`,
    `Timezone: ${subscriber.timezone}`,
    `Delivery time: ${subscriber.delivery_time}`,
    hobbies.length ? `Hobbies/interests: ${hobbies.join(", ")}` : "Hobbies: none listed",
    goals.length ? `Morning goals: ${goals.join(", ")}` : null,
    toneGuide,
    subscriber.manual_calendar_notes?.trim()
      ? `Calendar notes from user:\n${subscriber.manual_calendar_notes.trim()}`
      : "Calendar: no manual notes",
    subscriber.spotify_playlist_url?.trim()
      ? `Spotify playlist URL: ${subscriber.spotify_playlist_url.trim()}`
      : "Spotify: not connected",
  ]
    .filter(Boolean)
    .join("\n");
}

export function formatModuleInstructions(
  enabledSlugs: string[],
  modules: ModuleRow[]
): string {
  const bySlug = Object.fromEntries(modules.map((m) => [m.slug, m]));
  return enabledSlugs
    .map((slug) => {
      const mod = bySlug[slug];
      if (!mod) return null;
      const guide = mod.admin_body?.trim() || mod.description;
      return `### ${slug} (${mod.name})\n${guide}`;
    })
    .filter(Boolean)
    .join("\n\n");
}
