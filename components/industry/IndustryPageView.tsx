"use client";

import type { Story } from "@/lib/types";
import { INDUSTRY_TARGET_STORIES } from "@/config/industry-editorial";
import { IndustryStoriesFeed } from "./IndustryStoriesFeed";
import { RegenerateNewsBanner } from "@/components/briefing/RegenerateNewsBanner";

type Props = {
  stories: Story[];
  lensLabel: string;
  token: string;
  needsRegeneration?: boolean;
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

export function IndustryPageView({
  stories,
  lensLabel,
  token,
  needsRegeneration = false,
  has,
  add,
  remove,
}: Props) {
  return (
    <>
      {needsRegeneration && <RegenerateNewsBanner token={token} />}

      {stories.length < INDUSTRY_TARGET_STORIES && (
        <p className="mb-8 font-sans text-sm text-[var(--briefing-muted)]">
          {stories.length} {lensLabel} stor{stories.length === 1 ? "y" : "ies"}
          {` — regenerate for ${INDUSTRY_TARGET_STORIES} lens-specific articles.`}
        </p>
      )}

      <IndustryStoriesFeed
        stories={stories}
        lensLabel={lensLabel}
        has={has}
        add={add}
        remove={remove}
      />
    </>
  );
}
