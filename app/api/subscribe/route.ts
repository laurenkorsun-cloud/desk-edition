import { NextResponse } from "next/server";
import { z } from "zod";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getConfigStatus } from "@/lib/env-config";
import {
  createPendingSubscriber,
  getSubscriberByEmail,
  reactivatePending,
} from "@/lib/subscribers";
import { sendConfirmEmail, isResendConfigured } from "@/lib/email";
import { createServiceClient } from "@/lib/supabase";
import {
  redirectForSubscriber,
  relativeRedirectForSubscriber,
  getSubscriberUrls,
} from "@/lib/subscriber-urls";

function subscribePayload(subscriber: {
  unsubscribe_token: string;
  onboarding_completed?: boolean;
}) {
  const urls = getSubscriberUrls(subscriber.unsubscribe_token);
  return {
    token: subscriber.unsubscribe_token,
    redirectPath: relativeRedirectForSubscriber(subscriber),
    redirectUrl: redirectForSubscriber(subscriber),
    onboardingUrl: urls.onboardingUrl,
    settingsUrl: urls.settingsUrl,
    personalUrl: urls.personalUrl,
  };
}

const BodySchema = z.object({
  email: z.string().email(),
});

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    const { missing } = getConfigStatus();
    return NextResponse.json(
      {
        error:
          "Database not configured on this server. Add Supabase env vars in Vercel (or run npm run env:sync-vercel from your laptop).",
        missing,
        health: "/api/health",
      },
      { status: 503 }
    );
  }

  try {
    const body = BodySchema.parse(await request.json());
    const email = body.email.toLowerCase().trim();

    let subscriber = await getSubscriberByEmail(email);

    if (subscriber?.status === "active") {
      return NextResponse.json({
        message: "Welcome back—opening your briefing.",
        alreadySubscribed: true,
        ...subscribePayload(subscriber),
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

    return NextResponse.json({
      message: "You're subscribed—opening your briefing.",
      ...subscribePayload(row),
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
