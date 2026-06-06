"use client";

import Link from "next/link";
import type { PersonalEditionContent } from "@/lib/config-types";
import { normalizeContent, getModuleBlock } from "@/lib/briefing-content";
import { categoryHref } from "@/config/briefing-nav";
import { moduleLabel } from "@/config/module-labels";
import type { BookmarkItem } from "./useBookmarks";
import { SavedBookmarksList } from "./SavedBookmarksList";

type Props = {
  token: string;
  date: string;
  content: PersonalEditionContent;
  bookmarks: BookmarkItem[];
  deliveryLabel: string;
  onRemoveBookmark?: (id: string) => void;
};

export function BriefingSidebar({
  token,
  date,
  content,
  bookmarks,
  deliveryLabel,
  onRemoveBookmark,
}: Props) {
  const c = normalizeContent(content);
  const weather = getModuleBlock(c, "weather");

  return (
    <aside className="hidden w-56 shrink-0 flex-col gap-8 border-r border-[var(--briefing-ink)]/[0.06] pr-6 md:flex lg:w-64">
      {weather && (
        <div>
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--briefing-muted)]">
            {moduleLabel("weather")}
          </p>
          <p className="mt-3 font-sans text-sm leading-relaxed text-[var(--briefing-ink-soft)] line-clamp-4">
            {weather.body.split("\n")[0]}
          </p>
          <Link
            href={categoryHref(token, date, "weather")}
            className="mt-2 inline-block font-sans text-xs text-[var(--briefing-green)] hover:underline"
          >
            Full forecast →
          </Link>
        </div>
      )}

      <div>
        <div className="flex items-baseline justify-between gap-2">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--briefing-muted)]">
            Saved ({bookmarks.length})
          </p>
          {bookmarks.length > 0 && (
            <Link
              href={`/me/${token}/${date}/saved`}
              className="font-sans text-[10px] text-[var(--briefing-green)] hover:underline"
            >
              View all
            </Link>
          )}
        </div>
        <div className="mt-3">
          <SavedBookmarksList
            bookmarks={bookmarks}
            token={token}
            date={date}
            limit={5}
            compact
            onRemove={onRemoveBookmark}
          />
        </div>
      </div>

      <div className="mt-auto space-y-2 font-sans text-xs text-[var(--briefing-muted)]">
        <Link
          href={`/settings?token=${token}`}
          className="block text-[var(--briefing-green)] hover:underline"
        >
          Customize briefing
        </Link>
        <p>{deliveryLabel}</p>
      </div>
    </aside>
  );
}
