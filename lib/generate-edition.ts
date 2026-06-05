import { fetchHeadlines } from "@/lib/rss";
import { synthesizeEdition } from "@/lib/synthesize-edition";
import {
  getEditionBySlug,
  getNextEditionNumber,
  slugFromDate,
  titleFromDate,
  upsertEdition,
} from "@/lib/editions";
import { createServiceClient } from "@/lib/supabase";
import { getActiveSubscribers } from "@/lib/subscribers";
import { sendEditionEmail, sendAlertEmail, isResendConfigured } from "@/lib/email";
import type { EditionRow } from "@/lib/types";

export type GenerateResult = {
  edition: EditionRow;
  emailsSent: number;
  skipped: boolean;
  message: string;
};

export async function generateAndPublishEdition(
  date: Date = new Date(),
  options: { sendEmails?: boolean; force?: boolean } = {}
): Promise<GenerateResult> {
  const slug = slugFromDate(date);
  const sendEmails = options.sendEmails ?? true;

  if (!options.force) {
    const existing = await getEditionBySlug(slug);
    if (existing?.status === "published") {
      return {
        edition: existing,
        emailsSent: 0,
        skipped: true,
        message: "Edition already published for today",
      };
    }
  }

  const headlines = await fetchHeadlines();
  const content = await synthesizeEdition(headlines, date);
  const editionNumber = await getNextEditionNumber();
  const publishedAt = new Date().toISOString();

  const edition = await upsertEdition({
    slug,
    title: titleFromDate(date),
    lede: content.lede,
    content,
    status: "published",
    editionNumber,
    publishedAt,
  });

  let emailsSent = 0;

  if (sendEmails && isResendConfigured()) {
    const subscribers = await getActiveSubscribers();
    const supabase = createServiceClient();

    for (const sub of subscribers) {
      try {
        const result = await sendEditionEmail({
          to: sub.email,
          edition,
          unsubscribeToken: sub.unsubscribe_token,
        });

        await supabase.from("delivery_log").upsert(
          {
            edition_id: edition.id,
            email: sub.email,
            provider_id: result?.id ?? null,
          },
          { onConflict: "edition_id,email" }
        );
        emailsSent++;
      } catch (err) {
        console.error(`Failed to email ${sub.email}:`, err);
      }
    }
  }

  return {
    edition,
    emailsSent,
    skipped: false,
    message: `Published edition ${slug}, sent ${emailsSent} emails`,
  };
}

export async function runCronJob(): Promise<GenerateResult> {
  try {
    return await generateAndPublishEdition(new Date(), { sendEmails: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    await sendAlertEmail(`Cron failed: ${msg}`);
    throw err;
  }
}
