"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const pathname = usePathname();
  if (pathname === "/" || pathname.startsWith("/me/")) return null;

  return (
    <header className="border-b border-[var(--border)] bg-[var(--paper)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <Link href="/" className="group">
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--muted)]">
            Morning briefing
          </p>
          <span className="font-display text-2xl text-[var(--ink)] transition group-hover:text-[var(--accent)] md:text-3xl">
            Desk Edition
          </span>
        </Link>
        <nav className="flex items-center gap-6 font-sans text-sm text-[var(--muted)]">
          <Link href="/archive" className="hover:text-[var(--ink)]">
            Archive
          </Link>
          <Link
            href="/#save"
            className="rounded-sm bg-[var(--accent)] px-4 py-2 text-white hover:bg-[var(--accent-hover)]"
          >
            Subscribe
          </Link>
        </nav>
      </div>
    </header>
  );
}
