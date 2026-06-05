import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { EditionView } from "@/components/EditionView";
import { getEditionBySlug } from "@/lib/editions";
import { isSupabaseConfigured } from "@/lib/supabase";
import { getSampleEditionContent } from "@/lib/sample-edition";
import type { EditionContent } from "@/lib/types";
import { format, parseISO, isValid } from "date-fns";

type Props = { params: Promise<{ date: string }> };

export const dynamic = "force-dynamic";

const SAMPLE_SLUG = "sample";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { date } = await params;
  if (date === SAMPLE_SLUG) {
    return {
      title: "Sample Edition",
      description: getSampleEditionContent().lede,
    };
  }
  const edition = isSupabaseConfigured()
    ? await getEditionBySlug(date).catch(() => null)
    : null;
  if (!edition) return { title: "Edition" };
  return {
    title: edition.title,
    description: edition.lede,
    openGraph: {
      title: `Desk Edition — ${edition.title}`,
      description: edition.lede,
    },
  };
}

export default async function EditionPage({ params }: Props) {
  const { date } = await params;

  if (date === SAMPLE_SLUG) {
    const content = getSampleEditionContent();
    return (
      <div className="mx-auto max-w-5xl px-6 py-12">
        <EditionView
          title="Sample Edition"
          lede={content.lede}
          content={content}
          editionNumber={0}
          slug={SAMPLE_SLUG}
        />
      </div>
    );
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) notFound();

  const parsed = parseISO(date);
  if (!isValid(parsed)) notFound();

  if (!isSupabaseConfigured()) {
    notFound();
  }

  const edition = await getEditionBySlug(date);
  if (!edition || edition.status !== "published") notFound();

  const content = edition.content_json as EditionContent;

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <EditionView
        title={edition.title}
        lede={edition.lede}
        content={content}
        editionNumber={edition.edition_number}
        slug={edition.slug}
      />
      <p className="mt-12 font-sans text-xs text-[var(--muted)]">
        Published {edition.published_at ? format(new Date(edition.published_at), "PPp") : ""}
      </p>
    </div>
  );
}
