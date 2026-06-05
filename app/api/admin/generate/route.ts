import { NextResponse } from "next/server";
import { verifyAdminSecret } from "@/lib/utils";
import { isSupabaseConfigured } from "@/lib/supabase";
import { generateAndPublishEdition } from "@/lib/generate-edition";
import { getAppUrl } from "@/lib/utils";

export const maxDuration = 300;
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const secret = new URL(request.url).searchParams.get("secret");
  const req =
    secret && !request.headers.get("x-admin-secret")
      ? new Request(request.url, {
          method: "POST",
          headers: { "x-admin-secret": secret },
        })
      : request;

  if (!verifyAdminSecret(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 503 }
    );
  }

  try {
    const result = await generateAndPublishEdition(new Date(), {
      sendEmails: true,
      force: true,
    });

    const accept = request.headers.get("accept") ?? "";
    if (accept.includes("text/html")) {
      return NextResponse.redirect(
        `${getAppUrl()}/edition/${result.edition.slug}`
      );
    }

    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
