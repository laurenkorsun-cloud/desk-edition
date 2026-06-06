export type StockHistoryPoint = {
  date: string;
  close: number;
};

export type StockQuote = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  history: StockHistoryPoint[];
};

export type StockSearchResult = {
  symbol: string;
  name: string;
  type: string;
};

export const DEFAULT_WATCHLIST = ["SPY", "QQQ", "AAPL", "MSFT"];

const YAHOO_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (compatible; DeskEdition/1.0; +https://desk-edition)",
};

export async function searchStocks(query: string): Promise<StockSearchResult[]> {
  if (!query.trim()) return [];
  const url = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=8&newsCount=0`;
  const res = await fetch(url, { headers: YAHOO_HEADERS, next: { revalidate: 3600 } });
  if (!res.ok) return [];
  const data = await res.json();
  const quotes = data?.quotes ?? [];
  return quotes
    .filter((q: { symbol?: string }) => q.symbol)
    .map((q: { symbol: string; shortname?: string; longname?: string; quoteType?: string }) => ({
      symbol: q.symbol.toUpperCase(),
      name: q.longname ?? q.shortname ?? q.symbol,
      type: q.quoteType ?? "EQUITY",
    }))
    .filter((q: StockSearchResult) =>
      ["EQUITY", "ETF", "MUTUALFUND", "INDEX"].includes(q.type)
    );
}

export async function fetchStockQuote(symbol: string): Promise<StockQuote | null> {
  const sym = symbol.toUpperCase().trim();
  if (!sym) return null;

  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(sym)}?range=3mo&interval=1d`;
  const res = await fetch(url, { headers: YAHOO_HEADERS, next: { revalidate: 300 } });
  if (!res.ok) return null;

  const data = await res.json();
  const result = data?.chart?.result?.[0];
  if (!result) return null;

  const meta = result.meta ?? {};
  const timestamps: number[] = result.timestamp ?? [];
  const closes: (number | null)[] = result.indicators?.quote?.[0]?.close ?? [];

  const history: StockHistoryPoint[] = [];
  for (let i = 0; i < timestamps.length; i++) {
    const close = closes[i];
    if (close == null || Number.isNaN(close)) continue;
    history.push({
      date: new Date(timestamps[i] * 1000).toISOString().slice(0, 10),
      close,
    });
  }

  const price = meta.regularMarketPrice ?? history.at(-1)?.close ?? 0;
  const prev = meta.chartPreviousClose ?? meta.previousClose ?? price;
  const change = price - prev;
  const changePercent = prev ? (change / prev) * 100 : 0;

  return {
    symbol: sym,
    name: meta.longName ?? meta.shortName ?? sym,
    price,
    change,
    changePercent,
    history: history.slice(-60),
  };
}

export async function fetchStockQuotes(
  symbols: string[]
): Promise<StockQuote[]> {
  const unique = [...new Set(symbols.map((s) => s.toUpperCase()))];
  const results = await Promise.all(unique.map((s) => fetchStockQuote(s)));
  return results.filter((q): q is StockQuote => q !== null);
}
