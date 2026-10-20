# Walkthrough feedback log

Recorded during the step-by-step review. Nothing here is fixed yet; we work through the list after the full walkthrough.

## Stop 1: Launch and first-time setup

1. **Section cards look greyed out** on "What do you want to use?" (unselected state is too faded; should look clearly tappable).
2. **Status bar area is black** above the page. It should match the page: fully white in light theme, fully black in dark theme, on every screen.
3. **Body shouldn't be a separate section.** Weight tracking goes hand in hand with food, so it belongs with Nutrition rather than being its own option.
4. **About you design needs work.** Labels/subtitles use inconsistent weights (e.g. "Sex (for energy…)" is dark and large, "First name" / "Date of birth" are grey and small, "Height"/"Weight" are bold headings), and the vertical spacing is uneven.
5. **Date of birth should be typed**, in day/month/year format with an example placeholder (e.g. 01/04/1999), not a date picker.
6. **Height: type it as well as slide, and choose cm or ft/in.**
7. **Height conversion bug:** shows "5 ft 12 in" instead of rolling over to 6 ft 0 in.
8. **Weight: type it as well as slide, choose kg, lb or st/lb, and the range should go up to 200 kg.**
9. **"You're set" cards also look greyed out** (same issue as item 1).
10. **No password reset on the sign-in screen.** ✅ Done straight away (AJ needed it): "Forgot password?" on sign-in (emails a link that opens a set-new-password screen) and "Change password" in Settings → Account.

## Stop 2: Dashboard

11. **Setup prompts are split up**: two setup cards, then the "Today / Rest day" card, then the third setup card. All setup prompts should sit together at the top.
12. **Sections below should show a clear "not set up yet" state** (workout, nutrition, etc.) instead of empty/placeholder content, designed better than a plain "pending" label.
13. **Dashboard layout needs a rethink**: it should be the most useful screen in the app, with real overviews and one-tap quick links to most things.
14. **Food logger redesign** (inspo: MacroFactor's logger, attached): tabs for Scan / Search / AI / Quick add / Library, favourites row, recent foods with one-tap +, running calorie total, log several foods at once. Must look and work distinctly ours, not a copy.
15. **+ menu is decent; make it better.**
16. **Remove every mention of "Claude"** in the app; call it **"AJ Training AI"** for now (to be renamed with the app).
17. **App name needed**: all-in-one life improvement app, propeller logo (for now), main audience gym-goers using it mostly for workouts and food.

Spotted by me during this stop (to check):
- The + menu still says "Habits: Wake time, steps, snus" (AJ-specific).
- Demo shows **1,590 kcal maintenance** for a 75 kg, 175 cm male, which looks far too low; check the starting expenditure for brand-new users.
- Morning weigh-in banner text says "from AJ Training" (will follow the rename).
