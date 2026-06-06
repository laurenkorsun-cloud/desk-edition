"use client";

import { useEffect, useState } from "react";
import { saveSubscriberToken } from "@/lib/subscriber-session";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { PersonalEditionRow } from "@/lib/personal-editions";
import type { SubscriberProfile } from "@/lib/profile";
import type { ModuleRow } from "@/lib/config-types";
import type { PersonalEditionContent } from "@/lib/config-types";
import { BriefingTabs, BriefingMobileNav } from "./BriefingTabs";
import { BriefingSidebar } from "./BriefingSidebar";
import { MorningEmailCard } from "./MorningEmailCard";
import { BriefingBackLink } from "./BriefingBackLink";
import { useBookmarks } from "./useBookmarks";

type Props = {
  token: string;
  date: string;
  dateLabel: string;
  editionNumber: number;
  deliveryLabel: string;
  subscriber: SubscriberProfile;
  edition: PersonalEditionRow;
  modules: ModuleRow[];
  children: React.ReactNode;
};

function ShareButton() {
  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard.writeText(window.location.href);
      }}
      className="rounded-sm bg-[var(--briefing-green)] px-3 py-1.5 font-sans text-xs font-medium text-white hover:bg-[var(--briefing-green-hover)]"
    >
      Share edition
    </button>
  );
}

export function BriefingShell({
  token,
  date,
  dateLabel,
  editionNumber,
  deliveryLabel,
  subscriber,
  edition,
  modules,
  children,
}: Props) {
  useEffect(() => {
    saveSubscriberToken(token);
  }, [token]);

  const [menuOpen, setMenuOpen] = useState(false);
  const content = edition.content_json as PersonalEditionContent;
  const enabled = content.meta?.enabledModules ?? [];
  const { items: bookmarks, remove: removeBookmark } = useBookmarks(token);
  const pathname = usePathname();
  const isSavedPage = pathname.endsWith("/saved");
  const activeSlug = pathname.split("/").pop() ?? "";
  const hideSidebar = ["news", "markets", "industry"].includes(activeSlug);
  const showSidebar = !isSavedPage && !hideSidebar;

  return (
    <div className="briefing-root">
      <header className="border-b border-transparent">
        <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--briefing-muted)]">
                Desk Edition
              </p>
              <h1 className="mt-1 font-display text-2xl leading-tight text-[var(--ink)] md:text-3xl">
                {edition.title}
              </h1>
              <p className="mt-2 font-sans text-sm text-[var(--muted)]">
                {dateLabel} · Edition {editionNumber} · {deliveryLabel}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <ShareButton />
              <button
                type="button"
                className="rounded-sm border border-[var(--briefing-ink)]/10 px-3 py-1.5 font-sans text-xs md:hidden"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
              >
                ☰
              </button>
            </div>
          </div>
        </div>
      </header>

      <BriefingMobileNav
        token={token}
        date={date}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        enabledSlugs={enabled}
        allModules={modules}
        hobbies={subscriber.hobbies ?? []}
        savedCount={bookmarks.length}
      />

      <div className="mx-auto flex max-w-6xl gap-0 px-4 pb-16 md:px-8">
        {showSidebar && (
          <BriefingSidebar
            token={token}
            date={date}
            content={content}
            bookmarks={bookmarks}
            deliveryLabel={deliveryLabel}
            onRemoveBookmark={removeBookmark}
          />
        )}

        <div className={`min-w-0 flex-1 ${showSidebar ? "md:pl-8" : ""}`}>
          {!isSavedPage && (
            <div className="mb-8 hidden md:block">
              <BriefingTabs token={token} date={date} />
            </div>
          )}

          {!isSavedPage && (
            <div className="mb-6 flex flex-wrap items-center gap-4 font-sans text-xs text-[var(--muted)]">
              <input
                type="date"
                defaultValue={date}
                className="rounded-sm border-0 bg-transparent text-[var(--briefing-ink)]"
                onChange={(e) => {
                  if (e.target.value) {
                    window.location.href = `/me/${token}/${e.target.value}`;
                  }
                }}
              />
            </div>
          )}

          {children}

          {!isSavedPage && (
          <MorningEmailCard
            token={token}
            enabled={subscriber.morning_email_enabled ?? false}
            deliveryTime={subscriber.delivery_time ?? "09:30"}
            timezone={subscriber.timezone ?? "America/New_York"}
            email={subscriber.email}
          />
          )}
        </div>
      </div>
    </div>
  );
}
