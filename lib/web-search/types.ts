export type WebSearchResult = {
  title: string;
  url: string;
  snippet: string;
  publishedDate?: string;
};

export type WebSearchResponse = {
  query: string;
  answer?: string;
  results: WebSearchResult[];
  provider: "tavily" | "serper";
};

export type BriefingSearchBundle = {
  slug: string;
  label?: string;
  searches: WebSearchResponse[];
};
