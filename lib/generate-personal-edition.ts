import { fetchHeadlines } from "@/lib/rss";
import { getLens } from "@/lib/config-db";
import { getEnabledModulesForSubscriber } from "@/lib/profile";
import type { SubscriberProfile } from "@/lib/profile";
import { getActiveModules } from "@/lib/config-db";
import { synthesizePersonalEdition } from "@/lib/synthesize-personal-edition";
import { fetchWeather } from "@/lib/weather";
import { upsertPersonalEdition } from "@/lib/personal-editions";
import { sendPersonalEditionEmail, isResendConfigured } from "@/lib/email";
import { createServiceClient } from "@/lib/supabase";
import { slugFromDate, titleFromDate } from "@/lib/editions";
import { markSubscriberSent } from "@/lib/profile";
import type { PersonalEditionContent } from "@/lib/config-types";

export async function generatePersonalEditionForSubscriber(
  subscriber: SubscriberProfile,
  date: Date = new Date(),
  options: { sendEmail?: boolean } = {}
): Promise<{ slug: string; sent: boolean }> {
  const slug = slugFromDate(date);
  const enabled = await getEnabledModulesForSubscriber(subscriber.id);
  const modules = await getActiveModules();

  const primary = subscriber.primary_lens_slug
    ? await getLens(subscriber.primary_lens_slug)
    : null;
  const secondary = subscriber.secondary_lens_slug
    ? await getLens(subscriber.secondary_lens_slug)
    : null;

  const extraFeeds = [
    ...(primary?.rss_feeds ?? []),
    ...(secondary?.rss_feeds ?? []),
  ].filter((f) => f.url);

  const headlines = await fetchHeadlines(extraFeeds);

  const weatherFacts = enabled.includes("weather")
    ? await fetchWeather(subscriber.city ?? "")
    : null;

  let content = await synthesizePersonalEdition({
    subscriber,
    editionDate: date,
    headlines,
    enabledSlugs: enabled,
    modules,
    lensNames: {
      primary: primary?.name ?? "General",
      secondary: secondary?.name ?? null,
    },
    primaryLensAddon: primary?.prompt_addon,
    secondaryLensAddon: secondary?.prompt_addon,
    weatherFacts,
  });

  if (!enabled.includes("talking_points")) {
    content = { ...content, talkingPoints: [], talkingPointsByCategory: {} };
  } else {
    const { anchorTalkingPoints } = await import("@/lib/anchor-talking-points");
    content = anchorTalkingPoints(content, {
      lensLabel: primary?.name ?? "your team",
      enabledSlugs: enabled,
    });
  }
  if (!enabled.includes("news")) {
    content = {
      ...content,
      sections: content.sections.filter(
        (s) => !s.name.toLowerCase().includes("world")
      ),
    };
  }
  if (!enabled.includes("markets")) {
    content = {
      ...content,
      sections: content.sections.filter(
        (s) => !s.name.toLowerCase().includes("business")
      ),
    };
  }

  content = {
    ...content,
    meta: {
      primaryLens: primary?.slug ?? "none",
      secondaryLens: secondary?.slug ?? null,
      enabledModules: enabled,
    },
  };

  const edition = await upsertPersonalEdition({
    subscriberId: subscriber.id,
    slug,
    title: titleFromDate(date),
    lede: content.lede,
    content,
  });

  let sent = false;
  if (options.sendEmail && isResendConfigured()) {
    await sendPersonalEditionEmail({
      to: subscriber.email,
      edition,
      unsubscribeToken: subscriber.unsubscribe_token,
    });
    const supabase = createServiceClient();
    await supabase.from("delivery_log").insert({
      edition_id: null,
      personal_edition_id: edition.id,
      subscriber_id: subscriber.id,
      email: subscriber.email,
    });
    sent = true;
  }

  await markSubscriberSent(subscriber.id, slug);
  return { slug, sent };
}

export async function sendAllDuePersonalEditions(): Promise<{
  processed: number;
  sent: number;
  errors: string[];
}> {
  const { getSubscribersDueForDelivery } = await import("@/lib/profile");
  const due = await getSubscribersDueForDelivery("09:30");
  const errors: string[] = [];
  let sent = 0;

  for (const sub of due) {
    try {
      const result = await generatePersonalEditionForSubscriber(sub, new Date(), {
        sendEmail: true,
      });
      if (result.sent) sent++;
    } catch (err) {
      errors.push(
        `${sub.email}: ${err instanceof Error ? err.message : String(err)}`
      );
    }
  }

  return { processed: due.length, sent, errors };
}
