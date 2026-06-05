"use client";

import { useEffect, useState } from "react";
import { briefingPathForToken } from "@/lib/subscriber-urls";

type Lens = { slug: string; name: string };
type Module = {
  slug: string;
  name: string;
  description: string;
  default_on?: boolean;
};

const TIMEZONES = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Phoenix",
  "Europe/London",
  "Asia/Tokyo",
];

export function ProfileForm({
  token,
  mode,
}: {
  token: string;
  mode: "onboarding" | "settings";
}) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [lenses, setLenses] = useState<Lens[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [primaryLens, setPrimaryLens] = useState("audit");
  const [secondaryLens, setSecondaryLens] = useState("");
  const [timezone, setTimezone] = useState("America/New_York");
  const [city, setCity] = useState("");
  const [calendarNotes, setCalendarNotes] = useState("");
  const [spotifyUrl, setSpotifyUrl] = useState("");
  const [toggles, setToggles] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch(`/api/profile?token=${token}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setLenses(data.lenses ?? []);
        setModules(data.modules ?? []);
        const sub = data.subscriber;
        if (sub.primary_lens_slug) setPrimaryLens(sub.primary_lens_slug);
        if (sub.secondary_lens_slug) setSecondaryLens(sub.secondary_lens_slug);
        if (sub.timezone) setTimezone(sub.timezone);
        if (sub.city) setCity(sub.city);
        if (sub.manual_calendar_notes) setCalendarNotes(sub.manual_calendar_notes);
        if (sub.spotify_playlist_url) setSpotifyUrl(sub.spotify_playlist_url);
        const t: Record<string, boolean> = {};
        for (const m of data.modules ?? []) {
          t[m.slug] = data.toggles?.[m.slug] ?? m.default_on ?? false;
        }
        setToggles(t);
      })
      .catch((e) => setMessage(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          primary_lens_slug: primaryLens,
          secondary_lens_slug: secondaryLens || null,
          timezone,
          city: city || null,
          manual_calendar_notes: calendarNotes || null,
          spotify_playlist_url: spotifyUrl || null,
          toggles,
          onboarding_completed: true,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");

      if (mode === "onboarding") {
        setMessage("Building your first briefing…");
        if (!data.editionReady) {
          await fetch("/api/me/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ token }),
          });
        }
        window.location.assign(briefingPathForToken(token));
        return;
      }

      setMessage("Settings saved.");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="font-sans text-[var(--muted)]">Loading…</p>;
  }

  return (
    <form onSubmit={handleSave} className="max-w-xl space-y-8">
      <section>
        <h2 className="font-sans text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
          Industry lens
        </h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <label className="block font-sans text-sm">
            Primary
            <select
              value={primaryLens}
              onChange={(e) => setPrimaryLens(e.target.value)}
              className="mt-1 w-full border border-[var(--border)] bg-white px-3 py-2"
            >
              {lenses.map((l) => (
                <option key={l.slug} value={l.slug}>
                  {l.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block font-sans text-sm">
            Secondary (optional)
            <select
              value={secondaryLens}
              onChange={(e) => setSecondaryLens(e.target.value)}
              className="mt-1 w-full border border-[var(--border)] bg-white px-3 py-2"
            >
              <option value="">None</option>
              {lenses.map((l) => (
                <option key={l.slug} value={l.slug}>
                  {l.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section>
        <h2 className="font-sans text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
          Delivery · 9:30 AM local
        </h2>
        <label className="mt-3 block font-sans text-sm">
          Timezone
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="mt-1 w-full border border-[var(--border)] bg-white px-3 py-2"
          >
            {TIMEZONES.map((tz) => (
              <option key={tz} value={tz}>
                {tz}
              </option>
            ))}
          </select>
        </label>
        <label className="mt-3 block font-sans text-sm">
          City (weather)
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="New York"
            className="mt-1 w-full border border-[var(--border)] px-3 py-2"
          />
        </label>
      </section>

      <section>
        <h2 className="font-sans text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
          Modules
        </h2>
        <div className="mt-3 space-y-2">
          {modules.map((m) => (
            <label
              key={m.slug}
              className="flex cursor-pointer items-start gap-3 border border-[var(--border)] bg-white p-3"
            >
              <input
                type="checkbox"
                checked={toggles[m.slug] ?? false}
                onChange={(e) =>
                  setToggles({ ...toggles, [m.slug]: e.target.checked })
                }
                className="mt-1"
              />
              <span>
                <span className="font-sans font-medium">{m.name}</span>
                <span className="block font-sans text-xs text-[var(--muted)]">
                  {m.description}
                </span>
              </span>
            </label>
          ))}
        </div>
      </section>

      <section>
        <h2 className="font-sans text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
          Optional
        </h2>
        <label className="mt-3 block font-sans text-sm">
          Today&apos;s calendar (manual — paste your schedule)
          <textarea
            value={calendarNotes}
            onChange={(e) => setCalendarNotes(e.target.value)}
            rows={3}
            className="mt-1 w-full border border-[var(--border)] px-3 py-2 font-sans text-sm"
            placeholder="9:00 Client call — FS walkthrough&#10;2:00 Team check-in"
          />
        </label>
        <label className="mt-3 block font-sans text-sm">
          Spotify playlist URL
          <input
            value={spotifyUrl}
            onChange={(e) => setSpotifyUrl(e.target.value)}
            placeholder="https://open.spotify.com/playlist/..."
            className="mt-1 w-full border border-[var(--border)] px-3 py-2"
          />
        </label>
      </section>

      <button
        type="submit"
        disabled={saving}
        className="bg-[var(--accent)] px-6 py-3 font-sans text-sm text-white disabled:opacity-60"
      >
        {saving ? "Saving…" : mode === "onboarding" ? "Finish setup" : "Save settings"}
      </button>
      {message && (
        <p className="font-sans text-sm text-[var(--muted)]">{message}</p>
      )}
    </form>
  );
}
