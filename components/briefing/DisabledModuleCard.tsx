import Link from "next/link";
import { moduleLabel } from "@/config/module-labels";

type Props = {
  slug: string;
  token: string;
};

export function DisabledModuleCard({ slug, token }: Props) {
  return (
    <Link
      href={`/settings?token=${token}`}
      className="rounded-sm border border-[var(--briefing-ink)]/[0.08] bg-[var(--briefing-ink)]/[0.02] px-3 py-2 font-sans text-sm text-[var(--briefing-muted)] transition hover:border-[var(--briefing-green)]/30 hover:text-[var(--briefing-ink)]"
    >
      <span className="font-medium text-[var(--briefing-ink)]">
        {moduleLabel(slug)}
      </span>
      <span className="text-[var(--briefing-muted)]"> · off</span>
    </Link>
  );
}
