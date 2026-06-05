import type { BriefingSearchBundle } from "@/lib/web-search/types";

export function formatBriefingSearchForPrompt(
  bundles: BriefingSearchBundle[]
): string {
  if (bundles.length === 0) return "";

  const parts: string[] = [
    "WEB SEARCH RESULTS (live — prefer these URLs as sourceUrl/sourceName for lifestyle modules; do not invent URLs not listed here or in headlines):",
    "",
  ];

  for (const bundle of bundles) {
    parts.push(`## Module: ${bundle.slug}${bundle.label ? ` (${bundle.label})` : ""}`);
    for (const search of bundle.searches) {
      parts.push(`Query: ${search.query}`);
      if (search.answer) {
        parts.push(`Summary: ${search.answer}`);
      }
      search.results.forEach((r, i) => {
        parts.push(
          `${i + 1}. ${r.title}\n   URL: ${r.url}\n   Snippet: ${r.snippet || "(none)"}${
            r.publishedDate ? `\n   Date: ${r.publishedDate}` : ""
          }`
        );
      });
      parts.push("");
    }
  }

  return parts.join("\n");
}
