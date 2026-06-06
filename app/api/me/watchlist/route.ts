import { NextResponse } from "next/server";
import { z } from "zod";
import { getSubscriberByToken } from "@/lib/profile";
import { createServiceClient } from "@/lib/supabase";

const BodySchema = z.object({
  token: z.string().uuid(),
  symbols: z.array(z.string().min(1).max(10)).max(12),
});

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }
  const sub = await getSubscriberByToken(token);
  if (!sub) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({
    symbols: (sub as { watchlist_symbols?: string[] }).watchlist_symbols ?? [],
  });
}

export async function POST(request: Request) {
  try {
    const body = BodySchema.parse(await request.json());
    const sub = await getSubscriberByToken(body.token);
    if (!sub || sub.status !== "active") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const symbols = [
      ...new Set(body.symbols.map((s) => s.toUpperCase().trim())),
    ].slice(0, 12);

    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from("subscribers")
      .update({ watchlist_symbols: symbols })
      .eq("id", sub.id)
      .select("watchlist_symbols")
      .single();

    if (error) throw error;
    return NextResponse.json({ symbols: data.watchlist_symbols ?? [] });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Could not save watchlist" }, { status: 500 });
  }
}
