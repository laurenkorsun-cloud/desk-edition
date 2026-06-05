"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { PersonalEditionRow } from "@/lib/personal-editions";
import type { SubscriberProfile } from "@/lib/profile";
import type { ModuleRow } from "@/lib/config-types";
import type { PersonalEditionContent } from "@/lib/config-types";
import { BriefingTabs, BriefingMobileNav } from "./BriefingTabs";
import { BriefingSidebar } from "./BriefingSidebar";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const content = edition.content_json as PersonalEditionContent;
  const enabled = content.meta?.enabledModules ?? [];
  const { items: bookmarks } = useBookmarks(token);
  const pathname = usePathname();
  const activeSlug = pathname.split("/").pop() ?? "";
  const hideSidebar = ["news", "markets", "industry"].includes(activeSlug);

  return (
    <div className="briefing-root">
      <header className="border-b border-transparent">
        <div className="mx-auto max-w-6xl px-4 py-8 md:px-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--briefing-muted)]">
                Desk Edition
              </p>
              <h1 className="mt-1 font-display text-2xl text-[var(--briefing-ink)] md:text-3xl">
                {edition.title}
              </h1>
              <p className="mt-2 font-sans text-sm text-[var(--briefing-muted)]">
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
      />

      <div className="mx-auto flex max-w-6xl gap-0 px-4 pb-16 md:px-8">
        {!hideSidebar && (
          <BriefingSidebar
            token={token}
            date={date}
            content={content}
            bookmarks={bookmarks}
            deliveryLabel={deliveryLabel}
          />
        )}

        <div className={`min-w-0 flex-1 ${hideSidebar ? "" : "md:pl-8"}`}>
          <div className="mb-8 hidden md:block">
            <BriefingTabs token={token} date={date} />
          </div>

          <div className="mb-6 flex items-center gap-4 font-sans text-xs text-[var(--briefing-muted)]">
            <Link
              href={`/me/${token}/${date}`}
              className="hover:text-[var(--briefing-green)]"
            >
              ← Today
            </Link>
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

          {children}
        </div>
      </div>
    </div>
  );
}
