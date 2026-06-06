import { OnboardingClient } from "@/components/onboarding/OnboardingClient";
import { PageBackLink } from "@/components/briefing/BriefingBackLink";
import Link from "next/link";

type Props = { searchParams: Promise<{ token?: string }> };

export default async function OnboardingPage({ searchParams }: Props) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <div className="mx-auto max-w-lg px-6 py-16">
        <p className="font-sans text-[var(--muted)]">
          Missing link.{" "}
          <Link href="/" className="underline hover:text-[var(--ink)]">
            Sign up
          </Link>{" "}
          to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--paper)]">
      <header className="border-b border-[var(--border)]">
        <div className="mx-auto max-w-3xl px-6 py-6">
          <PageBackLink href="/" label="← Back" />
          <h1 className="mt-4 font-display text-3xl text-[var(--ink)] md:text-4xl">
            Build your briefing
          </h1>
          <p className="mt-3 font-sans text-[var(--muted)]">
            A few quick choices—we&apos;ll have your first edition ready when
            you&apos;re done.
          </p>
        </div>
      </header>
      <div className="mx-auto max-w-3xl px-6 py-12">
        <OnboardingClient token={token} />
      </div>
    </div>
  );
}
