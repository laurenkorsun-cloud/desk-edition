/** Target story count on the Markets tab */
export const MARKETS_MIN_STORIES = 2;
export const MARKETS_TARGET_STORIES = 3;

/** Visible lede when collapsed */
export const MARKETS_LEDE_MAX_WORDS = 70;

/** Expandable depth */
export const MARKETS_DEPTH_MIN_WORDS = 80;

export const MARKETS_WHY_IT_MATTERS_RULES = `
whyItMatters (shown collapsed — MUST be a real comment, not a script):
- Explain the concrete stakes: who is affected, what decision or plan changes, and why today's move matters beyond the headline.
- Tie to the reader's primary lens when possible (clients, patients, products, grants, audits—not generic "at work").
- 2 sentences max. Do NOT write a question to recite, a "hallway line," or repeat the summary verbatim.
- Bad: "A safe hallway line is…" / "If markets come up, say…"
- Good: "Rate-cut timing shifts how boards approve capex—teams modeling 2025 deals may need fresher assumptions before Thursday's CPI."`;

export const MARKETS_TALKING_POINT_RULES = `
talkingPoint (per Business & markets story — for the green sidebar box):
- "line": One crisp observation with a specific number or fact from THIS story that an educated intern could state confidently (not a recap of whyItMatters).
- "question": One sharp question to ask a manager or in a meeting—shows you read the move and understand what teams in the reader's primary lens would care about. Must be a real question, not "can you tie this back to your lens."
- NEVER generic: "did you see the markets?", "interesting times", "worth a mention."`;

export const MARKETS_STORY_PROMPT = `
MARKETS TAB (required when "markets" module is enabled):
- The "Business & markets" section MUST contain ${MARKETS_TARGET_STORIES} distinct stories (minimum ${MARKETS_MIN_STORIES}), each covering a different move or theme.
- Do NOT duplicate World news—markets stories must lead with what moved (indices, rates, sectors, names) and by roughly how much.

Per markets story — TIERED format:

- summary: THE VISIBLE LEDE. 2–3 sentences (~40–${MARKETS_LEDE_MAX_WORDS} words). MUST include at least 2 specific numbers (%, index points, bps, $B deal size, stock move). Lead with the move, then the driver.
- synopsis: EXPANDABLE DEPTH (~${MARKETS_DEPTH_MIN_WORDS}–160 words). Context, sector detail, what happened next. Use \\n\\n between paragraphs.
- description: OPTIONAL analysis (1–2 paragraphs) — cause/effect, who wins/loses, what traders watch next.
${MARKETS_WHY_IT_MATTERS_RULES}
${MARKETS_TALKING_POINT_RULES}
- sourceUrl + sourceName: from HEADLINES when possible.

Each Business & markets story must include:
"talkingPoint": { "line": "...", "question": "..." }

Also return top-level "marketsMeta":
{
  "intro": "2–3 sentences in PLAIN ENGLISH for a beginner — what happened overnight in relatable terms (stocks up/down, tech leading?, rates moved?). End with: what on today's calendar could change things. No jargon like 'bps' or 'futures' without explaining.",
  "pulse": "Optional trader shorthand version (for internal use).",
  "watchItems": ["2–4 items: each a short headline PLUS plain hint in parentheses, e.g. 'Fed officials speaking today (rate comments can move markets fast)'"]
}

Never invent statistics. If a number is unavailable, say what moved qualitatively. No buy/sell advice.`;
