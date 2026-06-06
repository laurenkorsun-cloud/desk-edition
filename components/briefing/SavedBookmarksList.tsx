"use client";

import Link from "next/link";
import { categoryHref } from "@/config/briefing-nav";
import { categoryLabel } from "@/config/module-labels";
import type { BookmarkItem } from "./useBookmarks";

type Props = {
  bookmarks: BookmarkItem[];
  token: string;
  date: string;
  limit?: number;
  onRemove?: (id: string) => void;
  compact?: boolean;
};

export function SavedBookmarksList({
  bookmarks,
  token,
  date,
  limit,
  onRemove,
  compact = false,
}: Props) {
  const items = limit ? bookmarks.slice(0, limit) : bookmarks;

  if (items.length === 0) {
    return (
      <p className="font-sans text-xs leading-relaxed text-[var(--briefing-muted)]">
        Save stories or talking points from any section—they&apos;ll show up
        here.
      </p>
    );
  }

  return (
    <ul className={compact ? "space-y-3" : "space-y-4"}>
      {items.map((b) => {
        const section = categoryLabel(b.category);
        const href = categoryHref(token, date, b.category);

        return (
          <li
            key={b.id}
            className={
              compact
                ? "border-b border-[var(--briefing-ink)]/[0.06] pb-3 last:border-0"
                : "rounded-md border border-[var(--briefing-ink)]/[0.06] bg-white/50 px-4 py-3"
            }
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <Link
                  href={href}
                  className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--briefing-green)] hover:underline"
                >
                  {section}
                </Link>
                <p className="mt-1 font-display text-sm leading-snug text-[var(--briefing-ink)]">
                  {b.url ? (
                    <a
                      href={b.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-[var(--briefing-green)]"
                    >
                      {b.title}
                    </a>
                  ) : (
                    <Link href={href} className="hover:text-[var(--briefing-green)]">
                      {b.title}
                    </Link>
                  )}
                </p>
                {!compact && b.excerpt && (
                  <p className="mt-1 line-clamp-2 font-sans text-xs text-[var(--briefing-muted)]">
                    {b.excerpt}
                  </p>
                )}
              </div>
              {onRemove && (
                <button
                  type="button"
                  onClick={() => onRemove(b.id)}
                  className="shrink-0 font-sans text-[10px] text-[var(--briefing-muted)] hover:text-[var(--briefing-ink)]"
                  aria-label="Remove bookmark"
                >
                  Remove
                </button>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
