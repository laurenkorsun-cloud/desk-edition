import { ProfileForm } from "@/components/ProfileForm";

type Props = { searchParams: Promise<{ token?: string }> };

export default async function OnboardingPage({ searchParams }: Props) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16">
        <p className="font-sans text-[var(--muted)]">
          Missing link. Confirm your email first, or open the link from your
          welcome email.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="font-display text-4xl text-[var(--ink)]">
        Build your morning
      </h1>
      <p className="mt-2 font-sans text-[var(--muted)]">
        Pick your industry lens, toggle every module, and set your timezone.
        Delivered at <strong>9:30 AM</strong> your local time.
      </p>
      <div className="mt-10">
        <ProfileForm token={token} mode="onboarding" />
      </div>
    </div>
  );
}
