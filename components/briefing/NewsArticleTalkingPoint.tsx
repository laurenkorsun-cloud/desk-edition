"use client";

import { CopyButton } from "@/components/CopyButton";
import type { NewsTalkingPoint } from "@/lib/news-story-display";

type Props = {
  point: NewsTalkingPoint;
  bookmarkId: string;
  isBookmarked: boolean;
  onBookmark: () => void;
  onUnbookmark: () => void;
};

export function NewsArticleTalkingPoint({
  point,
  bookmarkId,
  isBookmarked,
  onBookmark,
  onUnbookmark,
}: Props) {
  const fullText = `${point.line} ${point.question}`;

  return (
    <section className="rounded-sm border-l-2 border-[var(--briefing-green)] bg-[var(--briefing-green)]/[0.04] py-4 pl-5 pr-4">
      <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--briefing-green)]">
        Talking point
      </p>
      <p className="mt-2 font-sans text-[15px] leading-relaxed text-[var(--briefing-ink)]">
        {point.line}
      </p>
      <p className="mt-2 font-sans text-[15px] leading-relaxed text-[var(--briefing-ink)]/90">
        {point.question}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <CopyButton text={fullText} />
        <button
          type="button"
          onClick={isBookmarked ? onUnbookmark : onBookmark}
          className="font-sans text-xs text-[var(--briefing-muted)] underline hover:text-[var(--briefing-green)]"
        >
          {isBookmarked ? "Saved" : "Save"}
        </button>
      </div>
    </section>
  );
}
