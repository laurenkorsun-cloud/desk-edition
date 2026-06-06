"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { PageBackLink } from "@/components/briefing/BriefingBackLink";
import { SavedBookmarksList } from "@/components/briefing/SavedBookmarksList";
import { useBookmarks } from "@/components/briefing/useBookmarks";
import { categoryLabel } from "@/config/module-labels";
import { briefingPathForToken } from "@/lib/subscriber-urls";

export default function SavedPage() {
  const params = useParams<{ token: string; date: string }>();
  const token = params.token;
  const date = params.date;
  const { items, remove } = useBookmarks(token);

  return (
    <div className="briefing-root mx-auto max-w-2xl px-6 py-10 md:px-8">
      <PageBackLink
        href={briefingPathForToken(token, date)}
        label="← Back to Today"
      />
      <header className="mt-6">
        <h1 className="font-display text-3xl text-[var(--briefing-ink)] md:text-4xl">
          <span className="text-[var(--briefing-green)]">●</span>{" "}
          {categoryLabel("saved")}
        </h1>
        <p className="mt-3 font-sans text-sm text-[var(--briefing-muted)]">
          Stories and talking points you saved from News, Markets,{" "}
          {categoryLabel("movies")}, and more.
        </p>
      </header>

      <div className="mt-10">
        {items.length === 0 ? (
          <div className="rounded-md border border-dashed border-[var(--briefing-ink)]/10 px-6 py-10 text-center">
            <p className="font-sans text-sm text-[var(--briefing-muted)]">
              Nothing saved yet. Tap <strong>Save</strong> on any story or
              talking point.
            </p>
            <Link
              href={briefingPathForToken(token, date)}
              className="mt-4 inline-block font-sans text-sm text-[var(--briefing-green)] hover:underline"
            >
              Go to Today →
            </Link>
          </div>
        ) : (
          <SavedBookmarksList
            bookmarks={items}
            token={token}
            date={date}
            onRemove={remove}
          />
        )}
      </div>
    </div>
  );
}
