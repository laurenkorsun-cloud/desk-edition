"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  token: string;
  date: string;
  className?: string;
};

export function BriefingBackLink({ token, date, className = "" }: Props) {
  const pathname = usePathname() ?? "";
  const parts = pathname.split("/").filter(Boolean);
  const isTodayHub =
    parts.length === 3 && parts[0] === "me" && parts[1] === token;

  const href = isTodayHub ? "/" : `/me/${token}/${date}`;
  const label = isTodayHub ? "← Home" : "← Back";

  return (
    <Link
      href={href}
      className={`inline-flex items-center rounded-sm border border-[var(--border)] bg-white/90 px-3 py-1.5 font-sans text-sm font-medium text-[var(--ink-soft)] shadow-sm transition hover:border-[var(--accent)] hover:text-[var(--accent)] ${className}`}
    >
      {label}
    </Link>
  );
}

/** Static back link for settings, onboarding, etc. */
export function PageBackLink({
  href,
  label = "← Back",
}: {
  href: string;
  label?: string;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center rounded-sm border border-[var(--border)] bg-white/90 px-3 py-1.5 font-sans text-sm font-medium text-[var(--ink-soft)] shadow-sm transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
    >
      {label}
    </Link>
  );
}
