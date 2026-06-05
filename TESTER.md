# Desk Edition — Full tester experience

Share **one public URL** so friends can build their own briefing (not your personal link).

## What you need first

1. **Deploy** (recommended) or use a tunnel (see below).
2. **Supabase** migrations `001`, `002`, and `003` applied.
3. **Seed config** once (founder):
   ```bash
   curl -X POST "https://YOUR-APP-URL/api/admin/seed-config" \
     -H "x-admin-secret: YOUR_ADMIN_SECRET"
   ```
4. **Env on Vercel** (or `.env.local` for tunnel):
   - `NEXT_PUBLIC_APP_URL` = your public URL (exact, no trailing slash)
   - `SUPABASE_*`, `OPENAI_API_KEY`, `ADMIN_SECRET`
   - `RESEND_*` optional — without Resend, testers skip email confirm (faster for pilots)
   - `USE_SAMPLE_EDITION=false` for real AI content
   - `TAVILY_API_KEY` optional but recommended for modules (books, sales, etc.)

## Link to send testers

```
https://YOUR-APP-URL/
```

Example after Vercel deploy:

```
https://desk-edition.vercel.app/
```

**Do not** share `/me/your-token/...` — that is your private briefing.

## What testers do (full flow)

1. Open your home URL.
2. Customize lens, modules, city, hobbies, tone on the builder.
3. Tap **Preview edition** (optional).
4. Enter email at the bottom → **Save & subscribe**.
5. If you use Resend: click **Confirm** in email, then return.
6. They land on **Today** with their first AI briefing (auto-generated).
7. Explore **News · Markets · Industry** and **module tiles** on Today.

## Invite message (copy/paste)

> I'm testing **Desk Edition** — a personalized morning briefing (news, markets, talking points, weather, etc.).  
> Try it here: **https://YOUR-APP-URL/**  
> Customize it on the page, add your email at the bottom, and you'll get your own briefing. Takes ~2 minutes. Feedback welcome!

## Local dev + share temporarily (no deploy)

```bash
npm run dev
# In another terminal:
npx ngrok http 4000
```

Set in `.env.local`:

```
NEXT_PUBLIC_APP_URL=https://YOUR-NGROK-URL.ngrok-free.app
```

Restart `npm run dev`, then send the **ngrok https URL** (not 127.0.0.1).

## Troubleshooting for testers

| Issue | Fix |
|-------|-----|
| Empty briefing | Click **Regenerate today's briefing** on News |
| Short news only | Regenerate after deploy; need `OPENAI_API_KEY` |
| Confirm email never arrives | Add Resend keys or leave Resend unset for instant signup |
| 503 on subscribe | Supabase env vars missing on server |

## Your checklist before sending

- [ ] `NEXT_PUBLIC_APP_URL` matches the link you share
- [ ] You completed subscribe once yourself on that URL
- [ ] First edition generates in under ~60s after email signup
- [ ] News shows 6+ articles after regenerate (with OpenAI + optional Tavily)
