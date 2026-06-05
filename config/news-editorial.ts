/** Shared requirements for the News tab (6+ in-depth articles). */
export const NEWS_MIN_ARTICLES = 6;

/** Target length so readers rarely need the source link */
export const NEWS_SYNOPSIS_MIN_WORDS = 280;

export const NEWS_STORY_PROMPT = `
NEWS TAB (required when "news" module is enabled):
- The "World" section MUST contain at least ${NEWS_MIN_ARTICLES} distinct stories (aim for 6–8), each from a different headline/theme.
- Do NOT put markets-only stories in World—those belong in "Business & markets".
- "Policy & work" may add 1–2 more policy stories; World must still have ${NEWS_MIN_ARTICLES}+ on its own.

Per news story — the SYNOPSIS is the main product. The reader should NOT need to click sourceUrl to understand the story.

- summary: 1–2 sentences (internal hook only; UI leads with synopsis)
- synopsis: MINIMUM ${NEWS_SYNOPSIS_MIN_WORDS} words (typically 12–20 sentences). Structure it as a complete mini-article:
  1) Lede — what happened in one sharp sentence
  2) Facts — who, what, where, when; quote or paraphrase key actors if known from snippets
  3) Numbers — at least 5–8 specific figures (%, $ amounts, vote counts, index moves, job data, dates, company names, volumes, timelines)
  4) Context — how this connects to prior weeks and adjacent stories
  5) What's next — scheduled votes, earnings, deadlines, talks, or data releases
  Write in clear paragraphs (use \\n\\n between paragraph breaks in JSON string). No bullet lists. No "read more" teasing.
- description: 2–4 additional paragraphs going deeper on analysis (cause/effect, winners/losers, regional/industry impact). Must add NEW detail beyond synopsis, not repeat it.
- whyItMatters: 2–4 sentences — workplace angle for this reader's lens
- sourceUrl + sourceName: from HEADLINES when possible; link is optional verification, not required reading

Never invent statistics. If a number is unavailable, say what is known qualitatively instead of guessing.`;
