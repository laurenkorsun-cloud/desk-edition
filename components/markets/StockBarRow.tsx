"use client";

import type { StockQuote } from "@/lib/stocks";
import { StockSparkline } from "./StockSparkline";

type Props = {
  quote: StockQuote;
  selected?: boolean;
  saved?: boolean;
  onSelect?: () => void;
  onToggleSave?: () => void;
};

function formatPrice(n: number): string {
  if (n >= 1000) return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
  return n.toFixed(2);
}

export function StockBarRow({
  quote,
  selected,
  saved,
  onSelect,
  onToggleSave,
}: Props) {
  const up = quote.changePercent >= 0;
  const barWidth = Math.min(Math.abs(quote.changePercent) * 8, 100);

  return (
    <div
      className={`flex items-center gap-3 rounded-sm border px-3 py-2.5 transition ${
        selected
          ? "border-[var(--briefing-green)]/50 bg-[var(--briefing-green)]/[0.04]"
          : "border-[var(--briefing-ink)]/[0.06] bg-white/60 hover:border-[var(--briefing-ink)]/[0.12]"
      }`}
    >
      <button
        type="button"
        onClick={onSelect}
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
      >
        <div className="w-14 shrink-0">
          <p className="font-sans text-sm font-semibold text-[var(--briefing-ink)]">
            {quote.symbol}
          </p>
          <p className="truncate font-sans text-[10px] text-[var(--briefing-muted)]">
            {quote.name.slice(0, 18)}
          </p>
        </div>

        <div className="hidden w-28 shrink-0 sm:block">
          <StockSparkline
            history={quote.history}
            positive={up}
            width={112}
            height={32}
          />
        </div>

        <div className="ml-auto shrink-0 text-right">
          <p className="font-sans text-sm font-medium tabular-nums text-[var(--briefing-ink)]">
            ${formatPrice(quote.price)}
          </p>
          <p
            className={`font-sans text-xs font-medium tabular-nums ${
              up ? "text-[var(--briefing-green)]" : "text-[var(--briefing-red,#c45c4a)]"
            }`}
          >
            {up ? "+" : ""}
            {quote.changePercent.toFixed(2)}%
          </p>
        </div>

        <div className="hidden w-16 shrink-0 md:block">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--briefing-ink)]/[0.06]">
            <div
              className={`h-full rounded-full transition-all ${
                up ? "bg-[var(--briefing-green)]" : "bg-[var(--briefing-red,#c45c4a)]"
              }`}
              style={{ width: `${barWidth}%` }}
            />
          </div>
        </div>
      </button>

      {onToggleSave && (
        <button
          type="button"
          onClick={onToggleSave}
          className="shrink-0 font-sans text-[10px] uppercase tracking-wide text-[var(--briefing-muted)] hover:text-[var(--briefing-green)]"
          title={saved ? "Remove from dashboard" : "Save to dashboard"}
        >
          {saved ? "★" : "☆"}
        </button>
      )}
    </div>
  );
}
