import { ProfileForm } from "@/components/ProfileForm";
import { PageBackLink } from "@/components/briefing/BriefingBackLink";
import { briefingPathForToken } from "@/lib/subscriber-urls";

type Props = { searchParams: Promise<{ token?: string }> };

export default async function SettingsPage({ searchParams }: Props) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16">
        <p className="font-sans text-[var(--muted)]">
          Open settings from your Desk Edition email (Settings link), or after
          onboarding.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <PageBackLink
        href={briefingPathForToken(token)}
        label="← Back to briefing"
      />
      <h1 className="mt-4 font-display text-4xl text-[var(--ink)]">Settings</h1>
      <p className="mt-2 font-sans text-[var(--muted)]">
        Change lenses, modules, city, calendar notes, or playlist anytime.
      </p>
      <div className="mt-10">
        <ProfileForm token={token} mode="settings" />
      </div>
    </div>
  );
}
