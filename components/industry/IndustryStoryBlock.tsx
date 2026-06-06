"use client";

import { useEffect, useState } from "react";
import type { Story } from "@/lib/types";
import { upgradeNewsImageUrl } from "@/lib/attach-news-images";
import {
  buildIndustryTalkingPoint,
  inferIndustryTheme,
  resolveTieredIndustry,
  type IndustryTalkingPoint,
} from "@/lib/industry-story-display";
import { NewsArticleTalkingPoint } from "@/components/briefing/NewsArticleTalkingPoint";

type Props = {
  story: Story;
  index: number;
  lensLabel: string;
  defaultOpen?: boolean;
  bookmarkId: string;
  isBookmarked: boolean;
  onBookmark: () => void;
  onUnbookmark: () => void;
  talkingPointBookmarkId: string;
  isTalkingPointBookmarked: boolean;
  onBookmarkTalkingPoint: () => void;
  onUnbookmarkTalkingPoint: () => void;
};

export function IndustryStoryBlock({
  story,
  index,
  lensLabel,
  defaultOpen = false,
  bookmarkId,
  isBookmarked,
  onBookmark,
  onUnbookmark,
  talkingPointBookmarkId,
  isTalkingPointBookmarked,
  onBookmarkTalkingPoint,
  onUnbookmarkTalkingPoint,
}: Props) {
  const [expanded, setExpanded] = useState(defaultOpen);
  const [depthOpen, setDepthOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(
    story.imageUrl ?? null
  );

  const tiered = resolveTieredIndustry(story);
  const talkingPoint: IndustryTalkingPoint =
    story.talkingPoint ?? buildIndustryTalkingPoint(story, lensLabel);
  const depthParagraphs = tiered.depth?.split(/\n\n+/).filter(Boolean) ?? [];
  const theme = inferIndustryTheme(story);

  useEffect(() => {
    if (imageUrl || !story.sourceUrl) return;
    fetch(`/api/og-image?url=${encodeURIComponent(story.sourceUrl)}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.imageUrl) setImageUrl(upgradeNewsImageUrl(data.imageUrl));
      })
      .catch(() => {});
  }, [story.sourceUrl, imageUrl]);

  return (
    <article className="mb-10 border-b border-[var(--briefing-ink)]/[0.06] pb-10 last:border-0 md:mb-12 md:pb-12">
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-6 lg:gap-8">
        <div className="min-w-0 flex-1">
          <div className="flex gap-4">
            {imageUrl && (
              <div className="hidden h-16 w-16 shrink-0 overflow-hidden rounded-sm bg-[var(--briefing-ink)]/[0.04] sm:block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setExpanded(!expanded)}
                  className="group flex-1 text-left"
                >
                  <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--briefing-green)]">
                    {theme} · {lensLabel}
                  </p>
                  <h3 className="mt-2 font-display text-xl leading-snug text-[var(--briefing-ink)] transition group-hover:text-[var(--briefing-green)] md:text-2xl">
                    {expanded ? "▾" : "▸"} {story.headline}
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

              {imageUrl && (
                <div className="mt-3 h-14 w-14 overflow-hidden rounded-sm sm:hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
              )}

              <div className="mt-4 rounded-sm border border-[var(--gold)]/40 bg-gradient-to-br from-[var(--gold)]/[0.08] to-[var(--briefing-green)]/[0.04] px-4 py-3.5 shadow-[0_1px_3px_rgba(28,25,22,0.04)]">
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gold-dark)]">
                  Why it matters for {lensLabel}
                </p>
                <p className="mt-2 font-display text-[15px] leading-relaxed text-[var(--briefing-ink)]">
                  {story.whyItMatters}
                </p>
              </div>
            </div>
          </div>

          {expanded && (
            <div className="mt-6 space-y-6">
              <div className="space-y-4">
                {tiered.lede.split(/\n\n+/).map((para, i) => (
                  <p
                    key={i}
                    className="font-sans text-[17px] leading-[1.75] text-[var(--briefing-ink)]"
                  >
                    {para.trim()}
                  </p>
                ))}
              </div>

              {tiered.hasExpand && depthParagraphs.length > 0 && (
                <div>
                  {!depthOpen ? (
                    <button
                      type="button"
                      onClick={() => setDepthOpen(true)}
                      className="font-sans text-sm font-medium text-[var(--briefing-green)] hover:underline"
                    >
                      Read more →
                    </button>
                  ) : (
                    <div className="space-y-4">
                      {depthParagraphs.map((para, i) => (
                        <p
                          key={i}
                          className="font-sans text-[15px] leading-[1.75] text-[var(--briefing-ink)]/90"
                        >
                          {para.trim()}
                        </p>
                      ))}
                      {tiered.analysis && (
                        <p className="font-sans text-[15px] leading-[1.75] text-[var(--briefing-ink)]/90">
                          {tiered.analysis}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {story.sourceUrl && (
                <a
                  href={story.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-sm bg-[var(--briefing-green)] px-5 py-2.5 font-sans text-sm font-medium text-white hover:bg-[var(--briefing-green-hover)]"
                >
                  Read at {story.sourceName ?? "source"} →
                </a>
              )}
            </div>
          )}
        </div>

        {expanded && (
          <aside className="w-full shrink-0 md:w-56 md:sticky md:top-8 lg:w-72">
            <NewsArticleTalkingPoint
              point={talkingPoint}
              bookmarkId={talkingPointBookmarkId}
              isBookmarked={isTalkingPointBookmarked}
              onBookmark={onBookmarkTalkingPoint}
              onUnbookmark={onUnbookmarkTalkingPoint}
            />
          </aside>
        )}
      </div>
    </article>
  );
}
