export const TALKING_POINTS_PROMPT = `
TALKING POINTS (required when talking_points module is enabled):
Generate these AFTER all stories and modules are written. Every point must tie to TODAY's edition only.

Rules:
- Each talking point must reference something specific from this edition: a headline, company, country, number, policy, or module pick.
- Format: "On [specific topic from today's story]: [one concrete question to ask at work]"
- NEVER use generic filler (e.g. "markets are volatile", "did you see the news?", "interesting times").
- Include at least one number or named entity from the referenced story when available.

talkingPointsByCategory — 2 points per enabled category:
- news: each point must name a World or Policy story headline from this edition and reference a fact from its synopsis
- markets: each point must cite a specific move (index, rate, company, %) and be a question or observation an educated intern could raise—not a script to memorize
- industry: reference industry_lens module text OR an industry-relevant story from today — wording must match the reader's primary lens (not generic "at work")
- weather: reference today's weather data or weather module
- calendar: reference their calendar notes or today's schedule module
- music / books / movies / clothing_sales / hobbies / vacation / historical: reference that module's item headline from today
- If a category has no content today, omit it (empty array)

talkingPoints (global): 3–5 best points drawn from the category points above—still specific, not generic.`;
