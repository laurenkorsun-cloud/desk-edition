import { NextResponse } from "next/server";
import { confirmSubscriber } from "@/lib/subscribers";
import { isSupabaseConfigured } from "@/lib/supabase";
import { redirectForSubscriber } from "@/lib/subscriber-urls";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const token = requestUrl.searchParams.get("token");
  const base = process.env.NEXT_PUBLIC_APP_URL?.trim() || requestUrl.origin;

  if (!token || !isSupabaseConfigured()) {
    return NextResponse.redirect(`${base}/?subscribe=error`);
  }

  const subscriber = await confirmSubscriber(token);

  if (!subscriber) {
    return NextResponse.redirect(`${base}/?subscribe=invalid`);
  }

  return NextResponse.redirect(redirectForSubscriber(subscriber));
}
