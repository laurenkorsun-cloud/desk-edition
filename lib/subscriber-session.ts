/** Client-only: remember this device's briefing link between visits. */

export const SUBSCRIBER_TOKEN_KEY = "deskEditionSubscriberToken";

export function saveSubscriberToken(token: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SUBSCRIBER_TOKEN_KEY, token);
  } catch {
    /* private browsing / quota */
  }
}

export function loadSubscriberToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(SUBSCRIBER_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function clearSubscriberToken() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(SUBSCRIBER_TOKEN_KEY);
  } catch {
    /* ignore */
  }
}
