import { searchSerper } from "./serper";
import { searchTavily } from "./tavily";
import type { WebSearchResponse } from "./types";

export type { WebSearchResponse, WebSearchResult, BriefingSearchBundle } from "./types";

export function isWebSearchConfigured(): boolean {
  return Boolean(process.env.TAVILY_API_KEY || process.env.SERPER_API_KEY);
}

function resolveProvider(): "tavily" | "serper" | null {
  const forced = process.env.WEB_SEARCH_PROVIDER?.toLowerCase();
  if (forced === "tavily" && process.env.TAVILY_API_KEY) return "tavily";
  if (forced === "serper" && process.env.SERPER_API_KEY) return "serper";
  if (process.env.TAVILY_API_KEY) return "tavily";
  if (process.env.SERPER_API_KEY) return "serper";
  return null;
}

export async function webSearch(query: string): Promise<WebSearchResponse | null> {
  const provider = resolveProvider();
  if (!provider) return null;

  const maxResults = Number(process.env.WEB_SEARCH_MAX_RESULTS ?? "5");

  try {
    if (provider === "tavily") {
      return await searchTavily(query, {
        apiKey: process.env.TAVILY_API_KEY!,
        maxResults,
      });
    }
    return await searchSerper(query, {
      apiKey: process.env.SERPER_API_KEY!,
      maxResults,
    });
  } catch (err) {
    console.warn(`Web search failed for "${query}":`, err);
    return null;
  }
}
