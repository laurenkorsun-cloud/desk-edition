"use client";

import { useState } from "react";
import type { Story } from "@/lib/types";
import { resolveDisplaySynopsis } from "@/lib/enrich-news-stories";

type Props = {
  story: Story;
  index: number;
  bookmarkId: string;
  isBookmarked: boolean;
  onBookmark: () => void;
  onUnbookmark: () => void;
};

export function NewsStoryBlock({
  story,
  index,
  isBookmarked,
  onBookmark,
  onUnbookmark,
}: Props) {
  const [open, setOpen] = useState(true);
  const { synopsis, analysis, isLegacy } = resolveDisplaySynopsis(story);
  const synopsisParagraphs = synopsis.split(/\n\n+/).filter((p) => p.trim());

  return (
    <article className="mb-12 border-b border-[var(--briefing-ink)]/[0.06] pb-12 last:border-0">
      <div className="flex items-start justify-between gap-4">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="group flex-1 text-left"
        >
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--briefing-green)]">
            Article {index + 1}
          </p>
          <h3 className="mt-2 font-display text-2xl leading-snug text-[var(--briefing-ink)] group-hover:text-[var(--briefing-green)] md:text-[1.75rem]">
            {open ? "▾" : "▸"} {story.headline}
          </h3>
        </button>
        <button
          type="button"
          onClick={isBookmarked ? onUnbookmark : onBookmark}
          className="shrink-0 font-sans text-xs text-[var(--briefing-muted)] hover:text-[var(--briefing-green)]"
        >
          {isBookmarked ? "Saved" : "Save"}
        </button>
      </div>

      {open && (
        <div className="mt-6 space-y-6">
          <section>
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--briefing-muted)]">
              Full synopsis
            </p>
            <p className="mt-1 font-sans text-xs text-[var(--briefing-muted)]">
              {isLegacy
                ? "Short edition—regenerate today’s briefing for the full synopsis."
                : "Written so you can skip the link—key facts, numbers, and what happens next."}
            </p>
            <div className="mt-4 space-y-4">
              {synopsisParagraphs.map((para, i) => (
                <p
                  key={i}
                  className="font-sans text-[17px] leading-[1.8] text-[var(--briefing-ink)]"
                >
                  {para.trim()}
                </p>
              ))}
            </div>
          </section>

          {analysis && analysis !== synopsis && (
            <section>
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--briefing-muted)]">
                Analysis
              </p>
              <div className="mt-3 space-y-4 font-sans text-[15px] leading-[1.75] text-[var(--briefing-ink)]/90">
                {analysis.split(/\n\n+/).map((para, i) => (
                  <p key={i}>{para.trim()}</p>
                ))}
              </div>
            </section>
          )}

          <section className="rounded-sm border-l-2 border-[var(--briefing-green)] bg-[var(--briefing-green)]/[0.04] py-3 pl-5 pr-4">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--briefing-green)]">
              Why it matters at work
            </p>
            <p className="mt-2 font-sans text-[15px] leading-relaxed text-[var(--briefing-ink)]/90">
              {story.whyItMatters}
            </p>
          </section>

          {story.sourceUrl && (
            <a
              href={story.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-sans text-sm font-medium text-[var(--briefing-green)] hover:underline"
            >
              Read at {story.sourceName ?? "source"} →
            </a>
          )}
        </div>
      )}
    </article>
  );
}
