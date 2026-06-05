import Link from "next/link";

type Props = {
  name: string;
  token: string;
};

export function DisabledModuleCard({ name, token }: Props) {
  return (
    <div className="rounded-sm bg-[var(--briefing-ink)]/[0.03] px-4 py-3 font-sans text-sm text-[var(--briefing-muted)]">
      <span className="text-[var(--briefing-ink)]">{name}</span>
      {" — "}
      off ·{" "}
      <Link
        href={`/settings?token=${token}`}
        className="text-[var(--briefing-green)] hover:underline"
      >
        Enable in settings
      </Link>
    </div>
  );
}
