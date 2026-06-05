import type { WebSearchResponse, WebSearchResult } from "./types";

type TavilyResult = {
  title?: string;
  url?: string;
  content?: string;
  published_date?: string;
};

type TavilyPayload = {
  results?: TavilyResult[];
  answer?: string;
};

export async function searchTavily(
  query: string,
  options: { maxResults?: number; apiKey: string }
): Promise<WebSearchResponse> {
  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${options.apiKey}`,
    },
    body: JSON.stringify({
      query,
      search_depth: process.env.TAVILY_SEARCH_DEPTH ?? "basic",
      max_results: options.maxResults ?? 5,
      include_answer: true,
      include_raw_content: false,
    }),
    signal: AbortSignal.timeout(20_000),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Tavily search failed (${res.status}): ${text.slice(0, 200)}`);
  }

  const data = (await res.json()) as TavilyPayload;
  const results: WebSearchResult[] = (data.results ?? [])
    .filter((r) => r.url && r.title)
    .map((r) => ({
      title: r.title!,
      url: r.url!,
      snippet: (r.content ?? "").slice(0, 500),
      publishedDate: r.published_date,
    }));

  return {
    query,
    answer: data.answer,
    results,
    provider: "tavily",
  };
}
