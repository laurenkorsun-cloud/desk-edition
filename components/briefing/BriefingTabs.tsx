"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HEADER_TABS, categoryHref, modulePageSlug } from "@/config/briefing-nav";
import { MODULE_HUB_META } from "@/config/module-hub-meta";
import type { ModuleRow } from "@/lib/config-types";

type Props = {
  token: string;
  date: string;
};

export function BriefingTabs({ token, date }: Props) {
  const pathname = usePathname();
  const activeSlug = pathname.endsWith(date)
    ? "today"
    : (pathname.split("/").pop() as string);

  return (
    <nav className="flex flex-wrap items-center gap-1 font-sans text-sm">
      {HEADER_TABS.map((tab) => {
        const href = categoryHref(token, date, tab.slug);
        const active = activeSlug === tab.slug;
        return (
          <Link
            key={tab.slug}
            href={href}
            className={`rounded-sm px-3 py-2 transition ${
              active
                ? "border-l-2 border-[var(--briefing-green)] bg-[var(--briefing-ink)]/[0.04] font-medium text-[var(--briefing-green)]"
                : "text-[var(--briefing-muted)] hover:text-[var(--briefing-ink)]"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

type MobileProps = Props & {
  open: boolean;
  onClose: () => void;
  enabledSlugs: string[];
  allModules: ModuleRow[];
  hobbies?: string[];
  savedCount?: number;
};

export function BriefingMobileNav({
  token,
  date,
  open,
  onClose,
  enabledSlugs,
  allModules,
  hobbies = [],
  savedCount = 0,
}: MobileProps) {
  const pathname = usePathname();
  const activeSlug = pathname.endsWith(date)
    ? "today"
    : pathname.split("/").pop();

  if (!open) return null;

  const slugs = [
    ...enabledSlugs,
    ...(hobbies.length > 0 && !enabledSlugs.includes("hobbies") ? ["hobbies"] : []),
  ];

  const moduleLinks = slugs
    .map((slug) => {
      const route = modulePageSlug(slug);
      if (!route) return null;
      const mod = allModules.find((m) => m.slug === slug);
      const meta = MODULE_HUB_META[slug];
      return {
        slug,
        route,
        label: meta?.shortLabel ?? mod?.name ?? slug,
      };
    })
    .filter(Boolean) as { slug: string; route: string; label: string }[];

  return (
    <div className="fixed inset-0 z-40 md:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
        aria-label="Close menu"
      />
      <div className="absolute left-0 top-0 flex h-full w-72 flex-col bg-[var(--briefing-bg)] p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="mb-6 font-sans text-sm text-[var(--briefing-muted)]"
        >
          Close ✕
        </button>
        <nav className="flex flex-col gap-1">
          {HEADER_TABS.map((tab) => {
            const href = categoryHref(token, date, tab.slug);
            const active = activeSlug === tab.slug;
            return (
              <Link
                key={tab.slug}
                href={href}
                onClick={onClose}
                className={`rounded-sm px-3 py-3 ${
                  active
                    ? "border-l-2 border-[var(--briefing-green)] font-medium text-[var(--briefing-green)]"
                    : "text-[var(--briefing-ink)]"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
        {savedCount > 0 && (
          <Link
            href={`/me/${token}/${date}/saved`}
            onClick={onClose}
            className="mt-6 rounded-sm px-3 py-3 text-sm text-[var(--briefing-ink)]"
          >
            Saved ({savedCount})
          </Link>
        )}
        {moduleLinks.length > 0 && (
          <>
            <p className="mb-2 mt-8 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--briefing-muted)]">
              Hobbies & interests
            </p>
            <nav className="flex flex-col gap-1 overflow-y-auto">
              {moduleLinks.map((m) => (
                <Link
                  key={m.slug}
                  href={categoryHref(token, date, m.route)}
                  onClick={onClose}
                  className={`rounded-sm px-3 py-2 text-sm ${
                    activeSlug === m.route
                      ? "border-l-2 border-[var(--briefing-green)] font-medium text-[var(--briefing-green)]"
                      : "text-[var(--briefing-ink)]"
                  }`}
                >
                  {m.label}
                </Link>
              ))}
            </nav>
          </>
        )}
      </div>
    </div>
  );
}
