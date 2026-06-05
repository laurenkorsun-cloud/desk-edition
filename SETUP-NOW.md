# Do these 3 things (only you can) — ~5 minutes

Your app is running locally when `.env.local` has real Supabase keys.

**Testers on Vercel** see “Service not configured” until you sync env to Vercel:

```bash
npx vercel login && npm run env:sync-vercel && npx vercel --prod
```

See `docs/VERCEL-ENV.md` for manual steps.

## 1. Paste Supabase keys

1. Open https://supabase.com/dashboard → your project
2. **Project Settings** → **API**
3. Copy into `.env.local` (replace the PASTE_... lines):

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

4. Save the file

## 2. Restart the server

In Terminal:

```bash
cd /Users/laurenkorsun/projects/desk-edition
# Press Ctrl+C if dev is running, then:
npm run dev
```

## 3. Seed admin data (one curl)

New terminal tab:

```bash
curl -X POST "http://127.0.0.1:4000/api/admin/seed-config" \
  -H "x-admin-secret: local-dev-admin-secret"
```

---

## Test as a user

1. Open http://127.0.0.1:4000
2. Enter your email → **Get the briefing**
3. You should jump to **onboarding** (toggles + lenses)
4. Finish setup

**Skip email:** If step 2 fails, use Supabase → subscribers → copy `unsubscribe_token`:

http://127.0.0.1:4000/onboarding?token=PASTE_HERE
