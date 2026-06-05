export type RssSource = {
  name: string;
  url: string;
  category: "world" | "business" | "policy" | "general";
};

/** Curated RSS feeds — tune here without code changes. */
export const RSS_SOURCES: RssSource[] = [
  {
    name: "BBC World",
    url: "https://feeds.bbci.co.uk/news/world/rss.xml",
    category: "world",
  },
  {
    name: "BBC Business",
    url: "https://feeds.bbci.co.uk/news/business/rss.xml",
    category: "business",
  },
  {
    name: "NPR News",
    url: "https://feeds.npr.org/1001/rss.xml",
    category: "general",
  },
  {
    name: "AP Top News",
    url: "https://apnews.com/apf-topnews?output=rss",
    category: "general",
  },
  {
    name: "CNBC Top News",
    url: "https://www.cnbc.com/id/100003114/device/rss/rss.html",
    category: "business",
  },
  {
    name: "MarketWatch",
    url: "https://feeds.marketwatch.com/marketwatch/topstories/",
    category: "business",
  },
  {
    name: "Federal Reserve",
    url: "https://www.federalreserve.gov/feeds/press_all.xml",
    category: "policy",
  },
  {
    name: "NPR Economy",
    url: "https://feeds.npr.org/1017/rss.xml",
    category: "business",
  },
  {
    name: "Guardian World",
    url: "https://www.theguardian.com/world/rss",
    category: "world",
  },
  {
    name: "Guardian Business",
    url: "https://www.theguardian.com/uk/business/rss",
    category: "business",
  },
  {
    name: "NYT World",
    url: "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
    category: "world",
  },
  {
    name: "NYT Business",
    url: "https://rss.nytimes.com/services/xml/rss/nyt/Business.xml",
    category: "business",
  },
];

export const RSS_FETCH_HOURS = 24;
export const RSS_FETCH_FALLBACK_HOURS = 48;
export const MAX_HEADLINES_FOR_LLM = 80;
