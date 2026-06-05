import type { WebSearchResponse, WebSearchResult } from "./types";

type SerperOrganic = {
  title?: string;
  link?: string;
  snippet?: string;
  date?: string;
};

type SerperPayload = {
  organic?: SerperOrganic[];
  answerBox?: { answer?: string; snippet?: string };
};

export async function searchSerper(
  query: string,
  options: { maxResults?: number; apiKey: string }
): Promise<WebSearchResponse> {
  const res = await fetch("https://google.serper.dev/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": options.apiKey,
    },
    body: JSON.stringify({
      q: query,
      num: options.maxResults ?? 5,
    }),
    signal: AbortSignal.timeout(20_000),
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Serper search failed (${res.status}): ${text.slice(0, 200)}`);
  }

  const data = (await res.json()) as SerperPayload;
  const results: WebSearchResult[] = (data.organic ?? [])
    .filter((r) => r.link && r.title)
    .map((r) => ({
      title: r.title!,
      url: r.link!,
      snippet: (r.snippet ?? "").slice(0, 500),
      publishedDate: r.date,
    }));

  const answer =
    data.answerBox?.answer ?? data.answerBox?.snippet ?? undefined;

  return {
    query,
    answer,
    results,
    provider: "serper",
  };
}
