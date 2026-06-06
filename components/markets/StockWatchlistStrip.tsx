"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { StockQuote } from "@/lib/stocks";
import { DEFAULT_WATCHLIST } from "@/lib/stocks";
import { categoryHref } from "@/config/briefing-nav";

type Props = {
  token: string;
  date: string;
  symbols?: string[];
};

export function StockWatchlistStrip({ token, date, symbols }: Props) {
  const syms =
    symbols && symbols.length > 0 ? symbols : DEFAULT_WATCHLIST.slice(0, 4);
  const [quotes, setQuotes] = useState<StockQuote[]>([]);

  useEffect(() => {
    fetch(`/api/stocks/quote?symbols=${encodeURIComponent(syms.join(","))}`)
      .then((r) => r.json())
      .then((data) => setQuotes(data.quotes ?? []))
      .catch(() => setQuotes([]));
  }, [syms.join(",")]);

  if (quotes.length === 0) return null;

  return (
    <section className="mt-14">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--briefing-muted)]">
          Live tickers
        </h2>
        <Link
          href={categoryHref(token, date, "markets")}
          className="font-sans text-xs text-[var(--briefing-green)] hover:underline"
        >
          Markets →
        </Link>
      </div>
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {quotes.map((q) => {
          const up = q.changePercent >= 0;
          return (
            <Link
              key={q.symbol}
              href={categoryHref(token, date, "markets")}
              className="flex min-w-[6.5rem] shrink-0 flex-col rounded-xl border border-[var(--briefing-ink)]/[0.08] bg-gradient-to-b from-white to-[var(--gold)]/[0.06] px-3 py-3 shadow-sm transition hover:border-[var(--briefing-green)]/40"
            >
              <span className="font-sans text-sm font-semibold text-[var(--briefing-ink)]">
                {q.symbol}
              </span>
              <span
                className={`mt-1 font-sans text-xs font-medium tabular-nums ${
                  up ? "text-[var(--briefing-green)]" : "text-[var(--briefing-red,#c45c4a)]"
                }`}
              >
                {up ? "+" : ""}
                {q.changePercent.toFixed(2)}%
              </span>
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-[var(--briefing-ink)]/[0.06]">
                <div
                  className={`h-full rounded-full ${
                    up ? "bg-[var(--briefing-green)]" : "bg-[var(--briefing-red,#c45c4a)]"
                  }`}
                  style={{
                    width: `${Math.min(Math.abs(q.changePercent) * 10, 100)}%`,
                  }}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
