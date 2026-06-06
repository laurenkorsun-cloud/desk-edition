import { modulePageSlug } from "@/config/briefing-nav";
import { moduleLabel } from "@/config/module-labels";

/** Hub tile display labels — derived from hobby-style module labels */
export const MODULE_HUB_META: Record<string, { shortLabel: string }> = {};

for (const slug of [
  "weather",
  "calendar",
  "music",
  "books",
  "movies",
  "clothing_sales",
  "historical_fact",
  "vacation_planning",
  "commute",
  "sports_scores",
  "podcast_pick",
  "hobbies",
] as const) {
  MODULE_HUB_META[slug] = { shortLabel: moduleLabel(slug) };
}

export function hubCategoryForModule(slug: string): string | null {
  return modulePageSlug(slug);
}
