import { NextResponse } from "next/server";
import { z } from "zod";
import { getSubscriberByToken } from "@/lib/profile";
import { generatePersonalEditionForSubscriber } from "@/lib/generate-personal-edition";

const BodySchema = z.object({
  token: z.string().uuid(),
});

export async function POST(request: Request) {
  try {
    const { token } = BodySchema.parse(await request.json());
    const subscriber = await getSubscriberByToken(token);
    if (!subscriber || subscriber.status !== "active") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const result = await generatePersonalEditionForSubscriber(subscriber, new Date(), {
      sendEmail: false,
    });

    return NextResponse.json({ slug: result.slug });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
