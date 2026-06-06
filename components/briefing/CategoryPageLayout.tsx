"use client";

import type { ReactNode } from "react";
import { TalkingPointsColumn } from "./TalkingPointsColumn";
import { TalkingPointsBox } from "./TalkingPointsBox";

type Props = {
  title: string;
  subtitle?: string;
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
  subtitle,
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
        <header className="mb-10 border-b border-[var(--briefing-ink)]/[0.06] pb-8">
          <h1 className="font-display text-3xl text-[var(--briefing-ink)] md:text-4xl">
            <span className="text-[var(--briefing-green)]">●</span> {title}
          </h1>
          {subtitle && (
            <p className="mt-3 max-w-2xl font-sans text-sm leading-relaxed text-[var(--briefing-muted)]">
              {subtitle}
            </p>
          )}
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
        <div className="mt-10 lg:hidden">
          <TalkingPointsBox
            points={talkingPoints}
            subtitle="Based on today's stories in this section"
            category={category}
            onBookmarkPoint={onBookmarkPoint}
            isBookmarked={isBookmarked}
            onUnbookmark={onUnbookmark}
          />
        </div>
      )}
    </div>
  );
}
