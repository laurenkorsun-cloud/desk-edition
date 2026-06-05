import { NextResponse } from "next/server";
import { getConfigStatus } from "@/lib/env-config";

export const dynamic = "force-dynamic";

/** Public config check (names only, never secret values). */
export async function GET() {
  const status = getConfigStatus();
  return NextResponse.json({
    ok: status.supabase,
    ...status,
    appUrl: process.env.NEXT_PUBLIC_APP_URL ? "set" : "missing",
  });
}
