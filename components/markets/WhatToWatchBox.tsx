type Props = {
  items: string[];
};

export function WhatToWatchBox({ items }: Props) {
  if (items.length === 0) return null;

  return (
    <div className="rounded-sm border border-[var(--gold)]/35 bg-gradient-to-br from-[var(--gold)]/[0.07] to-transparent px-5 py-4">
      <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--gold-dark)]">
        What to watch today
      </p>
      <ul className="mt-3 space-y-2">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-2 font-sans text-sm leading-relaxed text-[var(--briefing-ink)]"
          >
            <span className="text-[var(--gold-dark)]">◆</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
