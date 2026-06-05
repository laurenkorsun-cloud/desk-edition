import { modulePageSlug } from "@/config/briefing-nav";

/** Hub tile display labels (routes via modulePageSlug) */
export const MODULE_HUB_META: Record<string, { shortLabel: string }> = {
  weather: { shortLabel: "Weather" },
  calendar: { shortLabel: "Calendar" },
  music: { shortLabel: "Music" },
  books: { shortLabel: "Books" },
  movies: { shortLabel: "Movies" },
  clothing_sales: { shortLabel: "Clothing" },
  historical_fact: { shortLabel: "History" },
  vacation_planning: { shortLabel: "Travel" },
  hobbies: { shortLabel: "Hobbies" },
};

export function hubCategoryForModule(slug: string): string | null {
  return modulePageSlug(slug);
}
