import { NextResponse } from "next/server";
import { verifyAdminSecret } from "@/lib/utils";
import { getSubscriberByToken } from "@/lib/profile";
import { generatePersonalEditionForSubscriber } from "@/lib/generate-personal-edition";

export async function POST(request: Request) {
  if (!verifyAdminSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = new URL(request.url).searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  const sub = await getSubscriberByToken(token);
  if (!sub) {
    return NextResponse.json({ error: "Subscriber not found" }, { status: 404 });
  }

  try {
    const result = await generatePersonalEditionForSubscriber(sub, new Date(), {
      sendEmail: true,
    });
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
