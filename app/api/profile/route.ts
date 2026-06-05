import { NextResponse } from "next/server";
import { z } from "zod";
import { getSubscriberByToken, saveProfile, getSubscriberToggles } from "@/lib/profile";
import { getActiveLenses, getActiveModules } from "@/lib/config-db";
import { generatePersonalEditionForSubscriber } from "@/lib/generate-personal-edition";
import { getPersonalEditionByToken } from "@/lib/personal-editions";
import { slugToday } from "@/lib/subscriber-urls";
import { formatErrorMessage } from "@/lib/utils";

const SaveSchema = z.object({
  token: z.string().uuid(),
  primary_lens_slug: z.string(),
  secondary_lens_slug: z.string().nullable().optional(),
  timezone: z.string(),
  delivery_time: z.string().optional(),
  city: z.string().nullable().optional(),
  manual_calendar_notes: z.string().nullable().optional(),
  spotify_playlist_url: z.string().nullable().optional(),
  toggles: z.record(z.string(), z.boolean()),
  onboarding_completed: z.boolean().optional(),
  hobbies: z.array(z.string()).optional(),
  morning_goals: z.array(z.string()).optional(),
  content_tone: z.string().optional(),
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

  const toggles = await getSubscriberToggles(sub.id);
  const lenses = await getActiveLenses();
  const modules = await getActiveModules();

  return NextResponse.json({ subscriber: sub, toggles, lenses, modules });
}

export async function POST(request: Request) {
  try {
    const body = SaveSchema.parse(await request.json());
    const sub = await saveProfile(body);

    let editionReady = false;
    if (body.onboarding_completed !== false && sub.status === "active") {
      const today = slugToday();
      const existing = await getPersonalEditionByToken(body.token, today);
      if (!existing) {
        try {
          await generatePersonalEditionForSubscriber(sub, new Date(), {
            sendEmail: false,
          });
          editionReady = true;
        } catch (genErr) {
          console.warn("First edition generation failed:", genErr);
        }
      } else {
        editionReady = true;
      }
    }

    return NextResponse.json({ subscriber: sub, editionReady });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error("Profile save failed:", err);
    const message = formatErrorMessage(err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
