import {
  DEFAULT_DEMO,
  DEMO_STORAGE_KEY,
  type DemoPreferences,
} from "@/config/home-demo";

export function loadDemo(): DemoPreferences {
  if (typeof window === "undefined") return DEFAULT_DEMO;
  try {
    const raw = localStorage.getItem(DEMO_STORAGE_KEY);
    if (!raw) return DEFAULT_DEMO;
    return { ...DEFAULT_DEMO, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_DEMO;
  }
}

export function saveDemo(prefs: DemoPreferences) {
  if (typeof window === "undefined") return;
  localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(prefs));
}

export function demoToProfilePayload(prefs: DemoPreferences) {
  const hobbies = [
    ...prefs.hobbies,
    ...(prefs.customHobby.trim() ? [prefs.customHobby.trim()] : []),
  ];
  return {
    primary_lens_slug: prefs.primaryLens,
    timezone: prefs.timezone,
    city: prefs.city || null,
    delivery_time: prefs.wakeTime,
    toggles: prefs.modules,
    hobbies,
    morning_goals: prefs.goals,
    content_tone:
      prefs.contentTone < 33
        ? "straight"
        : prefs.contentTone > 66
          ? "witty"
          : "balanced",
    onboarding_completed: true,
  };
}
