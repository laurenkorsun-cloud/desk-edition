import { NextResponse } from "next/server";
import { z } from "zod";
import { isSupabaseConfigured } from "@/lib/supabase";
import {
  createPendingSubscriber,
  getSubscriberByEmail,
  reactivatePending,
} from "@/lib/subscribers";
import { sendConfirmEmail, isResendConfigured } from "@/lib/email";
import { createServiceClient } from "@/lib/supabase";
import { redirectForSubscriber, getSubscriberUrls } from "@/lib/subscriber-urls";

const BodySchema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: "Service not configured. Add Supabase env vars." },
      { status: 503 }
    );
  }

  try {
    const body = BodySchema.parse(await request.json());
    const email = body.email.toLowerCase().trim();

    let subscriber = await getSubscriberByEmail(email);

    if (subscriber?.status === "active") {
      const urls = getSubscriberUrls(subscriber.unsubscribe_token);
      return NextResponse.json({
        message: "Welcome back—opening your briefing.",
        redirectUrl: redirectForSubscriber(subscriber),
        settingsUrl: urls.settingsUrl,
        alreadySubscribed: true,
      });
    }

    if (subscriber?.status === "unsubscribed") {
      subscriber = await reactivatePending(email);
    } else if (!subscriber) {
      subscriber = await createPendingSubscriber(email);
    }

    if (isResendConfigured() && subscriber.confirm_token) {
      await sendConfirmEmail({
        to: email,
        confirmToken: subscriber.confirm_token,
      });
      return NextResponse.json({
        message:
          "Check your inbox to confirm—then you'll get Desk Edition each morning.",
      });
    }

    const supabase = createServiceClient();
    const { data: activeSub } = await supabase
      .from("subscribers")
      .update({
        status: "active",
        confirmed_at: new Date().toISOString(),
      })
      .eq("id", subscriber.id)
      .select()
      .single();

    const row = activeSub ?? subscriber;
    const urls = getSubscriberUrls(row.unsubscribe_token);

    return NextResponse.json({
      message: row.onboarding_completed
        ? "You're subscribed—opening your briefing."
        : "You're subscribed—set up your briefing now.",
      redirectUrl: redirectForSubscriber(row),
      onboardingUrl: urls.onboardingUrl,
      settingsUrl: urls.settingsUrl,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json(
      { error: "Could not subscribe. Try again later." },
      { status: 500 }
    );
  }
}
