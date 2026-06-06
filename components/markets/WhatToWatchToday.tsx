import type { WatchTodayDisplay } from "@/lib/markets-watch-today";

type Props = WatchTodayDisplay;

export function WhatToWatchToday({ intro, items }: Props) {
  if (!intro && items.length === 0) return null;

  return (
    <section className="relative left-1/2 mb-10 w-screen max-w-[100vw] -translate-x-1/2">
      <div className="w-full border-y border-[var(--gold)]/35 bg-gradient-to-b from-[var(--gold)]/[0.08] via-white/80 to-[var(--briefing-green)]/[0.04] px-4 py-6 shadow-[0_1px_3px_rgba(28,25,22,0.04)] md:px-8 md:py-8 lg:px-12">
        <div className="mx-auto w-full max-w-6xl">
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.22em] text-[var(--gold-dark)]">
            What to watch today
          </p>
          <p className="mt-4 font-sans text-[15px] leading-relaxed text-[var(--briefing-ink)] md:text-base lg:max-w-4xl">
            {intro}
          </p>

          {items.length > 0 && (
            <ul className="mt-6 grid w-full gap-4 sm:grid-cols-2 lg:grid-cols-2 lg:gap-x-10 lg:gap-y-5">
              {items.map((item) => (
                <li key={item.text} className="flex gap-3">
                  <span
                    className="mt-1 shrink-0 font-sans text-sm text-[var(--briefing-green)]"
                    aria-hidden
                  >
                    ◆
                  </span>
                  <div className="min-w-0">
                    <p className="font-sans text-sm font-medium leading-snug text-[var(--briefing-ink)] md:text-[15px]">
                      {item.text}
                    </p>
                    {item.hint && (
                      <p className="mt-1 font-sans text-xs leading-relaxed text-[var(--briefing-muted)] md:text-sm">
                        {item.hint}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
