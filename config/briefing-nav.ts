import {
  HUB_MODULE_SLUGS,
  isHubModuleSlug,
  type ModuleGroup,
} from "@/config/module-catalog";

export { isHubModuleSlug, HUB_MODULE_SLUGS };
export type { ModuleGroup };

/** Top header: Today + core coverage */
export type HeaderCategory = "news" | "markets" | "industry";

/** Opened from Today module tiles (not in header) */
export type ModuleCategory =
  | "weather"
  | "calendar"
  | "music"
  | "books"
  | "movies"
  | "clothing_sales"
  | "hobbies"
  | "historical"
  | "vacation"
  | "commute"
  | "sports"
  | "podcast";

export type BriefingCategory = HeaderCategory | ModuleCategory;

export const HEADER_TABS: {
  slug: HeaderCategory | "today";
  label: string;
}[] = [
  { slug: "today", label: "Today" },
  { slug: "news", label: "News" },
  { slug: "markets", label: "Markets" },
  { slug: "industry", label: "Industry" },
];

/** @deprecated Use HEADER_TABS */
export const PRIMARY_TABS = HEADER_TABS;

export type HubModuleSlug = (typeof HUB_MODULE_SLUGS)[number];

/** Not shown in header or as hub tiles */
export const CORE_MODULE_SLUGS = new Set([
  "news",
  "markets",
  "talking_points",
  "industry_lens",
]);

/** URL segment for a module's detail page */
export function modulePageSlug(moduleSlug: string): ModuleCategory | null {
  const map: Record<string, ModuleCategory> = {
    weather: "weather",
    calendar: "calendar",
    music: "music",
    books: "books",
    movies: "movies",
    clothing_sales: "clothing_sales",
    historical_fact: "historical",
    vacation_planning: "vacation",
    commute: "commute",
    sports_scores: "sports",
    podcast_pick: "podcast",
    hobbies: "hobbies",
  };
  return map[moduleSlug] ?? null;
}

export const MODULE_CATEGORIES: ModuleCategory[] = [
  "weather",
  "calendar",
  "music",
  "books",
  "movies",
  "clothing_sales",
  "hobbies",
  "historical",
  "vacation",
  "commute",
  "sports",
  "podcast",
];

export const ALL_CATEGORIES: BriefingCategory[] = [
  "news",
  "markets",
  "industry",
  ...MODULE_CATEGORIES,
];

export const CATEGORY_TO_MODULE: Record<BriefingCategory, string> = {
  news: "news",
  markets: "markets",
  industry: "industry_lens",
  weather: "weather",
  calendar: "calendar",
  music: "music",
  books: "books",
  movies: "movies",
  clothing_sales: "clothing_sales",
  hobbies: "hobbies",
  historical: "historical_fact",
  vacation: "vacation_planning",
  commute: "commute",
  sports: "sports_scores",
  podcast: "podcast_pick",
};

export function categoryHref(token: string, date: string, slug: string) {
  if (slug === "today") return `/me/${token}/${date}`;
  return `/me/${token}/${date}/${slug}`;
}
