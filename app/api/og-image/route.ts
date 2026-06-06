import { NextResponse } from "next/server";
import { fetchOgImageUrl } from "@/lib/fetch-og-image";

export async function GET(request: Request) {
  const url = new URL(request.url).searchParams.get("url");
  if (!url?.startsWith("http")) {
    return NextResponse.json({ imageUrl: null }, { status: 400 });
  }
  const imageUrl = await fetchOgImageUrl(url);
  return NextResponse.json({ imageUrl });
}
