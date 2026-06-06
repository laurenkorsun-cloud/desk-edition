"use client";

import type { StockHistoryPoint } from "@/lib/stocks";

type Props = {
  history: StockHistoryPoint[];
  width?: number;
  height?: number;
  positive?: boolean;
};

export function StockSparkline({
  history,
  width = 120,
  height = 36,
  positive = true,
}: Props) {
  if (history.length < 2) {
    return (
      <svg width={width} height={height} className="opacity-30">
        <line
          x1={0}
          y1={height / 2}
          x2={width}
          y2={height / 2}
          stroke="currentColor"
          strokeWidth={1}
        />
      </svg>
    );
  }

  const closes = history.map((h) => h.close);
  const min = Math.min(...closes);
  const max = Math.max(...closes);
  const range = max - min || 1;

  const points = closes
    .map((c, i) => {
      const x = (i / (closes.length - 1)) * width;
      const y = height - ((c - min) / range) * (height - 4) - 2;
      return `${x},${y}`;
    })
    .join(" ");

  const color = positive
    ? "var(--briefing-green)"
    : "var(--briefing-red, #c45c4a)";

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        points={points}
      />
    </svg>
  );
}
