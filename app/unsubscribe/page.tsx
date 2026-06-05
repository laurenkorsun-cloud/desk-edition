import Link from "next/link";
import { unsubscribeByToken } from "@/lib/subscribers";
import { isSupabaseConfigured } from "@/lib/supabase";

type Props = { searchParams: Promise<{ token?: string }> };

export default async function UnsubscribePage({ searchParams }: Props) {
  const { token } = await searchParams;
  let success = false;
  let email: string | null = null;

  if (token && isSupabaseConfigured()) {
    try {
      const sub = await unsubscribeByToken(token);
      if (sub) {
        success = true;
        email = sub.email;
      }
    } catch {
      /* handled below */
    }
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-20 text-center">
      <h1 className="font-display text-3xl text-[var(--ink)]">
        {success ? "You're unsubscribed" : "Unsubscribe"}
      </h1>
      {success ? (
        <p className="mt-4 font-sans text-[var(--muted)]">
          <span className="text-[var(--ink)]">{email}</span> will no longer
          receive Desk Edition.
        </p>
      ) : (
        <p className="mt-4 font-sans text-[var(--muted)]">
          {token
            ? "This link is invalid or already used. Use the link in your latest email."
            : "Use the unsubscribe link in any Desk Edition email."}
        </p>
      )}
      <Link
        href="/"
        className="mt-8 inline-block font-sans text-sm text-[var(--accent)] underline"
      >
        Back to home
      </Link>
    </div>
  );
}
