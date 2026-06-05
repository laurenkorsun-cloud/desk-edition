import { toZonedTime } from "date-fns-tz";

/** True if subscriber's local time is within 15 min of deliveryTime (HH:mm). */
export function isLocalTimeInWindow(
  timezone: string,
  deliveryTime: string,
  now: Date = new Date()
): boolean {
  try {
    const zoned = toZonedTime(now, timezone);
    const [targetH, targetM] = deliveryTime.split(":").map(Number);
    const h = zoned.getHours();
    const m = zoned.getMinutes();
    const targetMinutes = targetH * 60 + targetM;
    const currentMinutes = h * 60 + m;
    return currentMinutes >= targetMinutes && currentMinutes < targetMinutes + 15;
  } catch {
    return false;
  }
}
