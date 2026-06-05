import type { EditionContent } from "@/lib/types";
import { CopyButton } from "@/components/CopyButton";

type Props = {
  title: string;
  lede: string;
  content: EditionContent;
  editionNumber?: number | null;
  slug: string;
};

export function EditionView({ title, lede, content, editionNumber, slug }: Props) {
  return (
    <article>
      <header className="mb-10 border-b border-[var(--border)] pb-8">
        <p className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--muted)]">
          {editionNumber ? `Edition № ${editionNumber}` : "Edition"} · {slug}
        </p>
        <h1 className="mt-2 font-display text-4xl leading-tight text-[var(--ink)] md:text-5xl">
          {title}
        </h1>
        <p className="mt-6 border-l-4 border-[var(--gold)] pl-5 font-display text-xl italic leading-relaxed text-[var(--ink-soft)] md:text-2xl">
          {lede}
        </p>
      </header>

      <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
        <div className="space-y-12">
          {content.sections.map((section) => (
            <section key={section.name}>
              <h2 className="mb-6 font-sans text-xs font-semibold uppercase tracking-[0.15em] text-[var(--muted)]">
                {section.name}
              </h2>
              <div className="space-y-8">
                {section.stories.map((story, i) => (
                  <div
                    key={`${section.name}-${i}`}
                    className="border-b border-[var(--border)] pb-8 last:border-0"
                  >
                    <h3 className="font-display text-2xl leading-snug text-[var(--ink)]">
                      {story.sourceUrl ? (
                        <a
                          href={story.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[var(--accent)]"
                        >
                          {story.headline}
                        </a>
                      ) : (
                        story.headline
                      )}
                    </h3>
                    {story.sourceName && (
                      <p className="mt-1 font-sans text-xs text-[var(--muted)]">
                        via {story.sourceName}
                      </p>
                    )}
                    <p className="mt-3 font-sans leading-relaxed text-[var(--ink-soft)]">
                      {story.summary}
                    </p>
                    <p className="mt-3 font-sans text-sm leading-relaxed text-[var(--accent)]">
                      <span className="font-medium text-[var(--ink)]">
                        Why it matters:{" "}
                      </span>
                      {story.whyItMatters}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <aside className="lg:sticky lg:top-8 lg:self-start">
          <div className="rounded-sm bg-[var(--card)] p-6 shadow-sm ring-1 ring-[var(--border)]">
            <h2 className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-[var(--gold-dark)]">
              Talking points
            </h2>
            <p className="mt-2 font-sans text-sm text-[var(--muted)]">
              Use these before noon—specific, office-ready conversation starters.
            </p>
            <ol className="mt-5 space-y-4">
              {content.talkingPoints.map((point, i) => (
                <li key={i} className="flex gap-3">
                  <span className="font-display text-lg text-[var(--gold-dark)]">
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-sans text-sm leading-relaxed text-[var(--ink)]">
                      {point}
                    </p>
                    <div className="mt-1">
                      <CopyButton text={point} />
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </aside>
      </div>
    </article>
  );
}
