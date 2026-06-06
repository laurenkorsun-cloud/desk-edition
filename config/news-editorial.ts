/** Target story count on the News tab */
export const NEWS_MIN_ARTICLES = 4;
export const NEWS_TARGET_ARTICLES = 5;

/** Visible lede (tier 1) — NYT-morning style */
export const NEWS_LEDE_MAX_WORDS = 90;

/** Expandable depth (tier 2) */
export const NEWS_DEPTH_MIN_WORDS = 80;

/** Legacy editions used long single-block synopses */
export const NEWS_SYNOPSIS_MIN_WORDS = 280;

export const NEWS_STORY_PROMPT = `
NEWS TAB (required when "news" module is enabled):
- The "World" section MUST contain ${NEWS_TARGET_ARTICLES} distinct top stories (minimum ${NEWS_MIN_ARTICLES}), each from a different headline/theme.
- Do NOT put markets-only stories in World—those belong in "Business & markets".
- "Policy & work" may add 0–1 more policy stories; prioritize quality over quantity.

Per news story — TIERED format (reader sees lede first, expands for depth):

- summary: THE VISIBLE LEDE. 2–4 sentences (~50–${NEWS_LEDE_MAX_WORDS} words), NYT-morning style. Must include 2–3 specific numbers (%, $, dates, vote counts, index moves). Sharp, enticing—reader should want to expand.
- synopsis: EXPANDABLE DEPTH (~${NEWS_DEPTH_MIN_WORDS}–180 words). Additional paragraphs: context, what happened next, who said what. Use \\n\\n between paragraphs. Do NOT repeat the summary verbatim.
- description: OPTIONAL shorter analysis (1–2 paragraphs) — cause/effect, workplace winners/losers. New detail only.
- whyItMatters: 1–2 sentences — MUST be specific to this reader's primary lens (Medical vs Technology vs Audit vs Nonprofit must read differently for the same headline). Shown outside the expand fold.
- sourceUrl + sourceName: use the exact URL from HEADLINES (article link, not homepage)
- imageUrl: copy from HEADLINES Image field when present for the matched story

Never invent statistics. If a number is unavailable, say what is known qualitatively instead of guessing.`;
