# Fix “Service not configured” on Vercel

Your Supabase keys live in `.env.local` on your laptop. **Vercel does not read that file** — you must copy the same values into the Vercel project.

## Option A — One command (recommended)

In Terminal, from the project folder:

```bash
cd /Users/laurenkorsun/projects/desk-edition
npx vercel login
npm run env:sync-vercel
npx vercel --prod
```

`env:sync-vercel` copies every key from `.env.local` to Vercel (production + preview). When prompted, paste your public Vercel URL (e.g. `https://desk-edition-xxxx.vercel.app`) for `NEXT_PUBLIC_APP_URL`.

Verify:

```bash
curl -s https://YOUR-APP.vercel.app/api/health
```

You should see `"ok": true` and `"supabase": true`.

## Option B — Paste in Vercel dashboard

1. [vercel.com/dashboard](https://vercel.com/dashboard) → **desk-edition** → **Settings** → **Environment Variables**
2. Add each variable from your `.env.local` (copy values exactly):

| Name | Environments |
|------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Production, Preview, Development |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Production, Preview, Development |
| `SUPABASE_SERVICE_ROLE_KEY` | Production, Preview, Development |
| `NEXT_PUBLIC_APP_URL` | Production — your `https://….vercel.app` URL |
| `OPENAI_API_KEY` | Production |
| `ADMIN_SECRET` | Production |
| `CRON_SECRET` | Production |

3. **Deployments** → latest → **⋯** → **Redeploy**

## Option C — Supabase ↔ Vercel integration

1. Vercel project → **Integrations** → **Supabase**
2. Connect your Supabase project (auto-fills URL + anon + service role)
3. Still add `NEXT_PUBLIC_APP_URL`, `OPENAI_API_KEY`, `ADMIN_SECRET`, `CRON_SECRET` manually
4. Redeploy
