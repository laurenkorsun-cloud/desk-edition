"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  clearSubscriberToken,
  loadSubscriberToken,
} from "@/lib/subscriber-session";
import { briefingPathForToken } from "@/lib/subscriber-urls";

type ReturningProfile = {
  token: string;
  email: string;
  onboardingCompleted: boolean;
};

export function ReturningUserCard() {
  const [profile, setProfile] = useState<ReturningProfile | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = loadSubscriberToken();
    if (!token) {
      setChecking(false);
      return;
    }

    fetch(`/api/profile?token=${token}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error || !data.subscriber || data.subscriber.status !== "active") {
          clearSubscriberToken();
          return;
        }
        setProfile({
          token,
          email: data.subscriber.email,
          onboardingCompleted: Boolean(data.subscriber.onboarding_completed),
        });
      })
      .catch(() => clearSubscriberToken())
      .finally(() => setChecking(false));
  }, []);

  if (checking || !profile) return null;

  const href = profile.onboardingCompleted
    ? briefingPathForToken(profile.token)
    : `/onboarding?token=${profile.token}`;

  const label = profile.onboardingCompleted
    ? "Open my briefing"
    : "Finish my briefing";

  return (
    <div className="mb-8 rounded-sm border border-[var(--accent)]/30 bg-[var(--card)] px-5 py-4 text-left">
      <p className="font-sans text-sm font-medium text-[var(--ink)]">
        Welcome back
      </p>
      <p className="mt-1 font-sans text-sm text-[var(--muted)]">
        {profile.email}
      </p>
      <Link
        href={href}
        className="mt-4 inline-block rounded-sm bg-[var(--accent)] px-5 py-2.5 font-sans text-sm font-medium text-white hover:bg-[var(--accent-hover)]"
      >
        {label}
      </Link>
    </div>
  );
}
