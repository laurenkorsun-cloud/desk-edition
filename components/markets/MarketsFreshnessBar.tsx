"use client";

import { format, parseISO } from "date-fns";

type Props = {
  builtAt?: string;
  isStale?: boolean;
};

export function MarketsFreshnessBar({ builtAt, isStale }: Props) {
  let label = "Built from today's headlines";
  if (builtAt) {
    try {
      const d = parseISO(builtAt);
      label = `Built from headlines at ${format(d, "h:mm a")} ET`;
    } catch {
      label = "Built from today's headlines";
    }
  }

  return (
    <p
      className={`font-sans text-xs ${
        isStale
          ? "text-amber-800"
          : "text-[var(--briefing-muted)]"
      }`}
    >
      {label}
      {isStale ? " · regenerate for today's moves" : ""}
    </p>
  );
}
