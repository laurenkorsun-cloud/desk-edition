import type { Story } from "@/lib/types";

function article(
  partial: Story & { synopsis: string; description: string }
): Story {
  return partial;
}

export function sampleIndustryStories(lensName: string): Story[] {
  return [
    article({
      headline: `Regulatory scrutiny is tightening for ${lensName} clients`,
      summary:
        `Supervisors and trade press flagged new review cycles affecting how ${lensName.toLowerCase()} teams document decisions. At least two agencies opened comment periods with deadlines inside 90 days.`,
      synopsis:
        `Over the last week, regulators signaled closer looks at vendor relationships, disclosure language, and third-party risk—themes that land on ${lensName} checklists before they hit general news.\n\nComment periods and draft guidance are moving faster than full rulemaking, which means compliance and client teams often rewrite playbooks on draft language, not final text.\n\nPeers in adjacent fields are already circulating FAQ drafts; the gap between "headline" and "client obligation" is where interns get caught flat-footed in meetings.`,
      description:
        `The pattern matters more than any single rule: when scrutiny tightens, client questions arrive before official effective dates. Teams that can name the agency, the deadline, and one affected workflow sound prepared without overclaiming expertise.`,
      whyItMatters:
        `New review cycles change what clients must prove and document—${lensName} teams feel that in audit trails, vendor lists, and meeting prep before the general public reads the headline.`,
      talkingPoint: {
        line: `Two agencies opened comment periods with ~90-day deadlines—${lensName} clients may already be asking what to update.`,
        question: `Are engagement teams circulating draft client FAQs yet, or waiting for final rule text?`,
      },
      sourceUrl: "https://www.reuters.com/",
      sourceName: "Reuters",
    }),
    article({
      headline: `Sector budgets are shifting toward efficiency over expansion`,
      summary:
        `Earnings commentary and analyst notes show more ${lensName.toLowerCase()} organizations prioritizing cost discipline, with IT and headcount lines under heavier review than last quarter.`,
      synopsis:
        `Several large players referenced "efficiency" and "prioritization" in guidance—not necessarily layoffs, but slower hiring and tougher ROI hurdles for new projects.\n\nFor ${lensName} work, that shows up as delayed approvals, smaller phase-one pilots, and more finance involvement earlier in the sales or project cycle.\n\nThe tone is defensive but not panicked: boards want optionality without freezing spend entirely.`,
      description:
        `When budgets tighten, the conversation shifts from growth narratives to payback periods and risk. That's often when junior staff get pulled into data pulls and client sensitivity analyses for the first time.`,
      whyItMatters:
        `Efficiency language in earnings usually precedes tougher internal approvals—${lensName} teams should expect more scrutiny on timelines, vendors, and headcount asks this month.`,
      talkingPoint: {
        line: `Multiple companies cited efficiency and ROI hurdles in guidance—signals tighter spend even without headline layoffs.`,
        question: `Are we seeing clients delay new projects, or just shrink phase-one scope?`,
      },
      sourceUrl: "https://www.wsj.com/",
      sourceName: "Wall Street Journal",
    }),
    article({
      headline: `Talent and hiring signals are mixed in ${lensName}`,
      summary:
        `Job postings in core ${lensName.toLowerCase()} roles are flat to down single digits year-over-year, while specialist skills (data, AI, compliance) still show premium demand.`,
      synopsis:
        `Recruiting platforms and industry surveys paint a split market: generalist entry roles are more competitive, but niche technical and regulatory skill sets remain scarce.\n\nHybrid and return-to-office policies still vary widely—culture headlines continue to affect which firms win senior candidates.\n\nFor new grads, the useful signal is which skills managers call "must-have" in intake meetings versus nice-to-have.`,
      description:
        `Hiring mix shifts how teams allocate work to interns and first-year staff. When specialists are scarce, generalists who can learn fast and document well get pulled into client-facing work sooner.`,
      whyItMatters:
        `Mixed hiring data changes how ${lensName} managers staff projects—knowing which skills are scarce helps you volunteer for work that actually unblocks the team.`,
      talkingPoint: {
        line: `Specialist roles (data, AI, compliance) still show premium demand even as generalist postings soften.`,
        question: `Is your team hiring for breadth or doubling down on one scarce skill this quarter?`,
      },
      sourceUrl: "https://www.linkedin.com/",
      sourceName: "LinkedIn",
    }),
  ];
}
