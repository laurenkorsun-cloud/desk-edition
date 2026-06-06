import { format } from "date-fns";
import type { SubscriberProfile } from "@/lib/profile";

export type BriefingSearchQuery = {
  slug: string;
  query: string;
  label?: string;
};

export function buildBriefingSearchQueries(params: {
  enabledSlugs: string[];
  subscriber: SubscriberProfile;
  lensNames: { primary: string; secondary: string | null };
  editionDate: Date;
  headlineCount: number;
}): BriefingSearchQuery[] {
  const { enabledSlugs, subscriber, lensNames, editionDate, headlineCount } =
    params;
  const enabled = new Set(enabledSlugs);
  const queries: BriefingSearchQuery[] = [];
  const dateLabel = format(editionDate, "MMMM d yyyy");
  const monthYear = format(editionDate, "MMMM yyyy");
  const city = subscriber.city?.trim() || "";
  const hobbies = subscriber.hobbies?.filter(Boolean) ?? [];
  const primary = lensNames.primary;
  const secondary = lensNames.secondary;

  if (enabled.has("books")) {
    queries.push({
      slug: "books",
      query: `best books ${primary} professionals recommended ${monthYear}`,
    });
  }

  if (enabled.has("movies")) {
    queries.push({
      slug: "movies",
      query: `new movies in theaters streaming ${monthYear} reviews`,
    });
  }

  if (enabled.has("clothing_sales")) {
    queries.push({
      slug: "clothing_sales",
      query: `business professional clothing sale discount ${monthYear}`,
    });
  }

  if (enabled.has("music")) {
    const hobbyHint = hobbies[0] ? ` ${hobbies[0]}` : "";
    queries.push({
      slug: "music",
      query: `new album releases${hobbyHint} ${monthYear} OR morning work playlist`,
    });
  }

  if (enabled.has("historical_fact")) {
    queries.push({
      slug: "historical_fact",
      query: `on this day ${format(editionDate, "MMMM d")} history business world`,
    });
  }

  if (enabled.has("vacation_planning")) {
    queries.push({
      slug: "vacation_planning",
      query: city
        ? `weekend getaway travel ideas near ${city} ${monthYear}`
        : `long weekend travel deals United States ${monthYear}`,
    });
  }

  if (enabled.has("commute") && city) {
    queries.push({
      slug: "commute",
      query: `${city} transit subway commuter delays traffic ${dateLabel}`,
    });
  }

  if (enabled.has("sports_scores")) {
    queries.push({
      slug: "sports_scores",
      query: `sports scores headlines ${dateLabel} NBA NFL MLB`,
    });
  }

  if (enabled.has("podcast_pick")) {
    const hobbyHint = hobbies[0] ? ` ${hobbies[0]}` : ` ${primary}`;
    queries.push({
      slug: "podcast_pick",
      query: `best podcast episode${hobbyHint} ${monthYear}`,
    });
  }

  if (enabled.has("industry_lens")) {
    queries.push({
      slug: "industry_lens",
      query: `${primary} industry news headlines ${dateLabel}${
        secondary ? ` ${secondary}` : ""
      }`,
    });
  }

  if (hobbies.length > 0) {
    for (const hobby of hobbies.slice(0, 2)) {
      queries.push({
        slug: "hobbies",
        label: hobby,
        query: `${hobby} news events${city ? ` ${city}` : ""} ${monthYear}`,
      });
    }
  }

  if (enabled.has("news")) {
    queries.push({
      slug: "news",
      query: `top world news headlines today ${dateLabel} ${primary}`,
    });
    if (headlineCount < 15) {
      queries.push({
        slug: "news",
        label: "policy",
        query: `global policy geopolitics news ${dateLabel}`,
      });
    }
  }

  if (enabled.has("markets") && headlineCount < 10) {
    queries.push({
      slug: "markets",
      query: `stock market today moves why ${dateLabel}`,
    });
  }

  const max = Number(process.env.WEB_SEARCH_MAX_QUERIES ?? "8");
  return queries.slice(0, max);
}
