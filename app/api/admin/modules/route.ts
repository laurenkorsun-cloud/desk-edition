import { NextResponse } from "next/server";
import { verifyAdminSecret } from "@/lib/utils";
import { updateModule } from "@/lib/config-db";
import { z } from "zod";

const PatchSchema = z.object({
  slug: z.string(),
  name: z.string().optional(),
  description: z.string().optional(),
  admin_body: z.string().optional(),
  default_on: z.boolean().optional(),
  is_active: z.boolean().optional(),
  sort_order: z.number().optional(),
});

export async function POST(request: Request) {
  if (!verifyAdminSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = PatchSchema.parse(await request.json());
    const { slug, ...patch } = body;
    const mod = await updateModule(slug, patch);
    return NextResponse.json({ module: mod });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
