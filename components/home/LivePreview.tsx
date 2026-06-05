"use client";

import type { PreviewSample } from "@/lib/preview-sample";
import { DEMO_LENSES } from "@/config/home-demo";
import type { DemoPreferences } from "@/config/home-demo";

export function LivePreview({
  prefs,
  sample,
  loading,
}: {
  prefs: DemoPreferences;
  sample: PreviewSample | null;
  loading: boolean;
}) {
  const lens = DEMO_LENSES.find((l) => l.slug === prefs.primaryLens);

  return (
    <div className="flex h-full flex-col bg-[var(--paper)]">
      <div className="border-b border-[var(--border)] bg-[var(--card)] px-6 py-5">
        <p className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--muted)]">
          Preview · mini edition
        </p>
        <h2 className="mt-1 font-display text-2xl text-[var(--ink)]">
          Tomorrow morning
        </h2>
        <p className="mt-1 font-sans text-sm text-[var(--muted)]">
          {prefs.wakeTime} · {prefs.timezone.replace("_", " ")} · {lens?.name}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        {loading && (
          <p className="font-sans text-sm text-[var(--muted)] animate-pulse">
            Updating your sample briefing…
          </p>
        )}

        {!loading && sample && (
          <div className="space-y-8">
            <p className="border-l-4 border-[var(--gold)] pl-4 font-display text-lg italic leading-relaxed text-[var(--ink-soft)]">
              {sample.lede}
            </p>

            {sample.sections.map((section) => (
              <section key={section.title}>
                <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-[var(--muted)]">
                  {section.title}
                </h3>
                <ul className="mt-3 space-y-2">
                  {section.lines.map((line, i) => (
                    <li
                      key={i}
                      className="font-sans text-sm leading-relaxed text-[var(--ink-soft)]"
                    >
                      {line}
                    </li>
                  ))}
                </ul>
              </section>
            ))}

            {sample.sections.length === 0 && (
              <p className="font-sans text-sm text-[var(--muted)]">
                Turn on modules in the builder to see sections here.
              </p>
            )}

            {prefs.modules.talking_points && sample.talkingPoints.length > 0 && (
              <footer className="border-t border-[var(--border)] pt-6">
                <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-[var(--gold-dark)]">
                  Talking points
                </h3>
                <ol className="mt-4 space-y-3">
                  {sample.talkingPoints.map((point, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="font-display text-lg text-[var(--gold-dark)]">
                        {i + 1}
                      </span>
                      <p className="font-sans text-sm leading-relaxed text-[var(--ink)]">
                        {point}
                      </p>
                    </li>
                  ))}
                </ol>
              </footer>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
