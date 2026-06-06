"use client";

import { useCallback, useEffect, useState } from "react";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";
import { DEFAULT_DEMO, type DemoPreferences } from "@/config/home-demo";
import {
  demoPrefsToProfilePayload,
  subscriberToDemoPrefs,
} from "@/lib/profile-prefs";
import { saveSubscriberToken } from "@/lib/subscriber-session";
import { briefingPathForToken } from "@/lib/subscriber-urls";

export function OnboardingClient({ token }: { token: string }) {
  const [prefs, setPrefs] = useState<DemoPreferences>(DEFAULT_DEMO);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    saveSubscriberToken(token);
  }, [token]);

  useEffect(() => {
    fetch(`/api/profile?token=${token}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        if (data.subscriber) {
          setPrefs(
            subscriberToDemoPrefs(data.subscriber, data.toggles ?? {})
          );
        }
      })
      .catch((e) => setMessage(e.message))
      .finally(() => setLoading(false));
  }, [token]);

  const handleChange = useCallback((next: DemoPreferences) => {
    setPrefs(next);
  }, []);

  async function handleCreate(nextPrefs: DemoPreferences) {
    setSaving(true);
    setMessage("Building your first briefing…");
    try {
      const payload = demoPrefsToProfilePayload(nextPrefs);
      const profileRes = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          ...payload,
          onboarding_completed: true,
        }),
      });
      const profileData = await profileRes.json();
      if (!profileRes.ok) {
        throw new Error(profileData.error ?? "Could not save preferences");
      }
      if (!profileData.editionReady) {
        await fetch("/api/me/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
      }
      window.location.assign(briefingPathForToken(token));
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Something went wrong");
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="font-sans text-[var(--muted)]">Loading…</p>;
  }

  return (
    <OnboardingWizard
      initialPrefs={prefs}
      onChange={handleChange}
      onSubmit={handleCreate}
      saving={saving}
      message={message}
    />
  );
}
