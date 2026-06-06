"use client";

import type { StockQuote } from "@/lib/stocks";

type Props = {
  quote: StockQuote;
};

function formatPrice(n: number): string {
  if (n >= 1000) return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
  return n.toFixed(2);
}

export function StockDetailChart({ quote }: Props) {
  const up = quote.changePercent >= 0;
  const history = quote.history;
  const width = 560;
  const height = 140;

  let path = "";
  let areaPath = "";

  if (history.length >= 2) {
    const closes = history.map((h) => h.close);
    const min = Math.min(...closes);
    const max = Math.max(...closes);
    const range = max - min || 1;

    const coords = closes.map((c, i) => ({
      x: (i / (closes.length - 1)) * width,
      y: height - 20 - ((c - min) / range) * (height - 40),
    }));

    path = coords.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
    areaPath = `${path} L${width},${height} L0,${height} Z`;
  }

  const startDate = history[0]?.date ?? "";
  const endDate = history.at(-1)?.date ?? "";

  return (
    <div className="rounded-sm border border-[var(--briefing-ink)]/[0.08] bg-gradient-to-br from-white/80 to-[var(--briefing-green)]/[0.03] p-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--briefing-green)]">
            {quote.symbol}
          </p>
          <h3 className="mt-1 font-display text-xl text-[var(--briefing-ink)]">
            {quote.name}
          </h3>
        </div>
        <div className="text-right">
          <p className="font-display text-2xl tabular-nums text-[var(--briefing-ink)]">
            ${formatPrice(quote.price)}
          </p>
          <p
            className={`mt-1 font-sans text-sm font-medium tabular-nums ${
              up ? "text-[var(--briefing-green)]" : "text-[var(--briefing-red,#c45c4a)]"
            }`}
          >
            {up ? "▲" : "▼"} {up ? "+" : ""}
            {quote.change.toFixed(2)} ({up ? "+" : ""}
            {quote.changePercent.toFixed(2)}%) today
          </p>
        </div>
      </div>

      {history.length >= 2 && (
        <div className="mt-6 overflow-x-auto">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full min-w-[280px]"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="stockArea" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor={
                    up ? "var(--briefing-green)" : "var(--briefing-red,#c45c4a)"
                  }
                  stopOpacity={0.2}
                />
                <stop offset="100%" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <path d={areaPath} fill="url(#stockArea)" />
            <path
              d={path}
              fill="none"
              stroke={up ? "var(--briefing-green)" : "var(--briefing-red,#c45c4a)"}
              strokeWidth={2}
              strokeLinejoin="round"
            />
          </svg>
          <div className="mt-2 flex justify-between font-sans text-[10px] text-[var(--briefing-muted)]">
            <span>{startDate}</span>
            <span>3-month trend</span>
            <span>{endDate}</span>
          </div>
        </div>
      )}
    </div>
  );
}
