"use client";

import type { ReactNode } from "react";
import { TalkingPointsColumn } from "./TalkingPointsColumn";

type Props = {
  title: string;
  icon?: string;
  children: ReactNode;
  talkingPoints: string[];
  category: string;
  onBookmarkPoint: (text: string, index: number) => void;
  isBookmarked: (id: string) => boolean;
  onUnbookmark: (id: string) => void;
};

export function CategoryPageLayout({
  title,
  children,
  talkingPoints,
  category,
  onBookmarkPoint,
  isBookmarked,
  onUnbookmark,
}: Props) {
  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
      <div className="min-w-0 flex-1">
        <header className="mb-10">
          <h1 className="font-display text-3xl text-[var(--briefing-ink)] md:text-4xl">
            <span className="text-[var(--briefing-green)]">●</span> {title}
          </h1>
        </header>
        {children}
      </div>
      <TalkingPointsColumn
        points={talkingPoints}
        category={category}
        onBookmarkPoint={onBookmarkPoint}
        isBookmarked={isBookmarked}
        onUnbookmark={onUnbookmark}
      />
      {talkingPoints.length > 0 && (
        <section className="mt-10 border-l-2 border-[var(--briefing-green)] pl-4 lg:hidden">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--briefing-muted)]">
            Talking points
          </p>
          <p className="mt-1 font-sans text-[10px] text-[var(--briefing-muted)]">
            Based on today&apos;s stories in this section
          </p>
          <ul className="mt-3 space-y-3">
            {talkingPoints.map((p, i) => (
              <li key={i} className="font-sans text-sm leading-relaxed">
                {p}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
