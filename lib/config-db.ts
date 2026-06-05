import { createServiceClient } from "@/lib/supabase";
import type { LensRow, ModuleRow } from "@/lib/config-types";
import { SEED_LENSES, SEED_MODULES } from "@/config/seed-lenses-modules";

export async function seedLensesAndModules(): Promise<{
  lenses: number;
  modules: number;
}> {
  const supabase = createServiceClient();

  for (const lens of SEED_LENSES) {
    await supabase.from("lenses").upsert({
      ...lens,
      is_active: lens.is_active ?? true,
      rss_feeds: lens.rss_feeds ?? [],
    });
  }

  for (const mod of SEED_MODULES) {
    await supabase.from("modules").upsert({
      ...mod,
      is_active: mod.is_active ?? true,
    });
  }

  return { lenses: SEED_LENSES.length, modules: SEED_MODULES.length };
}

export async function getActiveLenses(): Promise<LensRow[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("lenses")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  if (error) throw error;
  return (data ?? []) as LensRow[];
}

export async function getAllLenses(): Promise<LensRow[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("lenses")
    .select("*")
    .order("sort_order");

  if (error) throw error;
  return (data ?? []) as LensRow[];
}

export async function getLens(slug: string): Promise<LensRow | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("lenses")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data as LensRow | null;
}

export async function updateLens(
  slug: string,
  patch: Partial<
    Pick<LensRow, "name" | "rss_feeds" | "prompt_addon" | "is_active" | "sort_order">
  >
): Promise<LensRow> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("lenses")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("slug", slug)
    .select()
    .single();

  if (error) throw error;
  return data as LensRow;
}

export async function getActiveModules(): Promise<ModuleRow[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("modules")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  if (error) throw error;
  return (data ?? []) as ModuleRow[];
}

export async function getAllModules(): Promise<ModuleRow[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("modules")
    .select("*")
    .order("sort_order");

  if (error) throw error;
  return (data ?? []) as ModuleRow[];
}

export async function updateModule(
  slug: string,
  patch: Partial<
    Pick<
      ModuleRow,
      | "name"
      | "description"
      | "requires_integration"
      | "default_on"
      | "is_active"
      | "sort_order"
      | "admin_body"
    >
  >
): Promise<ModuleRow> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("modules")
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq("slug", slug)
    .select()
    .single();

  if (error) throw error;
  return data as ModuleRow;
}
