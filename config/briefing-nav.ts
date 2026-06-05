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
  | "vacation";

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

/** Module slugs stored in edition content / subscriber toggles */
export const HUB_MODULE_SLUGS = [
  "weather",
  "calendar",
  "music",
  "books",
  "movies",
  "clothing_sales",
  "historical_fact",
  "vacation_planning",
] as const;

export type HubModuleSlug = (typeof HUB_MODULE_SLUGS)[number];

/** Not shown in header or as hub tiles */
export const CORE_MODULE_SLUGS = new Set([
  "news",
  "markets",
  "talking_points",
  "industry_lens",
]);

export function isHubModuleSlug(slug: string): slug is HubModuleSlug {
  return (HUB_MODULE_SLUGS as readonly string[]).includes(slug);
}

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
};

export function categoryHref(token: string, date: string, slug: string) {
  if (slug === "today") return `/me/${token}/${date}`;
  return `/me/${token}/${date}/${slug}`;
}
