/**
 * Canonical display labels — match onboarding hobby chip phrasing
 * (Music, Travel, Film & TV, Fashion, Reading, Podcasts, …).
 */

export const MODULE_LABELS: Record<string, string> = {
  news: "News",
  markets: "Markets",
  talking_points: "Talking points",
  industry_lens: "Industry",
  weather: "Weather",
  calendar: "Calendar",
  music: "Music",
  books: "Reading",
  movies: "Film & TV",
  clothing_sales: "Fashion",
  vacation_planning: "Travel",
  historical_fact: "Did you know?",
  commute: "Commute",
  sports_scores: "Sports",
  podcast_pick: "Podcasts",
  hobbies: "Hobbies & interests",
};

/** URL category segments → display label */
export const CATEGORY_LABELS: Record<string, string> = {
  news: "News",
  markets: "Markets",
  industry: "Industry",
  weather: "Weather",
  calendar: "Calendar",
  music: "Music",
  books: "Reading",
  movies: "Film & TV",
  clothing_sales: "Fashion",
  vacation: "Travel",
  historical: "Did you know?",
  commute: "Commute",
  sports: "Sports",
  podcast: "Podcasts",
  hobbies: "Hobbies & interests",
  saved: "Saved",
};

/** Onboarding / hub one-liners — conversational like hobby chips */
export const MODULE_TAGLINES: Record<string, string> = {
  news: "Headlines for your industry",
  markets: "What moved & why",
  talking_points: "Conversation starters",
  industry_lens: "Why today matters for you",
  weather: "Local forecast",
  calendar: "Your day at a glance",
  music: "Morning playlist",
  books: "Worth a read",
  movies: "Worth watching",
  clothing_sales: "Work clothes on sale",
  vacation_planning: "Trips & getaways",
  historical_fact: "Something fun for coffee chat",
  commute: "Transit & traffic",
  sports_scores: "Last night's games",
  podcast_pick: "One episode to try",
};

export function moduleLabel(slug: string): string {
  return MODULE_LABELS[slug] ?? slug.replace(/_/g, " ");
}

export function categoryLabel(category: string): string {
  return CATEGORY_LABELS[category] ?? category.replace(/_/g, " ");
}
