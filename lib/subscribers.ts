import { createServiceClient } from "@/lib/supabase";
import type { SubscriberRow } from "@/lib/types";

export async function getSubscriberByEmail(
  email: string
): Promise<SubscriberRow | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("subscribers")
    .select("*")
    .eq("email", email.toLowerCase())
    .maybeSingle();

  if (error) throw error;
  return data as SubscriberRow | null;
}

export async function createPendingSubscriber(
  email: string
): Promise<SubscriberRow> {
  const supabase = createServiceClient();
  const normalized = email.toLowerCase().trim();

  const { data, error } = await supabase
    .from("subscribers")
    .insert({ email: normalized, status: "pending" })
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      const existing = await getSubscriberByEmail(normalized);
      if (existing) return existing;
    }
    throw error;
  }
  const row = data as SubscriberRow;
  try {
    const { initDefaultToggles } = await import("@/lib/profile");
    await initDefaultToggles(row.id);
  } catch {
    /* config tables may not exist yet */
  }
  return row;
}

export async function confirmSubscriber(
  confirmToken: string
): Promise<SubscriberRow | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("subscribers")
    .update({
      status: "active",
      confirmed_at: new Date().toISOString(),
    })
    .eq("confirm_token", confirmToken)
    .eq("status", "pending")
    .select()
    .maybeSingle();

  if (error) throw error;
  return data as SubscriberRow | null;
}

export async function unsubscribeByToken(
  token: string
): Promise<SubscriberRow | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("subscribers")
    .update({ status: "unsubscribed" })
    .eq("unsubscribe_token", token)
    .select()
    .maybeSingle();

  if (error) throw error;
  return data as SubscriberRow | null;
}

export async function reactivatePending(email: string): Promise<SubscriberRow> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("subscribers")
    .update({ status: "pending" })
    .eq("email", email.toLowerCase())
    .select()
    .single();

  if (error) throw error;
  return data as SubscriberRow;
}

export async function getActiveSubscribers(): Promise<SubscriberRow[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("subscribers")
    .select("*")
    .eq("status", "active");

  if (error) throw error;
  return (data ?? []) as SubscriberRow[];
}
