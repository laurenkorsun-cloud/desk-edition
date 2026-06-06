"use client";

import { useCallback, useEffect, useState } from "react";
import { FieldGroup } from "@/components/builder/BriefingBuilder";
import { PreviewModal } from "@/components/home/PreviewModal";
import { OnboardingProgress } from "@/components/onboarding/OnboardingProgress";
import {
  countEnabledModules,
  DEFAULT_DEMO,
  DEMO_GOALS,
  DEMO_HOBBY_CHIPS,
  DEMO_LENSES,
  DEMO_MODULES,
  DEMO_TIMEZONES,
  TALKING_POINT_TONE_SAMPLES,
  toneLabel,
  type DemoPreferences,
} from "@/config/home-demo";
import type { PreviewSample } from "@/lib/preview-sample";
import { getDefaultTogglesForLens } from "@/lib/lens-personalization";
import { DEFAULT_CORP_TOGGLES } from "@/config/seed-lenses-modules";

const STEP_COUNT = 4;

export function OnboardingWizard({
  initialPrefs,
  onChange,
  onSubmit,
  saving,
  message,
}: {
  initialPrefs?: DemoPreferences;
  onChange?: (prefs: DemoPreferences) => void;
  onSubmit: (prefs: DemoPreferences) => void;
  saving: boolean;
  message: string;
}) {
  const [prefs, setPrefs] = useState<DemoPreferences>(
    initialPrefs ?? DEFAULT_DEMO
  );
  const [step, setStep] = useState(1);
  const [mounted, setMounted] = useState(false);
  const [stepError, setStepError] = useState("");
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
        if (
          patch.primaryLens &&
          patch.primaryLens === next.secondaryLens
        ) {
          next.secondaryLens = null;
        }
        if (patch.primaryLens) {
          const stillDefault =
            JSON.stringify(prev.modules) === JSON.stringify(DEFAULT_CORP_TOGGLES);
          if (stillDefault) {
            next.modules = getDefaultTogglesForLens(patch.primaryLens);
          }
        }
        onChange?.(next);
        return next;
      });
      setStepError("");
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

  const hobbyCount =
    prefs.hobbies.length + (prefs.customHobby.trim() ? 1 : 0);
  const enabledModules = countEnabledModules(prefs.modules);
  const tone = toneLabel(prefs.contentTone);

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
    const mod = DEMO_MODULES.find((m) => m.slug === slug);
    if (mod?.locked) return;
    update({
      modules: { ...prefs.modules, [slug]: !prefs.modules[slug] },
    });
  };

  function validateStep(current: number): boolean {
    if (current === 2 && hobbyCount < 1) {
      setStepError("Pick at least one hobby or interest to continue.");
      return false;
    }
    setStepError("");
    return true;
  }

  function goNext() {
    if (!validateStep(step)) return;
    setStep((s) => Math.min(s + 1, STEP_COUNT));
  }

  function goBack() {
    setStepError("");
    setStep((s) => Math.max(s - 1, 1));
  }

  const secondaryOptions = DEMO_LENSES.filter(
    (l) => l.slug !== prefs.primaryLens
  );

  const essentialModules = DEMO_MODULES.filter((m) => m.group === "essential");
  const lifestyleModules = DEMO_MODULES.filter((m) => m.group === "lifestyle");

  if (!mounted) {
    return <p className="font-sans text-[var(--muted)]">Loading…</p>;
  }

  return (
    <div>
      <OnboardingProgress step={step} />

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-sans text-sm text-[var(--muted)]">
          Your choices shape tomorrow&apos;s edition.
        </p>
        <button
          type="button"
          onClick={() => setPreviewOpen(true)}
          className="shrink-0 rounded-sm border border-[var(--gold)] bg-[var(--paper)] px-5 py-2.5 font-sans text-sm font-medium text-[var(--gold-dark)] hover:bg-[var(--card)]"
        >
          Preview edition
        </button>
      </div>

      <div className="mt-10 max-w-3xl space-y-10">
        {step === 1 && (
          <FieldGroup title="Your industry">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
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
                  <p className="mt-1 font-sans text-xs text-[var(--muted)]">
                    {l.subtitle}
                  </p>
                </button>
              ))}
            </div>

            <label className="mt-6 block font-sans text-sm font-medium text-[var(--ink-soft)]">
              Secondary focus{" "}
              <span className="font-normal text-[var(--muted)]">(optional)</span>
              <select
                value={prefs.secondaryLens ?? ""}
                onChange={(e) =>
                  update({
                    secondaryLens: e.target.value || null,
                  })
                }
                className="mt-1 w-full rounded-sm border border-[var(--border)] px-3 py-2.5 font-sans text-sm"
              >
                <option value="">None</option>
                {secondaryOptions.map((l) => (
                  <option key={l.slug} value={l.slug}>
                    {l.name}
                  </option>
                ))}
              </select>
            </label>
          </FieldGroup>
        )}

        {step === 2 && (
          <>
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

            <FieldGroup title="Talking points tone">
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
              <p className="mt-4 border-l-2 border-[var(--gold)] pl-4 font-display text-base italic leading-relaxed text-[var(--ink-soft)]">
                {TALKING_POINT_TONE_SAMPLES[tone]}
              </p>
            </FieldGroup>
          </>
        )}

        {step === 3 && (
          <FieldGroup
            title="When your briefing updates"
            hint="Your edition refreshes on the web at this time each day. Turn on morning email anytime from your dashboard."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="font-sans text-sm font-medium text-[var(--ink-soft)]">
                New edition ready at
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
              </label>
            </div>
          </FieldGroup>
        )}

        {step === 4 && (
          <FieldGroup title="Modules in your briefing">
            {enabledModules > 6 && (
              <p className="mb-4 rounded-sm border border-[var(--gold)] bg-[var(--card)] px-4 py-3 font-sans text-sm text-[var(--ink-soft)]">
                You&apos;ve turned on {enabledModules} modules—most people keep
                it to six for a quick read.
              </p>
            )}

            <ModuleGroup
              title="Essential"
              modules={essentialModules}
              prefs={prefs}
              onToggle={toggleModule}
            />
            <ModuleGroup
              title="Lifestyle"
              modules={lifestyleModules}
              prefs={prefs}
              onToggle={toggleModule}
            />
          </FieldGroup>
        )}
      </div>

      <div className="mt-12 flex flex-col items-center gap-4 border-t border-[var(--border)] pt-10">
        <div className="flex w-full max-w-sm flex-col gap-3 sm:flex-row sm:justify-center">
          {step > 1 && (
            <button
              type="button"
              onClick={goBack}
              disabled={saving}
              className="rounded-sm border border-[var(--border)] bg-white px-8 py-3 font-sans text-sm font-medium text-[var(--ink-soft)] hover:border-[var(--accent)] disabled:opacity-60"
            >
              Back
            </button>
          )}
          {step < STEP_COUNT ? (
            <button
              type="button"
              onClick={goNext}
              className="rounded-sm bg-[var(--accent)] px-8 py-3 font-sans text-sm font-medium text-white hover:bg-[var(--accent-hover)]"
            >
              Next
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (!validateStep(2)) {
                  setStep(2);
                  return;
                }
                onSubmit(prefs);
              }}
              disabled={saving}
              className="rounded-sm bg-[var(--accent)] px-10 py-4 font-sans text-sm font-medium text-white hover:bg-[var(--accent-hover)] disabled:opacity-60"
            >
              {saving ? "Creating your briefing…" : "See my Desk Edition"}
            </button>
          )}
        </div>

        {step === STEP_COUNT && (
          <p className="font-sans text-xs text-[var(--muted)]">
            You can change this anytime in settings.
          </p>
        )}

        {(stepError || message) && (
          <p className="font-sans text-sm text-[var(--muted)]">
            {stepError || message}
          </p>
        )}
      </div>

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

