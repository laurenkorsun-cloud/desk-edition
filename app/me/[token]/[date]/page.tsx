import { notFound } from "next/navigation";
import { getPersonalEditionByToken } from "@/lib/personal-editions";
import { getActiveModules } from "@/lib/config-db";
import { getSubscriberByToken } from "@/lib/profile";
import { BriefingHub } from "@/components/briefing/BriefingHub";
import type { PersonalEditionContent } from "@/lib/config-types";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ token: string; date: string }> };

export default async function PersonalEditionHubPage({ params }: Props) {
  const { token, date } = await params;
  const edition = await getPersonalEditionByToken(token, date);
  if (!edition) notFound();

  const content = edition.content_json as PersonalEditionContent;
  const [modules, subscriber] = await Promise.all([
    getActiveModules(),
    getSubscriberByToken(token),
  ]);
  const enabled = content.meta?.enabledModules ?? [];
  const hobbies = subscriber?.hobbies?.filter(Boolean) ?? [];

  return (
    <BriefingHub
      lede={edition.lede}
      content={content}
      token={token}
      date={date}
      allModules={modules}
      enabledSlugs={enabled}
      hobbySlugs={hobbies}
    />
  );
}
