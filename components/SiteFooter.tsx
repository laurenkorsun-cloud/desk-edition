"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname === "/" || pathname.startsWith("/me/")) return null;

  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--paper)]">
      <div className="mx-auto max-w-6xl px-6 py-10 font-sans text-sm text-[var(--muted)]">
        <p className="max-w-xl leading-relaxed">
          Desk Edition is a private morning briefing for interns and new grads—
          personalized news, modules you choose, and talking points. Delivered at
          9:30 AM in your timezone.
        </p>
        <p className="mt-4 text-xs">
          <Link href="/unsubscribe" className="underline hover:text-[var(--ink)]">
            Unsubscribe
          </Link>
        </p>
      </div>
    </footer>
  );
}
