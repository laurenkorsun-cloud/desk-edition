"use client";

import { useState } from "react";
import type { Story } from "@/lib/types";

type Props = {
  story: Story;
  bookmarkId: string;
  category: string;
  isBookmarked: boolean;
  onBookmark: () => void;
  onUnbookmark: () => void;
};

export function NotionBlock({
  story,
  bookmarkId,
  isBookmarked,
  onBookmark,
  onUnbookmark,
}: Props) {
  const [open, setOpen] = useState(true);

  return (
    <article className="mb-8">
      <div className="flex items-start justify-between gap-4">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="group flex-1 text-left"
        >
          <h3 className="font-display text-xl leading-snug text-[var(--briefing-ink)] group-hover:text-[var(--briefing-green)] md:text-2xl">
            {open ? "▾" : "▸"} {story.headline}
          </h3>
        </button>
        <button
          type="button"
          onClick={isBookmarked ? onUnbookmark : onBookmark}
          className="shrink-0 font-sans text-xs text-[var(--briefing-muted)] hover:text-[var(--briefing-green)]"
          aria-label={isBookmarked ? "Remove bookmark" : "Bookmark story"}
        >
          {isBookmarked ? "Saved" : "Save"}
        </button>
      </div>
      {open && (
        <div className="mt-3 space-y-3 pl-0 font-sans text-[15px] leading-relaxed text-[var(--briefing-ink)]/90">
          <p>{story.synopsis ?? story.summary}</p>
          {story.description &&
            story.description !== (story.synopsis ?? story.summary) && (
              <p className="text-[var(--briefing-ink)]/80">{story.description}</p>
            )}
          <p className="text-[var(--briefing-muted)]">
            <span className="font-medium text-[var(--briefing-green)]">
              Why it matters
            </span>
            {" — "}
            {story.whyItMatters}
          </p>
          {story.sourceUrl && (
            <a
              href={story.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm text-[var(--briefing-green)] hover:underline"
            >
              {story.sourceName ?? "Source"} →
            </a>
          )}
        </div>
      )}
    </article>
  );
}
