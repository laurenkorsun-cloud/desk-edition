# Cron on Vercel Hobby

Vercel **Hobby** only allows cron jobs that run **once per day**. Desk Edition sends briefings at **9:30 AM in each user's timezone**, which requires checking **every hour**.

## Recommended fix (free): GitHub Actions

1. Remove hourly crons from `vercel.json` (already done in this repo).
2. Push the repo with `.github/workflows/send-due-editions.yml`.
3. On GitHub: **Settings → Secrets and variables → Actions → New repository secret**
   - `APP_URL` = `https://your-project.vercel.app`
   - `CRON_SECRET` = same secret as in Vercel environment variables
4. In Vercel, set `CRON_SECRET` to a long random string (if not already).
5. Actions tab → run **Send due Desk Edition briefings** once manually to test.

The workflow runs hourly and calls `/api/cron/send-due-editions` with `Authorization: Bearer CRON_SECRET`.

## Alternative: external cron (cron-job.org)

Create an hourly job:

- **URL:** `https://your-app.vercel.app/api/cron/send-due-editions`
- **Method:** GET
- **Header:** `Authorization: Bearer YOUR_CRON_SECRET`

## Alternative: Vercel Pro

Upgrade to Pro and restore hourly cron in `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/cron/send-due-editions",
      "schedule": "0 * * * *"
    }
  ]
}
```

## Alternative: once-daily only (not ideal)

If you only need one timezone (e.g. all testers in Eastern), you can use a single Vercel cron:

```json
{
  "crons": [
    {
      "path": "/api/cron/send-due-editions",
      "schedule": "30 14 * * *"
    }
  ]
}
```

`14:30 UTC` ≈ 9:30 AM US Eastern (standard time). Users in other US zones may get email at the wrong local time.

## Test manually

```bash
curl -s "https://your-app.vercel.app/api/cron/send-due-editions" \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```
