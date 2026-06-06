import Link from "next/link";
import type { PersonalEditionContent } from "@/lib/config-types";
import type { ModuleRow } from "@/lib/config-types";
import {
  getHubHighlights,
  normalizeContent,
  getModuleBlock,
} from "@/lib/briefing-content";
import { categoryHref, isHubModuleSlug } from "@/config/briefing-nav";
import { hubCategoryForModule } from "@/config/module-hub-meta";
import { moduleLabel } from "@/config/module-labels";
import { DisabledModuleCard } from "./DisabledModuleCard";
import { ModuleHubTile } from "./ModuleHubTile";
import { TalkingPointsBox } from "./TalkingPointsBox";
import { StockWatchlistStrip } from "@/components/markets/StockWatchlistStrip";

type Props = {
  lede: string;
  content: PersonalEditionContent;
  token: string;
  date: string;
  allModules: ModuleRow[];
  enabledSlugs: string[];
  hobbySlugs?: string[];
  watchlistSymbols?: string[];
};

export function BriefingHub({
  lede,
  content,
  token,
  date,
  allModules,
  enabledSlugs,
  hobbySlugs = [],
  watchlistSymbols = [],
}: Props) {
  const c = normalizeContent(content);
  const highlights = getHubHighlights(c);
  const talkingPoints = c.talkingPoints ?? [];

  const hubSlugs = [
    ...enabledSlugs.filter((s) => isHubModuleSlug(s) || s === "hobbies"),
    ...(hobbySlugs.length > 0 && !enabledSlugs.includes("hobbies")
      ? ["hobbies"]
      : []),
  ];

  const disabled = allModules.filter(
    (m) =>
      isHubModuleSlug(m.slug) &&
      !enabledSlugs.includes(m.slug) &&
      !m.requires_integration
  );

  const moduleTiles = hubSlugs
    .map((slug) => {
      const block = getModuleBlock(c, slug);
      let excerpt: string | undefined;

      if (block) {
        excerpt =
          block.synopsis ??
          block.items?.[0]?.synopsis ??
          block.body.split("\n")[0]?.slice(0, 140);
      } else if (slug === "hobbies" && hobbySlugs.length > 0) {
        excerpt = hobbySlugs.join(" · ");
      } else {
        return null;
      }

      if (!excerpt?.trim() || !hubCategoryForModule(slug)) return null;

      return {
        slug,
        title: moduleLabel(slug),
        excerpt: excerpt.trim(),
      };
    })
    .filter(Boolean) as { slug: string; title: string; excerpt: string }[];

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_300px] lg:items-start">
      <div>
        <p className="border-l-4 border-[var(--gold)] pl-5 font-display text-xl italic leading-relaxed text-[var(--ink-soft)] md:text-2xl">
          {lede}
        </p>

        {enabledSlugs.includes("markets") && (
          <StockWatchlistStrip
            token={token}
            date={date}
            symbols={watchlistSymbols}
          />
        )}

        {highlights.length > 0 && (
          <section className="mt-14">
            <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--briefing-muted)]">
              Start here
            </h2>
            <ul className="mt-6 divide-y divide-[var(--briefing-ink)]/[0.06]">
              {highlights.map((h) => (
                <li key={h.label} className="py-5 first:pt-0">
                  <Link
                    href={categoryHref(token, date, h.href)}
                    className="group block"
                  >
                    <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--briefing-green)]">
                      {h.label}
                    </p>
                    <p className="mt-2 font-display text-lg leading-snug text-[var(--briefing-ink)] transition group-hover:text-[var(--briefing-green)] md:text-xl">
                      {h.text}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mt-14">
          <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--briefing-muted)]">
            Hobbies & interests
          </h2>
          <p className="mt-2 font-sans text-sm text-[var(--briefing-muted)]">
            Music, Travel, Sports, Reading—your modules use the same names as
            your hobby picks.
          </p>
          {moduleTiles.length === 0 ? (
            <p className="mt-4 font-sans text-sm text-[var(--briefing-muted)]">
              Turn on modules in settings to see them here.
            </p>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4">
              {moduleTiles.map((tile) => (
                <ModuleHubTile
                  key={tile.slug}
                  slug={tile.slug}
                  title={tile.title}
                  excerpt={tile.excerpt}
                  token={token}
                  date={date}
                />
              ))}
            </div>
          )}
        </section>

        {disabled.length > 0 && (
          <section className="mt-12">
            <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--briefing-muted)]">
              Turned off
            </h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {disabled.map((m) => (
                <DisabledModuleCard key={m.slug} slug={m.slug} token={token} />
              ))}
            </div>
          </section>
        )}
      </div>

      {talkingPoints.length > 0 && (
        <TalkingPointsBox
          points={talkingPoints}
          className="lg:sticky lg:top-8"
        />
      )}
    </div>
  );
}
