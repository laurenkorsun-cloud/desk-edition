"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { PageBackLink } from "@/components/briefing/BriefingBackLink";
import { saveSubscriberToken } from "@/lib/subscriber-session";

export function PersonalEditionEmpty({
  token,
  date,
  autoGenerate = true,
}: {
  token: string;
  date: string;
  autoGenerate?: boolean;
}) {
  const [loading, setLoading] = useState(autoGenerate);
  const [error, setError] = useState("");
  const started = useRef(false);

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

  useEffect(() => {
    saveSubscriberToken(token);
  }, [token]);

  useEffect(() => {
    if (!autoGenerate || started.current) return;
    started.current = true;
    void generate();
  }, [autoGenerate, token]);

  return (
    <div className="briefing-root mx-auto max-w-lg px-6 py-20 text-center">
      <div className="mb-8 flex justify-center">
        <PageBackLink href="/" label="← Home" />
      </div>
      <h1 className="font-display text-3xl text-[var(--ink)]">
        {loading ? "Building your briefing…" : `Your briefing for ${date}`}
      </h1>
      <p className="mt-4 font-sans text-[var(--muted)]">
        {loading
          ? "Pulling headlines and writing your first edition. This can take up to a minute."
          : "Today's edition hasn't been generated yet."}
      </p>
      {!loading && (
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={generate}
            className="rounded-sm bg-[var(--briefing-green)] px-6 py-3 font-sans text-sm font-medium text-white hover:bg-[var(--briefing-green-hover)]"
          >
            Generate today&apos;s briefing
          </button>
          <Link
            href={`/onboarding?token=${token}`}
            className="rounded-sm border border-[var(--border)] px-6 py-3 font-sans text-sm font-medium text-[var(--ink)] hover:border-[var(--accent)]"
          >
            Edit preferences
          </Link>
        </div>
      )}
      {loading && (
        <div
          className="mx-auto mt-8 h-8 w-8 animate-spin rounded-full border-2 border-[var(--briefing-green)] border-t-transparent"
          aria-hidden
        />
      )}
      {error && (
        <p className="mt-4 font-sans text-sm text-red-700">{error}</p>
      )}
    </div>
  );
}
