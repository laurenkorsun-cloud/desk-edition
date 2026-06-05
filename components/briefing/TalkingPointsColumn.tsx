"use client";

type Props = {
  points: string[];
  category: string;
  onBookmarkPoint: (text: string, index: number) => void;
  isBookmarked: (id: string) => boolean;
  onUnbookmark: (id: string) => void;
};

export function TalkingPointsColumn({
  points,
  category,
  onBookmarkPoint,
  isBookmarked,
  onUnbookmark,
}: Props) {
  if (points.length === 0) return null;

  return (
    <aside className="hidden lg:block lg:w-72 xl:w-80">
      <div className="sticky top-8">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--briefing-muted)]">
          Talking points
        </p>
        <p className="mt-1 font-sans text-[10px] leading-snug text-[var(--briefing-muted)]">
          Tied to today&apos;s articles on this page
        </p>
        <ul className="mt-4 space-y-4">
          {points.map((point, i) => {
            const id = `tp-${category}-${i}`;
            const saved = isBookmarked(id);
            return (
              <li
                key={id}
                className="border-l-2 border-[var(--briefing-green)] pl-4 font-sans text-sm leading-relaxed"
              >
                <p>{point}</p>
                <button
                  type="button"
                  onClick={() =>
                    saved
                      ? onUnbookmark(id)
                      : onBookmarkPoint(point, i)
                  }
                  className="mt-2 text-xs text-[var(--briefing-muted)] hover:text-[var(--briefing-green)]"
                >
                  {saved ? "Saved" : "Save"}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
