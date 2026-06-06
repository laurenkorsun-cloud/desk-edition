"use client";

import { TalkingPointsBox } from "./TalkingPointsBox";

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
        <TalkingPointsBox
          points={points}
          subtitle="Tied to today's articles on this page"
          category={category}
          onBookmarkPoint={onBookmarkPoint}
          isBookmarked={isBookmarked}
          onUnbookmark={onUnbookmark}
        />
      </div>
    </aside>
  );
}
