# Desk Edition — Pilot checklist

Use this for your first week with 5–10 friends and family.

## Before inviting anyone

- [ ] Supabase migration applied
- [ ] Resend domain verified (or sandbox tested with your own email)
- [ ] One successful `POST /api/admin/generate`
- [ ] You received the email and opened the web edition on your phone
- [ ] Unsubscribe link tested

## Invite message (copy/paste)

> I'm testing a small morning briefing called **Desk Edition**—world/business news plus talking points for office chat. Want in? Drop your email here: [YOUR_URL]. You'll get a confirm email first. Unsubscribe anytime.

## Feedback to ask

1. Did you read the email or only the web edition?
2. Which talking point would you use today?
3. Too long / too short?
4. Any section missing? (markets, policy, culture)

## Tuning after 3 days

- **Thin business section?** Add feeds in `config/sources.ts` (CNBC, MarketWatch, NPR Economy).
- **Too US-centric?** Add Guardian World, BBC World (already included).
- **Talking points too generic?** Tighten the prompt in `lib/synthesize-edition.ts` with examples from feedback.

## Scale up

After 7 days with no complaints about quality, invite the wider group. Cap at ~50 subscribers on Resend free tier (100 emails/day).
