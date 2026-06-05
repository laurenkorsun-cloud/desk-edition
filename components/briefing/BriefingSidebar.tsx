"use client";

import Link from "next/link";
import type { PersonalEditionContent } from "@/lib/config-types";
import { normalizeContent, getModuleBlock } from "@/lib/briefing-content";
import { categoryHref } from "@/config/briefing-nav";
import type { BookmarkItem } from "./useBookmarks";

type Props = {
  token: string;
  date: string;
  content: PersonalEditionContent;
  bookmarks: BookmarkItem[];
  deliveryLabel: string;
};

export function BriefingSidebar({
  token,
  date,
  content,
  bookmarks,
  deliveryLabel,
}: Props) {
  const c = normalizeContent(content);
  const weather = getModuleBlock(c, "weather");

  return (
    <aside className="hidden w-56 shrink-0 flex-col gap-8 border-r border-transparent pr-6 md:flex lg:w-64">
      {weather && (
        <div>
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--briefing-muted)]">
            Weather
          </p>
          <p className="mt-3 font-sans text-sm leading-relaxed line-clamp-4">
            {weather.body.split("\n")[0]}
          </p>
          <Link
            href={categoryHref(token, date, "weather")}
            className="mt-2 inline-block text-xs text-[var(--briefing-green)] hover:underline"
          >
            Full forecast →
          </Link>
        </div>
      )}

      <div>
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--briefing-muted)]">
          Saved ({bookmarks.length})
        </p>
        {bookmarks.length === 0 ? (
          <p className="mt-3 font-sans text-xs text-[var(--briefing-muted)]">
            Bookmark stories or talking points from any page.
          </p>
        ) : (
          <ul className="mt-3 space-y-2">
            {bookmarks.slice(0, 5).map((b) => (
              <li key={b.id} className="font-sans text-xs leading-snug">
                <span className="text-[var(--briefing-green)]">{b.category}</span>
                {" · "}
                {b.title.slice(0, 40)}
                {b.title.length > 40 ? "…" : ""}
              </li>
            ))}
          </ul>
        )}
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
