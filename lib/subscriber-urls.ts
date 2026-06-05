import { getAppUrl } from "@/lib/utils";

export function slugToday(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getSubscriberUrls(unsubscribeToken: string) {
  const base = getAppUrl().replace(/\/$/, "");
  const today = slugToday();
  return {
    personalUrl: `${base}/me/${unsubscribeToken}/${today}`,
    settingsUrl: `${base}/settings?token=${unsubscribeToken}`,
    onboardingUrl: `${base}/onboarding?token=${unsubscribeToken}`,
  };
}

export function relativeRedirectForSubscriber(subscriber: {
  unsubscribe_token: string;
  onboarding_completed?: boolean;
}) {
  const { unsubscribe_token, onboarding_completed } = subscriber;
  const today = slugToday();
  return onboarding_completed
    ? `/me/${unsubscribe_token}/${today}`
    : `/onboarding?token=${unsubscribe_token}`;
}

export function redirectForSubscriber(subscriber: {
  unsubscribe_token: string;
  onboarding_completed?: boolean;
}) {
  const base = getAppUrl().replace(/\/$/, "");
  return `${base}${relativeRedirectForSubscriber(subscriber)}`;
}
