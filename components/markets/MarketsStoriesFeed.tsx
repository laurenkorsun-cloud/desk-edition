"use client";

import type { Story } from "@/lib/types";
import { MarketsStoryBlock } from "./MarketsStoryBlock";

type Props = {
  stories: Story[];
  lensLabel: string;
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

export function MarketsStoriesFeed({
  stories,
  lensLabel,
  has,
  add,
  remove,
}: Props) {
  return (
    <>
      <p className="mb-3 font-sans text-xs text-[var(--briefing-muted)] lg:hidden">
        Swipe for more stories →
      </p>
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 lg:hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {stories.map((story, i) => (
          <div
            key={`${story.headline}-${i}`}
            className="w-[88vw] max-w-md shrink-0 snap-center rounded-md border border-[var(--briefing-ink)]/[0.08] bg-white/70 p-4 shadow-sm"
          >
            <MarketsStoryBlock
              story={story}
              index={i}
              lensLabel={lensLabel}
              defaultOpen={i === 0}
              bookmarkId={`story-markets-${i}`}
              isBookmarked={has(`story-markets-${i}`)}
              onBookmark={() =>
                add({
                  id: `story-markets-${i}`,
                  type: "story",
                  title: story.headline,
                  excerpt: story.synopsis ?? story.summary,
                  category: "markets",
                  url: story.sourceUrl,
                })
              }
              onUnbookmark={() => remove(`story-markets-${i}`)}
              talkingPointBookmarkId={`tp-markets-${i}`}
              isTalkingPointBookmarked={has(`tp-markets-${i}`)}
              onBookmarkTalkingPoint={() =>
                add({
                  id: `tp-markets-${i}`,
                  type: "talking_point",
                  title: story.headline,
                  excerpt: story.whyItMatters,
                  category: "markets",
                })
              }
              onUnbookmarkTalkingPoint={() => remove(`tp-markets-${i}`)}
            />
          </div>
        ))}
      </div>

      <div className="hidden lg:block">
        {stories.map((story, i) => (
          <MarketsStoryBlock
            key={`${story.headline}-${i}`}
            story={story}
            index={i}
            lensLabel={lensLabel}
            defaultOpen={i === 0}
            bookmarkId={`story-markets-${i}`}
            isBookmarked={has(`story-markets-${i}`)}
            onBookmark={() =>
              add({
                id: `story-markets-${i}`,
                type: "story",
                title: story.headline,
                excerpt: story.synopsis ?? story.summary,
                category: "markets",
                url: story.sourceUrl,
              })
            }
            onUnbookmark={() => remove(`story-markets-${i}`)}
            talkingPointBookmarkId={`tp-markets-${i}`}
            isTalkingPointBookmarked={has(`tp-markets-${i}`)}
            onBookmarkTalkingPoint={() =>
              add({
                id: `tp-markets-${i}`,
                type: "talking_point",
                title: story.headline,
                excerpt: story.whyItMatters,
                category: "markets",
              })
            }
            onUnbookmarkTalkingPoint={() => remove(`tp-markets-${i}`)}
          />
        ))}
      </div>
    </>
  );
}
