# Handover: AJ Training (read fully before doing anything)

You are taking over development of **AJ Training**, an all-in-one fitness, food and habits PWA built for AJ (Alexander Jones, smythjonesa@gmail.com). It is a product for anyone, not tailored to AJ, and every recommendation in it must be backed by research.

## How AJ wants you to work
- Be concise and direct. No em dashes anywhere (code comments, UI copy, messages). Admit mistakes plainly, without padding.
- Work **one feature at a time until it's perfect**. AJ found the earlier "fix everything at once" approach inefficient. He tests a screen, sends feedback, you fix only that, verify it, deploy, and report back briefly.
- Everything in the app must be **backed by science**. Check claims against real studies (search, don't guess) and record them in docs/EVIDENCE_NOTES.md and public/science.js. Say so honestly when there's no evidence (e.g. powerbuilding has no peer-reviewed definition).
- Photos and icons aren't designed yet. Use the existing placeholder classes (`.ph.ic`, `.ph.ic.sm`, `.ph.pic`) wherever a photo or icon belongs.
- No chip-style preset buttons for big choices; AJ hates them. Use cards with icon placeholders, dropdown sections, or search.
- Never show flicker or flashing. Setup flows update in place via `patchDeep`; keep it that way.
- AJ often tests on an iPhone (Home Screen PWA) and on desktop Chrome.

## Security rules
- Never type API keys, tokens or passwords into any field. AJ enters secrets himself.
- Supabase: AJ's data lives there. You may read AJ's own data to debug, but don't modify it without asking.

## Repo, hosting, deploy
- GitHub: `AJXAND/aj-training`, branch `main`. Live at https://ajtraining.quotientgroup.co.uk (GitHub Pages, custom domain in public/CNAME; ajxand.github.io/aj-training redirects there).
- Deploy = push to main. `.github/workflows/deploy.yml` runs `npm ci && npm run build` (Vite 5.4.11) and publishes `dist`.
- **Every deploy: bump `VERSION` in public/sw.js** (currently `"ajt-v25"`) or phones keep the old cached app. If you add a new file in public/, also add it to `SHELL` in public/sw.js.
- Commit messages end with the attribution lines from your session instructions.
- Backend: Supabase (auth, a `docs` table of `{user_id, path, col, data, deleted, updated_at}`, photo storage, edge functions for the Claude API). See supabase/ and scripts/setup-supabase.sh. The app gets its config from `config.js` (`window.AJ_CONFIG = {supabaseUrl, supabaseAnonKey, vapidPublicKey}`).

## Code map
- **index.html**: the main app, written as one classic script with CSS inline.
  - Global state is `S`; `render()` draws `#main`; `go(tab)` switches tabs.
  - Pages: renderHome, renderFood, renderFoodAdd, renderPlan, renderTrain/renderLive, renderProgress, renderCardio, renderSettings, renderHabits, renderEnergy.
  - Nav order: Today, Food (Habits takes this slot when Food is off), +, Train, Progress.
  - Calorie maths:
    - `targets(date)`: uses `AJGoal.targets` when there's a goal.
    - `expenditure()`: adaptive estimate from logged food and the weight trend, blended with `priorModel()`.
    - `priorModel()`: resting burn (Katch-McArdle) + job factor (`JOB`) + cycling commute + steps + lifting + cardio, divided by 0.9 for the thermic effect of food.
    - `dayActivity()`, `stepKcal()`, `liftKcal()`.
  - Progression: `advice()`, `incFor()`, `nextLoad()` (the next real dumbbell pair).
  - Boot:
    - `boot()` reads `state/active`, `state/bodyweight`, `meta/profile`, `programme/current` and `state/chat` once.
    - It then watches sessions, cardio, photosets, foods, habits and foodlog, plus onSnapshot listeners on `meta/profile`, `state/bodyweight` and `programme/current`.
    - `derive()` builds the S.* views from S.all and applies the sample-data filter.
- **public/onboard.js**: IIFE exposing `window.AJOnboard` and `window.AJGoal`.
  - Flows are `welcome`, `prog` (plan builder) and `nut` (nutrition goal). Flow state is `F`; drafts live in localStorage `ajlog2:obdraft:<kind>`.
  - `draw()` patches the DOM in place when the step hasn't changed; `liveRange` patches during slider drags.
  - Plan builder steps come from `psteps()` (it inserts a strengthType or raceType sub-step after "goal"; the old logic is in `psteps0()`). Goal families are `GFAM`; looks are `LOOKS` (each flagged research "ev" or convention "conv").
  - Days step: number of days plus "days you definitely can't train". `chooseDays()` spreads the days evenly and `recDays()` recommends a number.
  - Gyms: `EQG` (~130 pieces of equipment in 12 groups), `GYMTYPES` (8 gym types), `KIT_ALIAS`/`kitHas()`, `gymEditor()` (type cards, equipment dropdowns with search), `dbPicker()` (step2, step25, adjustable, or exact pairs from `DBW`).
  - Volume: `BASE_SETS` (10 to 14 sets per muscle) and `PRIORITY_SETS` 20, using fractional counting (Pelland 2026).
  - Nutrition: `GOALS`, `recRange()` and `goalTargets()`. With `dist:"training"`, training days get +8% and rest days get less.
  - Activity step: `JOB` cards, `STEPGUESS`, `CYCLE`, and an exact-steps option. Body fat is picked from photo ranges (`BFPICS`).
- **public/scanner.js**: barcode and nutrition-label scanner. It auto-captures only when the label is steady and sharp, reads in place via `window.readLabel`, and keeps the camera open to retry.
- **public/sports.js**: `window.AJSports`, 140 activities with 2024 Compendium METs. A `NEAR` list borrows the nearest Compendium entry and labels it "nearest".
- **public/science.js**: the evidence library (LIB).
- **public/platform.js**: recreates the db, assets, sample and downloads API on IndexedDB plus Supabase sync.
  - `sync()` uploads dirty docs, then pulls rows changed since lastPull minus 5 minutes.
  - On a device's first run it waits up to 15 s for the first pull.
  - Admin demo mode: localStorage `ajmode=demo` prefixes paths with `demo~/`. **AJ is currently in demo mode**, testing as a new user. His real account data is under the unprefixed paths.
- **docs/EVIDENCE_NOTES.md**: all the research decisions with DOIs. **FEEDBACK.md**: history of AJ's feedback and phase progress.

## Testing
- **Speed rule (AJ, 20 Oct):** before each push, run only the checks for the screen you touched (screenshots + its own test). Run the full suite once per finished section. Note pre-existing failures in one line and fix them at the end of the section; never stop mid-task to chase them.
- Playwright (Python) scripts are in tests/e2e (see its README).
  - Build, then serve: `cd dist && python3 -m http.server 8765`.
  - The scripts route config.js to `window.AJ_CONFIG={};`, so they run in local IndexedDB mode.
  - Output goes to /tmp/ajt/. Run `mkdir -p /tmp/ajt` first.
  - Run p1b, p2, `p3 muscle,aesthetic,power,crossfit,run,hyrox,tri,hybrid,custom`, p4, p5 and glitch after changes. All print `errors: []` or `[]` when clean.
  - lbl2 needs fake-camera .mjpeg clips (blank, handheld, cam, dark). Regenerate them with ffmpeg if you need that test.
- Check visual changes with screenshots at 390x844 and look at them.

## FIXED in v23: "kcal left" on Today flipped between 2,710 and 2,930 on refresh
Cause: `boot()` ran before `onboard.js` had loaded (it is the last script tag). On a fresh tab the data was ready first, so `targets()` found no `window.AJGoal` and fell back to the old phase formula, expenditure x 0.80 for a cut (3,660 x 0.8 = 2,928, shown as 2,930). Nothing re-rendered when onboard.js arrived. Fix: boot on DOMContentLoaded. Repro: delay onboard.js by 1.5 s in Playwright; before the fix 5/5 loads showed 2,930, after it 15/15 show 2,710.

### Original notes
Facts established so far:
- AJ's current (demo) profile: cut at 1%/week, `dist:"even"`, 86.4 kg (no weigh-ins, so it uses `fallbackKg`), body fat 14% (set manually).
  - Activity: job desk, 9,000 steps, commute 270 min/week.
  - Programme: 7-day PPL (7 training days, built 20 Oct before the new days logic).
  - `targets().kcal` = **2710**: expenditure 3,660 from the prior model (not adaptive, because no food is logged). 3,660 minus about 950 for the 1%/week deficit gives 2,710.
- **2,930 = 2,710 + 220**, which is exactly the +8% training-day shift in `goalTargets()`. But every stored copy of the profile has `dist:"even"`: local IndexedDB, the Supabase server, and both the demo and real paths. So the cause is unproven.
- Reproduction: in desktop Chrome, **opening the app in a brand-new tab** reliably shows 2,930 in the ring. Reloading an existing tab shows 2,710. In the 2,930 tab, calling `targets()` from the console returns 2,710 and calling `render()` fixes the ring.
  - So the ring was drawn from a different state, and no render happened after the state changed.
- Brute-forcing every mix of real/demo/default profile, programme and data gave 3810, 3850, 3920, 3960, 2600, 2710, 2810, 2910, 3190 and 3300. **Never 2930.**
- Already shipped in v22, but **NOT the fix**:
  - `render()` shows a loading skeleton until `S.ready`. Before this, the pre-data render with `DEFAULT_PROFILE` (2,910) could show when the splash fallback lifted at 3.5 s.
  - Added onSnapshot listeners for `meta/profile` and `state/bodyweight`.
  - Next step was to record every input to `targets()` every 10 ms from the start of a fresh-tab load, to catch which input flips. Suspects to rule in or out:
    - a code path that calls `goalTargets` with `dist` treated as training
    - `S.profile` swapped or mutated briefly (onboard flows mutate `S.profile.activity` during previews; `nutrition()` sets it from a draft)
    - a different code version served by the old service worker on a fresh tab
    - `targets()` being called with a date
    - `F` or flow state leaking
  - Consider adding a debug flag (e.g. localStorage `ajdebug`) that logs each render's target inputs, since you can't inject code before boot.
- Also consider: a day's calorie target should arguably be locked once per day so it never changes on refresh. Raise this with AJ rather than deciding alone.
- AJ is (rightly) angry about this one. Fix it properly, verify on a fresh-tab load several times, deploy, and tell him exactly what the cause was.

## Session of 20 Oct (late): where things stand
- v23: kcal bug fixed (cause above). v24: welcome "What do you want to use?" is now Training / Food and weight / Both; habits always on (`on("habits")` is always true); `USES`, `modsFor()`, `useOf()`, `useCards()` in index.html; Settings > App uses the same cards (`setUse`). Icons were grey because `.obopt span{color:muted}` beat `.obmi`; fixed with `.obopt .obmi{color:#fff}`.
- v25: no back button on the first welcome screen (it closed the flow to the dashboard).
- AJ approved the Welcome screen as is. We're going screen by screen from first launch; next is About you, then the dashboard.
- Open question for AJ: with "Food and weight" only, keep the Train tab (sport logging feeds calorie burn) or hide it?
- Known broken test: tests/e2e/dark.py clicks `[data-set=gtype][data-val=muscle]`, which no longer exists (goal is now `[data-gfam=...]`). Broken before v24.
- Local setup: `pip install playwright==1.56.0` (matches the preinstalled Chromium 1194). Serve with `python3 -m http.server 8765 --directory dist` so rebuilds don't kill the server.

## After the bug: the one-feature-at-a-time process
Agreed order:
1. **Plan builder**, screen by screen from "What are you training for" through to review.
2. **Live workout.**
3. **Food logging**: search, barcode, label reader, photo AI.
4. **Today page.**
5. **Progress and habits.**

AJ's own plan is the old 7-day PPL with no rest day. Once the builder is right, he should rebuild it. Start by asking him for his feedback on the first plan-builder screen.

## Known limitations to keep explaining honestly
- **iOS camera permission:** a Home Screen PWA forgets camera permission when it's closed, so it asks once per launch (WebKit bug 327237). To avoid this, use a Safari tab with the per-site Camera setting on Allow. The app never calls getUserMedia twice in one launch.
- **Evidence summary:**
  - Cut 0.5 to 1.0%/week, or 0.5% or less when lean (men under about 12% body fat, women under about 22%).
  - Bulk 0.25%/week if trained, 0.5% for beginners.
  - Volume 10 to 14 fractional sets per muscle per week, about 20 for priority muscles, capped at 25.
  - Frequency at least twice a week per muscle. Never 7 training days, always at least 1 rest day.
  - Full sources and DOIs are in docs/EVIDENCE_NOTES.md.

## Parked (come back to these)
- **Progress page: full redesign plus a weekly coach check-in (AJ's idea, Oct 2026).** Once a week the user is prompted to go to Progress and check in with their coach on whatever they're signed up for (weight, food, training). The main one is food: review the weight trend against the goal, average intake and the updated expenditure, then propose adjusted calories and macros for the user to accept or tweak.
- **Food icons:** every food gets an icon based on what it is. Big job, do with the exercise visuals.
- **Exercise and machine visuals:** AI stand-ins (one consistent figure, start and end frames, machines in the same style, muscle map) until the launch influencer films them.
- **Black status bar on iPhone:** AJ's phone is in Dark Mode while the app is set to Light; iOS colours the bar from the phone's mode, so it shows black. Fix idea: follow the phone's mode by default, and/or draw the page behind the bar (black-translucent) when the app theme matches the phone.
- **New-user dashboard** (see docs/parked-dashboard-notes.png): setup steps duplicated by the "shows here" cards; insights show made-up numbers on day one (15% body fat default, "Maintenance" with no goal, "0 ready", "Cardio 0"); "Welcome, Sam" toast covers the food card. Suggested: day one shows setup steps + weight card only.
- One thing at a time in replies: AJ found long multi-point replies too much.
