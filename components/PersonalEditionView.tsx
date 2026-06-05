import { EditionView } from "@/components/EditionView";
import type { PersonalEditionContent } from "@/lib/config-types";

type Props = {
  title: string;
  lede: string;
  content: PersonalEditionContent;
  slug: string;
  token: string;
};

export function PersonalEditionView({ title, lede, content, slug, token }: Props) {
  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-6">
        <p className="font-sans text-sm text-[var(--muted)]">
          Personal edition · {content.meta.primaryLens}
          {content.meta.secondaryLens ? ` + ${content.meta.secondaryLens}` : ""}
        </p>
        <a
          href={`/settings?token=${token}`}
          className="rounded-sm border border-[var(--border)] bg-[var(--card)] px-4 py-2 font-sans text-sm font-medium text-[var(--accent)] hover:border-[var(--accent)]"
        >
          Customize briefing
        </a>
      </div>

      {content.modules.length > 0 && (
        <div className="mb-10 grid gap-4 sm:grid-cols-2">
          {content.modules.map((m) => (
            <div
              key={m.slug}
              className="border border-[var(--border)] bg-[var(--card)] p-4"
            >
              <h3 className="font-sans text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                {m.title}
              </h3>
              <p className="mt-2 whitespace-pre-wrap font-sans text-sm leading-relaxed">
                {m.body.replace(/\*\*/g, "")}
              </p>
            </div>
          ))}
        </div>
      )}

      <EditionView
        title={title}
        lede={lede}
        content={content}
        slug={slug}
      />
    </div>
  );
}
