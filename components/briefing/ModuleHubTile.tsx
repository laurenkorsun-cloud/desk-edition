import Link from "next/link";
import { categoryHref, modulePageSlug } from "@/config/briefing-nav";
import { MODULE_HUB_META } from "@/config/module-hub-meta";

type Props = {
  slug: string;
  title: string;
  excerpt: string;
  token: string;
  date: string;
};

export function ModuleHubTile({ slug, title, excerpt, token, date }: Props) {
  const meta = MODULE_HUB_META[slug];
  const category = modulePageSlug(slug);
  const label = meta?.shortLabel ?? title;

  const inner = (
    <div className="flex h-full min-h-[9.5rem] flex-col items-center justify-center rounded-md border border-[var(--briefing-ink)]/[0.06] bg-white/60 px-4 py-6 text-center shadow-[0_1px_2px_rgba(28,25,22,0.04)] transition duration-200 group-hover:border-[var(--briefing-green)]/25 group-hover:bg-white group-hover:shadow-[0_4px_14px_rgba(28,25,22,0.06)]">
      <h3 className="font-display text-[1.35rem] leading-[1.15] tracking-tight text-[var(--briefing-ink)] transition group-hover:text-[var(--briefing-green)] sm:text-[1.5rem]">
        {label}
      </h3>
      <p className="mt-3 max-w-[14rem] line-clamp-3 font-sans text-[11px] leading-relaxed text-[var(--briefing-muted)]">
        {excerpt}
      </p>
      <span className="mt-4 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--briefing-green)] opacity-0 transition group-hover:opacity-100">
        Open →
      </span>
    </div>
  );

  if (!category) {
    return <div className="h-full">{inner}</div>;
  }

  return (
    <Link
      href={categoryHref(token, date, category)}
      className="group block h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--briefing-green)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--briefing-bg)]"
    >
      {inner}
    </Link>
  );
}
