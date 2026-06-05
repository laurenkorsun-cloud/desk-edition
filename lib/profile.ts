import { createServiceClient } from "@/lib/supabase";
import type { SubscriberRow } from "@/lib/types";
import { DEFAULT_CORP_TOGGLES } from "@/config/seed-lenses-modules";
import { getActiveModules } from "@/lib/config-db";

export type SubscriberProfile = SubscriberRow & {
  primary_lens_slug: string | null;
  secondary_lens_slug: string | null;
  delivery_time: string;
  city: string | null;
  manual_calendar_notes: string | null;
  spotify_playlist_url: string | null;
  onboarding_completed: boolean;
  last_sent_on: string | null;
  hobbies?: string[];
  morning_goals?: string[];
  content_tone?: string;
};

export async function getSubscriberByToken(
  token: string
): Promise<SubscriberProfile | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("subscribers")
    .select("*")
    .eq("unsubscribe_token", token)
    .maybeSingle();

  if (error) throw error;
  return data as SubscriberProfile | null;
}

export async function getSubscriberToggles(
  subscriberId: string
): Promise<Record<string, boolean>> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("subscriber_module_toggles")
    .select("module_slug, enabled")
    .eq("subscriber_id", subscriberId);

  if (error) throw error;

  const map: Record<string, boolean> = {};
  for (const row of data ?? []) {
    map[row.module_slug] = row.enabled;
  }
  return map;
}

export async function getEnabledModulesForSubscriber(
  subscriberId: string
): Promise<string[]> {
  const allModules = await getActiveModules();
  const toggles = await getSubscriberToggles(subscriberId);

  return allModules
    .filter((m) => toggles[m.slug] ?? m.default_on)
    .map((m) => m.slug);
}

export async function saveProfile(params: {
  token: string;
  primary_lens_slug: string;
  secondary_lens_slug?: string | null;
  timezone: string;
  city?: string | null;
  manual_calendar_notes?: string | null;
  spotify_playlist_url?: string | null;
  toggles: Record<string, boolean>;
  onboarding_completed?: boolean;
  hobbies?: string[];
  morning_goals?: string[];
  content_tone?: string;
}): Promise<SubscriberProfile> {
  const supabase = createServiceClient();
  const sub = await getSubscriberByToken(params.token);
  if (!sub) throw new Error("Subscriber not found");

  const { data, error } = await supabase
    .from("subscribers")
    .update({
      primary_lens_slug: params.primary_lens_slug,
      secondary_lens_slug: params.secondary_lens_slug ?? null,
      timezone: params.timezone,
      city: params.city ?? null,
      manual_calendar_notes: params.manual_calendar_notes ?? null,
      spotify_playlist_url: params.spotify_playlist_url ?? null,
      onboarding_completed: params.onboarding_completed ?? true,
      hobbies: params.hobbies ?? [],
      morning_goals: params.morning_goals ?? [],
      content_tone: params.content_tone ?? "balanced",
    })
    .eq("id", sub.id)
    .select()
    .single();

  if (error) throw error;

  for (const [module_slug, enabled] of Object.entries(params.toggles)) {
    await supabase.from("subscriber_module_toggles").upsert({
      subscriber_id: sub.id,
      module_slug,
      enabled,
    });
  }

  return data as SubscriberProfile;
}

export async function initDefaultToggles(subscriberId: string): Promise<void> {
  const supabase = createServiceClient();
  const modules = await getActiveModules();

  for (const mod of modules) {
    const enabled = DEFAULT_CORP_TOGGLES[mod.slug] ?? mod.default_on;
    await supabase.from("subscriber_module_toggles").upsert({
      subscriber_id: subscriberId,
      module_slug: mod.slug,
      enabled,
    });
  }
}

export async function getSubscribersDueForDelivery(
  deliveryTime = "09:30"
): Promise<SubscriberProfile[]> {
  const { getActiveSubscribers } = await import("@/lib/subscribers");
  const { isLocalTimeInWindow } = await import("@/lib/timezone");

  const subs = (await getActiveSubscribers()) as SubscriberProfile[];
  const today = new Date().toISOString().slice(0, 10);

  return subs.filter((sub) => {
    if (!sub.onboarding_completed || !sub.primary_lens_slug) return false;
    if (sub.last_sent_on === today) return false;
    if ((sub.delivery_time ?? "09:30") !== deliveryTime) return false;
    return isLocalTimeInWindow(sub.timezone ?? "America/New_York", deliveryTime);
  });
}

export async function markSubscriberSent(
  subscriberId: string,
  date: string
): Promise<void> {
  const supabase = createServiceClient();
  await supabase
    .from("subscribers")
    .update({ last_sent_on: date })
    .eq("id", subscriberId);
}
