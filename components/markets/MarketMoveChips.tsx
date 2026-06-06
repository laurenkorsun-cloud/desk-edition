import type { MarketMoveChip } from "@/lib/markets-story-display";

type Props = {
  chips: MarketMoveChip[];
};

export function MarketMoveChips({ chips }: Props) {
  if (chips.length === 0) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-2">
      {chips.map((chip) => (
        <span
          key={`${chip.label}-${chip.value}`}
          className={`inline-flex items-center gap-1.5 rounded-sm border px-2.5 py-1 font-sans text-xs font-medium tabular-nums ${
            chip.direction === "up"
              ? "border-[var(--briefing-green)]/30 bg-[var(--briefing-green)]/[0.08] text-[var(--briefing-green)]"
              : chip.direction === "down"
                ? "border-[var(--briefing-red,#c45c4a)]/30 bg-[var(--briefing-red,#c45c4a)]/[0.06] text-[var(--briefing-red,#c45c4a)]"
                : "border-[var(--briefing-ink)]/[0.1] bg-[var(--briefing-ink)]/[0.04] text-[var(--briefing-muted)]"
          }`}
        >
          <span className="text-[10px] font-semibold uppercase tracking-wide opacity-80">
            {chip.label}
          </span>
          {chip.direction === "up" ? "▲" : chip.direction === "down" ? "▼" : "•"}{" "}
          {chip.value}
        </span>
      ))}
    </div>
  );
}
