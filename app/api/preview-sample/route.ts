import { NextResponse } from "next/server";
import { z } from "zod";
import { generatePreviewSample } from "@/lib/preview-sample";

const PrefsSchema = z.object({
  primaryLens: z.string(),
  secondaryLens: z.string().nullable().optional().default(null),
  hobbies: z.array(z.string()),
  customHobby: z.string(),
  goals: z.array(z.string()),
  timezone: z.string(),
  wakeTime: z.string(),
  city: z.string(),
  contentTone: z.number(),
  modules: z.record(z.string(), z.boolean()),
});

export async function POST(request: Request) {
  try {
    const prefs = PrefsSchema.parse(await request.json());
    const sample = await generatePreviewSample(prefs);
    return NextResponse.json(sample);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Preview failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
