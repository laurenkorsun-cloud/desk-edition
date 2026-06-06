import { DEFAULT_DEMO, type DemoPreferences } from "@/config/home-demo";
import { DEFAULT_CORP_TOGGLES } from "@/config/seed-lenses-modules";
import type { SubscriberProfile } from "@/lib/profile";
import { demoToProfilePayload } from "@/lib/demo-storage";

export function subscriberToDemoPrefs(
  sub: SubscriberProfile,
  toggles: Record<string, boolean>
): DemoPreferences {
  const tone = sub.content_tone ?? "balanced";
  const contentTone =
    tone === "straight" ? 15 : tone === "witty" ? 85 : 50;

  const modules: Record<string, boolean> = { ...DEFAULT_CORP_TOGGLES };
  for (const [slug, enabled] of Object.entries(toggles)) {
    modules[slug] = enabled;
  }

  return {
    primaryLens: sub.primary_lens_slug ?? DEFAULT_DEMO.primaryLens,
    secondaryLens: sub.secondary_lens_slug ?? null,
    hobbies: sub.hobbies ?? [],
    customHobby: "",
    goals: sub.morning_goals ?? DEFAULT_DEMO.goals,
    timezone: sub.timezone ?? DEFAULT_DEMO.timezone,
    wakeTime: sub.delivery_time ?? DEFAULT_DEMO.wakeTime,
    city: sub.city ?? DEFAULT_DEMO.city,
    contentTone,
    modules,
  };
}

export function demoPrefsToProfilePayload(prefs: DemoPreferences) {
  return demoToProfilePayload(prefs);
}
