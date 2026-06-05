import type { ModuleBlock } from "@/lib/config-types";

type Props = {
  block: ModuleBlock;
};

export function ModuleContentView({ block }: Props) {
  const items = block.items ?? [];

  return (
    <div className="space-y-10">
      {block.synopsis && (
        <p className="font-sans text-[15px] leading-relaxed text-[var(--briefing-ink)]/90">
          {block.synopsis}
        </p>
      )}
      {block.description && (
        <p className="font-sans text-[15px] leading-relaxed text-[var(--briefing-ink)]/80">
          {block.description}
        </p>
      )}

      {items.map((item, i) => (
        <article key={`${item.headline}-${i}`} className="space-y-3">
          <h3 className="font-display text-xl text-[var(--briefing-ink)] md:text-2xl">
            {item.headline}
          </h3>
          <p className="font-sans text-[15px] leading-relaxed">{item.synopsis}</p>
          <p className="font-sans text-[15px] leading-relaxed text-[var(--briefing-muted)]">
            {item.description}
          </p>
          {item.sourceUrl && (
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-sans text-sm text-[var(--briefing-green)] hover:underline"
            >
              {item.sourceName ?? "Source"} →
            </a>
          )}
        </article>
      ))}

      {items.length === 0 && block.body && (
        <div className="font-sans text-[15px] leading-relaxed whitespace-pre-wrap">
          {block.body.replace(/\*\*/g, "")}
        </div>
      )}

      {(block.sources?.length ?? 0) > 0 && (
        <footer className="pt-4">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--briefing-muted)]">
            Sources
          </p>
          <ul className="mt-3 space-y-2">
            {block.sources!.map((s) =>
              s.url ? (
                <li key={s.url}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-sans text-sm text-[var(--briefing-green)] hover:underline"
                  >
                    {s.title} →
                  </a>
                </li>
              ) : null
            )}
          </ul>
        </footer>
      )}
    </div>
  );
}
