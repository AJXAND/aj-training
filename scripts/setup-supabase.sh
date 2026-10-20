#!/usr/bin/env bash
# One-time backend setup. Needs: Supabase CLI (npx supabase), a Supabase access token, your project ref,
# an Anthropic API key and your email. Run from the repo root:
#   SUPABASE_ACCESS_TOKEN=... PROJECT_REF=... ANTHROPIC_API_KEY=... OWNER_EMAIL=you@example.com bash scripts/setup-supabase.sh
set -euo pipefail
: "${SUPABASE_ACCESS_TOKEN:?}" "${PROJECT_REF:?}" "${ANTHROPIC_API_KEY:?}" "${OWNER_EMAIL:?}"
SB="npx -y supabase@2"

$SB link --project-ref "$PROJECT_REF"
$SB db push                                   # tables, security rules, photo bucket

KEYS=$(npx -y web-push@3.6.7 generate-vapid-keys --json)
VAPID_PUBLIC=$(echo "$KEYS" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>console.log(JSON.parse(s).publicKey))')
VAPID_PRIVATE=$(echo "$KEYS" | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>console.log(JSON.parse(s).privateKey))')
CRON_SECRET=$(node -e 'console.log(require("crypto").randomBytes(24).toString("hex"))')

$SB secrets set ANTHROPIC_API_KEY="$ANTHROPIC_API_KEY" ALLOWED_EMAILS="$OWNER_EMAIL" \
  VAPID_PUBLIC_KEY="$VAPID_PUBLIC" VAPID_PRIVATE_KEY="$VAPID_PRIVATE" VAPID_SUBJECT="mailto:$OWNER_EMAIL" CRON_SECRET="$CRON_SECRET"
$SB functions deploy claude
$SB functions deploy weighin-push --no-verify-jwt
$SB functions deploy health-steps --no-verify-jwt

sed -e "s/PROJECT_REF/$PROJECT_REF/" -e "s/CRON_SECRET/$CRON_SECRET/" supabase/cron.sql > /tmp/ajt-cron.sql
$SB db execute --file /tmp/ajt-cron.sql 2>/dev/null || echo ">> Paste /tmp/ajt-cron.sql into the Supabase SQL editor and run it."

echo
echo "Put these in public/config.js:"
echo "  supabaseUrl: \"https://$PROJECT_REF.supabase.co\""
echo "  supabaseAnonKey: (Project Settings > API > anon public)"
echo "  vapidPublicKey: \"$VAPID_PUBLIC\""
