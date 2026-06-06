"use client";

const STEP_COUNT = 4;

export function OnboardingProgress({ step }: { step: number }) {
  const progress = (step / STEP_COUNT) * 100;

  return (
    <div className="space-y-4">
      <div
        className="h-1 w-full overflow-hidden rounded-full bg-[var(--border)]"
        role="progressbar"
        aria-valuenow={step}
        aria-valuemin={1}
        aria-valuemax={STEP_COUNT}
        aria-label={`Onboarding step ${step} of ${STEP_COUNT}`}
      >
        <div
          className="h-full rounded-full bg-[var(--gold)] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-center gap-2">
        {Array.from({ length: STEP_COUNT }, (_, i) => {
          const n = i + 1;
          const active = n === step;
          const done = n < step;
          return (
            <span
              key={n}
              className={`h-2.5 w-2.5 rounded-full transition ${
                active
                  ? "bg-[var(--accent)] ring-2 ring-[var(--accent)] ring-offset-2"
                  : done
                    ? "bg-[var(--gold)]"
                    : "bg-[var(--border)]"
              }`}
              aria-hidden
            />
          );
        })}
      </div>
    </div>
  );
}
