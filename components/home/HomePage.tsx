"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  DEFAULT_DEMO,
  DEMO_GOALS,
  DEMO_HOBBY_CHIPS,
  DEMO_LENSES,
  DEMO_MODULES,
  DEMO_TIMEZONES,
  type DemoPreferences,
} from "@/config/home-demo";
import { loadDemo, saveDemo } from "@/lib/demo-storage";
import { PreviewModal } from "@/components/home/PreviewModal";
import { HomeSaveSection } from "@/components/home/HomeSaveSection";
import { getSampleEditionContent } from "@/lib/sample-edition";
import type { PreviewSample } from "@/lib/preview-sample";

export function HomePage() {
  const [prefs, setPrefs] = useState<DemoPreferences>(DEFAULT_DEMO);
  const [mounted, setMounted] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewSample, setPreviewSample] = useState<PreviewSample | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  useEffect(() => {
    setPrefs(loadDemo());
    setMounted(true);
  }, []);

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

  const update = useCallback((patch: Partial<DemoPreferences>) => {
    setPrefs((prev) => {
      const next = { ...prev, ...patch };
      saveDemo(next);
      return next;
    });
  }, []);

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

  const sample = getSampleEditionContent();

  return (
    <div className="bg-[var(--paper)]">
      <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--paper)]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="group">
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--muted)]">
              Morning briefing
            </p>
            <span className="font-display text-2xl text-[var(--ink)] transition group-hover:text-[var(--accent)]">
              Desk Edition
            </span>
          </Link>
          <nav className="hidden items-center gap-8 font-sans text-sm text-[var(--muted)] sm:flex">
            <a href="#how" className="hover:text-[var(--ink)]">
              How it works
            </a>
            <Link href="/edition/sample" className="hover:text-[var(--ink)]">
              Sample briefing
            </Link>
            <a
              href="#builder"
              className="rounded-sm bg-[var(--accent)] px-4 py-2 text-white hover:bg-[var(--accent-hover)]"
            >
              Build yours
            </a>
          </nav>
        </div>
      </header>

      <section className="border-b border-[var(--border)] bg-[var(--card)]">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
          <p className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--muted)]">
            For interns, analysts & new grads
          </p>
          <h1 className="mt-4 max-w-2xl font-display text-4xl leading-[1.15] text-[var(--ink)] md:text-5xl">
            Your morning briefing for the office
          </h1>
          <p className="mt-6 max-w-xl font-sans text-lg leading-relaxed text-[var(--ink-soft)]">
            News, markets, and talking points—personalized to your job and
            interests. Delivered at 9:30 AM your time.
          </p>
          <div className="mt-8">
            <a
              href="#builder"
              className="inline-block rounded-sm bg-[var(--accent)] px-6 py-3 font-sans text-sm font-medium text-white hover:bg-[var(--accent-hover)]"
            >
              Build your briefing
            </a>
          </div>
        </div>
      </section>

      <section id="how" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-16">
        <h2 className="text-center font-display text-3xl text-[var(--ink)]">
          How it works
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              step: "1",
              title: "Customize",
              body: "Pick your job, hobbies, and modules—see your briefing update live.",
            },
            {
              step: "2",
              title: "Subscribe",
              body: "Save your setup with email. Tweak anytime in settings.",
            },
            {
              step: "3",
              title: "Wake up ready",
              body: "Get your edition by email and on the web every morning.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="rounded-sm border border-[var(--border)] bg-white p-6"
            >
              <span className="font-display text-3xl text-[var(--gold-dark)]">
                {item.step}
              </span>
              <h3 className="mt-4 font-sans text-lg font-semibold text-[var(--ink)]">
                {item.title}
              </h3>
              <p className="mt-2 font-sans text-sm leading-relaxed text-[var(--muted)]">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section
        id="builder"
        className="scroll-mt-24 border-t border-[var(--border)] bg-white py-16"
      >
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-display text-3xl text-[var(--ink)] md:text-4xl">
                Build your briefing
              </h2>
              <p className="mt-2 font-sans text-[var(--muted)]">
                Customize below, then open preview—sample updates after you pause
                (~400ms). No email until you&apos;re ready.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className="shrink-0 rounded-sm border-2 border-[var(--accent)] bg-[var(--paper)] px-5 py-3 font-sans text-sm font-medium text-[var(--accent)] hover:bg-[var(--card)]"
            >
              Preview edition
            </button>
          </div>

          {!mounted ? (
            <p className="mt-12 font-sans text-[var(--muted)]">Loading builder…</p>
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

                <FieldGroup title="Delivery">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="font-sans text-sm font-medium text-[var(--ink-soft)]">
                      Wake time
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
                      City (weather)
                      <input
                        type="text"
                        value={prefs.city}
                        onChange={(e) => update({ city: e.target.value })}
                        placeholder="New York"
                        className="mt-1 w-full rounded-sm border border-[var(--border)] px-3 py-2"
                      />
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
      </section>

      <section className="border-t border-[var(--border)] bg-[var(--paper)] py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="font-display text-2xl text-[var(--ink)]">
            Why talking points matter
          </h2>
          <ul className="mt-8 space-y-5">
            {sample.talkingPoints.slice(0, 3).map((point, i) => (
              <li
                key={i}
                className="flex gap-4 border-l-4 border-[var(--gold)] pl-5"
              >
                <span className="font-display text-2xl text-[var(--gold-dark)]">
                  {i + 1}
                </span>
                <p className="font-sans leading-relaxed text-[var(--ink-soft)]">
                  {point}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <HomeSaveSection />

      <footer className="border-t border-[var(--border)] bg-[var(--card)] py-8">
        <div className="mx-auto max-w-6xl px-6 text-center font-sans text-sm text-[var(--muted)]">
          <p>Desk Edition · Delivered 9:30 AM your local time</p>
          <p className="mt-2">
            <Link href="/unsubscribe" className="underline hover:text-[var(--ink)]">
              Unsubscribe
            </Link>
            {" · "}
            <Link href="/archive" className="underline hover:text-[var(--ink)]">
              Archive
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}

function FieldGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.15em] text-[var(--muted)]">
        {title}
      </h3>
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
