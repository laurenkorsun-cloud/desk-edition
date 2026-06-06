type Props = {
  primaryName: string;
  secondaryName?: string | null;
  hobbies?: string[];
};

export function PersonalizationBanner({
  primaryName,
  secondaryName,
  hobbies = [],
}: Props) {
  const hobbyNote =
    hobbies.length > 0 ? ` · ${hobbies.slice(0, 3).join(", ")}` : "";

  return (
    <p className="mt-4 inline-flex flex-wrap items-center gap-x-2 gap-y-1 rounded-sm border border-[var(--briefing-green)]/25 bg-[var(--briefing-green)]/[0.05] px-3 py-2 font-sans text-xs text-[var(--briefing-ink)]">
      <span className="font-semibold uppercase tracking-[0.14em] text-[var(--briefing-green)]">
        Personalized
      </span>
      <span>
        for <strong>{primaryName}</strong>
        {secondaryName ? (
          <>
            {" "}
            + <strong>{secondaryName}</strong>
          </>
        ) : null}
        {hobbyNote}
      </span>
    </p>
  );
}
