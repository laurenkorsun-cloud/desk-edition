# Desk Edition

A morning briefing for interns and new grads: world news, business context, and **talking points** for the office—published on the web and delivered by email.

## Stack

- **Next.js** — landing, edition pages, APIs
- **Supabase** — subscribers, editions, delivery log
- **Resend** — confirmation + daily emails
- **OpenAI** — synthesizes RSS headlines into an edition
- **Vercel Cron** — hourly; sends each user at **9:30 AM their timezone**

## Quick start

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Run the SQL in [`supabase/migrations/001_initial.sql`](supabase/migrations/001_initial.sql) and [`002_config_profiles.sql`](supabase/migrations/002_config_profiles.sql) in the SQL editor.
3. After deploy, run **Seed config** once from admin (see below).
3. Copy **Project URL**, **anon key**, and **service role key**.

### 2. Environment

```bash
cp .env.example .env.local
```

Fill in:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_APP_URL` | e.g. `http://localhost:4000` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key (optional for MVP) |
| `SUPABASE_SERVICE_ROLE_KEY` | Server writes |
| `RESEND_API_KEY` | Email delivery |
| `RESEND_FROM_EMAIL` | Verified sender in Resend |
| `OPENAI_API_KEY` | Edition generation |
| `CRON_SECRET` | Any random string (Vercel sets in prod) |
| `ADMIN_SECRET` | Protect admin routes |
| `ALERT_EMAIL` | Your email for cron failures |

For local testing without OpenAI cost:

```bash
USE_SAMPLE_EDITION=true
```

### 3. Run locally

```bash
npm install
npm run dev
```

- Landing: [http://localhost:4000](http://localhost:4000)
- Sample edition: [http://localhost:4000/edition/sample](http://localhost:4000/edition/sample)
- Admin: [http://localhost:4000/admin/preview?secret=YOUR_ADMIN_SECRET](http://localhost:4000/admin/preview?secret=YOUR_ADMIN_SECRET)
- **Edit all lenses/modules (founder only):** [http://localhost:4000/admin/config?secret=YOUR_ADMIN_SECRET](http://localhost:4000/admin/config?secret=YOUR_ADMIN_SECRET)
- Onboarding (after email confirm): `/onboarding?token=...`
- Personal edition: `/me/{token}/{date}`

### 4. Generate an edition manually

```bash
curl -X POST http://localhost:4000/api/admin/generate \
  -H "x-admin-secret: YOUR_ADMIN_SECRET"
```

Or use the button on the admin preview page.

### 5. Deploy to Vercel

1. Import the repo and add all env vars.
2. Vercel injects `CRON_SECRET` for cron routes automatically.
3. Cron runs daily per [`vercel.json`](vercel.json).

## Friend & family pilot (5–10 people)

1. Deploy with Resend + a verified domain (or Resend sandbox for testing).
2. Subscribe yourself and confirm via email.
3. Run one manual generate and verify email + `/edition/YYYY-MM-DD`.
4. Invite 5–10 friends—ask: *Which talking point would you actually use?*
5. Tune RSS sources in [`config/sources.ts`](config/sources.ts) if a section feels thin.
6. Skim the edition once a week before the group scales up.

## Project structure

```
app/              Pages & API routes
components/       UI
config/sources.ts RSS feed list (edit here)
lib/              RSS, LLM, email, edition logic
supabase/         SQL migration
```

## Legal note

Summaries are editorial. Always link to original sources. Include unsubscribe in every email. Start with volunteers before emailing extended family.
