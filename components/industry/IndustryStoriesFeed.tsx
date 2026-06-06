"use client";

import type { Story } from "@/lib/types";
import { IndustryStoryBlock } from "./IndustryStoryBlock";

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

export function IndustryStoriesFeed({
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
            <IndustryStoryBlock
              story={story}
              index={i}
              lensLabel={lensLabel}
              defaultOpen={i === 0}
              bookmarkId={`story-industry-${i}`}
              isBookmarked={has(`story-industry-${i}`)}
              onBookmark={() =>
                add({
                  id: `story-industry-${i}`,
                  type: "story",
                  title: story.headline,
                  excerpt: story.summary,
                  category: "industry",
                  url: story.sourceUrl,
                })
              }
              onUnbookmark={() => remove(`story-industry-${i}`)}
              talkingPointBookmarkId={`tp-industry-${i}`}
              isTalkingPointBookmarked={has(`tp-industry-${i}`)}
              onBookmarkTalkingPoint={() =>
                add({
                  id: `tp-industry-${i}`,
                  type: "talking_point",
                  title: story.headline,
                  excerpt: story.whyItMatters,
                  category: "industry",
                })
              }
              onUnbookmarkTalkingPoint={() => remove(`tp-industry-${i}`)}
            />
          </div>
        ))}
      </div>

      <div className="hidden lg:block">
        {stories.map((story, i) => (
          <IndustryStoryBlock
            key={`${story.headline}-${i}`}
            story={story}
            index={i}
            lensLabel={lensLabel}
            defaultOpen={i === 0}
            bookmarkId={`story-industry-${i}`}
            isBookmarked={has(`story-industry-${i}`)}
            onBookmark={() =>
              add({
                id: `story-industry-${i}`,
                type: "story",
                title: story.headline,
                excerpt: story.summary,
                category: "industry",
                url: story.sourceUrl,
              })
            }
            onUnbookmark={() => remove(`story-industry-${i}`)}
            talkingPointBookmarkId={`tp-industry-${i}`}
            isTalkingPointBookmarked={has(`tp-industry-${i}`)}
            onBookmarkTalkingPoint={() =>
              add({
                id: `tp-industry-${i}`,
                type: "talking_point",
                title: story.headline,
                excerpt: story.whyItMatters,
                category: "industry",
              })
            }
            onUnbookmarkTalkingPoint={() => remove(`tp-industry-${i}`)}
          />
        ))}
      </div>
    </>
  );
}
