export function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://127.0.0.1:4000";
}

export function verifyCronSecret(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

export function verifyAdminSecret(request: Request): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const header = request.headers.get("x-admin-secret");
  const query = new URL(request.url).searchParams.get("secret");
  return header === secret || query === secret;
}
