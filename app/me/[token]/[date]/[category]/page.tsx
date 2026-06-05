import { notFound } from "next/navigation";
import { getPersonalEditionByToken } from "@/lib/personal-editions";
import { getSubscriberByToken } from "@/lib/profile";
import { getLens } from "@/lib/config-db";
import { BriefingCategoryView } from "@/components/briefing/BriefingCategoryView";
import { ALL_CATEGORIES, type BriefingCategory } from "@/config/briefing-nav";
import type { PersonalEditionContent } from "@/lib/config-types";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ token: string; date: string; category: string }>;
};

export default async function PersonalCategoryPage({ params }: Props) {
  const { token, date, category } = await params;

  if (!ALL_CATEGORIES.includes(category as BriefingCategory)) notFound();

  const [edition, subscriber] = await Promise.all([
    getPersonalEditionByToken(token, date),
    getSubscriberByToken(token),
  ]);

  if (!edition || !subscriber) notFound();

  const content = edition.content_json as PersonalEditionContent;
  const lens = subscriber.primary_lens_slug
    ? await getLens(subscriber.primary_lens_slug)
    : null;

  return (
    <BriefingCategoryView
      category={category as BriefingCategory}
      content={content}
      token={token}
      subscriber={subscriber}
      lensLabel={lens?.name ?? "your field"}
    />
  );
}
