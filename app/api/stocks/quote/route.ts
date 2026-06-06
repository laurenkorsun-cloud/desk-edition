import { NextResponse } from "next/server";
import { fetchStockQuote, fetchStockQuotes } from "@/lib/stocks";

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;
  const symbol = params.get("symbol");
  const symbols = params.get("symbols");

  try {
    if (symbols) {
      const list = symbols.split(",").map((s) => s.trim()).filter(Boolean);
      const quotes = await fetchStockQuotes(list);
      return NextResponse.json({ quotes });
    }
    if (symbol) {
      const quote = await fetchStockQuote(symbol);
      if (!quote) {
        return NextResponse.json({ error: "Symbol not found" }, { status: 404 });
      }
      return NextResponse.json({ quote });
    }
    return NextResponse.json({ error: "Missing symbol" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Quote fetch failed" }, { status: 500 });
  }
}
