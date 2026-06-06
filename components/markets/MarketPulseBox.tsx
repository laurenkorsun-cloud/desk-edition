type Props = {
  pulse: string;
};

export function MarketPulseBox({ pulse }: Props) {
  return (
    <div className="rounded-sm border border-[var(--briefing-ink)]/[0.1] bg-gradient-to-r from-[var(--briefing-green)]/[0.06] to-white/80 px-5 py-4 shadow-[0_1px_3px_rgba(28,25,22,0.04)]">
      <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--briefing-green)]">
        Today&apos;s pulse
      </p>
      <p className="mt-2 font-display text-lg leading-snug text-[var(--briefing-ink)] md:text-xl">
        {pulse}
      </p>
    </div>
  );
}
