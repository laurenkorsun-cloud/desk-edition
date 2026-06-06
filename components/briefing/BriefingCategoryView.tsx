"use client";

import type { PersonalEditionContent } from "@/lib/config-types";
import type { BriefingCategory } from "@/config/briefing-nav";
import type { SubscriberProfile } from "@/lib/profile";
import {
  getStoriesForCategory,
  getNewsSections,
  getCategoryTalkingPoints,
  getModuleBlock,
  normalizeContent,
} from "@/lib/briefing-content";
import { CategoryPageLayout } from "./CategoryPageLayout";
import { NotionBlock } from "./NotionBlock";
import { IndustryPageView } from "@/components/industry/IndustryPageView";
import {
  getIndustryStories,
  industryNeedsRegeneration,
} from "@/lib/enrich-industry-stories";
import { NEWS_MIN_ARTICLES, NEWS_TARGET_ARTICLES } from "@/config/news-editorial";
import { NewsStoriesFeed } from "./NewsStoriesFeed";
import { newsNeedsRegeneration } from "@/lib/enrich-news-stories";
import { RegenerateNewsBanner } from "./RegenerateNewsBanner";
import { ModuleContentView } from "./ModuleContentView";
import { MarketsPageView } from "@/components/markets/MarketsPageView";
import { DEFAULT_WATCHLIST } from "@/lib/stocks";
import { categorySubtitleForLens } from "@/lib/lens-personalization";
import {
  enrichMarketsContent,
  marketsNeedsRegeneration,
  resolveMarketsMeta,
} from "@/lib/enrich-markets-stories";
import { categoryLabel } from "@/config/module-labels";
import { useBookmarks } from "./useBookmarks";

type Props = {
  category: BriefingCategory;
  content: PersonalEditionContent;
  token: string;
  subscriber: SubscriberProfile;
  lensLabel: string;
};

const CATEGORY_SUBTITLES: Partial<Record<BriefingCategory, string>> = {
  news: "World, policy, and work—written so you can skip the links.",
  markets: "What moved overnight and why it might come up at the office.",
  industry: "Why today's headlines matter for your lens.",
  hobbies: "Picks tied to the interests you chose in onboarding.",
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
      const stories = getIndustryStories(c, lensLabel);
      return (
        <IndustryPageView
          stories={stories}
          lensLabel={lensLabel}
          token={token}
          needsRegeneration={industryNeedsRegeneration(c, lensLabel)}
          has={has}
          add={add}
          remove={remove}
        />
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
      const sections = getNewsSections(c);
      const stories = getStoriesForCategory(c, "news").slice(
        0,
        NEWS_TARGET_ARTICLES
      );
      const needsRegen = newsNeedsRegeneration(c);

      return (
        <>
          {needsRegen && <RegenerateNewsBanner token={token} />}
          <p className="mb-8 font-sans text-sm text-[var(--muted)]">
            {stories.length} top stories
            {stories.length < NEWS_MIN_ARTICLES
              ? ` — regenerate for ${NEWS_TARGET_ARTICLES} tiered articles.`
              : " — swipe on mobile, expand for depth."}
          </p>
          {stories.length > 0 ? (
            <NewsStoriesFeed
              stories={stories}
              lensLabel={lensLabel}
              category={category}
              has={has}
              add={add}
              remove={remove}
            />
          ) : (
            block && <ModuleContentView block={block} />
          )}
        </>
      );
    }

    if (category === "markets") {
      const marketsContent = enrichMarketsContent(c, {
        lensLabel,
        lensSlug: subscriber.primary_lens_slug,
      });
      const stories = getStoriesForCategory(marketsContent, "markets");
      const watchlist =
        (subscriber as { watchlist_symbols?: string[] }).watchlist_symbols ??
        DEFAULT_WATCHLIST;
      return (
        <MarketsPageView
          stories={stories}
          lensLabel={lensLabel}
          token={token}
          initialWatchlist={watchlist}
          marketsMeta={resolveMarketsMeta(marketsContent)}
          needsRegeneration={marketsNeedsRegeneration(marketsContent)}
          block={block}
          has={has}
          add={add}
          remove={remove}
        />
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

  const lensSubtitle =
    categorySubtitleForLens(category, lensLabel) ?? CATEGORY_SUBTITLES[category];

  if (category === "news" || category === "markets" || category === "industry") {
    return (
      <div>
        <header className="mb-10 border-b border-[var(--briefing-ink)]/[0.06] pb-8">
          <h1 className="font-display text-3xl text-[var(--briefing-ink)] md:text-4xl">
            <span className="text-[var(--briefing-green)]">●</span>{" "}
            {categoryLabel(category)}
          </h1>
          {lensSubtitle && (
            <p className="mt-3 max-w-2xl font-sans text-sm leading-relaxed text-[var(--briefing-muted)]">
              {lensSubtitle}
            </p>
          )}
        </header>
        {body}
      </div>
    );
  }

  return (
    <CategoryPageLayout
      title={categoryLabel(category)}
      subtitle={lensSubtitle}
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
