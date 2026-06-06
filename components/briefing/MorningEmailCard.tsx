"use client";

import { useState } from "react";
import Link from "next/link";

export function MorningEmailCard({
  token,
  enabled,
  deliveryTime,
  timezone,
  email,
}: {
  token: string;
  enabled: boolean;
  deliveryTime: string;
  timezone: string;
  email: string;
}) {
  const [on, setOn] = useState(enabled);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [message, setMessage] = useState("");

  async function patchToggle(next: boolean) {
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/me/morning-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, morning_email_enabled: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not update");
      setOn(next);
      setMessage(
        next
          ? `Morning emails on — we'll send to ${email} at ${deliveryTime} (${timezone}).`
          : "Morning emails off. Your web briefing is always here."
      );
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  }

  async function sendTest() {
    setTesting(true);
    setMessage("");
    try {
      const res = await fetch("/api/me/morning-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, sendTest: true }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not send");
      setMessage("Test email sent — check your inbox (and spam) in a minute.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Send failed");
    } finally {
      setTesting(false);
    }
  }

  return (
    <section className="mt-16 border-t border-[var(--briefing-ink)]/10 pt-10">
      <h2 className="font-display text-xl text-[var(--briefing-ink)]">
        Get this in your inbox
      </h2>
      <p className="mt-2 max-w-xl font-sans text-sm leading-relaxed text-[var(--briefing-muted)]">
        Optional morning delivery at {deliveryTime} ({timezone}). You can
        always read today&apos;s edition here on the web.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <label className="flex cursor-pointer items-center gap-3 font-sans text-sm text-[var(--briefing-ink)]">
          <input
            type="checkbox"
            checked={on}
            disabled={saving}
            onChange={(e) => void patchToggle(e.target.checked)}
            className="h-4 w-4 accent-[var(--briefing-green)]"
          />
          <span>Morning emails</span>
        </label>
        <button
          type="button"
          onClick={() => void sendTest()}
          disabled={testing}
          className="rounded-sm border border-[var(--briefing-ink)]/15 px-4 py-2 font-sans text-sm text-[var(--briefing-ink)] hover:border-[var(--briefing-green)] disabled:opacity-60"
        >
          {testing ? "Sending…" : "Send test email now"}
        </button>
        <Link
          href={`/settings?token=${token}`}
          className="font-sans text-sm text-[var(--briefing-muted)] underline hover:text-[var(--briefing-green)]"
        >
          Settings
        </Link>
      </div>

      {message && (
        <p className="mt-4 font-sans text-sm text-[var(--briefing-muted)]">
          {message}
        </p>
      )}
    </section>
  );
}
