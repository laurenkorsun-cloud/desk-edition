import { notFound } from "next/navigation";
import { getSubscriberByToken } from "@/lib/profile";
import { getPersonalEditionByToken } from "@/lib/personal-editions";
import { getActiveModules } from "@/lib/config-db";
import { BriefingShell } from "@/components/briefing/BriefingShell";
import { PersonalEditionEmpty } from "@/components/PersonalEditionEmpty";
import {
  formatBriefingDate,
  formatDeliveryTime,
  getEditionNumberForDate,
} from "@/lib/briefing-edition-meta";

export const dynamic = "force-dynamic";

type Props = {
  children: React.ReactNode;
  params: Promise<{ token: string; date: string }>;
};

export default async function MeBriefingLayout({ children, params }: Props) {
  const { token, date } = await params;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) notFound();

  const subscriber = await getSubscriberByToken(token);
  if (!subscriber) notFound();

  const edition = await getPersonalEditionByToken(token, date);
  if (!edition) {
    return <PersonalEditionEmpty token={token} date={date} />;
  }

  const [editionNumber, modules] = await Promise.all([
    getEditionNumberForDate(subscriber.id, date),
    getActiveModules(),
  ]);

  const deliveryLabel = formatDeliveryTime(
    subscriber.delivery_time,
    subscriber.timezone
  );

  return (
    <BriefingShell
      token={token}
      date={date}
      dateLabel={formatBriefingDate(date)}
      editionNumber={editionNumber}
      deliveryLabel={deliveryLabel}
      subscriber={subscriber}
      edition={edition}
      modules={modules}
    >
      {children}
    </BriefingShell>
  );
}
