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
import { DisabledModuleCard } from "./DisabledModuleCard";
import { ModuleHubTile } from "./ModuleHubTile";

type Props = {
  lede: string;
  content: PersonalEditionContent;
  token: string;
  date: string;
  allModules: ModuleRow[];
  enabledSlugs: string[];
  hobbySlugs?: string[];
};

export function BriefingHub({
  lede,
  content,
  token,
  date,
  allModules,
  enabledSlugs,
  hobbySlugs = [],
}: Props) {
  const c = normalizeContent(content);
  const highlights = getHubHighlights(c);

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
      const mod = allModules.find((m) => m.slug === slug);
      const block = getModuleBlock(c, slug);
      let excerpt: string | undefined;
      let title = mod?.name ?? slug;

      if (block) {
        excerpt =
          block.synopsis ??
          block.items?.[0]?.synopsis ??
          block.body.split("\n")[0]?.slice(0, 140);
        title = block.title;
      } else if (slug === "hobbies" && hobbySlugs.length > 0) {
        excerpt = `Personalized for ${hobbySlugs.join(", ")}`;
        title = "Hobbies";
      } else {
        return null;
      }

      if (!excerpt?.trim() || !hubCategoryForModule(slug)) return null;

      return { slug, title, excerpt: excerpt.trim() };
    })
    .filter(Boolean) as { slug: string; title: string; excerpt: string }[];

  return (
    <div>
      <p className="font-display text-xl leading-relaxed text-[var(--briefing-ink)] md:text-2xl">
        {lede}
      </p>

      {highlights.length > 0 && (
        <section className="mt-12">
          <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--briefing-muted)]">
            Today&apos;s highlights
          </h2>
          <ul className="mt-6 space-y-6">
            {highlights.map((h) => (
              <li key={h.label}>
                <Link
                  href={categoryHref(token, date, h.href)}
                  className="group block"
                >
                  <p className="font-sans text-xs font-medium text-[var(--briefing-green)]">
                    {h.label}
                  </p>
                  <p className="mt-1 font-display text-lg leading-snug group-hover:text-[var(--briefing-green)]">
                    {h.text}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-12">
        <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--briefing-muted)]">
          Your modules
        </h2>
        <p className="mt-2 font-sans text-xs text-[var(--briefing-muted)]">
          Weather, books, music, and more—tap a module to open it.
        </p>
        {moduleTiles.length === 0 ? (
          <p className="mt-4 font-sans text-sm text-[var(--briefing-muted)]">
            Turn on modules in settings to see them here.
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-5">
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
          <div className="mt-4 flex flex-wrap gap-3">
            {disabled.map((m) => (
              <DisabledModuleCard key={m.slug} name={m.name} token={token} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
