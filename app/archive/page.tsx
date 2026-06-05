import Link from "next/link";
import { getPublishedEditions } from "@/lib/editions";
import { isSupabaseConfigured } from "@/lib/supabase";

export const metadata = {
  title: "Archive",
};

export default async function ArchivePage() {
  let editions: Awaited<ReturnType<typeof getPublishedEditions>> = [];

  if (isSupabaseConfigured()) {
    try {
      editions = await getPublishedEditions(30);
    } catch {
      editions = [];
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="font-display text-4xl text-[var(--ink)]">Archive</h1>
      <p className="mt-2 font-sans text-[var(--muted)]">
        Past editions—newest first.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <Link
          href="/edition/sample"
          className="block border border-[var(--border)] bg-[var(--card)] p-5 transition hover:border-[var(--accent)]"
        >
          <p className="font-sans text-xs uppercase tracking-wider text-[var(--muted)]">
            Preview
          </p>
          <h2 className="mt-1 font-display text-xl">Sample Edition</h2>
          <p className="mt-2 line-clamp-2 font-sans text-sm text-[var(--muted)]">
            See the format before the first automated run.
          </p>
        </Link>

        {editions.map((ed) => (
          <Link
            key={ed.slug}
            href={`/edition/${ed.slug}`}
            className="block border border-[var(--border)] bg-white p-5 transition hover:border-[var(--accent)] dark:bg-[var(--card)]"
          >
            {ed.edition_number && (
              <p className="font-sans text-xs uppercase tracking-wider text-[var(--muted)]">
                № {ed.edition_number}
              </p>
            )}
            <h2 className="mt-1 font-display text-xl">{ed.title}</h2>
            <p className="mt-2 line-clamp-2 font-sans text-sm text-[var(--muted)]">
              {ed.lede}
            </p>
          </Link>
        ))}
      </div>

      {editions.length === 0 && (
        <p className="mt-8 font-sans text-sm text-[var(--muted)]">
          No published editions yet. After setup, run the generator from{" "}
          <code className="text-xs">/admin/preview</code> or wait for the morning
          cron.
        </p>
      )}
    </div>
  );
}
