import { NextResponse } from "next/server";
import { z } from "zod";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getSubscriberByToken } from "@/lib/profile";
import { createServiceClient } from "@/lib/supabase";
import { getPersonalEditionByToken } from "@/lib/personal-editions";
import { generatePersonalEditionForSubscriber } from "@/lib/generate-personal-edition";
import { sendPersonalEditionEmail, isResendConfigured } from "@/lib/email";
import { slugToday } from "@/lib/subscriber-urls";

const BodySchema = z.object({
  token: z.string().uuid(),
  morning_email_enabled: z.boolean().optional(),
  sendTest: z.boolean().optional(),
});

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  try {
    const body = BodySchema.parse(await request.json());
    const sub = await getSubscriberByToken(body.token);
    if (!sub || sub.status !== "active") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    if (body.morning_email_enabled !== undefined) {
      const supabase = createServiceClient();
      const { data, error } = await supabase
        .from("subscribers")
        .update({ morning_email_enabled: body.morning_email_enabled })
        .eq("id", sub.id)
        .select()
        .single();
      if (error) throw error;
      return NextResponse.json({
        morning_email_enabled: data.morning_email_enabled,
      });
    }

    if (body.sendTest) {
      if (!isResendConfigured()) {
        return NextResponse.json(
          {
            error:
              "Email not configured on server. Add RESEND_API_KEY to send test emails.",
          },
          { status: 503 }
        );
      }

      const today = slugToday();
      let edition = await getPersonalEditionByToken(body.token, today);
      if (!edition) {
        await generatePersonalEditionForSubscriber(sub, new Date(), {
          sendEmail: false,
        });
        edition = await getPersonalEditionByToken(body.token, today);
      }
      if (!edition) {
        return NextResponse.json(
          { error: "Could not generate today's edition" },
          { status: 500 }
        );
      }

      await sendPersonalEditionEmail({
        to: sub.email,
        edition,
        unsubscribeToken: sub.unsubscribe_token,
      });

      return NextResponse.json({ sent: true });
    }

    return NextResponse.json({ error: "Nothing to do" }, { status: 400 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
