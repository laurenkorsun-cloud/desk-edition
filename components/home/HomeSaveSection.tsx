"use client";

import { useState } from "react";
import { loadDemo, demoToProfilePayload } from "@/lib/demo-storage";
import { briefingPathForToken } from "@/lib/subscriber-urls";

export function HomeSaveSection() {
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
      if (!res.ok) throw new Error(data.error ?? "Subscribe failed");

      // Email confirm required — no dashboard until they click the link
      if (!data.token) {
        setStatus("success");
        setMessage(data.message);
        return;
      }

      const token = data.token as string;
      const prefs = loadDemo();
      const payload = demoToProfilePayload(prefs);
      setMessage("Building your first briefing…");
      const profileRes = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, ...payload }),
      });
      if (!profileRes.ok) {
        const err = await profileRes.json();
        throw new Error(err.error ?? "Could not save preferences");
      }
      const profileData = await profileRes.json();
      if (!profileData.editionReady) {
        await fetch("/api/me/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
      }
      window.location.assign(briefingPathForToken(token));
      return;
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <section
      id="save"
      className="scroll-mt-20 border-t border-[var(--border)] bg-[var(--accent)] py-16 text-white"
    >
      <div className="mx-auto max-w-2xl px-6 text-center">
        <h2 className="font-display text-2xl md:text-3xl">
          Like what you built? Get it every morning.
        </h2>
        <p className="mt-3 font-sans text-sm opacity-90">
          We&apos;ll save your preferences and deliver your briefing each
          morning at the time you chose in the builder.
        </p>
        <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-md">
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="email"
              required
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-sm border-0 px-4 py-3 font-sans text-[var(--ink)] outline-none focus:ring-2 focus:ring-[var(--gold)]"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="rounded-sm bg-[var(--paper)] px-6 py-3 font-sans text-sm font-medium text-[var(--accent)] hover:bg-white disabled:opacity-60"
            >
              {status === "loading" ? "Saving…" : "Save & subscribe"}
            </button>
          </div>
          {message && (
            <p
              className={`mt-3 font-sans text-sm ${status === "error" ? "text-red-200" : "opacity-90"}`}
            >
              {message}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
