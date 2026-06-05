"use client";

import { useState } from "react";

export function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      setStatus("success");
      setMessage(data.message);
      setEmail("");
      if (data.onboardingUrl) {
        window.location.href = data.onboardingUrl;
        return;
      }
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Failed to subscribe");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          required
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 border border-[var(--border)] bg-white px-4 py-3 font-sans text-[var(--ink)] outline-none focus:border-[var(--accent)]"
          disabled={status === "loading"}
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="whitespace-nowrap bg-[var(--accent)] px-6 py-3 font-sans text-sm font-medium text-white hover:bg-[var(--accent-hover)] disabled:opacity-60"
        >
          {status === "loading" ? "Joining…" : "Get the briefing"}
        </button>
      </div>
      {message && (
        <p
          className={`mt-3 font-sans text-sm ${
            status === "error" ? "text-red-700" : "text-[var(--muted)]"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
