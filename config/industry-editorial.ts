export const INDUSTRY_MIN_STORIES = 2;
export const INDUSTRY_TARGET_STORIES = 3;

export const INDUSTRY_STORY_PROMPT = `
INDUSTRY LENS module (required when "industry_lens" is enabled):
- industry_lens module must include ${INDUSTRY_TARGET_STORIES} items (minimum ${INDUSTRY_MIN_STORIES}), each a distinct angle on today's news for the reader's PRIMARY lens only.
- module synopsis: 2 sentences on what ${"lens"} teams are watching today.
- Per item — tiered like news:
  - synopsis: visible lede (~50–90 words) with specific names, numbers, or policy details
  - description: expandable depth (~80–160 words)
  - whyItMatters: 2 sentences — concrete stakes for someone in this lens (NOT a script or hallway line)
  - talkingPoint: { "line": observation with a fact, "question": educated intern question for ${"lens"} teams }
- A Medical reader and Technology reader MUST get different items and whyItMatters text.`;
