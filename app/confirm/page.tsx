import { redirect } from "next/navigation";
import { confirmSubscriber } from "@/lib/subscribers";
import { isSupabaseConfigured } from "@/lib/supabase";
import { relativeRedirectForSubscriber } from "@/lib/subscriber-urls";

type Props = { searchParams: Promise<{ token?: string }> };

export default async function ConfirmPage({ searchParams }: Props) {
  const { token } = await searchParams;

  if (!token || !isSupabaseConfigured()) {
    redirect("/?subscribe=error");
  }

  const subscriber = await confirmSubscriber(token);

  if (!subscriber) {
    redirect("/?subscribe=invalid");
  }

  redirect(relativeRedirectForSubscriber(subscriber));
}
