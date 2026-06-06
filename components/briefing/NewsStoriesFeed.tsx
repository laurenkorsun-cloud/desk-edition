"use client";

import type { Story } from "@/lib/types";
import { NewsStoryBlock } from "./NewsStoryBlock";

type Props = {
  stories: Story[];
  lensLabel: string;
  category: string;
  has: (id: string) => boolean;
  add: (item: {
    id: string;
    type: "story" | "talking_point";
    title: string;
    excerpt: string;
    category: string;
    url?: string;
  }) => void;
  remove: (id: string) => void;
};

export function NewsStoriesFeed({
  stories,
  lensLabel,
  category,
  has,
  add,
  remove,
}: Props) {
  return (
    <>
      <p className="mb-3 font-sans text-xs text-[var(--briefing-muted)] lg:hidden">
        Swipe for more stories →
      </p>
      {/* Mobile: swipeable cards */}
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 lg:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {stories.map((story, i) => (
          <div
            key={`${story.headline}-${i}`}
            className="w-[88vw] max-w-md shrink-0 snap-center rounded-md border border-[var(--briefing-ink)]/[0.08] bg-white/70 p-4 shadow-sm"
          >
            <NewsStoryBlock
              story={story}
              index={i}
              lensLabel={lensLabel}
              defaultOpen={i === 0}
              bookmarkId={`story-news-${i}`}
              isBookmarked={has(`story-news-${i}`)}
              onBookmark={() =>
                add({
                  id: `story-news-${i}`,
                  type: "story",
                  title: story.headline,
                  excerpt: story.summary,
                  category,
                  url: story.sourceUrl,
                })
              }
              onUnbookmark={() => remove(`story-news-${i}`)}
              talkingPointBookmarkId={`tp-news-${i}`}
              isTalkingPointBookmarked={has(`tp-news-${i}`)}
              onBookmarkTalkingPoint={() =>
                add({
                  id: `tp-news-${i}`,
                  type: "talking_point",
                  title: story.headline,
                  excerpt: story.whyItMatters,
                  category,
                })
              }
              onUnbookmarkTalkingPoint={() => remove(`tp-news-${i}`)}
            />
          </div>
        ))}
      </div>

      {/* Desktop: vertical feed */}
      <div className="hidden lg:block">
        {stories.map((story, i) => (
          <NewsStoryBlock
            key={`${story.headline}-${i}`}
            story={story}
            index={i}
            lensLabel={lensLabel}
            defaultOpen={i === 0}
            bookmarkId={`story-news-${i}`}
            isBookmarked={has(`story-news-${i}`)}
            onBookmark={() =>
              add({
                id: `story-news-${i}`,
                type: "story",
                title: story.headline,
                excerpt: story.summary,
                category,
                url: story.sourceUrl,
              })
            }
            onUnbookmark={() => remove(`story-news-${i}`)}
            talkingPointBookmarkId={`tp-news-${i}`}
            isTalkingPointBookmarked={has(`tp-news-${i}`)}
            onBookmarkTalkingPoint={() =>
              add({
                id: `tp-news-${i}`,
                type: "talking_point",
                title: story.headline,
                excerpt: story.whyItMatters,
                category,
              })
            }
            onUnbookmarkTalkingPoint={() => remove(`tp-news-${i}`)}
          />
        ))}
      </div>
    </>
  );
}
