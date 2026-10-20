# AJ Training

AJ's training, nutrition, cardio, habits and body tracker with a Claude coach. Installs to the iPhone Home Screen as an app, works offline, and syncs through Supabase.

## What's in here

| Path | What it is |
|---|---|
| `index.html` | The app (screens, logic, styles) |
| `public/platform.js` | Storage and sync (IndexedDB offline, Supabase online), sign-in, photos, Claude calls, push, Apple Health, import |
| `public/scanner.js` | Live barcode and nutrition-label scanners |
| `public/sw.js` | Offline caching and push notifications |
| `public/config.js` | Supabase URL, anon key and push public key (fill in once) |
| `public/foods-db.json` | 7,233 foods from USDA FoodData Central (public domain) via the TempoLife dataset (CC-BY-4.0) |
| `supabase/migrations/0001_init.sql` | Tables, security rules and the private photo bucket |
| `supabase/functions/claude` | Sends coach, label and body-fat requests to the Claude API. The key stays on the server |
| `supabase/functions/weighin-push` | Morning weigh-in notification, at each device's chosen time |
| `supabase/functions/health-steps` | Receives Apple Health steps from an iPhone Shortcut |
| `supabase/cron.sql` | Runs the reminder check every 5 minutes |
| `scripts/setup-supabase.sh` | One-shot backend setup |

Without `config.js` filled in, the app runs fully on the device (no sync, no Claude features).

## Setup

1. **Supabase**: create a project (region: London). Note the project ref and anon key. Create an access token at supabase.com/dashboard/account/tokens.
2. **Claude API key**: console.anthropic.com, create a key, and set a monthly spend limit.
3. **Backend**: run
   `SUPABASE_ACCESS_TOKEN=… PROJECT_REF=… ANTHROPIC_API_KEY=… OWNER_EMAIL=… bash scripts/setup-supabase.sh`
   then put the printed values in `public/config.js`.
4. **Auth settings** (Supabase dashboard, Authentication): after creating your account in the app, turn off new sign-ups.
5. **Hosting**: push this repo to GitHub and connect it to a static host (build `npm run build`, output `dist`). Add a CNAME for `ajtraining.quotientgroup.co.uk` pointing at the host.
6. **Phone**: open the site in Safari, Share, Add to Home Screen. Open it from the Home Screen, sign in, then Settings: turn on Notifications, set up Apple Health steps, and import the export from the Claude version.

## Data model

Everything is a JSON document at a path, the same as the Claude version, so exports move across unchanged:
`meta/profile`, `programme/current`, `state/bodyweight`, `state/active`, `state/chat`, `sessions/<id>`, `cardio/<id>`, `foods/<id>`, `foodlog/<date>`, `habits/<date>`, `photosets/<id>`. Photos live in the private `photos` bucket under `<user id>/<photo id>`.
