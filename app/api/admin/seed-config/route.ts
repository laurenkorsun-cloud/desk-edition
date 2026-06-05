import { NextResponse } from "next/server";
import { verifyAdminSecret } from "@/lib/utils";
import { seedLensesAndModules } from "@/lib/config-db";

export async function POST(request: Request) {
  if (!verifyAdminSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await seedLensesAndModules();
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
