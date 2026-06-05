import Link from "next/link";
import { getEditionBySlug, slugFromDate } from "@/lib/editions";
import { isSupabaseConfigured } from "@/lib/supabase";

type Props = { searchParams: Promise<{ secret?: string }> };

export default async function AdminPreviewPage({ searchParams }: Props) {
  const { secret } = await searchParams;
  const adminSecret = process.env.ADMIN_SECRET;
  const authorized = adminSecret && secret === adminSecret;

  const todaySlug = slugFromDate(new Date());
  let todayStatus = "unknown";

  if (isSupabaseConfigured() && authorized) {
    try {
      const ed = await getEditionBySlug(todaySlug);
      todayStatus = ed ? `${ed.status} (${ed.slug})` : "not created";
    } catch {
      todayStatus = "error checking";
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="font-display text-3xl">Admin</h1>
      {!authorized ? (
        <p className="mt-4 font-sans text-[var(--muted)]">
          Add <code>?secret=YOUR_ADMIN_SECRET</code> to the URL.
        </p>
      ) : (
        <div className="mt-6 space-y-6 font-sans text-sm">
          <p>
            Today ({todaySlug}): <strong>{todayStatus}</strong>
          </p>
          <div className="space-y-3 rounded border border-[var(--border)] bg-[var(--card)] p-5">
            <p className="font-medium">Manual actions (POST with header):</p>
            <ul className="list-inside list-disc space-y-2 text-[var(--muted)]">
              <li>
                <code>POST /api/admin/generate</code> — Header{" "}
                <code>x-admin-secret</code> — Generate &amp; publish today, send
                emails
              </li>
              <li>
                <code>POST /api/admin/seed-sample</code> — Seed sample edition in
                DB
              </li>
            </ul>
          </div>
          <form
            action={`/api/admin/generate?secret=${secret}`}
            method="post"
            className="inline"
          >
            <button
              type="submit"
              className="rounded-sm bg-[var(--accent)] px-4 py-2 text-white"
            >
              Generate today&apos;s edition now
            </button>
          </form>
          <p className="text-[var(--muted)]">
            <Link href={`/admin/config?secret=${secret}`} className="underline">
              Edit lenses & modules
            </Link>
            {" · "}
            <Link href={`/edition/${todaySlug}`} className="underline">
              Global edition
            </Link>
            {" · "}
            <Link href="/edition/sample" className="underline">
              Sample
            </Link>
          </p>
          <p className="text-xs text-[var(--muted)]">
            Personal editions: hourly cron sends at 9:30 AM each user&apos;s
            timezone. POST /api/admin/seed-config once after migration 002.
          </p>
        </div>
      )}
    </div>
  );
}
