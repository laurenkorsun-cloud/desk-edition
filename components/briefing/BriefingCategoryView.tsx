"use client";

import type { PersonalEditionContent } from "@/lib/config-types";
import type { BriefingCategory } from "@/config/briefing-nav";
import type { SubscriberProfile } from "@/lib/profile";
import {
  getStoriesForCategory,
  getCategoryTalkingPoints,
  getModuleBlock,
  getIndustryIntro,
  normalizeContent,
} from "@/lib/briefing-content";
import { CategoryPageLayout } from "./CategoryPageLayout";
import { NotionBlock } from "./NotionBlock";
import { NewsStoryBlock } from "./NewsStoryBlock";
import { NEWS_MIN_ARTICLES } from "@/config/news-editorial";
import { newsNeedsRegeneration } from "@/lib/enrich-news-stories";
import { RegenerateNewsBanner } from "./RegenerateNewsBanner";
import { ModuleContentView } from "./ModuleContentView";
import { useBookmarks } from "./useBookmarks";

type Props = {
  category: BriefingCategory;
  content: PersonalEditionContent;
  token: string;
  subscriber: SubscriberProfile;
  lensLabel: string;
};

const TITLES: Record<BriefingCategory, string> = {
  news: "News",
  markets: "Markets",
  industry: "Industry",
  weather: "Weather",
  calendar: "Calendar",
  music: "Music",
  books: "Books",
  movies: "Movies",
  clothing_sales: "Clothing & sales",
  hobbies: "Hobbies",
  historical: "Historical fact",
  vacation: "Vacation planning",
};

export function BriefingCategoryView({
  category,
  content,
  token,
  subscriber,
  lensLabel,
}: Props) {
  const c = normalizeContent(content);
  const points = getCategoryTalkingPoints(c, category);
  const { add, remove, has } = useBookmarks(token);

  const bookmarkTp = (text: string, index: number) => {
    add({
      id: `tp-${category}-${index}`,
      type: "talking_point",
      title: "Talking point",
      excerpt: text,
      category,
    });
  };

  const body = renderBody();

  function renderBody() {
    if (category === "industry") {
      const stories = getStoriesForCategory(c, "industry");
      return (
        <>
          <p className="mb-10 font-sans text-[15px] leading-relaxed">
            {getIndustryIntro(c, lensLabel)}
          </p>
          {stories.map((story, i) => (
            <NotionBlock
              key={`${story.headline}-${i}`}
              story={story}
              category={category}
              bookmarkId={`story-${category}-${i}`}
              isBookmarked={has(`story-${category}-${i}`)}
              onBookmark={() =>
                add({
                  id: `story-${category}-${i}`,
                  type: "story",
                  title: story.headline,
                  excerpt: story.summary,
                  category,
                  url: story.sourceUrl,
                })
              }
              onUnbookmark={() => remove(`story-${category}-${i}`)}
            />
          ))}
        </>
      );
    }

    if (category === "hobbies") {
      const hobbies = (subscriber as { hobbies?: string[] }).hobbies ?? [];
      const block = getModuleBlock(c, "historical_fact");
      return (
        <>
          {hobbies.length > 0 && (
            <p className="mb-8 font-sans text-sm text-[var(--briefing-muted)]">
              Tailored for: {hobbies.join(", ")}
            </p>
          )}
          {getStoriesForCategory(c, "hobbies").map((story, i) => (
            <NotionBlock
              key={`h-${i}`}
              story={story}
              category={category}
              bookmarkId={`story-hobbies-${i}`}
              isBookmarked={has(`story-hobbies-${i}`)}
              onBookmark={() =>
                add({
                  id: `story-hobbies-${i}`,
                  type: "story",
                  title: story.headline,
                  excerpt: story.summary,
                  category,
                })
              }
              onUnbookmark={() => remove(`story-hobbies-${i}`)}
            />
          ))}
          {block && (
            <div className="mt-8 font-sans text-[15px] leading-relaxed whitespace-pre-wrap">
              {block.body.replace(/\*\*/g, "")}
            </div>
          )}
        </>
      );
    }

    const moduleSlug =
      category === "historical"
        ? "historical_fact"
        : category === "vacation"
          ? "vacation_planning"
          : category === "clothing_sales"
            ? "clothing_sales"
            : category;
    const block = getModuleBlock(c, moduleSlug);

    if (category === "news") {
      const stories = getStoriesForCategory(c, "news");
      const needsRegen = newsNeedsRegeneration(c);
      return (
        <>
          {needsRegen && <RegenerateNewsBanner token={token} />}
          <p className="mb-8 font-sans text-sm text-[var(--briefing-muted)]">
            {stories.length} articles today
            {stories.length < NEWS_MIN_ARTICLES
              ? ` — regenerate your edition for ${NEWS_MIN_ARTICLES}+ in-depth pieces.`
              : " — synopsis, analysis, and sources below."}
          </p>
          {stories.map((story, i) => (
            <NewsStoryBlock
              key={`${story.headline}-${i}`}
              story={story}
              index={i}
              bookmarkId={`story-news-${i}`}
              isBookmarked={has(`story-news-${i}`)}
              onBookmark={() =>
                add({
                  id: `story-news-${i}`,
                  type: "story",
                  title: story.headline,
                  excerpt: story.synopsis ?? story.summary,
                  category,
                  url: story.sourceUrl,
                })
              }
              onUnbookmark={() => remove(`story-news-${i}`)}
            />
          ))}
          {stories.length === 0 && block && <ModuleContentView block={block} />}
        </>
      );
    }

    if (category === "markets") {
      const stories = getStoriesForCategory(c, "markets");
      return (
        <>
          {stories.map((story, i) => (
            <NotionBlock
              key={`${story.headline}-${i}`}
              story={story}
              category={category}
              bookmarkId={`story-markets-${i}`}
              isBookmarked={has(`story-markets-${i}`)}
              onBookmark={() =>
                add({
                  id: `story-markets-${i}`,
                  type: "story",
                  title: story.headline,
                  excerpt: story.synopsis ?? story.summary,
                  category,
                  url: story.sourceUrl,
                })
              }
              onUnbookmark={() => remove(`story-markets-${i}`)}
            />
          ))}
          {stories.length === 0 && block && <ModuleContentView block={block} />}
        </>
      );
    }

    if (block) {
      return <ModuleContentView block={block} />;
    }

    return (
      <p className="font-sans text-sm text-[var(--briefing-muted)]">
        No content for this section today.
      </p>
    );
  }

  return (
    <CategoryPageLayout
      title={TITLES[category]}
      talkingPoints={points}
      category={category}
      onBookmarkPoint={bookmarkTp}
      isBookmarked={has}
      onUnbookmark={remove}
    >
      {body}
    </CategoryPageLayout>
  );
}
