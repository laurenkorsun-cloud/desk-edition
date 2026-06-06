"use client";

import type { Story } from "@/lib/types";
import type { ModuleBlock, MarketsMeta } from "@/lib/config-types";
import { MARKETS_TARGET_STORIES } from "@/config/markets-editorial";
import { StockWatchlistPanel } from "./StockWatchlistPanel";
import { MarketsStoriesFeed } from "./MarketsStoriesFeed";
import { ModuleContentView } from "@/components/briefing/ModuleContentView";
import { WhatToWatchToday } from "./WhatToWatchToday";
import { resolveWatchTodayDisplay } from "@/lib/markets-watch-today";
import { MarketsFreshnessBar } from "./MarketsFreshnessBar";
import { RegenerateMarketsBanner } from "./RegenerateMarketsBanner";

type Props = {
  stories: Story[];
  lensLabel: string;
  token: string;
  initialWatchlist?: string[];
  marketsMeta?: MarketsMeta;
  needsRegeneration?: boolean;
  block?: ModuleBlock | null;
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

export function MarketsPageView({
  stories,
  lensLabel,
  token,
  initialWatchlist,
  marketsMeta,
  needsRegeneration = false,
  block,
  has,
  add,
  remove,
}: Props) {
  const watchToday = resolveWatchTodayDisplay(marketsMeta, stories);

  return (
    <>
      {needsRegeneration && <RegenerateMarketsBanner token={token} />}

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <MarketsFreshnessBar
          builtAt={marketsMeta?.builtAt}
          isStale={needsRegeneration}
        />
        <p className="font-sans text-xs text-[var(--briefing-muted)]">
          {stories.length} overnight{" "}
          {stories.length === 1 ? "story" : "stories"}
          {stories.length < MARKETS_TARGET_STORIES
            ? ` · regenerate for ${MARKETS_TARGET_STORIES} tiered moves`
            : ""}
        </p>
      </div>

      <WhatToWatchToday {...watchToday} />

      <StockWatchlistPanel token={token} initialSymbols={initialWatchlist} />

      {stories.length > 0 ? (
        <section>
          <h2 className="mb-6 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--briefing-muted)]">
            Overnight moves
          </h2>
          <MarketsStoriesFeed
            stories={stories}
            lensLabel={lensLabel}
            has={has}
            add={add}
            remove={remove}
          />
        </section>
      ) : (
        block && <ModuleContentView block={block} />
      )}
    </>
  );
}
