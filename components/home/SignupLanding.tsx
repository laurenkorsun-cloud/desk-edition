"use client";

import Link from "next/link";
import { ReturningUserCard } from "@/components/home/ReturningUserCard";
import { SubscribeForm } from "@/components/SubscribeForm";

export function SignupLanding() {
  return (
    <div className="bg-[var(--paper)]">
      <header className="border-b border-[var(--border)] bg-[var(--paper)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="group">
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--muted)]">
              Morning briefing
            </p>
            <span className="font-display text-2xl text-[var(--ink)] transition group-hover:text-[var(--accent)]">
              Desk Edition
            </span>
          </Link>
          <Link
            href="/edition/sample"
            className="font-sans text-sm text-[var(--muted)] hover:text-[var(--ink)]"
          >
            Sample briefing
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-2xl px-6 py-20 text-center md:py-28">
        <p className="font-sans text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--muted)]">
          For interns, analysts & new grads
        </p>
        <h1 className="mt-4 font-display text-4xl leading-[1.15] text-[var(--ink)] md:text-5xl">
          Your morning briefing for the office
        </h1>
        <p className="mx-auto mt-6 max-w-lg font-sans text-lg leading-relaxed text-[var(--ink-soft)]">
          News, markets, and talking points—personalized to your job and
          interests. Takes about two minutes to set up.
        </p>

        <div className="mx-auto mt-10 max-w-md text-left">
          <ReturningUserCard />
          <SubscribeForm />
        </div>

        <p className="mt-6 font-sans text-xs text-[var(--muted)]">
          Free on the web. Pick your hobbies—Music, Travel, Sports, Reading—and
          we&apos;ll match your daily modules to the same language.
        </p>
      </section>

      <section className="border-t border-[var(--border)] bg-white py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-center font-display text-2xl text-[var(--ink)]">
            How it works
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Sign up",
                body: "Enter your email—we'll save your account.",
              },
              {
                step: "2",
                title: "Customize",
                body: "Pick your industry, modules, city, and tone.",
              },
              {
                step: "3",
                title: "Read daily",
                body: "Your briefing lives on the web. Email is optional.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-sm border border-[var(--border)] bg-[var(--paper)] p-6 text-center"
              >
                <span className="font-display text-3xl text-[var(--gold-dark)]">
                  {item.step}
                </span>
                <h3 className="mt-4 font-sans text-lg font-semibold text-[var(--ink)]">
                  {item.title}
                </h3>
                <p className="mt-2 font-sans text-sm leading-relaxed text-[var(--muted)]">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-[var(--border)] bg-[var(--card)] py-8">
        <div className="mx-auto max-w-6xl px-6 text-center font-sans text-sm text-[var(--muted)]">
          <p>Desk Edition · Personal morning briefing</p>
          <p className="mt-2">
            <Link href="/unsubscribe" className="underline hover:text-[var(--ink)]">
              Unsubscribe
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
