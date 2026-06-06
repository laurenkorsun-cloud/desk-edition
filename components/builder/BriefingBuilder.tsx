"use client";

import { useCallback, useEffect, useState } from "react";
import {
  DEFAULT_DEMO,
  DEMO_GOALS,
  DEMO_HOBBY_CHIPS,
  DEMO_LENSES,
  DEMO_MODULES,
  DEMO_TIMEZONES,
  type DemoPreferences,
} from "@/config/home-demo";
import { PreviewModal } from "@/components/home/PreviewModal";
import type { PreviewSample } from "@/lib/preview-sample";

export function BriefingBuilder({
  initialPrefs,
  onChange,
}: {
  initialPrefs?: DemoPreferences;
  onChange?: (prefs: DemoPreferences) => void;
}) {
  const [prefs, setPrefs] = useState<DemoPreferences>(
    initialPrefs ?? DEFAULT_DEMO
  );
  const [mounted, setMounted] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewSample, setPreviewSample] = useState<PreviewSample | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  useEffect(() => {
    if (initialPrefs) setPrefs(initialPrefs);
    setMounted(true);
  }, [initialPrefs]);

  const update = useCallback(
    (patch: Partial<DemoPreferences>) => {
      setPrefs((prev) => {
        const next = { ...prev, ...patch };
        onChange?.(next);
        return next;
      });
    },
    [onChange]
  );

  useEffect(() => {
    if (!previewOpen) return;

    const debounce = setTimeout(() => {
      setPreviewLoading(true);
      fetch("/api/preview-sample", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prefs),
      })
        .then((r) => r.json())
        .then((data) => {
          if (!data.error) setPreviewSample(data);
        })
        .catch(() => setPreviewSample(null))
        .finally(() => setPreviewLoading(false));
    }, 400);

    return () => clearTimeout(debounce);
  }, [prefs, previewOpen]);

  const toggleHobby = (hobby: string) => {
    const next = prefs.hobbies.includes(hobby)
      ? prefs.hobbies.filter((h) => h !== hobby)
      : [...prefs.hobbies, hobby];
    update({ hobbies: next });
  };

  const toggleGoal = (id: string) => {
    const next = prefs.goals.includes(id)
      ? prefs.goals.filter((g) => g !== id)
      : [...prefs.goals, id];
    update({ goals: next });
  };

  const toggleModule = (slug: string) => {
    update({
      modules: { ...prefs.modules, [slug]: !prefs.modules[slug] },
    });
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <p className="font-sans text-sm text-[var(--muted)]">
          Customize below, then preview—a sample updates after you pause (~400ms).
        </p>
        <button
          type="button"
          onClick={() => setPreviewOpen(true)}
          className="shrink-0 rounded-sm border-2 border-[var(--accent)] bg-[var(--paper)] px-5 py-3 font-sans text-sm font-medium text-[var(--accent)] hover:bg-[var(--card)]"
        >
          Preview edition
        </button>
      </div>

      {!mounted ? (
        <p className="mt-12 font-sans text-[var(--muted)]">Loading…</p>
      ) : (
        <div className="mt-10 max-w-3xl space-y-10">
          <FieldGroup title="What do you do?">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {DEMO_LENSES.map((l) => (
                <button
                  key={l.slug}
                  type="button"
                  onClick={() => update({ primaryLens: l.slug })}
                  className={`rounded-sm border-2 p-4 text-left transition ${
                    prefs.primaryLens === l.slug
                      ? "border-[var(--accent)] bg-[var(--paper)]"
                      : "border-[var(--border)] bg-white hover:border-[var(--gold)]"
                  }`}
                >
                  <p className="font-sans text-sm font-semibold text-[var(--ink)]">
                    {l.name}
                  </p>
                </button>
              ))}
            </div>
          </FieldGroup>

          <FieldGroup title="Hobbies & interests">
            <div className="flex flex-wrap gap-2">
              {DEMO_HOBBY_CHIPS.map((h) => (
                <Chip
                  key={h}
                  label={h}
                  active={prefs.hobbies.includes(h)}
                  onClick={() => toggleHobby(h)}
                />
              ))}
            </div>
            <input
              type="text"
              placeholder="Add your own (e.g. photography)"
              value={prefs.customHobby}
              onChange={(e) => update({ customHobby: e.target.value })}
              className="mt-3 w-full rounded-sm border border-[var(--border)] px-4 py-2.5 font-sans text-sm outline-none focus:border-[var(--accent)]"
            />
          </FieldGroup>

          <FieldGroup title="Morning goals">
            <div className="flex flex-wrap gap-2">
              {DEMO_GOALS.map((g) => (
                <Chip
                  key={g.id}
                  label={g.label}
                  active={prefs.goals.includes(g.id)}
                  onClick={() => toggleGoal(g.id)}
                />
              ))}
            </div>
          </FieldGroup>

          <FieldGroup
            title="When your briefing updates"
            hint="We refresh your edition at this time each day (in your timezone). Weather uses the city below."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="font-sans text-sm font-medium text-[var(--ink-soft)]">
                Update time
                <input
                  type="time"
                  value={prefs.wakeTime}
                  onChange={(e) => update({ wakeTime: e.target.value })}
                  className="mt-1 w-full rounded-sm border border-[var(--border)] px-3 py-2"
                />
              </label>
              <label className="font-sans text-sm font-medium text-[var(--ink-soft)]">
                Timezone
                <select
                  value={prefs.timezone}
                  onChange={(e) => update({ timezone: e.target.value })}
                  className="mt-1 w-full rounded-sm border border-[var(--border)] px-3 py-2"
                >
                  {DEMO_TIMEZONES.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz}
                    </option>
                  ))}
                </select>
              </label>
              <label className="font-sans text-sm font-medium text-[var(--ink-soft)] sm:col-span-2">
                Location for weather
                <input
                  type="text"
                  value={prefs.city}
                  onChange={(e) => update({ city: e.target.value })}
                  placeholder="e.g. New York, NY or London"
                  className="mt-1 w-full rounded-sm border border-[var(--border)] px-3 py-2"
                />
                <span className="mt-1 block font-sans text-xs font-normal text-[var(--muted)]">
                  City or metro area — we use this for your daily forecast.
                </span>
              </label>
            </div>
          </FieldGroup>

          <FieldGroup title="Content tone">
            <div className="flex justify-between font-sans text-xs font-medium text-[var(--muted)]">
              <span>Straight facts</span>
              <span>Light & witty</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={prefs.contentTone}
              onChange={(e) =>
                update({ contentTone: Number(e.target.value) })
              }
              className="mt-2 w-full accent-[var(--accent)]"
            />
          </FieldGroup>

          <FieldGroup title="Modules in your briefing">
            <div className="grid gap-3 sm:grid-cols-2">
              {DEMO_MODULES.map((m) => (
                <button
                  key={m.slug}
                  type="button"
                  onClick={() => toggleModule(m.slug)}
                  className={`rounded-sm border p-4 text-left transition ${
                    prefs.modules[m.slug]
                      ? "border-[var(--accent)] bg-[var(--paper)]"
                      : "border-[var(--border)] bg-white opacity-80 hover:opacity-100"
                  }`}
                >
                  <p className="font-sans font-semibold text-[var(--ink)]">
                    {m.name}
                  </p>
                  <p className="mt-1 font-sans text-xs text-[var(--muted)]">
                    {m.desc}
                  </p>
                </button>
              ))}
            </div>
          </FieldGroup>
        </div>
      )}

      <PreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        prefs={prefs}
        sample={previewSample}
        loading={previewLoading}
      />
    </div>
  );
}

export function FieldGroup({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-[var(--muted)]">
        {title}
      </h3>
      {hint && (
        <p className="mt-2 font-sans text-sm leading-relaxed text-[var(--muted)]">
          {hint}
        </p>
      )}
      <div className="mt-4">{children}</div>
    </div>
  );
}

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-sm px-4 py-2 font-sans text-sm font-medium transition ${
        active
          ? "bg-[var(--accent)] text-white"
          : "border border-[var(--border)] bg-[var(--card)] text-[var(--ink-soft)] hover:border-[var(--accent)]"
      }`}
    >
      {label}
    </button>
  );
}
