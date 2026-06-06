"use client";

import { CopyButton } from "@/components/CopyButton";

type Props = {
  points: string[];
  subtitle?: string;
  className?: string;
  onBookmarkPoint?: (text: string, index: number) => void;
  isBookmarked?: (id: string) => boolean;
  onUnbookmark?: (id: string) => void;
  category?: string;
};

/** Sample-edition style talking points card (boxed, numbered, serif accents). */
export function TalkingPointsBox({
  points,
  subtitle = "Use these before noon—specific, office-ready conversation starters.",
  className = "",
  onBookmarkPoint,
  isBookmarked,
  onUnbookmark,
  category = "global",
}: Props) {
  if (points.length === 0) return null;

  return (
    <div
      className={`rounded-sm bg-[var(--card)] p-6 shadow-sm ring-1 ring-[var(--border)] ${className}`}
    >
      <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-[var(--gold-dark)]">
        Talking points
      </h2>
      <p className="mt-2 font-sans text-sm text-[var(--muted)]">{subtitle}</p>
      <ol className="mt-5 space-y-4">
        {points.map((point, i) => {
          const id = `tp-${category}-${i}`;
          const saved = isBookmarked?.(id);
          return (
            <li key={id} className="flex gap-3">
              <span className="font-display text-lg text-[var(--gold-dark)]">
                {i + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-sans text-sm leading-relaxed text-[var(--ink)]">
                  {point}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-3">
                  <CopyButton text={point} />
                  {onBookmarkPoint && (
                    <button
                      type="button"
                      onClick={() =>
                        saved
                          ? onUnbookmark?.(id)
                          : onBookmarkPoint(point, i)
                      }
                      className="font-sans text-xs text-[var(--muted)] underline hover:text-[var(--accent)]"
                    >
                      {saved ? "Saved" : "Save"}
                    </button>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
