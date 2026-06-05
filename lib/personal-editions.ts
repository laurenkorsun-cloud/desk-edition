import { createServiceClient } from "@/lib/supabase";
import type { PersonalEditionContent } from "@/lib/config-types";

export type PersonalEditionRow = {
  id: string;
  subscriber_id: string;
  slug: string;
  title: string;
  lede: string;
  content_json: PersonalEditionContent;
  published_at: string;
};

export async function getPersonalEdition(
  subscriberId: string,
  slug: string
): Promise<PersonalEditionRow | null> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("personal_editions")
    .select("*")
    .eq("subscriber_id", subscriberId)
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data as PersonalEditionRow | null;
}

export async function getPersonalEditionByToken(
  token: string,
  slug: string
): Promise<PersonalEditionRow | null> {
  const supabase = createServiceClient();
  const { data: sub } = await supabase
    .from("subscribers")
    .select("id")
    .eq("unsubscribe_token", token)
    .maybeSingle();

  if (!sub) return null;
  return getPersonalEdition(sub.id, slug);
}

export async function upsertPersonalEdition(params: {
  subscriberId: string;
  slug: string;
  title: string;
  lede: string;
  content: PersonalEditionContent;
}): Promise<PersonalEditionRow> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("personal_editions")
    .upsert(
      {
        subscriber_id: params.subscriberId,
        slug: params.slug,
        title: params.title,
        lede: params.lede,
        content_json: params.content,
        published_at: new Date().toISOString(),
      },
      { onConflict: "subscriber_id,slug" }
    )
    .select()
    .single();

  if (error) throw error;
  return data as PersonalEditionRow;
}
