import { NextResponse } from "next/server";
import { verifyAdminSecret } from "@/lib/utils";
import { isSupabaseConfigured } from "@/lib/supabase";
import { upsertEdition } from "@/lib/editions";
import { getSampleEditionContent } from "@/lib/sample-edition";

export async function POST(request: Request) {
  if (!verifyAdminSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Supabase not configured" },
      { status: 503 }
    );
  }

  const content = getSampleEditionContent();
  const edition = await upsertEdition({
    slug: "sample",
    title: "Sample Edition",
    lede: content.lede,
    content,
    status: "published",
    editionNumber: 0,
    publishedAt: new Date().toISOString(),
  });

  return NextResponse.json({ edition });
}
