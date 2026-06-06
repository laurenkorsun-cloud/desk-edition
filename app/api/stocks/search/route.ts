import { NextResponse } from "next/server";
import { searchStocks } from "@/lib/stocks";

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q") ?? "";
  if (q.length < 1) {
    return NextResponse.json({ results: [] });
  }
  try {
    const results = await searchStocks(q);
    return NextResponse.json({ results });
  } catch {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
