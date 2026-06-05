import { format } from "date-fns";
import { createServiceClient } from "@/lib/supabase";
import type { EditionContent, EditionRow } from "@/lib/types";

export function slugFromDate(date: Date): string {
  return format(date, "yyyy-MM-dd");
}

export function titleFromDate(date: Date): string {
  return format(date, "EEEE, MMMM d");
}

export async function getEditionBySlug(
  slug: string
): Promise<EditionRow | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("editions")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;
  return data as EditionRow;
}

export async function getPublishedEditions(limit = 30): Promise<EditionRow[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("editions")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return (data ?? []) as EditionRow[];
}

export async function getNextEditionNumber(): Promise<number> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("editions")
    .select("edition_number")
    .order("edition_number", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return (data?.edition_number ?? 0) + 1;
}

export async function upsertEdition(params: {
  slug: string;
  title: string;
  lede: string;
  content: EditionContent;
  status: "draft" | "published";
  editionNumber: number;
  publishedAt?: string;
}): Promise<EditionRow> {
  const supabase = createServiceClient();
  const row = {
    slug: params.slug,
    title: params.title,
    lede: params.lede,
    content_json: params.content,
    status: params.status,
    edition_number: params.editionNumber,
    published_at: params.publishedAt ?? null,
  };

  const { data, error } = await supabase
    .from("editions")
    .upsert(row, { onConflict: "slug" })
    .select()
    .single();

  if (error) throw error;
  return data as EditionRow;
}
