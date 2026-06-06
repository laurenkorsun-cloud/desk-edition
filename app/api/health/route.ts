import { NextResponse } from "next/server";
import { getConfigStatus } from "@/lib/env-config";

export const dynamic = "force-dynamic";

/** Public config check (names only, never secret values). */
export async function GET() {
  const status = getConfigStatus();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
  return NextResponse.json({
    ok: status.supabase,
    subscribeReady: status.supabase,
    supabase: status.supabase,
    openai: status.openai,
    missing: status.missing.filter((m) => !m.includes("optional")),
    optionalMissing: status.missing.filter((m) => m.includes("optional")),
    appUrl: appUrl ? "set" : "missing",
    message: status.supabase
      ? "Supabase is configured — you can subscribe and seed."
      : "Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local, then restart npm run dev.",
  });
}
