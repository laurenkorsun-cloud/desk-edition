"use client";

import { useState } from "react";
import Link from "next/link";

export function PersonalEditionEmpty({
  token,
  date,
}: {
  token: string;
  date: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/me/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate");
      setLoading(false);
    }
  }

  return (
    <div className="briefing-root mx-auto max-w-lg px-6 py-20 text-center">
      <h1 className="font-display text-3xl text-[var(--briefing-ink)]">
        Your briefing for {date}
      </h1>
      <p className="mt-4 font-sans text-[var(--muted)]">
        Today&apos;s edition hasn&apos;t been generated yet. Create it now, or
        adjust your preferences first.
      </p>
      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
        <button
          type="button"
          onClick={generate}
          disabled={loading}
          className="rounded-sm bg-[var(--briefing-green)] px-6 py-3 font-sans text-sm font-medium text-white hover:bg-[var(--briefing-green-hover)] disabled:opacity-60"
        >
          {loading ? "Generating…" : "Generate today's briefing"}
        </button>
        <Link
          href={`/settings?token=${token}`}
          className="rounded-sm border border-[var(--border)] px-6 py-3 font-sans text-sm font-medium text-[var(--ink)] hover:border-[var(--accent)]"
        >
          Customize settings
        </Link>
      </div>
      {error && (
        <p className="mt-4 font-sans text-sm text-red-700">{error}</p>
      )}
    </div>
  );
}
