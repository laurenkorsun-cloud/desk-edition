"use client";

import { useState } from "react";

type Props = {
  token: string;
};

export function RegenerateMarketsBanner({ token }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function regenerate() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/me/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to regenerate");
      window.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
      setLoading(false);
    }
  }

  return (
    <div className="mb-8 rounded-md border border-amber-200/80 bg-amber-50/90 px-5 py-4">
      <p className="font-sans text-sm font-medium text-amber-950">
        Market stories look like sample or short summaries.
      </p>
      <p className="mt-1 font-sans text-sm text-amber-900/80">
        Regenerate today&apos;s briefing for tiered overnight moves with numbers,
        a market pulse, and what to watch before the open.
      </p>
      <button
        type="button"
        onClick={regenerate}
        disabled={loading}
        className="mt-3 rounded-sm bg-[var(--briefing-green)] px-4 py-2 font-sans text-sm font-medium text-white hover:bg-[var(--briefing-green-hover)] disabled:opacity-60"
      >
        {loading ? "Generating…" : "Regenerate today's briefing"}
      </button>
      {error && (
        <p className="mt-2 font-sans text-xs text-red-700">{error}</p>
      )}
    </div>
  );
}
