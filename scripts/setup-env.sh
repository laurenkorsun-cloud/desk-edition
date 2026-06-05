#!/bin/bash
# Run: bash scripts/setup-env.sh
# Prompts for Supabase keys and writes .env.local

set -e
cd "$(dirname "$0")/.."

echo ""
echo "Desk Edition — env setup"
echo "Get keys from: https://supabase.com/dashboard → your project → Project Settings → API"
echo ""

read -p "Project URL (https://xxxxx.supabase.co): " SUPABASE_URL
read -p "anon key (eyJ...): " ANON_KEY
read -sp "service_role key (eyJ..., hidden): " SERVICE_KEY
echo ""

read -p "Your email for alerts (optional): " ALERT
ADMIN_SECRET=$(openssl rand -hex 16 2>/dev/null || echo "change-me-admin")
CRON_SECRET=$(openssl rand -hex 16 2>/dev/null || echo "change-me-cron")

cat > .env.local << EOF
NEXT_PUBLIC_APP_URL=http://localhost:4000

NEXT_PUBLIC_SUPABASE_URL=${SUPABASE_URL}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${ANON_KEY}
SUPABASE_SERVICE_ROLE_KEY=${SERVICE_KEY}

RESEND_API_KEY=
RESEND_FROM_EMAIL=Desk Edition <onboarding@resend.dev>
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4o-mini

CRON_SECRET=${CRON_SECRET}
ADMIN_SECRET=${ADMIN_SECRET}
ALERT_EMAIL=${ALERT}

USE_SAMPLE_EDITION=true
EOF

echo ""
echo "Created .env.local — run: npm run dev"
