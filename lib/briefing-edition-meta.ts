import { createServiceClient } from "@/lib/supabase";
import { format, parseISO } from "date-fns";

export async function getEditionNumberForDate(
  subscriberId: string,
  dateSlug: string
): Promise<number> {
  const supabase = createServiceClient();
  const { count, error } = await supabase
    .from("personal_editions")
    .select("id", { count: "exact", head: true })
    .eq("subscriber_id", subscriberId)
    .lte("slug", dateSlug);

  if (error) throw error;
  return count ?? 1;
}

export function formatDeliveryTime(
  deliveryTime: string,
  timezone: string
): string {
  const [h, m] = deliveryTime.split(":").map(Number);
  const hour = h ?? 9;
  const min = m ?? 30;
  const period = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 || 12;
  const tz = timezone.replace("_", " ").split("/").pop() ?? timezone;
  return `${h12}:${String(min).padStart(2, "0")} ${period} · ${tz}`;
}

export function formatBriefingDate(dateSlug: string): string {
  try {
    return format(parseISO(dateSlug), "EEEE, MMMM d, yyyy");
  } catch {
    return dateSlug;
  }
}
