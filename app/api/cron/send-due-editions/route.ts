import { NextResponse } from "next/server";
import { verifyCronSecret } from "@/lib/utils";
import { isSupabaseConfigured } from "@/lib/supabase";
import { sendAllDuePersonalEditions } from "@/lib/generate-personal-edition";
import { sendAlertEmail } from "@/lib/email";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!verifyCronSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 503 }
    );
  }

  try {
    const result = await sendAllDuePersonalEditions();
    if (result.errors.length > 0) {
      await sendAlertEmail(
        `Send-due completed with errors:\n${result.errors.join("\n")}`
      );
    }
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    await sendAlertEmail(`Send-due cron failed: ${message}`);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  return GET(request);
}