function ModuleGroup({
  title,
  modules,
  prefs,
  onToggle,
}: {
  title: string;
  modules: typeof DEMO_MODULES;
  prefs: DemoPreferences;
  onToggle: (slug: string) => void;
}) {
  return (
    <div className="mb-6 last:mb-0">
      <h4 className="font-display text-lg text-[var(--ink)]">{title}</h4>
      <ul className="mt-3 divide-y divide-[var(--border)] rounded-sm border border-[var(--border)] bg-white">
        {modules.map((m) => {
          const on = prefs.modules[m.slug] ?? false;
          return (
            <li
              key={m.slug}
              className="flex items-center justify-between gap-4 px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="font-sans text-sm font-semibold text-[var(--ink)]">
                  {m.name}
                  {m.locked && (
                    <span className="ml-2 font-sans text-xs font-normal text-[var(--muted)]">
                      Always on
                    </span>
                  )}
                </p>
                <p className="font-sans text-xs text-[var(--muted)]">
                  {m.desc} · +{m.readMin} min
                </p>
              </div>
              <ToggleSwitch
                checked={on}
                disabled={m.locked}
                onChange={() => onToggle(m.slug)}
                label={`Toggle ${m.name}`}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function ToggleSwitch({
  checked,
  disabled,
  onChange,
  label,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={onChange}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${
        disabled
          ? "cursor-not-allowed bg-[var(--accent)] opacity-70"
          : checked
            ? "bg-[var(--accent)]"
            : "bg-[var(--border)]"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
          checked ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
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
          ? "border-2 border-[var(--accent)] bg-[var(--paper)] text-[var(--ink)]"
          : "border border-[var(--border)] bg-[var(--card)] text-[var(--ink-soft)] hover:border-[var(--accent)]"
      }`}
    >
      {label}
    </button>
  );
}
